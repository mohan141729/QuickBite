import api from "./axios";

export const getRestaurantAnalytics = async (restaurantId, period = 'week') => {
  const res = await api.get(`/api/analytics/${restaurantId}?period=${period}`);
  return res.data;
};
