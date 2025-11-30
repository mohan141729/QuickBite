import React, { useState } from "react";
import { X, Upload, FileText, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { bulkCreateMenuItems } from "../api/menu";
import { useAuth } from "../context/AuthContext";

const BulkUploadModal = ({ onClose, onSuccess, restaurantId }) => {
    const { token } = useAuth();
    const [jsonInput, setJsonInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [activeTab, setActiveTab] = useState("paste"); // 'paste' or 'file'

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const content = event.target.result;
                // Validate JSON
                JSON.parse(content);
                setJsonInput(content);
                setError(null);
            } catch (err) {
                setError("Invalid JSON file. Please check the format.");
            }
        };
        reader.readAsText(file);
    };

    const handleSubmit = async () => {
        if (!jsonInput.trim()) {
            setError("Please provide JSON data.");
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            let items;
            try {
                items = JSON.parse(jsonInput);
            } catch (err) {
                throw new Error("Invalid JSON format. Please correct it.");
            }

            if (!Array.isArray(items)) {
                throw new Error("JSON must be an array of menu items.");
            }

            const res = await bulkCreateMenuItems({ restaurantId, items }, token);

            setSuccess(res.message);
            if (res.createdItems && res.createdItems.length > 0) {
                onSuccess(res.createdItems);
                setTimeout(() => {
                    onClose();
                }, 2000);
            }
        } catch (err) {
            console.error("Bulk upload failed:", err);
            setError(err.response?.data?.message || err.message || "Failed to upload items.");
        } finally {
            setLoading(false);
        }
    };

    const sampleJson = `[
  {
    "name": "Chicken Biryani",
    "description": "Aromatic basmati rice cooked with tender chicken and spices",
    "price": 350,
    "category": "Main Course",
    "isVeg": false,
    "image": "https://example.com/biryani.jpg"
  },
  {
    "name": "Paneer Butter Masala",
    "description": "Cottage cheese cubes in a rich tomato gravy",
    "price": 280,
    "category": "Main Course",
    "isVeg": true
  }
]`;

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-lg w-full max-w-2xl p-6 relative animate-fade-in max-h-[90vh] overflow-y-auto scrollbar-hide">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
                >
                    <X size={20} />
                </button>

                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Bulk Upload Menu Items
                </h2>
                <p className="text-gray-500 text-sm mb-6">
                    Add multiple items at once by uploading a JSON file or pasting JSON data.
                </p>

                {/* Tabs */}
                <div className="flex border-b border-gray-200 mb-6">
                    <button
                        onClick={() => setActiveTab("paste")}
                        className={`px-4 py-2 text-sm font-medium transition-colors relative ${activeTab === "paste"
                                ? "text-orange-600 border-b-2 border-orange-600"
                                : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        Paste JSON
                    </button>
                    <button
                        onClick={() => setActiveTab("file")}
                        className={`px-4 py-2 text-sm font-medium transition-colors relative ${activeTab === "file"
                                ? "text-orange-600 border-b-2 border-orange-600"
                                : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        Upload File
                    </button>
                </div>

                <div className="space-y-4">
                    {activeTab === "paste" ? (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Paste JSON Data
                            </label>
                            <textarea
                                value={jsonInput}
                                onChange={(e) => setJsonInput(e.target.value)}
                                placeholder={sampleJson}
                                rows={10}
                                className="w-full border border-gray-300 rounded-lg p-3 font-mono text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                            />
                            <p className="text-xs text-gray-500 mt-2">
                                Tip: Ensure the JSON is a valid array of objects.
                            </p>
                        </div>
                    ) : (
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors">
                            <Upload className="w-10 h-10 text-gray-400 mb-3" />
                            <p className="text-sm font-medium text-gray-700 mb-1">
                                Click to upload or drag and drop
                            </p>
                            <p className="text-xs text-gray-500 mb-4">JSON files only</p>
                            <input
                                type="file"
                                accept=".json"
                                onChange={handleFileUpload}
                                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-orange-50 file:text-orange-700
                  hover:file:bg-orange-100
                "
                            />
                        </div>
                    )}

                    {/* Status Messages */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3 text-red-700">
                            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                            <div className="text-sm">{error}</div>
                        </div>
                    )}

                    {success && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3 text-green-700">
                            <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                            <div className="text-sm">{success}</div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={loading || !jsonInput.trim()}
                            className="px-6 py-2 bg-gradient-to-r from-[#FC8019] to-[#E23744] text-white font-semibold rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                "Upload Items"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BulkUploadModal;
