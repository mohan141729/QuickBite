import api from "./axios";

// Get all restaurants
export const getRestaurants = async () => {
  const res = await api.get("api/restaurants");
  return Array.isArray(res.data) ? res.data : res.data.restaurants || [];
};

// Get restaurant by ID
export const getRestaurantById = async (id) => {
  const res = await api.get(`api/restaurants/${id}`);
  return res.data;
};

// Create new restaurant
export const createRestaurant = async (restaurantData) => {
  const res = await api.post("api/restaurants", restaurantData);
  return res.data;
};

// Update restaurant
export const updateRestaurant = async (id, data) => {
  const res = await api.put(`api/restaurants/${id}`, data);
  return res.data;
};

// Delete restaurant
export const deleteRestaurant = async (id) => {
  const res = await api.delete(`api/restaurants/${id}`);
  return res.data;
};
