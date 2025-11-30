import Order from "../models/Order.js";
import Restaurant from "../models/Restaurant.js";
import MenuItem from "../models/MenuItem.js";

/**
 * Get recommended restaurants based on user's order history (cuisine preference)
 * Fallback to top-rated restaurants if no history or not authenticated
 */
export const getRecommendedRestaurants = async (req, res) => {
    try {
        let preferredCuisines = [];

        // If user is authenticated and has a DB ID, analyze their order history
        if (req.user && req.user._id) {
            const userOrders = await Order.find({ user: req.user._id })
                .populate({
                    path: "restaurant",
                    select: "cuisine"
                })
                .sort({ createdAt: -1 })
                .limit(20);

            // Extract cuisines from past orders
            const cuisineCounts = {};
            userOrders.forEach(order => {
                if (order.restaurant && order.restaurant.cuisine) {
                    order.restaurant.cuisine.forEach(cuisine => {
                        cuisineCounts[cuisine] = (cuisineCounts[cuisine] || 0) + 1;
                    });
                }
            });

            // Sort cuisines by frequency
            preferredCuisines = Object.keys(cuisineCounts).sort(
                (a, b) => cuisineCounts[b] - cuisineCounts[a]
            );
        }

        let query = { status: "approved", isOpen: true };
        let sort = { rating: -1 }; // Default sort by rating

        // If we have preferences, prioritize those cuisines
        if (preferredCuisines.length > 0) {
            // We'll fetch restaurants that match preferred cuisines first
            // This is a simple implementation. For more complex logic, we might need aggregation.
            query.cuisine = { $in: preferredCuisines };
        }

        let restaurants = await Restaurant.find(query)
            .sort(sort)
            .limit(10);

        // If we didn't find enough (or any) matching preferred cuisines, fill up with top rated
        if (restaurants.length < 5) {
            const existingIds = restaurants.map(r => r._id);
            const topRated = await Restaurant.find({
                _id: { $nin: existingIds },
                status: "approved",
                isOpen: true
            })
                .sort({ rating: -1 })
                .limit(10 - restaurants.length);

            restaurants = [...restaurants, ...topRated];
        }

        res.json(restaurants);
    } catch (error) {
        console.error("Error fetching recommended restaurants:", error);
        res.status(500).json({ message: "Failed to fetch recommendations" });
    }
};

/**
 * Get popular food items based on order frequency
 */
export const getPopularItems = async (req, res) => {
    try {
        // Aggregate orders to count most ordered menu items
        const popularItems = await Order.aggregate([
            { $unwind: "$items" },
            {
                $group: {
                    _id: "$items.menuItem",
                    count: { $sum: "$items.quantity" }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);

        // Populate details for these items and filter by approved restaurants
        const itemIds = popularItems.map(item => item._id);
        const items = await MenuItem.find({ _id: { $in: itemIds }, isAvailable: true })
            .populate("restaurant", "name location rating image status");

        // ✅ Filter to only include items from approved restaurants
        const approvedRestaurantItems = items.filter(
            item => item.restaurant && item.restaurant.status === "approved"
        );

        // Sort them back according to popularity (since find() doesn't guarantee order)
        const sortedItems = approvedRestaurantItems.sort((a, b) => {
            const countA = popularItems.find(p => p._id.toString() === a._id.toString())?.count || 0;
            const countB = popularItems.find(p => p._id.toString() === b._id.toString())?.count || 0;
            return countB - countA;
        });

        res.json(sortedItems);
    } catch (error) {
        console.error("Error fetching popular items:", error);
        res.status(500).json({
            message: "Failed to fetch popular items",
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};
