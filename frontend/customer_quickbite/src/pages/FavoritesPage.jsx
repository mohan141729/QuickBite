import React from 'react';
import { useFavorites } from '../context/FavoritesContext';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import RestaurantCard from '../components/RestaurantCard';
import { Heart, Store, Utensils } from 'lucide-react';

const FavoritesPage = () => {
    const { favorites, loading } = useFavorites();

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="flex justify-center items-center h-96">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                </div>
            </div>
        );
    }

    const hasNoFavorites = favorites.restaurants.length === 0 && favorites.menuItems.length === 0;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <Heart className="w-8 h-8 fill-red-500 text-red-500" />
                        My Favorites
                    </h1>
                    <p className="text-gray-600 mt-2">Your saved restaurants and dishes</p>
                </div>

                {/* Empty State */}
                {hasNoFavorites && (
                    <div className="text-center py-20">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Heart className="w-12 h-12 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">No favorites yet</h3>
                        <p className="text-gray-500 mb-6">Start adding restaurants and dishes you love!</p>
                        <Link
                            to="/restaurants"
                            className="inline-block bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition font-semibold"
                        >
                            Explore Restaurants
                        </Link>
                    </div>
                )}

                {/* Favorite Restaurants */}
                {favorites.restaurants.length > 0 && (
                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <Store className="w-6 h-6 text-orange-500" />
                            Favorite Restaurants ({favorites.restaurants.length})
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {favorites.restaurants.map((restaurant) => (
                                <RestaurantCard key={restaurant._id} restaurant={restaurant} />
                            ))}
                        </div>
                    </section>
                )}

                {/* Favorite Menu Items */}
                {favorites.menuItems.length > 0 && (
                    <section>
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <Utensils className="w-6 h-6 text-orange-500" />
                            Favorite Dishes ({favorites.menuItems.length})
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {favorites.menuItems.map((item) => (
                                <div key={item.menuItem._id} className="bg-white rounded-2xl shadow-sm border p-4">
                                    <Link to={`/restaurant/${item.restaurant._id}`}>
                                        <img
                                            src={item.menuItem.image || 'https://placehold.co/300x200?text=No+Image'}
                                            alt={item.menuItem.name}
                                            className="w-full h-48 object-cover rounded-xl mb-3"
                                        />
                                        <h3 className="font-bold text-lg text-gray-900">{item.menuItem.name}</h3>
                                        <p className="text-sm text-gray-500 mb-2">from {item.restaurant.name}</p>
                                        <p className="text-lg font-semibold text-orange-600">₹{item.menuItem.price}</p>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};

export default FavoritesPage;
