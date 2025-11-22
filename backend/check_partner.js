import mongoose from "mongoose";
import dotenv from "dotenv";
import DeliveryPartner from "./src/models/DeliveryPartner.js";

dotenv.config();

const checkPartnerStats = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        const partners = await DeliveryPartner.find({}).populate("user", "name email");

        partners.forEach(p => {
            const name = p.user ? p.user.name : "Unknown User";
            const email = p.user ? p.user.email : "No Email";
            console.log(`Partner: ${name} (${email})`);
            console.log(`  Total Deliveries: ${p.totalDeliveries}`);
            console.log(`  Earnings: ${p.earnings}`);
            console.log(`  Is Available: ${p.isAvailable}`);
        });

        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

checkPartnerStats();
