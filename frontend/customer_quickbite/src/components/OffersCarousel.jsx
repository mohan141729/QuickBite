/* eslint-disable react-refresh/only-export-components */
import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Tag, Copy, Check } from "lucide-react";
import { getAllCoupons } from "../api/coupons";

const OffersCarousel = () => {
    const [coupons, setCoupons] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [copiedCode, setCopiedCode] = useState(null);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    useEffect(() => {
        const fetchCoupons = async () => {
            try {
                const data = await getAllCoupons();
                setCoupons(data);
            } catch (error) {
                console.error("Failed to fetch coupons:", error);
            }
        };
        fetchCoupons();
    }, []);

    // Auto-play carousel
    useEffect(() => {
        if (!isAutoPlaying || coupons.length === 0) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % coupons.length);
        }, 4000);

        return () => clearInterval(interval);
    }, [isAutoPlaying, coupons.length]);

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % coupons.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + coupons.length) % coupons.length);
    };

    const copyCode = (code) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(null), 2000);
    };

    if (coupons.length === 0) return null;

    const currentCoupon = coupons[currentIndex];

    return (
        <section
            className="relative max-w-7xl mx-auto px-4 py-8"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <Tag className="w-6 h-6 text-[#FC8019]" />
                    <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">
                        Exclusive Offers
                    </h2>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handlePrev}
                        className="p-2 rounded-full bg-white border border-gray-200 shadow-sm hover:shadow-md hover:bg-gray-50 transition"
                        aria-label="Previous offer"
                    >
                        <ChevronLeft className="h-5 w-5 text-gray-700" />
                    </button>
                    <button
                        onClick={handleNext}
                        className="p-2 rounded-full bg-white border border-gray-200 shadow-sm hover:shadow-md hover:bg-gray-50 transition"
                        aria-label="Next offer"
                    >
                        <ChevronRight className="h-5 w-5 text-gray-700" />
                    </button>
                </div>
            </div>

            {/* Carousel */}
            <div className="relative overflow-hidden rounded-2xl">
                <div
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                    {coupons.map((coupon) => (
                        <div
                            key={coupon._id}
                            className="min-w-full"
                        >
                            <div className="relative bg-gradient-to-r from-[#FC8019] via-[#E23744] to-[#FC8019] p-8 md:p-10 rounded-2xl shadow-lg overflow-hidden">
                                {/* Background Pattern */}
                                <div className="absolute inset-0 opacity-10">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
                                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/2"></div>
                                </div>

                                {/* Content */}
                                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                                    <div className="text-white flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Tag className="w-5 h-5" />
                                            <span className="text-sm font-semibold uppercase tracking-wide">
                                                {coupon.discountType === "percentage"
                                                    ? `${coupon.discountValue}% Off`
                                                    : coupon.discountType === "flat"
                                                        ? `₹${coupon.discountValue} Off`
                                                        : "Free Delivery"}
                                            </span>
                                        </div>
                                        <h3 className="text-2xl md:text-3xl font-bold mb-2">
                                            {coupon.description}
                                        </h3>
                                        {coupon.minOrderValue > 0 && (
                                            <p className="text-white/90 text-sm">
                                                Valid on orders above ₹{coupon.minOrderValue}
                                            </p>
                                        )}
                                        {coupon.maxDiscount && (
                                            <p className="text-white/90 text-sm">
                                                Max discount: ₹{coupon.maxDiscount}
                                            </p>
                                        )}
                                        <p className="text-white/80 text-xs mt-2">
                                            Valid until {new Date(coupon.validUntil).toLocaleDateString()}
                                        </p>
                                    </div>

                                    {/* Copy Code Button */}
                                    <div className="flex-shrink-0">
                                        <button
                                            onClick={() => copyCode(coupon.code)}
                                            className="group bg-white text-gray-900 px-6 py-4 rounded-xl font-bold text-lg shadow-xl hover:scale-105 transition-all duration-200 flex items-center gap-3"
                                        >
                                            <span className="font-mono">{coupon.code}</span>
                                            {copiedCode === coupon.code ? (
                                                <Check className="w-5 h-5 text-green-600" />
                                            ) : (
                                                <Copy className="w-5 h-5 text-gray-600 group-hover:text-[#FC8019]" />
                                            )}
                                        </button>
                                        {copiedCode === coupon.code && (
                                            <p className="text-white text-xs text-center mt-2 font-semibold">
                                                Copied to clipboard!
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Indicators */}
                <div className="flex justify-center gap-2 mt-4">
                    {coupons.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`h-2 rounded-full transition-all duration-300 ${index === currentIndex
                                    ? "w-8 bg-[#FC8019]"
                                    : "w-2 bg-gray-300 hover:bg-gray-400"
                                }`}
                            aria-label={`Go to offer ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default OffersCarousel;
