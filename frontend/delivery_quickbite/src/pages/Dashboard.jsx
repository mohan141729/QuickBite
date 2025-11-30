import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import api from "../api/axios";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import {
    Package,
    TrendingUp,
    Star,
    Clock,
    MapPin,
    Navigation,
    CheckCircle,
    XCircle,
    Loader2,
    DollarSign,
    Bike,
    Award,
    AlertCircle,
} from "lucide-react";

const Dashboard = () => {
    const { user } = useAuth();
    const { socket } = useSocket();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        todayEarnings: 0,
        todayDeliveries: 0,
        weekDeliveries: 0,
        avgRating: 0,
        activeOrders: 0,
    });
    const [availableOrders, setAvailableOrders] = useState([]);
    const [activeDelivery, setActiveDelivery] = useState(null);
    const [recentActivity, setRecentActivity] = useState([]);
    const [isOnline, setIsOnline] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);

    // Location Tracking
    useEffect(() => {
        let watchId;
        if (isOnline && activeDelivery && activeDelivery.orderStatus === "on_the_way") {
            if ("geolocation" in navigator) {
                watchId = navigator.geolocation.watchPosition(
                    async (position) => {
                        const { latitude, longitude } = position.coords;
                        console.log("📍 Location update:", latitude, longitude);

                        try {
                            await api.put("/api/delivery/location", {
                                lat: latitude,
                                lng: longitude
                            });
                        } catch (err) {
                            console.error("Failed to update location API", err);
                        }

                        if (socket) {
                            socket.emit("update-location", {
                                orderId: activeDelivery._id,
                                customerId: activeDelivery.user?._id,
                                location: { lat: latitude, lng: longitude }
                            });
                        }
                    },
                    (error) => {
                        console.error("Location error:", error);
                        toast.error("Please enable location services");
                    },
                    { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
                );
            }
        }

        return () => {
            if (watchId) navigator.geolocation.clearWatch(watchId);
        };
    }, [isOnline, activeDelivery, socket]);

    // Fetch dashboard data
    useEffect(() => {
        fetchDashboardData();

        if (socket) {
            socket.on("new-delivery-request", (data) => {
                console.log("🔔 New order received:", data);
                toast("New order available!", { icon: "📦" });
                fetchDashboardData();
            });

            socket.on("order-update", (data) => {
                console.log("🔔 Order updated:", data);
                fetchDashboardData();
            });

            return () => {
                socket.off("new-delivery-request");
                socket.off("order-update");
            };
        }
    }, [socket]);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);

            const ordersResponse = await api.get("/api/delivery/orders");
            const historyResponse = await api.get("/api/delivery/history");

            if (ordersResponse.data && ordersResponse.data.orders) {
                const allOrders = ordersResponse.data.orders;
                const available = allOrders.filter(order => !order.deliveryPartner);
                const active = allOrders.find(order => order.deliveryPartner);

                setAvailableOrders(available);
                setActiveDelivery(active || null);
            }

            if (historyResponse.data && historyResponse.data.orders) {
                setRecentActivity(historyResponse.data.orders.slice(0, 5));

                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const todayOrders = historyResponse.data.orders.filter(order => new Date(order.updatedAt) >= today);

                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                const weekOrders = historyResponse.data.orders.filter(order => new Date(order.updatedAt) >= weekAgo);

                setStats({
                    todayEarnings: todayOrders.length * 40,
                    todayDeliveries: todayOrders.length,
                    weekDeliveries: weekOrders.length,
                    avgRating: 4.7,
                    activeOrders: ordersResponse.data.orders?.length || 0,
                });
            }
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
            toast.error("Failed to load dashboard data");
        } finally {
            setLoading(false);
        }
    };

    const handleAcceptOrder = async (orderId) => {
        try {
            setActionLoading(orderId);
            await api.put(`/api/delivery/accept/${orderId}`);
            toast.success("Order accepted! Start picking up.");
            fetchDashboardData();
        } catch (error) {
            console.error("Error accepting order:", error);
            toast.error(error.response?.data?.message || "Failed to accept order");
        } finally {
            setActionLoading(null);
        }
    };

    const handleUpdateStatus = async (orderId, newStatus) => {
        try {
            setActionLoading(orderId);
            await api.put(`/api/delivery/status/${orderId}`, { status: newStatus });
            toast.success(`Order status updated to ${newStatus}`);
            fetchDashboardData();
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("Failed to update order status");
        } finally {
            setActionLoading(null);
        }
    };

    const toggleAvailability = async () => {
        try {
            const newStatus = !isOnline;
            await api.put(`/api/delivery/toggle/${user._id}`, { isAvailable: newStatus });
            setIsOnline(newStatus);
            toast.success(newStatus ? "You are now online" : "You are now offline");
        } catch (error) {
            console.error("Error toggling availability:", error);
            toast.error("Failed to update availability status");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="skeleton h-32 rounded-2xl" />
                        ))}
                    </div>
                    <div className="skeleton h-96 rounded-2xl" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8 animate-fade-in">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                                Welcome back, <span className="gradient-text">{user?.name?.split(" ")[0]}</span>! 👋
                            </h1>
                            <p className="text-gray-600">Here's what's happening with your deliveries today</p>
                        </div>

                        <button
                            onClick={toggleAvailability}
                            className={`flex items-center gap-3 px-6 py-3 rounded-full font-semibold transition-all transform hover:scale-105 ${isOnline
                                ? "bg-green-500 text-white shadow-lg shadow-green-500/30"
                                : "bg-gray-400 text-white shadow-lg shadow-gray-400/30"
                                }`}
                        >
                            <div className={`w-3 h-3 rounded-full ${isOnline ? "bg-white animate-pulse" : "bg-gray-200"}`} />
                            {isOnline ? "Online" : "Offline"}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 card-hover animate-slide-up">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                                <DollarSign className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" /> +12%
                            </span>
                        </div>
                        <h3 className="text-gray-600 text-sm font-medium mb-1">Today's Earnings</h3>
                        <p className="text-3xl font-bold text-gray-900">₹{stats.todayEarnings}</p>
                        <p className="text-xs text-gray-500 mt-2">{stats.todayDeliveries} deliveries</p>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 card-hover animate-slide-up" style={{ animationDelay: "0.1s" }}>
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                                <Package className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <h3 className="text-gray-600 text-sm font-medium mb-1">This Week</h3>
                        <p className="text-3xl font-bold text-gray-900">{stats.weekDeliveries}</p>
                        <p className="text-xs text-gray-500 mt-2">deliveries completed</p>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 card-hover animate-slide-up" style={{ animationDelay: "0.2s" }}>
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
                                <Star className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <h3 className="text-gray-600 text-sm font-medium mb-1">Average Rating</h3>
                        <p className="text-3xl font-bold text-gray-900">{stats.avgRating}</p>
                        <div className="flex items-center gap-1 mt-2">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 card-hover animate-slide-up" style={{ animationDelay: "0.3s" }}>
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                                <Bike className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <h3 className="text-gray-600 text-sm font-medium mb-1">Active Orders</h3>
                        <p className="text-3xl font-bold text-gray-900">{stats.activeOrders}</p>
                        <p className="text-xs text-gray-500 mt-2">ready to deliver</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        {activeDelivery && (
                            <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 shadow-xl text-white animate-slide-up">
                                <div className="flex items-center gap-2 mb-4">
                                    <Bike className="w-6 h-6 animate-bounce" />
                                    <h2 className="text-xl font-bold">Active Delivery</h2>
                                </div>

                                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-4">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h3 className="font-bold text-lg">{activeDelivery.restaurant?.name || "Restaurant"}</h3>
                                            <p className="text-sm text-white/80">Order #{activeDelivery._id.slice(-6).toUpperCase()}</p>
                                        </div>
                                        <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-semibold">
                                            ₹40.00
                                        </span>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-start gap-2">
                                            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <p className="text-xs text-white/70">Customer</p>
                                                <p className="text-sm font-medium">{activeDelivery.user?.name || "Customer"}</p>
                                                <p className="text-xs text-white/90">{activeDelivery.address || "Address"}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-3">
                                    {activeDelivery.orderStatus === "preparing" && (
                                        <div className="flex-1 bg-white/20 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2">
                                            <Clock className="w-5 h-5 animate-pulse" />
                                            Waiting for Restaurant...
                                        </div>
                                    )}

                                    {activeDelivery.orderStatus === "ready" && (
                                        <button
                                            onClick={() => handleUpdateStatus(activeDelivery._id, "picked_up")}
                                            disabled={actionLoading === activeDelivery._id}
                                            className="flex-1 bg-white text-orange-600 font-semibold py-3 px-4 rounded-xl hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
                                        >
                                            {actionLoading === activeDelivery._id ? (
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                            ) : (
                                                <>
                                                    <Package className="w-5 h-5" />
                                                    Pick Up Order
                                                </>
                                            )}
                                        </button>
                                    )}

                                    {(activeDelivery.orderStatus === "picked_up" || activeDelivery.orderStatus === "on_the_way") && (
                                        <button
                                            onClick={() => handleUpdateStatus(activeDelivery._id, "delivered")}
                                            disabled={actionLoading === activeDelivery._id}
                                            className="flex-1 bg-white text-green-600 font-semibold py-3 px-4 rounded-xl hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
                                        >
                                            {actionLoading === activeDelivery._id ? (
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                            ) : (
                                                <>
                                                    <CheckCircle className="w-5 h-5" />
                                                    Complete Delivery
                                                </>
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    <Package className="w-6 h-6 text-orange-500" />
                                    Available Orders
                                </h2>
                                {availableOrders.length > 0 && (
                                    <span className="notification-badge">{availableOrders.length}</span>
                                )}
                            </div>

                            {availableOrders.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Package className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No orders available</h3>
                                    <p className="text-gray-500">New orders will appear here when restaurants prepare them</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {availableOrders.map((order, index) => (
                                        <div
                                            key={order._id}
                                            className="border border-gray-200 rounded-xl p-4 hover:border-orange-300 hover:shadow-md transition-all animate-slide-up"
                                            style={{ animationDelay: `${index * 0.1}s` }}
                                        >
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex-1">
                                                    <h3 className="font-bold text-lg text-gray-900">{order.restaurant?.name || "Restaurant"}</h3>
                                                    <p className="text-sm text-gray-500">Order #{order._id.slice(-6).toUpperCase()}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-green-600 text-lg">+ ₹40.00</p>
                                                    <p className="text-xs text-gray-500">delivery fee</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-2 mb-4 text-sm">
                                                <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                                <div>
                                                    <p className="text-gray-600">{order.user?.name || "Customer"}</p>
                                                    <p className="text-gray-500 text-xs">{order.address || "Address not provided"}</p>
                                                </div>
                                            </div>

                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => handleAcceptOrder(order._id)}
                                                    disabled={actionLoading === order._id}
                                                    className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold py-3 px-4 rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
                                                >
                                                    {actionLoading === order._id ? (
                                                        <Loader2 className="w-5 h-5 animate-spin" />
                                                    ) : (
                                                        <>
                                                            <CheckCircle className="w-5 h-5" />
                                                            Accept
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 sticky top-24">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <Clock className="w-6 h-6 text-orange-500" />
                                Recent Activity
                            </h2>

                            {recentActivity.length === 0 ? (
                                <div className="text-center py-8">
                                    <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-500 text-sm">No recent deliveries</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {recentActivity.map((order) => (
                                        <div key={order._id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                <CheckCircle className="w-5 h-5 text-green-600" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-sm text-gray-900 truncate">
                                                    {order.restaurant?.name || order.restaurantName || "Restaurant"}
                                                </p>
                                                <p className="text-xs text-gray-500 truncate">{order.user?.name || order.customerName || "Customer"}</p>
                                                <p className="text-xs text-green-600 font-semibold mt-1">+ ₹40.00</p>
                                            </div>
                                            <span className="text-xs text-gray-400 whitespace-nowrap">
                                                {new Date(order.updatedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {recentActivity.length > 0 && (
                                <button className="w-full mt-4 text-orange-600 font-semibold text-sm hover:text-orange-700 transition-colors">
                                    View All History →
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
