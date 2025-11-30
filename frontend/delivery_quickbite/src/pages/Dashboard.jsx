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
import IncentiveCarousel from "../components/IncentiveCarousel";

const Dashboard = () => {
    const { user } = useAuth();
    const { socket } = useSocket();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        todayEarnings: 0,
        todayDeliveries: 0,
        weekDeliveries: 0,
        monthDeliveries: 0,
        monthEarnings: 0,
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

                const monthAgo = new Date();
                monthAgo.setMonth(monthAgo.getMonth() - 1);
                const monthOrders = historyResponse.data.orders.filter(order => new Date(order.updatedAt) >= monthAgo);

                setStats({
                    todayEarnings: todayOrders.length * 40,
                    todayDeliveries: todayOrders.length,
                    weekDeliveries: weekOrders.length,
                    monthDeliveries: monthOrders.length,
                    monthEarnings: monthOrders.length * 40,
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
        <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                            Hello, {user?.name?.split(" ")[0]} 👋
                        </h1>
                        <p className="text-gray-500 mt-1">Let's deliver some happiness today!</p>
                    </div>

                    <button
                        onClick={toggleAvailability}
                        className={`group relative px-6 py-3 rounded-full font-bold transition-all duration-300 shadow-lg hover:shadow-xl ${isOnline
                            ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                            : "bg-white text-gray-400 border border-gray-200"
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${isOnline ? "bg-white animate-pulse" : "bg-gray-300"}`} />
                            <span>{isOnline ? "You are Online" : "You are Offline"}</span>
                        </div>
                    </button>
                </div>

                {/* Incentives Section */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-900">Active Incentives</h2>
                        <button className="text-sm font-medium text-orange-600 hover:text-orange-700">View All</button>
                    </div>
                    <IncentiveCarousel stats={stats} />
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-green-50 rounded-lg text-green-600">
                                <DollarSign size={20} />
                            </div>
                            <span className="text-sm font-medium text-gray-500">Earnings</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">₹{stats.todayEarnings}</p>
                        <p className="text-xs text-green-600 mt-1 font-medium">+12% vs yesterday</p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
                                <Package size={20} />
                            </div>
                            <span className="text-sm font-medium text-gray-500">Deliveries</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{stats.todayDeliveries}</p>
                        <p className="text-xs text-gray-400 mt-1">Today's total</p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                <Clock size={20} />
                            </div>
                            <span className="text-sm font-medium text-gray-500">Hours</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">4.5</p>
                        <p className="text-xs text-gray-400 mt-1">Active hours</p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                                <TrendingUp size={20} />
                            </div>
                            <span className="text-sm font-medium text-gray-500">Monthly</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">₹{stats.monthEarnings}</p>
                        <p className="text-xs text-gray-400 mt-1">{stats.monthDeliveries} Deliveries</p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-yellow-50 rounded-lg text-yellow-600">
                                <Star size={20} />
                            </div>
                            <span className="text-sm font-medium text-gray-500">Rating</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{stats.avgRating}</p>
                        <div className="flex gap-0.5 mt-1">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={12} className={`${i < Math.floor(stats.avgRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`} />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content Area */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Active Delivery Card */}
                        {activeDelivery ? (
                            <div className="bg-white rounded-3xl shadow-xl border border-orange-100 overflow-hidden relative">
                                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-500 to-red-600" />
                                <div className="p-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center animate-pulse">
                                                <Bike className="w-6 h-6 text-orange-600" />
                                            </div>
                                            <div>
                                                <h2 className="text-lg font-bold text-gray-900">Active Delivery</h2>
                                                <p className="text-sm text-orange-600 font-medium">
                                                    {activeDelivery.orderStatus === 'preparing' ? 'Waiting at Restaurant' :
                                                        activeDelivery.orderStatus === 'ready' ? 'Ready for Pickup' :
                                                            activeDelivery.orderStatus === 'picked_up' ? 'On the way to Customer' : 'In Progress'}
                                                </p>
                                            </div>
                                        </div>
                                        <span className="px-4 py-2 bg-gray-900 text-white rounded-xl font-bold text-sm">
                                            #{activeDelivery._id.slice(-4).toUpperCase()}
                                        </span>
                                    </div>

                                    {/* Timeline */}
                                    <div className="relative pl-8 space-y-8 mb-8">
                                        {/* Vertical Line */}
                                        <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-gray-200" />

                                        {/* Restaurant Point */}
                                        <div className="relative">
                                            <div className="absolute -left-[29px] w-6 h-6 bg-white border-4 border-orange-500 rounded-full z-10" />
                                            <div>
                                                <h3 className="font-bold text-gray-900">{activeDelivery.restaurant?.name}</h3>
                                                <p className="text-sm text-gray-500 mt-1">{activeDelivery.restaurant?.address || "Restaurant Address"}</p>
                                                <div className="mt-3 flex gap-2">
                                                    <button className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-semibold text-gray-700 transition-colors">
                                                        Call Restaurant
                                                    </button>
                                                    <button className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-semibold text-gray-700 transition-colors">
                                                        Navigate
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Customer Point */}
                                        <div className="relative">
                                            <div className="absolute -left-[29px] w-6 h-6 bg-gray-900 rounded-full z-10 flex items-center justify-center">
                                                <MapPin size={12} className="text-white" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900">{activeDelivery.user?.name}</h3>
                                                <p className="text-sm text-gray-500 mt-1">{activeDelivery.address}</p>
                                                <div className="mt-3 flex gap-2">
                                                    <button className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-semibold text-gray-700 transition-colors">
                                                        Call Customer
                                                    </button>
                                                    <button className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-semibold text-gray-700 transition-colors">
                                                        Navigate
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <div className="pt-6 border-t border-gray-100">
                                        {activeDelivery.orderStatus === "ready" && (
                                            <button
                                                onClick={() => handleUpdateStatus(activeDelivery._id, "picked_up")}
                                                disabled={actionLoading === activeDelivery._id}
                                                className="w-full bg-orange-600 text-white font-bold py-4 rounded-xl hover:bg-orange-700 transition-all shadow-lg shadow-orange-200 flex items-center justify-center gap-2"
                                            >
                                                {actionLoading === activeDelivery._id ? <Loader2 className="animate-spin" /> : "Confirm Pickup"}
                                            </button>
                                        )}
                                        {(activeDelivery.orderStatus === "picked_up" || activeDelivery.orderStatus === "on_the_way") && (
                                            <button
                                                onClick={() => handleUpdateStatus(activeDelivery._id, "delivered")}
                                                disabled={actionLoading === activeDelivery._id}
                                                className="w-full bg-green-600 text-white font-bold py-4 rounded-xl hover:bg-green-700 transition-all shadow-lg shadow-green-200 flex items-center justify-center gap-2"
                                            >
                                                {actionLoading === activeDelivery._id ? <Loader2 className="animate-spin" /> : "Complete Delivery"}
                                            </button>
                                        )}
                                        {activeDelivery.orderStatus === "preparing" && (
                                            <div className="w-full bg-gray-100 text-gray-500 font-bold py-4 rounded-xl flex items-center justify-center gap-2 cursor-not-allowed">
                                                <Clock size={20} />
                                                Food is being prepared...
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            /* Available Orders List */
                            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                                    <h2 className="text-lg font-bold text-gray-900">New Orders</h2>
                                    <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold">
                                        {availableOrders.length} Available
                                    </span>
                                </div>

                                {availableOrders.length === 0 ? (
                                    <div className="p-12 text-center">
                                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Package className="w-10 h-10 text-gray-300" />
                                        </div>
                                        <h3 className="text-gray-900 font-bold mb-2">No orders right now</h3>
                                        <p className="text-gray-500 text-sm">Stay online! New orders will appear here instantly.</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-gray-100">
                                        {availableOrders.map((order) => (
                                            <div key={order._id} className="p-6 hover:bg-gray-50 transition-colors">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center">
                                                            <img src="/restaurant-placeholder.png" alt="Rest" className="w-6 h-6 object-contain opacity-50" />
                                                        </div>
                                                        <div>
                                                            <h3 className="font-bold text-gray-900">{order.restaurant?.name}</h3>
                                                            <p className="text-xs text-gray-500">2.5 km • 15 mins</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-bold text-gray-900 text-lg">₹45</p>
                                                        <p className="text-xs text-green-600 font-medium">Earnings</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2 mb-4">
                                                    <div className="h-1 w-1 bg-gray-300 rounded-full" />
                                                    <p className="text-sm text-gray-600 truncate flex-1">{order.address}</p>
                                                </div>

                                                <button
                                                    onClick={() => handleAcceptOrder(order._id)}
                                                    disabled={actionLoading === order._id}
                                                    className="w-full bg-black text-white font-bold py-3 rounded-xl hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
                                                >
                                                    {actionLoading === order._id ? <Loader2 className="animate-spin" /> : "Accept Order"}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Sidebar Stats */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                            <h2 className="font-bold text-gray-900 mb-4">Recent Activity</h2>
                            <div className="space-y-4">
                                {recentActivity.slice(0, 5).map((order) => (
                                    <div key={order._id} className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                            <CheckCircle size={14} className="text-green-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900 truncate">{order.restaurant?.name}</p>
                                            <p className="text-xs text-gray-500">Delivered at {new Date(order.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                        </div>
                                        <span className="text-sm font-bold text-gray-900">₹40</span>
                                    </div>
                                ))}
                                {recentActivity.length === 0 && (
                                    <p className="text-sm text-gray-500 text-center py-4">No recent deliveries</p>
                                )}
                            </div>
                            <button className="w-full mt-4 py-2 text-sm font-semibold text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
                                View Full History
                            </button>
                        </div>

                        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl shadow-lg p-6 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-bl-full -mr-8 -mt-8" />
                            <h2 className="font-bold text-lg mb-1">Weekly Goal</h2>
                            <p className="text-gray-400 text-sm mb-4">You're doing great!</p>

                            <div className="flex items-end gap-2 mb-2">
                                <span className="text-3xl font-bold">{stats.weekDeliveries}</span>
                                <span className="text-gray-400 mb-1">/ 100 orders</span>
                            </div>

                            <div className="h-2 bg-gray-700 rounded-full overflow-hidden mb-4">
                                <div className="h-full bg-orange-500 w-3/4 rounded-full" />
                            </div>

                            <p className="text-xs text-gray-400">
                                Complete 25 more orders to reach your weekly target and unlock a <span className="text-orange-400 font-bold">₹500 bonus</span>!
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
