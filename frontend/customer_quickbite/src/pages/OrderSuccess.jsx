import React, { useEffect } from "react"
import { CheckCircle2, Timer, ArrowRight, Home } from "lucide-react"
import { useNavigate } from "react-router-dom"
import confetti from "canvas-confetti"

const OrderSuccess = () => {
  const navigate = useNavigate()

  useEffect(() => {
    // 🎉 Trigger confetti on mount
    const duration = 3 * 1000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    const randomInRange = (min, max) => Math.random() * (max - min) + min

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      })
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      })
    }, 250)

    // Auto-redirect backup (optional, maybe annoying if user wants to read)
    // const timer = setTimeout(() => navigate("/orders"), 5000)
    // return () => clearTimeout(timer)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center p-4">
      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl text-center max-w-md w-full border border-orange-100 animate-scale-in relative overflow-hidden">
        {/* Decorative background circle */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-green-100 rounded-full blur-2xl opacity-50"></div>

        <div className="relative">
          <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-6 drop-shadow-sm animate-bounce" />
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            Order Placed!
          </h1>
          <p className="text-gray-600 text-lg">
            Your delicious meal is being prepared 🍲
          </p>
        </div>

        <div className="mt-8 bg-orange-50 rounded-xl p-4 border border-orange-100">
          <div className="flex justify-center items-center text-gray-800 font-medium">
            <Timer className="w-5 h-5 mr-2 text-orange-500" />
            Estimated Delivery
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-1">30-40 mins</p>
        </div>

        <div className="mt-8 space-y-3">
          <button
            onClick={() => navigate("/orders")}
            className="w-full bg-gradient-to-r from-[#FC8019] to-[#E23744] text-white font-bold py-3.5 rounded-xl hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            Track Order <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={() => navigate("/")}
            className="w-full bg-white text-gray-600 font-semibold py-3.5 rounded-xl border border-gray-200 hover:bg-gray-50 hover:text-gray-900 transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" /> Back to Home
          </button>
        </div>
      </div>
    </div>
  )
}

export default OrderSuccess
