import React, { useEffect, useState } from 'react';
import { getRecommendedRestaurants } from '../api/api';
import { Link } from 'react-router-dom';
import { Star, MapPin } from 'lucide-react';

const RecommendedRestaurants = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const data = await getRecommendedRestaurants();
                setRestaurants(data);
            } catch (error) {
                console.error("Failed to fetch recommended restaurants:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRestaurants();
    }, []);

    if (loading) return <div className="h-40 flex items-center justify-center">Loading recommendations...</div>;
    if (restaurants.length === 0) return null;

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Recommended for You</h2>
            <div className="flex overflow-x-auto pb-4 gap-6 scrollbar-hide">
                {restaurants.map((restaurant) => (
                    <Link to={`/restaurant/${restaurant._id}`} key={restaurant._id} className="min-w-[280px] md:min-w-[320px] bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-100">
                        <div className="relative h-40">
                            <img
                                src={restaurant.image || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&q=80"}
                                alt={restaurant.name}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                <span className="text-sm font-bold text-gray-800">{restaurant.rating || "New"}</span>
                            </div>
                        </div>
                        <div className="p-4">
                            <h3 className="text-lg font-bold text-gray-900 mb-1 truncate">{restaurant.name}</h3>
                            <div className="flex items-center text-gray-500 text-sm mb-2">
                                <MapPin className="w-4 h-4 mr-1" />
                                <span className="truncate">{restaurant.location?.city || "Nearby"}</span>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {restaurant.cuisine?.slice(0, 3).map((cuisine, idx) => (
                                    <span key={idx} className="text-xs bg-orange-50 text-orange-600 px-2 py-1 rounded-full font-medium">
                                        {cuisine}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default RecommendedRestaurants;
