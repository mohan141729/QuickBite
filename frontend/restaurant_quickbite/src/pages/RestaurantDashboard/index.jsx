import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { getRestaurantById } from "../../api/restaurants";
import OverviewTab from "./OverviewTab";
import MenuTab from "./MenuTab";
import OrdersTab from "./OrdersTab";
import AnalyticsTab from "./AnalyticsTab";
import SettingsTab from "./SettingsTab";
import { MapPin, Utensils, Wifi, WifiOff, ArrowLeft, AlertCircle, CheckCircle, XCircle } from "lucide-react";

const RestaurantDashboard = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [restaurant, setRestaurant] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);

  // Fetch restaurant data
  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const data = await getRestaurantById(id);
        setRestaurant(data);
      } catch (error) {
        console.error("Failed to load restaurant:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurant();
  }, [id]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-pulse text-gray-600">Loading...</div>
      </div>
    );

  if (!restaurant)
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        Restaurant not found.
      </div>
    );

  const isOnline = restaurant?.isOpen;

  // Safely handle location and cuisine objects
  const locationText =
    restaurant.location && typeof restaurant.location === "object"
      ? restaurant.location.address || "Unknown Location"
      : restaurant.location || "Unknown Location";



  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Status Banner */}
      {restaurant.status === "pending" && (
        <div className="bg-yellow-50 border-b-2 border-yellow-200 px-6 py-3">
          <div className="max-w-6xl mx-auto flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            <div>
              <p className="text-yellow-800 font-semibold text-sm">
                Restaurant Creation in Process
              </p>
              <p className="text-yellow-700 text-xs">
                Your restaurant is pending admin approval. You'll be notified once it's approved.
              </p>
            </div>
          </div>
        </div>
      )}

      {restaurant.status === "rejected" && (
        <div className="bg-red-50 border-b-2 border-red-200 px-6 py-3">
          <div className="max-w-6xl mx-auto flex items-center gap-3">
            <XCircle className="w-5 h-5 text-red-600" />
            <div>
              <p className="text-red-800 font-semibold text-sm">
                Restaurant Application Rejected
              </p>
              <p className="text-red-700 text-xs">
                Your restaurant application was not approved. Please contact support for more information.
              </p>
            </div>
          </div>
        </div>
      )}

      {restaurant.status === "approved" && (
        <div className="bg-green-50 border-b-2 border-green-200 px-6 py-3">
          <div className="max-w-6xl mx-auto flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-green-800 font-semibold text-sm">
                Restaurant Approved & Active
              </p>
              <p className="text-green-700 text-xs">
                Your restaurant is live and accepting orders!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* === Hero Section === */}
      <div className="relative bg-gradient-to-r from-[#FC8019] to-[#E23744] text-white pt-28 pb-14 px-8 rounded-b-3xl shadow-lg">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 items-center gap-10">
          {/* Left Section - Restaurant Info */}
          <div className="md:col-span-2 flex flex-col gap-3">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-3xl font-bold leading-tight">{restaurant.name}</h1>
              <span
                className={`flex items-center gap-1 text-sm font-semibold px-3 py-1 rounded-full shadow-sm ${isOnline ? "bg-white/20 text-white" : "bg-white/20 text-gray-200"
                  }`}
              >
                {isOnline ? (
                  <>
                    <Wifi className="w-4 h-4 text-green-300" /> Online
                  </>
                ) : (
                  <>
                    <WifiOff className="w-4 h-4 text-red-300" /> Offline
                  </>
                )}
              </span>
            </div>
            <div className="flex-wrap gap-2">
              <div className="flex flex-wrap gap-4 mt-2 text-sm text-white/90">
                <div className="flex items-center gap-1">
                  <Utensils className="w-4 h-4 text-white/80" />
                  <span>{Array.isArray(restaurant.cuisine) ? restaurant.cuisine.join(", ") : restaurant.cuisine || "Cuisine"}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-white/80" />
                  <span>{locationText}</span>
                </div>
                {restaurant.rating && (
                  <div className="flex items-center gap-1">
                    ⭐ <span>{restaurant.rating.toFixed(1)} / 5</span>
                  </div>
                )}
              </div>

              <div className="flex-wrap mt-4 text-sm text-white/80">
                <p>
                  <span className="font-semibold">Contact:</span>{" "}
                  {restaurant.phone || "N/A"} |{" "}
                  <span className="font-semibold">Email:</span>{" "}
                  {restaurant.email || "N/A"}
                </p>
                <p>
                  <span className="font-semibold">Timings:</span>{" "}
                  {restaurant.operatingHours?.open && restaurant.operatingHours?.close
                    ? `${restaurant.operatingHours.open} - ${restaurant.operatingHours.close}`
                    : "Not specified"}
                </p>
              </div>
            </div>
          </div>
          {/* Right Section - Restaurant Image + Back Button */}
          <div className="flex flex-col items-center md:items-end gap-4">
            <img
              src={
                restaurant.image ||
                "https://res.cloudinary.com/ds6o1cohi/image/upload/v1720593157/restaurant-placeholder.jpg"
              }
              alt={restaurant.name}
              className="w-48 h-48 object-cover rounded-2xl shadow-xl border-2 border-white"
            />

            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 bg-white text-[#FC8019] px-5 py-2 rounded-full shadow-md font-semibold hover:bg-gray-100 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* === Tabs === */}
      <div className="max-w-[95%] mx-auto px-6 mt-10">
        <div className="flex gap-6 border-b border-gray-200 mb-8 overflow-x-auto">
          {["overview", "menu", "orders", "analytics", "settings"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`capitalize py-3 px-5 font-semibold text-sm tracking-wide transition-all duration-200 ${activeTab === tab
                ? "text-[#FC8019] border-b-2 border-[#FC8019]"
                : "text-gray-500 hover:text-gray-800"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* === Render Tabs === */}
        <div className="pb-10">
          {activeTab === "overview" && <OverviewTab restaurantId={id} restaurant={restaurant} />}
          {activeTab === "menu" && <MenuTab restaurantId={id} />}
          {activeTab === "orders" && <OrdersTab restaurantId={id} />}
          {activeTab === "analytics" && <AnalyticsTab restaurantId={id} />}
          {activeTab === "settings" && <SettingsTab restaurant={restaurant} onRestaurantUpdated={setRestaurant} />}
        </div>
      </div>
    </div>
  );
};

export default RestaurantDashboard;
