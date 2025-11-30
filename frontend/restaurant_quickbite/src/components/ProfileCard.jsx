import React, { useState } from "react"
import { X, Edit3, Save, Loader2, MapPin, Mail, Phone, User } from "lucide-react"
import { useAuth } from "../context/AuthContext"
import { UpdateUserProfile } from "../api/profile"
import toast from "react-hot-toast"

const ProfileCard = ({ onClose }) => {
  const { user } = useAuth()
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
    setMessage("")
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

      await UpdateUserProfile(payload)
      toast.success("Profile updated successfully!")
      setMessage("Profile updated successfully!")
      setEditMode(false)

      // Reload to fetch updated user data
      setTimeout(() => window.location.reload(), 1000)
    } catch (error) {
      console.error("Profile update failed:", error)
      const errorMsg = error.response?.data?.message || "Failed to update profile."
      toast.error(errorMsg)
      setMessage(errorMsg)
    } finally {
      setSaving(false)
    }
  }


  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-end z-[100]">
      <div className="w-full max-w-md bg-white shadow-2xl h-full transform transition-all duration-500 translate-x-0 animate-slide-in flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">My Profile</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Profile Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {!editMode ? (
            <>
              {/* Avatar */}
              <div className="flex items-center gap-4 border-b pb-4">
                <div className="w-14 h-14 bg-gradient-to-r from-[#FC8019] to-[#E23744] rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{user?.name}</h3>
                  <p className="text-sm text-gray-500">{user?.role || "Customer"}</p>
                </div>
              </div>

              {/* Info */}
              <div className="space-y-3 text-gray-700">
                <p className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span>{user?.email}</span>
                </p>
                <p className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span>{user?.phone || "Not provided"}</span>
                </p>
                <p className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                  <span>
                    {user?.address?.[0]?.line1}, {user?.address?.[0]?.city} -{" "}
                    {user?.address?.[0]?.pincode}
                  </span>
                </p>
              </div>

              {/* Edit Button */}
              <div className="pt-6">
                <button
                  onClick={() => setEditMode(true)}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#FC8019] to-[#E23744] text-white font-semibold py-2 rounded-lg hover:opacity-90 transition"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit Profile
                </button>
              </div>
            </>
          ) : (
            <>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="pl-9 w-full border rounded-md border-gray-300 focus:ring-2 focus:ring-orange-500 text-sm py-2"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="pl-9 w-full border rounded-md border-gray-300 focus:ring-2 focus:ring-orange-500 text-sm py-2"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    name="line1"
                    value={formData.line1}
                    onChange={handleChange}
                    placeholder="Street / Area"
                    className="w-full border rounded-md border-gray-300 focus:ring-2 focus:ring-orange-500 text-sm py-2 px-3 mb-2"
                  />
                  <div className="flex gap-3">
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="City"
                      className="flex-1 border rounded-md border-gray-300 focus:ring-2 focus:ring-orange-500 text-sm py-2 px-3"
                    />
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      placeholder="Pincode"
                      className="w-32 border rounded-md border-gray-300 focus:ring-2 focus:ring-orange-500 text-sm py-2 px-3"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setEditMode(false)}
                    className="flex-1 border border-gray-300 rounded-lg py-2 text-gray-700 hover:bg-gray-100 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 bg-gradient-to-r from-[#FC8019] to-[#E23744] text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Saving
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" /> Save
                      </>
                    )}
                  </button>
                </div>
              </form>

              {message && (
                <p className="text-center text-sm text-green-600 pt-2">{message}</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProfileCard
