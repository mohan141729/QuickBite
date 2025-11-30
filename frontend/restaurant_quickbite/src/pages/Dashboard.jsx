import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import AddRestaurantModal from "../components/AddRestaurantModal";
import EditRestaurantModal from "../components/EditRestaurantModal";
import RestaurantCard from "../components/RestaurantCard";
import { getRestaurants, deleteRestaurant, updateRestaurant } from "../api/restaurants";
import { PlusCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Dashboard = () => {
  const { user } = useAuth();
  const [restaurants, setRestaurants] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editRestaurant, setEditRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch restaurants
  useEffect(() => {
    const loadRestaurants = async () => {
      try {
        const data = await getRestaurants();
        // Backend already filters by owner for restaurant_owner role
        setRestaurants(data);
      } catch (err) {
        console.error("❌ Failed to load restaurants:", err);
        toast.error("Failed to load restaurants.");
      } finally {
        setLoading(false);
      }
    };
    loadRestaurants();
  }, [user, refreshKey]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this restaurant?")) return;
    try {
      await deleteRestaurant(id);
      setRestaurants((prev) => prev.filter((r) => r._id !== id));
      toast.success("Restaurant deleted!");
    } catch (err) {
      console.error("❌ Failed to delete restaurant:", err);
      toast.error("Failed to delete restaurant.");
    }
  };

  const handleSave = async (id, data) => {
    try {
      const updated = await updateRestaurant(id, data);
      setRestaurants((prev) =>
        prev.map((r) => (r._id === id ? updated.restaurant : r))
      );
      setEditRestaurant(null);
      toast.success("Restaurant updated!");
    } catch (err) {
      console.error("❌ Failed to update restaurant:", err);
      toast.error("Update failed.");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-600">
        <div className="w-10 h-10 border-4 border-[#FC8019] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="animate-pulse">Loading restaurants...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 pt-24 pb-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-1">
              {user?.role === "restaurant_owner" ? "My Restaurants" : "Explore Restaurants"}
            </h1>
            <p className="text-gray-500 text-sm">
              {user?.role === "restaurant_owner"
                ? "Manage all your listed restaurants below."
                : "Browse and manage all available restaurants."}
            </p>
          </div>

          {user?.role === "restaurant_owner" && (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#FC8019] to-[#E23744] text-white font-semibold rounded-lg shadow hover:opacity-90 transition-all duration-200"
            >
              <PlusCircle size={18} />
              Add Restaurant
            </button>
          )}
        </div>

        {restaurants?.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {restaurants.map((r) => (
              <RestaurantCard
                key={r._id}
                restaurant={r}
                onClick={() => navigate(`/restaurant-dashboard/${r._id}`)}
                onEdit={() => setEditRestaurant(r)}
                onDelete={() => handleDelete(r._id)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <img
              src="https://res.cloudinary.com/ds6o1cohi/image/upload/v1720589941/empty-cart.svg"
              alt="No restaurants"
              className="w-44 mb-5 opacity-90"
            />
            <p className="text-center text-gray-600 text-base">
              {user?.role === "restaurant_owner"
                ? "You haven’t added any restaurants yet."
                : "No restaurants found at the moment."}
            </p>
            {user?.role === "restaurant_owner" && (
              <button
                onClick={() => setShowAddModal(true)}
                className="mt-4 bg-[#FC8019] text-white font-semibold px-4 py-2 rounded-lg hover:bg-[#E23744] transition"
              >
                Add Your First Restaurant
              </button>
            )}
          </div>
        )}
      </div>

      {showAddModal && (
        <AddRestaurantModal
          onClose={() => setShowAddModal(false)}
          onAdded={() => {
            setRefreshKey(prev => prev + 1);
            setShowAddModal(false);
          }}
        />
      )}

      {editRestaurant && (
        <EditRestaurantModal
          restaurant={editRestaurant}
          onClose={() => setEditRestaurant(null)}
          onSave={(data) => handleSave(editRestaurant._id, data)}
        />
      )}
    </div>
  );
};

export default Dashboard;
