// src/api/menu.js
import api from "./axios"; // ✅ use your axios base instance

const API_URL = "/api/menu";

// ✅ Get all menu items (admin use)
export const getAllMenuItems = async () => {
  const res = await api.get(API_URL);
  return Array.isArray(res.data) ? res.data : res.data.menuItems || [];
};

// ✅ Get menu items by restaurant
export const getMenuByRestaurant = async (restaurantId) => {
  const res = await api.get(`${API_URL}/restaurant/${restaurantId}`);
  return Array.isArray(res.data) ? res.data : res.data.menu || res.data.menuItems || [];
};

// ✅ Create a new menu item
export const createMenuItem = async (data, token) => {
  const res = await api.post(API_URL, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const updateMenuItem = async (id, data, token) => {
  const res = await api.put(`${API_URL}/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.item || res.data;
};

// ✅ Delete a menu item
export const deleteMenuItem = async (id, token) => {
  const res = await api.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// ✅ Bulk Create Menu Items
export const bulkCreateMenuItems = async (data, token) => {
  const res = await api.post(`${API_URL}/bulk`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
