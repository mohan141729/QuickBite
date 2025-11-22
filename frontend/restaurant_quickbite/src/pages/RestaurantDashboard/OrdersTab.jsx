import React, { useEffect, useState } from "react";
import { getRestaurantOrders, updateOrderStatus } from "../../api/orders";
import { useSocket } from "../../context/SocketContext";
import {
  Loader2,
  Circle,
  Clock,
  User,
  Phone,
  MapPin,
  Package,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronDown,
  Filter,
  Search,
  Calendar,
  Wifi,
  WifiOff
} from "lucide-react";

const OrdersTab = ({ restaurantId }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedOrders, setExpandedOrders] = useState(new Set());
  const { socket, isConnected } = useSocket();

  // Fetch restaurant orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await getRestaurantOrders(restaurantId);
        const data =
          Array.isArray(res?.orders) ? res.orders :
            Array.isArray(res?.data) ? res.data :
              Array.isArray(res) ? res : [];

        // Sort by createdAt descending (newest first)
        data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setOrders(data);
      } catch (err) {
        console.error("❌ Failed to fetch orders:", err);
        setError("Failed to load orders.");
      } finally {
        setLoading(false);
      }
    };
    if (restaurantId) fetchOrders();
  }, [restaurantId]);

  // ✅ Listen for real-time order status updates via WebSocket
  useEffect(() => {
    if (!socket) return;

    const handleOrderStatusUpdate = (data) => {
      console.log('📡 Restaurant received order status update:', data);

      // Update the orders list with the new status
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === data.orderId
            ? { ...order, orderStatus: data.orderStatus, ...data.order }
            : order
        )
      );

      // Show browser notification
      if (Notification.permission === 'granted') {
        new Notification('Order Status Updated', {
          body: `Order #${data.orderId.slice(-6).toUpperCase()} is now ${data.orderStatus}`,
          icon: '/logo.png',
        });
      }
    };

    socket.on('order-status-updated', handleOrderStatusUpdate);

    // Cleanup listener on unmount
    return () => {
      socket.off('order-status-updated', handleOrderStatusUpdate);
    };
  }, [socket]);

  // Handle order status update
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdating(orderId);
      await updateOrderStatus(orderId, newStatus);
      setOrders(prev =>
        prev.map(order =>
          order._id === orderId ? { ...order, orderStatus: newStatus } : order
        )
      );
    } catch (err) {
      console.error("❌ Failed to update order status:", err);
      alert("Failed to update order status.");
    } finally {
      setUpdating("");
    }
  };

  // Toggle order expansion
  const toggleExpand = (orderId) => {
    setExpandedOrders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  // Filter orders by status and search
  const filteredOrders = orders.filter(order => {
    const matchesFilter = activeFilter === "All" ||
      order.orderStatus === activeFilter.toLowerCase();

    const matchesSearch = !searchTerm ||
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items?.some(item =>
        item.menuItem?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );

    return matchesFilter && matchesSearch;
  });

  // Get order counts by status
  const statusCounts = {
    all: orders.length,
    processing: orders.filter(o => o.orderStatus === "processing").length,
    accepted: orders.filter(o => o.orderStatus === "accepted").length,
    ready: orders.filter(o => o.orderStatus === "ready").length,
    delivered: orders.filter(o => o.orderStatus === "delivered").length,
    cancelled: orders.filter(o => o.orderStatus === "cancelled").length,
  };

  // Order status badge
  const StatusBadge = ({ status }) => {
    const statusConfig = {
      processing: {
        label: "New Order",
        color: "text-orange-700 bg-orange-100 border-orange-200",
        icon: AlertCircle
      },
      accepted: {
        label: "Preparing",
        color: "text-blue-700 bg-blue-100 border-blue-200",
        icon: Clock
      },
      ready: {
        label: "Ready",
        color: "text-purple-700 bg-purple-100 border-purple-200",
        icon: Package
      },
      out_for_delivery: {
        label: "Out for Delivery",
        color: "text-indigo-700 bg-indigo-100 border-indigo-200",
        icon: Package
      },
      delivered: {
        label: "Delivered",
        color: "text-green-700 bg-green-100 border-green-200",
        icon: CheckCircle
      },
      cancelled: {
        label: "Cancelled",
        color: "text-red-700 bg-red-100 border-red-200",
        icon: XCircle
      },
    };

    const config = statusConfig[status] || statusConfig.processing;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${config.color}`}>
        <Icon className="w-3.5 h-3.5" />
        {config.label}
      </span>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-medium">Loading orders...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center gap-3 text-red-600 p-6 bg-red-50 rounded-xl border border-red-200">
        <AlertCircle className="w-6 h-6" />
        <span className="font-medium">{error}</span>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Order Management</h2>
          <p className="text-sm text-gray-500 mt-1">
            Track and manage all incoming orders in real-time
          </p>
        </div>

        {/* WebSocket Connection Status */}
        <div className="flex items-center gap-2">
          {isConnected ? (
            <>
              <Wifi className="w-5 h-5 text-green-600" />
              <span className="text-sm text-green-600 font-medium">Live Updates</span>
            </>
          ) : (
            <>
              <WifiOff className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-400 font-medium">Offline</span>
            </>
          )}
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">{statusCounts.all}</div>
          <div className="text-xs text-gray-500 mt-1">Total</div>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-orange-700">{statusCounts.processing}</div>
          <div className="text-xs text-orange-600 mt-1">New</div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-700">{statusCounts.accepted}</div>
          <div className="text-xs text-blue-600 mt-1">Preparing</div>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-700">{statusCounts.ready}</div>
          <div className="text-xs text-purple-600 mt-1">Ready</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-700">{statusCounts.delivered}</div>
          <div className="text-xs text-green-600 mt-1">Delivered</div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-red-700">{statusCounts.cancelled}</div>
          <div className="text-xs text-red-600 mt-1">Cancelled</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by order ID, customer name, or item..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
            {["All", "Processing", "Accepted", "Ready", "Delivered", "Cancelled"].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${activeFilter === tab
                  ? "bg-[#FC8019] text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
              >
                {tab}
                {tab !== "All" && (
                  <span className="ml-1.5 text-xs opacity-75">
                    ({statusCounts[tab.toLowerCase()]})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 font-medium text-lg">No orders found</p>
            <p className="text-sm text-gray-400 mt-1">
              {searchTerm ? "Try adjusting your search" : "Orders will appear here once customers start ordering"}
            </p>
          </div>
        ) : (
          filteredOrders.map(order => {
            const status = order.orderStatus || "processing";
            const total = order.totalAmount || 0;
            const customer = order.user?.name || "Customer";
            const isExpanded = expandedOrders.has(order._id);

            return (
              <div
                key={order._id}
                className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200"
              >
                {/* Order Header */}
                <div className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">
                          #{order._id?.slice(-8).toUpperCase()}
                        </h3>
                        <StatusBadge status={status} />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="font-medium">{customer}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span>
                            {new Date(order.createdAt).toLocaleString('en-IN', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-2xl font-bold text-[#FC8019]">
                        ₹{total.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {order.items?.length || 0} {order.items?.length === 1 ? 'item' : 'items'}
                      </p>
                    </div>
                  </div>

                  {/* Items Preview */}
                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <button
                      onClick={() => toggleExpand(order._id)}
                      className="flex items-center justify-between w-full text-left"
                    >
                      <p className="text-sm font-semibold text-gray-700">Order Items</p>
                      <ChevronDown
                        className={`w-4 h-4 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''
                          }`}
                      />
                    </button>

                    {isExpanded && (
                      <ul className="mt-3 space-y-2 border-t border-gray-200 pt-3">
                        {order.items?.map((item, i) => (
                          <li key={i} className="flex justify-between items-center text-sm">
                            <span className="text-gray-700">
                              <span className="font-semibold text-[#FC8019]">{item.quantity}×</span>{" "}
                              {item.menuItem?.name || "Item"}
                            </span>
                            <span className="text-gray-600 font-medium">
                              ₹{((item.menuItem?.price || 0) * item.quantity).toFixed(2)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 flex-wrap">
                    {status === "processing" && (
                      <>
                        <button
                          onClick={() => handleStatusChange(order._id, "accepted")}
                          disabled={updating === order._id}
                          className="flex-1 bg-[#FC8019] hover:bg-[#e66e16] text-white px-4 py-2.5 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                        >
                          {updating === order._id ? (
                            <><Loader2 className="w-4 h-4 animate-spin" /> Updating...</>
                          ) : (
                            <><CheckCircle className="w-4 h-4" /> Accept Order</>
                          )}
                        </button>
                        <button
                          onClick={() => handleStatusChange(order._id, "cancelled")}
                          disabled={updating === order._id}
                          className="px-4 py-2.5 border-2 border-red-500 text-red-600 hover:bg-red-50 rounded-lg font-semibold disabled:opacity-50 transition"
                        >
                          Reject
                        </button>
                      </>
                    )}

                    {status === "accepted" && (
                      <button
                        onClick={() => handleStatusChange(order._id, "ready")}
                        disabled={updating === order._id}
                        className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-lg font-semibold disabled:opacity-50 transition flex items-center justify-center gap-2"
                      >
                        {updating === order._id ? (
                          <><Loader2 className="w-4 h-4 animate-spin" /> Updating...</>
                        ) : (
                          <><Package className="w-4 h-4" /> Mark as Ready</>
                        )}
                      </button>
                    )}

                    {status === "ready" && (
                      <button
                        onClick={() => handleStatusChange(order._id, "out_for_delivery")}
                        disabled={updating === order._id}
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg font-semibold disabled:opacity-50 transition flex items-center justify-center gap-2"
                      >
                        {updating === order._id ? (
                          <><Loader2 className="w-4 h-4 animate-spin" /> Updating...</>
                        ) : (
                          <><Package className="w-4 h-4" /> Out for Delivery</>
                        )}
                      </button>
                    )}

                    {status === "out_for_delivery" && (
                      <button
                        onClick={() => handleStatusChange(order._id, "delivered")}
                        disabled={updating === order._id}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg font-semibold disabled:opacity-50 transition flex items-center justify-center gap-2"
                      >
                        {updating === order._id ? (
                          <><Loader2 className="w-4 h-4 animate-spin" /> Updating...</>
                        ) : (
                          <><CheckCircle className="w-4 h-4" /> Mark as Delivered</>
                        )}
                      </button>
                    )}

                    {status === "delivered" && (
                      <div className="flex-1 flex items-center justify-center gap-2 text-green-700 font-semibold bg-green-50 px-4 py-2.5 rounded-lg border border-green-200">
                        <CheckCircle className="w-5 h-5" />
                        Order Completed
                      </div>
                    )}

                    {status === "cancelled" && (
                      <div className="flex-1 flex items-center justify-center gap-2 text-red-700 font-semibold bg-red-50 px-4 py-2.5 rounded-lg border border-red-200">
                        <XCircle className="w-5 h-5" />
                        Order Cancelled
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Results Info */}
      {filteredOrders.length > 0 && (
        <div className="mt-6 text-center text-sm text-gray-500">
          Showing {filteredOrders.length} of {orders.length} orders
        </div>
      )}
    </div>
  );
};

export default OrdersTab;
