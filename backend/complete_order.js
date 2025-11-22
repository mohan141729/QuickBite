import mongoose from "mongoose";
import dotenv from "dotenv";
import Order from "./src/models/Order.js";
import DeliveryPartner from "./src/models/DeliveryPartner.js";

dotenv.config();

const completeOrder = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        const order = await Order.findOne({ orderStatus: "ready" }); // It was ready, maybe browser clicked start?
        // Let's check for 'out-for-delivery' too just in case
        const outOrder = await Order.findOne({ orderStatus: "out-for-delivery" });

        let targetOrder = outOrder || order;

        if (targetOrder) {
            console.log(`Found order ${targetOrder._id} with status ${targetOrder.orderStatus}`);
            targetOrder.orderStatus = "delivered";
            await targetOrder.save();
            console.log(`Updated order ${targetOrder._id} to 'delivered'`);

            // Update partner stats manually if backend doesn't do it on save (it likely doesn't)
            // The controller does it on GET profile, but let's see if we need to update the partner model directly
            // The controller computes todayEarnings on the fly from Orders.
            // So just updating the order should be enough for the dashboard to show earnings.

        } else {
            console.log("No active order found to complete.");
        }

        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

completeOrder();
