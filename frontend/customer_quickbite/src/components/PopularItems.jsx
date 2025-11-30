import React, { useEffect, useState } from 'react';
import { getPopularItems } from '../api/api';
import { Link } from 'react-router-dom';
import { Flame, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const PopularItems = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const data = await getPopularItems();
                setItems(data);
            } catch (error) {
                console.error("Failed to fetch popular items:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchItems();
    }, []);

    const handleAddToCart = (e, item) => {
        e.preventDefault(); // Prevent navigation if clicking the button
        addToCart(item, 1);
        toast.success(`Added ${item.name} to cart!`);
    };

    if (loading) return null;
    if (items.length === 0) return null;

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gray-50/50">
            <div className="flex items-center gap-2 mb-6">
                <Flame className="w-6 h-6 text-orange-500 fill-orange-500" />
                <h2 className="text-2xl font-bold text-gray-800">Popular Near You</h2>
            </div>

            <div className="flex overflow-x-auto pb-4 gap-6 scrollbar-hide">
                {items.map((item) => (
                    <Link to={`/restaurant/${item.restaurant._id}`} key={item._id} className="min-w-[260px] md:min-w-[300px] bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 flex flex-col">
                        <div className="relative h-48 overflow-hidden rounded-t-xl">
                            <img
                                src={item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80"}
                                alt={item.name}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                            />
                            {item.restaurant && (
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                                    <p className="text-white text-xs font-medium truncate">By {item.restaurant.name}</p>
                                </div>
                            )}
                        </div>
                        <div className="p-4 flex flex-col flex-grow">
                            <div className="flex justify-between items-start mb-1">
                                <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{item.name}</h3>
                                <span className="font-bold text-green-600">₹{item.price}</span>
                            </div>
                            <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-grow">{item.description}</p>

                            <button
                                onClick={(e) => handleAddToCart(e, item)}
                                className="w-full mt-auto bg-orange-50 text-orange-600 hover:bg-orange-100 py-2 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2"
                            >
                                <ShoppingBag className="w-4 h-4" />
                                Add to Cart
                            </button>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default PopularItems;
