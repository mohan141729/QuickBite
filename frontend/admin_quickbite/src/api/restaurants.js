import api from './axios';

// Get all restaurants (Admin)
export const getAllRestaurants = () => api.get('/restaurants/admin/all');

// Update restaurant status (Approve/Reject)
export const updateRestaurantStatus = (id, status) => api.put(`/restaurants/${id}/status`, { status });

// Get restaurant by ID
export const getRestaurantById = (id) => api.get(`/restaurants/${id}`);

// Delete restaurant
export const deleteRestaurant = (id) => api.delete(`/restaurants/${id}`);

