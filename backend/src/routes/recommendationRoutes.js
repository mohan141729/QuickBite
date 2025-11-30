import express from 'express';
import { getRecommendedRestaurants, getPopularItems } from '../controllers/recommendationController.js';
import { optionalAuth } from '../middleware/clerkAuth.js';

const router = express.Router();

// GET /api/recommendations/restaurants
// Uses optionalAuth to personalize if user is logged in, otherwise generic top rated
router.get('/restaurants', optionalAuth, getRecommendedRestaurants);

// GET /api/recommendations/items
router.get('/items', getPopularItems);

export default router;
