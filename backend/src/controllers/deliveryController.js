import DeliveryPartner from "../models/DeliveryPartner.js"
import Order from "../models/Order.js"
import User from "../models/User.js"

// ✅ GET /api/delivery/profile
export const getPartnerProfile = async (req, res) => {
  try {
    const partnerId = req.user._id // assuming JWT middleware sets req.user
    let partner = await DeliveryPartner.findOne({ user: partnerId }).populate("user", "name email")

    // ✅ Self-healing
    if (!partner) {
      const newPartner = await DeliveryPartner.create({
        user: partnerId,
        status: 'approved',
        isAvailable: true,
        currentLocation: { type: 'Point', coordinates: [0, 0] }
      });
      // Re-fetch to populate user
      partner = await DeliveryPartner.findById(newPartner._id).populate("user", "name email");
    }

    // Compute additional stats
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todaysOrders = await Order.find({
      orderStatus: "delivered",
      updatedAt: { $gte: today },
    })

    const todayEarnings = todaysOrders.length * 40 // ₹40 per delivery (example)
    const rating = 4.7 // static or computed via reviews

    res.status(200).json({
      partner: {
        ...partner.toObject(),
        todayEarnings,
        totalEarnings: partner.earnings,
        completedDeliveries: partner.totalDeliveries,
        rating,
      },
    })
  } catch (error) {
    console.error("Error in getPartnerProfile:", error.message)
    res.status(500).json({ message: "Server error" })
  }
}

