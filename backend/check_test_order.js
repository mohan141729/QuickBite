import mongoose from "mongoose";
import dotenv from "dotenv";
import Order from "./src/models/Order.js";
import DeliveryPartner from "./src/models/DeliveryPartner.js";

dotenv.config();

const completeTestOrder = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        // Find the ready order we just created (or any ready order)
        const order = await Order.findOne({ orderStatus: "ready" });

        if (order) {
            // We need to simulate the API call logic. 
            // The API call updates the partner stats. 
            // Since we can't easily call the API from here without auth, 
            // we will manually update the partner stats to simulate what the controller does,
            // OR better, we trust the controller logic we wrote and just check if it works via browser.
            // But to verify via browser, we need to click the button.
            // Let's try browser verification again.
            // If browser fails, we can't verify the controller logic via script unless we mock the request.

            // Actually, let's use the browser to complete it. That tests the full stack.
            console.log(`Found order ${order._id}. Use browser to complete.`);
        } else {
            console.log("No ready order found.");
        }

        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

completeTestOrder();
