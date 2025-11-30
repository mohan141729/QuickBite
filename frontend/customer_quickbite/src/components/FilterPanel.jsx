import React, { useState, useEffect } from 'react';
import { Filter, X, ChevronDown } from 'lucide-react';

const FilterPanel = ({ filters, onFilterChange, onClear }) => {
    const [isOpen, setIsOpen] = useState(false);

    const cuisines = ['Italian', 'Chinese', 'Indian', 'Mexican', 'Japanese', 'Thai', 'American'];

    const handleCuisineToggle = (cuisine) => {
        const current = filters.cuisine ? filters.cuisine.split(',') : [];
        const updated = current.includes(cuisine)
            ? current.filter(c => c !== cuisine)
            : [...current, cuisine];

        onFilterChange({ ...filters, cuisine: updated.join(',') });
    };

    const selectedCuisines = filters.cuisine ? filters.cuisine.split(',') : [];

    return (
        <>
            {/* Mobile Filter Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border rounded-lg shadow-sm"
            >
                <Filter className="w-4 h-4" />
                Filters
                {Object.keys(filters).filter(k => filters[k]).length > 0 && (
                    <span className="bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {Object.keys(filters).filter(k => filters[k]).length}
                    </span>
                )}
            </button>

            {/* Filter Panel */}
            <div className={`${isOpen ? 'fixed inset-0 z-50 lg:relative lg:block' : 'hidden lg:block'}`}>
                {/* Mobile Backdrop */}
                {isOpen && (
                    <div className="lg:hidden fixed inset-0 bg-black/50" onClick={() => setIsOpen(false)} />
                )}

                {/* Filter Content */}
                <div className={`${isOpen ? 'fixed right-0 top-0 h-full w-80 animate-slide-in-right' : 'relative'} bg-white lg:rounded-xl lg:shadow-sm lg:border border-gray-100 p-6 overflow-y-auto`}>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-lg flex items-center gap-2">
                            <Filter className="w-5 h-5" />
                            Filters
                        </h3>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => { onClear(); setIsOpen(false); }}
                                className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                            >
                                Clear All
                            </button>
                            {isOpen && (
                                <button onClick={() => setIsOpen(false)} className="lg:hidden">
                                    <X className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Sort */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-3">Sort By</label>
                        <select
                            value={filters.sort || ''}
                            onChange={(e) => onFilterChange({ ...filters, sort: e.target.value || undefined })}
                            className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                        >
                            <option value="">Relevance</option>
                            <option value="rating">Rating (High to Low)</option>
                            <option value="deliveryTime">Delivery Time</option>
                        </select>
                    </div>

                    {/* Rating */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-3">Rating</label>
                        <div className="space-y-2">
                            {['4.5', '4', '3.5'].map((rating) => (
                                <label key={rating} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="rating"
                                        checked={filters.rating === rating}
                                        onChange={() => onFilterChange({ ...filters, rating: filters.rating === rating ? undefined : rating })}
                                        className="w-4 h-4 text-orange-500 focus:ring-orange-500"
                                    />
                                    <span className="text-sm text-gray-700">{rating}★ & above</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Cuisine */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-3">Cuisine</label>
                        <div className="space-y-2">
                            {cuisines.map((cuisine) => (
                                <label key={cuisine} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedCuisines.includes(cuisine)}
                                        onChange={() => handleCuisineToggle(cuisine)}
                                        className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
                                    />
                                    <span className="text-sm text-gray-700">{cuisine}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Veg Only */}
                    <div className="mb-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={filters.veg === 'true'}
                                onChange={(e) => onFilterChange({ ...filters, veg: e.target.checked ? 'true' : undefined })}
                                className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                            />
                            <span className="text-sm font-semibold text-gray-700">Veg Only</span>
                        </label>
                    </div>

                    {/* Mobile Apply Button */}
                    {isOpen && (
                        <button
                            onClick={() => setIsOpen(false)}
                            className="lg:hidden w-full bg-orange-500 text-white font-semibold py-3 rounded-lg hover:bg-orange-600 transition"
                        >
                            Apply Filters
                        </button>
                    )}
                </div>
            </div>
        </>
    );
};

export default FilterPanel;
