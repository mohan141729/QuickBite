import React from 'react';

const LogoLoader = () => {
    return (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gray-900">
            <div className="relative flex flex-col items-center">
                {/* Logo Container with Glow */}
                <div className="w-32 h-32 bg-gray-800 rounded-2xl shadow-2xl flex items-center justify-center animate-pulse mb-8 border border-gray-700 shadow-indigo-500/20">
                    <img
                        src="/logo.png"
                        alt="QuickBite Admin"
                        className="w-20 h-20 object-contain"
                    />
                </div>

                {/* Text with Fade In */}
                <h1 className="text-3xl font-bold text-white tracking-tight animate-fade-in-up">
                    QuickBite <span className="text-indigo-500">Admin</span>
                </h1>
                <p className="text-gray-400 mt-2 text-sm font-medium tracking-wide animate-fade-in-up delay-100">
                    Management Portal
                </p>

                {/* Custom Loader Spinner */}
                <div className="mt-8">
                    <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
                </div>
            </div>
        </div>
    );
};

export default LogoLoader;
