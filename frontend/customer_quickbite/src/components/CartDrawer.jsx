import React, { useState } from "react"
import { ShoppingCart, X } from "lucide-react"
import { useCart } from "../context/CartContext"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
import CartItemCard from "./CartItemCard"

const CartDrawer = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { cartItems, total, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleCheckout = () => {
    setIsOpen(false)
    if (user) navigate("/checkout")
    else navigate("/login")
  }

  return (
    <>
      {/* Floating Cart Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="relative flex items-center justify-center p-2 rounded-lg hover:bg-orange-50 transition"
      >
        <ShoppingCart className="w-5 h-5 text-gray-800" />
        {cartItems?.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-semibold rounded-full w-4 h-4 flex items-center justify-center">
            {cartItems.length}
          </span>
        )}
      </button>

      {/* Drawer Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[2000] bg-black/50 backdrop-blur-sm flex justify-center sm:justify-end"
          onClick={(e) => e.target === e.currentTarget && setIsOpen(false)}
        >
          {/* Drawer Panel */}
          <div
            className="relative bg-white w-full sm:w-[420px] h-[100vh] sm:h-screen shadow-2xl rounded-t-2xl sm:rounded-none flex flex-col animate-slide-in-up sm:animate-slide-in-right"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-gradient-to-r from-[#FC8019]/10 to-[#E23744]/10 sticky top-0">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-orange-500" />
                Your Cart
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 transition"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3 scrollbar-hide">
              {cartItems && cartItems.length > 0 ? (
                cartItems.map((item) => (
                  <CartItemCard key={item._id} item={item} />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <img
                    src="https://res.cloudinary.com/ds6o1cohi/image/upload/v1720589941/empty-cart.svg"
                    alt="Empty Cart"
                    className="w-40 mb-4"
                  />
                  <p className="text-sm font-medium">Your cart is empty</p>
                </div>
              )}
            </div>

            {/* Footer */}
            {cartItems?.length > 0 && (
              <div className="p-5 border-t border-gray-200 bg-white sticky bottom-0 shadow-[0_-4px_8px_rgba(0,0,0,0.05)]">
                <div className="flex justify-between text-sm mb-2">
                  <span>Subtotal</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500 mb-2">
                  <span>Delivery Fee</span>
                  <span>₹30</span>
                </div>
                <div className="flex justify-between text-lg font-semibold mb-4">
                  <span>Total</span>
                  <span className="text-orange-600">
                    ₹{(total + 30).toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full py-3 rounded-lg bg-gradient-to-r from-[#FC8019] to-[#E23744] text-white font-semibold hover:opacity-90 transition flex items-center justify-center"
                >
                  Proceed to Checkout →
                </button>

                <button
                  onClick={async () => await clearCart()}
                  className="w-full text-center mt-3 text-gray-500 text-sm hover:text-red-500 transition"
                >
                  Clear Cart
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default CartDrawer
