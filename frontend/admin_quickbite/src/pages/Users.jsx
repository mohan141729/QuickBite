/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { toast } from 'react-hot-toast';
import TopBar from '../components/TopBar'; // eslint-disable-line no-unused-vars
import DataTable from '../components/DataTable';
import { Users as UsersIcon, UserPlus, X, Shield, ShieldCheck } from 'lucide-react'; // eslint-disable-line no-unused-vars
import { getAllUsers, deleteUser, toggleUserStatus, updateUser, createUser } from '../api/users';

// Primary admin email - matches backend
const PRIMARY_ADMIN_EMAIL = 'mohan141729@gmail.com';

const Users = () => {
    const { user: currentUser } = useUser();
    const currentUserEmail = currentUser?.primaryEmailAddress?.emailAddress;
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
            const response = await getAllUsers({ limit: 'all' });
            setUsers(response.data.users || []);
        } catch (error) {
            console.error('Error fetching users:', error);
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
        // Check if user is an admin and current user is not primary admin
        if (user.role === 'admin' && currentUserEmail !== PRIMARY_ADMIN_EMAIL) {
            toast.error('Only primary admin can delete admins');
            return;
        }

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
        // Find user to check role
        const userToToggle = users.find(u => u._id === userId);
        try {
            await toggleUserStatus(userId);
            toast.success(`User ${userToToggle?.status === 'active' ? 'deactivated' : 'activated'} successfully`);
            fetchUsers();
        } catch (error) {
            console.error('Error toggling status:', error);
            toast.error('Failed to update user status');
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

    const handleCreateAdmin = () => {
        setSelectedUser(null);
        setIsEditing(true);
        setFormData({ name: '', email: '', role: 'admin', password: '' });
        setShowModal(true);
    };

    const handleEditUser = (user) => {
        // Permission check
        if (user.role === 'admin' && currentUserEmail !== PRIMARY_ADMIN_EMAIL) {
            toast.error('Only primary admin can edit admins');
            return;
        }

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
            render: (value, row) => {
                const isPrimaryAdmin = row.email === PRIMARY_ADMIN_EMAIL;

                if (value === 'admin') {
                    return (
                        <span className={`badge ${isPrimaryAdmin ? 'badge-error' : 'badge-warning'} flex items-center gap-1.5`}>
                            {isPrimaryAdmin ? (
                                <>
                                    <ShieldCheck className="w-3.5 h-3.5" />
                                    Primary Admin
                                </>
                            ) : (
                                <>
                                    <Shield className="w-3.5 h-3.5" />
                                    Admin
                                </>
                            )}
                        </span>
                    );
                }

                return (
                    <span className={`badge ${value === 'restaurant_owner' ? 'badge-info' :
                        value === 'delivery_partner' ? 'badge-success' :
                            'badge-default'
                        }`}>
                        {value.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                );
            },
        },
        {
            key: 'status',
            label: 'Status',
            render: (value, row) => {
                const isTargetAdmin = row.role === 'admin';
                const canModify = !isTargetAdmin || currentUserEmail === PRIMARY_ADMIN_EMAIL;

                return (
                    <button
                        onClick={() => handleToggleStatus(row._id)}
                        disabled={!canModify}
                        className={`badge ${value === 'active' ? 'badge-success' : 'badge-default'} 
                            ${canModify ? 'cursor-pointer hover:opacity-80' : 'cursor-not-allowed opacity-60'}`}
                        title={!canModify ? "Only primary admin can modify admins" : "Toggle status"}
                    >
                        {value || 'active'}
                    </button>
                );
            },
        },
        {
            key: 'createdAt',
            label: 'Joined',
            render: (value) => new Date(value).toLocaleDateString(),
        },
    ];

    // Filter users by role and exclude current user
    const filteredUsers = (filterRole === 'all'
        ? users
        : users.filter(u => u.role === filterRole)
    ).filter(u => u.email !== currentUserEmail);

    return (
        <div className="flex-1 bg-slate-50 min-h-screen">
            <TopBar title="User Management" />

            <div className="pt-24 px-8 pb-12 animate-fade-in">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                                <UsersIcon className="w-6 h-6" />
                            </div>
                            User Management
                        </h2>
                        <p className="text-slate-500 mt-1 ml-11">Manage all platform users</p>
                    </div>
                    <div className="flex gap-3">
                        {currentUserEmail === PRIMARY_ADMIN_EMAIL && (
                            <button
                                onClick={handleCreateAdmin}
                                className="bg-white text-indigo-600 border border-indigo-200 px-6 py-2.5 rounded-xl shadow-sm hover:bg-indigo-50 hover:scale-105 transition-all duration-300 font-medium flex items-center gap-2"
                            >
                                <UserPlus className="w-5 h-5" />
                                Create Admin
                            </button>
                        )}
                        <button
                            onClick={handleAddUser}
                            className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 hover:scale-105 transition-all duration-300 font-medium flex items-center gap-2"
                        >
                            <UserPlus className="w-5 h-5" />
                            Add User
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="card-premium p-6 mb-6">
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-slate-700">Filter by Role:</span>
                        <div className="flex gap-2">
                            {['all', 'customer', 'restaurant_owner', 'delivery_partner', 'admin'].map((role) => {
                                // Hide 'admin' filter for non-primary admins
                                if (role === 'admin' && currentUserEmail !== PRIMARY_ADMIN_EMAIL) {
                                    return null;
                                }
                                return (
                                    <button
                                        key={role}
                                        onClick={() => setFilterRole(role)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${filterRole === role
                                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                            }`}
                                    >
                                        {role === 'all' ? 'All' : role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="card-premium p-6">
                        <p className="text-slate-500 text-sm font-medium">Total Users</p>
                        <p className="text-3xl font-bold text-slate-800 mt-2">{users.length}</p>
                    </div>
                    <div className="card-premium p-6">
                        <p className="text-slate-500 text-sm font-medium">Customers</p>
                        <p className="text-3xl font-bold text-slate-800 mt-2">
                            {users.filter(u => u.role === 'customer').length}
                        </p>
                    </div>
                    <div className="card-premium p-6">
                        <p className="text-slate-500 text-sm font-medium">Restaurants</p>
                        <p className="text-3xl font-bold text-slate-800 mt-2">
                            {users.filter(u => u.role === 'restaurant_owner').length}
                        </p>
                    </div>
                    <div className="card-premium p-6">
                        <p className="text-slate-500 text-sm font-medium">Delivery Partners</p>
                        <p className="text-3xl font-bold text-slate-800 mt-2">
                            {users.filter(u => u.role === 'delivery_partner').length}
                        </p>
                    </div>
                </div>

                {/* Data Table */}
                <div className="card-premium p-6">
                    <DataTable
                        columns={columns}
                        data={filteredUsers}
                        loading={loading}
                        onView={handleView}
                        onDelete={handleDelete}
                    />
                </div>
            </div>



            {/* User Detail/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4 flex items-center justify-between z-10">
                            <h3 className="text-xl font-bold text-slate-800">
                                {isEditing ? (selectedUser ? 'Edit User' : 'Add User') : 'User Details'}
                            </h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-slate-500" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            {isEditing ? (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700">Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700">Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700">Role</label>
                                        <select
                                            name="role"
                                            value={formData.role}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                                            disabled={formData.role === 'admin'}
                                        >
                                            {formData.role === 'admin' ? (
                                                <option value="admin">Admin</option>
                                            ) : (
                                                <>
                                                    <option value="customer">Customer</option>
                                                    <option value="restaurant_owner">Restaurant Owner</option>
                                                    <option value="delivery_partner">Delivery Partner</option>
                                                </>
                                            )}
                                        </select>
                                    </div>
                                    {!selectedUser && (
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700">Password</label>
                                            <input
                                                type="password"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleInputChange}
                                                className="mt-1 block w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                                                required
                                                minLength={8}
                                            />
                                            <p className="text-xs text-slate-500 mt-1">
                                                Must be 8+ chars, include a number & special character.
                                            </p>
                                        </div>
                                    )}
                                    <div className="flex gap-3 pt-4">
                                        <button
                                            type="submit"
                                            className="flex-1 bg-indigo-600 text-white px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 hover:scale-[1.02] transition-all duration-300 font-medium"
                                        >
                                            Save Changes
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setShowModal(false)}
                                            className="flex-1 bg-slate-100 text-slate-700 px-4 py-2.5 rounded-xl hover:bg-slate-200 hover:scale-[1.02] transition-all duration-300 font-medium"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium text-slate-500">Name</label>
                                            <p className="text-lg font-semibold text-slate-800 mt-1">{selectedUser.name}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-slate-500">Email</label>
                                            <p className="text-lg font-semibold text-slate-800 mt-1">{selectedUser.email}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-slate-500">Role</label>
                                            <p className="text-lg font-semibold text-slate-800 mt-1 capitalize">
                                                {selectedUser.role.replace('_', ' ')}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-slate-500">Status</label>
                                            <p className="text-lg font-semibold text-slate-800 mt-1 capitalize">
                                                {selectedUser.status || 'active'}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-slate-500">Joined Date</label>
                                            <p className="text-lg font-semibold text-slate-800 mt-1">
                                                {new Date(selectedUser.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 pt-4">
                                        <button
                                            onClick={() => handleEditUser(selectedUser)}
                                            disabled={selectedUser.role === 'admin' && currentUserEmail !== PRIMARY_ADMIN_EMAIL}
                                            className={`flex-1 px-4 py-2.5 rounded-xl shadow-lg font-medium transition-all duration-300
                                                ${selectedUser.role === 'admin' && currentUserEmail !== PRIMARY_ADMIN_EMAIL
                                                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                                                    : 'bg-indigo-600 text-white shadow-indigo-500/30 hover:bg-indigo-700 hover:scale-[1.02]'}`}
                                        >
                                            Edit User
                                        </button>
                                        <button
                                            onClick={() => {
                                                handleToggleStatus(selectedUser._id);
                                                if (selectedUser.role !== 'admin' || currentUserEmail === PRIMARY_ADMIN_EMAIL) {
                                                    setShowModal(false);
                                                }
                                            }}
                                            disabled={selectedUser.role === 'admin' && currentUserEmail !== PRIMARY_ADMIN_EMAIL}
                                            className={`flex-1 px-4 py-2.5 rounded-xl shadow-md font-medium text-white transition-all duration-300
                                                ${selectedUser.role === 'admin' && currentUserEmail !== PRIMARY_ADMIN_EMAIL
                                                    ? 'bg-slate-300 cursor-not-allowed'
                                                    : selectedUser.status === 'active'
                                                        ? 'bg-red-500 hover:bg-red-600 shadow-red-500/30 hover:scale-[1.02]'
                                                        : 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/30 hover:scale-[1.02]'
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
