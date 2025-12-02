import React, { useState, useEffect } from "react";
import { Star, User, Send } from "lucide-react";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

const ReviewSection = ({ restaurantId }) => {
    const { user } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const fetchReviews = React.useCallback(async () => {
        try {
            const { data } = await api.get(`/api/reviews/${restaurantId}`);
            setReviews(data);
        } catch (err) {
            console.error("Failed to fetch reviews:", err);
        } finally {
            setLoading(false);
        }
    }, [restaurantId]);

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            setError("You must be logged in to leave a review.");
            return;
        }
        setSubmitting(true);
        setError("");

        try {
            await api.post("/api/reviews", {
                restaurantId,
                rating,
                comment,
            });
            setComment("");
            setRating(5);
            fetchReviews(); // Refresh list
        } catch (err) {
            setError(err.response?.data?.message || "Failed to submit review");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Star className="w-6 h-6 text-[#FC8019] fill-[#FC8019]" />
                Reviews & Ratings
            </h2>

            {/* Review Form */}
            {user ? (
                <form onSubmit={handleSubmit} className="mb-10 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Leave a Review</h3>

                    {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

                    <div className="flex flex-col gap-4">
                        {/* Star Rating */}
                        <div className="flex items-center gap-2">
                            <span className="text-gray-600 text-sm font-medium">Your Rating:</span>
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        className="focus:outline-none transition-transform hover:scale-110"
                                    >
                                        <Star
                                            className={`w-6 h-6 ${star <= rating ? "text-[#FC8019] fill-[#FC8019]" : "text-gray-300"
                                                }`}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Comment Input */}
                        <div className="relative">
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Share your experience..."
                                className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-100 focus:border-[#FC8019] outline-none resize-none h-28 text-gray-700 bg-white"
                            />
                            <button
                                type="submit"
                                disabled={submitting}
                                className="absolute bottom-3 right-3 bg-[#FC8019] text-white p-2 rounded-lg hover:bg-orange-600 transition disabled:opacity-50 flex items-center gap-2 text-sm font-bold shadow-md"
                            >
                                {submitting ? "Posting..." : <><Send size={16} /> Post</>}
                            </button>
                        </div>
                    </div>
                </form>
            ) : (
                <div className="mb-10 p-6 bg-orange-50 rounded-2xl border border-orange-100 text-center">
                    <p className="text-orange-800 font-medium">Please log in to leave a review.</p>
                </div>
            )}

            {/* Reviews List */}
            <div className="space-y-6">
                {loading ? (
                    <p className="text-center text-gray-500">Loading reviews...</p>
                ) : Array.isArray(reviews) && reviews.length > 0 ? (
                    reviews.map((review) => (
                        <div key={review._id} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                                        <User size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">{review.user?.name || "Anonymous"}</h4>
                                        <p className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="flex items-center bg-green-50 px-2 py-1 rounded-lg border border-green-100">
                                    <span className="text-green-700 font-bold text-sm mr-1">{review.rating}</span>
                                    <Star className="w-3 h-3 text-green-600 fill-green-600" />
                                </div>
                            </div>
                            <p className="text-gray-600 leading-relaxed ml-14">{review.comment}</p>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-10 text-gray-400 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                        <p>No reviews yet. Be the first to review!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReviewSection;
