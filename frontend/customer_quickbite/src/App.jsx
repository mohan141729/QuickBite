import { Routes, Route, Navigate } from "react-router-dom"
import { lazy, Suspense } from "react"
import ProtectedRoute from "./components/ProtectedRoute"
import SupportButton from "./components/SupportButton"
import LoadingScreen from "./components/LoadingScreen"

// Lazy load pages
const HomePage = lazy(() => import("./pages/HomePage"))
const Restaurants = lazy(() => import("./pages/Restaurants"))
const RestaurantPage = lazy(() => import("./pages/RestaurantPage"))
const SignInPage = lazy(() => import("./pages/auth/SignIn"))
const SignUpPage = lazy(() => import("./pages/auth/SignUp"))
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"))
const OrderSuccess = lazy(() => import("./pages/OrderSuccess"))
const OrdersPage = lazy(() => import("./pages/OrdersPage"))
const FavoritesPage = lazy(() => import("./pages/FavoritesPage"))
const HelpPage = lazy(() => import("./pages/HelpPage"))
const FAQPage = lazy(() => import("./pages/FAQPage"))

const App = () => {
  return (
    <>
      <Suspense fallback={<LoadingScreen />}>
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
      </Suspense>
      <SupportButton />
    </>
  )
}

export default App
