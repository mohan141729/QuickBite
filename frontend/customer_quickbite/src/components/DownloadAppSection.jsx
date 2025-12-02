import React from "react"
import { Smartphone, Star } from "lucide-react"

const DownloadAppSection = () => {
    return (
        <section className="py-20 bg-gradient-to-br from-[#FFF8F2] to-white relative overflow-hidden">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col md:flex-row items-center justify-between gap-12">

                    {/* Text Content */}
                    <div className="flex-1 text-center md:text-left space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-[#FC8019] font-semibold text-sm">
                            <Smartphone className="w-4 h-4" />
                            <span>Download App</span>
                        </div>

                        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
                            Get the full experience <br />
                            <span className="text-[#FC8019]">on your mobile</span>
                        </h2>

                        <p className="text-lg text-gray-600 max-w-lg mx-auto md:mx-0">
                            Order on the go, track your delivery in real-time, and get exclusive mobile-only discounts.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start pt-4">
                            <button className="flex items-center gap-3 bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition shadow-lg hover:scale-105 active:scale-95">
                                <img
                                    src="https://upload.wikimedia.org/wikipedia/commons/3/31/Apple_logo_white.svg"
                                    alt="Apple"
                                    className="w-6 h-6"
                                />
                                <div className="text-left">
                                    <p className="text-[10px] uppercase font-medium text-gray-300">Download on the</p>
                                    <p className="text-sm font-bold leading-none">App Store</p>
                                </div>
                            </button>

                            <button className="flex items-center gap-3 bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition shadow-lg hover:scale-105 active:scale-95">
                                <img
                                    src="https://upload.wikimedia.org/wikipedia/commons/d/d7/Android_robot.svg"
                                    alt="Android"
                                    className="w-6 h-6 filter invert"
                                />
                                <div className="text-left">
                                    <p className="text-[10px] uppercase font-medium text-gray-300">Get it on</p>
                                    <p className="text-sm font-bold leading-none">Google Play</p>
                                </div>
                            </button>
                        </div>

                        <div className="flex items-center gap-4 justify-center md:justify-start text-sm text-gray-500 pt-4">
                            <div className="flex -space-x-2">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                                        <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                            <p>Join <span className="font-bold text-gray-900">10k+</span> happy users</p>
                        </div>
                    </div>

                    {/* Image Content (Mockup) */}
                    <div className="flex-1 relative">
                        <div className="relative z-10 transform md:rotate-[-5deg] hover:rotate-0 transition-transform duration-500">
                            <img
                                src="https://res.cloudinary.com/dovmtmu7y/image/upload/v1763737726/download_w33woh.jpg"
                                alt="QuickBite Mobile App"
                                className="rounded-[2.5rem] shadow-2xl w-[300px] mx-auto"
                            />
                            {/* Floating Badge */}
                            <div className="absolute top-10 -right-4 bg-white p-3 rounded-xl shadow-lg animate-bounce">
                                <div className="flex items-center gap-2">
                                    <div className="bg-green-100 p-2 rounded-full">
                                        <Star className="w-4 h-4 text-green-600 fill-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-900">4.8/5</p>
                                        <p className="text-[10px] text-gray-500">App Rating</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Decorative Elements */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-200/30 rounded-full blur-3xl -z-10" />
                    </div>

                </div>
            </div>
        </section>
    )
}

export default DownloadAppSection
