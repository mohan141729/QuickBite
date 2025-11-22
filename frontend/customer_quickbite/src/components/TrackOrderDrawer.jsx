import React from "react"
import { X, CheckCircle2, Bike, UtensilsCrossed, Clock } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const steps = [
  { label: "Order Placed", icon: <Clock className="w-5 h-5" /> },
  { label: "Being Prepared", icon: <UtensilsCrossed className="w-5 h-5" /> },
  { label: "Out for Delivery", icon: <Bike className="w-5 h-5" /> },
  { label: "Delivered", icon: <CheckCircle2 className="w-5 h-5" /> },
]

const TrackOrderDrawer = ({ order, onClose }) => {
  if (!order) return null

  // Map order status to progress step
  const stepIndex = {
    processing: 1,
    preparing: 2,
    out_for_delivery: 3,
    delivered: 4,
  }[order.orderStatus] || 1

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[2000] bg-black/40 backdrop-blur-sm flex justify-end"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
          className="w-full sm:w-[440px] h-full bg-white shadow-2xl rounded-l-2xl flex flex-col overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b">
            <h2 className="text-lg font-semibold text-gray-800">
              Track Your Order
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Details */}
          <div className="p-5 border-b bg-gray-50">
            <p className="font-semibold text-gray-900">
              {order.restaurant?.name || "Restaurant"}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Order ID: {order._id.slice(-6).toUpperCase()}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Total: ₹{order.totalAmount}
            </p>
          </div>

          {/* Timeline */}
          <div className="flex-1 p-6 space-y-6">
            {steps.map((step, idx) => {
              const active = idx + 1 <= stepIndex
              return (
                <div key={idx} className="flex items-start gap-4 relative">
                  <div
                    className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${active
                        ? "border-orange-500 bg-orange-50 text-orange-600"
                        : "border-gray-300 text-gray-400"
                      }`}
                  >
                    {step.icon}
                  </div>
                  <div className="flex-1">
                    <p
                      className={`font-medium ${active ? "text-gray-900" : "text-gray-400"
                        }`}
                    >
                      {step.label}
                    </p>
                    {active && (
                      <p className="text-xs text-gray-500 mt-1">
                        {idx === 0
                          ? "Your order has been placed successfully."
                          : idx === 1
                            ? "The restaurant is preparing your food."
                            : idx === 2
                              ? "Our delivery partner is on the way."
                              : "Enjoy your meal!"}
                      </p>
                    )}
                  </div>
                  {idx < steps.length - 1 && (
                    <div
                      className={`absolute left-[15px] top-[34px] h-10 border-l-2 ${active ? "border-orange-400" : "border-gray-200"
                        }`}
                    />
                  )}
                </div>
              )
            })}
          </div>

          {/* Footer */}
          <div className="p-5 border-t bg-gray-50">
            <p className="text-sm text-gray-600">
              Estimated delivery:{" "}
              <span className="font-semibold text-gray-900">
                25–35 mins
              </span>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default TrackOrderDrawer
