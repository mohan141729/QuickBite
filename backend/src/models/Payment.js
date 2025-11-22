import mongoose from "mongoose"

const paymentSchema = new mongoose.Schema(
  {
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    method: {
      type: String,
      enum: ["COD", "Razorpay", "Stripe"],
      default: "COD",
    },
    status: {
      type: String,
      enum: ["initiated", "success", "failed"],
      default: "initiated",
    },
    transactionId: { type: String },
  },
  { timestamps: true }
)

export default mongoose.model("Payment", paymentSchema)
