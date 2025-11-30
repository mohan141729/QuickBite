import React, { useState, useEffect } from "react";
import {
    Plus,
    Search,
    Edit,
    Trash2,
    Tag,
    Calendar,
    Percent,
    IndianRupee,
    Loader2,
    X,
} from "lucide-react";
import TopBar from '../components/TopBar';
import api from "../api/axios";
import toast from "react-hot-toast";

const Coupons = () => {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState(null);
    const [formData, setFormData] = useState({
        code: "",
        description: "",
        discountType: "percentage",
        discountValue: "",
        minOrderValue: 0,
        maxDiscount: "",
        validUntil: "",
        usageLimit: "",
        isActive: true,
    });

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        try {
            const { data } = await api.get("/coupons");
            setCoupons(data);
        } catch (error) {
            console.error("Failed to fetch coupons:", error);
            toast.error("Failed to load coupons");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                code: formData.code.toUpperCase(),
                discountValue: Number(formData.discountValue),
                minOrderValue: Number(formData.minOrderValue),
                maxDiscount: formData.maxDiscount ? Number(formData.maxDiscount) : null,
                usageLimit: formData.usageLimit ? Number(formData.usageLimit) : null,
            };

            if (editingCoupon) {
                await api.put(`/coupons/${editingCoupon._id}`, payload);
                toast.success("Coupon updated successfully");
            } else {
                await api.post("/coupons", payload);
                toast.success("Coupon created successfully");
            }

            setIsModalOpen(false);
            setEditingCoupon(null);
            resetForm();
            fetchCoupons();
        } catch (error) {
            console.error("Error saving coupon:", error);
            toast.error(error.response?.data?.message || "Failed to save coupon");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this coupon?")) return;
        try {
            await api.delete(`/coupons/${id}`);
            toast.success("Coupon deleted");
            fetchCoupons();
        } catch (error) {
            toast.error("Failed to delete coupon");
        }
    };

    const openEditModal = (coupon) => {
        setEditingCoupon(coupon);
        setFormData({
            code: coupon.code,
            description: coupon.description,
            discountType: coupon.discountType,
            discountValue: coupon.discountValue,
            minOrderValue: coupon.minOrderValue,
            maxDiscount: coupon.maxDiscount || "",
            validUntil: new Date(coupon.validUntil).toISOString().split("T")[0],
            usageLimit: coupon.usageLimit || "",
            isActive: coupon.isActive,
        });
        setIsModalOpen(true);
    };

    const resetForm = () => {
        setFormData({
            code: "",
            description: "",
            discountType: "percentage",
            discountValue: "",
            minOrderValue: 0,
            maxDiscount: "",
            validUntil: "",
            usageLimit: "",
            isActive: true,
        });
    };

    const filteredCoupons = coupons.filter(
        (c) =>
            c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex-1 bg-slate-50 min-h-screen">
            <TopBar title="Coupons & Offers" />

            <div className="pt-24 px-8 pb-12 animate-fade-in">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                            <div className="p-2 bg-orange-100 rounded-lg text-[#FC8019]">
                                <Tag className="w-6 h-6" />
                            </div>
                            Coupons & Offers
                        </h1>
                        <p className="text-gray-500 mt-1 ml-11">Manage discounts and promo codes</p>
                    </div>
                    <button
                        onClick={() => {
                            setEditingCoupon(null);
                            resetForm();
                            setIsModalOpen(true);
                        }}
                        className="flex items-center gap-2 bg-[#FC8019] text-white px-4 py-2 rounded-lg hover:bg-[#e57316] transition-colors shadow-sm"
                    >
                        <Plus className="w-5 h-5" />
                        Create Coupon
                    </button>
                </div>

                {/* Search */}
                <div className="relative mb-6">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search coupons..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FC8019] focus:border-transparent outline-none transition-all"
                    />
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-[#FC8019]" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCoupons.map((coupon) => (
                            <div
                                key={coupon._id}
                                className={`bg-white rounded-xl border p-6 shadow-sm hover:shadow-md transition-all ${!coupon.isActive ? "opacity-75 bg-gray-50" : ""
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`p-3 rounded-lg ${coupon.isActive
                                                ? "bg-orange-50 text-[#FC8019]"
                                                : "bg-gray-100 text-gray-500"
                                                }`}
                                        >
                                            <Tag className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg text-gray-900">
                                                {coupon.code}
                                            </h3>
                                            <span
                                                className={`text-xs px-2 py-1 rounded-full font-medium ${coupon.isActive
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                                    }`}
                                            >
                                                {coupon.isActive ? "Active" : "Inactive"}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => openEditModal(coupon)}
                                            className="p-2 text-gray-400 hover:text-[#FC8019] hover:bg-orange-50 rounded-lg transition-colors"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(coupon._id)}
                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                    {coupon.description}
                                </p>

                                <div className="space-y-2 text-sm text-gray-500">
                                    <div className="flex items-center gap-2">
                                        <Percent className="w-4 h-4" />
                                        <span>
                                            {coupon.discountType === "percentage"
                                                ? `${coupon.discountValue}% Off`
                                                : `₹${coupon.discountValue} Flat Off`}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <IndianRupee className="w-4 h-4" />
                                        <span>Min Order: ₹{coupon.minOrderValue}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        <span>
                                            Valid until:{" "}
                                            {new Date(coupon.validUntil).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                                <h2 className="text-xl font-bold text-gray-900">
                                    {editingCoupon ? "Edit Coupon" : "Create New Coupon"}
                                </h2>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-2 hover:bg-gray-100 rounded-full transition"
                                >
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Coupon Code
                                        </label>
                                        <input
                                            type="text"
                                            name="code"
                                            required
                                            value={formData.code}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#FC8019] outline-none uppercase"
                                            placeholder="SUMMER50"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Valid Until
                                        </label>
                                        <input
                                            type="date"
                                            name="validUntil"
                                            required
                                            value={formData.validUntil}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#FC8019] outline-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Description
                                    </label>
                                    <textarea
                                        name="description"
                                        required
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#FC8019] outline-none"
                                        rows="2"
                                        placeholder="Get 50% off on your first order"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Discount Type
                                        </label>
                                        <select
                                            name="discountType"
                                            value={formData.discountType}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#FC8019] outline-none"
                                        >
                                            <option value="percentage">Percentage (%)</option>
                                            <option value="flat">Flat Amount (₹)</option>
                                            <option value="free_delivery">Free Delivery</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Value
                                        </label>
                                        <input
                                            type="number"
                                            name="discountValue"
                                            required
                                            value={formData.discountValue}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#FC8019] outline-none"
                                            placeholder="50"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Min Order Value
                                        </label>
                                        <input
                                            type="number"
                                            name="minOrderValue"
                                            value={formData.minOrderValue}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#FC8019] outline-none"
                                            placeholder="199"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Max Discount (Optional)
                                        </label>
                                        <input
                                            type="number"
                                            name="maxDiscount"
                                            value={formData.maxDiscount}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#FC8019] outline-none"
                                            placeholder="100"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 mt-2">
                                    <input
                                        type="checkbox"
                                        name="isActive"
                                        id="isActive"
                                        checked={formData.isActive}
                                        onChange={handleInputChange}
                                        className="w-4 h-4 text-[#FC8019] border-gray-300 rounded focus:ring-[#FC8019]"
                                    />
                                    <label htmlFor="isActive" className="text-sm text-gray-700">
                                        Active
                                    </label>
                                </div>

                                <div className="pt-4 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2 bg-[#FC8019] text-white rounded-lg hover:bg-[#e57316] font-medium"
                                    >
                                        {editingCoupon ? "Update Coupon" : "Create Coupon"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Coupons;
