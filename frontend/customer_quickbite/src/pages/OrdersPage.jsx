import React, { useEffect, useState, useRef } from "react";
import { getMyOrders, cancelOrder } from "../api/orders";
import Navbar from "../components/Navbar";
import {
  Loader2,
  Package,
  MapPin,
  Wifi,
  WifiOff,
  XCircle,
  Star,
  Clock,
  ChevronRight,
  ShoppingBag,
  ArrowRight
} from "lucide-react";
import TrackOrderDrawer from "../components/TrackOrderDrawer";
import ReviewFormModal from "../components/ReviewFormModal";
import CancelOrderModal from "../components/CancelOrderModal";
import { useSocket } from "../context/SocketContext";
import { useNavigate } from "react-router-dom";

const OrdersPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("active"); // "active" | "completed"

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [reviewOrder, setReviewOrder] = useState(null);
  const [cancellingOrder, setCancellingOrder] = useState(null);

  const { socket, isConnected } = useSocket();
  const selectedOrderIdRef = useRef(null);

  // Keep track of the selected order ID so we can verify Socket.IO updates
  useEffect(() => {
    selectedOrderIdRef.current = selectedOrder?._id;
  }, [selectedOrder]);

  // Request notification permission on mount
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await getMyOrders();
        // Sort by newest first
        const sorted = (res || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setOrders(sorted);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Listen for real-time status updates via WebSocket
  useEffect(() => {
    if (!socket) return;

    const handleOrderStatusUpdate = (data) => {
      console.log('📡 Received order status update:', data);

      // Update the order in the list
      setOrders((prev) =>
        prev.map((o) => (o._id === data.orderId ? { ...o, orderStatus: data.orderStatus } : o))
      );

      // Update selected order if it's the one being tracked
      if (data.orderId === selectedOrderIdRef.current) {
        setSelectedOrder((prev) => ({ ...prev, orderStatus: data.orderStatus }));
      }

      // Show notification
      if (Notification.permission === 'granted') {
        new Notification('Order Status Updated', {
          body: `Your order is now ${data.orderStatus.replace("_", " ")}`,
          icon: '/logo.png',
        });
      }
    };

    socket.on('order-status-updated', handleOrderStatusUpdate);

    return () => {
      socket.off('order-status-updated', handleOrderStatusUpdate);
    };
  }, [socket]);

  // Filter orders based on active tab
  const activeOrders = orders.filter(o =>
    ['processing', 'accepted', 'preparing', 'ready', 'on_the_way', 'picked_up', 'out-for-delivery'].includes(o.orderStatus)
  );

  const completedOrders = orders.filter(o =>
    ['delivered', 'cancelled'].includes(o.orderStatus)
  );

  const displayedOrders = activeTab === "active" ? activeOrders : completedOrders;

  const getStatusColor = (status) => {
    switch (status) {
      case 'processing': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'accepted': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'preparing': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'ready': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'picked_up':
      case 'on_the_way':
      case 'out-for-delivery': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'delivered': return 'bg-green-100 text-green-700 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusLabel = (status) => {
    return status?.replace(/_/g, " ").replace(/-/g, " ") || "Unknown";
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <Loader2 className="w-10 h-10 animate-spin text-[#FC8019] mb-4" />
        <p className="text-gray-500 font-medium">Loading your cravings...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 pt-28 pb-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
            <p className="text-gray-500 mt-1">Track and manage your recent orders</p>
          </div>

          {/* Connection Status */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${isConnected ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
            {isConnected ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
            {isConnected ? 'Live Updates On' : 'Connecting...'}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex p-1 bg-white rounded-xl shadow-sm border border-gray-200 mb-8 w-full md:w-fit">
          <button
            onClick={() => setActiveTab("active")}
            className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${activeTab === "active"
                ? "bg-gray-900 text-white shadow-md"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
          >
            Active Orders ({activeOrders.length})
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${activeTab === "completed"
                ? "bg-gray-900 text-white shadow-md"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
          >
            Past Orders ({completedOrders.length})
          </button>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {displayedOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-200 shadow-sm text-center px-4">
              <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mb-6">
                <ShoppingBag className="w-10 h-10 text-[#FC8019]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {activeTab === "active" ? "No active orders" : "No past orders"}
              </h3>
              <p className="text-gray-500 max-w-sm mb-8">
                {activeTab === "active"
                  ? "Hungry? Place an order now and track it here in real-time!"
                  : "Looks like you haven't ordered anything yet. Time to explore!"}
              </p>
              <button
                onClick={() => navigate('/')}
                className="px-8 py-3 bg-[#FC8019] hover:bg-[#e66e16] text-white rounded-full font-bold shadow-lg shadow-orange-200 transition-all flex items-center gap-2"
              >
                Browse Restaurants <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            displayedOrders.map((order) => {
              const restaurantName = order.restaurant?.name || "Unknown Restaurant";
              const restaurantImage = order.restaurant?.image || "https://res.cloudinary.com/ds6o1cohi/image/upload/v1720593157/restaurant-placeholder.jpg";
              const itemCount = order.items.reduce((acc, item) => acc + item.quantity, 0);

              return (
                <div
                  key={order._id}
                  onClick={() => setSelectedOrder(order)}
                  className="group bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer"
                >
                  <div className="p-5 sm:p-6">
                    <div className="flex flex-col sm:flex-row gap-5">
                      {/* Restaurant Image */}
                      <div className="w-full sm:w-24 h-32 sm:h-24 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100 relative">
                        <img
                          src={restaurantImage}
                          alt={restaurantName}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
                      </div>

                      {/* Order Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h2 className="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-[#FC8019] transition-colors">
                              {restaurantName}
                            </h2>
                            <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                              {order.address?.city} • {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </p>
                          </div>
                          <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border ${getStatusColor(order.orderStatus)}`}>
                            {getStatusLabel(order.orderStatus)}
                          </span>
                        </div>

                        {/* Items Preview */}
                        <div className="text-sm text-gray-600 mb-4 line-clamp-1">
                          {order.items.map(i => `${i.quantity}x ${i.menuItem?.name}`).join(", ")}
                        </div>

                        {/* Footer Info */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <div className="flex items-center gap-4 text-sm">
                            <span className="font-bold text-gray-900">₹{order.totalAmount}</span>
                            <span className="text-gray-400">|</span>
                            <span className="text-gray-500">{itemCount} Items</span>
                          </div>

                          <div className="flex items-center gap-3">
                            {/* Action Buttons */}
                            {['processing', 'accepted'].includes(order.orderStatus) && (
                              <button
                                onClick={(e) => { e.stopPropagation(); setCancellingOrder(order); }}
                                className="px-4 py-2 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                              >
                                Cancel
                              </button>
                            )}

                            {order.orderStatus === 'delivered' && !order.isReviewed && (
                              <button
                                onClick={(e) => { e.stopPropagation(); setReviewOrder(order); }}
                                className="px-4 py-2 text-xs font-bold text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors flex items-center gap-1"
                              >
                                <Star className="w-3 h-3" /> Rate Food
                              </button>
                            )}

                            <button className="flex items-center gap-1 text-xs font-bold text-[#FC8019] hover:text-[#e66e16] transition-colors">
                              View Details <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Active Order Progress Bar (Visual flair) */}
                  {activeTab === "active" && (
                    <div className="h-1 w-full bg-gray-100">
                      <div
                        className="h-full bg-gradient-to-r from-[#FC8019] to-orange-500"
                        style={{
                          width: order.orderStatus === 'processing' ? '20%' :
                            order.orderStatus === 'accepted' ? '40%' :
                              order.orderStatus === 'preparing' ? '60%' :
                                order.orderStatus === 'ready' ? '80%' :
                                  '90%'
                        }}
                      />
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 🧾 Track Order Drawer */}
      {selectedOrder && (
        <TrackOrderDrawer
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}

      {/* ⭐ Review Form Modal */}
      {reviewOrder && (
        <ReviewFormModal
          order={reviewOrder}
          onClose={() => setReviewOrder(null)}
          onSuccess={() => {
            setOrders(prev => prev.map(o =>
              o._id === reviewOrder._id ? { ...o, isReviewed: true } : o
            ));
            setReviewOrder(null);
          }}
        />
      )}

      {/* ❌ Cancel Order Modal */}
      {cancellingOrder && (
        <CancelOrderModal
          order={cancellingOrder}
          onClose={() => setCancellingOrder(null)}
          onConfirm={async (reason) => {
            try {
              await cancelOrder(cancellingOrder._id, reason);
              setOrders(prev => prev.map(o =>
                o._id === cancellingOrder._id
                  ? { ...o, orderStatus: 'cancelled', isCancelled: true }
                  : o
              ));
              setCancellingOrder(null);
              alert('Order cancelled successfully');
            } catch (error) {
              alert(error.response?.data?.message || 'Failed to cancel order');
            }
          }}
        />
      )}
    </div>
  );
};

export default OrdersPage;
