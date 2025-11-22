import DeliveryPartner from "../models/DeliveryPartner.js"
import Order from "../models/Order.js"
import User from "../models/User.js"

// ✅ GET /api/delivery/profile
export const getPartnerProfile = async (req, res) => {
  try {
    const partnerId = req.user._id // assuming JWT middleware sets req.user
    const partner = await DeliveryPartner.findOne({ user: partnerId }).populate("user", "name email")

    if (!partner) {
      return res.status(404).json({ message: "Delivery partner not found" })
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

// ✅ GET /api/delivery/orders
export const getAssignedOrders = async (req, res) => {
  try {
    const partnerId = req.user._id
    const partner = await DeliveryPartner.findOne({ user: partnerId })

    if (!partner) {
      return res.status(404).json({ message: "Partner not found" })
    }

    const orders = await Order.find({
      orderStatus: { $in: ["ready", "out-for-delivery"] },
    })
      .populate("restaurant", "name")
      .populate("user", "name")

    // format for frontend
    const formatted = orders.map((order) => ({
      _id: order._id,
      restaurantName: order.restaurant?.name || "Unknown",
      customerName: order.user?.name || "Customer",
      status: order.orderStatus.replaceAll("-", "_"),// Replace ALL hyphens
    }))

    res.status(200).json({ orders: formatted })
  } catch (error) {
    console.error("Error in getAssignedOrders:", error.message)
    res.status(500).json({ message: "Server error" })
  }
}

// ✅ PUT /api/delivery/status/:orderId
export const updateDeliveryStatus = async (req, res) => {
  try {
    const { orderId } = req.params
    const { status } = req.body

    const order = await Order.findById(orderId)
    if (!order) return res.status(404).json({ message: "Order not found" })

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

// ✅ PUT /api/delivery/toggle/:partnerId
export const toggleAvailability = async (req, res) => {
  try {
    const { partnerId } = req.params
    const { isAvailable } = req.body

    const partner = await DeliveryPartner.findByIdAndUpdate(
      partnerId,
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
    // In a real app, we'd filter by deliveryPartner ID stored on the order.
    // For now, we return all delivered orders as a demo.
    const orders = await Order.find({
      orderStatus: "delivered",
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
