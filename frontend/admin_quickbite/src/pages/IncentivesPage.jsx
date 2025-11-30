import React, { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { Plus, Trash2, Edit2, Save, X, Gift, Zap, Award } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";
import TopBar from "../components/TopBar";

const IncentivesPage = () => {
    const { getToken } = useAuth();
    const [incentives, setIncentives] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        target: "",
        reward: "",
        type: "daily",
        color: "from-blue-500 to-indigo-600",
        icon: "Zap",
        startTime: "",
        endTime: "",
    });

    const colors = [
        { name: "Blue", value: "from-blue-500 to-indigo-600", bg: "bg-blue-50", text: "text-blue-600" },
        { name: "Orange", value: "from-orange-500 to-red-600", bg: "bg-orange-50", text: "text-orange-600" },
        { name: "Purple", value: "from-purple-500 to-pink-600", bg: "bg-purple-50", text: "text-purple-600" },
        { name: "Green", value: "from-green-500 to-emerald-600", bg: "bg-green-50", text: "text-green-600" },
    ];

    const icons = [
        { name: "Zap", icon: Zap },
        { name: "Gift", icon: Gift },
        { name: "Award", icon: Award },
    ];

    useEffect(() => {
        fetchIncentives();
    }, []);

    const fetchIncentives = async () => {
        try {
            setLoading(true);
            const token = await getToken();
            const response = await api.get("/incentives/all", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setIncentives(response.data.incentives);
        } catch (error) {
            console.error("Error fetching incentives:", error);
            toast.error("Failed to load incentives");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = await getToken();
            const payload = {
                ...formData,
                target: Number(formData.target),
                reward: Number(formData.reward),
                // Set derived colors based on selection
                bgColor: colors.find(c => c.value === formData.color)?.bg || "bg-gray-50",
                textColor: colors.find(c => c.value === formData.color)?.text || "text-gray-600",
            };

            if (editingId) {
                await api.put(`/incentives/${editingId}`, payload, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                toast.success("Incentive updated successfully");
            } else {
                await api.post("/incentives", payload, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                toast.success("Incentive created successfully");
            }

            setShowModal(false);
            setFormData({
                title: "",
                description: "",
                target: "",
                reward: "",
                type: "daily",
                color: "from-blue-500 to-indigo-600",
                icon: "Zap",
                startTime: "",
                endTime: "",
            });
            setEditingId(null);
            fetchIncentives();
        } catch (error) {
            console.error("Error saving incentive:", error);
            toast.error("Failed to save incentive");
        }
    };

    const handleEdit = (incentive) => {
        setFormData({
            title: incentive.title,
            description: incentive.description,
            target: incentive.target,
            reward: incentive.reward,
            type: incentive.type,
            color: incentive.color,
            icon: incentive.icon,
            startTime: incentive.startTime || "",
            endTime: incentive.endTime || "",
        });
        setEditingId(incentive._id);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this incentive?")) return;
        try {
            const token = await getToken();
            await api.delete(`/incentives/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success("Incentive deleted");
            fetchIncentives();
        } catch (error) {
            console.error("Error deleting incentive:", error);
            toast.error("Failed to delete incentive");
        }
    };

    return (
        <div className="flex-1 bg-slate-50 min-h-screen">
            <TopBar title="Delivery Incentives" />

            <div className="pt-24 px-8 pb-12 animate-fade-in">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                            <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                                <Gift className="w-6 h-6" />
                            </div>
                            Incentive Management
                        </h2>
                        <p className="text-slate-500 mt-1 ml-11">Manage rewards and targets for delivery partners</p>
                    </div>
                    <button
                        onClick={() => {
                            setEditingId(null);
                            setFormData({
                                title: "",
                                description: "",
                                target: "",
                                reward: "",
                                type: "daily",
                                color: "from-blue-500 to-indigo-600",
                                icon: "Zap",
                                startTime: "",
                                endTime: "",
                            });
                            setShowModal(true);
                        }}
                        className="bg-orange-600 text-white px-6 py-2.5 rounded-xl shadow-lg shadow-orange-500/30 hover:bg-orange-700 hover:scale-105 transition-all duration-300 font-medium flex items-center gap-2"
                    >
                        <Plus size={20} />
                        Add Incentive
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {incentives.map((incentive) => {
                            const Icon = icons.find(i => i.name === incentive.icon)?.icon || Zap;
                            return (
                                <div key={incentive._id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 relative group hover:shadow-md transition-shadow">
                                    <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${incentive.color} opacity-10 rounded-bl-full -mr-4 -mt-4`} />

                                    <div className="flex justify-between items-start mb-4 relative z-10">
                                        <div className={`w-10 h-10 ${incentive.bgColor} rounded-lg flex items-center justify-center`}>
                                            <Icon className={`w-5 h-5 ${incentive.textColor}`} />
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(incentive)}
                                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(incentive._id)}
                                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    <h3 className="font-bold text-slate-800 text-lg mb-1">{incentive.title}</h3>
                                    <p className="text-slate-500 text-sm mb-4 line-clamp-2">{incentive.description}</p>

                                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                        <div>
                                            <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Target</p>
                                            <p className="font-semibold text-slate-800">{incentive.target} Orders</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Reward</p>
                                            <p className={`font-bold text-lg ${incentive.textColor}`}>₹{incentive.reward}</p>
                                        </div>
                                    </div>

                                    <div className="mt-3 flex items-center justify-between">
                                        <div className="inline-block px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded uppercase font-bold">
                                            {incentive.type.replace('_', ' ')}
                                        </div>
                                        {incentive.startTime && incentive.endTime && (
                                            <div className="text-xs text-slate-500 font-medium">
                                                {incentive.startTime} - {incentive.endTime}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
                        <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-scale-in">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-slate-800">
                                    {editingId ? "Edit Incentive" : "New Incentive"}
                                </h2>
                                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                                        placeholder="e.g., Daily Target"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                                    <textarea
                                        required
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                                        placeholder="e.g., Complete 5 orders to unlock bonus"
                                        rows="2"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Target (Orders)</label>
                                        <input
                                            type="number"
                                            required
                                            min="1"
                                            value={formData.target}
                                            onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                                            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Reward (₹)</label>
                                        <input
                                            type="number"
                                            required
                                            min="1"
                                            value={formData.reward}
                                            onChange={(e) => setFormData({ ...formData, reward: e.target.value })}
                                            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Start Time (Optional)</label>
                                        <input
                                            type="time"
                                            value={formData.startTime}
                                            onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                                            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">End Time (Optional)</label>
                                        <input
                                            type="time"
                                            value={formData.endTime}
                                            onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                                            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                                        <select
                                            value={formData.type}
                                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                                        >
                                            <option value="daily">Daily</option>
                                            <option value="weekly">Weekly</option>
                                            <option value="per_order">Per Order Bonus</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Icon</label>
                                        <div className="flex gap-2">
                                            {icons.map((item) => (
                                                <button
                                                    key={item.name}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, icon: item.name })}
                                                    className={`p-2 rounded-lg border transition-all ${formData.icon === item.name ? "border-orange-500 bg-orange-50 text-orange-600" : "border-slate-200 text-slate-400 hover:border-slate-300"}`}
                                                >
                                                    <item.icon size={20} />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Color Theme</label>
                                    <div className="flex gap-3">
                                        {colors.map((c) => (
                                            <button
                                                key={c.name}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, color: c.value })}
                                                className={`w-8 h-8 rounded-full bg-gradient-to-br ${c.value} ring-2 ring-offset-2 transition-all ${formData.color === c.value ? "ring-slate-400 scale-110" : "ring-transparent"}`}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-orange-600 text-white font-bold py-3 rounded-xl hover:bg-orange-700 transition-colors flex items-center justify-center gap-2 mt-4 shadow-lg shadow-orange-500/30"
                                >
                                    <Save size={20} />
                                    {editingId ? "Update Incentive" : "Create Incentive"}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default IncentivesPage;
