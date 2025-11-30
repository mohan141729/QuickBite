import React from 'react';
import { Heart } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';
import { useAuth } from '../context/AuthContext';

const FavoriteButton = ({ restaurantId, menuItemId, type = 'restaurant', className = '' }) => {
    const { isSignedIn } = useAuth();
    const { toggleRestaurantFavorite, toggleMenuItemFavorite, isRestaurantFavorite, isMenuItemFavorite } = useFavorites();

    // Always show the button, but only make it functional when signed in
    const isFavorite = type === 'restaurant'
        ? isRestaurantFavorite(restaurantId)
        : isMenuItemFavorite(menuItemId);

    const handleClick = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isSignedIn) {
            // Could show a toast or redirect to login
            alert('Please sign in to add favorites');
            return;
        }

        if (type === 'restaurant') {
            toggleRestaurantFavorite(restaurantId);
        } else {
            toggleMenuItemFavorite(menuItemId, restaurantId);
        }
    };

    return (
        <button
            onClick={handleClick}
            className={`p-2 rounded-full hover:bg-white hover:shadow-md transition-all ${className}`}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
            <Heart
                className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600 hover:text-red-500'}`}
            />
        </button>
    );
};

export default FavoriteButton;
