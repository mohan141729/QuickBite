import React, { useState } from "react"
import { X, Edit3, Save, Loader2, MapPin, Mail, Phone, User, Camera, ChevronRight } from "lucide-react"
import { useAuth } from "../context/AuthContext"

const ProfileCard = ({ onClose }) => {
  const { user, updateProfile } = useAuth()
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
      setTimeout(() => {
        setMessage("")
        setEditMode(false)
      }, 1500)
    } catch (error) {
      console.error("Profile update failed:", error)
      setMessage("Failed to update profile.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-end z-[100] transition-opacity duration-300">
      <div className="w-full max-w-md bg-white shadow-2xl h-full transform transition-transform duration-500 translate-x-0 animate-slide-in flex flex-col">

        {/* Header with Gradient */}
        <div className="relative h-32 bg-gradient-to-r from-orange-500 to-red-600">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full text-white transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="absolute -bottom-10 left-6">
            <div className="w-24 h-24 rounded-full border-4 border-white bg-white shadow-lg flex items-center justify-center overflow-hidden relative group">
              {user?.image ? (
                <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center text-orange-600 font-bold text-3xl">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                <Camera className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="flex-1 overflow-y-auto pt-12 px-6 pb-6 space-y-6">

          {/* User Name & Role */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 text-xs font-semibold uppercase tracking-wide border border-orange-200">
                {user?.role || "Delivery Partner"}
              </span>
              <span className="text-sm text-gray-500">•</span>
              <span className="text-sm text-gray-500">Active since {new Date().getFullYear()}</span>
            </div>
          </div>

          {!editMode ? (
            <div className="space-y-6 animate-fade-in">
              {/* Contact Info Card */}
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 space-y-4">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-2">Contact Details</h3>

                <div className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-gray-400 group-hover:text-orange-500 transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-400 font-medium">Email Address</p>
                    <p className="text-sm text-gray-900 font-medium">{user?.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-gray-400 group-hover:text-orange-500 transition-colors">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-400 font-medium">Phone Number</p>
                    <p className="text-sm text-gray-900 font-medium">{user?.phone || "Not provided"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-gray-400 group-hover:text-orange-500 transition-colors mt-1">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-400 font-medium">Address</p>
                    <p className="text-sm text-gray-900 font-medium leading-relaxed">
                      {user?.address?.[0] ? (
                        <>
                          {user.address[0].line1}<br />
                          {user.address[0].city} - {user.address[0].pincode}
                        </>
                      ) : (
                        <span className="text-gray-400 italic">Address not set</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Stats Summary (Placeholder) */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 text-center">
                  <p className="text-2xl font-bold text-orange-600">4.8</p>
                  <p className="text-xs text-orange-800 font-medium mt-1">Average Rating</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-center">
                  <p className="text-2xl font-bold text-blue-600">120+</p>
                  <p className="text-xs text-blue-800 font-medium mt-1">Total Deliveries</p>
                </div>
              </div>

              {/* Edit Button */}
              <button
                onClick={() => setEditMode(true)}
                className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white font-semibold py-3.5 rounded-xl hover:bg-gray-800 transition-all shadow-lg shadow-gray-900/20 hover:shadow-gray-900/30 transform hover:-translate-y-0.5"
              >
                <Edit3 className="w-4 h-4" />
                Edit Profile
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 animate-fade-in">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="pl-10 w-full bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm py-3 transition-all outline-none"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="pl-10 w-full bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm py-3 transition-all outline-none"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Address Details
                  </label>
                  <div className="space-y-3">
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        name="line1"
                        value={formData.line1}
                        onChange={handleChange}
                        placeholder="Street Address / Area"
                        className="pl-10 w-full bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm py-3 transition-all outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="City"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm py-3 px-4 transition-all outline-none"
                      />
                      <input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                        placeholder="Pincode"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm py-3 px-4 transition-all outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditMode(false)}
                  className="flex-1 bg-white border border-gray-200 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-orange-500/30 transition-all disabled:opacity-70"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" /> Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {message && (
            <div className={`p-4 rounded-xl text-center text-sm font-medium animate-fade-in ${message.includes("failed") ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}>
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProfileCard
