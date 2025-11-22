import express from "express"
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,       // ✅ Import the new controller
} from "../controllers/cartController.js"
import protect from "../middleware/authMiddleware.js"

const router = express.Router()

router.use(protect)

// 🛒 Cart Routes
router.get("/", getCart)             // Get logged-in user's cart
router.post("/", addToCart)          // Add item to cart
router.put("/:itemId", updateCartItem)  // Update quantity
router.delete("/:itemId", removeCartItem) // Remove single item
router.delete("/", clearCart)        // ✅ Clear entire cart

export default router
