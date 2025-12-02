import React from "react"
import Navbar from "../components/Navbar"
import HeroSection from "../components/HeroSection"
import FoodCategories from "../components/FoodCategories"
import PopularRestaurants from "../components/PopularRestaurants"
import FeaturesSection from "../components/FeaturesSection"
import DownloadAppSection from "../components/DownloadAppSection"
import Footer from "../components/Footer"
import OffersCarousel from "../components/OffersCarousel"
import RecommendedRestaurants from "../components/RecommendedRestaurants"
import PopularItems from "../components/PopularItems"

const HomePage = () => {
    return (
        <div className="min-h-screen w-full relative overflow-hidden bg-gradient-to-br from-[#FFF8F2] to-white">
            <Navbar />

            <HeroSection />

            <OffersCarousel />
            <RecommendedRestaurants />
            <FoodCategories />
            <PopularItems />
            <PopularRestaurants />
            <FeaturesSection />
            <DownloadAppSection />
            <Footer />
        </div>
    )
}

export default HomePage
