import Favorite from "../models/Favorite.js";

// Get user favorites
export const getFavorites = async (req, res) => {
    try {
        let favorite = await Favorite.findOne({ user: req.user._id })
            .populate('restaurants', 'name image cuisine rating location')
            .populate({
                path: 'menuItems.menuItem',
                select: 'name price image category restaurant'
            })
            .populate({
                path: 'menuItems.restaurant',
                select: 'name'
            });

        if (!favorite) {
            favorite = await Favorite.create({ user: req.user._id, restaurants: [], menuItems: [] });
        } else {
            // Filter out null populated items (in case of deleted restaurants/items)
            const initialRestaurantCount = favorite.restaurants.length;
            const initialMenuItemCount = favorite.menuItems.length;

            favorite.restaurants = favorite.restaurants.filter(r => r !== null);
            favorite.menuItems = favorite.menuItems.filter(item => item.menuItem && item.restaurant);

            // Save if we filtered anything out to clean up the DB
            if (favorite.restaurants.length !== initialRestaurantCount || favorite.menuItems.length !== initialMenuItemCount) {
                await favorite.save();
            }
        }

        res.json({ success: true, favorites: favorite });
    } catch (error) {
        console.error("Get Favorites Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Add restaurant to favorites
export const addRestaurantToFavorites = async (req, res) => {
    try {
        const { restaurantId } = req.params;

        let favorite = await Favorite.findOne({ user: req.user._id });

        if (!favorite) {
            favorite = await Favorite.create({
                user: req.user._id,
                restaurants: [restaurantId],
                menuItems: []
            });
        } else {
            if (!favorite.restaurants.includes(restaurantId)) {
                favorite.restaurants.push(restaurantId);
                await favorite.save();
            }
        }

        await favorite.populate('restaurants', 'name image cuisine rating');

        res.json({ success: true, favorites: favorite });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Remove restaurant from favorites
export const removeRestaurantFromFavorites = async (req, res) => {
    try {
        const { restaurantId } = req.params;

        const favorite = await Favorite.findOne({ user: req.user._id });

        if (!favorite) {
            return res.status(404).json({ success: false, message: "Favorites not found" });
        }

        favorite.restaurants = favorite.restaurants.filter(
            (id) => id.toString() !== restaurantId
        );

        await favorite.save();
        await favorite.populate('restaurants', 'name image cuisine rating');

        res.json({ success: true, favorites: favorite });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Add menu item to favorites
export const addMenuItemToFavorites = async (req, res) => {
    try {
        const { menuItemId } = req.params;
        const { restaurantId } = req.body;

        let favorite = await Favorite.findOne({ user: req.user._id });

        if (!favorite) {
            favorite = await Favorite.create({
                user: req.user._id,
                restaurants: [],
                menuItems: [{ menuItem: menuItemId, restaurant: restaurantId }]
            });
        } else {
            const exists = favorite.menuItems.some(
                (item) => item.menuItem.toString() === menuItemId
            );

            if (!exists) {
                favorite.menuItems.push({ menuItem: menuItemId, restaurant: restaurantId });
                await favorite.save();
            }
        }

        await favorite.populate({
            path: 'menuItems.menuItem',
            select: 'name price image'
        });

        await favorite.populate({
            path: 'menuItems.restaurant',
            select: 'name'
        });

        res.json({ success: true, favorites: favorite });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Remove menu item from favorites
export const removeMenuItemFromFavorites = async (req, res) => {
    try {
        const { menuItemId } = req.params;

        const favorite = await Favorite.findOne({ user: req.user._id });

        if (!favorite) {
            return res.status(404).json({ success: false, message: "Favorites not found" });
        }

        favorite.menuItems = favorite.menuItems.filter(
            (item) => item.menuItem.toString() !== menuItemId
        );

        await favorite.save();

        await favorite.populate({
            path: 'menuItems.menuItem',
            select: 'name price image'
        });

        await favorite.populate({
            path: 'menuItems.restaurant',
            select: 'name'
        });

        res.json({ success: true, favorites: favorite });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
