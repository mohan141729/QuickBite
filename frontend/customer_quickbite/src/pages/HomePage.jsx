import React from "react"
import Navbor from "../components/Navbor"
import HeroSection from "../components/HeroSection"
import FoodCategories from "../components/FoodCategories"
import PopularRestaurants from "../components/PopularRestaurants"
import HowItWorks from "../components/HowItWorks"
import DownloadAppSection from "../components/DownloadAppSection"
import Footer from "../components/Footer"

const HomePage = () => {
  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-white">
      <Navbor />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6">
        <HeroSection />
      </div>

      <FoodCategories />
      <PopularRestaurants />
      <HowItWorks />
      <DownloadAppSection />
      <Footer />
    </div>
  )
}

export default HomePage
