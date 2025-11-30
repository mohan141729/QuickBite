import express from "express";
import {
  createRestaurant,
  getRestaurants,
  searchAndFilterRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
  getAllRestaurantsAdmin,
  updateRestaurantStatus,
  updateCategory,
} from "../controllers/restaurantController.js";
import { clerkAuth, requireRole, optionalAuth, attemptAuth } from "../middleware/clerkAuth.js";

const router = express.Router();

// Public routes - no authentication required
router.get("/search", searchAndFilterRestaurants); // Advanced search/filter
router.get("/:id", getRestaurantById);
router.get("/", attemptAuth, optionalAuth, getRestaurants); // Optional auth - works for both authenticated and unauthenticated users

// Protected routes - restaurant owners only
router.post("/", clerkAuth, requireRole(['restaurant_owner']), createRestaurant);
router.put("/:id", clerkAuth, requireRole(['restaurant_owner']), updateRestaurant);
router.put("/:id/categories", clerkAuth, requireRole(['restaurant_owner']), updateCategory);
router.delete("/:id", clerkAuth, requireRole(['restaurant_owner']), deleteRestaurant);

// Admin routes
router.get("/admin/all", clerkAuth, requireRole(['admin']), getAllRestaurantsAdmin);
router.put("/:id/status", clerkAuth, requireRole(['admin']), updateRestaurantStatus);

export default router;
