import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import StatCard from '../components/StatCard';
import { Users, Store, Package, DollarSign, TrendingUp, Clock, Plus, CheckCircle, FileText } from 'lucide-react';
import { getDashboardAnalytics } from '../api/analytics';
import { getAllOrders } from '../api/orders';
import toast from 'react-hot-toast';

const Dashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalRestaurants: 0,
        totalOrders: 0,
        totalRevenue: 0,
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [platformOverview, setPlatformOverview] = useState({
        activeOrders: 0,
        pendingApprovals: 0,
        onlinePartners: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [dashboardData, ordersData] = await Promise.all([
                getDashboardAnalytics(),
                getAllOrders()
            ]);

            setStats({
                totalUsers: dashboardData.totalUsers,
                totalRestaurants: dashboardData.totalRestaurants,
                totalOrders: dashboardData.totalOrders,
                totalRevenue: dashboardData.totalRevenue,
            });

            // Transform recent orders to match UI format
            const formattedOrders = dashboardData.recentOrders.map(order => ({
                id: order._id,
                customer: order.user?.name || 'Unknown User',
                restaurant: order.restaurant?.name || 'Unknown Restaurant',
                amount: order.totalAmount,
                status: order.orderStatus,
                time: new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            }));

            setRecentOrders(formattedOrders);

            // Calculate platform overview metrics
            const activeOrdersCount = ordersData.orders?.filter(order =>
                ['pending', 'accepted', 'preparing', 'ready', 'out-for-delivery'].includes(order.orderStatus)
            ).length || 0;

            // Mock data for pending approvals and online partners (can be replaced with real API calls)
            setPlatformOverview({
                activeOrders: activeOrdersCount,
                pendingApprovals: 7, // This should come from a real API endpoint
                onlinePartners: 45 // This should come from a real API endpoint
            });

            setLoading(false);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            toast.error('Failed to load dashboard data');
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            delivered: 'badge-success',
            on_the_way: 'badge-info',
            preparing: 'badge-warning',
            pending: 'badge-default',
        };
        return badges[status] || 'badge-default';
    };

    const getStatusText = (status) => {
        return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    if (loading) {
        return (
            <div className="flex-1 bg-gray-50">
                <TopBar title="Dashboard" />
                <div className="pt-16 pl-64">
                    <div className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="skeleton h-32 rounded-2xl" />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 bg-gray-50 min-h-screen">
            <TopBar title="Dashboard" />

            <div className="pt-16 pl-64">
                <div className="p-8">
                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <StatCard
                            icon={Users}
                            title="Total Users"
                            value={stats.totalUsers.toLocaleString()}
                            trend="up"
                            trendValue="+12%"
                            color="indigo"
                        />
                        <StatCard
                            icon={Store}
                            title="Total Restaurants"
                            value={stats.totalRestaurants}
                            trend="up"
                            trendValue="+5%"
                            color="green"
                        />
                        <StatCard
                            icon={Package}
                            title="Orders Today"
                            value={stats.totalOrders}
                            trend="up"
                            trendValue="+18%"
                            color="orange"
                        />
                        <StatCard
                            icon={DollarSign}
                            title="Revenue Today"
                            value={`₹${stats.totalRevenue.toLocaleString()}`}
                            trend="up"
                            trendValue="+23%"
                            color="blue"
                        />
                    </div>

                    {/* Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Recent Orders */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                        <Package className="w-6 h-6 text-indigo-600" />
                                        Recent Orders
                                    </h2>
                                    <button
                                        onClick={() => navigate('/orders')}
                                        className="text-sm text-indigo-600 hover:text-indigo-700 font-semibold"
                                    >
                                        View All →
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    {recentOrders.map((order) => (
                                        <div key={order.id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-1">
                                                    <h3 className="font-semibold text-gray-900">{order.customer}</h3>
                                                    <span className={`badge ${getStatusBadge(order.status)}`}>
                                                        {getStatusText(order.status)}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600">{order.restaurant}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-gray-900">₹{order.amount}</p>
                                                <p className="text-xs text-gray-500 flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {order.time}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="space-y-6">
                            {/* Platform Overview */}
                            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <TrendingUp className="w-6 h-6 text-indigo-600" />
                                    Platform Overview
                                </h2>

                                <div className="space-y-4">
                                    <div
                                        onClick={() => navigate('/orders')}
                                        className="cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-colors"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-gray-600">Active Orders</span>
                                            <span className="font-bold text-gray-900">{platformOverview.activeOrders}</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                                                style={{ width: `${Math.min((platformOverview.activeOrders / 50) * 100, 100)}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    <div
                                        onClick={() => navigate('/restaurants')}
                                        className="cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-colors"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-gray-600">Pending Approvals</span>
                                            <span className="font-bold text-gray-900">{platformOverview.pendingApprovals}</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                                                style={{ width: `${Math.min((platformOverview.pendingApprovals / 20) * 100, 100)}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    <div
                                        onClick={() => navigate('/delivery-partners')}
                                        className="cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-colors"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-gray-600">Online Partners</span>
                                            <span className="font-bold text-gray-900">{platformOverview.onlinePartners}</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-green-500 h-2 rounded-full transition-all duration-500"
                                                style={{ width: `${Math.min((platformOverview.onlinePartners / 60) * 100, 100)}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
                                <h3 className="font-bold text-lg mb-4">Quick Actions</h3>
                                <div className="space-y-3">
                                    <button
                                        onClick={() => navigate('/restaurants')}
                                        className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm py-3 px-4 rounded-lg text-left font-medium transition-all flex items-center gap-3"
                                    >
                                        <Plus className="w-5 h-5" />
                                        Add New Restaurant
                                    </button>
                                    <button
                                        onClick={() => navigate('/restaurants')}
                                        className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm py-3 px-4 rounded-lg text-left font-medium transition-all flex items-center gap-3"
                                    >
                                        <CheckCircle className="w-5 h-5" />
                                        View Pending Approvals
                                    </button>
                                    <button
                                        onClick={() => navigate('/analytics')}
                                        className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm py-3 px-4 rounded-lg text-left font-medium transition-all flex items-center gap-3"
                                    >
                                        <FileText className="w-5 h-5" />
                                        Generate Report
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
