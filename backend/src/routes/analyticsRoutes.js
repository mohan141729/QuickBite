import express from "express";
import {
    getRestaurantAnalytics,
    getDashboardStats,
    getRevenueAnalytics,
    getOrderStatusDistribution,
    getTopRestaurants,
    getUserGrowth
} from "../controllers/analyticsController.js";
import protect from "../middleware/authMiddleware.js";
import admin from "../middleware/adminMiddleware.js";

const router = express.Router();

router.get("/dashboard", protect, admin, getDashboardStats);
router.get("/revenue", protect, admin, getRevenueAnalytics);
router.get("/order-status", protect, admin, getOrderStatusDistribution);
router.get("/top-restaurants", protect, admin, getTopRestaurants);
router.get("/user-growth", protect, admin, getUserGrowth);
router.get("/:restaurantId", getRestaurantAnalytics);

export default router;
