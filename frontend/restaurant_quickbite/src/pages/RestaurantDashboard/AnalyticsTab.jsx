import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Users,
  ShoppingBag,
  Wallet,
  Clock,
  Target,
  Award,
  AlertCircle,
  CheckCircle,
  XCircle
} from "lucide-react";
import { getRestaurantAnalytics } from "../../api/analytics";

const COLORS = ['#FC8019', '#10B981', '#3B82F6', '#F59E0B', '#8B5CF6', '#EC4899'];

const AnalyticsTab = ({ restaurantId }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('week'); // today, week, month

  useEffect(() => {
    if (!restaurantId) return;

    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        console.log("📊 Fetching analytics for restaurant:", restaurantId, "Period:", period);
        const analytics = await getRestaurantAnalytics(restaurantId, period);
        setData(analytics.data || analytics);
      } catch (err) {
        console.error("❌ Analytics fetch failed:", err);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [restaurantId, period]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Loading analytics...</p>
        </div>
      </div>
    );

  if (!data)
    return (
      <div className="text-center py-16 text-red-500 text-lg font-medium">
        <AlertCircle className="w-12 h-12 mx-auto mb-3" />
        Failed to load analytics
      </div>
    );

  const { metrics, performance, orderStatus, topItems, categoryPerformance, timeSeriesData, peakHours, customerInsights } = data;

  // Format currency
  const formatCurrency = (val) => `₹${Math.round(val).toLocaleString('en-IN')}`;

  // Prepare data for charts
  const statusChartData = Object.entries(orderStatus || {}).map(([name, value]) => ({
    name: name.replace('_', ' '),
    value,
    percentage: ((value / (performance?.totalOrders || 1)) * 100).toFixed(1)
  })).filter(d => d.value > 0);

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">
      {/* Header with Period Selector */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h2>
          <p className="text-sm text-gray-500 mt-1">Comprehensive insights from your restaurant performance </p>
        </div>

        {/* Period Selector */}
        <div className="flex gap-2 bg-white rounded-lg p-1 border border-gray-200 shadow-sm">
          {['today', 'week', 'month'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition capitalize ${period === p
                  ? 'bg-[#FC8019] text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
                }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Main Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Revenue */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-xl p-5 shadow-sm hover:shadow-md transition">
          <div className="flex justify-between items-start mb-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Wallet className="text-green-600 w-5 h-5" />
            </div>
            {metrics?.revenue.trend === 'up' ? (
              <TrendingUp className="w-5 h-5 text-green-600" />
            ) : (
              <TrendingDown className="w-5 h-5 text-red-600" />
            )}
          </div>
          <h4 className="text-sm font-medium text-gray-600 mb-1">Total Revenue</h4>
          <p className="text-2xl font-bold text-gray-900 mb-1">
            {formatCurrency(metrics?.revenue.current || 0)}
          </p>
          <p className={`text-xs font-medium flex items-center gap-1 ${metrics?.revenue.trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
            <span>{metrics?.revenue.change > 0 ? '+' : ''}{metrics?.revenue.change}%</span>
            <span className="text-gray-400">vs last period</span>
          </p>
        </div>

        {/* Orders */}
        <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100 rounded-xl p-5 shadow-sm hover:shadow-md transition">
          <div className="flex justify-between items-start mb-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <ShoppingBag className="text-[#FC8019] w-5 h-5" />
            </div>
            {metrics?.orders.trend === 'up' ? (
              <TrendingUp className="w-5 h-5 text-green-600" />
            ) : (
              <TrendingDown className="w-5 h-5 text-red-600" />
            )}
          </div>
          <h4 className="text-sm font-medium text-gray-600 mb-1">Total Orders</h4>
          <p className="text-2xl font-bold text-gray-900 mb-1">
            {metrics?.orders.current || 0}
          </p>
          <p className={`text-xs font-medium flex items-center gap-1 ${metrics?.orders.trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
            <span>{metrics?.orders.change > 0 ? '+' : ''}{metrics?.orders.change}%</span>
            <span className="text-gray-400">vs last period</span>
          </p>
        </div>

        {/* Avg Order Value */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-5 shadow-sm hover:shadow-md transition">
          <div className="flex justify-between items-start mb-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="text-blue-600 w-5 h-5" />
            </div>
            {metrics?.avgOrderValue.trend === 'up' ? (
              <TrendingUp className="w-5 h-5 text-green-600" />
            ) : (
              <TrendingDown className="w-5 h-5 text-red-600" />
            )}
          </div>
          <h4 className="text-sm font-medium text-gray-600 mb-1">Avg Order Value</h4>
          <p className="text-2xl font-bold text-gray-900 mb-1">
            {formatCurrency(metrics?.avgOrderValue.current || 0)}
          </p>
          <p className={`text-xs font-medium flex items-center gap-1 ${metrics?.avgOrderValue.trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
            <span>{metrics?.avgOrderValue.change > 0 ? '+' : ''}{metrics?.avgOrderValue.change}%</span>
            <span className="text-gray-400">vs last period</span>
          </p>
        </div>

        {/* Customers */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 rounded-xl p-5 shadow-sm hover:shadow-md transition">
          <div className="flex justify-between items-start mb-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="text-purple-600 w-5 h-5" />
            </div>
            {metrics?.customers.trend === 'up' ? (
              <TrendingUp className="w-5 h-5 text-green-600" />
            ) : (
              <TrendingDown className="w-5 h-5 text-red-600" />
            )}
          </div>
          <h4 className="text-sm font-medium text-gray-600 mb-1">Active Customers</h4>
          <p className="text-2xl font-bold text-gray-900 mb-1">
            {metrics?.customers.current || 0}
          </p>
          <p className={`text-xs font-medium flex items-center gap-1 ${metrics?.customers.trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
            <span>{metrics?.customers.change > 0 ? '+' : ''}{metrics?.customers.change}%</span>
            <span className="text-gray-400">vs last period</span>
          </p>
        </div>
      </div>

      {/* Performance KPIs Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Acceptance Rate */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <h4 className="text-sm font-semibold text-gray-700">Acceptance Rate</h4>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">
            {performance?.acceptanceRate || 0}%
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${performance?.acceptanceRate || 0}%` }}
            ></div>
          </div>
        </div>

        {/* Fulfillment Rate */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Target className="w-5 h-5 text-blue-600" />
            </div>
            <h4 className="text-sm font-semibold text-gray-700">Fulfillment Rate</h4>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">
            {performance?.fulfillmentRate || 0}%
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${performance?.fulfillmentRate || 0}%` }}
            ></div>
          </div>
        </div>

        {/* Cancellation Rate */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-50 rounded-lg">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <h4 className="text-sm font-semibold text-gray-700">Cancellation Rate</h4>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">
            {performance?.cancellationRate || 0}%
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className="bg-red-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${performance?.cancellationRate || 0}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue & Orders Trend */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue & Orders Trend</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeSeriesData || []}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FC8019" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#FC8019" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#6B7280' }} />
                <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                  }}
                  formatter={(value, name) =>
                    name === 'revenue' ? [formatCurrency(value), 'Revenue'] : [value, 'Orders']
                  }
                />
                <Legend />
                <Area type="monotone" dataKey="revenue" stroke="#10B981" fillOpacity={1} fill="url(#colorRevenue)" />
                <Area type="monotone" dataKey="orders" stroke="#FC8019" fillOpacity={1} fill="url(#colorOrders)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Status Distribution */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Status Distribution</h3>
          <div className="h-72 flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} orders`, 'Count']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Peak Hours */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Peak Hours Analysis</h3>
            <div className="flex items-center gap-2 bg-orange-50 px-3 py-1 rounded-full">
              <Clock className="w-4 h-4 text-[#FC8019]" />
              <span className="text-sm font-semibold text-[#FC8019]">
                Peak: {peakHours?.peakHourLabel}
              </span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={peakHours?.hourlyDistribution || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#6B7280' }} />
                <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="orders" fill="#FC8019" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Performance */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Performance</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryPerformance || []} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis type="number" tick={{ fontSize: 12, fill: '#6B7280' }} />
                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12, fill: '#6B7280' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                  }}
                  formatter={(value) => [formatCurrency(value), 'Revenue']}
                />
                <Bar dataKey="revenue" fill="#3B82F6" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Selling Items */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-[#FC8019]" />
            Top Selling Items
          </h3>
          <div className="space-y-3">
            {(topItems || []).length === 0 ? (
              <p className="text-gray-400 text-center py-6">No items sold yet</p>
            ) : (
              (topItems || []).map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm ${index === 0
                        ? 'bg-yellow-100 text-yellow-700'
                        : index === 1
                          ? 'bg-gray-100 text-gray-600'
                          : index === 2
                            ? 'bg-orange-100 text-orange-600'
                            : 'bg-blue-50 text-blue-600'
                      }`}>
                      #{index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.qty} orders</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatCurrency(item.revenue)}</p>
                    <p className="text-xs text-gray-500">Revenue</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Customer Insights */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600" />
            Customer Insights
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-100">
              <p className="text-sm text-gray-600 mb-1">Total Customers</p>
              <p className="text-3xl font-bold text-purple-700">{customerInsights?.total || 0}</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border border-green-100">
              <p className="text-sm text-gray-600 mb-1">Retention Rate</p>
              <p className="text-3xl font-bold text-green-700">{customerInsights?.retentionRate || 0}%</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-lg border border-blue-100">
              <p className="text-sm text-gray-600 mb-1">New Customers</p>
              <p className="text-3xl font-bold text-blue-700">{customerInsights?.new || 0}</p>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-4 rounded-lg border border-orange-100">
              <p className="text-sm text-gray-600 mb-1">Returning</p>
              <p className="text-3xl font-bold text-orange-700">{customerInsights?.returning || 0}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsTab;
