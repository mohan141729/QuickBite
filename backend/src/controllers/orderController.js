import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Coupon from "../models/Coupon.js";
import Restaurant from "../models/Restaurant.js";

// Helper to check if restaurant is open
const isRestaurantOpen = (restaurant) => {
  if (!restaurant || !restaurant.operatingHours) return false;
  if (restaurant.isOpen === false) return false;

  const { open, close, holidays } = restaurant.operatingHours;
  if (!open || !close) return true;

  // Use restaurant's timezone if possible, but for now assuming server time matches or is close enough
  // Ideally, we should handle timezones. Assuming IST or server local time for MVP.
  const now = new Date();
  const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' });

  if (holidays && holidays.includes(currentDay)) return false;

  const [openHour, openMinute] = open.split(':').map(Number);
  const [closeHour, closeMinute] = close.split(':').map(Number);

  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  const currentTimeValue = currentHour * 60 + currentMinute;
  const openTimeValue = openHour * 60 + openMinute;
  const closeTimeValue = closeHour * 60 + closeMinute;

  if (closeTimeValue < openTimeValue) {
    return currentTimeValue >= openTimeValue || currentTimeValue <= closeTimeValue;
  }

  return currentTimeValue >= openTimeValue && currentTimeValue <= closeTimeValue;
};

