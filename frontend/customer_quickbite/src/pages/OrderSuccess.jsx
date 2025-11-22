import React, { useEffect } from "react"
import { CheckCircle2, Timer } from "lucide-react"
import { useNavigate } from "react-router-dom"

const OrderSuccess = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => navigate("/orders"), 4000)
    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center">
      <div className="text-center animate-fade-in">
        <CheckCircle2 className="w-24 h-24 text-green-500 mx-auto mb-6 animate-bounce" />
        <h1 className="text-3xl font-bold text-gray-800">Order Placed!</h1>
        <p className="text-gray-600 mt-2">
          Your delicious meal is being prepared 🍲
        </p>

        <div className="flex justify-center items-center mt-6 text-gray-700">
          <Timer className="w-5 h-5 mr-2 text-orange-500" />
          Estimated Delivery: <strong className="ml-1">30-40 mins</strong>
        </div>

        <button
          onClick={() => navigate("/orders")}
          className="mt-8 bg-gradient-to-r from-[#FC8019] to-[#E23744] text-white font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition"
        >
          Track Order →
        </button>
      </div>
    </div>
  )
}

export default OrderSuccess
