import React from "react";
import { Navigate } from "react-router-dom";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { useAuth } from "../context/AuthContext";

/**
 * ProtectedRoute using Clerk authentication
 * Redirects to /sign-in if user is not authenticated
 * Optionally checks for specific roles
 */
const ProtectedRoute = ({ children, role }) => {
  const { user } = useAuth();

  return (
    <>
      <SignedIn>
        {/* User is signed in */}
        {role && user?.role !== role ? (
          // Wrong role - Show Access Denied
          <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
            <div className="bg-white p-8 rounded-lg shadow-xl text-center max-w-md">
              <h1 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h1>
              <p className="text-gray-600 mb-4">
                You need the <span className="font-bold">{role}</span> role to access this page.
              </p>
              <p className="text-sm text-gray-500">
                Current role: {user?.role || 'None'}
              </p>
            </div>
          </div>
        ) : (
          // Correct role or no role requirement
          children
        )}
      </SignedIn>
      <SignedOut>
        {/* User is not signed in - redirect to sign-in */}
        <Navigate to="/sign-in" replace />
      </SignedOut>
    </>
  );
};

export default ProtectedRoute;
