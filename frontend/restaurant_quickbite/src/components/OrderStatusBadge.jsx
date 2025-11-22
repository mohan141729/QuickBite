import React from "react"

/**
 * Status examples (backend): "pending", "preparing", "ready", "out_for_delivery", "delivered"
 */
const statusMap = {
  pending: { label: "New Order", color: "bg-orange-100 text-orange-700" },
  preparing: { label: "Preparing", color: "bg-yellow-100 text-yellow-800" },
  ready: { label: "Ready", color: "bg-indigo-100 text-indigo-700" },
  out_for_delivery: { label: "Out for Delivery", color: "bg-sky-100 text-sky-700" },
  delivered: { label: "Delivered", color: "bg-green-100 text-green-700" },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-700" },
  default: { label: "Unknown", color: "bg-gray-100 text-gray-700" },
}

const OrderStatusBadge = ({ status }) => {
  const s = (status || "default").toString().toLowerCase()
  const cfg = statusMap[s] || statusMap.default

  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${cfg.color}`}
    >
      <span
        className="w-2 h-2 rounded-full"
        aria-hidden
        style={{ background: "currentColor", opacity: 0.25 }}
      />
      <span>{cfg.label}</span>
    </span>
  )
}

export default OrderStatusBadge
