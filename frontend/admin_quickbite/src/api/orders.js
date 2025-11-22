import api from './axios';

// Get all orders (Admin)
export const getAllOrders = () => api.get('/api/orders');

// Get order by ID
export const getOrderById = (id) => api.get(`/api/orders/${id}`);

// Get order statistics
export const getOrderStats = (params) => api.get('/api/orders/stats', { params });

// Export orders
export const exportOrders = (params) => api.get('/api/orders/export', { params, responseType: 'blob' });
