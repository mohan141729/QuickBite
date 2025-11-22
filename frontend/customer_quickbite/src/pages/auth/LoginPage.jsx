import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ArrowLeft, Mail, Lock, Eye, EyeOff } from "lucide-react"
import { useAuth } from "../../context/AuthContext"

const LoginPage = () => {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ email: "", password: "" })
  const [showPassword, setShowPassword] = useState(false)

  // ✅ Update form data
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  // ✅ Handle login API call
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await login(form)
      navigate("/")
    } catch (err) {
      console.error("Login failed:", err)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <Link to="/" className="inline-flex items-center text-orange-600 hover:text-orange-700 mb-8">
          <ArrowLeft className="w-5 h-5 mr-1" />
          Back
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">QB</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">QuickBite</h1>
          </div>
          <p className="text-gray-600">Welcome back! Sign in to your account</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg border shadow-sm p-6 space-y-4">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                className="pl-10 w-full h-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <Link
                to="/auth/forgot-password"
                className="text-sm text-orange-600 hover:text-orange-700 font-medium"
              >
                Forgot?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                className="pl-10 pr-10 w-full h-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-lg h-11 font-semibold transition"
          >
            Sign In
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">OR</span>
          </div>
        </div>

        {/* Social Buttons */}
        <div className="space-y-3">
          <button className="w-full h-11 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium bg-transparent">
            Continue with Google
          </button>
          <button className="w-full h-11 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium bg-transparent">
            Continue with Apple
          </button>
        </div>

        {/* Sign Up Link */}
        <p className="text-center text-gray-600 mt-8">
          Don't have an account?{" "}
          <Link to="/register" className="text-orange-600 hover:text-orange-700 font-semibold">
            Sign Up
          </Link>
        </p>

        {/* Footer Note */}
        <p className="text-xs text-gray-500 text-center mt-6">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  )
}

export default LoginPage
