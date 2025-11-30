import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    label: {
      type: String,
      enum: ["Home", "Work", "Other"],
      default: "Home",
    },
    fullAddress: {
      type: String,
      required: true,
    },
    street: {
      type: String,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
    },
    pincode: {
      type: String,
      required: true,
    },
    location: {
      lat: { type: Number },
      lng: { type: Number },
    },
    instructions: {
      type: String,
      default: "",
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Index for faster queries
addressSchema.index({ user: 1 });
addressSchema.index({ user: 1, isDefault: 1 });

export default mongoose.models.Address || mongoose.model("Address", addressSchema);
