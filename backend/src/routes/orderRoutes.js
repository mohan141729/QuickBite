import express from "express";
import {
  placeOrder,
  createOrder,
  getMyOrders,
  getOrdersByRestaurant,
  updateOrderStatus,
  getAllOrders,
  cancelOrder,
  getOrderById,
} from "../controllers/orderController.js";
import { clerkAuth, requireRole, populateUser } from "../middleware/clerkAuth.js";

const router = express.Router();

// Admin routes
router.get("/", clerkAuth, requireRole(['admin']), getAllOrders);

// Customer routes
router.post("/create", clerkAuth, populateUser, createOrder);
router.post("/place", clerkAuth, populateUser, placeOrder);
router.get("/myorders", clerkAuth, populateUser, getMyOrders);
router.put("/:id/cancel", clerkAuth, populateUser, cancelOrder); // Cancel order

// Restaurant owner routes
router.get("/restaurant/:restaurantId", clerkAuth, requireRole(['restaurant_owner', 'admin']), getOrdersByRestaurant);

// Multi-role routes (restaurant, delivery partner, admin)
router.put("/:id", clerkAuth, requireRole(['restaurant_owner', 'admin', 'delivery_partner']), updateOrderStatus);

// Get single order (any authenticated user who has access)
router.get("/:id", clerkAuth, populateUser, getOrderById);

export default router;
