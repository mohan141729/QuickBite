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

    const isAdmin = user.publicMetadata?.role === 'admin';
    const isMainAdmin = userEmail?.toLowerCase() === MAIN_ADMIN_EMAIL.toLowerCase();

    if (!isAdmin && !isMainAdmin) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
                    <p className="text-gray-600 mb-6">
                        The account <span className="font-semibold text-gray-900">{userEmail}</span> does not have administrator privileges.
                    </p>
                    <div className="space-y-3">
                        <button
                            onClick={() => signOut(() => navigate('/login'))}
                            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium"
                        >
                            Sign in with different account
                        </button>
                        <button
                            onClick={() => navigate('/')}
                            className="w-full px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors font-medium"
                        >
                            Go to Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return children;
};

export default ProtectedRoute;
