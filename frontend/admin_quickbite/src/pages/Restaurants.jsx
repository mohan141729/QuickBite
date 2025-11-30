import { useState, useEffect } from 'react';
import TopBar from '../components/TopBar';
import DataTable from '../components/DataTable';
import RestaurantDetailsModal from '../components/RestaurantDetailsModal';
import { Store, CheckCircle, XCircle, Eye } from 'lucide-react';
import { getAllRestaurants, updateRestaurantStatus } from '../api/restaurants';

const Restaurants = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('all');
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);

    useEffect(() => {
        fetchRestaurants();
    }, []);

    const fetchRestaurants = async () => {
        try {
            setLoading(true);
            const response = await getAllRestaurants();
            // Flatten data for DataTable search
            const formattedData = (response.data || []).map(r => ({
                ...r,
                address: r.location?.address || '',
                email: r.ownerDetails?.email || 'N/A'
            }));
            setRestaurants(formattedData);
        } catch (error) {
            console.error('Error fetching restaurants:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            await updateRestaurantStatus(id, status);
            fetchRestaurants();
            if (selectedRestaurant && selectedRestaurant._id === id) {
                setSelectedRestaurant(null); // Close modal on update
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const columns = [
        {
            key: 'name',
            label: 'Restaurant Name',
            render: (value, row) => (
                <div>
                    <p className="font-medium text-gray-900">{value}</p>
                    <p className="text-sm text-gray-500">{row.cuisine?.join(', ') || 'N/A'}</p>
                </div>
            ),
        },
        {
            key: 'email',
            label: 'Contact',
            render: (value, row) => (
                <div>
                    <p className="text-sm text-gray-900">{value}</p>
                    <p className="text-sm text-gray-500">{row.phone || 'N/A'}</p>
                </div>
            ),
        },
        {
            key: 'address',
            label: 'Location',
            render: (value) => <span className="text-sm text-gray-600 truncate max-w-xs block">{value || 'N/A'}</span>,
        },
        {
            key: 'status',
            label: 'Status',
            render: (value) => (
                <span className={`badge ${value === 'approved' ? 'badge-success' :
                    value === 'rejected' ? 'badge-error' :
                        'badge-warning'
                    }`}>
                    {value ? value.charAt(0).toUpperCase() + value.slice(1) : 'Pending'}
                </span>
            ),
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (_, row) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => setSelectedRestaurant(row)}
                        className="p-1 text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                        title="View Details"
                    >
                        <Eye className="w-5 h-5" />
                    </button>
                    {row.status === 'pending' && (
                        <>
                            <button
                                onClick={() => handleStatusUpdate(row._id, 'approved')}
                                className="p-1 text-green-600 hover:bg-green-50 rounded-full transition-colors"
                                title="Approve"
                            >
                                <CheckCircle className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => handleStatusUpdate(row._id, 'rejected')}
                                className="p-1 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                title="Reject"
                            >
                                <XCircle className="w-5 h-5" />
                            </button>
                        </>
                    )}
                </div>
            ),
        },
    ];

    const filteredRestaurants = filterStatus === 'all'
        ? restaurants
        : restaurants.filter(r => r.status === filterStatus);

    return (
        <div className="flex-1 bg-slate-50 min-h-screen">
            <TopBar title="Restaurant Management" />

            <div className="pt-24 px-8 pb-12 animate-fade-in">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                                <Store className="w-6 h-6" />
                            </div>
                            Restaurant Management
                        </h2>
                        <p className="text-slate-500 mt-1 ml-11">Manage restaurant approvals and status</p>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="card-premium p-6">
                        <p className="text-slate-500 text-sm font-medium">Total Restaurants</p>
                        <p className="text-3xl font-bold text-slate-800 mt-2">{restaurants.length}</p>
                    </div>
                    <div className="card-premium p-6">
                        <p className="text-slate-500 text-sm font-medium">Pending Approval</p>
                        <p className="text-3xl font-bold text-orange-600 mt-2">
                            {restaurants.filter(r => r.status === 'pending').length}
                        </p>
                    </div>
                    <div className="card-premium p-6">
                        <p className="text-slate-500 text-sm font-medium">Active Restaurants</p>
                        <p className="text-3xl font-bold text-emerald-600 mt-2">
                            {restaurants.filter(r => r.status === 'approved').length}
                        </p>
                    </div>
                    <div className="card-premium p-6">
                        <p className="text-slate-500 text-sm font-medium">Rejected</p>
                        <p className="text-3xl font-bold text-red-600 mt-2">
                            {restaurants.filter(r => r.status === 'rejected').length}
                        </p>
                    </div>
                </div>

                {/* Filters */}
                <div className="card-premium p-6 mb-6">
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-slate-700">Filter by Status:</span>
                        <div className="flex gap-2">
                            {['all', 'pending', 'approved', 'rejected'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setFilterStatus(status)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${filterStatus === status
                                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                        }`}
                                >
                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Data Table */}
                <div className="card-premium p-6">
                    <DataTable
                        columns={columns}
                        data={filteredRestaurants}
                        loading={loading}
                        actions={false}
                    />
                </div>
            </div>

            {/* Details Modal */}
            {selectedRestaurant && (
                <RestaurantDetailsModal
                    restaurant={selectedRestaurant}
                    onClose={() => setSelectedRestaurant(null)}
                    onStatusUpdate={handleStatusUpdate}
                />
            )}
        </div>
    );
};

export default Restaurants;
