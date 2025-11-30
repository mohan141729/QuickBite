import api from './api';

// Get all favorites
export const getFavorites = async () => {
    const { data } = await api.get('/api/favorites');
    return data.favorites;
};

// Add restaurant to favorites
export const addRestaurantToFavorites = async (restaurantId) => {
    const { data } = await api.post(`/api/favorites/restaurant/${restaurantId}`);
    return data.favorites;
};

// Remove restaurant from favorites
export const removeRestaurantFromFavorites = async (restaurantId) => {
    const { data } = await api.delete(`/api/favorites/restaurant/${restaurantId}`);
    return data.favorites;
};

// Add menu item to favorites
export const addMenuItemToFavorites = async (menuItemId, restaurantId) => {
    const { data } = await api.post(`/api/favorites/menuItem/${menuItemId}`, { restaurantId });
    return data.favorites;
};

// Remove menu item from favorites
export const removeMenuItemFromFavorites = async (menuItemId) => {
    const { data } = await api.delete(`/api/favorites/menuItem/${menuItemId}`);
    return data.favorites;
};
