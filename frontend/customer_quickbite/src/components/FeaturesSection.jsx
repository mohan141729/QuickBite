import React from "react"
import { Zap, ShieldCheck, Clock, Heart } from "lucide-react"

const FeaturesSection = () => {
    const features = [
        {
            id: 1,
            icon: <Zap className="w-8 h-8 text-white" />,
            title: "Lightning Fast Delivery",
            description: "Experience super-fast delivery for food delivered fresh & on time.",
            color: "bg-yellow-500",
            bg: "bg-yellow-50",
        },
        {
            id: 2,
            icon: <ShieldCheck className="w-8 h-8 text-white" />,
            title: "Safe & Hygienic",
            description: "Our partners maintain strict hygiene standards for your safety.",
            color: "bg-green-500",
            bg: "bg-green-50",
        },
        {
            id: 3,
            icon: <Clock className="w-8 h-8 text-white" />,
            title: "Live Order Tracking",
            description: "Know where your order is at every step of the way, in real-time.",
            color: "bg-blue-500",
            bg: "bg-blue-50",
        },
        {
            id: 4,
            icon: <Heart className="w-8 h-8 text-white" />,
            title: "No Minimum Order",
            description: "Order in for yourself or for the group, with no restrictions on order value.",
            color: "bg-red-500",
            bg: "bg-red-50",
        },
    ]

    return (
        <section className="py-20 bg-white">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <span className="text-[#FC8019] font-semibold tracking-wider uppercase text-sm">Why Choose Us</span>
                    <h2 className="text-4xl font-extrabold text-gray-900 mt-2">Because we deliver more than just food</h2>
                    <p className="text-gray-500 mt-4 max-w-2xl mx-auto text-lg">
                        We don't just deliver food, we deliver an experience. Here's why millions of foodies choose QuickBite every day.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature) => (
                        <div
                            key={feature.id}
                            className="group relative p-8 rounded-3xl bg-white border border-gray-100 hover:border-transparent hover:shadow-2xl transition-all duration-300 overflow-hidden"
                        >
                            {/* Hover Background Effect */}
                            <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${feature.bg}`} />

                            <div className="relative z-10 flex flex-col items-center text-center">
                                <div
                                    className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg transform group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300 ${feature.color}`}
                                >
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-gray-800 transition-colors">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-500 leading-relaxed group-hover:text-gray-600 transition-colors">
                                    {feature.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default FeaturesSection
