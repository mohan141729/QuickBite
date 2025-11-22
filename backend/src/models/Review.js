import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        restaurant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Restaurant",
            required: true,
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        comment: {
            type: String,
            required: true,
            trim: true,
        },
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
        },
    },
    { timestamps: true }
);

// Prevent user from reviewing the same order multiple times
reviewSchema.index({ order: 1, user: 1 }, { unique: true, partialFilterExpression: { order: { $exists: true } } });

export default mongoose.model("Review", reviewSchema);
