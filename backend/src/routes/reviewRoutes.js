import express from "express";
import { addReview, getReviewsByRestaurant, getUserReviews } from "../controllers/reviewController.js";
import { clerkAuth, populateUser } from "../middleware/clerkAuth.js";

const router = express.Router();

// Protected: Get user reviews
router.get("/my", clerkAuth, populateUser, getUserReviews);

// Public: Get reviews
router.get("/:restaurantId", getReviewsByRestaurant);

// Protected: Add review
router.post("/", clerkAuth, populateUser, addReview);

export default router;
