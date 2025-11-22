import api from "./axios" // axios instance with baseURL: "http://localhost:5001/api"

// ✅ Update order status
export const updateOrderStatus = async (orderId, newStatus) => {
  try {
    const res = await api.put(`/api/orders/${orderId}`, { status: newStatus })
    return res.data
  } catch (err) {
    console.error("❌ Failed to update order status:", err.response?.data || err)
    throw err
  }
}

// ✅ Get all restaurant orders
export const getRestaurantOrders = async (restaurantId) => {
  try {
    const res = await api.get(`/api/orders/restaurant/${restaurantId}`)
    return res.data
  } catch (err) {
    console.error("❌ Failed to fetch restaurant orders:", err.response?.data || err)
    throw err
  }
}
