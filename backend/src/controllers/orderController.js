import Order from "../models/Order.js"
import Cart from "../models/Cart.js"

// ✅ Place Order (Customer)
export const placeOrder = async (req, res) => {
  try {
    const { restaurant, address, paymentStatus } = req.body

    if (!restaurant)
      return res.status(400).json({ message: "Restaurant ID is required" })

    const cart = await Cart.findOne({ user: req.user._id }).populate("items.menuItem")
    if (!cart || cart.items.length === 0)
      return res.status(400).json({ message: "Your cart is empty" })

    const totalAmount = cart.items.reduce(
      (sum, i) => sum + i.menuItem.price * i.quantity,
      0
    )

    const newOrder = await Order.create({
      user: req.user._id,
      restaurant,
      items: cart.items.map((i) => ({
        menuItem: i.menuItem._id,
        quantity: i.quantity,
        price: i.menuItem.price,
      })),
      totalAmount,
      address,
      paymentStatus,
    })

    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [], totalPrice: 0 })

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: newOrder,
    })
  } catch (error) {
    console.error("❌ Order placement failed:", error)
    res.status(500).json({ success: false, message: error.message })
  }
}

// ✅ Get Customer Orders
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("restaurant", "name")
      .populate("items.menuItem", "name price image")

    res.json(orders)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ✅ Get Orders by Restaurant (Owner/Admin)
export const getOrdersByRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params
    if (!restaurantId)
      return res.status(400).json({ message: "Restaurant ID is required" })

    // Check user role
    if (
      req.user.role !== "restaurant_owner" &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Access denied" })
    }

    const orders = await Order.find({ restaurant: restaurantId })
      .populate("user", "name email")
      .populate("items.menuItem", "name price image")

    res.json({ success: true, orders })
  } catch (error) {
    console.error("❌ Fetch restaurant orders failed:", error)
    res.status(500).json({ success: false, message: error.message })
  }
}

// ✅ Update Order Status
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body

    const order = await Order.findByIdAndUpdate(
      id,
      { orderStatus: status }, // ✅ match schema field
      { new: true }
    ).populate("user", "_id name email")
      .populate("restaurant", "name")
      .populate("items.menuItem", "name price image")

    if (!order) return res.status(404).json({ message: "Order not found" })

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

    res.json(order)
  } catch (err) {
    console.error("❌ Update order status error:", err)
    res.status(500).json({ message: "Server error" })
  }
}

// ✅ Get All Orders (Admin)
export const getAllOrders = async (req, res) => {
  try {
    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;

    const count = await Order.countDocuments({});
    const orders = await Order.find({})
      .populate("user", "id name email")
      .populate("restaurant", "id name")
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort({ createdAt: -1 });

    res.json({ orders, page, pages: Math.ceil(count / pageSize) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

