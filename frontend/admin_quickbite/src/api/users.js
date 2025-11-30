import api from './axios';

// Get all users
export const getAllUsers = (params) => api.get('/users', { params });

// Create user
export const createUser = (data) => api.post('/users', data);

// Get user by ID
export const getUserById = (id) => api.get(`/users/${id}`);

// Update user
export const updateUser = (id, data) => api.put(`/users/${id}`, data);

// Delete user
export const deleteUser = (id) => api.delete(`/users/${id}`);

// Toggle user status
// Toggle user status
export const toggleUserStatus = (id) => api.put(`/users/${id}/toggle-status`);

// Invite admin
export const inviteAdmin = (email) => api.post('/users/invite', { email });
