import express from "express";
import {
  getPartnerProfile,
  getAssignedOrders,
  updateDeliveryStatus,
  toggleAvailability,
  getDeliveryHistory,
  getAllDeliveryPartners,
  updateDeliveryPartnerStatus,

  updateLocation,
  acceptOrder,
  updatePartnerProfile
} from "../controllers/deliveryController.js";
import { clerkAuth, requireRole } from "../middleware/clerkAuth.js";

const router = express.Router();

// Delivery partner routes
router.get("/debug-partners", getAllDeliveryPartners); // Reusing admin controller for debug, temporary
router.get("/debug-orders/:partnerId", async (req, res) => {
  try {
    const { partnerId } = req.params;
    const mongoose = await import("mongoose");
    const DeliveryPartner = (await import("../models/DeliveryPartner.js")).default;
    const Order = (await import("../models/Order.js")).default;

    const partner = await DeliveryPartner.findById(partnerId);
    if (!partner) return res.status(404).json({ message: "Partner not found" });

    const orders = await Order.find({
      orderStatus: { $in: ["ready", "out-for-delivery"] },
    })
      .populate("restaurant", "name")
      .populate("user", "name");

    res.json({ partner, ordersCount: orders.length, orders });
  } catch (error) {
    res.status(500).json({ message: error.message, stack: error.stack });
  }
});

router.get("/profile", clerkAuth, requireRole(['delivery_partner']), getPartnerProfile);
router.put("/profile", clerkAuth, requireRole(['delivery_partner']), updatePartnerProfile); // ✅ New route
router.get("/orders", clerkAuth, requireRole(['delivery_partner']), getAssignedOrders);
router.get("/history", clerkAuth, requireRole(['delivery_partner']), getDeliveryHistory);
router.put("/status/:orderId", clerkAuth, requireRole(['delivery_partner']), updateDeliveryStatus);
router.put("/toggle/:partnerId", clerkAuth, requireRole(['delivery_partner']), toggleAvailability);
router.put("/accept/:orderId", clerkAuth, requireRole(['delivery_partner']), acceptOrder); // ✅ New route
router.put("/location", clerkAuth, requireRole(['delivery_partner']), updateLocation); // ✅ New route

// Admin routes
router.get("/admin/all", clerkAuth, requireRole(['admin']), getAllDeliveryPartners);
router.put("/:id/status", clerkAuth, requireRole(['admin']), updateDeliveryPartnerStatus);

export default router;
