import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import RestaurantDashboard from "./pages/RestaurantDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => (
  <Routes>
    {/* Public Routes */}
    <Route path="/" element={<LandingPage />} />

    {/* Clerk Authentication Routes */}
    <Route path="/sign-in" element={<SignIn />} />
    <Route path="/sign-up" element={<SignUp />} />

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
);

export default App;
