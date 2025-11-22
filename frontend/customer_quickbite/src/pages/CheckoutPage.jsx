import React, { useState } from "react"
import Navbor from "../components/Navbor"
import { useCart } from "../context/CartContext"
import { useAuth } from "../context/AuthContext"
import { createOrder } from "../api/orders"
import { Loader2, CreditCard, MapPin } from "lucide-react"
import { useNavigate } from "react-router-dom"

const CheckoutPage = () => {
  const { cartItems, total, clearCart } = useCart()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("COD")
  const navigate = useNavigate()

  const handlePlaceOrder = async () => {
    if (!cartItems.length) return alert("Cart is empty.")

    const firstItem = cartItems[0]
    const restaurantId =
      firstItem?.restaurant?._id || firstItem?.restaurant || firstItem?.menuItem?.restaurant

    if (!restaurantId) {
      alert("Unable to identify restaurant. Please try again.")
      console.error("❌ Restaurant missing in first cart item:", firstItem)
      return
    }

    try {
      setLoading(true)

      const orderData = {
        restaurant: restaurantId,
        items: cartItems.map((item) => ({
          menuItem: item._id || item.menuItemId,
          quantity: item.quantity,
          price: item.price,
        })),
        totalAmount: total + 30,
        address: user?.address?.[0] || {
          line1: "N/A",
          city: "N/A",
          pincode: "000000",
        },
        paymentStatus: paymentMethod === "COD" ? "pending" : "paid",
      }

      console.log("Order payload:", orderData)

      const res = await createOrder(orderData)
      console.log("✅ Order created:", res)

      clearCart()
      navigate("/order-success")
    } catch (err) {
      console.error("Order failed:", err.response?.data || err.message)
      alert(err.response?.data?.message || "Failed to place order")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-quickbite-bg">
      <Navbor />
      <div className="max-w-5xl mx-auto px-4 pt-24 pb-10">
        <h1 className="text-2xl font-bold mb-8 text-gray-900">Checkout</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-sm border">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-orange-500" />
              Delivery Address
            </h2>
            <div className="border border-gray-200 rounded-lg p-4">
              <p className="font-medium text-gray-800">{user?.name}</p>
              <p className="text-gray-600 text-sm">
                {user?.address?.[0]?.line1}, {user?.address?.[0]?.city} -{" "}
                {user?.address?.[0]?.pincode}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Phone: {user?.phone || "Not available"}
              </p>
            </div>

            <div className="mt-8">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-orange-500" />
                Payment Method
              </h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 border border-gray-200 rounded-lg p-3 hover:border-orange-400 transition">
                  <input
                    type="radio"
                    name="payment"
                    value="COD"
                    checked={paymentMethod === "COD"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span className="text-gray-800 font-medium">
                    Cash on Delivery (COD)
                  </span>
                </label>
                <label className="flex items-center gap-3 border border-gray-200 rounded-lg p-3 hover:border-orange-400 transition">
                  <input
                    type="radio"
                    name="payment"
                    value="Online"
                    checked={paymentMethod === "Online"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span className="text-gray-800 font-medium">
                    Pay Online (Demo)
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            {cartItems.map((item) => (
              <div key={item._id} className="flex justify-between mb-2 text-sm">
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}

            <hr className="my-4" />
            <div className="flex justify-between text-sm mb-2">
              <span>Subtotal</span>
              <span>₹{total}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>Delivery Fee</span>
              <span>₹30</span>
            </div>
            <div className="flex justify-between text-lg font-semibold mt-2">
              <span>Total</span>
              <span>₹{total + 30}</span>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className="w-full mt-6 bg-gradient-to-r from-[#FC8019] to-[#E23744] text-white font-semibold py-3 rounded-lg hover:opacity-90 transition flex justify-center items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                "Place Order"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage
