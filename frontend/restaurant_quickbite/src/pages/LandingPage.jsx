import React from "react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const LandingPage = () => {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-10 md:px-20 mt-28 mb-20">
        {/* Text */}
        <div className="max-w-lg space-y-5">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
            {user
              ? `Welcome back, ${user.name}!`
              : "Partner with QuickBite and grow your business faster 🚀"}
          </h1>

          {!user ? (
            <p className="text-gray-600 text-lg">
              Join India’s fastest-growing food delivery network.
              Reach thousands of hungry customers every day with QuickBite Partner.
            </p>
          ) : (
            <p className="text-gray-600 text-lg">
              Access your dashboard, manage your menu, and view live orders.
            </p>
          )}

          <div className="flex gap-4 mt-6">
            {!user ? (
              <>
                <Link
                  to="/sign-up"
                  className="px-6 py-3 bg-gradient-to-r from-[#FC8019] to-[#E23744] text-white rounded-lg font-semibold hover:opacity-90 transition"
                >
                  Register Your Restaurant
                </Link>
                <Link
                  to="/sign-in"
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
                >
                  Sign In
                </Link>
              </>
            ) : (
              <Link
                to="/dashboard"
                className="px-6 py-3 bg-gradient-to-r from-[#FC8019] to-[#E23744] text-white rounded-lg font-semibold hover:opacity-90 transition"
              >
                Go to Dashboard →
              </Link>
            )}
          </div>
        </div>

        {/* Hero Image */}
        <div className="mt-12 md:mt-0">
          <img
            src={
              user
                ? "https://res.cloudinary.com/dovmtmu7y/image/upload/v1762514997/unnamed_hutehs.jpg"
                : "https://res.cloudinary.com/dovmtmu7y/image/upload/v1762514964/unnamed_qp5bxy.jpg"
            }
            alt="Restaurant Partner"
            className="w-[460px] max-w-full rounded-3xl"
          />
        </div>
      </section>

      {/* Show Features only for non-logged users */}
      {!user && (
        <>
          <section className="bg-gray-50 py-20 px-10 md:px-20">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
              Why partner with QuickBite?
            </h2>
            <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
              {[
                {
                  title: "Boost Sales Instantly",
                  desc: "Connect to thousands of active customers and get orders within hours.",
                  img: "https://res.cloudinary.com/dovmtmu7y/image/upload/v1762515625/unnamed_ch65oz.jpg",
                },
                {
                  title: "Manage Orders Easily",
                  desc: "Track, prepare, and deliver orders with our powerful restaurant dashboard.",
                  img: "https://res.cloudinary.com/dovmtmu7y/image/upload/v1762515632/unnamed_c7d1oz.jpg",
                },
                {
                  title: "Grow Your Brand",
                  desc: "Promote your restaurant, gather reviews, and expand across multiple cities.",
                  img: "https://res.cloudinary.com/dovmtmu7y/image/upload/v1762515647/unnamed_s0pwva.jpg",
                },
              ].map((card, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-lg transition flex flex-col items-center text-center"
                >
                  <img src={card.img} alt={card.title} className="w-20 mb-6" />
                  <h3 className="text-lg font-semibold mb-3 text-gray-800">
                    {card.title}
                  </h3>
                  <p className="text-gray-500">{card.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="text-center py-20 bg-gradient-to-r from-[#FC8019] to-[#E23744] text-white">
            <h2 className="text-3xl font-bold mb-4">
              Ready to grow your restaurant with QuickBite?
            </h2>
            <p className="mb-6 text-lg opacity-90">
              Join now and start getting online orders in just a few hours.
            </p>
            <Link
              to="/sign-up"
              className="px-8 py-3 bg-white text-[#E23744] font-semibold rounded-lg hover:bg-gray-100 transition"
            >
              Get Started
            </Link>
          </section>
        </>
      )}

      <Footer />
    </div>
  )
}

export default LandingPage
