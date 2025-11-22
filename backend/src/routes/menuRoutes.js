import express from "express"
import {
  createMenuItem,
  getMenuItemsByRestaurant,
  getMenuItemById,
  updateMenuItem,
  deleteMenuItem,
  getAllMenuItems,
} from "../controllers/menucontroller.js"
import protect from "../middleware/authMiddleware.js"

const router = express.Router()

// ✅ Public - homepage & category fetch
router.get("/", getAllMenuItems)

// ✅ Public - get all items by restaurant
router.get("/restaurant/:restaurantId", getMenuItemsByRestaurant)

// ✅ Public - get single item
router.get("/:id", getMenuItemById)

// ✅ Protected routes for restaurant owner/admin
router.post("/", protect, createMenuItem)
router.put("/:id", protect, updateMenuItem)
router.delete("/:id", protect, deleteMenuItem)

export default router
