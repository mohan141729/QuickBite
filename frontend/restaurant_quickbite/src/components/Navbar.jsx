import React, { useState, useRef, useEffect } from "react"
import { Link } from "react-router-dom"
import { MapPin, Search, ShoppingCart, User } from "lucide-react"
import { useAuth } from "../context/AuthContext"
import ProfileCard from "./ProfileCard"

const Navbor = () => {
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const menuRef = useRef(null)

  // ✅ Logout handler
  const handleLogout = async () => {
    try {
      await logout()
      window.location.href = "/login"
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
                  QuickBite Partner
                </h1>
              </div>
            </Link>


            {/* Right Section */}
            <div className="flex items-center gap-3">
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className="px-4 py-2 text-gray-700 font-semibold border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                  >
                    Dashboard
                  </Link>


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

export default Navbor
