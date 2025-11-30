import { Navigate, useNavigate } from 'react-router-dom';
import { useUser, useClerk } from '@clerk/clerk-react';

const ProtectedRoute = ({ children }) => {
    const { isLoaded, isSignedIn, user } = useUser();
    const { signOut } = useClerk();
    const navigate = useNavigate();

    if (!isLoaded) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!isSignedIn) {
        return <Navigate to="/login" replace />;
    }

    // Enforce admin role
    // Failsafe: Always allow the main admin email even if metadata is missing/incorrect temporarily
    const MAIN_ADMIN_EMAIL = 'mohan141729@gmail.com';
    const userEmail = user?.primaryEmailAddress?.emailAddress;

    if (user.publicMetadata?.role !== 'admin' && userEmail !== MAIN_ADMIN_EMAIL) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
                <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
                <p className="text-gray-600 mb-4">You do not have permission to access the admin dashboard.</p>
                <button
                    onClick={() => signOut(() => navigate('/login'))}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    Back to Login
                </button>
            </div>
        );
    }

    return children;
};

export default ProtectedRoute;
