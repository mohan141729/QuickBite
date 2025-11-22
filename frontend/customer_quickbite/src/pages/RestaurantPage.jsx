import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { getRestaurantById } from "../api/restaurant"
import { getMenuItemsByRestaurant } from "../api/menu"
import MenuItemCard from "../components/MenuItemCard"
import ReviewSection from "../components/ReviewSection"
import { Star, MapPin, Clock, Search, Filter } from "lucide-react"
import Navbor from "../components/Navbor"

const RestaurantPage = () => {
    const { id } = useParams()
    const [restaurant, setRestaurant] = useState(null)
    const [menuItems, setMenuItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [activeCategory, setActiveCategory] = useState("Recommended")

    useEffect(() => {
        const fetchData = async () => {
            try {
                const restaurantData = await getRestaurantById(id)
                setRestaurant(restaurantData)
                const menuData = await getMenuItemsByRestaurant(id)
                setMenuItems(menuData)
            } catch (error) {
                console.error("Failed to fetch data:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [id])

    if (loading) return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div></div>
    if (!restaurant) return <div className="text-center mt-20">Restaurant not found</div>

    // Group items by category
    const groupedMenu = menuItems.reduce((acc, item) => {
        const category = item.category || "Others"
        if (!acc[category]) acc[category] = []
        acc[category].push(item)
        return acc
    }, {})

    const categories = ["Recommended", ...Object.keys(groupedMenu).filter(c => c !== "Recommended")]

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <Navbor />

            {/* Hero Section - Full Width */}
            <div className="relative w-full h-[350px] md:h-[400px]">
                <img
                    src={restaurant.image || "https://images.unsplash.com/photo-1600891964599-f61ba0e24092"}
                    alt={restaurant.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 md:pb-12">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="text-white space-y-2">
                            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{restaurant.name}</h1>
                            <p className="text-gray-300 text-lg">
                                {restaurant.cuisine.join(", ")}
                            </p>

                            <div className="flex flex-wrap items-center gap-4 md:gap-6 mt-4 text-sm md:text-base">
                                <div className="flex items-center gap-1.5 bg-green-600 px-2 py-1 rounded-lg font-bold text-white">
                                    <Star className="w-4 h-4 fill-white" />
                                    <span>{restaurant.rating?.toFixed(1) || "New"}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-gray-200">
                                    <MapPin className="w-4 h-4" />
                                    <span>{restaurant.location?.city || "Nearby"}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-gray-200">
                                    <Clock className="w-4 h-4" />
                                    <span>30-40 mins</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 text-white min-w-[200px]">
                            <p className="text-xs text-gray-300 uppercase font-semibold tracking-wider mb-1">Offers</p>
                            <div className="flex items-center gap-2 font-bold text-lg text-[#FC8019]">
                                <span>🎉 50% OFF</span>
                            </div>
                            <p className="text-xs text-gray-300 mt-1">Use code: WELCOME50</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Menu Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Sidebar / Filters (Desktop) */}
                    <div className="hidden lg:block w-64 flex-shrink-0">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sticky top-24">
                            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <Filter className="w-4 h-4" /> Categories
                            </h3>
                            <div className="space-y-1">
                                {categories.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setActiveCategory(cat)}
                                        className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition ${activeCategory === cat
                                            ? "bg-orange-50 text-[#FC8019]"
                                            : "text-gray-600 hover:bg-gray-50"
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Mobile Category Scroll */}
                        <div className="lg:hidden overflow-x-auto pb-4 scrollbar-hide flex gap-3 mb-4">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium border transition ${activeCategory === cat
                                        ? "bg-[#FC8019] text-white border-[#FC8019]"
                                        : "bg-white text-gray-700 border-gray-200"
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        {/* Search within Menu */}
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex items-center gap-3">
                            <Search className="w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search in menu..."
                                className="flex-1 outline-none text-gray-700 placeholder:text-gray-400"
                            />
                        </div>

                        {/* Menu Items */}
                        <div className="space-y-10">
                            {Object.entries(groupedMenu).map(([category, items]) => {
                                if (activeCategory !== "Recommended" && activeCategory !== category) return null;
                                return (
                                    <div key={category} className="scroll-mt-28">
                                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                            {category}
                                            <span className="w-full h-px bg-gray-200 ml-4"></span>
                                        </h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {items.map(item => (
                                                <MenuItemCard key={item._id} item={item} />
                                            ))}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        {/* Reviews Section */}
                        <ReviewSection restaurantId={id} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RestaurantPage
