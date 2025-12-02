import React from "react"
import Navbar from "../components/Navbar"
import HeroSection from "../components/HeroSection"
import FoodCategories from "../components/FoodCategories"
import PopularRestaurants from "../components/PopularRestaurants"
import HowItWorks from "../components/HowItWorks"
import DownloadAppSection from "../components/DownloadAppSection"
import Footer from "../components/Footer"
import OffersCarousel from "../components/OffersCarousel"
import RecommendedRestaurants from "../components/RecommendedRestaurants"
import PopularItems from "../components/PopularItems"

const HomePage = () => {
    return (
        <div className="min-h-screen w-full relative overflow-hidden bg-white">
            <Navbar />

            <HeroSection />

            <OffersCarousel />
            <RecommendedRestaurants />
            <FoodCategories />
            <PopularItems />
            <PopularRestaurants />
            <HowItWorks />
            <DownloadAppSection />
            <Footer />
        </div>
    )
}

export default HomePage
