import React, { useState } from "react"
import { X, Edit3, Save, Loader2, MapPin, Mail, Phone, User, LogOut } from "lucide-react"
import { useAuth } from "../context/AuthContext"

const ProfileCard = ({ onClose }) => {
  const { user, updateProfile, logout } = useAuth()
  const [editMode, setEditMode] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    line1: user?.address?.[0]?.line1 || "",
    city: user?.address?.[0]?.city || "",
    pincode: user?.address?.[0]?.pincode || "",
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        name: formData.name,
        phone: formData.phone,
        address: [
          {
            line1: formData.line1,
            city: formData.city,
            pincode: formData.pincode,
          },
        ],
      }

      const res = await updateProfile(payload)
      setMessage(res.message || "Profile updated successfully!")
      setEditMode(false)
    } catch (error) {
      console.error("Profile update failed:", error)
      setMessage("Failed to update profile.")
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      window.location.href = "/login"
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }


  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-end z-[1000] transition-opacity duration-300">
      <div
        className="w-full max-w-md bg-white shadow-2xl h-full transform transition-transform duration-500 translate-x-0 animate-slide-in flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-white sticky top-0 z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Profile</h2>
            <p className="text-sm text-gray-500 font-medium">Manage your account</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-all active:scale-95"
            aria-label="Close profile"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Profile Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          {!editMode ? (
            <>
              {/* Avatar Section */}
              <div className="flex flex-col items-center">
                <div className="relative group">
                  <div className="w-28 h-28 bg-gradient-to-br from-[#FC8019] to-[#E23744] rounded-full flex items-center justify-center text-white font-bold text-4xl shadow-xl ring-4 ring-white mb-4 transform group-hover:scale-105 transition-transform duration-300">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="absolute bottom-4 right-0 bg-green-500 w-5 h-5 rounded-full border-4 border-white"></div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{user?.name}</h3>
                <span className="px-4 py-1.5 bg-orange-50 text-[#FC8019] text-xs font-bold rounded-full mt-2 uppercase tracking-wider border border-orange-100">
                  {user?.role || "Customer"}
                </span>
              </div>

              {/* Info Cards */}
              <div className="space-y-4">
                <div className="group p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:border-orange-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Email Address</p>
                      <p className="text-gray-900 font-medium text-base">{user?.email}</p>
                    </div>
                  </div>
                </div>

                <div className="group p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:border-orange-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Phone Number</p>
                      <p className="text-gray-900 font-medium text-base">{user?.phone || "Not provided"}</p>
                    </div>
                  </div>
                </div>

                <div className="group p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:border-orange-100">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 shrink-0 group-hover:scale-110 transition-transform">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Delivery Address</p>
                      <p className="text-gray-900 font-medium text-base leading-relaxed">
                        {user?.address?.[0]?.line1 ? (
                          <>
                            {user?.address?.[0]?.line1}, <br />
                            <span className="text-gray-500 text-sm">{user?.address?.[0]?.city} - {user?.address?.[0]?.pincode}</span>
                          </>
                        ) : "No address added"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 space-y-3">
                <button
                  onClick={() => setEditMode(true)}
                  className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white font-semibold py-3.5 rounded-xl hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit Profile
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={onClose}
                    className="flex items-center justify-center gap-2 border border-gray-200 text-gray-700 font-semibold py-3.5 rounded-xl hover:bg-gray-50 transition-all active:scale-[0.98]"
                  >
                    Close
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 border border-red-100 bg-red-50 text-red-600 font-semibold py-3.5 rounded-xl hover:bg-red-100 transition-all active:scale-[0.98]"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">
                    Full Name
                  </label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#FC8019] transition-colors" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="pl-12 w-full border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-[#FC8019] text-gray-900 text-sm py-3.5 transition-all outline-none"
                      placeholder="Enter your name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">
                    Phone Number
                  </label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#FC8019] transition-colors" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="pl-12 w-full border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-[#FC8019] text-gray-900 text-sm py-3.5 transition-all outline-none"
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">
                    Address Details
                  </label>
                  <div className="space-y-3">
                    <input
                      type="text"
                      name="line1"
                      value={formData.line1}
                      onChange={handleChange}
                      placeholder="Street Address / Area"
                      className="w-full border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-[#FC8019] text-gray-900 text-sm py-3.5 px-4 transition-all outline-none"
                    />
                    <div className="flex gap-3">
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="City"
                        className="flex-1 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-[#FC8019] text-gray-900 text-sm py-3.5 px-4 transition-all outline-none"
                      />
                      <input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                        placeholder="Pincode"
                        className="w-32 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-[#FC8019] text-gray-900 text-sm py-3.5 px-4 transition-all outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setEditMode(false)}
                    className="flex-1 border border-gray-200 rounded-xl py-3.5 text-gray-700 font-semibold hover:bg-gray-50 transition active:scale-[0.98]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 bg-gradient-to-r from-[#FC8019] to-[#E23744] text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:shadow-lg hover:opacity-90 transition transform active:scale-[0.98]"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" /> Saving
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" /> Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>

              {message && (
                <div className={`p-4 rounded-xl text-center text-sm font-medium animate-fade-in ${message.includes("success") ? "bg-green-50 text-green-700 border border-green-100" : "bg-red-50 text-red-700 border border-red-100"}`}>
                  {message}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProfileCard
