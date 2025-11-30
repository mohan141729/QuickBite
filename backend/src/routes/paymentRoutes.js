import express from "express"
import {
  initiatePayment,
  verifyPayment,
  getAllPayments,
} from "../controllers/paymentController.js"
import { clerkAuth, populateUser } from "../middleware/clerkAuth.js"

const router = express.Router()

router.post("/initiate", clerkAuth, populateUser, initiatePayment)
router.post("/verify", clerkAuth, verifyPayment)
router.get("/", clerkAuth, populateUser, getAllPayments)

export default router
