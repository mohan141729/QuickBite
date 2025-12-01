import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema(
  {
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
    },
    category: {
      type: String,
      trim: true,
    },
    variants: [{
      name: { type: String },
      price: { type: Number }
    }],
    addOns: [{
      name: { type: String },
      price: { type: Number }
    }],
    isVeg: { type: Boolean, default: true },
    tags: [{ type: String }],
    nutritionalInfo: {
      calories: { type: Number },
      protein: { type: Number },
      carbs: { type: Number },
      fats: { type: Number },
      fiber: { type: Number },
      sodium: { type: Number }
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// ✅ Add index for restaurant lookups
menuItemSchema.index({ restaurant: 1 });

// ✅ Prevent OverwriteModelError
export default mongoose.models.MenuItem || mongoose.model("MenuItem", menuItemSchema);
