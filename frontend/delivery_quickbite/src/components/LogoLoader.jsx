import React from 'react';

const LogoLoader = () => {
    return (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 to-white">
            <div className="relative flex flex-col items-center">
                {/* Logo Container with Breathing Effect */}
                <div className="w-28 h-28 bg-white rounded-2xl shadow-xl flex items-center justify-center animate-pulse mb-8 border border-orange-100">
                    <img
                        src="/logo.png"
                        alt="QuickBite Delivery"
                        className="w-20 h-20 object-contain"
                    />
                </div>

                {/* Text with Fade In */}
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight animate-bounce">
                    QuickBite <span className="text-orange-600">Delivery</span>
                </h1>
                <p className="text-gray-500 mt-2 text-sm font-medium tracking-wide">
                    Partner App
                </p>

                {/* Custom Loader Dots */}
                <div className="flex gap-2 mt-8">
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce delay-0"></div>
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce delay-200"></div>
                </div>
            </div>
        </div>
    );
};

export default LogoLoader;
