import express from "express"
import {
  placeOrder,
  getMyOrders,
  getOrdersByRestaurant,
  updateOrderStatus,
  getAllOrders,
} from "../controllers/orderController.js"
import protect from "../middleware/authMiddleware.js"
import admin from "../middleware/adminMiddleware.js"

const router = express.Router()

router.get("/", protect, admin, getAllOrders)
router.post("/", protect, placeOrder)
router.get("/myorders", protect, getMyOrders)
router.get("/restaurant/:restaurantId", protect, getOrdersByRestaurant)
router.put("/:id", protect, updateOrderStatus)

export default router
