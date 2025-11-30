import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

const DeliveryLandingPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth(); // 👈 AUTH CONTEXT HERE

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-orange-50 to-white text-gray-800">

      {/* Navbar */}
      <Navbar />

      {/* ==========================
          DYNAMIC HERO SECTION
      =========================== */}
      <section className="flex flex-col-reverse md:flex-row items-center max-w-6xl mx-auto mt-28 md:mt-32 px-6 gap-12">

        {/* LEFT TEXT SECTION */}
        <div className="md:w-1/2 text-center md:text-left">

          {/* AFTER LOGIN */}
          {user ? (
            <>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-snug mb-4">
                Welcome back,{" "}
                <span className="text-[#FC8019]">
                  {user?.user?.name || user?.name || "Partner"}
                </span>{" "}
                👋
              </h1>

              <p className="text-gray-600 text-lg mb-6">
                Manage your deliveries, track your earnings, and start accepting orders anytime.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <button
                  onClick={() => navigate("/dashboard")}
                  className="px-6 py-3 bg-[#FC8019] text-white font-semibold rounded-lg hover:bg-[#E23744] transition-all"
                >
                  Go to Dashboard
                </button>

                <button
                  onClick={async () => {
                    await logout();
                    navigate("/login");
                  }}
                  className="px-6 py-3 border border-[#FC8019] text-[#FC8019] font-semibold rounded-lg hover:bg-[#FC8019] hover:text-white transition-all"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              {/* BEFORE LOGIN */}
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-snug mb-4">
                Drive with <span className="text-[#FC8019]">QuickBite</span> 🚴‍♂️
              </h1>

              <p className="text-gray-600 text-lg mb-6">
                Earn great money delivering food your way — flexible hours, instant payouts & weekly incentives!
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <button
                  onClick={() => navigate("/register")}
                  className="px-6 py-3 bg-[#FC8019] text-white font-semibold rounded-lg hover:bg-[#E23744] transition-all"
                >
                  Become a Delivery Partner
                </button>

                <button
                  onClick={() => navigate("/login")}
                  className="px-6 py-3 border border-[#FC8019] text-[#FC8019] font-semibold rounded-lg hover:bg-[#FC8019] hover:text-white transition-all"
                >
                  Login
                </button>
              </div>
            </>
          )}

        </div>

        {/* RIGHT IMAGE */}
        <div className="md:w-1/2 flex justify-center">
          <img
            src="https://res.cloudinary.com/dzyqht7sf/image/upload/v1762768461/unnamed_mo9e1m.jpg"
            alt="Delivery Partner"
            className="w-full max-w-md rounded-3xl shadow-2xl"
          />
        </div>

      </section>

      {/* ==========================
          BENEFITS (Only Before Login)
      =========================== */}
      {!user && (
        <>
          <section className="max-w-6xl mx-auto px-6 mt-24 grid sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { icon: "💰", title: "Earn Every Week", desc: "Weekly payouts & performance bonuses." },
              { icon: "🕒", title: "Flexible Hours", desc: "Work anytime — full-time or part-time." },
              { icon: "🏍️", title: "Drive Your Way", desc: "Use your own bike/scooter." },
              { icon: "🎁", title: "Rewards", desc: "Get incentives for top delivery performance." },
            ].map((b, i) => (
              <div key={i} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
                <span className="text-4xl mb-3 block">{b.icon}</span>
                <h3 className="font-bold text-lg mb-2">{b.title}</h3>
                <p className="text-gray-500 text-sm">{b.desc}</p>
              </div>
            ))}
          </section>

          {/* Steps */}
          <section className="max-w-4xl mx-auto px-6 mt-24 text-center">
            <h2 className="text-3xl font-bold mb-10">Start Delivering in 3 Easy Steps</h2>
            <div className="grid sm:grid-cols-3 gap-10">
              {[
                { step: "1️⃣", title: "Register", desc: "Fill your details & upload documents." },
                { step: "2️⃣", title: "Training", desc: "Learn the QuickBite delivery flow." },
                { step: "3️⃣", title: "Start Delivering", desc: "Accept orders & earn instantly." },
              ].map((s, i) => (
                <div key={i} className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
                  <span className="text-3xl mb-2 block">{s.step}</span>
                  <h3 className="font-semibold text-lg mb-2">{s.title}</h3>
                  <p className="text-gray-500 text-sm">{s.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="mt-24 bg-[#FC8019] text-white py-12 text-center">
            <h2 className="text-3xl font-bold mb-3">Ready to Get Started?</h2>
            <p className="text-white/90 mb-6">Join the QuickBite delivery team today.</p>
            <button
              onClick={() => navigate("/register")}
              className="px-8 py-3 bg-white text-[#FC8019] font-semibold rounded-lg hover:bg-gray-100 transition"
            >
              Join Now
            </button>
          </section>
        </>
      )}

      {/* Footer */}
      <footer className="mt-20 bg-gray-900 text-white py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>&copy; {new Date().getFullYear()} QuickBite Delivery. All rights reserved.</p>
          <div className="flex gap-4 text-sm">
            <a href="#" className="hover:text-[#FC8019] transition">Privacy</a>
            <a href="#" className="hover:text-[#FC8019] transition">Terms</a>
            <a href="#" className="hover:text-[#FC8019] transition">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DeliveryLandingPage;
