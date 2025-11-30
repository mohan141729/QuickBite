import React, { useState, useEffect } from "react";
import { Store, MapPin, Phone, Clock, Image as ImageIcon, Save, Loader2, CreditCard, FileText, Navigation } from "lucide-react";
import { updateRestaurant } from "../../api/restaurants";
import { useAuth } from "../../context/AuthContext";
import ImageUpload from "../../components/ImageUpload";
import toast from "react-hot-toast";

const SettingsTab = ({ restaurant, onRestaurantUpdated }) => {
    const { token } = useAuth();
    const [form, setForm] = useState({
        name: restaurant?.name || "",
        description: restaurant?.description || "",
        phone: restaurant?.phone || "",
        image: restaurant?.image || "",
        address: restaurant?.location?.address || "",
        city: restaurant?.location?.city || "",
        pincode: restaurant?.location?.pincode || "",
        cuisine: Array.isArray(restaurant?.cuisine) ? restaurant.cuisine.join(", ") : "",
        // New Fields
        openTime: restaurant?.operatingHours?.open || "09:00",
        closeTime: restaurant?.operatingHours?.close || "22:00",
        deliveryRadius: restaurant?.deliveryRadius || 5,
        commissionRate: restaurant?.commissionRate || 20,
        accountNumber: restaurant?.bankAccount?.accountNumber || "",
        ifscCode: restaurant?.bankAccount?.ifscCode || "",
        accountHolderName: restaurant?.bankAccount?.accountHolderName || "",
        fssai: restaurant?.documents?.fssai || "",
        gst: restaurant?.documents?.gst || "",
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (restaurant) {
            setForm({
                name: restaurant.name || "",
                description: restaurant.description || "",
                phone: restaurant.phone || "",
                image: restaurant.image || "",
                address: restaurant.location?.address || "",
                city: restaurant.location?.city || "",
                pincode: restaurant.location?.pincode || "",
                cuisine: Array.isArray(restaurant.cuisine) ? restaurant.cuisine.join(", ") : "",
                openTime: restaurant.operatingHours?.open || "09:00",
                closeTime: restaurant.operatingHours?.close || "22:00",
                deliveryRadius: restaurant.deliveryRadius || 5,
                commissionRate: restaurant.commissionRate || 20,
                accountNumber: restaurant.bankAccount?.accountNumber || "",
                ifscCode: restaurant.bankAccount?.ifscCode || "",
                accountHolderName: restaurant.bankAccount?.accountHolderName || "",
                fssai: restaurant.documents?.fssai || "",
                gst: restaurant.documents?.gst || "",
            });
        }
    }, [restaurant]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const payload = {
                name: form.name,
                description: form.description,
                phone: form.phone,
                image: form.image,
                location: {
                    address: form.address,
                    city: form.city,
                    pincode: form.pincode,
                },
                cuisine: form.cuisine.split(",").map((c) => c.trim()).filter(Boolean),
                operatingHours: {
                    open: form.openTime,
                    close: form.closeTime,
                },
                deliveryRadius: Number(form.deliveryRadius),
                bankAccount: {
                    accountNumber: form.accountNumber,
                    ifscCode: form.ifscCode,
                    accountHolderName: form.accountHolderName,
                },
                documents: {
                    fssai: form.fssai,
                    gst: form.gst,
                },
            };

            const updated = await updateRestaurant(restaurant._id, payload, token);
            toast.success("Restaurant updated successfully!");
            if (onRestaurantUpdated) {
                onRestaurantUpdated(updated);
            }
        } catch (error) {
            console.error("Failed to update restaurant:", error);
            toast.error("Failed to update restaurant");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-md p-8">
                <div className="flex items-center gap-3 mb-6">
                    <Store className="w-6 h-6 text-orange-500" />
                    <h2 className="text-2xl font-bold text-gray-800">Restaurant Settings</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Restaurant Image */}
                    <div>
                        <ImageUpload
                            label="Restaurant Image"
                            onImageUploaded={(url) => setForm((prev) => ({ ...prev, image: url }))}
                            initialImage={form.image}
                        />
                    </div>

                    {/* Basic Information */}
                    <section>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <Store className="w-5 h-5 text-gray-500" /> Basic Information
                        </h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Restaurant Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={form.phone}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 outline-none"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                <textarea
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    rows="3"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 outline-none"
                                    placeholder="Tell customers about your restaurant..."
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Cuisine Types (comma-separated)</label>
                                <input
                                    type="text"
                                    name="cuisine"
                                    value={form.cuisine}
                                    onChange={handleChange}
                                    placeholder="e.g. Italian, Chinese, Indian"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 outline-none"
                                />
                            </div>
                        </div>
                    </section>

                    <hr className="border-gray-100" />

                    {/* Operations & Location */}
                    <section>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-gray-500" /> Operations & Location
                        </h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Opening Time</label>
                                <input
                                    type="time"
                                    name="openTime"
                                    value={form.openTime}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Closing Time</label>
                                <input
                                    type="time"
                                    name="closeTime"
                                    value={form.closeTime}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Navigation className="w-4 h-4 inline mr-2" />
                                    Delivery Radius (km)
                                </label>
                                <input
                                    type="number"
                                    name="deliveryRadius"
                                    value={form.deliveryRadius}
                                    onChange={handleChange}
                                    min="1"
                                    max="50"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Commission Rate (%)</label>
                                <input
                                    type="number"
                                    name="commissionRate"
                                    value={form.commissionRate}
                                    disabled
                                    className="w-full border border-gray-200 bg-gray-50 text-gray-500 rounded-lg px-4 py-2 outline-none cursor-not-allowed"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <MapPin className="w-4 h-4 inline mr-2" />
                                    Address
                                </label>
                                <input
                                    type="text"
                                    name="address"
                                    value={form.address}
                                    onChange={handleChange}
                                    placeholder="Street Address"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 outline-none mb-3"
                                />
                                <div className="grid grid-cols-2 gap-3">
                                    <input
                                        type="text"
                                        name="city"
                                        value={form.city}
                                        onChange={handleChange}
                                        placeholder="City"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 outline-none"
                                    />
                                    <input
                                        type="text"
                                        name="pincode"
                                        value={form.pincode}
                                        onChange={handleChange}
                                        placeholder="Pincode"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    <hr className="border-gray-100" />

                    {/* Banking & Documents */}
                    <section>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-gray-500" /> Banking & Documents
                        </h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Account Number</label>
                                <input
                                    type="text"
                                    name="accountNumber"
                                    value={form.accountNumber}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">IFSC Code</label>
                                <input
                                    type="text"
                                    name="ifscCode"
                                    value={form.ifscCode}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 outline-none"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Account Holder Name</label>
                                <input
                                    type="text"
                                    name="accountHolderName"
                                    value={form.accountHolderName}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <FileText className="w-4 h-4 inline mr-2" />
                                    FSSAI License
                                </label>
                                <input
                                    type="text"
                                    name="fssai"
                                    value={form.fssai}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <FileText className="w-4 h-4 inline mr-2" />
                                    GST Number
                                </label>
                                <input
                                    type="text"
                                    name="gst"
                                    value={form.gst}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 outline-none"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Submit Button */}
                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex items-center gap-2 bg-gradient-to-r from-[#FC8019] to-[#E23744] text-white font-semibold px-8 py-3 rounded-lg hover:opacity-90 transition disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                            {saving ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="w-5 h-5" />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SettingsTab;
