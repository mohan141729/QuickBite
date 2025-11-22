import React, { useState } from 'react';
import TopBar from '../components/TopBar';
import { Settings as SettingsIcon, User, Bell, Shield, Globe, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Settings = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');

    // Profile settings
    const [profileData, setProfileData] = useState({
        name: user?.name || 'Admin User',
        email: user?.email || 'admin@example.com',
        phone: '',
        role: user?.role || 'admin'
    });

    // Platform settings
    const [platformSettings, setPlatformSettings] = useState({
        siteName: 'QuickBite',
        supportEmail: 'support@quickbite.com',
        currency: 'INR',
        timezone: 'Asia/Kolkata',
        maintenanceMode: false
    });

    // Notification settings
    const [notificationSettings, setNotificationSettings] = useState({
        emailNotifications: true,
        orderAlerts: true,
        newUserAlerts: true,
        restaurantApprovalAlerts: true,
        deliveryPartnerAlerts: true
    });

    const handleProfileUpdate = (e) => {
        e.preventDefault();
        toast.success('Profile updated successfully!');
    };

    const handlePlatformUpdate = (e) => {
        e.preventDefault();
        toast.success('Platform settings updated successfully!');
    };

    const handleNotificationUpdate = (e) => {
        e.preventDefault();
        toast.success('Notification settings updated successfully!');
    };

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'platform', label: 'Platform', icon: Globe },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'security', label: 'Security', icon: Shield }
    ];

    return (
        <div className="flex-1 bg-gray-50 min-h-screen">
            <TopBar title="Settings" />

            <div className="pt-16 pl-64">
                <div className="p-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                                <SettingsIcon className="w-8 h-8 text-indigo-600" />
                                Settings
                            </h2>
                            <p className="text-gray-600 mt-1">Manage your admin account and platform settings</p>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="bg-white rounded-xl shadow-md border border-gray-100 mb-6">
                        <div className="border-b border-gray-200">
                            <div className="flex gap-2 p-2">
                                {tabs.map((tab) => {
                                    const Icon = tab.icon;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${activeTab === tab.id
                                                ? 'bg-indigo-600 text-white'
                                                : 'text-gray-700 hover:bg-gray-100'
                                                }`}
                                        >
                                            <Icon className="w-5 h-5" />
                                            {tab.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Tab Content */}
                        <div className="p-8">
                            {/* Profile Tab */}
                            {activeTab === 'profile' && (
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-6">Profile Information</h3>
                                    <form onSubmit={handleProfileUpdate} className="space-y-6 max-w-2xl">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Full Name
                                                </label>
                                                <input
                                                    type="text"
                                                    value={profileData.name}
                                                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Email Address
                                                </label>
                                                <input
                                                    type="email"
                                                    value={profileData.email}
                                                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Phone Number
                                                </label>
                                                <input
                                                    type="tel"
                                                    value={profileData.phone}
                                                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                                    placeholder="+91 1234567890"
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Role
                                                </label>
                                                <input
                                                    type="text"
                                                    value={profileData.role}
                                                    disabled
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                                                />
                                            </div>
                                        </div>
                                        <button
                                            type="submit"
                                            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
                                        >
                                            <Save className="w-5 h-5" />
                                            Save Changes
                                        </button>
                                    </form>
                                </div>
                            )}

                            {/* Platform Tab */}
                            {activeTab === 'platform' && (
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-6">Platform Settings</h3>
                                    <form onSubmit={handlePlatformUpdate} className="space-y-6 max-w-2xl">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Site Name
                                                </label>
                                                <input
                                                    type="text"
                                                    value={platformSettings.siteName}
                                                    onChange={(e) => setPlatformSettings({ ...platformSettings, siteName: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Support Email
                                                </label>
                                                <input
                                                    type="email"
                                                    value={platformSettings.supportEmail}
                                                    onChange={(e) => setPlatformSettings({ ...platformSettings, supportEmail: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Currency
                                                </label>
                                                <select
                                                    value={platformSettings.currency}
                                                    onChange={(e) => setPlatformSettings({ ...platformSettings, currency: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                                >
                                                    <option value="INR">INR (₹)</option>
                                                    <option value="USD">USD ($)</option>
                                                    <option value="EUR">EUR (€)</option>
                                                    <option value="GBP">GBP (£)</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Timezone
                                                </label>
                                                <select
                                                    value={platformSettings.timezone}
                                                    onChange={(e) => setPlatformSettings({ ...platformSettings, timezone: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                                >
                                                    <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                                                    <option value="America/New_York">America/New_York (EST)</option>
                                                    <option value="Europe/London">Europe/London (GMT)</option>
                                                    <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                            <input
                                                type="checkbox"
                                                id="maintenance"
                                                checked={platformSettings.maintenanceMode}
                                                onChange={(e) => setPlatformSettings({ ...platformSettings, maintenanceMode: e.target.checked })}
                                                className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                                            />
                                            <label htmlFor="maintenance" className="text-sm font-medium text-gray-700">
                                                Enable Maintenance Mode
                                            </label>
                                        </div>
                                        <button
                                            type="submit"
                                            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
                                        >
                                            <Save className="w-5 h-5" />
                                            Save Changes
                                        </button>
                                    </form>
                                </div>
                            )}

                            {/* Notifications Tab */}
                            {activeTab === 'notifications' && (
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-6">Notification Preferences</h3>
                                    <form onSubmit={handleNotificationUpdate} className="space-y-4 max-w-2xl">
                                        <div className="space-y-4">
                                            {[
                                                { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive email notifications for important events' },
                                                { key: 'orderAlerts', label: 'Order Alerts', description: 'Get notified when new orders are placed' },
                                                { key: 'newUserAlerts', label: 'New User Alerts', description: 'Receive alerts when new users register' },
                                                { key: 'restaurantApprovalAlerts', label: 'Restaurant Approval Alerts', description: 'Get notified when restaurants need approval' },
                                                { key: 'deliveryPartnerAlerts', label: 'Delivery Partner Alerts', description: 'Receive alerts for new delivery partner registrations' }
                                            ].map((item) => (
                                                <div key={item.key} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                                                    <input
                                                        type="checkbox"
                                                        id={item.key}
                                                        checked={notificationSettings[item.key]}
                                                        onChange={(e) => setNotificationSettings({ ...notificationSettings, [item.key]: e.target.checked })}
                                                        className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500 mt-0.5"
                                                    />
                                                    <div>
                                                        <label htmlFor={item.key} className="block text-sm font-medium text-gray-900">
                                                            {item.label}
                                                        </label>
                                                        <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <button
                                            type="submit"
                                            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
                                        >
                                            <Save className="w-5 h-5" />
                                            Save Preferences
                                        </button>
                                    </form>
                                </div>
                            )}

                            {/* Security Tab */}
                            {activeTab === 'security' && (
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-6">Security Settings</h3>
                                    <div className="space-y-6 max-w-2xl">
                                        <div className="p-6 bg-gray-50 rounded-lg">
                                            <h4 className="font-semibold text-gray-900 mb-2">Change Password</h4>
                                            <p className="text-sm text-gray-600 mb-4">Update your password to keep your account secure</p>
                                            <button className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl">
                                                Change Password
                                            </button>
                                        </div>
                                        <div className="p-6 bg-gray-50 rounded-lg">
                                            <h4 className="font-semibold text-gray-900 mb-2">Two-Factor Authentication</h4>
                                            <p className="text-sm text-gray-600 mb-4">Add an extra layer of security to your account</p>
                                            <button className="px-6 py-3 bg-white border-2 border-indigo-600 text-indigo-600 font-semibold rounded-lg hover:bg-indigo-50 transition-all duration-200 shadow-md hover:shadow-lg">
                                                Enable 2FA
                                            </button>
                                        </div>
                                        <div className="p-6 bg-gray-50 rounded-lg">
                                            <h4 className="font-semibold text-gray-900 mb-2">Active Sessions</h4>
                                            <p className="text-sm text-gray-600 mb-4">Manage your active login sessions</p>
                                            <button className="px-6 py-3 bg-white border-2 border-indigo-600 text-indigo-600 font-semibold rounded-lg hover:bg-indigo-50 transition-all duration-200 shadow-md hover:shadow-lg">
                                                View Sessions
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
