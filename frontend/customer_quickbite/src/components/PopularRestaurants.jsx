import React, { useEffect, useState } from "react"
import { getRestaurants } from "../api/restaurant"
import RestaurantCard from "./RestaurantCard"
import { Loader2, TrendingUp, ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"

const PopularRestaurants = () => {
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const data = await getRestaurants()
        // show top 4 by rating or default first 4
        const topRestaurants = data
          .sort((a, b) => (b.rating || 0) - (a.rating || 0))
          .slice(0, 4)
        setRestaurants(topRestaurants)
      } catch (error) {
        console.error("Failed to fetch restaurants:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchRestaurants()
  }, [])

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-gray-50/50 rounded-3xl my-12">
      <div className="flex items-end justify-between mb-10">
        <div>
          <div className="flex items-center gap-2 text-[#E23744] font-semibold mb-2">
            <TrendingUp className="w-5 h-5" />
            <span className="uppercase tracking-wider text-sm">Customer Favorites</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
            Top Rated Restaurants
          </h2>
        </div>

        <Link
          to="/restaurants"
          className="group flex items-center gap-2 text-[#FC8019] font-bold hover:text-[#E23744] transition-colors"
        >
          <span>Explore All</span>
          <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {restaurants.map((restaurant) => (
            <RestaurantCard key={restaurant._id} restaurant={restaurant} />
          ))}
        </div>
      )}
    </section>
  )
}

export default PopularRestaurants
