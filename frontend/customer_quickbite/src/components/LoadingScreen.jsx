import React from 'react';

const LoadingScreen = () => {
    return (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-br from-orange-500 to-red-600">
            <div className="relative flex flex-col items-center">
                {/* Logo Container with Breathing Effect */}
                <div className="w-28 h-28 bg-white rounded-2xl shadow-2xl flex items-center justify-center animate-breathe mb-8">
                    <img
                        src="/logo.png"
                        alt="QuickBite"
                        className="w-20 h-20 object-contain"
                    />
                </div>

                {/* Text with Fade In */}
                <h1 className="text-3xl font-extrabold text-white tracking-tight animate-fade-in-up">
                    QuickBite
                </h1>
                <p className="text-orange-100 mt-2 text-sm font-medium tracking-wide animate-fade-in-up delay-100">
                    Your Cravings, Delivered Fast.
                </p>

                {/* Custom Loader Dots */}
                <div className="flex gap-2 mt-8">
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-0"></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-200"></div>
                </div>
            </div>
        </div>
    );
};

export default LoadingScreen;
