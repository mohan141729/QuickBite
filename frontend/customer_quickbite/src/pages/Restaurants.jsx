import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import RestaurantCard from "../components/RestaurantCard";
import FilterPanel from "../components/FilterPanel";
import api from "../api/api";
import { Search } from "lucide-react";

const Restaurants = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');

  // Initialize filters from URL params
  const [filters, setFilters] = useState({
    q: searchParams.get('q') || '',
    cuisine: searchParams.get('cuisine') || '',
    rating: searchParams.get('rating') || '',
    veg: searchParams.get('veg') || '',
    sort: searchParams.get('sort') || ''
  });

  // Fetch restaurants with filters
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);

        // Build query params (only include non-empty values)
        const params = {};
        Object.keys(filters).forEach(key => {
          if (filters[key]) params[key] = filters[key];
        });

        const hasFilters = Object.keys(params).length > 0;
        const endpoint = hasFilters ? '/api/restaurants/search' : '/api/restaurants';

        const res = await api.get(endpoint, { params });

        // Filter only approved restaurants
        const approved = res.data.filter(r => r.status === 'approved');
        setRestaurants(approved);
      } catch (error) {
        console.error("Failed to fetch restaurants:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();

    // Update URL params
    const params = {};
    Object.keys(filters).forEach(key => {
      if (filters[key]) params[key] = filters[key];
    });
    setSearchParams(params);
  }, [filters, setSearchParams]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      q: '',
      cuisine: '',
      rating: '',
      veg: '',
      sort: ''
    });
    setSearchQuery('');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters({ ...filters, q: searchQuery });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Header with Search */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Discover Restaurants</h1>
          <p className="text-orange-100 mb-6">Find the best food near you</p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for restaurants or cuisines..."
                className="w-full px-4 py-3 pl-12 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-orange-500 text-white px-6 py-2 rounded-md hover:bg-orange-600 transition font-semibold"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          {/* Filter Panel - Sidebar */}
          <div className="w-64 flex-shrink-0 hidden lg:block">
            <div className="sticky top-24">
              <FilterPanel
                filters={filters}
                onFilterChange={handleFilterChange}
                onClear={handleClearFilters}
              />
            </div>
          </div>

          {/* Results */}
          <div className="flex-1">
            {/* Mobile Filter Button */}
            <div className="lg:hidden mb-4">
              <FilterPanel
                filters={filters}
                onFilterChange={handleFilterChange}
                onClear={handleClearFilters}
              />
            </div>

            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {loading ? "Loading..." : `${restaurants.length} Restaurants`}
              </h2>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white rounded-2xl p-4 shadow-sm animate-pulse">
                    <div className="w-full h-48 bg-gray-200 rounded-xl mb-4"></div>
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            )}

            {/* Results Grid */}
            {!loading && restaurants.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {restaurants.map((restaurant) => (
                  <RestaurantCard key={restaurant._id} restaurant={restaurant} />
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && restaurants.length === 0 && (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No restaurants found</h3>
                <p className="text-gray-500 mb-4">Try adjusting your filters or search query</p>
                <button
                  onClick={handleClearFilters}
                  className="text-orange-500 font-semibold hover:text-orange-600"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Restaurants;
