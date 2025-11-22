import api from './axios';

export const getDashboardAnalytics = async () => {
    const response = await api.get('/api/analytics/dashboard');
    return response.data;
};

export const getRevenueAnalytics = async () => {
    const response = await api.get('/api/analytics/revenue');
    return response.data;
};

export const getOrderStatusDistribution = async () => {
    const response = await api.get('/api/analytics/order-status');
    return response.data;
};

export const getTopRestaurants = async () => {
    const response = await api.get('/api/analytics/top-restaurants');
    return response.data;
};

export const getUserGrowth = async () => {
    const response = await api.get('/api/analytics/user-growth');
    return response.data;
};
