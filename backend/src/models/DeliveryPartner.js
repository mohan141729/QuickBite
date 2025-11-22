import mongoose from "mongoose"

const deliveryPartnerSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    isAvailable: { type: Boolean, default: true },
    currentOrder: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
    totalDeliveries: { type: Number, default: 0 },
    earnings: { type: Number, default: 0 },
    location: {
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

export default mongoose.model("DeliveryPartner", deliveryPartnerSchema)

