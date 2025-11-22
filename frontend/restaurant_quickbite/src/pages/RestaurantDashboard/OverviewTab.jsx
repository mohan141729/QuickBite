import React, { useEffect, useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  ShoppingBag,
  Receipt,
  Clock,
  Star,
  Award,
  CheckCircle,
  XCircle,
  Package,
  AlertCircle,
  Calendar
} from "lucide-react";
import { getRestaurantAnalytics } from "../../api/analytics";
import { getRestaurantOrders } from "../../api/orders";

const OverviewTab = ({ restaurantId, restaurant }) => {
  const [analytics, setAnalytics] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (!restaurantId) {
        console.warn("⚠️ No restaurantId provided to OverviewTab");
        setError("Missing restaurant ID.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log("📡 Fetching analytics & orders for:", restaurantId);

        const [analyticsData, ordersDataRaw] = await Promise.all([
          getRestaurantAnalytics(restaurantId),
          getRestaurantOrders(restaurantId),
        ]);

        console.log("✅ analyticsData:", analyticsData);
        console.log("✅ ordersDataRaw:", ordersDataRaw);

        // Normalize orders response
        let ordersArray = [];
        if (Array.isArray(ordersDataRaw)) {
          ordersArray = ordersDataRaw;
        } else if (ordersDataRaw && Array.isArray(ordersDataRaw.orders)) {
          ordersArray = ordersDataRaw.orders;
        } else if (ordersDataRaw && Array.isArray(ordersDataRaw.data)) {
          ordersArray = ordersDataRaw.data;
        } else if (ordersDataRaw && typeof ordersDataRaw === "object") {
          const firstArrayProp = Object.values(ordersDataRaw).find((v) =>
            Array.isArray(v)
          );
          if (firstArrayProp) ordersArray = firstArrayProp;
        }

        ordersArray = Array.isArray(ordersArray) ? ordersArray : [];

        setAnalytics(analyticsData || null);

        // Sort by createdAt descending
        if (ordersArray.length > 0 && ordersArray.some((o) => o.createdAt)) {
          ordersArray.sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        }

        setRecentOrders(ordersArray.slice(0, 5));
      } catch (err) {
        console.error("❌ Failed to fetch overview data:", err);
        setError("Unable to fetch overview data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [restaurantId]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-96">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-medium">Loading overview...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-3 text-red-600 p-6 bg-red-50 rounded-xl border border-red-200">
        <AlertCircle className="w-6 h-6" />
        <span className="font-medium">{error}</span>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-gray-500 text-center p-8 bg-gray-50 rounded-xl">
        No analytics data available.
      </div>
    );
  }

  // Extract metrics with proper fallbacks
  const metrics = analytics.metrics || {};
  const performance = analytics.performance || {};
  const customerInsights = analytics.customerInsights || {};

  const stats = [
    {
      label: "Weekly Revenue",
      value: "₹" + (metrics.revenue?.current || analytics.weeklyRevenue || 0).toLocaleString(),
      change: metrics.revenue?.change || 0,
      trend: metrics.revenue?.trend || 'up',
      icon: DollarSign,
      bgColor: "from-green-50 to-emerald-50",
      iconBg: "bg-green-100",
      iconColor: "text-green-600"
    },
    {
      label: "Weekly Orders",
      value: metrics.orders?.current || analytics.weeklyOrders || 0,
      change: metrics.orders?.change || 0,
      trend: metrics.orders?.trend || 'up',
      icon: ShoppingBag,
      bgColor: "from-orange-50 to-amber-50",
      iconBg: "bg-orange-100",
      iconColor: "text-[#FC8019]"
    },
    {
      label: "Avg Order Value",
      value: "₹" + Math.round(metrics.avgOrderValue?.current || analytics.avgOrderValue || 0).toLocaleString(),
      change: metrics.avgOrderValue?.change || 0,
      trend: metrics.avgOrderValue?.trend || 'up',
      icon: TrendingUp,
      bgColor: "from-blue-50 to-indigo-50",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600"
    },
    {
      label: "Total Customers",
      value: metrics.customers?.current || analytics.totalCustomers || 0,
      change: metrics.customers?.change || 0,
      trend: metrics.customers?.trend || 'up',
      icon: Users,
      bgColor: "from-purple-50 to-pink-50",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600"
    },
  ];

  return (
    <div className="space-y-8">
      {/* Restaurant Quick Info Banner */}
      {restaurant && (
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-100 rounded-xl p-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h2 className="text-2xl font-bold text-gray-900">{restaurant.name}</h2>
                {restaurant.rating && (
                  <div className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                    <Star className="w-4 h-4 fill-green-600" />
                    <span>{restaurant.rating.toFixed(1)}</span>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-orange-600" />
                  <span className="font-medium">Cuisine:</span>
                  <span>{restaurant.cuisines?.join(", ") || "Not specified"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-orange-600" />
                  <span className="font-medium">Timings:</span>
                  <span>
                    {restaurant.openingTime && restaurant.closingTime
                      ? `${restaurant.openingTime} - ${restaurant.closingTime}`
                      : "Not specified"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Metrics Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`bg-gradient-to-br ${stat.bgColor} border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition`}
          >
            <div className="flex justify-between items-start mb-3">
              <div className={`p-2 ${stat.iconBg} rounded-lg`}>
                <stat.icon className={`${stat.iconColor} w-5 h-5`} />
              </div>
              {stat.trend === 'up' ? (
                <TrendingUp className="w-5 h-5 text-green-600" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-600" />
              )}
            </div>
            <h4 className="text-sm font-medium text-gray-600 mb-1">{stat.label}</h4>
            <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
            <p className={`text-xs font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
              {stat.change > 0 ? '+' : ''}{stat.change}% vs last week
            </p>
          </div>
        ))}
      </div>

      {/* Performance Overview */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <h4 className="text-sm font-semibold text-gray-700">Acceptance Rate</h4>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-2">
            {performance.acceptanceRate || 0}%
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${performance.acceptanceRate || 0}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <h4 className="text-sm font-semibold text-gray-700">Fulfillment Rate</h4>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-2">
            {performance.fulfillmentRate || 0}%
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${performance.fulfillmentRate || 0}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-red-50 rounded-lg">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <h4 className="text-sm font-semibold text-gray-700">Cancellation Rate</h4>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-2">
            {performance.cancellationRate || 0}%
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-red-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${performance.cancellationRate || 0}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Customer Insights */}
      {customerInsights && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600" />
            Customer Insights
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-100">
              <p className="text-xs text-gray-600 mb-1 uppercase tracking-wide">Total</p>
              <p className="text-3xl font-bold text-purple-700">{customerInsights.total || 0}</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-lg border border-blue-100">
              <p className="text-xs text-gray-600 mb-1 uppercase tracking-wide">New</p>
              <p className="text-3xl font-bold text-blue-700">{customerInsights.new || 0}</p>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-4 rounded-lg border border-orange-100">
              <p className="text-xs text-gray-600 mb-1 uppercase tracking-wide">Returning</p>
              <p className="text-3xl font-bold text-orange-700">{customerInsights.returning || 0}</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border border-green-100">
              <p className="text-xs text-gray-600 mb-1 uppercase tracking-wide">Retention</p>
              <p className="text-3xl font-bold text-green-700">{customerInsights.retentionRate || 0}%</p>
            </div>
          </div>
        </div>
      )}

      {/* Recent Orders */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Receipt className="text-[#FC8019] w-5 h-5" />
            Recent Orders
          </h3>
          <span className="text-sm text-gray-500">Showing last 5 orders</span>
        </div>

        {recentOrders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No recent orders found</p>
            <p className="text-sm text-gray-400 mt-1">Orders will appear here once customers start ordering</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-gray-600 bg-gray-50 border-b border-gray-200">
                  <th className="py-3 px-4 text-left font-semibold">Order ID</th>
                  <th className="py-3 px-4 text-left font-semibold">Customer</th>
                  <th className="py-3 px-4 text-left font-semibold">Items</th>
                  <th className="py-3 px-4 text-left font-semibold">Total</th>
                  <th className="py-3 px-4 text-left font-semibold">Status</th>
                  <th className="py-3 px-4 text-left font-semibold">Date & Time</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => {
                  const id = order._id || order.id || "—";
                  const customerName = order.customerName || order.customer?.name || "Anonymous";
                  const itemCount = order.items?.length || 0;
                  const total = typeof order.totalAmount === "number"
                    ? order.totalAmount
                    : typeof order.total === "number"
                      ? order.total
                      : (order.totalAmount && Number(order.totalAmount)) || 0;
                  const status = order.orderStatus || order.status || "unknown";
                  const date = order.createdAt || order.createdAtString || order.date || null;

                  // Status badge styling
                  const getStatusClass = (status) => {
                    switch (status) {
                      case "delivered":
                        return "bg-green-100 text-green-700 border-green-200";
                      case "cancelled":
                        return "bg-red-100 text-red-700 border-red-200";
                      case "out_for_delivery":
                        return "bg-blue-100 text-blue-700 border-blue-200";
                      case "ready":
                        return "bg-purple-100 text-purple-700 border-purple-200";
                      case "accepted":
                        return "bg-yellow-100 text-yellow-700 border-yellow-200";
                      default:
                        return "bg-gray-100 text-gray-700 border-gray-200";
                    }
                  };

                  return (
                    <tr key={id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                      <td className="py-4 px-4">
                        <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded font-semibold text-gray-700">
                          #{String(id).slice(-6).toUpperCase()}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-800 font-medium">{customerName}</td>
                      <td className="py-4 px-4 text-gray-600">
                        <span className="bg-orange-50 text-orange-700 px-2 py-1 rounded text-xs font-semibold">
                          {itemCount} {itemCount === 1 ? 'item' : 'items'}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-gray-900 font-bold">₹{Number(total || 0).toFixed(2)}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusClass(status)}`}>
                          {status.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-600 text-xs">
                        {date ? (
                          <div>
                            <div className="font-medium">{new Date(date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                            <div className="text-gray-400">{new Date(date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</div>
                          </div>
                        ) : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Stats Footer */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">{performance.totalOrders || 0}</div>
          <div className="text-xs text-gray-500 mt-1">Total Orders</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{performance.deliveredOrders || 0}</div>
          <div className="text-xs text-gray-500 mt-1">Delivered</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">{analytics.topItems?.length || 0}</div>
          <div className="text-xs text-gray-500 mt-1">Active Items</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{customerInsights.total || 0}</div>
          <div className="text-xs text-gray-500 mt-1">Unique Customers</div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
