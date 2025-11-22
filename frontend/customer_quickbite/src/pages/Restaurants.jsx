import React, { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { getRestaurants } from "../api/restaurant"
import api from "../api/api"
import RestaurantCard from "../components/RestaurantCard"
import MenuItemCard from "../components/MenuItemCard"
import { Loader2, Utensils, Store } from "lucide-react"
import Navbor from "../components/Navbor"

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([])
  const [menuItems, setMenuItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get("search") || ""

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // Fetch Restaurants
        const restaurantData = await getRestaurants(searchQuery)
        setRestaurants(restaurantData)

        // Fetch Menu Items if searching
        if (searchQuery) {
          const { data } = await api.get(`/api/menu?search=${encodeURIComponent(searchQuery)}`)
          setMenuItems(data)
        } else {
          setMenuItems([])
        }
      } catch (err) {
        console.error("Failed to fetch data:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [searchQuery])

  return (
    <div className="min-h-screen bg-quickbite-bg">
      <Navbor />

      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {searchQuery ? `Search Results for "${searchQuery}"` : "Popular Restaurants"}
        </h1>
        <p className="text-gray-600 text-sm">
          {searchQuery
            ? `Found ${restaurants.length} restaurants and ${menuItems.length} dishes`
            : "Discover the best food & drinks in your city"}
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 space-y-12">
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
          </div>
        ) : (
          <>
            {/* Restaurants Section */}
            {(restaurants.length > 0 || !searchQuery) && (
              <section>
                {searchQuery && (
                  <div className="flex items-center gap-2 mb-6">
                    <Store className="w-5 h-5 text-[#FC8019]" />
                    <h2 className="text-xl font-bold text-gray-800">Matching Restaurants</h2>
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {restaurants.map((r) => (
                    <RestaurantCard key={r._id} restaurant={r} />
                  ))}
                </div>
              </section>
            )}

            {/* Menu Items Section */}
            {menuItems.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-6">
                  <Utensils className="w-5 h-5 text-[#FC8019]" />
                  <h2 className="text-xl font-bold text-gray-800">Matching Dishes</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {menuItems.map((item) => (
                    <MenuItemCard key={item._id} item={item} />
                  ))}
                </div>
              </section>
            )}

            {/* No Results */}
            {searchQuery && restaurants.length === 0 && menuItems.length === 0 && (
              <div className="text-center text-gray-500 py-20 bg-white rounded-3xl border border-gray-100">
                <p className="text-lg">No matches found for "{searchQuery}"</p>
                <p className="text-sm mt-2">Try searching for something else like "Pizza" or "Burger"</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Restaurants
