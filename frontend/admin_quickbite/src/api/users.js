import api from './axios';

// Get all users
export const getAllUsers = (params) => api.get('/api/users', { params });

// Create user
export const createUser = (data) => api.post('/api/users', data);

// Get user by ID
export const getUserById = (id) => api.get(`/api/users/${id}`);

// Update user
export const updateUser = (id, data) => api.put(`/api/users/${id}`, data);

// Delete user
export const deleteUser = (id) => api.delete(`/api/users/${id}`);

// Toggle user status
export const toggleUserStatus = (id) => api.put(`/api/users/${id}/toggle-status`);
