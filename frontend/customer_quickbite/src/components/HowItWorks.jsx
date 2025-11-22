import React from "react"
import { MapPin, Utensils, Truck } from "lucide-react"

const HowItWorks = () => {
    const steps = [
        {
            id: 1,
            icon: <MapPin className="w-8 h-8 text-white" />,
            title: "Select Location",
            description: "Choose your location to see available restaurants near you.",
            color: "bg-blue-500",
        },
        {
            id: 2,
            icon: <Utensils className="w-8 h-8 text-white" />,
            title: "Choose Order",
            description: "Browse menus and select your favorite food items.",
            color: "bg-[#FC8019]",
        },
        {
            id: 3,
            icon: <Truck className="w-8 h-8 text-white" />,
            title: "Fast Delivery",
            description: "Get your food delivered to your doorstep in minutes.",
            color: "bg-green-500",
        },
    ]

    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
                    <p className="text-gray-500 mt-2">Simple steps to get your food</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {steps.map((step) => (
                        <div
                            key={step.id}
                            className="flex flex-col items-center text-center p-6 rounded-2xl hover:shadow-xl transition-shadow duration-300 bg-white border border-gray-50"
                        >
                            <div
                                className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-lg transform group-hover:scale-110 transition-transform duration-300 ${step.color}`}
                            >
                                {step.icon}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">
                                {step.title}
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default HowItWorks
