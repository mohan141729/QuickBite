import api from "./api"

const API_URL = "/api/orders"

// ✅ Create new order
export const createOrder = async (orderData) => {
  const { data } = await api.post(API_URL, orderData, { withCredentials: true })
  return data
}

// ✅ Get current user's orders
export const getMyOrders = async (token) => {
  try {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await api.get("/api/orders/myorders", { headers });
    return Array.isArray(res.data) ? res.data : res.data.orders || [];
  } catch (err) {
    console.error("❌ getMyOrders failed:", err.response?.data || err.message);
    return [];
  }
};

// ✅ Cancel order (customer)
export const cancelOrder = async (orderId, cancellationReason) => {
  const { data } = await api.put(`/api/orders/${orderId}/cancel`, { cancellationReason });
  return data;
};

// ✅ Get all orders (for admin or restaurant owners)
export const getAllOrders = async () => {
  const { data } = await api.get(API_URL, { withCredentials: true })
  return data
}

// ✅ Update order status (admin/restaurant owner)
export const updateOrderStatus = async (orderId, statusData) => {
  const { data } = await api.put(`${API_URL}/${orderId}`, statusData, { withCredentials: true })
  return data
}
