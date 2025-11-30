import React, { useRef, useEffect, useState } from "react"
import { ChevronLeft, ChevronRight, UtensilsCrossed, X } from "lucide-react"
import api from "../api/api"
import MenuItemCard from "./MenuItemCard"

// ✅ Default icons for common categories
const categoryIcons = {
  Biryani: "https://cdn-icons-png.flaticon.com/512/3075/3075977.png",
  Pizza: "https://cdn-icons-png.flaticon.com/512/3595/3595455.png",
  Shawarma: "https://cdn-icons-png.flaticon.com/512/995/995032.png",
  Chinese: "https://cdn-icons-png.flaticon.com/512/184/184514.png",
  "South Indian": "https://cdn-icons-png.flaticon.com/512/3664/3664028.png",
  Dosa: "https://cdn-icons-png.flaticon.com/512/3664/3664029.png",
  Burger: "https://cdn-icons-png.flaticon.com/512/1046/1046784.png",
  Shake: "https://cdn-icons-png.flaticon.com/512/706/706164.png",
  Rolls: "https://cdn-icons-png.flaticon.com/512/3082/3082031.png",
  Poori: "https://cdn-icons-png.flaticon.com/512/3664/3664058.png",
  Noodles: "https://cdn-icons-png.flaticon.com/512/2821/2821637.png",
  Kebab: "https://cdn-icons-png.flaticon.com/512/3075/3075943.png",
  "Pure Veg": "https://cdn-icons-png.flaticon.com/512/2545/2545585.png",
  Salad: "https://cdn-icons-png.flaticon.com/512/3075/3075941.png",
}

const FoodCategories = () => {
  const scrollRef = useRef(null)
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [filteredItems, setFilteredItems] = useState([])
  const [itemsLoading, setItemsLoading] = useState(false)

  // 🧠 Fetch categories dynamically
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get("/api/categories")
        // Map categories to ensure they have an image
        const formatted = data.map((cat) => ({
          name: cat.name,
          img: cat.image || categoryIcons[cat.name] || "https://cdn-icons-png.flaticon.com/512/3649/3649829.png",
        }))
        setCategories(formatted)
      } catch (err) {
        console.error("Failed to fetch categories:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  // 🧠 Handle Category Click
  const handleCategoryClick = async (categoryName) => {
    if (selectedCategory === categoryName) {
      setSelectedCategory(null)
      setFilteredItems([])
      return
    }

    setSelectedCategory(categoryName)
    setItemsLoading(true)
    try {
      const { data } = await api.get(`/api/menu?category=${encodeURIComponent(categoryName)}`)
      setFilteredItems(data)
    } catch (error) {
      console.error("Failed to fetch filtered items:", error)
    } finally {
      setItemsLoading(false)
    }
  }

  const scrollLeft = () => scrollRef.current.scrollBy({ left: -300, behavior: "smooth" })
  const scrollRight = () => scrollRef.current.scrollBy({ left: 300, behavior: "smooth" })

  return (
    <section className="relative max-w-7xl mx-auto px-4 py-16">
      {/* Header */}
      <div className="flex items-end justify-between mb-10">
        <div>
          <div className="flex items-center gap-2 text-[#FC8019] font-semibold mb-2">
            <UtensilsCrossed className="w-5 h-5" />
            <span className="uppercase tracking-wider text-sm">What's on your mind?</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
            Browse by Category
          </h2>
        </div>

        <div className="flex gap-3">
          <button
            onClick={scrollLeft}
            className="p-3 rounded-full bg-white border border-gray-200 shadow-sm hover:shadow-md hover:bg-gray-50 transition text-gray-700"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={scrollRight}
            className="p-3 rounded-full bg-white border border-gray-200 shadow-sm hover:shadow-md hover:bg-gray-50 transition text-gray-700"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Loader */}
      {loading ? (
        <div className="flex justify-center items-center py-16 text-gray-500">
          <span className="animate-pulse text-sm">Loading categories...</span>
        </div>
      ) : categories.length > 0 ? (
        <>
          {/* Scrollable row */}
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-8 px-2"
          >
            {categories.map((food) => (
              <div
                key={food.name}
                onClick={() => handleCategoryClick(food.name)}
                className={`flex flex-col items-center flex-shrink-0 cursor-pointer group min-w-[100px] transition-all duration-300 ${selectedCategory === food.name ? 'opacity-100 scale-105' : 'opacity-70 hover:opacity-100'}`}
              >
                <div className={`w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-white shadow-md border flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-2 relative ${selectedCategory === food.name ? 'border-[#FC8019] ring-2 ring-orange-100' : 'border-gray-100 group-hover:border-orange-200'}`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <img
                    src={food.img}
                    alt={food.name}
                    className="w-16 h-16 md:w-20 md:h-20 object-contain z-10 group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <p className={`mt-3 text-sm md:text-base font-bold transition-colors ${selectedCategory === food.name ? 'text-[#FC8019]' : 'text-gray-700 group-hover:text-[#FC8019]'}`}>
                  {food.name}
                </p>
              </div>
            ))}
          </div>

          {/* Filtered Items Section */}
          {selectedCategory && (
            <div className="mt-12 animate-fade-in bg-gray-50 rounded-3xl p-8 border border-gray-100 relative">
              <button
                onClick={() => {
                  setSelectedCategory(null)
                  setFilteredItems([])
                }}
                className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-sm hover:bg-gray-100 transition text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900">
                  Best <span className="text-[#FC8019]">{selectedCategory}</span> near you
                </h3>
                <p className="text-gray-500 mt-1">Found {filteredItems.length} items</p>
              </div>

              {itemsLoading ? (
                <div className="flex justify-center py-12">
                  <span className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full"></span>
                </div>
              ) : filteredItems.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredItems.map(item => (
                    <MenuItemCard key={item._id} item={item} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  No items found for this category.
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        <p className="text-center text-gray-500 py-10">No categories found</p>
      )}
    </section>
  )
}

export default FoodCategories
