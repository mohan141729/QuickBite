import mongoose from "mongoose";
import dotenv from "dotenv";
import Order from "./src/models/Order.js";
import User from "./src/models/User.js";
import Restaurant from "./src/models/Restaurant.js";
import MenuItem from "./src/models/MenuItem.js";

dotenv.config();

const createTestOrder = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        // Need valid IDs. Let's find some.
        const user = await User.findOne({ role: "customer" });
        const restaurant = await Restaurant.findOne({});

        if (!user || !restaurant) {
            console.log("Missing user or restaurant to create order.");
            process.exit(1);
        }

        // Create a dummy order
        const order = new Order({
            user: user._id,
            restaurant: restaurant._id,
            items: [], // Empty for test
            totalAmount: 200,
            address: { line1: "Test St", city: "Test City", pincode: "123456" },
            orderStatus: "ready", // Start at ready to be visible
            paymentStatus: "paid"
        });

        await order.save();
        console.log(`Created test order ${order._id} with status 'ready'`);

        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

createTestOrder();
