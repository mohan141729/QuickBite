import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Assuming you have this context

const ProtectedRoute = ({ children, role }) => {
  const { user } = useAuth();

  // Not logged in → redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Role-based access (optional)
  if (role && user.role !== role) {
    return <Navigate to="/dashboard" replace />; // redirect to dashboard if wrong role
  }

  return children;
};

export default ProtectedRoute;
