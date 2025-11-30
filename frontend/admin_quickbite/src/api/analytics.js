import api from './axios';

export const getDashboardAnalytics = async () => {
    const response = await api.get('/analytics/dashboard');
    return response.data;
};

export const getRevenueAnalytics = async () => {
    const response = await api.get('/analytics/revenue');
    return response.data;
};

export const getOrderStatusDistribution = async () => {
    const response = await api.get('/analytics/order-status');
    return response.data;
};

export const getTopRestaurants = async () => {
    const response = await api.get('/analytics/top-restaurants');
    return response.data;
};

export const getUserGrowth = async () => {
    const response = await api.get('/analytics/user-growth');
    return response.data;
};
