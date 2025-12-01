import React, { useEffect, useState } from "react";
import { Gift, ChevronRight, Zap, Award, Star, Clock } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const IncentiveCarousel = ({ stats }) => {
    const { user } = useAuth();
    const [incentives, setIncentives] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000); // Update every minute
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const fetchIncentives = async () => {
            try {
                const response = await api.get("/api/incentives/active");
                setIncentives(response.data.incentives);
            } catch (error) {
                console.error("Failed to fetch incentives:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchIncentives();
    }, []);

    const isIncentiveActive = (incentive) => {
        if (!incentive.startTime || !incentive.endTime) return true; // Always active if no time set

        const now = new Date();
        const currentMinutes = now.getHours() * 60 + now.getMinutes();

        const [startHour, startMinute] = incentive.startTime.split(':').map(Number);
        const [endHour, endMinute] = incentive.endTime.split(':').map(Number);

        const startTotalMinutes = startHour * 60 + startMinute;
        const endTotalMinutes = endHour * 60 + endMinute;

        if (endTotalMinutes < startTotalMinutes) {
            // Crosses midnight (e.g. 22:00 to 02:00)
            return currentMinutes >= startTotalMinutes || currentMinutes <= endTotalMinutes;
        }

        return currentMinutes >= startTotalMinutes && currentMinutes <= endTotalMinutes;
    };

    if (loading) {
        return (
            <div className="mb-8 animate-pulse">
                <div className="h-48 bg-gray-200 rounded-2xl"></div>
            </div>
        );
    }

    if (incentives.length === 0) return null;

    return (
        <div className="mb-8 overflow-x-auto pb-4 hide-scrollbar">
            <div className="flex gap-4 min-w-max px-1">
                {incentives.map((incentive) => {
                    const isActiveNow = isIncentiveActive(incentive);

                    // Calculate progress based on incentive type
                    let progress = 0;
                    let current = 0;

                    if (incentive.type === 'daily') {
                        current = stats.todayDeliveries || 0;
                        progress = Math.min((current / incentive.target) * 100, 100);
                    } else if (incentive.type === 'weekly') {
                        current = stats.weekDeliveries || 0;
                        progress = Math.min((current / incentive.target) * 100, 100);
                    }

                    // Dynamically select icon if needed, or default to Gift
                    const Icon = Gift;
                    const gradientColor = incentive.color || "from-orange-500 to-red-600";

                    return (
                        <div
                            key={incentive._id}
                            className={`w-80 p-5 rounded-2xl bg-gradient-to-br ${gradientColor} text-white shadow-lg transform transition-all hover:scale-[1.02] active:scale-95 relative overflow-hidden ${!isActiveNow ? 'opacity-60 grayscale-[0.5]' : ''}`}
                        >
                            {/* Background Pattern */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-bl-full -mr-8 -mt-8" />

                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <div className="flex gap-2">
                                            {isActiveNow && incentive.startTime && (
                                                <span className="bg-red-500 px-2 py-1 rounded-full text-[10px] font-bold animate-pulse shadow-sm">
                                                    LIVE
                                                </span>
                                            )}
                                            <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm border border-white/10">
                                                {incentive.type === 'daily' ? 'TODAY' : 'WEEKLY'}
                                            </span>
                                        </div>
                                        {incentive.startTime && incentive.endTime && (
                                            <div className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-md backdrop-blur-sm ${isActiveNow ? 'bg-black/20' : 'bg-black/40'}`}>
                                                <Clock size={10} />
                                                {incentive.startTime} - {incentive.endTime}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold mb-1">{incentive.title}</h3>
                                <p className="text-white/90 text-sm mb-4 h-10 line-clamp-2">
                                    {incentive.description}
                                </p>

                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs font-semibold tracking-wide uppercase opacity-90">
                                        <span>Progress</span>
                                        <span>{current} / {incentive.target}</span>
                                    </div>
                                    <div className="h-2 bg-black/20 rounded-full overflow-hidden backdrop-blur-sm">
                                        <div
                                            className="h-full bg-white transition-all duration-1000 ease-out relative"
                                            style={{ width: `${progress}%` }}
                                        >
                                            <div className="absolute inset-0 bg-white/50 animate-pulse" />
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center mt-2">
                                        <span className="text-xs font-medium opacity-80">
                                            {progress >= 100 ? "Completed!" : `${incentive.target - current} more to go`}
                                        </span>
                                        <span className="text-lg font-bold">₹{incentive.reward}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default IncentiveCarousel;
