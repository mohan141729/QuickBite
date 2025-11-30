import React, { useState, useEffect } from "react";
import { X, Plus, Trash2, Leaf, Info } from "lucide-react";
import { createMenuItem } from "../api/menu";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import ImageUpload from "./ImageUpload";

const AddMenuItemModal = ({ onClose, onAdded, restaurantId }) => {
  const { token } = useAuth();
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
    isVeg: true,
    variants: [], // [{ name: "Small", price: 100 }]
    addOns: [], // [{ name: "Extra Cheese", price: 20 }]
    nutritionalInfo: { calories: "", protein: "", carbs: "", fats: "", fiber: "", sodium: "" },
  });
  const [loading, setLoading] = useState(false);
  const [adminCategories, setAdminCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/api/categories');
        setAdminCategories(res.data);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes("nutritionalInfo.")) {
      const field = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        nutritionalInfo: { ...prev.nutritionalInfo, [field]: value },
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  // Variants Management
  const addVariant = () => {
    setForm((prev) => ({
      ...prev,
      variants: [...prev.variants, { name: "", price: "" }],
    }));
  };

  const removeVariant = (index) => {
    setForm((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  const updateVariant = (index, field, value) => {
    const newVariants = [...form.variants];
    newVariants[index][field] = value;
    setForm((prev) => ({ ...prev, variants: newVariants }));
  };

  // Add-ons Management
  const addAddOn = () => {
    setForm((prev) => ({
      ...prev,
      addOns: [...prev.addOns, { name: "", price: "" }],
    }));
  };

  const removeAddOn = (index) => {
    setForm((prev) => ({
      ...prev,
      addOns: prev.addOns.filter((_, i) => i !== index),
    }));
  };

  const updateAddOn = (index, field, value) => {
    const newAddOns = [...form.addOns];
    newAddOns[index][field] = value;
    setForm((prev) => ({ ...prev, addOns: newAddOns }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Find selected category image
      const selectedCat = adminCategories.find(c => c.name === form.category);
      const categoryImage = selectedCat ? selectedCat.image : null;

      const data = { ...form, restaurantId, categoryImage };
      const res = await createMenuItem(data, token);
      onAdded(res.item || res);
      onClose();
    } catch (err) {
      console.error("Failed to add menu item:", err);
      alert("Error adding menu item. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-2xl p-6 relative animate-fade-in max-h-[90vh] overflow-y-auto scrollbar-hide">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Add New Menu Item
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Item Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Price (₹)</label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                required
                min="0"
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="2"
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 outline-none"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Category</label>
              <div className="relative">
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 outline-none appearance-none bg-white"
                >
                  <option value="">Select a Category</option>
                  {adminCategories.map((cat) => (
                    <option key={cat._id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex items-center gap-3 pt-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isVeg"
                  checked={form.isVeg}
                  onChange={handleChange}
                  className="w-5 h-5 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <span className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <Leaf className={`w-4 h-4 ${form.isVeg ? "text-green-600" : "text-gray-400"}`} />
                  Veg
                </span>
              </label>
            </div>
          </div>

          {/* Nutritional Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Info className="w-4 h-4" /> Nutritional Info
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                name="nutritionalInfo.calories"
                value={form.nutritionalInfo.calories}
                onChange={handleChange}
                placeholder="Calories (kcal)"
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 outline-none text-sm"
              />
              <input
                type="number"
                name="nutritionalInfo.protein"
                value={form.nutritionalInfo.protein}
                onChange={handleChange}
                placeholder="Protein (g)"
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 outline-none text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                name="nutritionalInfo.carbs"
                value={form.nutritionalInfo.carbs}
                onChange={handleChange}
                placeholder="Carbs (g)"
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 outline-none text-sm"
              />
              <input
                type="number"
                name="nutritionalInfo.fats"
                value={form.nutritionalInfo.fats}
                onChange={handleChange}
                placeholder="Fats (g)"
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 outline-none text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                name="nutritionalInfo.fiber"
                value={form.nutritionalInfo.fiber}
                onChange={handleChange}
                placeholder="Fiber (g)"
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 outline-none text-sm"
              />
              <input
                type="number"
                name="nutritionalInfo.sodium"
                value={form.nutritionalInfo.sodium}
                onChange={handleChange}
                placeholder="Sodium (mg)"
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 outline-none text-sm"
              />
            </div>
          </div>

          {/* Variants */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-600">Variants</label>
              <button type="button" onClick={addVariant} className="text-xs text-orange-600 font-semibold flex items-center gap-1 hover:underline">
                <Plus className="w-3 h-3" /> Add Variant
              </button>
            </div>
            {form.variants.map((variant, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Name (e.g. Large)"
                  value={variant.name}
                  onChange={(e) => updateVariant(index, "name", e.target.value)}
                  className="flex-1 border rounded-lg px-3 py-2 text-sm outline-none"
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={variant.price}
                  onChange={(e) => updateVariant(index, "price", e.target.value)}
                  className="w-24 border rounded-lg px-3 py-2 text-sm outline-none"
                />
                <button type="button" onClick={() => removeVariant(index)} className="text-red-500 hover:bg-red-50 p-2 rounded">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Add-ons */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-600">Add-ons</label>
              <button type="button" onClick={addAddOn} className="text-xs text-orange-600 font-semibold flex items-center gap-1 hover:underline">
                <Plus className="w-3 h-3" /> Add Add-on
              </button>
            </div>
            {form.addOns.map((addOn, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Name (e.g. Extra Cheese)"
                  value={addOn.name}
                  onChange={(e) => updateAddOn(index, "name", e.target.value)}
                  className="flex-1 border rounded-lg px-3 py-2 text-sm outline-none"
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={addOn.price}
                  onChange={(e) => updateAddOn(index, "price", e.target.value)}
                  className="w-24 border rounded-lg px-3 py-2 text-sm outline-none"
                />
                <button type="button" onClick={() => removeAddOn(index)} className="text-red-500 hover:bg-red-50 p-2 rounded">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Image Upload */}
          <ImageUpload
            label="Food Item Image"
            onImageUploaded={(url) => setForm((prev) => ({ ...prev, image: url }))}
            initialImage={form.image}
          />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#FC8019] to-[#E23744] text-white font-semibold py-3 rounded-lg hover:opacity-90 transition shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Adding...
              </>
            ) : (
              "Add Item"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddMenuItemModal;
