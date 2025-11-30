import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";

const EditRestaurantModal = ({ restaurant, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    cuisine: "",
    description: "",
    address: "",
    city: "",
    pincode: "",
    image: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!restaurant) return;
    setFormData({
      name: restaurant.name || "",
      cuisine: Array.isArray(restaurant.cuisine)
        ? restaurant.cuisine.join(", ")
        : restaurant.cuisine || "",
      description: restaurant.description || "",
      address: restaurant.location?.address || "",
      city: restaurant.location?.city || "",
      pincode: restaurant.location?.pincode || "",
      image: restaurant.image || "",
    });
  }, [restaurant]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave({
        ...formData,
        location: {
          address: formData.address,
          city: formData.city,
          pincode: formData.pincode,
        },
        cuisine: formData.cuisine.split(",").map(c => c.trim()).filter(Boolean),
      });
      toast.success("Restaurant updated!");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Update failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition"
        >
          <X size={20} />
        </button>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Edit Restaurant</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Restaurant Name" className="w-full border p-2 rounded-md" required />
          <input type="text" name="cuisine" value={formData.cuisine} onChange={handleChange} placeholder="Cuisine (comma separated)" className="w-full border p-2 rounded-md" />
          <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Address" className="w-full border p-2 rounded-md" />
          <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="City" className="w-full border p-2 rounded-md" />
          <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} placeholder="Pincode" className="w-full border p-2 rounded-md" />
          <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" className="w-full border p-2 rounded-md" rows="3" />
          <input type="text" name="image" value={formData.image} onChange={handleChange} placeholder="Image URL" className="w-full border p-2 rounded-md" />
          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-[#FC8019] text-white rounded-md hover:bg-[#E23744]">{loading ? "Saving..." : "Save Changes"}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditRestaurantModal;
