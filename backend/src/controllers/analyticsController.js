import Order from "../models/Order.js";
import User from "../models/User.js";
import Restaurant from "../models/Restaurant.js";

// @desc    Get dashboard stats
// @route   GET /api/analytics/dashboard
// @access  Private/Admin
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalRestaurants = await Restaurant.countDocuments();

    const orders = await Order.find({ paymentStatus: "paid" });
    const totalRevenue = orders.reduce((acc, order) => acc + order.totalAmount, 0);

    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "name")
      .populate("restaurant", "name");

    res.json({
      totalUsers,
      totalOrders,
      totalRestaurants,
      totalRevenue,
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

    const totalOrders = await Order.countDocuments({ restaurant: restaurantId });
    const completedOrders = await Order.countDocuments({ restaurant: restaurantId, orderStatus: 'completed' });
    const pendingOrders = await Order.countDocuments({ restaurant: restaurantId, orderStatus: { $in: ['processing', 'accepted', 'ready', 'out-for-delivery'] } });

    const paidOrders = await Order.find({ restaurant: restaurantId, paymentStatus: "paid" });
    const totalRevenue = paidOrders.reduce((acc, order) => acc + order.totalAmount, 0);

    res.json({
      totalOrders,
      completedOrders,
      pendingOrders,
      totalRevenue
    });
  } catch (error) {
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

    // Calculate cumulative count
    let cumulative = 0;
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

