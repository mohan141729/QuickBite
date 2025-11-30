import api from './axios';

// Get all orders (Admin)
export const getAllOrders = (params) => api.get('/orders', { params });

// Get order by ID
export const getOrderById = (id) => api.get(`/orders/${id}`);

// Get order statistics
export const getOrderStats = (params) => api.get('/orders/stats', { params });

// Export orders
export const exportOrders = (params) => api.get('/orders/export', { params, responseType: 'blob' });
