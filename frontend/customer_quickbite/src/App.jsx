import { Routes, Route } from "react-router-dom"
import HomePage from "./pages/HomePage"
import Restaurants from "./pages/Restaurants"
import RestaurantPage from "./pages/RestaurantPage"
import LoginPage from "./pages/auth/LoginPage"
import RegisterPage from "./pages/auth/RegisterPage"
import CheckoutPage from "./pages/CheckoutPage"
import OrderSuccess from "./pages/OrderSuccess"
import OrdersPage from "./pages/OrdersPage"
import ProtectedRoute from "./components/ProtectedRoute"

const App = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/restaurants" element={<Restaurants />} />
      <Route path="/restaurant/:id" element={<RestaurantPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected Routes */}
      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <CheckoutPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <OrdersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/order-success"
        element={
          <ProtectedRoute>
            <OrderSuccess />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default App
