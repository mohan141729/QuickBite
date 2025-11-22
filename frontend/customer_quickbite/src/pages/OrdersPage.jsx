import React, { useEffect, useState } from "react"
import { getMyOrders } from "../api/orders"
import Navbor from "../components/Navbor"
import { Loader2, PackageCheck, MapPin, Wifi, WifiOff } from "lucide-react"
import TrackOrderDrawer from "../components/TrackOrderDrawer"
import FeedbackModal from "../components/FeedbackModal"
import { useSocket } from "../context/SocketContext"

const OrdersPage = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [feedbackOrder, setFeedbackOrder] = useState(null)
  const { socket, isConnected } = useSocket()

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await getMyOrders()
        setOrders(res || [])

        // Find the most recent delivered order that hasn't been reviewed
        const unreviewedOrder = res?.find(
          (o) => o.orderStatus === "delivered" && !o.isReviewed
        )
        if (unreviewedOrder) {
          setFeedbackOrder(unreviewedOrder)
        }
      } catch (err) {
        console.error("Failed to fetch orders:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  // ✅ Listen for real-time order status updates via WebSocket
  useEffect(() => {
    if (!socket) return;

    const handleOrderStatusUpdate = (data) => {
      console.log('📡 Received order status update:', data);

      // Update the orders list with the new status
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === data.orderId
            ? { ...order, orderStatus: data.orderStatus, ...data.order }
            : order
        )
      );

      // Also update selected order if it's the one being tracked
      if (selectedOrder && selectedOrder._id === data.orderId) {
        setSelectedOrder((prev) => ({
          ...prev,
          orderStatus: data.orderStatus,
          ...data.order,
        }));
      }

      // Show notification (optional)
      if (Notification.permission === 'granted') {
        new Notification('Order Status Updated', {
          body: `Your order is now ${data.orderStatus}`,
          icon: '/logo.png',
        });
      }
    };

    socket.on('order-status-updated', handleOrderStatusUpdate);

    // Cleanup listener on unmount
    return () => {
      socket.off('order-status-updated', handleOrderStatusUpdate);
    };
  }, [socket, selectedOrder]);

  const handleFeedbackSuccess = () => {
    // Update local state to mark order as reviewed so popup doesn't reappear immediately
    if (feedbackOrder) {
      setOrders((prev) =>
        prev.map((o) =>
          o._id === feedbackOrder._id ? { ...o, isReviewed: true } : o
        )
      )
      setFeedbackOrder(null)
    }
  }

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-orange-500">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        Loading your orders...
      </div>
    )

  if (!orders.length)
    return (
      <div className="min-h-screen bg-quickbite-bg">
        <Navbor />
        <div className="pt-24 flex flex-col items-center justify-center text-gray-500">
          <PackageCheck className="w-16 h-16 mb-3 text-gray-400" />
          <p className="text-lg font-medium">No orders placed yet</p>
        </div>
      </div>
    )

  return (
    <div className="min-h-screen bg-quickbite-bg">
      <Navbor />
      <div className="max-w-5xl mx-auto px-4 pt-24 pb-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>

          {/* WebSocket Connection Status */}
          <div className="flex items-center gap-2">
            {isConnected ? (
              <>
                <Wifi className="w-4 h-4 text-green-600" />
                <span className="text-xs text-green-600 font-medium">Live Updates</span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4 text-gray-400" />
                <span className="text-xs text-gray-400 font-medium">Offline</span>
              </>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {orders.map((order) => {
            const restaurantName =
              order.restaurant?.name || "Unknown Restaurant"
            const address = order.address
              ? `${order.address.line1}, ${order.address.city} - ${order.address.pincode}`
              : "Address not available"

            return (
              <div
                key={order._id}
                onClick={() => setSelectedOrder(order)}
                className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 hover:shadow-md transition cursor-pointer"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                      {restaurantName}
                    </h2>
                    <p className="text-sm text-gray-500">
                      Order ID: {order._id.slice(-6).toUpperCase()}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${order.orderStatus === "delivered"
                        ? "bg-green-100 text-green-600"
                        : order.orderStatus === "cancelled"
                          ? "bg-red-100 text-red-600"
                          : "bg-orange-100 text-orange-600"
                        }`}
                    >
                      {order.orderStatus || "Processing"}
                    </span>
                    {order.isReviewed && (
                      <span className="text-xs text-green-600 font-medium">Reviewed ✓</span>
                    )}
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-700">
                  {order.items.map((i) => (
                    <div
                      key={i._id}
                      className="flex justify-between border-b border-gray-100 pb-1"
                    >
                      <span>
                        {i.menuItem?.name || "Unknown Item"} × {i.quantity}
                      </span>
                      <span>₹{i.price * i.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
                  <p className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-orange-500" />
                    {address}
                  </p>
                  <p className="font-semibold text-gray-900">
                    Total: ₹{order.totalAmount || 0}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 🧾 Track Order Drawer */}
      {selectedOrder && (
        <TrackOrderDrawer
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}

      {/* ⭐ Feedback Modal */}
      {feedbackOrder && (
        <FeedbackModal
          order={feedbackOrder}
          onClose={() => setFeedbackOrder(null)}
          onSuccess={handleFeedbackSuccess}
        />
      )}
    </div>
  )
}

export default OrdersPage
