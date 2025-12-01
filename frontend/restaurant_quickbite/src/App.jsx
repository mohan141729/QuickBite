import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

// Lazy load pages
const LandingPage = lazy(() => import("./pages/LandingPage"));
const SignIn = lazy(() => import("./pages/SignIn"));
const SignUp = lazy(() => import("./pages/SignUp"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const RestaurantDashboard = lazy(() => import("./pages/RestaurantDashboard"));

// Loading Fallback
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
  </div>
);

const App = () => (
  <Suspense fallback={<PageLoader />}>
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />

      {/* Clerk Authentication Routes */}
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/sign-up/*" element={<SignUp />} />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/restaurant-dashboard/:id"
        element={
          <ProtectedRoute>
            <RestaurantDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  </Suspense>
);

export default App;
