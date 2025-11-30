import mongoose from "mongoose";
import 'dotenv/config';
import Coupon from "./src/models/Coupon.js";

const createSampleCoupons = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Connected to DB");

        // Clear existing coupons (optional)
        await Coupon.deleteMany({});
        console.log("🧹 Cleared existing coupons");

        // Create sample coupons
        const sampleCoupons = [
            {
                code: "WELCOME50",
                description: "Get 50% off on your first order!",
                discountType: "percentage",
                discountValue: 50,
                minOrderValue: 199,
                maxDiscount: 150,
                validFrom: new Date(),
                validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
                firstTimeUserOnly: true,
                isActive: true,
            },
            {
                code: "FLAT100",
                description: "Flat ₹100 off on orders above ₹299",
                discountType: "flat",
                discountValue: 100,
                minOrderValue: 299,
                validFrom: new Date(),
                validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                isActive: true,
            },
            {
                code: "FREEDEL",
                description: "Free delivery on all orders!",
                discountType: "free_delivery",
                discountValue: 30,
                minOrderValue: 0,
                validFrom: new Date(),
                validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                isActive: true,
            },
            {
                code: "SAVE20",
                description: "Save 20% on your order (Max ₹100 off)",
                discountType: "percentage",
                discountValue: 20,
                minOrderValue: 149,
                maxDiscount: 100,
                validFrom: new Date(),
                validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                isActive: true,
            },
            {
                code: "BIGSAVE",
                description: "Get ₹200 off on orders above ₹599",
                discountType: "flat",
                discountValue: 200,
                minOrderValue: 599,
                validFrom: new Date(),
                validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                isActive: true,
            },
        ];

        const created = await Coupon.insertMany(sampleCoupons);
        console.log(`✅ Created ${created.length} sample coupons:`);
        created.forEach((coupon) => {
            console.log(`   - ${coupon.code}: ${coupon.description}`);
        });

        await mongoose.disconnect();
        console.log("✅ Disconnected from DB");
    } catch (error) {
        console.error("❌ Error:", error);
        process.exit(1);
    }
};

createSampleCoupons();
