import express from "express"
import {
  createMenuItem,
  getMenuItemsByRestaurant,
  getMenuItemById,
  updateMenuItem,
  deleteMenuItem,
  getAllMenuItems,
} from "../controllers/MenuController.js" // Fixed casing import
import { clerkAuth, requireRole, attemptAuth } from "../middleware/clerkAuth.js"

const router = express.Router()

// ✅ Public - homepage & category fetch
router.get("/", getAllMenuItems)

// ✅ Public - get all items by restaurant (with optional auth for owners)
router.get("/restaurant/:restaurantId", attemptAuth, getMenuItemsByRestaurant)

// ✅ Public - get single item
router.get("/:id", getMenuItemById)

// ✅ Protected routes for restaurant owner
router.post("/", clerkAuth, requireRole(['restaurant_owner']), createMenuItem)
router.put("/:id", clerkAuth, requireRole(['restaurant_owner']), updateMenuItem)
router.delete("/:id", clerkAuth, requireRole(['restaurant_owner']), deleteMenuItem)

export default router
