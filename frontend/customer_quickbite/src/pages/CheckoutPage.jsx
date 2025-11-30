import React, { useState } from "react"
import Navbar from "../components/Navbar"
import { useCart } from "../context/CartContext"
import { useAuth } from "../context/AuthContext"
import { createOrder } from "../api/orders"
import { Loader2, CreditCard, MapPin, Tag, X, AlertCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { validateCoupon } from "../api/coupons"
import toast from "react-hot-toast"

const CheckoutPage = () => {
  const { cartItems, total, clearCart } = useCart()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("COD")
  const [couponCode, setCouponCode] = useState("")
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [couponLoading, setCouponLoading] = useState(false)
  const [couponError, setCouponError] = useState("")
  const navigate = useNavigate()

  const itemTotal = total
  const deliveryFee = 30
  const packagingFee = 10
  const platformFee = 5
  const taxes = Math.round(itemTotal * 0.05)
  const discount = appliedCoupon?.discount || 0
  const finalTotal = itemTotal + deliveryFee + packagingFee + platformFee + taxes - discount

  // 🧠 Helper to get restaurant ID from cart items
  const getRestaurantId = () => {
    if (!cartItems.length) return null
    const firstItem = cartItems[0]
    // CartContext normalizes this, but double check
    return firstItem.restaurant?._id || firstItem.restaurant
  }

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return

    setCouponLoading(true)
    setCouponError("")

    try {
      const restaurantId = getRestaurantId()
      if (!restaurantId) {
        setCouponError("Cannot apply coupon: Restaurant not found")
        return
      }

      const result = await validateCoupon({
        code: couponCode,
        subtotal: itemTotal, // Validate against item total only (coupons don't apply to delivery fees/taxes)
        restaurantId,
        userId: user?._id,
      })

      setAppliedCoupon({ code: couponCode, discount: result.discount })
      setCouponError("")
      toast.success("Coupon applied successfully!")
    } catch (err) {
      setCouponError(err.response?.data?.message || "Invalid coupon code")
      setAppliedCoupon(null)
    } finally {
      setCouponLoading(false)
    }
  }

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null)
    setCouponCode("")
    setCouponError("")
    toast.success("Coupon removed")
  }

  const handlePlaceOrder = async () => {
    if (!cartItems.length) {
      toast.error("Your cart is empty")
      return
    }

    const restaurantId = getRestaurantId()
    if (!restaurantId) {
      toast.error("Unable to identify restaurant. Please try clearing cart.")
      console.error("❌ Restaurant missing in cart items:", cartItems)
      return
    }

    // Validate Address
    if (!user?.address?.length) {
      toast.error("Please add a delivery address in your profile first.")
      return
    }

    try {
      setLoading(true)

      const orderData = {
        restaurant: restaurantId,
        items: cartItems.map((item) => ({
          menuItem: item._id, // CartContext ensures _id is the menuItem ID
          quantity: item.quantity,
          price: item.price,
          selectedVariant: item.selectedVariant, // Pass variant info
          selectedAddOns: item.selectedAddOns,   // Pass add-ons info
        })),
        totalAmount: finalTotal,
        address: user.address[0], // Use the first address for now
        paymentStatus: paymentMethod === "COD" ? "pending" : "paid",
        couponCode: appliedCoupon?.code || null,
      }

      await createOrder(orderData)

      clearCart()
      toast.success("Order placed successfully! 🎉")
      navigate("/order-success")
    } catch (err) {
      console.error("Order failed:", err.response?.data || err.message)
      toast.error(err.response?.data?.message || "Failed to place order")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-quickbite-bg">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 pt-24 pb-10">
        <h1 className="text-2xl font-bold mb-8 text-gray-900">Checkout</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            {/* Address Section */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-orange-500" />
                Delivery Address
              </h2>
              {user?.address?.length > 0 ? (
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <p className="font-medium text-gray-800">{user?.name}</p>
                  <p className="text-gray-600 text-sm mt-1">
                    {user.address[0].line1}, {user.address[0].city} -{" "}
                    {user.address[0].pincode}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Phone: {user?.phone || "Not available"}
                  </p>
                </div>
              ) : (
                <div className="flex items-center gap-3 p-4 bg-red-50 text-red-700 rounded-lg border border-red-100">
                  <AlertCircle className="w-5 h-5" />
                  <div>
                    <p className="font-medium">No address found</p>
                    <p className="text-sm">Please add an address in your profile to proceed.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Payment Section */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-orange-500" />
                Payment Method
              </h2>
              <div className="space-y-3">
                <label className={`flex items-center gap-3 border rounded-lg p-4 cursor-pointer transition-all ${paymentMethod === "COD" ? "border-orange-500 bg-orange-50 ring-1 ring-orange-500" : "border-gray-200 hover:border-orange-300"}`}>
                  <input
                    type="radio"
                    name="payment"
                    value="COD"
                    checked={paymentMethod === "COD"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-orange-500 focus:ring-orange-500"
                  />
                  <span className="text-gray-800 font-medium">
                    Cash on Delivery (COD)
                  </span>
                </label>
                <label className={`flex items-center gap-3 border rounded-lg p-4 cursor-pointer transition-all ${paymentMethod === "Online" ? "border-orange-500 bg-orange-50 ring-1 ring-orange-500" : "border-gray-200 hover:border-orange-300"}`}>
                  <input
                    type="radio"
                    name="payment"
                    value="Online"
                    checked={paymentMethod === "Online"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-orange-500 focus:ring-orange-500"
                  />
                  <span className="text-gray-800 font-medium">
                    Pay Online (Demo)
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Summary Section */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit sticky top-24">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

            {/* Cart Items */}
            <div className="max-h-60 overflow-y-auto scrollbar-hide mb-4">
              {cartItems.map((item) => (
                <div key={item._id} className="flex justify-between mb-3 text-sm">
                  <div className="flex gap-2">
                    <span className="font-medium text-gray-700">{item.quantity}x</span>
                    <div className="flex flex-col">
                      <span className="text-gray-600 truncate max-w-[150px]">{item.name}</span>
                      {item.selectedVariant && (
                        <span className="text-xs text-gray-400">Var: {item.selectedVariant.name}</span>
                      )}
                      {item.selectedAddOns && item.selectedAddOns.length > 0 && (
                        <span className="text-xs text-gray-400">
                          Add: {item.selectedAddOns.map(a => a.name).join(", ")}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="font-medium text-gray-900">
                    ₹{((item.selectedVariant?.price || item.price) + (item.selectedAddOns?.reduce((s, a) => s + a.price, 0) || 0)) * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            <hr className="my-4 border-gray-100" />

            {/* Coupon Section */}
            <div className="mb-4">
              <h3 className="text-sm font-semibold mb-2 flex items-center gap-2 text-gray-700">
                <Tag className="w-4 h-4 text-orange-500" />
                Apply Coupon
              </h3>
              {!appliedCoupon ? (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-100 focus:border-orange-400 outline-none uppercase"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      disabled={couponLoading || !couponCode.trim()}
                      className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      {couponLoading ? "..." : "Apply"}
                    </button>
                  </div>
                  {couponError && (
                    <p className="text-xs text-red-500 animate-fade-in">{couponError}</p>
                  )}
                </div>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center justify-between animate-fade-in">
                  <div>
                    <p className="text-sm font-bold text-green-700">
                      {appliedCoupon.code}
                    </p>
                    <p className="text-xs text-green-600">
                      You saved ₹{appliedCoupon.discount}
                    </p>
                  </div>
                  <button
                    onClick={handleRemoveCoupon}
                    className="text-gray-400 hover:text-red-500 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <hr className="my-4 border-gray-100" />

            {/* Price Breakdown */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Item Total</span>
                <span>₹{itemTotal}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Delivery Fee</span>
                <span>₹{deliveryFee}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Packaging Fee</span>
                <span>₹{packagingFee}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Platform Fee</span>
                <span>₹{platformFee}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Taxes (5%)</span>
                <span>₹{taxes}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-sm text-green-600 font-medium">
                  <span>Discount</span>
                  <span>-₹{discount}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-100 mt-2">
                <span>Total</span>
                <span>₹{finalTotal}</span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={loading || !user?.address?.length}
              className="w-full mt-6 bg-gradient-to-r from-[#FC8019] to-[#E23744] text-white font-bold py-3.5 rounded-xl hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex justify-center items-center gap-2"
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
