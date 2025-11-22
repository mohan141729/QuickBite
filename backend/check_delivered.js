import mongoose from "mongoose";
import dotenv from "dotenv";
import Order from "./src/models/Order.js";

dotenv.config();

const checkDeliveredOrders = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        const orders = await Order.find({ orderStatus: "delivered" });
        console.log(`Found ${orders.length} delivered orders.`);

        orders.forEach(o => {
            console.log(`Order ${o._id}: Status=${o.orderStatus}, UpdatedAt=${o.updatedAt}`);
        });

        const allOrders = await Order.find({});
        console.log(`Total orders in DB: ${allOrders.length}`);
        console.log("Statuses:", allOrders.map(o => o.orderStatus));

        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

checkDeliveredOrders();
