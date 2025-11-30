import React, { useState, useEffect } from 'react';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../api/categories';
import TopBar from '../components/TopBar';
import { Plus, Search, Edit2, Trash2, X, Loader2, Image as ImageIcon, Grid } from 'lucide-react';
import toast from 'react-hot-toast';
import ImageUpload from '../components/ImageUpload';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        image: '',
        description: '',
        isActive: true
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const data = await getCategories();
            setCategories(data);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
            toast.error('Failed to load categories');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (category = null) => {
        if (category) {
            setEditingCategory(category);
            setFormData({
                name: category.name,
                image: category.image,
                description: category.description || '',
                isActive: category.isActive
            });
        } else {
            setEditingCategory(null);
            setFormData({
                name: '',
                image: '',
                description: '',
                isActive: true
            });
        }
        // Force re-render of ImageUpload component by using a key if needed, or rely on initialImage prop update
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.image) {
            toast.error('Name and Image URL are required');
            return;
        }

        try {
            setSubmitting(true);
            if (editingCategory) {
                await updateCategory(editingCategory._id, formData);
                toast.success('Category updated successfully');
            } else {
                await createCategory(formData);
                toast.success('Category created successfully');
            }
            setIsModalOpen(false);
            fetchCategories();
        } catch (error) {
            console.error('Failed to save category:', error);
            toast.error(error.response?.data?.message || 'Failed to save category');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this category?')) return;

        try {
            await deleteCategory(id);
            toast.success('Category deleted successfully');
            fetchCategories();
        } catch (error) {
            console.error('Failed to delete category:', error);
            toast.error('Failed to delete category');
        }
    };

    const filteredCategories = categories.filter(cat =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex-1 bg-slate-50 min-h-screen">
            <TopBar title="Categories" />

            <div className="pt-24 px-8 pb-12 animate-fade-in">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                                <Grid className="w-6 h-6" />
                            </div>
                            Food Categories
                        </h2>
                        <p className="text-slate-500 mt-1 ml-11">Manage global food categories</p>
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 hover:scale-105 transition-all duration-300 font-medium flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        Add Category
                    </button>
                </div>

                {/* Search */}
                <div className="card-premium p-6 mb-8">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search categories..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 focus:bg-white transition-all"
                        />
                    </div>
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr">
                        {filteredCategories.map((category) => (
                            <div key={category._id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                                <div className="h-48 overflow-hidden relative group shrink-0">
                                    <img
                                        src={category.image}
                                        alt={category.name}
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        onError={(e) => { e.target.src = 'https://placehold.co/400x300?text=No+Image'; }}
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        <button
                                            onClick={() => handleOpenModal(category)}
                                            className="p-2 bg-white/20 hover:bg-white/40 text-white rounded-lg backdrop-blur-sm transition-colors"
                                        >
                                            <Edit2 className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(category._id)}
                                            className="p-2 bg-red-500/20 hover:bg-red-500/40 text-white rounded-lg backdrop-blur-sm transition-colors"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                                <div className="p-4 flex flex-col flex-1">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-semibold text-lg text-gray-900 line-clamp-1" title={category.name}>{category.name}</h3>
                                        <span className={`px-2 py-1 text-xs rounded-full shrink-0 ml-2 ${category.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                            {category.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                    {category.description && (
                                        <p className="text-sm text-gray-500 line-clamp-2 mt-auto">{category.description}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-xl max-w-md w-full p-6 relative animate-in fade-in zoom-in duration-200">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <h2 className="text-xl font-bold mb-6">
                                {editingCategory ? 'Edit Category' : 'Add New Category'}
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="e.g., Pizza, Burger"
                                        required
                                    />
                                </div>

                                <div>
                                    <ImageUpload
                                        label="Category Image"
                                        initialImage={formData.image}
                                        onImageUploaded={(url) => setFormData(prev => ({ ...prev, image: url }))}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        rows="3"
                                    />
                                </div>

                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="isActive"
                                        checked={formData.isActive}
                                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                    />
                                    <label htmlFor="isActive" className="text-sm text-gray-700">Active</label>
                                </div>

                                <div className="flex justify-end gap-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                                    >
                                        {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                                        {editingCategory ? 'Update Category' : 'Create Category'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Categories;
