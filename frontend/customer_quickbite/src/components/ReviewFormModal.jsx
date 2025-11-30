import React, { useState } from 'react';
import { X, Star, CheckCircle } from 'lucide-react';
import StarRating from './StarRating';

const ReviewFormModal = ({ order, onClose, onSuccess }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (rating === 0) {
            alert('Please select a rating');
            return;
        }

        if (!comment.trim()) {
            alert('Please write a review');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    restaurantId: order.restaurant._id || order.restaurant,
                    orderId: order._id,
                    rating,
                    comment: comment.trim(),
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to submit review');
            }

            setSubmitted(true);
            setTimeout(() => {
                if (onSuccess) onSuccess();
                onClose();
            }, 2000);
        } catch (error) {
            console.error('Review submission error:', error);
            alert(error.message || 'Failed to submit review');
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
                    <p className="text-gray-600">Your review has been submitted successfully</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-gray-900">Write a Review</h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit} className="p-6">
                    {/* Order Details */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <p className="text-sm text-gray-600">Restaurant</p>
                        <p className="font-semibold text-gray-900">{order.restaurant?.name || 'Restaurant'}</p>
                        <p className="text-sm text-gray-600 mt-2">Order ID</p>
                        <p className="font-semibold text-gray-900">#{order._id.slice(-8).toUpperCase()}</p>
                    </div>

                    {/* Rating */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                            Your Rating *
                        </label>
                        <div className="flex items-center gap-3">
                            <StarRating value={rating} onChange={setRating} size="xl" />
                            {rating > 0 && (
                                <span className="text-lg font-semibold text-gray-700">
                                    {rating} {rating === 1 ? 'Star' : 'Stars'}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Comment */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Your Review *
                        </label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Share your experience with this restaurant..."
                            className="w-full border rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none min-h-[120px]"
                            maxLength={500}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            {comment.length}/500 characters
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || rating === 0 || !comment.trim()}
                            className="flex-1 px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Submitting...' : 'Submit Review'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReviewFormModal;
