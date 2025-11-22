import mongoose from "mongoose";
import dotenv from "dotenv";
import Order from "./src/models/Order.js";

dotenv.config();

const updateOrder = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        // Find an order that is processing or accepted
        const order = await Order.findOne({ orderStatus: { $in: ["processing", "accepted"] } });

        if (order) {
            order.orderStatus = "ready";
            await order.save();
            console.log(`Updated order ${order._id} to 'ready'`);
        } else {
            console.log("No suitable order found to update. Creating a new one...");
            // Logic to create a new order if needed, but for now let's assume we have one.
            // If not, we might need to create one with valid user/restaurant IDs.
            // Let's check if we can find ANY order to update if the above fails.
            const anyOrder = await Order.findOne({ orderStatus: { $ne: "delivered" } });
            if (anyOrder) {
                anyOrder.orderStatus = "ready";
                await anyOrder.save();
                console.log(`Updated order ${anyOrder._id} to 'ready'`);
            } else {
                console.log("No non-delivered orders found.");
            }
        }

        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

updateOrder();
