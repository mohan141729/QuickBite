import React, { useState, useEffect } from 'react';
import TopBar from '../components/TopBar';
import DataTable from '../components/DataTable';
import { Store, CheckCircle, XCircle } from 'lucide-react';
import { getAllRestaurants, updateRestaurantStatus } from '../api/restaurants';
import toast from 'react-hot-toast';

const Restaurants = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        fetchRestaurants();
    }, []);

    const fetchRestaurants = async () => {
        try {
            setLoading(true);
            const response = await getAllRestaurants();
            setRestaurants(response.data || []);
        } catch (error) {
            console.error('Error fetching restaurants:', error);
            toast.error('Failed to load restaurants');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            await updateRestaurantStatus(id, status);
            toast.success(`Restaurant ${status} successfully`);
            fetchRestaurants();
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Failed to update restaurant status');
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
                    {row.status === 'approved' && (
                        <button
                            onClick={() => handleStatusUpdate(row._id, 'rejected')}
                            className="text-xs text-red-600 hover:underline"
                        >
                            Reject
                        </button>
                    )}
                    {row.status === 'rejected' && (
                        <button
                            onClick={() => handleStatusUpdate(row._id, 'approved')}
                            className="text-xs text-green-600 hover:underline"
                        >
                            Approve
                        </button>
                    )}
                </div>
            ),
        },
    ];

    const filteredRestaurants = filterStatus === 'all'
        ? restaurants
        : restaurants.filter(r => r.status === filterStatus);

    return (
        <div className="flex-1 bg-gray-50 min-h-screen">
            <TopBar title="Restaurant Management" />

            <div className="pt-16 pl-64">
                <div className="p-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                                <Store className="w-8 h-8 text-indigo-600" />
                                Restaurant Management
                            </h2>
                            <p className="text-gray-600 mt-1">Manage restaurant approvals and status</p>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
                            <p className="text-gray-600 text-sm">Total Restaurants</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{restaurants.length}</p>
                        </div>
                        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
                            <p className="text-gray-600 text-sm">Pending Approval</p>
                            <p className="text-3xl font-bold text-orange-600 mt-2">
                                {restaurants.filter(r => r.status === 'pending').length}
                            </p>
                        </div>
                        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
                            <p className="text-gray-600 text-sm">Active Restaurants</p>
                            <p className="text-3xl font-bold text-green-600 mt-2">
                                {restaurants.filter(r => r.status === 'approved').length}
                            </p>
                        </div>
                        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
                            <p className="text-gray-600 text-sm">Rejected</p>
                            <p className="text-3xl font-bold text-red-600 mt-2">
                                {restaurants.filter(r => r.status === 'rejected').length}
                            </p>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 mb-6">
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-medium text-gray-700">Filter by Status:</span>
                            <div className="flex gap-2">
                                {['all', 'pending', 'approved', 'rejected'].map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => setFilterStatus(status)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterStatus === status
                                                ? 'bg-indigo-600 text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Data Table */}
                    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
                        <DataTable
                            columns={columns}
                            data={filteredRestaurants}
                            loading={loading}
                            actions={false}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Restaurants;
