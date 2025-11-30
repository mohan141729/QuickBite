import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';

const CancelOrderModal = ({ order, onClose, onConfirm }) => {
    const [reason, setReason] = useState('');
    const [selectedReason, setSelectedReason] = useState('');
    const [loading, setLoading] = useState(false);

    const predefinedReasons = [
        'Changed my mind',
        'Ordered by mistake',
        'Too long delivery time',
        'Found a better deal',
        'Restaurant is closed',
        'Other'
    ];

    const handleSubmit = async () => {
        const finalReason = selectedReason === 'Other' ? reason : selectedReason;

        if (!finalReason) {
            alert('Please select or provide a cancellation reason');
            return;
        }

        setLoading(true);
        try {
            await onConfirm(finalReason);
        } finally {
            setLoading(false);
        }
    };

    // Check if order can be cancelled
    const canCancel = ['processing', 'accepted'].includes(order.orderStatus);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-gray-900">Cancel Order</h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    {!canCancel ? (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="font-semibold text-red-900">Cannot Cancel Order</p>
                                <p className="text-sm text-red-700 mt-1">
                                    This order cannot be cancelled as it's already {order.orderStatus}.
                                    Please contact support for assistance.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="mb-6">
                                <p className="text-gray-600 mb-4">
                                    Are you sure you want to cancel this order?
                                </p>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-sm text-gray-600">Order ID</p>
                                    <p className="font-semibold text-gray-900">#{order._id.slice(-8).toUpperCase()}</p>
                                    <p className="text-sm text-gray-600 mt-2">Total Amount</p>
                                    <p className="font-semibold text-gray-900">₹{order.totalAmount}</p>
                                    {order.paymentStatus === 'paid' && (
                                        <p className="text-sm text-green-600 mt-2">
                                            ✓ Refund will be processed to your original payment method
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Cancellation Reasons */}
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Reason for cancellation *
                                </label>
                                <div className="space-y-2">
                                    {predefinedReasons.map((r) => (
                                        <label
                                            key={r}
                                            className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition"
                                        >
                                            <input
                                                type="radio"
                                                name="reason"
                                                value={r}
                                                checked={selectedReason === r}
                                                onChange={(e) => setSelectedReason(e.target.value)}
                                                className="w-4 h-4 text-orange-500 focus:ring-orange-500"
                                            />
                                            <span className="text-gray-700">{r}</span>
                                        </label>
                                    ))}
                                </div>

                                {selectedReason === 'Other' && (
                                    <textarea
                                        value={reason}
                                        onChange={(e) => setReason(e.target.value)}
                                        placeholder="Please describe your reason..."
                                        className="mt-3 w-full border rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                                        rows="3"
                                    />
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3">
                                <button
                                    onClick={onClose}
                                    className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition"
                                    disabled={loading}
                                >
                                    Keep Order
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading || !selectedReason}
                                    className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Cancelling...' : 'Cancel Order'}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CancelOrderModal;
