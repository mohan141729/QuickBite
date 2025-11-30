import express from "express";
import {
    getFavorites,
    addRestaurantToFavorites,
    removeRestaurantFromFavorites,
    addMenuItemToFavorites,
    removeMenuItemFromFavorites
} from "../controllers/favoriteController.js";
import { clerkAuth, populateUser } from "../middleware/clerkAuth.js";

const router = express.Router();

// All routes require authentication
router.use(clerkAuth, populateUser);

// Get all favorites
router.get("/", getFavorites);

// Restaurant favorites
router.post("/restaurant/:restaurantId", addRestaurantToFavorites);
router.delete("/restaurant/:restaurantId", removeRestaurantFromFavorites);

// Menu item favorites
router.post("/menuItem/:menuItemId", addMenuItemToFavorites);
router.delete("/menuItem/:menuItemId", removeMenuItemFromFavorites);

export default router;
