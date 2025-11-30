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
    lat: { type: Number },
    lng: { type: Number }
  },
  menu: [{ type: mongoose.Schema.Types.ObjectId, ref: "MenuItem", default: [] }],
  cuisine: [{ type: String }], // array of strings
  categories: [{
    name: { type: String, required: true },
    image: { type: String, default: "" }
  }],
  operatingHours: {
    open: { type: String, default: "09:00" },
    close: { type: String, default: "22:00" },
    holidays: [{ type: String }] // Array of days e.g., "Monday"
  },
  deliveryRadius: { type: Number, default: 5 }, // in km
  commissionRate: { type: Number, default: 20 }, // percentage
  isSurgeActive: { type: Boolean, default: false },
  bankAccount: {
    accountNumber: { type: String },
    ifscCode: { type: String },
    accountHolderName: { type: String }
  },
  documents: {
    fssai: { type: String },
    gst: { type: String }
  },
  rating: { type: Number, default: 0 },
  isOpen: { type: Boolean, default: true },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },
}, { timestamps: true });

// ✅ Add geospatial index for location-based search
restaurantSchema.index({ "location": "2dsphere" });

export default mongoose.models.Restaurant || mongoose.model("Restaurant", restaurantSchema);
