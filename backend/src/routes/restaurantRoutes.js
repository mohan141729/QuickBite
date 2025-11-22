import express from "express";
import {
  createRestaurant,
  getRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
  getAllRestaurantsAdmin,
  updateRestaurantStatus,
} from "../controllers/restaurantController.js";
import protect from "../middleware/authMiddleware.js";
import admin from "../middleware/adminMiddleware.js";

const router = express.Router();

// Public
router.get("/:id", getRestaurantById);
router.get("/", getRestaurants);

// Protected
router.post("/", protect, createRestaurant);
router.put("/:id", protect, updateRestaurant);
router.delete("/:id", protect, deleteRestaurant);

// Admin
router.get("/admin/all", protect, admin, getAllRestaurantsAdmin);
router.put("/:id/status", protect, admin, updateRestaurantStatus);

export default router;
