import { ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({ icon: Icon, title, value, trend, trendValue, color = 'indigo' }) => {
    const colorClasses = {
        indigo: 'from-indigo-500 to-violet-600',
        green: 'from-emerald-500 to-teal-600',
        orange: 'from-amber-500 to-orange-600',
        blue: 'from-blue-500 to-cyan-600',
    };

    const shadowClasses = {
        indigo: 'shadow-indigo-500/30',
        green: 'shadow-emerald-500/30',
        orange: 'shadow-amber-500/30',
        blue: 'shadow-blue-500/30',
    };

    const isPositive = trend === 'up';

    return (
        <div className="card-premium p-6 animate-slide-up group">
            <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${colorClasses[color]} rounded-xl flex items-center justify-center shadow-lg ${shadowClasses[color]} group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
                {trendValue && (
                    <span className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border ${isPositive
                        ? 'text-emerald-700 bg-emerald-50 border-emerald-100'
                        : 'text-red-700 bg-red-50 border-red-100'
                        }`}>
                        {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {trendValue}
                    </span>
                )}
            </div>
            <h3 className="text-slate-500 text-sm font-semibold mb-1 tracking-wide uppercase">{title}</h3>
            <p className="text-3xl font-bold text-slate-800 tracking-tight">{value}</p>
        </div>
    );
};

export default StatCard;
