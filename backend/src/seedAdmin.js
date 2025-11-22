import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
import connectDB from "./config/db.js";

dotenv.config();

const seedAdmin = async () => {
    try {
        await connectDB();

        const adminExists = await User.findOne({ email: "admin@example.com" });

        if (adminExists) {
            console.log("Admin user already exists. Updating password...");
            adminExists.password = "admin123";
            await adminExists.save();
            console.log("Admin password updated to 'admin123'");
            process.exit();
        }

        const user = await User.create({
            name: "Admin User",
            email: "admin@example.com",
            password: "admin123",
            role: "admin",
        });

        console.log("Admin user created successfully:", user);
        process.exit();
    } catch (error) {
        console.error("Error seeding admin:", error);
        process.exit(1);
    }
};

seedAdmin();
