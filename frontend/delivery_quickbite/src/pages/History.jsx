import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import { Package, MapPin, Clock, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";

const History = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                console.log("Fetching history...");
                const response = await api.get("/api/delivery/history");
                console.log("History response:", response.data);
                if (response.data && response.data.orders) {
                    setOrders(response.data.orders);
                } else {
                    console.warn("No orders found in response");
                    setOrders([]);
                }
            } catch (error) {
                console.error("Error fetching history:", error);
                toast.error("Failed to load order history");
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
                <Navbar />
                <div className="flex items-center justify-center min-h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
            <Navbar />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8 animate-fade-in">Delivery History</h1>

                {orders.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm p-12 text-center animate-slide-up">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Package className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No deliveries yet</h3>
                        <p className="text-gray-500">Completed deliveries will appear here.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order, index) => (
                            <div key={order._id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow card-hover animate-slide-up" style={{ animationDelay: `${index * 0.05}s` }}>
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-semibold text-lg text-gray-900">{order.restaurantName}</h3>
                                            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full flex items-center gap-1">
                                                <CheckCircle className="w-3 h-3" /> Delivered
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500">Order #{order._id.slice(-6).toUpperCase()}</p>
                                    </div>
                                    <div className="mt-2 sm:mt-0 text-right">
                                        <p className="font-bold text-green-600">+ ₹40.00</p>
                                        <p className="text-xs text-gray-400">{new Date(order.updatedAt).toLocaleDateString()}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1 min-w-[16px]">
                                            <MapPin className="w-4 h-4 text-gray-400" />
                                        </div>
                                        <div>
                                            <p className="text-gray-500 text-xs mb-0.5">Customer</p>
                                            <p className="font-medium text-gray-900">{order.customerName}</p>
                                            <p className="text-gray-500 truncate">{order.address}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="mt-1 min-w-[16px]">
                                            <Clock className="w-4 h-4 text-gray-400" />
                                        </div>
                                        <div>
                                            <p className="text-gray-500 text-xs mb-0.5">Completed At</p>
                                            <p className="font-medium text-gray-900">
                                                {new Date(order.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default History;
