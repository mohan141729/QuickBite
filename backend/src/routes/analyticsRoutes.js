import express from "express";
import {
    getRestaurantAnalytics,
    getDashboardStats,
    getRevenueAnalytics,
    getOrderStatusDistribution,
    getTopRestaurants,
    getUserGrowth
} from "../controllers/analyticsController.js";
import { clerkAuth, requireRole } from "../middleware/clerkAuth.js";

const router = express.Router();

router.get("/dashboard", clerkAuth, requireRole(['admin']), getDashboardStats);
router.get("/revenue", clerkAuth, requireRole(['admin']), getRevenueAnalytics);
router.get("/order-status", clerkAuth, requireRole(['admin']), getOrderStatusDistribution);
router.get("/top-restaurants", clerkAuth, requireRole(['admin']), getTopRestaurants);
router.get("/user-growth", clerkAuth, requireRole(['admin']), getUserGrowth);
router.get("/:restaurantId", clerkAuth, requireRole(['restaurant_owner', 'admin']), getRestaurantAnalytics);

export default router;
