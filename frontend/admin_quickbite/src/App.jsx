import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import { useAuth, useUser } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';
import api from './api/axios';
import { Toaster } from 'react-hot-toast';

// Pages
import SignInPage from './pages/SignInPage';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Restaurants from './pages/Restaurants';
import DeliveryPartners from './pages/DeliveryPartners';
import Orders from './pages/Orders';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Coupons from './pages/Coupons';
import Categories from './pages/Categories';
import IncentivesPage from './pages/IncentivesPage';
import LogoLoader from './components/LogoLoader';

// Layout wrapper for authenticated pages
const AdminLayout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden glass-dark"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="flex-1 ml-0 md:ml-64 transition-all duration-300">
                <TopBar onMenuClick={() => setSidebarOpen(true)} />
                {children}
            </div>
        </div>
    );
};

function App() {
    const { getToken } = useAuth();
    const { user, isLoaded } = useUser();
    const navigate = useNavigate();
    const [isReady, setIsReady] = useState(false);

    // Sync user with backend on login
    useEffect(() => {
        if (!isLoaded) return;

        if (!user) {
            setIsReady(true);
            return;
        }

        const syncUser = async () => {
            try {
                const token = await getToken();
                if (token) {
                    const response = await api.get('/auth/sync', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    console.log('✅ Admin user synced with MongoDB:', response.data);
                }
            } catch (error) {
                console.error('❌ Failed to sync admin user:', error);
            } finally {
                setIsReady(true);
            }
        };

        syncUser();
    }, [isLoaded, user, getToken]);


    if (!isReady && user) {
        return <LogoLoader />;
    }

    return (
        <>
            <Toaster position="top-right" />
            <Routes>
                {/* Public Route */}
                <Route path="/login" element={<SignInPage />} />

                {/* Protected Admin Routes */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <AdminLayout>
                                <Dashboard />
                            </AdminLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/users"
                    element={
                        <ProtectedRoute>
                            <AdminLayout>
                                <Users />
                            </AdminLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/restaurants"
                    element={
                        <ProtectedRoute>
                            <AdminLayout>
                                <Restaurants />
                            </AdminLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/delivery-partners"
                    element={
                        <ProtectedRoute>
                            <AdminLayout>
                                <DeliveryPartners />
                            </AdminLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/orders"
                    element={
                        <ProtectedRoute>
                            <AdminLayout>
                                <Orders />
                            </AdminLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/analytics"
                    element={
                        <ProtectedRoute>
                            <AdminLayout>
                                <Analytics />
                            </AdminLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/coupons"
                    element={
                        <ProtectedRoute>
                            <AdminLayout>
                                <Coupons />
                            </AdminLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/categories"
                    element={
                        <ProtectedRoute>
                            <AdminLayout>
                                <Categories />
                            </AdminLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/incentives"
                    element={
                        <ProtectedRoute>
                            <AdminLayout>
                                <IncentivesPage />
                            </AdminLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/settings"
                    element={
                        <ProtectedRoute>
                            <AdminLayout>
                                <Settings />
                            </AdminLayout>
                        </ProtectedRoute>
                    }
                />

                {/* Default Redirect */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </>
    );
}

export default App;
