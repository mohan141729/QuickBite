import mongoose from 'mongoose';
import Cart from '../models/Cart.js';
import MenuItem from '../models/MenuItem.js';
import Restaurant from '../models/Restaurant.js';
import User from '../models/User.js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("DB Connected");

        // 1. Find a user, restaurant, and menu item
        const restaurant = await Restaurant.findOne();
        if (!restaurant) throw new Error("No restaurant found");

        const menuItem = await MenuItem.findOne({ restaurant: restaurant._id });
        if (!menuItem) throw new Error("No menu item found");

        const user = await User.findOne(); // Any user
        if (!user) throw new Error("No user found");

        console.log(`Testing with User: ${user._id}, Restaurant: ${restaurant.name}, Item: ${menuItem.name}`);

        // 2. Clear cart
        await Cart.deleteMany({ user: user._id });

        // 3. Create cart with item
        const cart = new Cart({
            user: user._id,
            items: [{
                menuItem: menuItem._id,
                restaurant: restaurant._id,
                quantity: 1
            }]
        });
        await cart.save();

        // 4. Populate and check
        const populatedCart = await Cart.findById(cart._id)
            .populate("items.menuItem")
            .populate("items.restaurant");

        console.log("Populated Item 0:", JSON.stringify(populatedCart.items[0], null, 2));

        if (!populatedCart.items[0].menuItem.name) {
            console.error("❌ FAILURE: menuItem.name is missing!");
        } else {
            console.log("✅ SUCCESS: menuItem.name is present:", populatedCart.items[0].menuItem.name);
        }

    } catch (e) {
        console.error("❌ ERROR:", e);
    } finally {
        await mongoose.disconnect();
    }
};

run();
