import React from 'react';
import { X, Clock, MapPin, CreditCard, FileText, CheckCircle, XCircle } from 'lucide-react';

const RestaurantDetailsModal = ({ restaurant, onClose, onStatusUpdate }) => {
    if (!restaurant) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex justify-between items-start bg-gray-50">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">{restaurant.name}</h2>
                        <p className="text-gray-500 text-sm mt-1">
                            Status: <span className={`font-semibold capitalize ${restaurant.status === 'approved' ? 'text-green-600' :
                                    restaurant.status === 'rejected' ? 'text-red-600' : 'text-orange-600'
                                }`}>{restaurant.status}</span>
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Basic Info</h3>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-xs text-gray-500">Cuisine</p>
                                    <p className="font-medium text-gray-800">{restaurant.cuisine?.join(', ') || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Phone</p>
                                    <p className="font-medium text-gray-800">{restaurant.phone || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Email</p>
                                    <p className="font-medium text-gray-800">{restaurant.ownerDetails?.email || 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Location</h3>
                            <div className="flex gap-3 items-start">
                                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="font-medium text-gray-800">{restaurant.location?.address}</p>
                                    <p className="text-gray-600">{restaurant.location?.city}, {restaurant.location?.pincode}</p>
                                    <p className="text-xs text-indigo-600 mt-1 font-medium">
                                        Delivery Radius: {restaurant.deliveryRadius || 5} km
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* Operating Hours */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <Clock className="w-4 h-4" /> Operating Hours
                        </h3>
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 inline-block">
                            <div className="flex items-center gap-8">
                                <div>
                                    <p className="text-xs text-gray-500">Opens at</p>
                                    <p className="text-lg font-bold text-gray-800">{restaurant.operatingHours?.open || '09:00'}</p>
                                </div>
                                <div className="h-8 w-px bg-gray-300"></div>
                                <div>
                                    <p className="text-xs text-gray-500">Closes at</p>
                                    <p className="text-lg font-bold text-gray-800">{restaurant.operatingHours?.close || '22:00'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* Bank & Documents */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <CreditCard className="w-4 h-4" /> Bank Details
                            </h3>
                            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-500 text-sm">Account Holder</span>
                                    <span className="font-medium text-gray-800">{restaurant.bankAccount?.accountHolderName || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500 text-sm">Account Number</span>
                                    <span className="font-medium text-gray-800">{restaurant.bankAccount?.accountNumber || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500 text-sm">IFSC Code</span>
                                    <span className="font-medium text-gray-800">{restaurant.bankAccount?.ifscCode || 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <FileText className="w-4 h-4" /> Documents
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                                    <span className="text-sm font-medium text-gray-700">FSSAI License</span>
                                    <span className="text-sm text-gray-500 font-mono">{restaurant.documents?.fssai || 'Not Uploaded'}</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                                    <span className="text-sm font-medium text-gray-700">GST Number</span>
                                    <span className="text-sm text-gray-500 font-mono">{restaurant.documents?.gst || 'Not Uploaded'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                    {restaurant.status === 'pending' ? (
                        <>
                            <button
                                onClick={() => onStatusUpdate(restaurant._id, 'rejected')}
                                className="px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50 font-medium flex items-center gap-2 transition"
                            >
                                <XCircle className="w-4 h-4" /> Reject
                            </button>
                            <button
                                onClick={() => onStatusUpdate(restaurant._id, 'approved')}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium flex items-center gap-2 transition shadow-sm"
                            >
                                <CheckCircle className="w-4 h-4" /> Approve Restaurant
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={onClose}
                            className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-medium transition"
                        >
                            Close
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RestaurantDetailsModal;
