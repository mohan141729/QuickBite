import { useState, useEffect } from 'react';
import TopBar from '../components/TopBar';
import DataTable from '../components/DataTable';
import { Package, Download, Filter, X } from 'lucide-react';
import { getAllOrders } from '../api/orders';

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
            const response = await getAllOrders({ limit: 'all' });
            // Flatten data for DataTable search
            const formattedOrders = (response.data.orders || []).map(order => ({
                ...order,
                customerName: order.customerName || order.user?.name || order.customer?.name || 'Guest User',
                restaurantName: order.restaurant?.name || 'Unknown',
                deliveryPartnerName: order.deliveryPartner?.user?.name || 'Not Assigned'
            }));
            setOrders(formattedOrders);
        } catch (error) {
            console.error('Error fetching orders:', error);
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
            completed: 'badge-success',
            'out-for-delivery': 'badge-info',
            ready: 'badge-warning',
            accepted: 'badge-warning',
            processing: 'badge-default',
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
            key: 'customerName',
            label: 'Customer',
            render: (value) => value || 'N/A',
        },
        {
            key: 'restaurantName',
            label: 'Restaurant',
            render: (value) => value || 'N/A',
        },
        {
            key: 'deliveryPartnerName',
            label: 'Delivery Partner',
            render: (value) => value || 'Not Assigned',
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
                    {value.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
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
        <div className="flex-1 bg-slate-50 min-h-screen">
            <TopBar title="Order Management" />

            <div className="pt-24 px-8 pb-12 animate-fade-in">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                                <Package className="w-6 h-6" />
                            </div>
                            Order Management
                        </h2>
                        <p className="text-slate-500 mt-1 ml-11">Monitor all platform orders</p>
                    </div>
                    <button className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 hover:scale-105 transition-all duration-300 font-medium flex items-center gap-2">
                        <Download className="w-5 h-5" />
                        Export Orders
                    </button>
                </div>

                {/* Filters */}
                <div className="card-premium p-6 mb-6">
                    <div className="flex items-center gap-4">
                        <Filter className="w-5 h-5 text-slate-500" />
                        <span className="text-sm font-medium text-slate-700">Filter by Status:</span>
                        <div className="flex gap-2 flex-wrap">
                            {['all', 'processing', 'accepted', 'ready', 'out-for-delivery', 'delivered', 'cancelled'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setFilterStatus(status)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${filterStatus === status
                                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                        }`}
                                >
                                    {status === 'all' ? 'All' : status.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="card-premium p-6">
                        <p className="text-slate-500 text-sm font-medium">Total Orders</p>
                        <p className="text-3xl font-bold text-slate-800 mt-2">{orders.length}</p>
                    </div>
                    <div className="card-premium p-6">
                        <p className="text-slate-500 text-sm font-medium">Pending</p>
                        <p className="text-3xl font-bold text-slate-800 mt-2">
                            {orders.filter(o => o.orderStatus === 'processing').length}
                        </p>
                    </div>
                    <div className="card-premium p-6">
                        <p className="text-slate-500 text-sm font-medium">In Progress</p>
                        <p className="text-3xl font-bold text-slate-800 mt-2">
                            {orders.filter(o => ['accepted', 'ready', 'out-for-delivery'].includes(o.orderStatus)).length}
                        </p>
                    </div>
                    <div className="card-premium p-6">
                        <p className="text-slate-500 text-sm font-medium">Delivered</p>
                        <p className="text-3xl font-bold text-slate-800 mt-2">
                            {orders.filter(o => ['delivered', 'completed'].includes(o.orderStatus)).length}
                        </p>
                    </div>
                </div>

                {/* Data Table */}
                <div className="card-premium p-6">
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

            {/* Order Detail Modal */}
            {showModal && selectedOrder && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4 flex items-center justify-between z-10">
                            <div>
                                <h3 className="text-xl font-bold text-slate-800">Order Details</h3>
                                <p className="text-sm text-slate-500">#{selectedOrder._id.slice(-6).toUpperCase()}</p>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-slate-500" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Status */}
                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <span className="text-sm font-medium text-slate-600">Order Status</span>
                                <span className={`badge ${getStatusBadge(selectedOrder.orderStatus)}`}>
                                    {selectedOrder.orderStatus.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                </span>
                            </div>

                            {/* Customer & Restaurant Info */}
                            <div className="grid grid-cols-2 gap-6">
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <h4 className="font-semibold text-slate-800 mb-3">Customer</h4>
                                    <p className="text-slate-600">{selectedOrder.customerName}</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <h4 className="font-semibold text-slate-800 mb-3">Restaurant</h4>
                                    <p className="text-slate-600">{selectedOrder.restaurantName}</p>
                                </div>
                                {selectedOrder.deliveryPartnerName !== 'Not Assigned' && (
                                    <div className="col-span-2 p-4 bg-slate-50 rounded-xl border border-slate-100">
                                        <h4 className="font-semibold text-slate-800 mb-3">Delivery Partner</h4>
                                        <p className="text-slate-600">{selectedOrder.deliveryPartnerName}</p>
                                    </div>
                                )}
                            </div>

                            {/* Order Items */}
                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <h4 className="font-semibold text-slate-800 mb-3">Order Items</h4>
                                <div className="space-y-2">
                                    {selectedOrder.items?.map((item, index) => (
                                        <div key={index} className="flex justify-between items-center p-3 bg-white rounded-lg border border-slate-100">
                                            <div>
                                                <p className="font-medium text-slate-800">{item.menuItem?.name || 'Unknown Item'}</p>
                                                <p className="text-sm text-slate-500">Quantity: {item.quantity}</p>
                                            </div>
                                            <p className="font-semibold text-slate-800">₹{item.price}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Total */}
                            <div className="flex justify-between items-center p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                                <span className="font-semibold text-slate-800 text-lg">Total Amount</span>
                                <span className="font-bold text-2xl text-indigo-600">₹{selectedOrder.totalAmount}</span>
                            </div>

                            {/* Date */}
                            <div className="text-sm text-slate-500 text-center">
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
