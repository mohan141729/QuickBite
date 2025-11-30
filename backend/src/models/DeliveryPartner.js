import mongoose from "mongoose"

const deliveryPartnerSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    isAvailable: { type: Boolean, default: true },
    currentOrder: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
    totalDeliveries: { type: Number, default: 0 },
    earnings: { type: Number, default: 0 },
    activeZone: { type: String },
    vehicleType: { type: String, enum: ["bike", "scooter", "bicycle", "electric"] },
    documents: {
      license: { type: String },
      rc: { type: String },
      insurance: { type: String }
    },
    rating: { type: Number, default: 0 },
    currentLocation: {
      type: { type: String, default: "Point" },
      coordinates: { type: [Number], index: "2dsphere" } // [lng, lat]
    },
    lastLocationUpdate: { type: Date, default: Date.now },
    location: { // Deprecated, use currentLocation
      lat: Number,
      lng: Number,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending"
    },
  },
  { timestamps: true }
)

// ✅ Add geospatial index for fast location search
deliveryPartnerSchema.index({ currentLocation: "2dsphere" });

export default mongoose.models.DeliveryPartner || mongoose.model("DeliveryPartner", deliveryPartnerSchema)

