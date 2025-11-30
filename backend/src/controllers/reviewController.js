import Order from "../models/Order.js";
import Restaurant from "../models/Restaurant.js";
import Review from "../models/Review.js";

// ✅ Add a new review
export const addReview = async (req, res) => {
    try {
        const { restaurantId, rating, comment, orderId } = req.body;
        const userId = req.user._id;

        // Check if restaurant exists
        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }

        // Check if user already reviewed this order (if orderId provided)
        if (orderId) {
            const existingReview = await Review.findOne({ order: orderId, user: userId });
            if (existingReview) {
                return res.status(400).json({ message: "You have already reviewed this order" });
            }
        } else {
            // Fallback for legacy behavior (optional, or remove if strictly order-based)
            const existingReview = await Review.findOne({ restaurant: restaurantId, user: userId, order: { $exists: false } });
            if (existingReview) {
                return res.status(400).json({ message: "You have already reviewed this restaurant" });
            }
        }

        // Create review
        const review = await Review.create({
            user: userId,
            restaurant: restaurantId,
            rating,
            comment,
            order: orderId || undefined,
        });

        // Mark order as reviewed
        if (orderId) {
            await Order.findByIdAndUpdate(orderId, { isReviewed: true });
        }

        // Update restaurant average rating
        const reviews = await Review.find({ restaurant: restaurantId });
        const avgRating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

        restaurant.rating = avgRating;
        await restaurant.save();

        res.status(201).json({ message: "Review added successfully", review });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ Get reviews for a restaurant
export const getReviewsByRestaurant = async (req, res) => {
    try {
        const reviews = await Review.find({ restaurant: req.params.restaurantId })
            .populate("user", "name")
            .sort({ createdAt: -1 });

        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// ✅ Get reviews by user
export const getUserReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ user: req.user._id })
            .populate("restaurant", "name image")
            .sort({ createdAt: -1 });

        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
