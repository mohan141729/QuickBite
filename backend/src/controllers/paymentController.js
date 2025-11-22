import Payment from "../models/Payment.js"
import Order from "../models/Order.js"
import crypto from "crypto"

// ✅ Initiate Payment (Online or COD)
export const initiatePayment = async (req, res) => {
  try {
    const { orderId, method } = req.body
    const order = await Order.findById(orderId)
    if (!order) return res.status(404).json({ message: "Order not found" })

    const payment = await Payment.create({
      order: order._id,
      user: req.user._id,
      amount: order.totalPrice,
      method,
      status: method === "COD" ? "success" : "initiated",
      transactionId: method === "COD" ? `COD-${Date.now()}` : undefined,
    })

    // Auto-confirm COD payments
    if (method === "COD") {
      order.paymentStatus = "paid"
      order.status = "confirmed"
      await order.save()
    }

    res.status(201).json({
      message: "Payment initiated successfully",
      paymentId: payment._id,
      status: payment.status,
      amount: payment.amount,
      method: payment.method,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ✅ Simulate Payment Verification (like Razorpay)
export const verifyPayment = async (req, res) => {
  try {
    const { paymentId, success } = req.body
    const payment = await Payment.findById(paymentId).populate("order")

    if (!payment) return res.status(404).json({ message: "Payment not found" })

    if (success) {
      payment.status = "success"
      payment.transactionId = crypto.randomUUID()
      await payment.save()

      payment.order.paymentStatus = "paid"
      payment.order.status = "confirmed"
      await payment.order.save()
      return res.json({ message: "Payment verified successfully", payment })
    } else {
      payment.status = "failed"
      await payment.save()
      return res.json({ message: "Payment failed", payment })
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ✅ Get All Payments (Admin)
export const getAllPayments = async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ message: "Not authorized" })
    const payments = await Payment.find()
      .populate("user", "name email")
      .populate("order", "totalPrice status")
    res.json(payments)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
