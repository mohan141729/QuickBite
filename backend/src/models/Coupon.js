import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
        discountType: {
            type: String,
            enum: ["percentage", "flat", "free_delivery"],
            required: true,
        },
        discountValue: {
            type: Number,
            required: true,
        },
        minOrderValue: {
            type: Number,
            default: 0,
        },
        maxDiscount: {
            type: Number, // For percentage type, cap the discount
            default: null,
        },
        validFrom: {
            type: Date,
            default: Date.now,
        },
        validUntil: {
            type: Date,
            required: true,
        },
        usageLimit: {
            type: Number,
            default: null, // null = unlimited
        },
        usedCount: {
            type: Number,
            default: 0,
        },
        restaurantIds: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Restaurant",
            },
        ], // Empty array = valid for all restaurants
        isActive: {
            type: Boolean,
            default: true,
        },
        firstTimeUserOnly: {
            type: Boolean,
            default: false,
        },
        bannerImage: {
            type: String, // URL for carousel
            default: null,
        },
    },
    { timestamps: true }
);

export default mongoose.models.Coupon || mongoose.model("Coupon", couponSchema);