// ✅ PUT /api/delivery/profile
export const updatePartnerProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, phone, address } = req.body;

    // Update User model
    const user = await User.findByIdAndUpdate(
      userId,
      { name, phone, address }, // Assuming User model has these fields
      { new: true }
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    // Also ensure DeliveryPartner exists
    const partner = await DeliveryPartner.findOne({ user: userId });
    if (!partner) return res.status(404).json({ message: "Delivery Partner profile not found" });

    res.json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ GET /api/delivery/orders
export const getAssignedOrders = async (req, res) => {
  console.log("📥 getAssignedOrders called");
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const partnerId = req.user._id
    let partner = await DeliveryPartner.findOne({ user: partnerId })

    // ✅ Self-healing: Create partner profile if missing but user has role
    if (!partner) {
      console.log(`⚠️ Partner profile missing for user ${partnerId}, creating now...`);
      partner = await DeliveryPartner.create({
        user: partnerId,
        status: 'approved',
        isAvailable: true,
        currentLocation: { type: 'Point', coordinates: [0, 0] }
      });
    }

    // Fetch orders:
    // 1. "preparing" or "ready" orders (available for everyone to see/accept)
    // 2. "on_the_way" or "out-for-delivery" orders assigned to THIS partner
    const orders = await Order.find({
      $or: [
        { orderStatus: { $in: ["accepted", "preparing", "ready"] } },
        {
          orderStatus: { $in: ["on_the_way", "out-for-delivery", "picked_up"] },
          deliveryPartner: partner._id
        }
      ]
    })
      .populate("restaurant", "name")
      .populate("user", "name")
      .sort({ updatedAt: -1 });

    // format for frontend
    const formatted = orders.map((order) => {
      try {
        // Check if this order is already assigned to someone else
        if (order.deliveryPartner && order.deliveryPartner.toString() !== partner._id.toString()) {
          return null; // Don't show orders assigned to others
        }

        return {
          _id: order._id,
          restaurantName: order.restaurant?.name || "Unknown",
          customerName: order.user?.name || "Customer",
          status: order.orderStatus ? order.orderStatus.replace(/-/g, "_") : "unknown",
          address: order.address ? `${order.address.line1}, ${order.address.city}` : "Unknown Address",
          totalAmount: order.totalAmount,
          orderStatus: order.orderStatus, // Keep original status for logic
          deliveryPartner: order.deliveryPartner // To check if assigned to me
        };
      } catch (mapError) {
        console.error("❌ Error mapping order:", order._id, mapError);
        return null;
      }
    }).filter(Boolean);

    res.status(200).json({ orders: formatted })
  } catch (error) {
    console.error("❌ Error in getAssignedOrders:", error);
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// ✅ PUT /api/delivery/accept/:orderId
export const acceptOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const partnerId = req.user._id;

    const partner = await DeliveryPartner.findOne({ user: partnerId });
    if (!partner) return res.status(404).json({ message: "Delivery Partner not found" });

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.deliveryPartner) {
      return res.status(400).json({ message: "Order already accepted by another partner" });
    }

    // Assign partner
    order.deliveryPartner = partner._id;

    // If order is already ready, we can mark it as 'accepted' or keep it 'ready' but assigned
    // If it's preparing, we keep it preparing.
    // We don't change status to 'on_the_way' yet. That happens on pickup.

    await order.save();

    // Emit socket update
    const populatedOrder = await Order.findById(orderId)
      .populate('user', '_id name')
      .populate('restaurant', '_id name');

    if (populatedOrder && global.io) {
      const eventData = {
        orderId: populatedOrder._id,
        orderStatus: populatedOrder.orderStatus,
        order: populatedOrder
      };
      if (populatedOrder.user?._id) global.io.to(`user-${populatedOrder.user._id}`).emit('order-status-updated', eventData);
      if (populatedOrder.restaurant?._id) global.io.to(`restaurant-${populatedOrder.restaurant._id}`).emit('order-status-updated', eventData);

      // Notify other partners to remove from their list? 
      // Ideally we emit 'order-accepted' to all partners, but for now polling/refresh handles it.
    }

    res.json({ message: "Order accepted successfully", order });
  } catch (error) {
    console.error("Error accepting order:", error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ PUT /api/delivery/status/:orderId
export const updateDeliveryStatus = async (req, res) => {
  try {
    const { orderId } = req.params
    const { status } = req.body

    const order = await Order.findById(orderId)
    if (!order) return res.status(404).json({ message: "Order not found" })

    // ✅ Validate Status Transition
    if (status === "picked_up" && order.orderStatus !== "ready") {
      return res.status(400).json({ message: "Order must be READY before it can be picked up" });
    }
    if (status === "delivered" && order.orderStatus !== "picked_up" && order.orderStatus !== "on_the_way" && order.orderStatus !== "out-for-delivery") {
      // Allow from picked_up or on_the_way
    }

    console.log(`Updating order ${orderId} to status: ${status}`);

    // If marking as delivered, update partner stats
    if (status === "delivered" && order.orderStatus !== "delivered") {
      const partnerId = req.user._id // Assuming protected route adds user
      console.log(`Updating stats for partner user: ${partnerId}`);

      const partner = await DeliveryPartner.findOne({ user: partnerId })

      if (partner) {
        console.log(`Found partner: ${partner._id}, current deliveries: ${partner.totalDeliveries}`);
        partner.totalDeliveries += 1
        partner.earnings += 40 // Fixed earnings per delivery
        await partner.save()
        console.log(`Updated partner stats. New deliveries: ${partner.totalDeliveries}`);
      } else {
        console.log("Partner not found for stats update");
      }
    }

    order.orderStatus = status
    await order.save()

    // ✅ Emit socket event for real-time updates
    // Populate order to get user and restaurant IDs
    const populatedOrder = await Order.findById(orderId)
      .populate('user', '_id name')
      .populate('restaurant', '_id name');

    if (populatedOrder && global.io) {
      const eventData = {
        orderId: populatedOrder._id,
        orderStatus: status,
        order: populatedOrder
      };

      // Emit to customer room
      if (populatedOrder.user && populatedOrder.user._id) {
        global.io.to(`user-${populatedOrder.user._id}`).emit('order-status-updated', eventData);
        console.log(`📡 Emitted order update to customer user-${populatedOrder.user._id}`);
      }

      // Emit to restaurant room
      if (populatedOrder.restaurant && populatedOrder.restaurant._id) {
        global.io.to(`restaurant-${populatedOrder.restaurant._id}`).emit('order-status-updated', eventData);
        console.log(`📡 Emitted order update to restaurant restaurant-${populatedOrder.restaurant._id}`);
      }
    }

    res.status(200).json({ message: "Order status updated", order })
  } catch (error) {
    console.error("Error in updateDeliveryStatus:", error.message)
    res.status(500).json({ message: "Server error" })
  }
}

// ✅ PUT /api/delivery/toggle/:userId
export const toggleAvailability = async (req, res) => {
  try {
    const { partnerId } = req.params // This is actually userId passed from frontend
    const { isAvailable } = req.body

    // Find partner where user field matches the passed ID
    const partner = await DeliveryPartner.findOneAndUpdate(
      { user: partnerId },
      { isAvailable },
      { new: true }
    ).populate("user", "name")

    if (!partner) return res.status(404).json({ message: "Partner not found" })

    res.status(200).json({ partner })
  } catch (error) {
    console.error("Error in toggleAvailability:", error.message)
    res.status(500).json({ message: "Server error" })
  }
}

// ✅ GET /api/delivery/history
export const getDeliveryHistory = async (req, res) => {
  try {
    const partnerId = req.user._id;
    let partner = await DeliveryPartner.findOne({ user: partnerId });

    // ✅ Self-healing
    if (!partner) {
      partner = await DeliveryPartner.create({
        user: partnerId,
        status: 'approved',
        isAvailable: true,
        currentLocation: { type: 'Point', coordinates: [0, 0] }
      });
    }

    const orders = await Order.find({
      orderStatus: "delivered",
      deliveryPartner: partner._id
    })
      .sort({ updatedAt: -1 })
      .populate("restaurant", "name")
      .populate("user", "name")

    const formatted = orders.map((order) => ({
      _id: order._id,
      restaurantName: order.restaurant?.name || "Unknown",
      customerName: order.user?.name || "Customer",
      address: order.address ? `${order.address.line1}, ${order.address.city}` : "Unknown Address",
      updatedAt: order.updatedAt,
      totalAmount: order.totalAmount
    }))

    res.status(200).json({ orders: formatted })
  } catch (error) {
    console.error("Error in getDeliveryHistory:", error.message)
    res.status(500).json({ message: "Server error" })
  }
}

// ✅ Get All Delivery Partners (Admin)
export const getAllDeliveryPartners = async (req, res) => {
  try {
    const partners = await DeliveryPartner.find({}).populate("user", "name email");
    res.json(partners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Update Delivery Partner Status (Admin)
export const updateDeliveryPartnerStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'approved', 'rejected', 'pending'

    const partner = await DeliveryPartner.findByIdAndUpdate(
      id,
      { status: status },
      { new: true }
    );

    if (!partner) return res.status(404).json({ message: "Delivery Partner not found" });

    res.json(partner);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// ✅ Update Delivery Partner Location
export const updateLocation = async (req, res) => {
  try {
    const { lat, lng } = req.body;
    const partnerId = req.user._id; // User ID from token

    if (!lat || !lng) {
      return res.status(400).json({ message: "Latitude and Longitude are required" });
    }

    const partner = await DeliveryPartner.findOneAndUpdate(
      { user: partnerId },
      {
        currentLocation: {
          type: "Point",
          coordinates: [lng, lat] // MongoDB expects [lng, lat]
        },
        lastLocationUpdate: new Date()
      },
      { new: true }
    );

    if (!partner) return res.status(404).json({ message: "Partner not found" });

    res.json({ success: true, message: "Location updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
