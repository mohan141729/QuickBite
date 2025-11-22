import React, { useState, useEffect } from 'react';
import TopBar from '../components/TopBar';
import { BarChart3, TrendingUp, Package, Users, Store, DollarSign } from 'lucide-react';
import { getDashboardAnalytics, getRevenueAnalytics, getOrderStatusDistribution, getTopRestaurants, getUserGrowth } from '../api/analytics';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';

const Analytics = () => {
    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState(null);
    const [revenueData, setRevenueData] = useState([]);
    const [orderStatusData, setOrderStatusData] = useState([]);
    const [topRestaurantsData, setTopRestaurantsData] = useState([]);
    const [userGrowthData, setUserGrowthData] = useState([]);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const [dashboard, revenue, orderStatus, topRestaurants, userGrowth] = await Promise.all([
                getDashboardAnalytics(),
                getRevenueAnalytics(),
                getOrderStatusDistribution(),
                getTopRestaurants(),
                getUserGrowth()
            ]);
            setDashboardData(dashboard);
            setRevenueData(revenue);
            setOrderStatusData(orderStatus);
            setTopRestaurantsData(topRestaurants);
            setUserGrowthData(userGrowth);
        } catch (error) {
            console.error('Error fetching analytics:', error);
            toast.error('Failed to load analytics data');
        } finally {
            setLoading(false);
        }
    };

    // Colors for charts
    const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];

    if (loading) {
        return (
            <div className="flex-1 bg-gray-50 min-h-screen">
                <TopBar title="Analytics & Reports" />
                <div className="pt-16 pl-64">
                    <div className="p-8">
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Loading analytics...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 bg-gray-50 min-h-screen">
            <TopBar title="Analytics & Reports" />

            <div className="pt-16 pl-64">
                <div className="p-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                                <BarChart3 className="w-8 h-8 text-indigo-600" />
                                Analytics & Reports
                            </h2>
                            <p className="text-gray-600 mt-1">Platform performance insights and metrics</p>
                        </div>
                    </div>

                    {/* Key Metrics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-indigo-100 text-sm">Total Revenue</p>
                                    <p className="text-3xl font-bold mt-2">₹{dashboardData?.totalRevenue?.toLocaleString() || 0}</p>
                                    <div className="flex items-center gap-1 mt-2">
                                        <TrendingUp className="w-4 h-4" />
                                        <span className="text-sm">+12.5% from last month</span>
                                    </div>
                                </div>
                                <DollarSign className="w-12 h-12 opacity-20" />
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-green-100 text-sm">Total Orders</p>
                                    <p className="text-3xl font-bold mt-2">{dashboardData?.totalOrders || 0}</p>
                                    <div className="flex items-center gap-1 mt-2">
                                        <TrendingUp className="w-4 h-4" />
                                        <span className="text-sm">+8.3% this week</span>
                                    </div>
                                </div>
                                <Package className="w-12 h-12 opacity-20" />
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl shadow-lg p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-blue-100 text-sm">Active Users</p>
                                    <p className="text-3xl font-bold mt-2">{dashboardData?.totalUsers || 0}</p>
                                    <div className="flex items-center gap-1 mt-2">
                                        <TrendingUp className="w-4 h-4" />
                                        <span className="text-sm">+15.2% growth</span>
                                    </div>
                                </div>
                                <Users className="w-12 h-12 opacity-20" />
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl shadow-lg p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-orange-100 text-sm">Active Restaurants</p>
                                    <p className="text-3xl font-bold mt-2">{dashboardData?.totalRestaurants || 0}</p>
                                    <div className="flex items-center gap-1 mt-2">
                                        <TrendingUp className="w-4 h-4" />
                                        <span className="text-sm">+5.7% this month</span>
                                    </div>
                                </div>
                                <Store className="w-12 h-12 opacity-20" />
                            </div>
                        </div>
                    </div>

                    {/* Charts Row 1 */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        {/* Revenue Chart */}
                        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Monthly Revenue</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={revenueData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="name" stroke="#6b7280" />
                                    <YAxis stroke="#6b7280" />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                                        formatter={(value) => `₹${value.toLocaleString()}`}
                                    />
                                    <Legend />
                                    <Line
                                        type="monotone"
                                        dataKey="value"
                                        stroke="#6366f1"
                                        strokeWidth={3}
                                        dot={{ fill: '#6366f1', r: 4 }}
                                        activeDot={{ r: 6 }}
                                        name="Revenue"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Order Status Distribution */}
                        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Order Status Distribution</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={orderStatusData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {orderStatusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => `${value} orders`} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Charts Row 2 */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Top Restaurants */}
                        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Top Performing Restaurants</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart
                                    data={topRestaurantsData}
                                    layout="vertical"
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis type="number" stroke="#6b7280" />
                                    <YAxis dataKey="name" type="category" width={120} stroke="#6b7280" />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                                        formatter={(value) => `${value} orders`}
                                    />
                                    <Bar dataKey="orders" fill="#6366f1" radius={[0, 8, 8, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* User Growth */}
                        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">User Growth Trend</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={userGrowthData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="month" stroke="#6b7280" />
                                    <YAxis stroke="#6b7280" />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                                        formatter={(value) => `${value} users`}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="users"
                                        stroke="#10b981"
                                        strokeWidth={3}
                                        dot={{ fill: '#10b981', r: 4 }}
                                        activeDot={{ r: 6 }}
                                        name="Total Users"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
