/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getFavorites, addRestaurantToFavorites, removeRestaurantFromFavorites, addMenuItemToFavorites, removeMenuItemFromFavorites } from '../api/favorites';
import { useAuth } from './AuthContext';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
    const { user } = useAuth();
    const [favorites, setFavorites] = useState({ restaurants: [], menuItems: [] });
    const [loading, setLoading] = useState(false);

    // Load favorites on mount if signed in
    useEffect(() => {
        if (user) {
            loadFavorites();
        } else {
            setFavorites({ restaurants: [], menuItems: [] });
        }
    }, [user]);

    const loadFavorites = async () => {
        try {
            setLoading(true);
            const data = await getFavorites();
            setFavorites(data);
        } catch (error) {
            console.error('Failed to load favorites:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleRestaurantFavorite = async (restaurantId) => {
        if (!user) return;

        try {
            const isFavorite = favorites.restaurants.some(r => r._id === restaurantId);

            if (isFavorite) {
                const updated = await removeRestaurantFromFavorites(restaurantId);
                setFavorites(updated);
            } else {
                const updated = await addRestaurantToFavorites(restaurantId);
                setFavorites(updated);
            }
        } catch (error) {
            console.error('Failed to toggle restaurant favorite:', error);
        }
    };

    const toggleMenuItemFavorite = async (menuItemId, restaurantId) => {
        if (!user) return;

        try {
            const isFavorite = favorites.menuItems.some(item => item.menuItem?._id === menuItemId);

            let updated;
            if (isFavorite) {
                updated = await removeMenuItemFromFavorites(menuItemId);
            } else {
                updated = await addMenuItemToFavorites(menuItemId, restaurantId);
            }
            setFavorites(updated);
        } catch (error) {
            console.error('Failed to toggle menu item favorite:', error);
        }
    };

    const isRestaurantFavorite = (restaurantId) => {
        return favorites.restaurants.some(r => r._id === restaurantId);
    };

    const isMenuItemFavorite = (menuItemId) => {
        return favorites.menuItems.some(item => item.menuItem?._id === menuItemId);
    };

    return (
        <FavoritesContext.Provider
            value={{
                favorites,
                loading,
                toggleRestaurantFavorite,
                toggleMenuItemFavorite,
                isRestaurantFavorite,
                isMenuItemFavorite,
            }}
        >
            {children}
        </FavoritesContext.Provider>
    );
};

export const useFavorites = () => useContext(FavoritesContext);
