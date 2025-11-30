import { useState, useEffect } from 'react';
import TopBar from '../components/TopBar';
import { BarChart3, TrendingUp, Package, Users, Store, DollarSign } from 'lucide-react';
import { getDashboardAnalytics, getRevenueAnalytics, getOrderStatusDistribution, getTopRestaurants, getUserGrowth } from '../api/analytics';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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
            const results = await Promise.allSettled([
                getDashboardAnalytics(),
                getRevenueAnalytics(),
                getOrderStatusDistribution(),
                getTopRestaurants(),
                getUserGrowth()
            ]);

            // Extract successful results
            const [dashboardResult, revenueResult, orderStatusResult, topRestaurantsResult, userGrowthResult] = results;

            if (dashboardResult.status === 'fulfilled') setDashboardData(dashboardResult.value);
            if (revenueResult.status === 'fulfilled') setRevenueData(revenueResult.value);
            if (orderStatusResult.status === 'fulfilled') setOrderStatusData(orderStatusResult.value);
            if (topRestaurantsResult.status === 'fulfilled') setTopRestaurantsData(topRestaurantsResult.value);
            if (userGrowthResult.status === 'fulfilled') setUserGrowthData(userGrowthResult.value);

            // Only show error if ALL requests failed
            const allFailed = results.every(result => result.status === 'rejected');
            if (allFailed) {
                // toast.error('Failed to load analytics data');
            }
        } catch (error) {
            console.error('Error fetching analytics:', error);
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
        <div className="flex-1 bg-slate-50 min-h-screen">
            <TopBar title="Analytics & Reports" />

            <div className="pt-24 px-8 pb-12 animate-fade-in">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                                <BarChart3 className="w-6 h-6" />
                            </div>
                            Analytics & Reports
                        </h2>
                        <p className="text-slate-500 mt-1 ml-11">Platform performance insights and metrics</p>
                    </div>
                </div>

                {/* Key Metrics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg shadow-indigo-500/30 p-6 text-white transform hover:scale-[1.02] transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-indigo-100 text-sm font-medium">Total Revenue</p>
                                <p className="text-3xl font-bold mt-2">₹{dashboardData?.totalRevenue?.toLocaleString() || 0}</p>
                                <div className="flex items-center gap-1 mt-2 bg-white/10 w-fit px-2 py-1 rounded-lg backdrop-blur-sm">
                                    <TrendingUp className="w-3 h-3" />
                                    <span className="text-xs font-medium">+12.5%</span>
                                </div>
                            </div>
                            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                                <DollarSign className="w-8 h-8 text-white" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg shadow-emerald-500/30 p-6 text-white transform hover:scale-[1.02] transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-emerald-100 text-sm font-medium">Total Orders</p>
                                <p className="text-3xl font-bold mt-2">{dashboardData?.totalOrders || 0}</p>
                                <div className="flex items-center gap-1 mt-2 bg-white/10 w-fit px-2 py-1 rounded-lg backdrop-blur-sm">
                                    <TrendingUp className="w-3 h-3" />
                                    <span className="text-xs font-medium">+8.3%</span>
                                </div>
                            </div>
                            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                                <Package className="w-8 h-8 text-white" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl shadow-lg shadow-blue-500/30 p-6 text-white transform hover:scale-[1.02] transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-100 text-sm font-medium">Active Users</p>
                                <p className="text-3xl font-bold mt-2">{dashboardData?.totalUsers || 0}</p>
                                <div className="flex items-center gap-1 mt-2 bg-white/10 w-fit px-2 py-1 rounded-lg backdrop-blur-sm">
                                    <TrendingUp className="w-3 h-3" />
                                    <span className="text-xs font-medium">+15.2%</span>
                                </div>
                            </div>
                            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                                <Users className="w-8 h-8 text-white" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl shadow-lg shadow-orange-500/30 p-6 text-white transform hover:scale-[1.02] transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-orange-100 text-sm font-medium">Active Restaurants</p>
                                <p className="text-3xl font-bold mt-2">{dashboardData?.totalRestaurants || 0}</p>
                                <div className="flex items-center gap-1 mt-2 bg-white/10 w-fit px-2 py-1 rounded-lg backdrop-blur-sm">
                                    <TrendingUp className="w-3 h-3" />
                                    <span className="text-xs font-medium">+5.7%</span>
                                </div>
                            </div>
                            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                                <Store className="w-8 h-8 text-white" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charts Row 1 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Revenue Chart */}
                    <div className="card-premium p-6">
                        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <div className="w-1 h-6 bg-indigo-500 rounded-full"></div>
                            Monthly Revenue
                        </h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                                <XAxis dataKey="name" stroke="#64748b" axisLine={false} tickLine={false} dy={10} />
                                <YAxis stroke="#64748b" axisLine={false} tickLine={false} dx={-10} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', border: 'none', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']}
                                />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#6366f1"
                                    strokeWidth={3}
                                    dot={{ fill: '#6366f1', r: 4, strokeWidth: 2, stroke: '#fff' }}
                                    activeDot={{ r: 6, strokeWidth: 0 }}
                                    name="Revenue"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Order Status Distribution */}
                    <div className="card-premium p-6">
                        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <div className="w-1 h-6 bg-purple-500 rounded-full"></div>
                            Order Status Distribution
                        </h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={orderStatusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {orderStatusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', border: 'none', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    formatter={(value) => [`${value} orders`, 'Count']}
                                />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Charts Row 2 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Top Restaurants */}
                    <div className="card-premium p-6">
                        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <div className="w-1 h-6 bg-emerald-500 rounded-full"></div>
                            Top Performing Restaurants
                        </h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart
                                data={topRestaurantsData}
                                layout="vertical"
                                barSize={20}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={true} vertical={false} />
                                <XAxis type="number" stroke="#64748b" axisLine={false} tickLine={false} />
                                <YAxis dataKey="name" type="category" width={120} stroke="#64748b" axisLine={false} tickLine={false} />
                                <Tooltip
                                    cursor={{ fill: '#f1f5f9' }}
                                    contentStyle={{ backgroundColor: '#fff', border: 'none', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="orders" fill="#10b981" radius={[0, 4, 4, 0]} name="Orders" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* User Growth */}
                    <div className="card-premium p-6">
                        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                            User Growth Trend
                        </h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={userGrowthData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                                <XAxis dataKey="month" stroke="#64748b" axisLine={false} tickLine={false} dy={10} />
                                <YAxis stroke="#64748b" axisLine={false} tickLine={false} dx={-10} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', border: 'none', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="users"
                                    stroke="#3b82f6"
                                    strokeWidth={3}
                                    dot={{ fill: '#3b82f6', r: 4, strokeWidth: 2, stroke: '#fff' }}
                                    activeDot={{ r: 6, strokeWidth: 0 }}
                                    name="Total Users"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
