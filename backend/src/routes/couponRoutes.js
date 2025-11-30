import express from "express";
import {
    getAllActiveCoupons,
    validateCoupon,
    createCoupon,
    updateCoupon,
    deleteCoupon,
    getAllCoupons,
    getCouponStats,
} from "../controllers/couponController.js";
import { clerkAuth, requireRole } from "../middleware/clerkAuth.js";

const router = express.Router();

// ✅ Public routes
router.get("/active", getAllActiveCoupons);
router.post("/validate", validateCoupon);

// ✅ Admin routes
router.get("/", clerkAuth, requireRole(["admin"]), getAllCoupons);
router.post("/", clerkAuth, requireRole(["admin"]), createCoupon);
router.put("/:id", clerkAuth, requireRole(["admin"]), updateCoupon);
router.delete("/:id", clerkAuth, requireRole(["admin"]), deleteCoupon);
router.get("/:id/stats", clerkAuth, requireRole(["admin"]), getCouponStats);

export default router;
