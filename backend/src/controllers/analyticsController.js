import mongoose from "mongoose";
import Order from "../models/Order.js";
import User from "../models/User.js";
import Restaurant from "../models/Restaurant.js";
import DeliveryPartner from "../models/DeliveryPartner.js";



// @desc    Get dashboard stats
// @route   GET /api/analytics/dashboard
// @access  Private/Admin
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalRestaurants = await Restaurant.countDocuments();

    const revenueResult = await Order.aggregate([
      { $match: { paymentStatus: "paid" } },
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$totalAmount" }, // GMV
          platformRevenue: { $sum: "$platformFee" } // Actual Admin Revenue
        }
      }
    ]);

    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalSales : 0; // Keep as GMV for backward compatibility
    const platformRevenue = revenueResult.length > 0 ? revenueResult[0].platformRevenue : 0;

    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "name")
      .populate("restaurant", "name");

    const activeOrders = await Order.countDocuments({
      orderStatus: { $in: ['processing', 'accepted', 'ready', 'out-for-delivery'] }
    });

    const pendingRestaurants = await Restaurant.countDocuments({ status: 'pending' });

    const onlinePartners = await DeliveryPartner.countDocuments({
      isAvailable: true,
      status: 'approved'
    });

    res.json({
      totalUsers,
      totalOrders,
      totalRestaurants,
      totalRevenue, // GMV
      platformRevenue, // New field
      activeOrders,
      pendingRestaurants,
      onlinePartners,
      recentOrders,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get revenue analytics
// @route   GET /api/analytics/revenue
// @access  Private/Admin
export const getRevenueAnalytics = async (req, res) => {
  try {
    // Group orders by date (last 7 days or 30 days)
    // For simplicity, let's return monthly revenue for the current year
    const currentYear = new Date().getFullYear();

    const revenueData = await Order.aggregate([
      {
        $match: {
          paymentStatus: "paid",
          createdAt: {
            $gte: new Date(`${currentYear}-01-01`),
            $lte: new Date(`${currentYear}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          total: { $sum: "$totalAmount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Format for frontend [ { name: 'Jan', value: 1000 }, ... ]
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const formattedData = months.map((month, index) => {
      const found = revenueData.find((d) => d._id === index + 1);
      return {
        name: month,
        value: found ? found.total : 0,
      };
    });

    res.json(formattedData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get restaurant analytics
// @route   GET /api/analytics/:restaurantId
// @access  Private
export const getRestaurantAnalytics = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const restaurantObjectId = new mongoose.Types.ObjectId(restaurantId);

    // Date ranges
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    // 1. Basic Counts
    const totalOrders = await Order.countDocuments({ restaurant: restaurantId });
    const completedOrders = await Order.countDocuments({ restaurant: restaurantId, orderStatus: 'delivered' });
    const cancelledOrders = await Order.countDocuments({ restaurant: restaurantId, orderStatus: 'cancelled' });

    // 2. Revenue & Orders (Current Week vs Last Week)
    const revenueStats = await Order.aggregate([
      {
        $match: {
          restaurant: restaurantObjectId,
          paymentStatus: "paid",
          createdAt: { $gte: twoWeeksAgo }
        }
      },
      {
        $group: {
          _id: {
            week: { $cond: [{ $gte: ["$createdAt", oneWeekAgo] }, "current", "previous"] }
          },
          // Revenue = Total - Delivery - Platform
          revenue: {
            $sum: {
              $subtract: [
                "$totalAmount",
                { $add: [{ $ifNull: ["$deliveryFee", 0] }, { $ifNull: ["$platformFee", 0] }] }
              ]
            }
          },
          orders: { $sum: 1 }
        }
      }
    ]);

    const currentWeek = revenueStats.find(s => s._id.week === "current") || { revenue: 0, orders: 0 };
    const previousWeek = revenueStats.find(s => s._id.week === "previous") || { revenue: 0, orders: 0 };

    // Calculate trends
    const calculateTrend = (current, previous) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Math.round(((current - previous) / previous) * 100);
    };

    const revenueTrend = calculateTrend(currentWeek.revenue, previousWeek.revenue);
    const ordersTrend = calculateTrend(currentWeek.orders, previousWeek.orders);

    // 3. Average Order Value
    const avgOrderValue = totalOrders > 0
      ? (await Order.aggregate([
        { $match: { restaurant: restaurantObjectId, paymentStatus: "paid" } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } }
      ]))[0]?.total / totalOrders
      : 0;

    // 4. Customer Insights
    const customers = await Order.distinct("user", { restaurant: restaurantId });
    const totalCustomers = customers.length;

    // New customers (first order in last 30 days) - Simplified for now
    // Returning customers (more than 1 order)
    const customerOrderCounts = await Order.aggregate([
      { $match: { restaurant: restaurantObjectId } },
      { $group: { _id: "$user", count: { $sum: 1 } } }
    ]);

    const returningCustomers = customerOrderCounts.filter(c => c.count > 1).length;
    const newCustomers = totalCustomers - returningCustomers;
    const retentionRate = totalCustomers > 0 ? Math.round((returningCustomers / totalCustomers) * 100) : 0;

    // 5. Performance Rates
    const acceptanceRate = totalOrders > 0
      ? Math.round(((totalOrders - cancelledOrders) / totalOrders) * 100)
      : 100;

    const fulfillmentRate = totalOrders > 0
      ? Math.round((completedOrders / totalOrders) * 100)
      : 0;

    const cancellationRate = totalOrders > 0
      ? Math.round((cancelledOrders / totalOrders) * 100)
      : 0;

    // 6. Order Status Distribution
    const orderStatusDistribution = await Order.aggregate([
      { $match: { restaurant: restaurantObjectId } },
      { $group: { _id: "$orderStatus", count: { $sum: 1 } } }
    ]);

    const orderStatus = orderStatusDistribution.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {});

    // 7. Top Selling Items
    const topItemsRaw = await Order.aggregate([
      { $match: { restaurant: restaurantObjectId, paymentStatus: "paid" } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.menuItem",
          name: { $first: "$items.name" }, // Assuming name is stored in items array or we need lookup
          qty: { $sum: "$items.quantity" },
          revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } }
        }
      },
      { $sort: { qty: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "menuitems",
          localField: "_id",
          foreignField: "_id",
          as: "menuItemDetails"
        }
      },
      { $unwind: { path: "$menuItemDetails", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          name: { $ifNull: ["$menuItemDetails.name", "Unknown Item"] },
          qty: 1,
          revenue: 1
        }
      }
    ]);

    // 8. Category Performance
    const categoryPerformanceRaw = await Order.aggregate([
      { $match: { restaurant: restaurantObjectId, paymentStatus: "paid" } },
      { $unwind: "$items" },
      {
        $lookup: {
          from: "menuitems",
          localField: "items.menuItem",
          foreignField: "_id",
          as: "menuItem"
        }
      },
      { $unwind: "$menuItem" },
      {
        $group: {
          _id: "$menuItem.category",
          revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } }
        }
      },
      { $sort: { revenue: -1 } }
    ]);

    const categoryPerformance = categoryPerformanceRaw.map(c => ({
      name: c._id || "Uncategorized",
      revenue: c.revenue
    }));

    // 9. Time Series Data (Last 7 Days)
    const timeSeriesRaw = await Order.aggregate([
      {
        $match: {
          restaurant: restaurantObjectId,
          createdAt: { $gte: oneWeekAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: { $sum: "$totalAmount" },
          orders: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Fill in missing days
    const timeSeriesData = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const found = timeSeriesRaw.find(r => r._id === dateStr);
      timeSeriesData.push({
        label: d.toLocaleDateString('en-US', { weekday: 'short' }),
        date: dateStr,
        revenue: found ? found.revenue : 0,
        orders: found ? found.orders : 0
      });
    }

    // 10. Peak Hours
    const peakHoursRaw = await Order.aggregate([
      { $match: { restaurant: restaurantObjectId } },
      {
        $group: {
          _id: { $hour: "$createdAt" },
          orders: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const hourlyDistribution = Array.from({ length: 24 }, (_, i) => {
      const found = peakHoursRaw.find(h => h._id === i);
      return {
        label: `${i}:00`,
        orders: found ? found.orders : 0
      };
    });

    const peakHour = peakHoursRaw.sort((a, b) => b.orders - a.orders)[0];
    const peakHourLabel = peakHour ? `${peakHour._id}:00 - ${peakHour._id + 1}:00` : "N/A";

    // Construct response matching frontend expectation
    res.json({
      metrics: {
        revenue: {
          current: currentWeek.revenue,
          change: Math.abs(revenueTrend),
          trend: revenueTrend >= 0 ? 'up' : 'down'
        },
        orders: {
          current: currentWeek.orders,
          change: Math.abs(ordersTrend),
          trend: ordersTrend >= 0 ? 'up' : 'down'
        },
        avgOrderValue: {
          current: Math.round(avgOrderValue),
          change: 0, // Placeholder
          trend: 'up'
        },
        customers: {
          current: totalCustomers,
          change: 0, // Placeholder
          trend: 'up'
        }
      },
      performance: {
        acceptanceRate,
        fulfillmentRate,
        cancellationRate,
        totalOrders,
        deliveredOrders: completedOrders
      },
      customerInsights: {
        total: totalCustomers,
        new: newCustomers,
        returning: returningCustomers,
        retentionRate
      },
      orderStatus,
      topItems: topItemsRaw,
      categoryPerformance,
      timeSeriesData,
      peakHours: {
        hourlyDistribution,
        peakHourLabel
      },
      // Keep flat structure as fallback/legacy
      totalOrders,
      completedOrders,
      pendingOrders: totalOrders - completedOrders - cancelledOrders,
      totalRevenue: (await Order.aggregate([
        { $match: { restaurant: restaurantObjectId, paymentStatus: "paid" } },
        {
          $group: {
            _id: null,
            total: {
              $sum: {
                $subtract: [
                  "$totalAmount",
                  { $add: [{ $ifNull: ["$deliveryFee", 0] }, { $ifNull: ["$platformFee", 0] }] }
                ]
              }
            }
          }
        }
      ]))[0]?.total || 0
    });

  } catch (error) {
    console.error("Analytics Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get order status distribution
// @route   GET /api/analytics/order-status
// @access  Private/Admin
export const getOrderStatusDistribution = async (req, res) => {
  try {
    const statusCounts = await Order.aggregate([
      {
        $group: {
          _id: "$orderStatus",
          count: { $sum: 1 }
        }
      }
    ]);

    // Format for frontend
    const formattedData = statusCounts.map(item => ({
      name: item._id.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      value: item.count
    }));

    res.json(formattedData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get top performing restaurants
// @route   GET /api/analytics/top-restaurants
// @access  Private/Admin
export const getTopRestaurants = async (req, res) => {
  try {
    const topRestaurants = await Order.aggregate([
      {
        $group: {
          _id: "$restaurant",
          orders: { $sum: 1 },
          revenue: { $sum: "$totalAmount" }
        }
      },
      { $sort: { orders: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "restaurants",
          localField: "_id",
          foreignField: "_id",
          as: "restaurantInfo"
        }
      },
      { $unwind: "$restaurantInfo" }
    ]);

    // Format for frontend
    const formattedData = topRestaurants.map(item => ({
      name: item.restaurantInfo.name || "Unknown",
      orders: item.orders,
      revenue: item.revenue
    }));

    res.json(formattedData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user growth trend
// @route   GET /api/analytics/user-growth
// @access  Private/Admin
export const getUserGrowth = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();

    const userGrowth = await User.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${currentYear}-01-01`),
            $lte: new Date(`${currentYear}-12-31`)
          }
        }
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Format for frontend
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const startOfYear = new Date(`${currentYear}-01-01`);
    const initialCount = await User.countDocuments({
      createdAt: { $lt: startOfYear }
    });

    // Calculate cumulative count
    let cumulative = initialCount;
    const formattedData = months.map((month, index) => {
      const found = userGrowth.find(d => d._id === index + 1);
      cumulative += found ? found.count : 0;
      return {
        month: month,
        users: cumulative
      };
    });

    res.json(formattedData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

