import React, { useState, useEffect } from "react";
import { X, Plus, Minus } from "lucide-react";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";

const ItemCustomizationModal = ({ item, onClose }) => {
    const { addToCart } = useCart();
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [selectedAddOns, setSelectedAddOns] = useState([]);
    const [quantity, setQuantity] = useState(1);

    // Set default variant if exists
    useEffect(() => {
        if (item.variants && item.variants.length > 0) {
            setSelectedVariant(item.variants[0]);
        }
    }, [item]);

    const handleAddOnToggle = (addOn) => {
        if (selectedAddOns.find((a) => a._id === addOn._id || a.name === addOn.name)) {
            setSelectedAddOns((prev) => prev.filter((a) => a._id !== addOn._id && a.name !== addOn.name));
        } else {
            setSelectedAddOns((prev) => [...prev, addOn]);
        }
    };

    const calculateTotal = () => {
        let total = item.price;
        if (selectedVariant) {
            total = selectedVariant.price;
        }
        const addOnsTotal = selectedAddOns.reduce((sum, addon) => sum + addon.price, 0);
        return (total + addOnsTotal) * quantity;
    };

    const handleAddToCart = async () => {
        const customizedItem = {
            ...item,
            selectedVariant,
            selectedAddOns,
        };
        const success = await addToCart(customizedItem, quantity);
        if (success) {
            toast.success("Item added to cart");
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-xl flex flex-col max-h-[90vh] animate-slide-up">
                {/* Header */}
                <div className="p-4 border-b flex items-center justify-between sticky top-0 bg-white z-10 rounded-t-2xl">
                    <div>
                        <h2 className="text-lg font-bold text-gray-800">{item.name}</h2>
                        <p className="text-sm text-gray-500">Customize your order</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                        <X className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    {/* Variants */}
                    {item.variants && item.variants.length > 0 && (
                        <div>
                            <h3 className="font-semibold text-gray-700 mb-3">Quantity / Size</h3>
                            <div className="space-y-3">
                                {item.variants.map((variant, idx) => (
                                    <label
                                        key={idx}
                                        className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${selectedVariant?.name === variant.name
                                            ? "border-orange-500 bg-orange-50"
                                            : "border-gray-200"
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedVariant?.name === variant.name ? "border-orange-500" : "border-gray-400"
                                                }`}>
                                                {selectedVariant?.name === variant.name && (
                                                    <div className="w-2 h-2 rounded-full bg-orange-500" />
                                                )}
                                            </div>
                                            <span className="text-gray-700 font-medium">{variant.name}</span>
                                        </div>
                                        <span className="text-gray-900 font-semibold">₹{variant.price}</span>
                                        <input
                                            type="radio"
                                            name="variant"
                                            className="hidden"
                                            checked={selectedVariant?.name === variant.name}
                                            onChange={() => setSelectedVariant(variant)}
                                        />
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Add-ons */}
                    {item.addOns && item.addOns.length > 0 && (
                        <div>
                            <h3 className="font-semibold text-gray-700 mb-3">Add-ons</h3>
                            <div className="space-y-3">
                                {item.addOns.map((addOn, idx) => {
                                    const isSelected = selectedAddOns.some((a) => a.name === addOn.name);
                                    return (
                                        <label
                                            key={idx}
                                            className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${isSelected ? "border-green-500 bg-green-50" : "border-gray-200"
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-4 h-4 rounded border flex items-center justify-center ${isSelected ? "border-green-500 bg-green-500" : "border-gray-400"
                                                    }`}>
                                                    {isSelected && <div className="text-white text-xs">✓</div>}
                                                </div>
                                                <span className="text-gray-700 font-medium">{addOn.name}</span>
                                            </div>
                                            <span className="text-gray-900 font-semibold">+ ₹{addOn.price}</span>
                                            <input
                                                type="checkbox"
                                                className="hidden"
                                                checked={isSelected}
                                                onChange={() => handleAddOnToggle(addOn)}
                                            />
                                        </label>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t bg-white sticky bottom-0 rounded-b-2xl">
                    <div className="flex items-center justify-between gap-4">
                        {/* Quantity Stepper */}
                        <div className="flex items-center border border-gray-300 rounded-lg px-2 py-1">
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="p-2 text-gray-500 hover:text-orange-600"
                            >
                                <Minus className="w-4 h-4" />
                            </button>
                            <span className="font-bold text-gray-900 w-6 text-center">{quantity}</span>
                            <button
                                onClick={() => setQuantity(quantity + 1)}
                                className="p-2 text-gray-500 hover:text-orange-600"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Add Button */}
                        <button
                            onClick={handleAddToCart}
                            className="flex-1 bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 transition flex items-center justify-between px-6"
                        >
                            <span>Add Item</span>
                            <span>₹{calculateTotal()}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ItemCustomizationModal;
