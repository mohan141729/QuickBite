import React, { useState, useRef, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { MapPin, Search, User } from "lucide-react"
import { useAuth } from "../context/AuthContext"
import ProfileCard from "./ProfileCard"
import DeliveryLocationCard from "./DeliveryLocationCard"
import CartDrawer from "./CartDrawer"

const Navbar = () => {
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [showDeliveryCard, setShowDeliveryCard] = useState(false)
  const [query, setQuery] = useState("")
  const menuRef = useRef(null)
  const navigate = useNavigate()

  const handleSearch = (e) => {
    if (e.key === "Enter" && query.trim()) {
      navigate(`/restaurants?search=${encodeURIComponent(query)}`)
    }
  }

  // ✅ Logout handler
  const handleLogout = async () => {
    try {
      await logout()
      navigate("/")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  // ✅ Close profile dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <>
      {/* ---------- Navbar ---------- */}
      <nav className="fixed top-0 left-0 right-0 z-[500] bg-white/90 backdrop-blur border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2 group cursor-pointer"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-[#FC8019] to-[#E23744] rounded-xl flex items-center justify-center">
                <span className="text-white font-extrabold text-xl tracking-tight">
                  QB
                </span>
              </div>
              <div className="hidden sm:block leading-tight">
                <h1 className="font-bold text-lg text-gray-900 group-hover:text-[#E23744] transition">
                  QuickBite
                </h1>
                <p className="text-xs text-gray-500 -mt-1">
                  Fast. Fresh. Delivered.
                </p>
              </div>
            </Link>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-4 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleSearch}
                placeholder="Search for restaurants, cuisines, or dishes..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#FC8019] focus:border-transparent"
              />
            </div>

            {/* Right Side Group */}
            <div className="flex items-center gap-4">
              {/* Delivery Location */}
              {user && (
                <div className="relative hidden lg:block">
                  <button
                    onClick={() => setShowDeliveryCard(!showDeliveryCard)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
                  >
                    <MapPin className="w-4 h-4 text-[#FC8019]" />
                    <div className="text-left leading-tight">
                      <h1 className="font-medium text-sm text-gray-800">
                        Deliver to
                      </h1>
                      <p className="text-xs text-gray-500 font-normal truncate w-24">
                        {user?.address?.[0]?.city || "Select location"}
                      </p>
                    </div>
                  </button>

                  {showDeliveryCard && (
                    <div className="absolute top-full right-0 mt-2 z-[200] animate-slide-down">
                      <DeliveryLocationCard
                        onClose={() => setShowDeliveryCard(false)}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* User Menu */}
              {user ? (
                <>
                  {/* Orders */}
                  <Link
                    to="/orders"
                    className="hidden sm:block text-gray-800 font-medium px-3 py-2 rounded-lg hover:bg-gray-100 transition"
                  >
                    My Orders
                  </Link>

                  {/* Cart */}
                  <CartDrawer />

                  {/* Profile Dropdown */}
                  <div className="relative" ref={menuRef}>
                    <button
                      onClick={() => setMenuOpen((prev) => !prev)}
                      className="flex items-center gap-2 border border-[#FC8019] text-[#FC8019] font-medium px-3 py-2 rounded-lg hover:bg-[#FC8019] hover:text-white transition"
                    >
                      <User className="w-4 h-4" />
                      <span className="hidden sm:block">
                        {user?.name?.split(" ")[0] || "Profile"}
                      </span>
                    </button>

                    {menuOpen && (
                      <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-100 rounded-lg shadow-lg animate-fade-in">
                        <button
                          onClick={() => {
                            setShowProfile(true)
                            setMenuOpen(false)
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          View Profile
                        </button>
                        <Link
                          to="/favorites"
                          onClick={() => setMenuOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          My Favorites
                        </Link>
                        <Link
                          to="/orders"
                          onClick={() => setMenuOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          My Orders
                        </Link>
                        <Link
                          to="/help"
                          onClick={() => setMenuOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Help & Support
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <CartDrawer />
                  <Link
                    to="/login"
                    className="flex items-center gap-2 text-[#FC8019] border border-[#FC8019] font-medium px-3 py-2 rounded-lg hover:bg-[#FC8019] hover:text-white transition"
                  >
                    <User className="w-4 h-4" />
                    <span className="hidden sm:block">Sign In</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Slide-in Profile Card */}
      {showProfile && <ProfileCard onClose={() => setShowProfile(false)} />}
    </>
  )
}

export default Navbar
