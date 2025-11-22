import React, { useState } from "react";
import { createRestaurant } from "../api/restaurants";
import { X } from "lucide-react";
import toast from "react-hot-toast";

const AddRestaurantModal = ({ onClose, onAdded }) => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    cuisine: "",
    phone: "",
    location: "",
    image: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await createRestaurant(form);
      onAdded(res.restaurant || res);
      toast.success("Restaurant created successfully!");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to create restaurant");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-lg p-6 shadow-lg relative animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>
        <h2 className="text-xl font-semibold mb-4">Add New Restaurant</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {["name", "description", "cuisine", "phone", "location", "image"].map((field) => (
            <input
              key={field}
              type="text"
              name={field}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={form[field]}
              onChange={handleChange}
              required={field !== "image"}
              className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
            />
          ))}
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
