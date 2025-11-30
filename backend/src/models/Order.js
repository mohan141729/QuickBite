import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    customerName: { type: String }, // Snapshot of user name
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
    deliveryPartner: { type: mongoose.Schema.Types.ObjectId, ref: "DeliveryPartner" },
    items: [
      {
        menuItem: { type: mongoose.Schema.Types.ObjectId, ref: "MenuItem", required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        selectedVariant: {
          name: { type: String },
          price: { type: Number }
        },
        selectedAddOns: [{
          name: { type: String },
          price: { type: Number }
        }]
      },
    ],
    subtotal: { type: Number }, // Amount before discount
    discount: { type: Number, default: 0 }, // Discount amount
    couponCode: { type: String }, // Applied coupon code
    totalAmount: { type: Number, required: true }, // Final amount after discount
    deliveryFee: { type: Number, default: 0 },
    packagingFee: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    platformFee: { type: Number, default: 0 },
    surgeFee: { type: Number, default: 0 },
    deliveryInstructions: { type: String },
    address: {
      line1: String,
      city: String,
      pincode: String,
      location: {
        lat: Number,
        lng: Number
      }
    },
    pickupLocation: {
      lat: Number,
      lng: Number
    },
    estimatedDeliveryTime: { type: Date },

    // Cancellation fields
    isCancelled: { type: Boolean, default: false },
    cancelledAt: { type: Date },
    cancelledBy: { type: String, enum: ['customer', 'restaurant', 'admin'] },
    cancellationReason: { type: String },
    refundStatus: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed', 'not_applicable'],
      default: 'not_applicable'
    },
    refundAmount: { type: Number },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },
    orderStatus: {
      type: String,
      enum: [
        "processing",
        "accepted",
        "ready",
        "picked_up",
        "out-for-delivery",
        "delivered",
        "completed",
        "cancelled",
      ],
      default: "processing",
    },
    isReviewed: {
      type: Boolean,
      default: false,
    },
    notes: { type: String },
  },
  { timestamps: true }
);

// ✅ Add indices for performance
orderSchema.index({ user: 1 });
orderSchema.index({ restaurant: 1 });
orderSchema.index({ orderStatus: 1 });

// ✅ Prevent OverwriteModelError on hot reloads
export default mongoose.models.Order || mongoose.model("Order", orderSchema);
