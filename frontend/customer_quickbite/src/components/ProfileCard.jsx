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
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex justify-end z-[100]">
      <div
        onMouseLeave={onClose}
        className="w-full max-w-md bg-white shadow-2xl h-full transform transition-all duration-500 translate-x-0 animate-slide-in flex flex-col border-l border-gray-100"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">My Profile</h2>
            <p className="text-sm text-gray-500">Manage your account details</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white shadow-sm hover:bg-gray-100 transition border border-gray-200 group"
          >
            <X className="w-5 h-5 text-gray-500 group-hover:text-red-500 transition-colors" />
          </button>
        </div>

        {/* Profile Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {!editMode ? (
            <>
              {/* Avatar */}
              <div className="flex flex-col items-center justify-center pb-6 border-b border-gray-100">
                <div className="w-24 h-24 bg-gradient-to-br from-[#FC8019] to-[#E23744] rounded-full flex items-center justify-center text-white font-bold text-3xl shadow-lg mb-4 ring-4 ring-orange-50">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <h3 className="text-xl font-bold text-gray-900">{user?.name}</h3>
                <span className="px-3 py-1 bg-orange-100 text-[#FC8019] text-xs font-bold rounded-full mt-2 uppercase tracking-wide">
                  {user?.role || "Customer"}
                </span>
              </div>

              {/* Info */}
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-blue-500">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase">Email Address</p>
                    <p className="text-gray-900 font-medium">{user?.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-green-500">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase">Phone Number</p>
                    <p className="text-gray-900 font-medium">{user?.phone || "Not provided"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-purple-500 shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase">Delivery Address</p>
                    <p className="text-gray-900 font-medium leading-relaxed">
                      {user?.address?.[0]?.line1 ? (
                        <>
                          {user?.address?.[0]?.line1}, <br />
                          {user?.address?.[0]?.city} - {user?.address?.[0]?.pincode}
                        </>
                      ) : "No address added"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 space-y-3">
                <button
                  onClick={() => setEditMode(true)}
                  className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white font-semibold py-3 rounded-xl hover:bg-gray-800 transition shadow-lg hover:shadow-xl"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit Profile
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 border border-red-200 text-red-600 font-semibold py-3 rounded-xl hover:bg-red-50 transition"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="pl-10 w-full border rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm py-3 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="pl-10 w-full border rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm py-3 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
                    Address
                  </label>
                  <input
                    type="text"
                    name="line1"
                    value={formData.line1}
                    onChange={handleChange}
                    placeholder="Street / Area"
                    className="w-full border rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm py-3 px-4 mb-3 transition-all"
                  />
                  <div className="flex gap-3">
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="City"
                      className="flex-1 border rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm py-3 px-4 transition-all"
                    />
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      placeholder="Pincode"
                      className="w-32 border rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm py-3 px-4 transition-all"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-6">
                  <button
                    type="button"
                    onClick={() => setEditMode(false)}
                    className="flex-1 border border-gray-200 rounded-xl py-3 text-gray-700 font-semibold hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 bg-gradient-to-r from-[#FC8019] to-[#E23744] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:shadow-lg hover:opacity-90 transition transform active:scale-95"
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
                <div className={`p-3 rounded-lg text-center text-sm font-medium ${message.includes("success") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
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
