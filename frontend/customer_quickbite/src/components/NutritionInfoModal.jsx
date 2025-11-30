import React from "react";
import { X, Activity } from "lucide-react";

const NutritionInfoModal = ({ item, onClose }) => {
    const nutrition = item.nutritionalInfo || {};
    const hasNutrition = nutrition.calories || nutrition.protein || nutrition.carbs || nutrition.fats;

    if (!hasNutrition) {
        return null;
    }

    const nutritionItems = [
        { label: "Calories", value: nutrition.calories, unit: "kcal", color: "orange" },
        { label: "Protein", value: nutrition.protein, unit: "g", color: "blue" },
        { label: "Carbs", value: nutrition.carbs, unit: "g", color: "green" },
        { label: "Fats", value: nutrition.fats, unit: "g", color: "yellow" },
        { label: "Fiber", value: nutrition.fiber, unit: "g", color: "purple" },
        { label: "Sodium", value: nutrition.sodium, unit: "mg", color: "red" },
    ].filter(item => item.value);

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md animate-fade-in">
                {/* Header */}
                <div className="p-4 border-b flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <Activity className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-800">Nutrition Facts</h2>
                            <p className="text-sm text-gray-500">{item.name}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                        <X className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-4 mb-4">
                        <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold mb-2">
                            Per Serving
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                            {nutritionItems.slice(0, 4).map((item) => (
                                <div key={item.label} className="text-center">
                                    <p className="text-2xl font-bold text-gray-900">{item.value}</p>
                                    <p className="text-xs text-gray-600">{item.label}</p>
                                    <p className="text-[10px] text-gray-400">{item.unit}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {nutritionItems.length > 4 && (
                        <div className="space-y-2">
                            <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold mb-2">
                                Additional Info
                            </p>
                            {nutritionItems.slice(4).map((item) => (
                                <div key={item.label} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                    <span className="text-sm font-medium text-gray-700">{item.label}</span>
                                    <span className="text-sm font-bold text-gray-900">
                                        {item.value} {item.unit}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                        <p className="text-xs text-blue-800">
                            <span className="font-semibold">Note:</span> Nutritional information is approximate and may vary based on preparation.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NutritionInfoModal;
