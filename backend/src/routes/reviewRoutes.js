import express from "express";
import { addReview, getReviewsByRestaurant } from "../controllers/reviewController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Public: Get reviews
router.get("/:restaurantId", getReviewsByRestaurant);

// Protected: Add review
router.post("/", protect, addReview);

export default router;
