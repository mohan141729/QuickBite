import React, { useState } from "react";
import { Trash2, X } from "lucide-react";
import { deleteMenuItem } from "../api/menu";
import { useAuth } from "../context/AuthContext";

const DeleteConfirmModal = ({ item, onClose, onDeleted }) => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteMenuItem(item._id, token);
      onDeleted(item._id);
      onClose();
    } catch (err) {
      console.error("Failed to delete item:", err);
      alert("Error deleting item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-6 relative animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          <X size={20} />
        </button>

        <div className="text-center">
          <Trash2 className="mx-auto text-red-500 mb-3" size={36} />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Delete this item?
          </h3>
          <p className="text-gray-500 text-sm mb-5">
            This action cannot be undone.
          </p>

          <div className="flex justify-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition"
            >
              {loading ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
