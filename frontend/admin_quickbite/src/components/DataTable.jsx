import { useState } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

const DataTable = ({
    columns,
    data,
    loading,
    onEdit,
    onDelete,
    onView,
    actions = true,
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Filter data based on search
    const filteredData = data.filter((row) =>
        columns.some((col) => {
            if (col.key === 'actions') return false;
            const value = row[col.key];
            return value !== null && value !== undefined && String(value)
                .toLowerCase()
                .includes(searchTerm.toLowerCase());
        })
    );

    // Pagination
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

    if (loading) {
        return (
            <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="skeleton h-16 rounded-xl" />
                ))}
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            {/* Search Bar */}
            <div className="mb-6 flex justify-between items-center">
                <div className="relative max-w-md w-full">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search records..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all shadow-sm hover:shadow-md"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            {columns.map((col) => (
                                <th key={col.key}>{col.label}</th>
                            ))}
                            {actions && <th>Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length + (actions ? 1 : 0)} className="text-center py-12 text-slate-500">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                                            <Search className="w-6 h-6 text-slate-400" />
                                        </div>
                                        <p className="font-medium">No records found</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            paginatedData.map((row, index) => (
                                <tr key={row._id || index} className="group">
                                    {columns.map((col) => (
                                        <td key={col.key}>
                                            {col.render ? col.render(row[col.key], row) : (
                                                <span className="font-medium text-slate-700">{row[col.key]}</span>
                                            )}
                                        </td>
                                    ))}
                                    {actions && (
                                        <td>
                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                {onView && (
                                                    <button
                                                        onClick={() => onView(row)}
                                                        className="px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                                                    >
                                                        View
                                                    </button>
                                                )}
                                                {onEdit && (
                                                    <button
                                                        onClick={() => onEdit(row)}
                                                        className="px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                                                    >
                                                        Edit
                                                    </button>
                                                )}
                                                {onDelete && (
                                                    <button
                                                        onClick={() => onDelete(row)}
                                                        className="px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                                                    >
                                                        Delete
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {filteredData.length > itemsPerPage && (
                <div className="flex items-center justify-between mt-6 px-2">
                    <p className="text-sm text-slate-500 font-medium">
                        Showing <span className="text-slate-800 font-bold">{startIndex + 1}</span> to <span className="text-slate-800 font-bold">{Math.min(startIndex + itemsPerPage, filteredData.length)}</span> of <span className="text-slate-800 font-bold">{filteredData.length}</span> results
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="p-2.5 border border-slate-200 rounded-xl hover:bg-white hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all bg-slate-50"
                        >
                            <ChevronLeft className="w-5 h-5 text-slate-600" />
                        </button>
                        <span className="px-4 py-2 text-sm font-bold text-slate-700 bg-white border border-slate-200 rounded-xl shadow-sm">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="p-2.5 border border-slate-200 rounded-xl hover:bg-white hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all bg-slate-50"
                        >
                            <ChevronRight className="w-5 h-5 text-slate-600" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DataTable;
