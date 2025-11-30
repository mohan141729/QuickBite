import React, { useState } from "react";
import { createRestaurant } from "../api/restaurants";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import ImageUpload from "./ImageUpload";

const AddRestaurantModal = ({ onClose, onAdded }) => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    cuisine: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
    image: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Structure the data properly for the backend
      const restaurantData = {
        name: form.name,
        description: form.description,
        cuisine: form.cuisine,
        phone: form.phone,
        image: form.image,
        location: {
          address: form.address,
          city: form.city,
          pincode: form.pincode,
        },
      };

      const res = await createRestaurant(restaurantData);
      onAdded(res.restaurant || res);
      toast.success("Restaurant created successfully!");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to create restaurant");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl shadow-lg relative animate-fade-in max-h-[85vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl z-10">
          <h2 className="text-xl font-semibold text-gray-800">Add New Restaurant</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition"
          >
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Restaurant Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Restaurant Name *
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="2"
              className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
            />
          </div>

          {/* Cuisine & Phone */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cuisine *
              </label>
              <input
                type="text"
                name="cuisine"
                value={form.cuisine}
                onChange={handleChange}
                required
                placeholder="e.g. Italian"
                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone *
              </label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address *
            </label>
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              required
              placeholder="Street address"
              className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-orange-500 outline-none mb-2"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                name="city"
                value={form.city}
                onChange={handleChange}
                required
                placeholder="City"
                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
              />
              <input
                type="text"
                name="pincode"
                value={form.pincode}
                onChange={handleChange}
                required
                placeholder="Pincode"
                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>
          </div>

          {/* Image Upload */}
          <ImageUpload
            label="Restaurant Image"
            onImageUploaded={(url) => setForm((prev) => ({ ...prev, image: url }))}
            initialImage={form.image}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#FC8019] to-[#E23744] text-white font-semibold py-2 rounded-md hover:opacity-90 transition"
          >
            {loading ? "Creating..." : "Create Restaurant"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddRestaurantModal;
