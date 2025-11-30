import { useState } from 'react';
import TopBar from '../components/TopBar';
import { Settings as SettingsIcon, User, Bell, Shield, Globe, Save } from 'lucide-react';
import { useUser, useClerk } from '@clerk/clerk-react';

import { toast } from 'react-hot-toast';

const Settings = () => {
    const { user } = useUser();
    const { openUserProfile } = useClerk();
    const [activeTab, setActiveTab] = useState('profile');

    // Profile settings
    const [profileData, setProfileData] = useState({
        name: user?.fullName || '',
        email: user?.primaryEmailAddress?.emailAddress || '',
        phone: user?.primaryPhoneNumber?.phoneNumber || '',
        role: 'admin'
    });

    // Platform settings (Persisted to localStorage)
    const [platformSettings, setPlatformSettings] = useState(() => {
        const saved = localStorage.getItem('platformSettings');
        return saved ? JSON.parse(saved) : {
            siteName: 'QuickBite',
            supportEmail: 'support@quickbite.com',
            currency: 'INR',
            timezone: 'Asia/Kolkata',
            maintenanceMode: false
        };
    });

    // Notification settings (Persisted to localStorage)
    const [notificationSettings, setNotificationSettings] = useState(() => {
        const saved = localStorage.getItem('notificationSettings');
        return saved ? JSON.parse(saved) : {
            emailNotifications: true,
            orderAlerts: true,
            newUserAlerts: true,
            restaurantApprovalAlerts: true,
            deliveryPartnerAlerts: true
        };
    });

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            const [firstName, ...lastNameParts] = profileData.name.split(' ');
            const lastName = lastNameParts.join(' ');
            await user.update({
                firstName: firstName,
                lastName: lastName
            });
            toast.success('Profile updated successfully');
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Failed to update profile');
        }
    };

    const handlePlatformUpdate = (e) => {
        e.preventDefault();
        localStorage.setItem('platformSettings', JSON.stringify(platformSettings));
        toast.success('Platform settings saved');
    };

    const handleNotificationUpdate = (e) => {
        e.preventDefault();
        localStorage.setItem('notificationSettings', JSON.stringify(notificationSettings));
        toast.success('Notification preferences saved');
    };

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'platform', label: 'Platform', icon: Globe },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'security', label: 'Security', icon: Shield }
    ];

    return (
        <div className="flex-1 bg-slate-50 min-h-screen">
            <TopBar title="Settings" />

            <div className="pt-24 px-8 pb-12 animate-fade-in">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                                <SettingsIcon className="w-6 h-6" />
                            </div>
                            Settings
                        </h2>
                        <p className="text-slate-500 mt-1 ml-11">Manage your admin account and platform settings</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="card-premium mb-8 overflow-hidden">
                    <div className="border-b border-slate-100 bg-slate-50/50">
                        <div className="flex gap-2 p-2">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${activeTab === tab.id
                                            ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200'
                                            : 'text-slate-600 hover:bg-white/60 hover:text-slate-900'
                                            }`}
                                    >
                                        <Icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-indigo-600' : 'text-slate-400'}`} />
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
                            <div className="animate-fade-in">
                                <h3 className="text-xl font-bold text-slate-800 mb-6">Profile Information</h3>
                                <form onSubmit={handleProfileUpdate} className="space-y-6 max-w-2xl">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                Full Name
                                            </label>
                                            <input
                                                type="text"
                                                value={profileData.name}
                                                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                Email Address
                                            </label>
                                            <input
                                                type="email"
                                                value={profileData.email}
                                                disabled
                                                className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed"
                                                title="Managed via Clerk"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                Phone Number
                                            </label>
                                            <input
                                                type="tel"
                                                value={profileData.phone}
                                                disabled
                                                className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed"
                                                title="Managed via Clerk"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                Role
                                            </label>
                                            <input
                                                type="text"
                                                value={profileData.role}
                                                disabled
                                                className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all duration-200 shadow-lg shadow-indigo-500/30 flex items-center gap-2"
                                    >
                                        <Save className="w-5 h-5" />
                                        Save Changes
                                    </button>
                                </form>
                            </div>
                        )}

                        {/* Platform Tab */}
                        {activeTab === 'platform' && (
                            <div className="animate-fade-in">
                                <h3 className="text-xl font-bold text-slate-800 mb-6">Platform Settings</h3>
                                <form onSubmit={handlePlatformUpdate} className="space-y-6 max-w-2xl">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                Site Name
                                            </label>
                                            <input
                                                type="text"
                                                value={platformSettings.siteName}
                                                onChange={(e) => setPlatformSettings({ ...platformSettings, siteName: e.target.value })}
                                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                Support Email
                                            </label>
                                            <input
                                                type="email"
                                                value={platformSettings.supportEmail}
                                                onChange={(e) => setPlatformSettings({ ...platformSettings, supportEmail: e.target.value })}
                                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                Currency
                                            </label>
                                            <select
                                                value={platformSettings.currency}
                                                onChange={(e) => setPlatformSettings({ ...platformSettings, currency: e.target.value })}
                                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                                            >
                                                <option value="INR">INR (₹)</option>
                                                <option value="USD">USD ($)</option>
                                                <option value="EUR">EUR (€)</option>
                                                <option value="GBP">GBP (£)</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                Timezone
                                            </label>
                                            <select
                                                value={platformSettings.timezone}
                                                onChange={(e) => setPlatformSettings({ ...platformSettings, timezone: e.target.value })}
                                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                                            >
                                                <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                                                <option value="America/New_York">America/New_York (EST)</option>
                                                <option value="Europe/London">Europe/London (GMT)</option>
                                                <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                                        <input
                                            type="checkbox"
                                            id="maintenance"
                                            checked={platformSettings.maintenanceMode}
                                            onChange={(e) => setPlatformSettings({ ...platformSettings, maintenanceMode: e.target.checked })}
                                            className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                                        />
                                        <label htmlFor="maintenance" className="text-sm font-medium text-slate-700">
                                            Enable Maintenance Mode
                                        </label>
                                    </div>
                                    <button
                                        type="submit"
                                        className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all duration-200 shadow-lg shadow-indigo-500/30 flex items-center gap-2"
                                    >
                                        <Save className="w-5 h-5" />
                                        Save Changes
                                    </button>
                                </form>
                            </div>
                        )}

                        {/* Notifications Tab */}
                        {activeTab === 'notifications' && (
                            <div className="animate-fade-in">
                                <h3 className="text-xl font-bold text-slate-800 mb-6">Notification Preferences</h3>
                                <form onSubmit={handleNotificationUpdate} className="space-y-4 max-w-2xl">
                                    <div className="space-y-4">
                                        {[
                                            { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive email notifications for important events' },
                                            { key: 'orderAlerts', label: 'Order Alerts', description: 'Get notified when new orders are placed' },
                                            { key: 'newUserAlerts', label: 'New User Alerts', description: 'Receive alerts when new users register' },
                                            { key: 'restaurantApprovalAlerts', label: 'Restaurant Approval Alerts', description: 'Get notified when restaurants need approval' },
                                            { key: 'deliveryPartnerAlerts', label: 'Delivery Partner Alerts', description: 'Receive alerts for new delivery partner registrations' }
                                        ].map((item) => (
                                            <div key={item.key} className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-indigo-100 transition-colors">
                                                <input
                                                    type="checkbox"
                                                    id={item.key}
                                                    checked={notificationSettings[item.key]}
                                                    onChange={(e) => setNotificationSettings({ ...notificationSettings, [item.key]: e.target.checked })}
                                                    className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500 mt-0.5"
                                                />
                                                <div>
                                                    <label htmlFor={item.key} className="block text-sm font-semibold text-slate-800">
                                                        {item.label}
                                                    </label>
                                                    <p className="text-sm text-slate-500 mt-1">{item.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        type="submit"
                                        className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all duration-200 shadow-lg shadow-indigo-500/30 flex items-center gap-2"
                                    >
                                        <Save className="w-5 h-5" />
                                        Save Preferences
                                    </button>
                                </form>
                            </div>
                        )}

                        {/* Security Tab */}
                        {activeTab === 'security' && (
                            <div className="animate-fade-in">
                                <h3 className="text-xl font-bold text-slate-800 mb-6">Security Settings</h3>
                                <div className="space-y-6 max-w-2xl">
                                    <div className="p-6 bg-slate-50 rounded-xl border border-slate-100">
                                        <h4 className="font-semibold text-slate-800 mb-2">Change Password</h4>
                                        <p className="text-sm text-slate-500 mb-4">Update your password to keep your account secure</p>
                                        <button
                                            onClick={() => openUserProfile({ initialPage: 'security' })}
                                            className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all duration-200 shadow-lg shadow-indigo-500/30"
                                        >
                                            Change Password
                                        </button>
                                    </div>
                                    <div className="p-6 bg-slate-50 rounded-xl border border-slate-100">
                                        <h4 className="font-semibold text-slate-800 mb-2">Two-Factor Authentication</h4>
                                        <p className="text-sm text-slate-500 mb-4">Add an extra layer of security to your account</p>
                                        <button
                                            onClick={() => openUserProfile({ initialPage: 'security' })}
                                            className="px-6 py-3 bg-white border border-indigo-200 text-indigo-600 font-semibold rounded-xl hover:bg-indigo-50 transition-all duration-200 shadow-sm"
                                        >
                                            Enable 2FA
                                        </button>
                                    </div>
                                    <div className="p-6 bg-slate-50 rounded-xl border border-slate-100">
                                        <h4 className="font-semibold text-slate-800 mb-2">Active Sessions</h4>
                                        <p className="text-sm text-slate-500 mb-4">Manage your active login sessions</p>
                                        <button
                                            onClick={() => openUserProfile({ initialPage: 'security' })}
                                            className="px-6 py-3 bg-white border border-indigo-200 text-indigo-600 font-semibold rounded-xl hover:bg-indigo-50 transition-all duration-200 shadow-sm"
                                        >
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
    );
};

export default Settings;
