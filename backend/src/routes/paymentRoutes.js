import express from "express"
import {
  initiatePayment,
  verifyPayment,
  getAllPayments,
} from "../controllers/paymentController.js"
import protect from "../middleware/authMiddleware.js"

const router = express.Router()

router.post("/initiate", protect, initiatePayment)
router.post("/verify", protect, verifyPayment)
router.get("/", protect, getAllPayments)

export default router
