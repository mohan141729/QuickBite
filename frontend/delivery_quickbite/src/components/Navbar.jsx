import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { User, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import ProfileCard from "./ProfileCard";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const menuRef = useRef(null);
  const location = useLocation();

  const navigate = useNavigate(); // Ensure useNavigate is imported from react-router-dom

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <img src="/logo.png" alt="QuickBite" className="w-10 h-10 object-contain" />
              <div className="hidden sm:block">
                <h1 className="font-bold text-xl text-gray-900 tracking-tight group-hover:text-orange-600 transition-colors">
                  QuickBite <span className="text-gray-400 font-medium text-sm ml-1">Partner</span>
                </h1>
              </div>
            </Link>

            {/* Right Section */}
            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <div className="hidden md:flex items-center gap-2 mr-4">
                    <Link
                      to="/dashboard"
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${location.pathname === "/dashboard"
                        ? "bg-orange-50 text-orange-600"
                        : "text-gray-600 hover:text-orange-600 hover:bg-orange-50"
                        }`}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/history"
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${location.pathname === "/history"
                        ? "bg-orange-50 text-orange-600"
                        : "text-gray-600 hover:text-orange-600 hover:bg-orange-50"
                        }`}
                    >
                      History
                    </Link>
                  </div>

                  <div className="relative" ref={menuRef}>
                    <button
                      onClick={() => setMenuOpen(!menuOpen)}
                      className="flex items-center gap-3 pl-4 pr-2 py-2 rounded-full bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-all duration-200 group"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-100 to-orange-50 flex items-center justify-center text-orange-600 border border-orange-200">
                        <User size={16} />
                      </div>
                      <span className="hidden sm:block font-medium text-gray-700 group-hover:text-gray-900">
                        {user?.name?.split(" ")[0]}
                      </span>
                      <ChevronDown size={16} className={`text-gray-400 transition-transform duration-200 ${menuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown Menu */}
                    {menuOpen && (
                      <div className="absolute right-0 mt-3 w-56 bg-white border border-gray-100 rounded-2xl shadow-xl shadow-gray-200/50 overflow-hidden transform origin-top-right transition-all duration-200 animate-in fade-in slide-in-from-top-2">
                        <div className="p-2">
                          <button
                            onClick={() => {
                              setShowProfile(true);
                              setMenuOpen(false);
                            }}
                            className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                          >
                            <User size={16} className="text-gray-400" />
                            View Profile
                          </button>
                          <div className="h-px bg-gray-100 my-1" />
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-red-600 rounded-xl hover:bg-red-50 transition-colors"
                          >
                            <LogOut size={16} />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800 transition-all shadow-lg shadow-gray-900/20 hover:shadow-gray-900/30 transform hover:-translate-y-0.5"
                >
                  <User size={18} />
                  <span>Sign In</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Slide-in Profile Card */}
      {showProfile && <ProfileCard onClose={() => setShowProfile(false)} />}

      {/* Spacer for fixed navbar */}
      <div className="h-20" />
    </>
  );
};

export default Navbar;
