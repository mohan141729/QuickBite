import mongoose from "mongoose";

const incentiveSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
        target: {
            type: Number,
            required: true, // e.g., 5 orders
        },
        reward: {
            type: Number,
            required: true, // e.g., 200 rupees
        },
        type: {
            type: String,
            enum: ["daily", "weekly", "per_order"],
            default: "daily",
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        color: {
            type: String,
            default: "from-blue-500 to-indigo-600", // Gradient classes
        },
        bgColor: {
            type: String,
            default: "bg-blue-50",
        },
        textColor: {
            type: String,
            default: "text-blue-600",
        },
        icon: {
            type: String,
            default: "Zap", // Icon name from lucide-react
        },
        startTime: {
            type: String, // e.g., "18:00"
            default: "",
        },
        endTime: {
            type: String, // e.g., "22:00"
            default: "",
        },
    },
    { timestamps: true }
);

const Incentive = mongoose.model("Incentive", incentiveSchema);

export default Incentive;
