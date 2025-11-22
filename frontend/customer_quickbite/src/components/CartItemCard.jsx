import React from "react"
import { Plus, Minus, Trash2 } from "lucide-react"
import { useCart } from "../context/CartContext"

const CartItemCard = ({ item }) => {
  const { updateCartItem, removeFromCart } = useCart()

  const increase = async () => await updateCartItem(item._id, item.quantity + 1)
  const decrease = async () =>
    item.quantity > 1
      ? await updateCartItem(item._id, item.quantity - 1)
      : await removeFromCart(item._id)

  return (
    <div className="flex justify-between items-center bg-white border border-gray-100 rounded-2xl p-3 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-center gap-3">
        <img
          src={item.image || "https://via.placeholder.com/60"}
          alt={item.name}
          className="w-14 h-14 object-cover rounded-lg"
        />
        <div>
          <h4 className="font-semibold text-gray-800 text-sm sm:text-base">
            {item.name}
          </h4>
          <p className="text-xs text-gray-500">₹{item.price}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={decrease}
          className="border border-gray-300 rounded-full w-7 h-7 flex items-center justify-center text-orange-600 hover:bg-orange-50 transition"
        >
          {item.quantity === 1 ? <Trash2 size={14} /> : <Minus size={14} />}
        </button>
        <span className="font-semibold text-gray-800 text-sm w-4 text-center">
          {item.quantity}
        </span>
        <button
          onClick={increase}
          className="border border-gray-300 rounded-full w-7 h-7 flex items-center justify-center text-orange-600 hover:bg-orange-50 transition"
        >
          <Plus size={14} />
        </button>
      </div>
    </div>
  )
}

export default CartItemCard
