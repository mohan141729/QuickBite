import React from "react"
import { Star, Clock, MapPin, Tag } from "lucide-react"
import { Link } from "react-router-dom"

const RestaurantCard = ({ restaurant }) => {
  return (
    <Link
      to={`/restaurant/${restaurant._id}`}
      className="block group rounded-2xl border border-gray-100 overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={restaurant.image || "https://via.placeholder.com/300x200"}
          alt={restaurant.name}
          className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {restaurant.isOpen ? (
            <span className="bg-white/90 backdrop-blur-sm text-green-700 text-xs font-bold px-2 py-1 rounded-md shadow-sm">
              OPEN NOW
            </span>
          ) : (
            <span className="bg-white/90 backdrop-blur-sm text-red-600 text-xs font-bold px-2 py-1 rounded-md shadow-sm">
              CLOSED
            </span>
          )}
        </div>

        <div className="absolute bottom-3 left-3 text-white">
          <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-1 rounded-lg">
            <Clock className="w-3 h-3 text-white" />
            <span className="text-xs font-medium">30-40 min</span>
          </div>
        </div>

        {/* Promoted Tag (Mock) */}
        {Math.random() > 0.7 && (
          <div className="absolute top-3 right-3 bg-[#FC8019] text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm uppercase tracking-wide">
            Promoted
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-bold text-gray-900 text-lg truncate flex-1 group-hover:text-[#FC8019] transition-colors">
            {restaurant.name}
          </h3>
          <div className="flex items-center gap-1 bg-green-600 text-white px-1.5 py-0.5 rounded-md text-xs font-bold">
            <span>{restaurant.rating?.toFixed(1) || "4.2"}</span>
            <Star className="w-3 h-3 fill-white" />
          </div>
        </div>

        <p className="text-sm text-gray-500 truncate mb-3">
          {restaurant.cuisines?.join(", ") || "Multi-Cuisine"}
        </p>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1 text-gray-400 text-xs">
            <MapPin className="w-3 h-3" />
            <span>{restaurant.location?.city || "Nearby"}</span>
          </div>
          <div className="flex items-center gap-1 text-blue-600 text-xs font-medium">
            <Tag className="w-3 h-3" />
            <span>50% OFF up to ₹100</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default RestaurantCard
