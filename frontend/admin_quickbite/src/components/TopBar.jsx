import { useState, useEffect, useRef } from 'react';
import { Bell, Search, User, ChevronDown, Settings, LogOut, X } from 'lucide-react';
import { useUser, useClerk } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

const TopBar = ({ title }) => {
    const { user } = useUser();
    const { signOut } = useClerk();
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showSearchResults, setShowSearchResults] = useState(false);

    const dropdownRef = useRef(null);
    const notificationRef = useRef(null);
    const searchRef = useRef(null);

    // Mock notifications - in production, fetch from backend
    const [notifications] = useState([
        { id: 1, type: 'order', message: 'New order received from Pizza Palace', time: '5 min ago', read: false },
        { id: 2, type: 'user', message: 'New user registration: John Doe', time: '15 min ago', read: false },
        { id: 3, type: 'restaurant', message: 'Restaurant approval pending: Burger House', time: '1 hour ago', read: true },
        { id: 4, type: 'delivery', message: 'New delivery partner: Mike Wilson', time: '2 hours ago', read: true }
    ]);

    // Search data - pages and quick actions
    const searchableItems = [
        { name: 'Dashboard', path: '/dashboard', type: 'page' },
        { name: 'Users', path: '/users', type: 'page' },
        { name: 'Restaurants', path: '/restaurants', type: 'page' },
        { name: 'Delivery Partners', path: '/delivery-partners', type: 'page' },
        { name: 'Orders', path: '/orders', type: 'page' },
        { name: 'Analytics', path: '/analytics', type: 'page' },
        { name: 'Settings', path: '/settings', type: 'page' }
    ];

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSearchResults(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Handle search
    const handleSearch = (query) => {
        setSearchQuery(query);
        if (query.trim()) {
            const results = searchableItems.filter(item =>
                item.name.toLowerCase().includes(query.toLowerCase())
            );
            setSearchResults(results);
            setShowSearchResults(true);
        } else {
            setSearchResults([]);
            setShowSearchResults(false);
        }
    };

    // Navigate to search result
    const handleSearchResultClick = (path) => {
        navigate(path);
        setSearchQuery('');
        setShowSearchResults(false);
    };

    // Navigate to profile/settings
    const handleViewProfile = () => {
        setShowDropdown(false);
        navigate('/settings');
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="fixed top-0 left-64 right-0 h-20 glass z-40 flex items-center justify-between px-8 transition-all duration-300">
            {/* Page Title */}
            <div>
                <h1 className="text-2xl font-bold text-slate-800 tracking-tight">{title}</h1>
                <p className="text-xs text-slate-500 mt-0.5">Overview & Statistics</p>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-6">
                {/* Search */}
                <div className="relative hidden md:block" ref={searchRef}>
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search pages..."
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        onFocus={() => searchQuery && setShowSearchResults(true)}
                        className="pl-10 pr-10 py-2.5 bg-white/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 w-72 transition-all duration-200 shadow-sm hover:shadow-md"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => {
                                setSearchQuery('');
                                setShowSearchResults(false);
                            }}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}

                    {/* Search Results Dropdown */}
                    {showSearchResults && searchResults.length > 0 && (
                        <div className="absolute top-full mt-3 w-full bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 max-h-64 overflow-y-auto animate-fade-in">
                            {searchResults.map((result) => (
                                <button
                                    key={result.path}
                                    onClick={() => handleSearchResultClick(result.path)}
                                    className="w-full text-left px-4 py-3 hover:bg-indigo-50 flex items-center gap-3 transition-colors"
                                >
                                    <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                                        <Search className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-800">{result.name}</p>
                                        <p className="text-xs text-slate-500 capitalize">{result.type}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    {showSearchResults && searchResults.length === 0 && searchQuery && (
                        <div className="absolute top-full mt-3 w-full bg-white rounded-xl shadow-xl border border-slate-100 py-6 z-50 text-center animate-fade-in">
                            <p className="text-sm text-slate-500">No results found</p>
                        </div>
                    )}
                </div>

                {/* Notifications */}
                <div className="relative" ref={notificationRef}>
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="relative p-2.5 hover:bg-white/80 rounded-xl transition-all duration-200 border border-transparent hover:border-slate-200 hover:shadow-sm group"
                    >
                        <Bell className="w-5 h-5 text-slate-600 group-hover:text-indigo-600 transition-colors" />
                        {unreadCount > 0 && (
                            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                        )}
                    </button>

                    {/* Notifications Dropdown */}
                    {showNotifications && (
                        <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden animate-slide-up">
                            <div className="px-5 py-4 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
                                <h3 className="font-bold text-slate-800">Notifications</h3>
                                {unreadCount > 0 && (
                                    <span className="text-xs bg-indigo-100 text-indigo-600 px-2.5 py-1 rounded-full font-bold">
                                        {unreadCount} New
                                    </span>
                                )}
                            </div>
                            <div className="max-h-[24rem] overflow-y-auto">
                                {notifications.length > 0 ? (
                                    notifications.map((notification) => (
                                        <div
                                            key={notification.id}
                                            className={`px-5 py-4 border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition-colors ${!notification.read ? 'bg-indigo-50/30' : ''
                                                }`}
                                        >
                                            <div className="flex gap-3">
                                                <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${!notification.read ? 'bg-indigo-500' : 'bg-slate-300'}`} />
                                                <div>
                                                    <p className={`text-sm ${!notification.read ? 'font-semibold text-slate-800' : 'text-slate-600'}`}>
                                                        {notification.message}
                                                    </p>
                                                    <p className="text-xs text-slate-400 mt-1.5 font-medium">{notification.time}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="px-5 py-12 text-center">
                                        <Bell className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                                        <p className="text-sm text-slate-500 font-medium">No notifications yet</p>
                                    </div>
                                )}
                            </div>
                            {notifications.length > 0 && (
                                <div className="p-2 bg-slate-50 border-t border-slate-100">
                                    <button className="text-sm text-indigo-600 hover:text-indigo-700 font-semibold w-full py-2 rounded-lg hover:bg-indigo-50 transition-colors">
                                        Mark all as read
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* User Profile */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="flex items-center gap-3 pl-4 border-l border-slate-200 hover:bg-white/50 p-2 rounded-xl transition-all duration-200 group"
                    >
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-full flex items-center justify-center shadow-md group-hover:shadow-indigo-500/20 transition-all">
                            <User className="w-5 h-5 text-white" />
                        </div>
                        <div className="hidden lg:block text-left">
                            <p className="font-bold text-sm text-slate-800 group-hover:text-indigo-600 transition-colors">{user?.fullName || user?.primaryEmailAddress?.emailAddress || 'Admin'}</p>
                            <p className="text-xs text-slate-500 font-medium">Administrator</p>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-slate-400 hidden lg:block transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown Menu */}
                    {showDropdown && (
                        <div className="absolute right-0 mt-3 w-60 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 animate-slide-up">
                            <div className="px-5 py-4 border-b border-slate-50 lg:hidden">
                                <p className="font-bold text-sm text-slate-800">{user?.name || 'Admin'}</p>
                                <p className="text-xs text-slate-500">{user?.email || 'admin@quickbite.com'}</p>
                            </div>
                            <div className="p-2">
                                <button
                                    onClick={handleViewProfile}
                                    className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-xl flex items-center gap-3 transition-colors font-medium"
                                >
                                    <User className="w-4 h-4" />
                                    View Profile
                                </button>
                                <button
                                    onClick={handleViewProfile}
                                    className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-xl flex items-center gap-3 transition-colors font-medium"
                                >
                                    <Settings className="w-4 h-4" />
                                    Settings
                                </button>
                            </div>
                            <div className="border-t border-slate-100 my-1"></div>
                            <div className="p-2">
                                <button
                                    onClick={() => signOut(() => navigate('/login'))}
                                    className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl flex items-center gap-3 transition-colors font-medium"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TopBar;
