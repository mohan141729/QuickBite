import React, { useState, useEffect } from 'react';
import TopBar from '../components/TopBar';
import DataTable from '../components/DataTable';
import { Bike, CheckCircle, XCircle } from 'lucide-react';
import { getAllDeliveryPartners, updateDeliveryPartnerStatus } from '../api/delivery';
import toast from 'react-hot-toast';

const DeliveryPartners = () => {
    const [partners, setPartners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        fetchPartners();
    }, []);

    const fetchPartners = async () => {
        try {
            setLoading(true);
            const response = await getAllDeliveryPartners();
            setPartners(response.data || []);
        } catch (error) {
            console.error('Error fetching delivery partners:', error);
            toast.error('Failed to load delivery partners');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            await updateDeliveryPartnerStatus(id, status);
            toast.success(`Delivery partner ${status} successfully`);
            fetchPartners();
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Failed to update delivery partner status');
        }
    };

    const columns = [
        {
            key: 'user',
            label: 'Partner Name',
            render: (value) => (
                <div>
                    <p className="font-medium text-gray-900">{value?.name || 'N/A'}</p>
                    <p className="text-sm text-gray-500">{value?.email || 'N/A'}</p>
                </div>
            ),
        },
        {
            key: 'totalDeliveries',
            label: 'Total Deliveries',
            render: (value) => <span className="font-semibold text-gray-900">{value || 0}</span>,
        },
        {
            key: 'earnings',
            label: 'Earnings',
            render: (value) => <span className="font-semibold text-green-600">₹{value || 0}</span>,
        },
        {
            key: 'isAvailable',
            label: 'Availability',
            render: (value) => (
                <span className={`badge ${value ? 'badge-success' : 'badge-default'}`}>
                    {value ? 'Available' : 'Unavailable'}
                </span>
            ),
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

    const filteredPartners = filterStatus === 'all'
        ? partners
        : partners.filter(p => p.status === filterStatus);

    return (
        <div className="flex-1 bg-gray-50 min-h-screen">
            <TopBar title="Delivery Partners" />

            <div className="pt-16 pl-64">
                <div className="p-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                                <Bike className="w-8 h-8 text-indigo-600" />
                                Delivery Partner Management
                            </h2>
                            <p className="text-gray-600 mt-1">Manage delivery partner approvals and status</p>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
                            <p className="text-gray-600 text-sm">Total Partners</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{partners.length}</p>
                        </div>
                        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
                            <p className="text-gray-600 text-sm">Pending Approval</p>
                            <p className="text-3xl font-bold text-orange-600 mt-2">
                                {partners.filter(p => p.status === 'pending').length}
                            </p>
                        </div>
                        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
                            <p className="text-gray-600 text-sm">Active Partners</p>
                            <p className="text-3xl font-bold text-green-600 mt-2">
                                {partners.filter(p => p.status === 'approved').length}
                            </p>
                        </div>
                        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
                            <p className="text-gray-600 text-sm">Rejected</p>
                            <p className="text-3xl font-bold text-red-600 mt-2">
                                {partners.filter(p => p.status === 'rejected').length}
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
                            data={filteredPartners}
                            loading={loading}
                            actions={false}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeliveryPartners;
