import express from "express";
import {
  getPartnerProfile,
  getAssignedOrders,
  updateDeliveryStatus,
  toggleAvailability,
  getDeliveryHistory,
  getAllDeliveryPartners,
  updateDeliveryPartnerStatus,
} from "../controllers/deliveryController.js";
import protect from "../middleware/authMiddleware.js";
import admin from "../middleware/adminMiddleware.js";

const router = express.Router();

// ✅ Correct route definitions
router.get("/profile", protect, getPartnerProfile);
router.get("/orders", protect, getAssignedOrders);
router.get("/history", protect, getDeliveryHistory);
router.put("/status/:orderId", protect, updateDeliveryStatus);
router.put("/toggle/:partnerId", protect, toggleAvailability);

// Admin
router.get("/admin/all", protect, admin, getAllDeliveryPartners);
router.put("/:id/status", protect, admin, updateDeliveryPartnerStatus);

export default router;
