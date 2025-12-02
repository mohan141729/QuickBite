import Order from "../models/Order.js";
import Restaurant from "../models/Restaurant.js";
import Review from "../models/Review.js";
import MenuItem from "../models/MenuItem.js";

// ✅ Add a new review
export const addReview = async (req, res) => {
    try {
        const { restaurantId, rating, comment, orderId } = req.body;
        console.log("📝 addReview Request Body:", req.body);

        if (!req.user) {
            console.error("❌ req.user is missing!");
            return res.status(500).json({ message: "User not authenticated correctly" });
        }

        const userId = req.user._id;
        console.log("👤 User ID:", userId);

        if (!restaurantId || !rating) {
            return res.status(400).json({ message: "Restaurant ID and rating are required" });
        }

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
        console.log("🛠️ Creating review object...");
        const reviewData = {
            user: userId,
            restaurant: restaurantId,
            rating,
            comment,
            order: orderId || undefined,
            items: req.body.items || []
        };
        console.log("📄 Review Data:", reviewData);

        const review = await Review.create(reviewData);
        console.log("✅ Review created:", review._id);

        // Mark order as reviewed
        if (orderId) {
            await Order.findByIdAndUpdate(orderId, { isReviewed: true });
        }

        // Update restaurant average rating
        const reviews = await Review.find({ restaurant: restaurantId });
        let avgRating = reviews.length > 0
            ? reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length
            : 0;

        // Round to 1 decimal place
        avgRating = Math.round(avgRating * 10) / 10;

        restaurant.rating = avgRating;
        await restaurant.save();

        // ✅ Update Menu Item Ratings
        if (req.body.items && Array.isArray(req.body.items)) {
            const MenuItem = (await import("../models/MenuItem.js")).default;

            for (const itemReview of req.body.items) {
                if (itemReview.menuItem && itemReview.rating) {
                    const menuItem = await MenuItem.findById(itemReview.menuItem);
                    if (menuItem) {
                        // Calculate new average
                        const currentRating = menuItem.rating || 0;
                        const currentCount = menuItem.ratingCount || 0;

                        const newCount = currentCount + 1;
                        let newRating = ((currentRating * currentCount) + itemReview.rating) / newCount;

                        // Round to 1 decimal
                        newRating = Math.round(newRating * 10) / 10;

                        menuItem.rating = newRating;
                        menuItem.ratingCount = newCount;
                        await menuItem.save();
                    }
                }
            }
        }

        res.status(201).json({ message: "Review added successfully", review });
    } catch (error) {
        console.error("Error adding review:", error);
        if (error.code === 11000) {
            return res.status(400).json({ message: "You have already reviewed this." });
        }
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
