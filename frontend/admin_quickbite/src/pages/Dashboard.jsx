import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import StatCard from '../components/StatCard';
import { Users, Store, Package, DollarSign, TrendingUp, Clock, Plus, CheckCircle, FileText } from 'lucide-react';
import { getDashboardAnalytics } from '../api/analytics';

const Dashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalRestaurants: 0,
        totalOrders: 0,
        totalRevenue: 0,
        platformRevenue: 0, // New field
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
            const dashboardData = await getDashboardAnalytics();

            setStats({
                totalUsers: dashboardData.totalUsers,
                totalRestaurants: dashboardData.totalRestaurants,
                totalOrders: dashboardData.totalOrders,
                totalRevenue: dashboardData.totalRevenue,
                platformRevenue: dashboardData.platformRevenue, // Set new field
            });

            // Transform recent orders to match UI format
            const formattedOrders = dashboardData.recentOrders.map(order => ({
                id: order._id,
                customer: order.customerName || order.user?.name || 'Guest User',
                restaurant: order.restaurant?.name || 'Unknown Restaurant',
                amount: order.totalAmount,
                status: order.orderStatus,
                time: new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            }));

            setRecentOrders(formattedOrders);

            // Real data from analytics endpoint
            setPlatformOverview({
                activeOrders: dashboardData.activeOrders || 0,
                pendingApprovals: dashboardData.pendingRestaurants || 0,
                onlinePartners: dashboardData.onlinePartners || 0
            });

            setLoading(false);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            if (error.response) {
                console.error('❌ Backend Error Response:', JSON.stringify(error.response.data, null, 2));
                console.error('❌ Backend Error Status:', error.response.status);
            }
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            delivered: 'badge-success',
            completed: 'badge-success',
            'out-for-delivery': 'badge-info',
            ready: 'badge-warning',
            accepted: 'badge-warning',
            processing: 'badge-default',
            cancelled: 'badge-error',
        };
        return badges[status] || 'badge-default';
    };

    const getStatusText = (status) => {
        return status.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    if (loading) {
        return (
            <div className="flex-1 bg-gray-50">
                <TopBar title="Dashboard" />
                <div className="pt-24 pl-72 pr-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="skeleton h-32 rounded-2xl" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 bg-slate-50 min-h-screen">
            <TopBar title="Dashboard" />

            <div className="pt-24 px-8 pb-12 animate-fade-in">
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
                        icon={DollarSign}
                        title="Total Sales (GMV)"
                        value={`₹${stats.totalRevenue.toLocaleString()}`}
                        trend="up"
                        trendValue="+23%"
                        color="blue"
                    />
                    <StatCard
                        icon={TrendingUp}
                        title="Platform Revenue"
                        value={`₹${stats.platformRevenue?.toLocaleString() || 0}`}
                        trend="up"
                        trendValue="+15%"
                        color="purple"
                    />
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Orders */}
                    <div className="lg:col-span-2">
                        <div className="card-premium p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                                    <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                                        <Package className="w-5 h-5" />
                                    </div>
                                    Recent Orders
                                </h2>
                                <button
                                    onClick={() => navigate('/orders')}
                                    className="text-sm text-indigo-600 hover:text-indigo-700 font-semibold hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors"
                                >
                                    View All →
                                </button>
                            </div>

                            <div className="space-y-3">
                                {recentOrders.map((order) => (
                                    <div key={order.id} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-xl transition-all border border-slate-100 group">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-1">
                                                <h3 className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{order.customer}</h3>
                                                <span className={`badge ${getStatusBadge(order.status)}`}>
                                                    {getStatusText(order.status)}
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-500 font-medium">{order.restaurant}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-slate-800">₹{order.amount}</p>
                                            <p className="text-xs text-slate-400 flex items-center justify-end gap-1 mt-1 font-medium">
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
                        <div className="card-premium p-6">
                            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                                <div className="p-2 bg-violet-100 rounded-lg text-violet-600">
                                    <TrendingUp className="w-5 h-5" />
                                </div>
                                Platform Overview
                            </h2>

                            <div className="space-y-4">
                                <div
                                    onClick={() => navigate('/orders')}
                                    className="cursor-pointer hover:bg-slate-50 p-3 rounded-xl transition-all border border-transparent hover:border-slate-100 group"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-slate-600 font-medium group-hover:text-indigo-600 transition-colors">Active Orders</span>
                                        <span className="font-bold text-slate-800">{platformOverview.activeOrders}</span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                        <div
                                            className="bg-indigo-500 h-2 rounded-full transition-all duration-1000 ease-out"
                                            style={{ width: `${Math.min((platformOverview.activeOrders / 50) * 100, 100)}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div
                                    onClick={() => navigate('/restaurants')}
                                    className="cursor-pointer hover:bg-slate-50 p-3 rounded-xl transition-all border border-transparent hover:border-slate-100 group"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-slate-600 font-medium group-hover:text-orange-600 transition-colors">Pending Approvals</span>
                                        <span className="font-bold text-slate-800">{platformOverview.pendingApprovals}</span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                        <div
                                            className="bg-orange-500 h-2 rounded-full transition-all duration-1000 ease-out"
                                            style={{ width: `${Math.min((platformOverview.pendingApprovals / 20) * 100, 100)}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div
                                    onClick={() => navigate('/delivery-partners')}
                                    className="cursor-pointer hover:bg-slate-50 p-3 rounded-xl transition-all border border-transparent hover:border-slate-100 group"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-slate-600 font-medium group-hover:text-emerald-600 transition-colors">Online Partners</span>
                                        <span className="font-bold text-slate-800">{platformOverview.onlinePartners}</span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                        <div
                                            className="bg-emerald-500 h-2 rounded-full transition-all duration-1000 ease-out"
                                            style={{ width: `${Math.min((platformOverview.onlinePartners / 60) * 100, 100)}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl shadow-xl shadow-indigo-500/20 p-6 text-white relative overflow-hidden">
                            {/* Decorative circles */}
                            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                            <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 bg-black/10 rounded-full blur-2xl"></div>

                            <h3 className="font-bold text-lg mb-4 relative z-10">Quick Actions</h3>
                            <div className="space-y-3 relative z-10">
                                <button
                                    onClick={() => navigate('/restaurants')}
                                    className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-md py-3 px-4 rounded-xl text-left font-medium transition-all flex items-center gap-3 border border-white/10 hover:border-white/20"
                                >
                                    <div className="p-1.5 bg-white/20 rounded-lg">
                                        <Plus className="w-4 h-4" />
                                    </div>
                                    Add New Restaurant
                                </button>
                                <button
                                    onClick={() => navigate('/restaurants')}
                                    className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-md py-3 px-4 rounded-xl text-left font-medium transition-all flex items-center gap-3 border border-white/10 hover:border-white/20"
                                >
                                    <div className="p-1.5 bg-white/20 rounded-lg">
                                        <CheckCircle className="w-4 h-4" />
                                    </div>
                                    View Pending Approvals
                                </button>
                                <button
                                    onClick={() => navigate('/analytics')}
                                    className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-md py-3 px-4 rounded-xl text-left font-medium transition-all flex items-center gap-3 border border-white/10 hover:border-white/20"
                                >
                                    <div className="p-1.5 bg-white/20 rounded-lg">
                                        <FileText className="w-4 h-4" />
                                    </div>
                                    Generate Report
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
