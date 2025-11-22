import React, { useState, useEffect, useRef } from 'react';
import { Bell, Search, User, ChevronDown, Settings, LogOut, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const TopBar = ({ title }) => {
    const { user, logout } = useAuth();
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
        <div className="fixed top-0 left-64 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 z-40 shadow-sm">
            {/* Page Title */}
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>

            {/* Right Section */}
            <div className="flex items-center gap-4">
                {/* Search */}
                <div className="relative hidden md:block" ref={searchRef}>
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search pages..."
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        onFocus={() => searchQuery && setShowSearchResults(true)}
                        className="pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-64"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => {
                                setSearchQuery('');
                                setShowSearchResults(false);
                            }}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}

                    {/* Search Results Dropdown */}
                    {showSearchResults && searchResults.length > 0 && (
                        <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50 max-h-64 overflow-y-auto">
                            {searchResults.map((result) => (
                                <button
                                    key={result.path}
                                    onClick={() => handleSearchResultClick(result.path)}
                                    className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-3"
                                >
                                    <Search className="w-4 h-4 text-gray-400" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{result.name}</p>
                                        <p className="text-xs text-gray-500">{result.type}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    {showSearchResults && searchResults.length === 0 && searchQuery && (
                        <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-100 py-4 z-50">
                            <p className="text-sm text-gray-500 text-center">No results found</p>
                        </div>
                    )}
                </div>

                {/* Notifications */}
                <div className="relative" ref={notificationRef}>
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <Bell className="w-5 h-5 text-gray-600" />
                        {unreadCount > 0 && (
                            <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-semibold">
                                {unreadCount}
                            </span>
                        )}
                    </button>

                    {/* Notifications Dropdown */}
                    {showNotifications && (
                        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-100 z-50">
                            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                                <h3 className="font-semibold text-gray-900">Notifications</h3>
                                {unreadCount > 0 && (
                                    <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-semibold">
                                        {unreadCount} new
                                    </span>
                                )}
                            </div>
                            <div className="max-h-96 overflow-y-auto">
                                {notifications.length > 0 ? (
                                    notifications.map((notification) => (
                                        <div
                                            key={notification.id}
                                            className={`px-4 py-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer ${!notification.read ? 'bg-indigo-50' : ''
                                                }`}
                                        >
                                            <p className="text-sm text-gray-900 font-medium">{notification.message}</p>
                                            <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="px-4 py-8 text-center">
                                        <Bell className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                                        <p className="text-sm text-gray-500">No notifications</p>
                                    </div>
                                )}
                            </div>
                            {notifications.length > 0 && (
                                <div className="px-4 py-3 border-t border-gray-100">
                                    <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium w-full text-center">
                                        View all notifications
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
                        className="flex items-center gap-3 pl-4 border-l border-gray-200 hover:bg-gray-50 p-2 rounded-lg transition-colors"
                    >
                        <div className="w-9 h-9 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                        </div>
                        <div className="hidden lg:block text-left">
                            <p className="font-semibold text-sm text-gray-900">{user?.name || 'Admin'}</p>
                            <p className="text-xs text-gray-500">Administrator</p>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-gray-400 hidden lg:block transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown Menu */}
                    {showDropdown && (
                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
                            <div className="px-4 py-3 border-b border-gray-100 lg:hidden">
                                <p className="font-semibold text-sm text-gray-900">{user?.name || 'Admin'}</p>
                                <p className="text-xs text-gray-500">{user?.email || 'admin@quickbite.com'}</p>
                            </div>
                            <button
                                onClick={handleViewProfile}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                            >
                                <User className="w-4 h-4" />
                                View Profile
                            </button>
                            <button
                                onClick={handleViewProfile}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                            >
                                <Settings className="w-4 h-4" />
                                Settings
                            </button>
                            <div className="border-t border-gray-100 my-1"></div>
                            <button
                                onClick={logout}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3"
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TopBar;
