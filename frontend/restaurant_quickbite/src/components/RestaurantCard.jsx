import React from "react";
import { Pencil, Trash2, Star } from "lucide-react";

const RestaurantCard = ({ restaurant, onClick, onEdit, onDelete }) => {
  const locationText =
    restaurant.location && typeof restaurant.location === "object"
      ? restaurant.location.address || "Unknown"
      : restaurant.location || "Unknown";

  const cuisineText =
    restaurant.cuisine && typeof restaurant.cuisine === "object"
      ? restaurant.cuisine.name || "Cuisine"
      : restaurant.cuisine || "Cuisine";

  const rating = restaurant.rating || 0; // ✅ use rating

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition cursor-pointer overflow-hidden group relative">
      <div onClick={onClick} className="relative">
        <img
          src={
            restaurant.image ||
            "https://res.cloudinary.com/ds6o1cohi/image/upload/v1720593157/restaurant-placeholder.jpg"
          }
          alt={restaurant.name}
          className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 left-2 bg-[#FC8019] text-white text-xs font-semibold px-2 py-1 rounded-md">
          {cuisineText}
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-800 mb-1 truncate">
          {restaurant.name}
        </h3>
        <p className="text-sm text-gray-500 mb-2">
          {restaurant.description
            ? restaurant.description.toString().slice(0, 60)
            : "No description"}
        </p>

        {/* Rating display */}
        <div className="flex items-center gap-1 text-yellow-500 text-sm mb-1">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star
              key={index}
              size={16}
              fill={index < Math.round(rating) ? "currentColor" : "none"}
              stroke="currentColor"
            />
          ))}
          <span className="text-gray-600 ml-2 text-sm">{rating.toFixed(1)}</span>
        </div>

        <div className="text-sm text-gray-600">📍 {locationText}</div>
      </div>

      {/* Action buttons */}
      <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
        >
          <Pencil size={16} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default RestaurantCard;
