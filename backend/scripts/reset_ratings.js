import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
dotenv.config({ path: path.join(__dirname, "../src/.env") });

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/quickbite";

const resetRatings = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("✅ Connected to MongoDB");

        const MenuItem = (await import("../src/models/MenuItem.js")).default;

        const result = await MenuItem.updateMany(
            {},
            { $set: { rating: 0, ratingCount: 0 } }
        );

        console.log(`✅ Reset ratings for ${result.modifiedCount} items.`);
        process.exit(0);
    } catch (error) {
        console.error("❌ Error resetting ratings:", error);
        process.exit(1);
    }
};

resetRatings();