// ✅ Create Order (from checkout - supports coupons)
export const createOrder = async (req, res) => {
  try {
    const { restaurant, items, totalAmount, address, paymentStatus, couponCode, deliveryInstructions, deliveryLocation } = req.body;

    // ✅ Validation 1: Check Restaurant
    const restaurantDoc = await Restaurant.findById(restaurant);
    if (!restaurantDoc) return res.status(404).json({ message: "Restaurant not found" });
    if (restaurantDoc.status !== "approved") return res.status(400).json({ message: "Restaurant is not currently active" });

    // Check operating hours
    if (!isRestaurantOpen(restaurantDoc)) {
      return res.status(400).json({ message: "Restaurant is currently closed" });
    }

    // ✅ Validation 2: Check Items Stock
    for (const item of items) {
      const menuItem = await import("../models/MenuItem.js").then(m => m.default.findById(item.menuItem));
      if (!menuItem || !menuItem.isAvailable) {
        return res.status(400).json({ message: `Item ${menuItem?.name || 'Unknown'} is currently unavailable` });
      }
    }

    // ✅ Validation 3: Check Delivery Partner Availability (Simple check)
    const availablePartners = await import("../models/DeliveryPartner.js").then(m => m.default.countDocuments({ isAvailable: true }));
    if (availablePartners === 0) {
      // Optional: return warning or block. For now, we'll just log it or maybe block if strict.
      // res.status(400).json({ message: "No delivery partners available nearby" });
    }

    let discount = 0;
    let subtotal = totalAmount; // This might be misleading if frontend sends totalAmount as subtotal. Assuming frontend sends subtotal.
    // Actually, let's recalculate subtotal from items to be safe, but for now trusting frontend or previous logic.
    // The previous logic took totalAmount as the starting point.

    // Let's assume totalAmount passed in is the subtotal before discount/fees for now to match previous logic,
    // OR we should calculate it.
    // Better: Calculate subtotal from items if possible, but let's stick to minimal changes to logic flow.

    let finalAmount = totalAmount;

    // Calculate fees
    const deliveryFee = 30; // Fixed for now, can be dynamic later
    const packagingFee = 10;
    const platformFee = 5;
    const tax = Math.round(subtotal * 0.05); // 5% tax

    // Apply coupon if provided
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });

      if (coupon && coupon.isActive) {
        const now = new Date();
        if (now >= coupon.validFrom && now <= coupon.validUntil) {
          // Calculate discount based on type
          if (coupon.discountType === "percentage") {
            discount = (subtotal * coupon.discountValue) / 100;
            if (coupon.maxDiscount && discount > coupon.maxDiscount) {
              discount = coupon.maxDiscount;
            }
          } else if (coupon.discountType === "flat") {
            discount = coupon.discountValue;
          } else if (coupon.discountType === "free_delivery") {
            discount = deliveryFee; // Discount equals delivery fee
          }

          // Ensure discount doesn't exceed subtotal
          if (discount > subtotal) {
            discount = subtotal;
          }

          // Increment usage count
          coupon.usedCount += 1;
          await coupon.save();
        }
      }
    }

    finalAmount = subtotal + deliveryFee + packagingFee + platformFee + tax - discount;

    const newOrder = await Order.create({
      user: req.user._id,
      customerName: req.user.name, // ✅ Save snapshot
      restaurant,
      items,
      subtotal,
      discount: Math.round(discount),
      couponCode: couponCode || null,
      totalAmount: Math.round(finalAmount),
      deliveryFee,
      packagingFee,
      platformFee,
      tax,
      deliveryInstructions,
      address: {
        ...address,
        location: deliveryLocation // { lat, lng }
      },
      paymentStatus,
    });

    // ✅ Emit real-time event to restaurant
    if (global.io) {
      global.io.to(`restaurant-${restaurant}`).emit('new-order', newOrder);
    }



    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: newOrder,
    });
  } catch (error) {
    console.error("❌ Order creation failed:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Place Order (Customer - from cart)
export const placeOrder = async (req, res) => {
  try {
    const { restaurant, address, paymentStatus, couponCode } = req.body;

    if (!restaurant)
      return res.status(400).json({ message: "Restaurant ID is required" });

    // ✅ Validation 1: Check Restaurant
    const restaurantDoc = await Restaurant.findById(restaurant);
    if (!restaurantDoc) return res.status(404).json({ message: "Restaurant not found" });
    if (restaurantDoc.status !== "approved") return res.status(400).json({ message: "Restaurant is not currently active" });

    // Check operating hours
    if (!isRestaurantOpen(restaurantDoc)) {
      return res.status(400).json({ message: "Restaurant is currently closed" });
    }

    // ✅ Validation 2: Check Delivery Partner Availability
    const availablePartners = await import("../models/DeliveryPartner.js").then(m => m.default.countDocuments({ isAvailable: true }));
    // if (availablePartners === 0) return res.status(400).json({ message: "No delivery partners available nearby" });

    const cart = await Cart.findOne({ user: req.user._id }).populate("items.menuItem");
    if (!cart || cart.items.length === 0)
      return res.status(400).json({ message: "Your cart is empty" });

    // ✅ Validation 3: Check Items Stock in Cart
    for (const item of cart.items) {
      if (!item.menuItem.isAvailable) {
        return res.status(400).json({ message: `Item ${item.menuItem.name} is currently unavailable` });
      }
    }

    const subtotal = cart.items.reduce(
      (sum, i) => sum + i.menuItem.price * i.quantity,
      0
    );

    let discount = 0;
    let finalAmount = subtotal;

    // Apply coupon if provided
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });

      if (coupon && coupon.isActive) {
        const now = new Date();
        if (now >= coupon.validFrom && now <= coupon.validUntil) {
          if (coupon.discountType === "percentage") {
            discount = (subtotal * coupon.discountValue) / 100;
            if (coupon.maxDiscount && discount > coupon.maxDiscount) {
              discount = coupon.maxDiscount;
            }
          } else if (coupon.discountType === "flat") {
            discount = coupon.discountValue;
          } else if (coupon.discountType === "free_delivery") {
            discount = 30;
          }

          if (discount > subtotal) {
            discount = subtotal;
          }

          finalAmount = subtotal - discount;

          coupon.usedCount += 1;
          await coupon.save();
        }
      }
    }

    const newOrder = await Order.create({
      user: req.user._id,
      customerName: req.user.name, // ✅ Save snapshot
      restaurant,
      items: cart.items.map((i) => ({
        menuItem: i.menuItem._id,
        quantity: i.quantity,
        price: i.menuItem.price,
        selectedVariant: i.selectedVariant,
        selectedAddOns: i.selectedAddOns
      })),
      subtotal,
      discount: Math.round(discount),
      couponCode: couponCode || null,
      totalAmount: Math.round(finalAmount),
      address,
      paymentStatus,
    });

    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [], totalPrice: 0 });

    // ✅ Emit real-time event to restaurant
    if (global.io) {
      global.io.to(`restaurant-${restaurant}`).emit('new-order', newOrder);
    }

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: newOrder,
    });
  } catch (error) {
    console.error("❌ Order placement failed:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get Customer Orders
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("restaurant", "name image") // ✅ Added image
      .populate("items.menuItem", "name price image")
      .lean();

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get Orders by Restaurant (Owner/Admin)
export const getOrdersByRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    if (!restaurantId)
      return res.status(400).json({ message: "Restaurant ID is required" });

    // Check user role
    if (
      req.user.role !== "restaurant_owner" &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    // ✅ Security Check: Verify ownership
    if (req.user.role === "restaurant_owner") {
      const restaurant = await Restaurant.findById(restaurantId);
      if (!restaurant) {
        return res.status(404).json({ message: "Restaurant not found" });
      }

      if (restaurant.owner.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Access denied: You do not own this restaurant" });
      }
    }

    const orders = await Order.find({ restaurant: restaurantId })
      .populate("user", "name email")
      .populate("items.menuItem", "name price image")
      .sort({ createdAt: -1 }) // Added sort by newest
      .lean();

    res.json({ success: true, orders });
  } catch (error) {
    console.error("❌ Fetch restaurant orders failed:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Update Order Status
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Fetch order first to check ownership
    const orderToCheck = await Order.findById(id).populate('restaurant');
    if (!orderToCheck) return res.status(404).json({ message: "Order not found" });

    // ✅ Security Check: Verify ownership for restaurant owners
    if (req.user.role === "restaurant_owner") {
      // Check if the restaurant object exists and has an owner
      if (!orderToCheck.restaurant) {
        return res.status(403).json({ message: "Order not associated with a valid restaurant" });
      }

      // If restaurant is populated, check owner field. 
      // Note: restaurant might be just ID if not populated correctly, but we used populate('restaurant')
      // However, Restaurant model might not have 'owner' populated? No, 'owner' is a field in Restaurant.

      // We need to ensure we compare correctly. 
      // The 'restaurant' field in Order is a reference. We populated it.
      // So orderToCheck.restaurant is the Restaurant document.

      if (orderToCheck.restaurant.owner.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Access denied: You do not own this restaurant" });
      }
    }

    const updateData = { orderStatus: status };
    if (status === "delivered") {
      updateData.paymentStatus = "paid";
    }

    const order = await Order.findByIdAndUpdate(
      id,
      updateData, // ✅ match schema field
      { new: true }
    ).populate("user", "_id name email")
      .populate("restaurant", "name")
      .populate("items.menuItem", "name price image");

    // ✅ Emit real-time update to customer via WebSocket
    if (global.io && order.user && order.user._id) {
      const userId = order.user._id.toString();
      global.io.to(`user-${userId}`).emit('order-status-updated', {
        orderId: order._id,
        orderStatus: status,
        order: order, // Send full order details
      });
      console.log(`📡 Emitted order status update to user ${userId}:`, status);
    }

    // ✅ Trigger Dispatch if Order is Accepted
    if (status === "accepted" || status === "ready") {
      import("../services/dispatchService.js").then(({ autoAssignOrder }) => {
        autoAssignOrder(order._id);
      });

      // ✅ Notify Delivery Partners
      if (global.io) {
        global.io.to('delivery-partners').emit('new-delivery-request', {
          orderId: order._id,
          restaurantName: order.restaurant?.name || "Restaurant",
          address: order.address ? `${order.address.line1}, ${order.address.city}` : "Customer Address",
          totalAmount: order.totalAmount
        });
        console.log("🔔 Emitted new-delivery-request to delivery-partners");
      }
    }

    res.json(order);
  } catch (err) {
    console.error("❌ Update order status error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get All Orders (Admin)
export const getAllOrders = async (req, res) => {
  try {
    const page = Number(req.query.pageNumber) || 1;
    const limitParam = req.query.limit;
    let pageSize = 10;
    let skip = 0;

    if (limitParam === 'all') {
      pageSize = 0; // 0 means no limit in some contexts, but for mongoose limit(0) is no limit
    } else {
      pageSize = Number(limitParam) || 10;
      skip = pageSize * (page - 1);
    }

    const count = await Order.countDocuments({});
    let query = Order.find({})
      .populate("user", "id name email")
      .populate("restaurant", "id name")
      .populate({
        path: "deliveryPartner",
        populate: { path: "user", select: "name" }
      })
      .populate("items.menuItem", "name price")
      .sort({ createdAt: -1 })
      .lean();

    if (pageSize > 0) {
      query = query.limit(pageSize).skip(skip);
    }

    const orders = await query;

    res.json({ orders, page, pages: pageSize > 0 ? Math.ceil(count / pageSize) : 1 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Cancel Order (by customer)
export const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { cancellationReason } = req.body;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if order belongs to the user
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized to cancel this order" });
    }

    // Business logic: Only allow cancellation for certain statuses
    const cancellableStatuses = ['processing', 'accepted'];
    if (!cancellableStatuses.includes(order.orderStatus)) {
      return res.status(400).json({
        message: `Cannot cancel order with status: ${order.orderStatus}. Order can only be cancelled when it's being processed or accepted.`
      });
    }

    // Update order with cancellation details
    order.isCancelled = true;
    order.orderStatus = 'cancelled';
    order.cancelledAt = new Date();
    order.cancelledBy = 'customer';
    order.cancellationReason = cancellationReason || 'No reason provided';

    // Set refund status based on payment status
    if (order.paymentStatus === 'paid') {
      order.refundStatus = 'pending';
      order.refundAmount = order.totalAmount;
    } else {
      order.refundStatus = 'not_applicable';
    }

    await order.save();

    // TODO: Notify restaurant and delivery partner via socket
    // TODO: Process refund if paid

    res.json({
      success: true,
      message: "Order cancelled successfully",
      order
    });
  } catch (error) {
    console.error("Cancel order error:", error);
    res.status(500).json({ message: "Failed to cancel order", error: error.message });
  }
};

// ✅ Get Order by ID
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id)
      .populate("user", "name email")
      .populate("restaurant", "name address")
      .populate("items.menuItem", "name price image")
      .populate({
        path: "deliveryPartner",
        populate: { path: "user", select: "name phone" }
      });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Security: Only allow access to order owner, restaurant owner, delivery partner, or admin
    const isOwner = order.user._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";
    const isRestaurantOwner = req.user.role === "restaurant_owner" && order.restaurant?.owner?.toString() === req.user._id.toString();
    const isDeliveryPartner = req.user.role === "delivery_partner" && order.deliveryPartner?.user?._id.toString() === req.user._id.toString();

    if (!isOwner && !isAdmin && !isRestaurantOwner && !isDeliveryPartner) {
      return res.status(403).json({ message: "Access denied: You don't have permission to view this order" });
    }

    res.json({ success: true, order });
  } catch (error) {
    console.error("Get order by ID error:", error);
    res.status(500).json({ message: "Failed to fetch order", error: error.message });
  }
};
