import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';

// Pages
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Restaurants from './pages/Restaurants';
import DeliveryPartners from './pages/DeliveryPartners';
import Orders from './pages/Orders';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';

// Layout wrapper for authenticated pages
const AdminLayout = ({ children }) => {
    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1">
                {children}
            </div>
        </div>
    );
};

function App() {
    return (
        <AuthProvider>
            <Routes>
                {/* Public Route */}
                <Route path="/login" element={<LoginPage />} />

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
        </AuthProvider>
    );
}

export default App;
