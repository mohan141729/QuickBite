import React, { useEffect, useState } from "react"
import { Plus, Minus, Star, Activity } from "lucide-react"
import { useCart } from "../context/CartContext"
import ItemCustomizationModal from "./ItemCustomizationModal"
import NutritionInfoModal from "./NutritionInfoModal"
import FavoriteButton from "./FavoriteButton"

const MenuItemCard = ({ item, disabled }) => {
  const { cartItems, addToCart, updateCartItem, removeFromCart } = useCart()
  const [quantity, setQuantity] = useState(0)
  const [showCustomization, setShowCustomization] = useState(false)
  const [showNutrition, setShowNutrition] = useState(false)

  // Debug: Log nutrition info
  console.log('MenuItem:', item.name, 'Nutrition:', item.nutritionalInfo);

  // Check if item is available (default to true if not specified)
  const isAvailable = item.isAvailable !== false
  const hasCustomization = (item.variants && item.variants.length > 0) || (item.addOns && item.addOns.length > 0)

  // ✅ Sync quantity with cart context
  useEffect(() => {
    const totalQty = cartItems
      .filter(cartItem => cartItem.menuItemId === item._id)
      .reduce((sum, cartItem) => sum + cartItem.quantity, 0)

    setQuantity(totalQty)
  }, [cartItems, item._id])

  // ✅ Add first item
  const handleAdd = async () => {
    if (!isAvailable) return

    if (hasCustomization) {
      setShowCustomization(true)
    } else {
      await addToCart(item, 1)
    }
  }

  // ✅ Increase quantity
  const handleIncrease = async () => {
    if (!isAvailable) return

    if (hasCustomization) {
      setShowCustomization(true)
    } else {
      const newQty = quantity + 1
      setQuantity(newQty)
      await updateCartItem(item._id, newQty)
    }
  }

  // ✅ Decrease or remove
  const handleDecrease = async () => {
    if (!isAvailable) return

    if (hasCustomization) {
      alert("Please go to cart to modify customized items.")
    } else {
      if (quantity > 1) {
        const newQty = quantity - 1
        setQuantity(newQty)
        await updateCartItem(item._id, newQty)
      } else {
        await removeFromCart(item._id)
        setQuantity(0)
      }
    }
  }

  return (
    <>
      <div
        className={`group bg-white rounded-2xl p-4 border shadow-sm transition-all duration-300 flex justify-between gap-4 relative overflow-hidden ${!isAvailable
          ? 'border-gray-200 opacity-60 grayscale cursor-not-allowed'
          : 'border-gray-100 hover:shadow-lg'
          }`}
      >
        {/* Unavailable Overlay Badge */}
        {!isAvailable && (
          <div className="absolute top-3 right-3 z-10">
            <span className="bg-gray-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
              NOT AVAILABLE
            </span>
          </div>
        )}

        {/* Info Section */}
        <div className={`flex-1 flex flex-col justify-between ${!isAvailable ? 'pointer-events-none' : ''}`}>
          <div>
            <div className="flex items-start justify-between">
              {/* Veg/Non-Veg Indicator */}
              <div className={`w-4 h-4 border-2 flex items-center justify-center rounded-sm ${item.isVeg ? 'border-green-600' : 'border-red-600'
                } ${!isAvailable ? 'opacity-50' : ''}`}>
                <div className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`}></div>
              </div>
            </div>

            <h3 className={`font-bold text-lg mt-2 transition-colors ${!isAvailable
              ? 'text-gray-500'
              : 'text-gray-900 group-hover:text-[#FC8019]'
              }`}>
              {item.name}
            </h3>
            <p className={`font-semibold mt-1 ${!isAvailable ? 'text-gray-400' : 'text-gray-800'}`}>
              ₹{item.price}
            </p>
            <p className={`text-sm mt-2 line-clamp-2 leading-relaxed ${!isAvailable ? 'text-gray-400' : 'text-gray-500'
              }`}>
              {item.description}
            </p>
          </div>

          <div className="flex items-center gap-3 mt-3">
            <div className="flex items-center gap-1">
              <Star className={`w-3 h-3 fill-yellow-400 text-yellow-400 ${!isAvailable ? 'opacity-40' : ''}`} />
              <span className={`text-xs font-medium ml-1 ${!isAvailable ? 'text-gray-300' : 'text-gray-400'}`}>
                {item.rating > 0 ? `${item.rating.toFixed(1)} (${item.ratingCount} ratings)` : "New"}
              </span>
            </div>
            {item.nutritionalInfo?.calories && (
              <button
                onClick={() => setShowNutrition(true)}
                className="flex items-center gap-1 text-xs font-medium text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100 px-2 py-1 rounded-full transition"
              >
                <Activity className="w-3 h-3" />
                Nutrition
              </button>
            )}
          </div>
        </div>

        {/* Image & Action Section */}
        <div className="flex flex-col items-center gap-2 relative">
          <div className={`w-32 h-28 rounded-xl overflow-hidden relative ${!isAvailable ? 'opacity-50' : ''}`}>
            {item.image ? (
              <img
                src={item.image}
                alt={item.name}
                className={`w-full h-full object-cover transition-transform duration-500 ${!isAvailable ? '' : 'group-hover:scale-110'
                  }`}
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
                No Image
              </div>
            )}
            <div className={`absolute inset-0 transition-colors ${!isAvailable
              ? 'bg-black/30'
              : 'bg-black/5 group-hover:bg-transparent'
              }`} />

            {/* Favorite Button - Positioned on Image */}
            {isAvailable && (
              <div className="absolute top-2 right-2 z-20">
                <FavoriteButton
                  menuItemId={item._id}
                  restaurantId={item.restaurant?._id || item.restaurant}
                  type="menuItem"
                  className="bg-white/90 hover:bg-white shadow-sm w-8 h-8 flex items-center justify-center p-0"
                />
              </div>
            )}
          </div>

          {/* Add Button */}
          <div className="absolute -bottom-3 shadow-lg rounded-lg bg-white">
            {!isAvailable ? (
              <div className="px-6 py-2 text-sm font-bold text-gray-400 uppercase tracking-wide rounded-lg border border-gray-300 bg-gray-100 cursor-not-allowed">
                UNAVAILABLE
              </div>
            ) : disabled ? (
              <div className="px-6 py-2 text-sm font-bold text-gray-400 uppercase tracking-wide rounded-lg border border-gray-300 bg-gray-100 cursor-not-allowed">
                CLOSED
              </div>
            ) : quantity === 0 ? (
              <button
                onClick={handleAdd}
                className="px-6 py-2 text-sm font-bold text-green-600 uppercase tracking-wide hover:bg-green-50 rounded-lg transition border border-gray-200 relative"
              >
                ADD
                {hasCustomization && <span className="absolute top-0 right-0 text-[10px] bg-orange-100 text-orange-600 px-1 rounded-bl-lg">Customisable</span>}
              </button>
            ) : (
              <div className="flex items-center bg-white rounded-lg border border-gray-200 overflow-hidden">
                <button
                  onClick={handleDecrease}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition"
                >
                  <Minus size={14} strokeWidth={3} />
                </button>
                <span className="font-bold text-green-600 w-6 text-center text-sm">
                  {quantity}
                </span>
                <button
                  onClick={handleIncrease}
                  className="px-3 py-2 text-green-600 hover:bg-gray-100 transition"
                >
                  <Plus size={14} strokeWidth={3} />
                </button>
              </div>
            )}
          </div>
          {hasCustomization && quantity > 0 && (
            <div className="text-[10px] text-gray-500 mt-4">Customisable</div>
          )}
        </div>
      </div>

      {/* Customization Modal */}
      {showCustomization && (
        <ItemCustomizationModal
          item={item}
          onClose={() => setShowCustomization(false)}
        />
      )}

      {/* Nutrition Modal */}
      {showNutrition && (
        <NutritionInfoModal
          item={item}
          onClose={() => setShowNutrition(false)}
        />
      )}
    </>
  )
}

export default MenuItemCard
