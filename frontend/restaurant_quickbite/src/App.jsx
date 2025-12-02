import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import ProtectedRoute from "./components/ProtectedRoute";
import { Loader2 } from "lucide-react";

import LogoLoader from "./components/LogoLoader";
import { useAuth } from "./context/AuthContext";

// Lazy load pages
const LandingPage = lazy(() => import("./pages/LandingPage"));
const SignIn = lazy(() => import("./pages/SignIn"));
const SignUp = lazy(() => import("./pages/SignUp"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const RestaurantDashboard = lazy(() => import("./pages/RestaurantDashboard"));

function App() {
  const { loading } = useAuth();

  if (loading) {
    return <LogoLoader />;
  }

  return (
    <Suspense fallback={<LogoLoader />}>
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
}

export default App;
