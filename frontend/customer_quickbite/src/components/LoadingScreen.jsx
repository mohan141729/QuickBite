import React from 'react';

const LoadingScreen = () => {
    return (
        <div className="fixed inset-0 bg-white z-[9999] flex flex-col items-center justify-center">
            <div className="relative">
                {/* Pulse Effect */}
                <div className="absolute inset-0 bg-orange-100 rounded-full animate-ping opacity-75"></div>

                {/* Logo Container */}
                <div className="relative w-24 h-24 bg-white rounded-full shadow-lg flex items-center justify-center animate-bounce-slight">
                    <img
                        src="/logo.png"
                        alt="QuickBite"
                        className="w-16 h-16 object-contain"
                    />
                </div>
            </div>

            {/* Text */}
            <div className="mt-8 flex flex-col items-center">
                <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
                    QuickBite
                </h1>
                <p className="text-sm text-gray-500 mt-2 animate-pulse">
                    Fast. Fresh. Delivered.
                </p>
            </div>

            {/* Progress Bar */}
            <div className="mt-8 w-48 h-1 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-orange-500 to-red-600 animate-loading-bar"></div>
            </div>
        </div>
    );
};

export default LoadingScreen;
