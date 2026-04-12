import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Search, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

const DataTable = ({ 
    columns, 
    data, 
    onRowClick, 
    actions, 
    hideToolbar = false,
    selectable = false,
    selectedIds = [],
    onSelectionChange = () => {},
    idField = '_id'
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Filter data
    const filteredData = data.filter(row =>
        Object.values(row).some(value =>
            value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    // Selection logic
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            const allIds = currentData.map(row => row[idField]);
            const newSelection = [...new Set([...selectedIds, ...allIds])];
            onSelectionChange(newSelection);
        } else {
            const currentIds = currentData.map(row => row[idField]);
            const newSelection = selectedIds.filter(id => !currentIds.includes(id));
            onSelectionChange(newSelection);
        }
    };

    const handleSelectRow = (e, id) => {
        e.stopPropagation();
        if (e.target.checked) {
            onSelectionChange([...selectedIds, id]);
        } else {
            onSelectionChange(selectedIds.filter(item => item !== id));
        }
    };

    // Pagination logic
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const currentData = filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const isAllSelected = currentData.length > 0 && currentData.every(row => selectedIds.includes(row[idField]));

    return (
        <div className="glass-panel rounded-2xl overflow-hidden border border-sage-100 shadow-sm">
            {/* Table Header Filter Area */}
            {!hideToolbar && (
            <div className="p-4 border-b border-sage-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-white/50">
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-sage-200 bg-white/80 focus:ring-2 focus:ring-sage-200 focus:border-sage-300 outline-none text-sm text-slate-700 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 bg-white border border-sage-200 rounded-xl hover:bg-sage-50 transition-colors">
                        <Filter size={16} />
                        Filter
                    </button>
                    {actions}
                </div>
            </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-sage-50/50 text-slate-700 font-display font-semibold border-b border-sage-100">
                        <tr>
                            {selectable && (
                                <th className="px-6 py-4 w-10">
                                    <input 
                                        type="checkbox" 
                                        className="w-4 h-4 rounded border-sage-300 text-sage-600 focus:ring-sage-500 cursor-pointer"
                                        checked={isAllSelected}
                                        onChange={handleSelectAll}
                                    />
                                </th>
                            )}
                            {columns.map((col, index) => (
                                <th key={index} className="px-6 py-4 whitespace-nowrap">
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-sage-50 bg-white/40">
                        {currentData.length > 0 ? (
                            currentData.map((row, rowIndex) => (
                                <motion.tr
                                    key={row[idField] || rowIndex}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: rowIndex * 0.05 }}
                                    onClick={() => onRowClick && onRowClick(row)}
                                    className={`
                    hover:bg-sage-50/80 transition-colors cursor-pointer group
                    ${onRowClick ? 'hover:shadow-sm' : ''}
                    ${selectedIds.includes(row[idField]) ? 'bg-sage-50/50' : ''}
                  `}
                                >
                                    {selectable && (
                                        <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                                            <input 
                                                type="checkbox" 
                                                className="w-4 h-4 rounded border-sage-300 text-sage-600 focus:ring-sage-500 cursor-pointer"
                                                checked={selectedIds.includes(row[idField])}
                                                onChange={(e) => handleSelectRow(e, row[idField])}
                                            />
                                        </td>
                                    )}
                                    {columns.map((col, colIndex) => (
                                        <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                                            {col.render ? col.render(row) : (typeof col.accessor === 'function' ? col.accessor(row) : row[col.accessor])}
                                        </td>
                                    ))}
                                </motion.tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length + (selectable ? 1 : 0)} className="px-6 py-12 text-center text-slate-400">
                                    No results found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-sage-100 flex items-center justify-between bg-white/50">
                <div className="flex items-center gap-4">
                    <span className="text-xs text-slate-500">
                        Showing <span className="font-medium text-sage-700">{Math.min((currentPage - 1) * itemsPerPage + 1, filteredData.length)}</span> to <span className="font-medium text-sage-700">{Math.min(currentPage * itemsPerPage, filteredData.length)}</span> of <span className="font-medium text-sage-700">{filteredData.length}</span> entries
                    </span>
                    <div className="flex items-center gap-2 border-l border-sage-100 pl-4">
                        <span className="text-xs text-slate-400">Rows:</span>
                        <select 
                            value={itemsPerPage}
                            onChange={(e) => {
                                setItemsPerPage(Number(e.target.value));
                                setCurrentPage(1);
                            }}
                            className="text-xs bg-white border border-sage-200 rounded-md px-1 py-0.5 outline-none focus:ring-1 focus:ring-sage-300 text-slate-600 transition-all"
                        >
                            {[5, 10, 20, 50, 100].map(size => (
                                <option key={size} value={size}>{size}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="p-1 rounded-lg hover:bg-sage-100 disabled:opacity-50 disabled:hover:bg-transparent text-slate-500 transition-colors"
                    >
                        <ChevronLeft size={18} />
                    </button>
                    <span className="text-xs font-medium text-slate-600 bg-white px-2 py-1 rounded-md border border-sage-100">
                        Page {currentPage} of {Math.max(totalPages, 1)}
                    </span>
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="p-1 rounded-lg hover:bg-sage-100 disabled:opacity-50 disabled:hover:bg-transparent text-slate-500 transition-colors"
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DataTable;
