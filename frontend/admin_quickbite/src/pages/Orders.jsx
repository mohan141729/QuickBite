import React, { useState, useEffect } from 'react';
import TopBar from '../components/TopBar';
import DataTable from '../components/DataTable';
import { Package, Download, Filter, X } from 'lucide-react';
import { getAllOrders } from '../api/orders';
import toast from 'react-hot-toast';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await getAllOrders();
            setOrders(response.data.orders || []);
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast.error('Failed to load orders');
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    const handleView = (order) => {
        setSelectedOrder(order);
        setShowModal(true);
    };

    const getStatusBadge = (status) => {
        const badges = {
            delivered: 'badge-success',
            on_the_way: 'badge-info',
            picked_up: 'badge-info',
            preparing: 'badge-warning',
            pending: 'badge-default',
            cancelled: 'badge-error',
        };
        return badges[status] || 'badge-default';
    };

    const columns = [
        {
            key: '_id',
            label: 'Order ID',
            render: (value) => `#${value.slice(-6).toUpperCase()}`,
        },
        {
            key: 'customer',
            label: 'Customer',
            render: (value) => value?.name || 'N/A',
        },
        {
            key: 'restaurant',
            label: 'Restaurant',
            render: (value) => value?.name || 'N/A',
        },
        {
            key: 'deliveryPartner',
            label: 'Delivery Partner',
            render: (value) => value?.name || 'Not Assigned',
        },
        {
            key: 'totalAmount',
            label: 'Amount',
            render: (value) => `₹${value}`,
        },
        {
            key: 'orderStatus',
            label: 'Status',
            render: (value) => (
                <span className={`badge ${getStatusBadge(value)}`}>
                    {value.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
            ),
        },
        {
            key: 'createdAt',
            label: 'Date',
            render: (value) => new Date(value).toLocaleString(),
        },
    ];

    // Filter orders by status
    const filteredOrders = filterStatus === 'all'
        ? orders
        : orders.filter(o => o.orderStatus === filterStatus);

    return (
        <div className="flex-1 bg-gray-50 min-h-screen">
            <TopBar title="Order Management" />

            <div className="pt-16 pl-64">
                <div className="p-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                                <Package className="w-8 h-8 text-indigo-600" />
                                Order Management
                            </h2>
                            <p className="text-gray-600 mt-1">Monitor all platform orders</p>
                        </div>
                        <button className="btn-primary flex items-center gap-2">
                            <Download className="w-5 h-5" />
                            Export Orders
                        </button>
                    </div>

                    {/* Filters */}
                    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 mb-6">
                        <div className="flex items-center gap-4">
                            <Filter className="w-5 h-5 text-gray-600" />
                            <span className="text-sm font-medium text-gray-700">Filter by Status:</span>
                            <div className="flex gap-2 flex-wrap">
                                {['all', 'pending', 'preparing', 'picked_up', 'on_the_way', 'delivered', 'cancelled'].map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => setFilterStatus(status)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterStatus === status
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        {status === 'all' ? 'All' : status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Statistics */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
                            <p className="text-gray-600 text-sm">Total Orders</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{orders.length}</p>
                        </div>
                        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
                            <p className="text-gray-600 text-sm">Pending</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">
                                {orders.filter(o => o.orderStatus === 'pending').length}
                            </p>
                        </div>
                        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
                            <p className="text-gray-600 text-sm">In Progress</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">
                                {orders.filter(o => ['preparing', 'picked_up', 'on_the_way'].includes(o.orderStatus)).length}
                            </p>
                        </div>
                        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
                            <p className="text-gray-600 text-sm">Delivered</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">
                                {orders.filter(o => o.orderStatus === 'delivered').length}
                            </p>
                        </div>
                    </div>

                    {/* Data Table */}
                    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
                        <DataTable
                            columns={columns}
                            data={filteredOrders}
                            loading={loading}
                            onView={handleView}
                            actions={true}
                            onDelete={null}
                            onEdit={null}
                        />
                    </div>
                </div>
            </div>

            {/* Order Detail Modal */}
            {showModal && selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Order Details</h3>
                                <p className="text-sm text-gray-600">#{selectedOrder._id.slice(-6).toUpperCase()}</p>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Status */}
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <span className="text-sm font-medium text-gray-600">Order Status</span>
                                <span className={`badge ${getStatusBadge(selectedOrder.orderStatus)}`}>
                                    {selectedOrder.orderStatus.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                </span>
                            </div>

                            {/* Customer & Restaurant Info */}
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-3">Customer</h4>
                                    <p className="text-gray-700">{selectedOrder.customer?.name || 'N/A'}</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-3">Restaurant</h4>
                                    <p className="text-gray-700">{selectedOrder.restaurant?.name || 'N/A'}</p>
                                </div>
                                {selectedOrder.deliveryPartner && (
                                    <div className="col-span-2">
                                        <h4 className="font-semibold text-gray-900 mb-3">Delivery Partner</h4>
                                        <p className="text-gray-700">{selectedOrder.deliveryPartner.name}</p>
                                    </div>
                                )}
                            </div>

                            {/* Order Items */}
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-3">Order Items</h4>
                                <div className="space-y-2">
                                    {selectedOrder.items?.map((item, index) => (
                                        <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                            <div>
                                                <p className="font-medium text-gray-900">{item.name}</p>
                                                <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                            </div>
                                            <p className="font-semibold text-gray-900">₹{item.price}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Total */}
                            <div className="flex justify-between items-center p-4 bg-indigo-50 rounded-lg border-2 border-indigo-200">
                                <span className="font-semibold text-gray-900 text-lg">Total Amount</span>
                                <span className="font-bold text-2xl text-indigo-600">₹{selectedOrder.totalAmount}</span>
                            </div>

                            {/* Date */}
                            <div className="text-sm text-gray-600">
                                <p>Order Date: {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Orders;
