import api from './axios';

// Get all restaurants (Admin)
export const getAllRestaurants = () => api.get('/api/restaurants/admin/all');

// Update restaurant status (Approve/Reject)
export const updateRestaurantStatus = (id, status) => api.put(`/api/restaurants/${id}/status`, { status });

// Get restaurant by ID
export const getRestaurantById = (id) => api.get(`/api/restaurants/${id}`);

// Delete restaurant
export const deleteRestaurant = (id) => api.delete(`/api/restaurants/${id}`);

