import React, { useState } from "react"
import { MapPin, X, PlusCircle, Loader2, Check, Trash2 } from "lucide-react"
import { useAuth } from "../context/AuthContext"

const DeliveryLocationCard = ({ onClose }) => {
  const { user, updateProfile } = useAuth()

  const [addingNew, setAddingNew] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deletingIndex, setDeletingIndex] = useState(null)

  const [newAddress, setNewAddress] = useState({
    line1: "",
    city: "",
    pincode: "",
  })

  // ✅ Select an existing address as active
  const handleSelectAddress = async (index) => {
    try {
      setSaving(true)


      const selected = user.address[index]
      const updatedAddresses = [
        selected,
        ...user.address.filter((_, i) => i !== index),
      ]

      await updateProfile({ address: updatedAddresses })
      onClose()
    } catch (error) {
      console.error("Failed to select address:", error)
    } finally {
      setSaving(false)
    }
  }

  // ✅ Add a new address
  const handleAddAddress = async () => {
    if (!newAddress.line1 || !newAddress.city || !newAddress.pincode) return
    try {
      setSaving(true)
      const updatedAddresses = [...(user?.address || []), newAddress]
      await updateProfile({ address: updatedAddresses })
      onClose()
    } catch (error) {
      console.error("Failed to add new address:", error)
    } finally {
      setSaving(false)
    }
  }

  // ✅ Remove an address
  const handleRemoveAddress = async (index) => {
    try {
      setDeletingIndex(index)
      const updatedAddresses = user.address.filter((_, i) => i !== index)
      await updateProfile({ address: updatedAddresses })
    } catch (error) {
      console.error("Failed to remove address:", error)
    } finally {
      setDeletingIndex(null)
    }
  }

  return (
    <div className="w-full max-w-sm md:w-80 bg-white border border-gray-200 rounded-xl shadow-2xl animate-slide-in overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <h2 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-quickbite-orange" />
          Delivery Location
        </h2>
        <button
          onClick={onClose}
          className="p-1 rounded-full hover:bg-gray-100 transition"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {/* Body */}
      <div className="p-4 max-h-[55vh] overflow-y-auto space-y-3">
        {!addingNew ? (
          <>
            {user?.address?.length ? (
              user.address.map((addr, i) => (
                <div
                  key={i}
                  className={`p-3 border rounded-lg transition relative group ${i === 0
                    ? "border-quickbite-orange bg-quickbite-orange/5"
                    : "border-gray-200 hover:border-quickbite-orange/60"
                    }`}
                >
                  <div
                    onClick={() => handleSelectAddress(i)}
                    className="cursor-pointer"
                  >
                    <p className="font-medium text-gray-900 text-sm">{addr.line1}</p>
                    <p className="text-xs text-gray-500">
                      {addr.city} - {addr.pincode}
                    </p>
                  </div>

                  {/* Selected check */}
                  {i === 0 && (
                    <span className="absolute top-2 right-8 text-quickbite-orange">
                      <Check className="w-4 h-4" />
                    </span>
                  )}

                  {/* Delete button */}
                  <button
                    onClick={() => handleRemoveAddress(i)}
                    disabled={deletingIndex === i}
                    className="absolute top-2 right-2 p-1.5 rounded-full hover:bg-gray-100 text-gray-500 transition"
                    title="Remove address"
                  >
                    {deletingIndex === i ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-xs text-center">
                No saved addresses yet.
              </p>
            )}

            <button
              onClick={() => setAddingNew(true)}
              className="w-full flex items-center justify-center gap-2 mt-2 border border-quickbite-orange text-quickbite-orange py-1.5 rounded-lg hover:bg-quickbite-orange hover:text-white text-sm transition"
            >
              <PlusCircle className="w-4 h-4" />
              Add New Address
            </button>
          </>
        ) : (
          <>
            <h3 className="font-medium text-sm text-gray-700 mb-2">
              Add New Address
            </h3>
            <input
              type="text"
              placeholder="Street / Area"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-2 text-sm"
              value={newAddress.line1}
              onChange={(e) =>
                setNewAddress({ ...newAddress, line1: e.target.value })
              }
            />
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="City"
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                value={newAddress.city}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, city: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Pincode"
                className="w-28 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                value={newAddress.pincode}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, pincode: e.target.value })
                }
              />
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t flex gap-2">
        <button
          onClick={() => setAddingNew(false)}
          className="flex-1 border border-gray-300 rounded-lg py-1.5 text-sm hover:bg-gray-100 transition"
        >
          Cancel
        </button>
        <button
          onClick={addingNew ? handleAddAddress : onClose}
          disabled={saving}
          className="flex-1 bg-gradient-to-r from-[#FC8019] to-[#E23744] text-white font-semibold py-1.5 rounded-lg text-sm flex items-center justify-center gap-2 hover:opacity-90 transition"
        >
          {saving ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving
            </>
          ) : (
            addingNew ? "Save" : "Close"
          )}
        </button>
      </div>
    </div>
  )
}

export default DeliveryLocationCard
