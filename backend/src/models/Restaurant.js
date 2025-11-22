import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: { type: String, required: true },
  description: String,
  image: String,
  phone: String,
  location: {
    address: { type: String, default: "" },
    city: { type: String, default: "" },
    pincode: { type: String, default: "" },
  },
  menu: [{ type: mongoose.Schema.Types.ObjectId, ref: "MenuItem", default: [] }],
  cuisine: [{ type: String }], // array of strings
  rating: { type: Number, default: 0 },
  isOpen: { type: Boolean, default: true },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },
}, { timestamps: true });

export default mongoose.model("Restaurant", restaurantSchema);
