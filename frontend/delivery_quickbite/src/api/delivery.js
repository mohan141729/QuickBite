import api from "./axios";

// Get partner profile
export const getPartnerProfile = () => api.get("/api/delivery/profile");

// Get assigned orders
export const getAssignedOrders = () => api.get("/api/delivery/orders");

// Update order status
export const updateDeliveryStatus = (orderId, status) =>
  api.put(`/api/delivery/status/${orderId}`, { status });

// Toggle partner availability (optional)
export const toggleAvailability = (partnerId, isAvailable) =>
  api.put(`/api/delivery/toggle/${partnerId}`, { isAvailable });

// Accept an order
export const acceptOrder = (orderId) =>
  api.put(`/api/delivery/accept/${orderId}`);

// Get available orders (orders ready for assignment)
export const getAvailableOrders = () =>
  api.get("/api/delivery/available");

// Get active delivery
export const getActiveDelivery = () =>
  api.get("/api/delivery/active");

// Get earnings summary
export const getEarningsSummary = () =>
  api.get("/api/delivery/earnings");

// Get performance metrics
export const getPerformanceMetrics = () =>
  api.get("/api/delivery/performance");

// Get delivery history
export const getDeliveryHistory = () =>
  api.get("/api/delivery/history");

