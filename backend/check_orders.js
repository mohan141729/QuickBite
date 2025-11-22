import mongoose from "mongoose";
import dotenv from "dotenv";
import Order from "./src/models/Order.js";

dotenv.config();

const checkOrders = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        const orders = await Order.find({});
        console.log(`Total orders: ${orders.length}`);

        const readyOrders = orders.filter(o => o.orderStatus === 'ready');
        const outOrders = orders.filter(o => o.orderStatus === 'out-for-delivery');

        console.log(`Ready orders: ${readyOrders.length}`);
        console.log(`Out for delivery orders: ${outOrders.length}`);

        if (orders.length > 0) {
            console.log("Sample order statuses:", orders.map(o => o.orderStatus));
        }

        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

checkOrders();
