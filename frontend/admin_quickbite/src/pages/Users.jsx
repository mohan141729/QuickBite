import React, { useState, useEffect } from 'react';
import TopBar from '../components/TopBar';
import DataTable from '../components/DataTable';
import { Users as UsersIcon, UserPlus, X } from 'lucide-react';
import { getAllUsers, deleteUser, toggleUserStatus, updateUser, createUser } from '../api/users';
import toast from 'react-hot-toast';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [filterRole, setFilterRole] = useState('all');
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'customer',
        password: ''
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await getAllUsers();
            setUsers(response.data.users || []);
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Failed to load users');
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    const handleView = (user) => {
        setSelectedUser(user);
        setIsEditing(false);
        setShowModal(true);
    };

    const handleDelete = async (user) => {
        if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
            try {
                await deleteUser(user._id);
                toast.success('User deleted successfully');
                fetchUsers();
            } catch (error) {
                console.error('Error deleting user:', error);
                toast.error('Failed to delete user');
            }
        }
    };

    const handleToggleStatus = async (userId) => {
        try {
            await toggleUserStatus(userId);
            toast.success('User status updated');
            fetchUsers();
        } catch (error) {
            console.error('Error toggling status:', error);
            toast.error('Failed to update status');
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddUser = () => {
        setSelectedUser(null);
        setIsEditing(true);
        setFormData({ name: '', email: '', role: 'customer', password: '' });
        setShowModal(true);
    };

    const handleEditUser = (user) => {
        setSelectedUser(user);
        setIsEditing(true);
        setFormData({
            name: user.name,
            email: user.email,
            role: user.role,
            password: '' // Password optional on edit
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (selectedUser && isEditing) {
                // Update existing user
                await updateUser(selectedUser._id, formData);
                toast.success('User updated successfully');
            } else {
                // Create new user
                await createUser(formData);
                toast.success('User created successfully');
            }
            setShowModal(false);
            fetchUsers();
        } catch (error) {
            console.error('Error saving user:', error);
            toast.error(error.response?.data?.message || 'Failed to save user');
        }
    };

    const columns = [
        {
            key: 'name',
            label: 'Name',
        },
        {
            key: 'email',
            label: 'Email',
        },
        {
            key: 'role',
            label: 'Role',
            render: (value) => (
                <span className={`badge ${value === 'admin' ? 'badge-error' :
                    value === 'restaurant_owner' ? 'badge-warning' :
                        value === 'delivery_partner' ? 'badge-info' :
                            'badge-default'
                    }`}>
                    {value.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
            ),
        },
        {
            key: 'status',
            label: 'Status',
            render: (value, row) => (
                <button
                    onClick={() => handleToggleStatus(row._id)}
                    className={`badge ${value === 'active' ? 'badge-success' : 'badge-default'} cursor-pointer hover:opacity-80`}
                >
                    {value || 'active'}
                </button>
            ),
        },
        {
            key: 'createdAt',
            label: 'Joined',
            render: (value) => new Date(value).toLocaleDateString(),
        },
    ];

    // Filter users by role
    const filteredUsers = filterRole === 'all'
        ? users
        : users.filter(u => u.role === filterRole);

    return (
        <div className="flex-1 bg-gray-50 min-h-screen">
            <TopBar title="User Management" />

            <div className="pt-16 pl-64">
                <div className="p-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                                <UsersIcon className="w-8 h-8 text-indigo-600" />
                                User Management
                            </h2>
                            <p className="text-gray-600 mt-1">Manage all platform users</p>
                        </div>
                        <button
                            onClick={handleAddUser}
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2.5 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-medium flex items-center gap-2"
                        >
                            <UserPlus className="w-5 h-5" />
                            Add User
                        </button>
                    </div>

                    {/* Filters */}
                    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 mb-6">
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-medium text-gray-700">Filter by Role:</span>
                            <div className="flex gap-2">
                                {['all', 'customer', 'restaurant_owner', 'delivery_partner', 'admin'].map((role) => (
                                    <button
                                        key={role}
                                        onClick={() => setFilterRole(role)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterRole === role
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        {role === 'all' ? 'All' : role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Statistics */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
                            <p className="text-gray-600 text-sm">Total Users</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{users.length}</p>
                        </div>
                        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
                            <p className="text-gray-600 text-sm">Customers</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">
                                {users.filter(u => u.role === 'customer').length}
                            </p>
                        </div>
                        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
                            <p className="text-gray-600 text-sm">Restaurants</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">
                                {users.filter(u => u.role === 'restaurant_owner').length}
                            </p>
                        </div>
                        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
                            <p className="text-gray-600 text-sm">Delivery Partners</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">
                                {users.filter(u => u.role === 'delivery_partner').length}
                            </p>
                        </div>
                    </div>

                    {/* Data Table */}
                    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
                        <DataTable
                            columns={columns}
                            data={filteredUsers}
                            loading={loading}
                            onView={handleView}
                            onDelete={handleDelete}
                        />
                    </div>
                </div>
            </div>

            {/* User Detail/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                            <h3 className="text-xl font-bold text-gray-900">
                                {isEditing ? (selectedUser ? 'Edit User' : 'Add User') : 'User Details'}
                            </h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            {isEditing ? (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Role</label>
                                        <select
                                            name="role"
                                            value={formData.role}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                                        >
                                            <option value="customer">Customer</option>
                                            <option value="restaurant_owner">Restaurant Owner</option>
                                            <option value="delivery_partner">Delivery Partner</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </div>
                                    {!selectedUser && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Password</label>
                                            <input
                                                type="password"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleInputChange}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                                                required
                                            />
                                        </div>
                                    )}
                                    <div className="flex gap-3 pt-4">
                                        <button
                                            type="submit"
                                            className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2.5 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 font-medium"
                                        >
                                            Save Changes
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setShowModal(false)}
                                            className="flex-1 bg-gray-100 text-gray-700 px-4 py-2.5 rounded-xl hover:bg-gray-200 hover:scale-[1.02] transition-all duration-300 font-medium"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium text-gray-600">Name</label>
                                            <p className="text-lg font-semibold text-gray-900 mt-1">{selectedUser.name}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-600">Email</label>
                                            <p className="text-lg font-semibold text-gray-900 mt-1">{selectedUser.email}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-600">Role</label>
                                            <p className="text-lg font-semibold text-gray-900 mt-1 capitalize">
                                                {selectedUser.role.replace('_', ' ')}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-600">Status</label>
                                            <p className="text-lg font-semibold text-gray-900 mt-1 capitalize">
                                                {selectedUser.status || 'active'}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-600">Joined Date</label>
                                            <p className="text-lg font-semibold text-gray-900 mt-1">
                                                {new Date(selectedUser.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 pt-4">
                                        <button
                                            onClick={() => handleEditUser(selectedUser)}
                                            className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2.5 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 font-medium"
                                        >
                                            Edit User
                                        </button>
                                        <button
                                            onClick={() => {
                                                handleToggleStatus(selectedUser._id);
                                                setShowModal(false);
                                            }}
                                            className={`flex-1 px-4 py-2.5 rounded-xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300 font-medium text-white ${selectedUser.status === 'active'
                                                    ? 'bg-gradient-to-r from-red-500 to-pink-600'
                                                    : 'bg-gradient-to-r from-green-500 to-emerald-600'
                                                }`}
                                        >
                                            {selectedUser.status === 'active' ? 'Deactivate' : 'Activate'}
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Users;
