import React, { useState } from "react";
import { Star, X, Send } from "lucide-react";
import api from "../api/api";

const FeedbackModal = ({ order, onClose, onSuccess }) => {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    if (!order) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError("");

        try {
            await api.post("/api/reviews", {
                restaurantId: order.restaurant._id,
                orderId: order._id,
                rating,
                comment,
            });
            onSuccess();
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to submit review");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="bg-[#FC8019] p-6 text-white relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white/80 hover:text-white transition"
                    >
                        <X size={24} />
                    </button>
                    <h2 className="text-2xl font-bold mb-1">How was your food?</h2>
                    <p className="text-orange-100 text-sm">Order from {order.restaurant.name}</p>
                </div>

                {/* Body */}
                <div className="p-6">
                    {error && <p className="text-red-500 text-sm mb-4 bg-red-50 p-3 rounded-lg">{error}</p>}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Star Rating */}
                        <div className="flex flex-col items-center gap-2">
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        className="focus:outline-none transition-transform hover:scale-110"
                                    >
                                        <Star
                                            className={`w-10 h-10 ${star <= rating ? "text-[#FC8019] fill-[#FC8019]" : "text-gray-200"
                                                }`}
                                        />
                                    </button>
                                ))}
                            </div>
                            <p className="text-gray-500 font-medium text-sm">
                                {rating === 5 ? "Excellent!" : rating === 4 ? "Good" : rating === 3 ? "Average" : rating === 2 ? "Poor" : "Terrible"}
                            </p>
                        </div>

                        {/* Comment */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Write a review</label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Tell us what you liked..."
                                className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-100 focus:border-[#FC8019] outline-none resize-none h-28 text-gray-700 bg-gray-50"
                                required
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full bg-[#FC8019] text-white py-3 rounded-xl font-bold text-lg hover:bg-orange-600 transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-orange-200"
                        >
                            {submitting ? "Submitting..." : <><Send size={20} /> Submit Feedback</>}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default FeedbackModal;
