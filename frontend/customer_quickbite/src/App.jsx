import { Routes, Route, Navigate } from "react-router-dom"
import HomePage from "./pages/HomePage"
import Restaurants from "./pages/Restaurants"
import RestaurantPage from "./pages/RestaurantPage"
import SignInPage from "./pages/auth/SignIn"
import SignUpPage from "./pages/auth/SignUp"
import CheckoutPage from "./pages/CheckoutPage"
import OrderSuccess from "./pages/OrderSuccess"
import OrdersPage from "./pages/OrdersPage"
import FavoritesPage from "./pages/FavoritesPage"
import HelpPage from "./pages/HelpPage"
import FAQPage from "./pages/FAQPage"
import ProtectedRoute from "./components/ProtectedRoute"
import SupportButton from "./components/SupportButton"

const App = () => {
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/restaurants" element={<Restaurants />} />
        <Route path="/restaurant/:id" element={<RestaurantPage />} />
        <Route path="/login/*" element={<SignInPage />} />
        <Route path="/register/*" element={<SignUpPage />} />

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
          path="/favorites"
          element={
            <ProtectedRoute>
              <FavoritesPage />
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
        <Route path="/help" element={<HelpPage />} />
        <Route path="/faq" element={<FAQPage />} />
      </Routes>
      <SupportButton />
    </>
  )
}

export default App
