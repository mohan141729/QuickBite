import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Enforce delivery_partner role
    if (user.role !== 'delivery_partner' && user.publicMetadata?.role !== 'delivery_partner') {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
                    <p className="text-gray-600 mb-6">
                        You do not have permission to access the Delivery Partner portal.
                        Your current role is: <span className="font-semibold">{user.role || user.publicMetadata?.role || 'Unknown'}</span>
                    </p>
                    <p className="text-sm text-gray-500 mb-6">
                        Please sign in with a Delivery Partner account.
                    </p>
                    {/* We can't easily redirect to other portals as they are different apps/ports */}
                </div>
            </div>
        );
    }

    return children;
};

export default ProtectedRoute;
