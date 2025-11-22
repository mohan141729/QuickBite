import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    Store,
    Bike,
    Package,
    BarChart3,
    Settings,
    LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const location = useLocation();
    const { logout } = useAuth();

    const menuItems = [
        { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/users', icon: Users, label: 'Users' },
        { path: '/restaurants', icon: Store, label: 'Restaurants' },
        { path: '/delivery-partners', icon: Bike, label: 'Delivery Partners' },
        { path: '/orders', icon: Package, label: 'Orders' },
        { path: '/analytics', icon: BarChart3, label: 'Analytics' },
        { path: '/settings', icon: Settings, label: 'Settings' },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <div className="fixed left-0 top-0 h-screen w-64 bg-slate-800 text-white flex flex-col shadow-xl z-50">
            {/* Logo/Brand */}
            <div className="p-6 border-b border-slate-700">
                <Link to="/dashboard" className="flex items-center gap-3">
                    <div className="w-10 h-10 gradient-admin rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold text-xl">QB</span>
                    </div>
                    <div>
                        <h1 className="font-bold text-lg tracking-tight">QuickBite</h1>
                        <p className="text-xs text-slate-400">Admin Panel</p>
                    </div>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-6 px-3">
                <div className="space-y-1">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive(item.path)
                                        ? 'bg-indigo-600 text-white shadow-md'
                                        : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {/* Logout Button */}
            <div className="p-4 border-t border-slate-700">
                <button
                    onClick={logout}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-slate-300 hover:bg-red-600 hover:text-white transition-all"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
