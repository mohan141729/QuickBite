import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    Store,
    Bike,
    Package,
    BarChart3,
    Settings,
    Tag,
    Grid,
    Gift,
} from 'lucide-react';
import { UserButton, useUser } from '@clerk/clerk-react';

const Sidebar = ({ isOpen, onClose }) => {
    const location = useLocation();
    const { user } = useUser();

    const menuItems = [
        { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/users', icon: Users, label: 'Users' },
        { path: '/restaurants', icon: Store, label: 'Restaurants' },
        { path: '/delivery-partners', icon: Bike, label: 'Delivery Partners' },
        { path: '/orders', icon: Package, label: 'Orders' },
        { path: '/categories', icon: Grid, label: 'Categories' },
        { path: '/incentives', icon: Gift, label: 'Incentives' },
        { path: '/coupons', icon: Tag, label: 'Coupons' },
        { path: '/analytics', icon: BarChart3, label: 'Analytics' },
        { path: '/settings', icon: Settings, label: 'Settings' },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <div className={`fixed inset-y-0 left-0 w-64 glass-dark text-white flex flex-col z-50 transition-transform duration-300 ease-in-out md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
            }`}>
            {/* Logo/Brand */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <Link to="/dashboard" className="flex items-center gap-3 group">
                    <img src="/logo.png" alt="QuickBite" className="w-10 h-10 object-contain" />
                    <div>
                        <h1 className="font-bold text-lg tracking-tight text-white">QuickBite</h1>
                        <p className="text-xs text-slate-400">Admin Panel</p>
                    </div>
                </Link>
                {/* Close Button (Mobile Only) */}
                <button
                    onClick={onClose}
                    className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${active
                                ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-900/20'
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <Icon className={`w-5 h-5 transition-transform duration-200 ${active ? 'scale-110' : 'group-hover:scale-110'}`} />
                            <span className="font-medium relative z-10">{item.label}</span>
                            {active && (
                                <div className="absolute inset-0 bg-white/10 animate-pulse" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* User Profile & Logout */}
            <div className="p-4 border-t border-white/10 bg-black/20 backdrop-blur-sm">
                <div className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
                    <UserButton
                        afterSignOutUrl="/login"
                        appearance={{
                            elements: {
                                avatarBox: "w-9 h-9 border-2 border-indigo-500/50"
                            }
                        }}
                    />
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                            {user?.fullName || user?.primaryEmailAddress?.emailAddress}
                        </p>
                        <p className="text-xs text-indigo-400 truncate font-medium">
                            Administrator
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
