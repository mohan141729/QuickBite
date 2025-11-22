import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({ icon: Icon, title, value, trend, trendValue, color = 'indigo' }) => {
    const colorClasses = {
        indigo: 'from-indigo-500 to-purple-600',
        green: 'from-green-500 to-emerald-600',
        orange: 'from-orange-500 to-red-600',
        blue: 'from-blue-500 to-cyan-600',
    };

    const isPositive = trend === 'up';

    return (
        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 card-hover animate-slide-up">
            <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${colorClasses[color]} rounded-xl flex items-center justify-center shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
                {trendValue && (
                    <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${isPositive ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'
                        }`}>
                        {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {trendValue}
                    </span>
                )}
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
    );
};

export default StatCard;
