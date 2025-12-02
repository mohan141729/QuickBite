import React from 'react';

const LogoLoader = () => {
    return (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-br from-white to-orange-50">
            <div className="relative flex flex-col items-center">
                {/* Logo Container with Breathing Effect */}
                <div className="w-32 h-32 bg-white rounded-full shadow-2xl flex items-center justify-center animate-pulse mb-8 border-4 border-orange-500/20">
                    <img
                        src="/logo.png"
                        alt="QuickBite Restaurant"
                        className="w-20 h-20 object-contain"
                    />
                </div>

                {/* Text with Fade In */}
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight animate-fade-in-up">
                    QuickBite <span className="text-orange-600">Restaurant</span>
                </h1>
                <p className="text-gray-400 mt-2 text-sm font-medium tracking-wide animate-fade-in-up delay-100">
                    Partner Dashboard
                </p>

                {/* Custom Loader Bar */}
                <div className="w-48 h-1 bg-gray-100 rounded-full mt-8 overflow-hidden">
                    <div className="h-full bg-orange-500 animate-progress"></div>
                </div>
            </div>
        </div>
    );
};

export default LogoLoader;
