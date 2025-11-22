import React, { useState } from "react"
import { Search } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"

const HeroSection = () => {
  const [query, setQuery] = useState("")
  const navigate = useNavigate()

  const handleSearch = (e) => {
    if (e.key === "Enter" && query.trim()) {
      navigate(`/restaurants?search=${encodeURIComponent(query)}`)
    }
  }

  return (
    <section className="relative h-[500px] md:h-[600px] w-full mt-[50px] bg-[url('https://id-preview--1d994445-bbb8-44fe-8483-a8f6a5d80524.lovable.app/assets/hero-banner-B60K8GoV.jpg')] bg-cover bg-center overflow-hidden rounded-2xl">
      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b  from-black/80 via-black/40 to-black/10"></div>

      {/* Floating gradient orbs for subtle glow */}


      {/* Hero Content */}
      <div className="relative z-10 flex flex-col justify-center items-center text-center h-full px-4 sm:px-6 md:px-8">
        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight animate-fadeIn">
          Crave It. <span className="text-[#FC8019]">Click It.</span> <br />
          Eat It with <span className="text-[#E23744]">QuickBite!</span>
        </h1>

        {/* Subtext */}
        <p className="mt-4 text-gray-200 text-base sm:text-lg md:text-xl max-w-2xl animate-fadeInDelay">
          Discover top-rated restaurants, sizzling dishes, and lightning-fast delivery.
          <br /> Because hunger can’t wait.
        </p>

        {/* Search Bar */}
        <div className="relative max-w-md w-full mt-8 animate-fadeInDelay2">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleSearch}
            placeholder="Search for pizza, biryani, or desserts..."
            className="pl-12 pr-4 py-3 w-full rounded-xl bg-white/90 text-gray-800 border border-gray-200 focus:ring-2 focus:ring-[#FC8019] focus:border-[#FC8019] placeholder:text-gray-400"
          />
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-8 animate-fadeInDelay3">
          <Link
            to="/restaurants"
            className="px-6 py-3 rounded-xl text-white font-semibold text-sm sm:text-base shadow-lg hover:scale-[1.03] transition"
            style={{ background: "linear-gradient(90deg,#FC8019,#E23744)" }}
          >
            Explore Restaurants 🍽️
          </Link>
          <Link
            to="/login"
            className="px-6 py-3 rounded-xl border border-white/80 text-white/90 font-medium hover:bg-white/10 transition text-sm sm:text-base"
          >
            Sign In
          </Link>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
