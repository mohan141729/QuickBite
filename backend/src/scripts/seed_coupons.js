import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Coupon from '../models/Coupon.js';

dotenv.config();

const seedCoupons = async () => {
    try {
        console.log("Connecting to DB...");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ DB Connected");

        // Clear existing coupons
        await Coupon.deleteMany({});
        console.log("Cleared existing coupons.");

        const coupons = [
            {
                code: "WELCOME50",
                description: "50% OFF on your first order",
                discountType: "percentage",
                discountValue: 50,
                minOrderValue: 199,
                maxDiscount: 100,
                validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
                isActive: true,
                firstTimeUserOnly: true
            },
            {
                code: "QUICKBITE20",
                description: "Flat 20% OFF on all orders",
                discountType: "percentage",
                discountValue: 20,
                minOrderValue: 149,
                maxDiscount: 50,
                validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
                isActive: true
            },
            {
                code: "FREEDEL",
                description: "Free Delivery on orders above ₹299",
                discountType: "free_delivery",
                discountValue: 0,
                minOrderValue: 299,
                validUntil: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
                isActive: true
            },
            {
                code: "FLAT100",
                description: "Flat ₹100 OFF on orders above ₹500",
                discountType: "flat",
                discountValue: 100,
                minOrderValue: 500,
                validUntil: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
                isActive: true
            }
        ];

        await Coupon.insertMany(coupons);
        console.log(`✅ Seeded ${coupons.length} coupons successfully.`);

    } catch (error) {
        console.error("❌ Error seeding coupons:", error);
    } finally {
        await mongoose.disconnect();
        console.log("DB Disconnected");
    }
};

seedCoupons();
