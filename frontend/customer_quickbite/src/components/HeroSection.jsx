import React, { useState } from "react"
import { Search } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const HeroSection = () => {
  const [query, setQuery] = useState("")
  const navigate = useNavigate()
  const { user } = useAuth()

  const handleSearch = (e) => {
    if (e.key === "Enter" && query.trim()) {
      navigate(`/restaurants?q=${encodeURIComponent(query)}`)
    }
  }

  // Get greeting based on time of day
  // Get greeting based on time of day
  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour >= 5 && hour < 12) return "Rise & Shine ☀️"
    if (hour >= 12 && hour < 17) return "Good Afternoon 🌞"
    if (hour >= 17 && hour < 21) return "Good Evening 🌆"
    return "Late Night Cravings? 🌙"
  }

  return (
    <section className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8 w-full">
      <div className="relative h-[500px] md:h-[600px] w-full overflow-hidden rounded-2xl">
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="https://res.cloudinary.com/dovmtmu7y/video/upload/v1764232387/Fast_Food_Showcase_Video_Generation_ipf3mc.mp4" type="video/mp4" />
          {/* Fallback image if video doesn't load */}
          <img
            src="https://id-preview--1d994445-bbb8-44fe-8483-a8f6a5d80524.lovable.app/assets/hero-banner-B60K8GoV.jpg"
            alt="Food background"
            className="w-full h-full object-cover"
          />
        </video>

        {/* Dark gradient overlay */}
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/50 to-transparent"></div>

        {/* Floating gradient orbs for subtle glow */}


        {/* Hero Content */}
        <div className="relative z-10 flex flex-col justify-center items-center text-center h-full px-4 sm:px-6 md:px-8">
          {/* Headline - Dynamic based on login status */}
          {user ? (
            <>
              <p className="text-lg sm:text-xl text-gray-300 mb-2 animate-fadeIn">
                {getGreeting()}, {user.name?.split(' ')[0] || 'Friend'}! 👋
              </p>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight animate-fadeIn">
                What are you <span className="text-[#FC8019]">craving</span> <br />
                <span className="text-[#E23744]">today?</span>
              </h1>
            </>
          ) : (
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight animate-fadeIn">
              Crave It. <span className="text-[#FC8019]">Click It.</span> <br />
              Eat It with <span className="text-[#E23744]">QuickBite!</span>
            </h1>
          )}

          {/* Subtext - Dynamic based on login status */}
          <p className="mt-4 text-gray-200 text-base sm:text-lg md:text-xl max-w-2xl animate-fadeInDelay">
            {user ? (
              <>
                Your favorite restaurants are just a tap away.
                <br /> Fresh meals, delivered fast! 🚀
              </>
            ) : (
              <>
                Discover top-rated restaurants, sizzling dishes, and lightning-fast delivery.
                <br /> Because hunger can't wait.
              </>
            )}
          </p>

          {/* Search Bar */}
          <div className="relative max-w-md w-full mt-8 animate-fadeInDelay2">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleSearch}
              placeholder={user ? "Search for your favorite food..." : "Search for pizza, biryani, or desserts..."}
              className="pl-12 pr-4 py-3 w-full rounded-xl bg-white/90 text-gray-800 border border-gray-200 focus:ring-2 focus:ring-[#FC8019] focus:border-[#FC8019] placeholder:text-gray-400"
            />
          </div>

          {/* CTA Buttons - Dynamic based on login status */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-8 animate-fadeInDelay3">
            <Link
              to="/restaurants"
              className="px-6 py-3 rounded-xl text-white font-semibold text-sm sm:text-base shadow-lg hover:scale-[1.03] transition"
              style={{ background: "linear-gradient(90deg,#FC8019,#E23744)" }}
            >
              {user ? "Browse Restaurants 🍽️" : "Explore Restaurants 🍽️"}
            </Link>
            {!user && (
              <Link
                to="/login"
                className="px-6 py-3 rounded-xl border border-white/80 text-white/90 font-medium hover:bg-white/10 transition text-sm sm:text-base"
              >
                Sign In
              </Link>
            )}
            {user && (
              <Link
                to="/orders"
                className="px-6 py-3 rounded-xl border border-white/80 text-white/90 font-medium hover:bg-white/10 transition text-sm sm:text-base"
              >
                My Orders 📦
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
