import React, { useEffect, useState } from "react";
import { getMenuByRestaurant, updateMenuItem } from "../../api/menu";
import {
  Pencil,
  Trash2,
  Plus,
  ToggleLeft,
  ToggleRight,
  Search,
  Filter,
  Utensils,
  DollarSign,
  Image as ImageIcon,
  AlertCircle,
  CheckCircle,
  Package,
  FileText
} from "lucide-react";
import AddMenuItemModal from "../../components/AddMenuItemModal";
import EditMenuItemModal from "../../components/EditMenuItemModal";
import DeleteConfirmModal from "../../components/DeleteConfirmModal";
import BulkUploadModal from "../../components/BulkUploadModal";
import { getRestaurantById } from "../../api/restaurants";

const MenuTab = ({ restaurantId }) => {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [updating, setUpdating] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [restaurantCategories, setRestaurantCategories] = useState([]);


  // Load menu items and restaurant details
  useEffect(() => {
    const loadData = async () => {
      try {
        const [menuRes, restaurantRes] = await Promise.all([
          getMenuByRestaurant(restaurantId),
          getRestaurantById(restaurantId)
        ]);

        const items = Array.isArray(menuRes) ? menuRes : menuRes.menu || menuRes.menuItems || [];
        setMenu(items);

        if (restaurantRes.categories) {
          setRestaurantCategories(restaurantRes.categories);
        }
      } catch (err) {
        console.error("❌ Failed to load data:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [restaurantId]);

  const handleAddItem = (newItem) => setMenu((prev) => [...prev, newItem]);
  const handleUpdateItem = (updated) =>
    setMenu((prev) => prev.map((m) => (m._id === updated._id ? updated : m)));
  const handleDeleteItem = (id) =>
    setMenu((prev) => prev.filter((m) => m._id !== id));

  // Toggle availability with backend call
  const handleToggleAvailability = async (item) => {
    try {
      setUpdating(item._id);
      const token = localStorage.getItem("token");
      const updatedData = { ...item, isAvailable: !item.isAvailable };

      // Optimistically update UI
      setMenu((prev) =>
        prev.map((m) =>
          m._id === item._id ? { ...m, isAvailable: !m.isAvailable } : m
        )
      );

      await updateMenuItem(item._id, updatedData, token);
    } catch (err) {
      console.error("⚠️ Failed to update availability:", err);
      // Revert on error
      setMenu((prev) =>
        prev.map((m) =>
          m._id === item._id ? { ...m, isAvailable: !updatedData.isAvailable } : m
        )
      );
    } finally {
      setUpdating(null);
    }
  };

  // Get all unique categories
  const allCategories = ["All", ...new Set(menu.map(item => item.category || "Others"))];

  // Filter menu items
  const filteredMenu = menu.filter(item => {
    const matchesSearch = !searchTerm ||
      item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter === "All" ||
      (item.category || "Others") === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  // Group items by category
  const groupedMenu = filteredMenu.reduce((acc, item) => {
    const category = item.category || "Others";
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    return acc;
  }, {});

  // Calculate stats
  const stats = {
    total: menu.length,
    available: menu.filter(item => item.isAvailable).length,
    unavailable: menu.filter(item => !item.isAvailable).length,
    categories: allCategories.length - 1 // Exclude "All"
  };

  // Loading UI
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-medium">Loading menu items...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Menu Management</h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage your restaurant's menu offerings and availability
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowBulkModal(true)}
            className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-5 py-2.5 rounded-lg font-semibold transition-all shadow-sm hover:shadow-md"
          >
            <FileText className="w-5 h-5" />
            Bulk Upload
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-[#FC8019] hover:bg-[#e66e16] text-white px-5 py-2.5 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Add Menu Item
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Utensils className="w-5 h-5 text-[#FC8019]" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-xs text-gray-500">Total Items</div>
            </div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-green-700">{stats.available}</div>
              <div className="text-xs text-green-600">Available</div>
            </div>
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-red-700">{stats.unavailable}</div>
              <div className="text-xs text-red-600">Unavailable</div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-700">{stats.categories}</div>
              <div className="text-xs text-blue-600">Categories</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search menu items by name, description, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
            {allCategories.map(category => (
              <button
                key={category}
                onClick={() => setCategoryFilter(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${categoryFilter === category
                  ? "bg-[#FC8019] text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Items */}
      {Object.keys(groupedMenu).length ? (
        <div className="space-y-8">
          {Object.entries(groupedMenu).map(([category, items], idx) => (
            <div key={`category-${idx}-${category}`}>
              {/* Category Header */}
              <div className="flex items-center justify-between mb-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-4">
                  {/* Category Image */}
                  {(() => {
                    const catImage = restaurantCategories.find(c => c.name === category)?.image;
                    return catImage ? (
                      <img src={catImage} alt={category} className="w-12 h-12 rounded-lg object-cover" />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center text-orange-500">
                        <Utensils className="w-6 h-6" />
                      </div>
                    );
                  })()}

                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{category}</h3>
                    <span className="text-sm text-gray-500">
                      {items.length} {items.length === 1 ? 'item' : 'items'}
                    </span>
                  </div>
                </div>

              </div>

              {/* Items Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {items.map((item, itemIndex) => (
                  <div
                    key={item._id || `${category}-${itemIndex}-${item.name}`}
                    className={`bg-white rounded-xl shadow-sm border-2 p-5 hover:shadow-md transition-all ${item.isAvailable
                      ? "border-gray-200 hover:border-orange-200"
                      : "border-red-200 bg-gray-50"
                      }`}
                  >
                    <div className="flex gap-4">
                      {/* Image */}
                      <div className="relative flex-shrink-0">
                        <img
                          src={
                            item.image ||
                            "https://res.cloudinary.com/ds6o1cohi/image/upload/v1720593157/restaurant-placeholder.jpg"
                          }
                          alt={item.name}
                          className={`w-24 h-24 rounded-lg object-cover ${!item.isAvailable ? "grayscale opacity-60" : ""
                            }`}
                        />
                        {!item.isAvailable && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-lg">
                            <span className="text-white text-xs font-bold">UNAVAILABLE</span>
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h4 className="font-bold text-gray-900 text-lg truncate">
                            {item.name}
                          </h4>
                          <div className="flex-shrink-0">
                            <p className="text-xl font-bold text-[#FC8019]">
                              ₹{item.price}
                            </p>
                          </div>
                        </div>

                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                          {item.description || "Delicious dish from our kitchen"}
                        </p>

                        {/* Actions */}
                        <div className="flex items-center gap-3 flex-wrap">
                          {/* Availability Toggle */}
                          <button
                            disabled={updating === item._id}
                            onClick={() => handleToggleAvailability(item)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${item.isAvailable
                              ? "bg-green-100 text-green-700 hover:bg-green-200"
                              : "bg-red-100 text-red-700 hover:bg-red-200"
                              } ${updating === item._id ? "opacity-50 cursor-not-allowed" : ""}`}
                          >
                            {item.isAvailable ? (
                              <>
                                <CheckCircle className="w-4 h-4" />
                                Available
                              </>
                            ) : (
                              <>
                                <AlertCircle className="w-4 h-4" />
                                Unavailable
                              </>
                            )}
                          </button>

                          {/* Edit Button */}
                          <button
                            onClick={() => setEditItem(item)}
                            className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition"
                            title="Edit item"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => setDeleteItem(item)}
                            className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition"
                            title="Delete item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <Utensils className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 font-medium text-lg">No menu items found</p>
          <p className="text-sm text-gray-400 mt-1">
            {searchTerm || categoryFilter !== "All"
              ? "Try adjusting your search or filters"
              : "Add your first menu item to get started"}
          </p>
          {!searchTerm && categoryFilter === "All" && (
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-4 inline-flex items-center gap-2 bg-[#FC8019] hover:bg-[#e66e16] text-white px-5 py-2.5 rounded-lg font-semibold transition"
            >
              <Plus className="w-5 h-5" />
              Add Your First Item
            </button>
          )}
        </div>
      )}

      {/* Results Info */}
      {filteredMenu.length > 0 && filteredMenu.length !== menu.length && (
        <div className="mt-6 text-center text-sm text-gray-500">
          Showing {filteredMenu.length} of {menu.length} items
        </div>
      )}

      {/* Modals */}
      {showAddModal && (
        <AddMenuItemModal
          onClose={() => setShowAddModal(false)}
          onAdded={handleAddItem}
          restaurantId={restaurantId}
        />
      )}
      {showBulkModal && (
        <BulkUploadModal
          onClose={() => setShowBulkModal(false)}
          onSuccess={(newItems) => {
            setMenu(prev => [...prev, ...newItems]);
            setShowBulkModal(false);
          }}
          restaurantId={restaurantId}
        />
      )}
      {editItem && (
        <EditMenuItemModal
          item={editItem}
          onClose={() => setEditItem(null)}
          onUpdated={handleUpdateItem}
        />
      )}
      {deleteItem && (
        <DeleteConfirmModal
          item={deleteItem}
          onClose={() => setDeleteItem(null)}
          onDeleted={handleDeleteItem}
        />
      )}

    </div>
  );
};

export default MenuTab;
