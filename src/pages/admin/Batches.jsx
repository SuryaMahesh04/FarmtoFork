import React, { useState, useEffect } from 'react';
import { Database, Search, ShieldAlert, Scan, MapPin, X, CheckCircle2, ShieldBan, Trash2, Settings, Truck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '../../components/layout/DashboardLayout';
import DataTable from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';
import Button from '../../components/ui/Button';
import useMediaQuery from '../../utils/useMediaQuery';
import useAdminStore from '../../utils/adminStore';
import { toast } from 'react-hot-toast';

const AdminBatches = () => {
    const isMobile = useMediaQuery('(max-width: 768px)');
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [page, setPage] = useState(1);
    const [selectedBatchIds, setSelectedBatchIds] = useState([]);

    const { 
        batches, batchesPagination, isLoading, fetchBatches,
        bulkUpdateBatchStatus, bulkDeleteBatches
    } = useAdminStore();

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Fetch on filter or search change
    useEffect(() => {
        const filters = { page, limit: 15 };
        if (filterStatus !== 'all') filters.status = filterStatus;
        if (debouncedSearch) filters.search = debouncedSearch;
        fetchBatches(filters);
        setSelectedBatchIds([]); // Clear selection on refresh/filter
    }, [filterStatus, debouncedSearch, page]);

    const formatCurrency = (val) => {
        if(!val) return '₹0';
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
    };

    // Bulk Action Handlers
    const handleBulkStatusUpdate = async (status) => {
        if (window.confirm(`Force update ${selectedBatchIds.length} batches to ${status}?`)) {
            await bulkUpdateBatchStatus(selectedBatchIds, status);
            setSelectedBatchIds([]);
        }
    };

    const handleBulkDelete = async () => {
        if (window.confirm(`DANGER: Permanently delete ${selectedBatchIds.length} batch records? This cannot be undone.`)) {
            await bulkDeleteBatches(selectedBatchIds);
            setSelectedBatchIds([]);
        }
    };

    const columns = [
        { 
            header: 'Batch ID / Crop', 
            accessor: (row) => (
                <div>
                    <div className="font-medium text-slate-800">{row.batchId}</div>
                    <div className="text-xs text-slate-500">{row.crop} {row.variety ? `(${row.variety})` : ''}</div>
                </div>
            ) 
        },
        { 
            header: 'Farmer', 
            accessor: (row) => (
                <div className="text-sm">
                    {row.farmerId?.profile?.fullName || 'Unknown'}
                </div>
            ) 
        },
        { 
            header: 'Quantity & Price', 
            accessor: (row) => (
                <div className="text-sm">
                    <span className="font-medium text-slate-700">{row.quantity ? `${row.quantity} ${row.unit || 'kg'}` : 'Unknown'}</span>
                    {row.pricePerUnit && <div className="text-xs text-emerald-600">{formatCurrency(row.pricePerUnit)}/{row.unit || 'kg'}</div>}
                </div>
            ) 
        },
        { 
            header: 'Status', 
            accessor: (row) => <StatusBadge status={
                row.status === 'completed' ? 'good' : 
                row.status === 'in-transit' ? 'warning' : 'neutral'
            } label={row.status} /> 
        },
        { 
            header: 'Integrity', 
            accessor: (row) => (
                <div className="flex items-center gap-1">
                    {row.isTampered ? (
                        <span className="flex items-center gap-1 text-red-600 text-xs font-bold bg-red-50 px-2 py-1 rounded">
                            <ShieldAlert size={14} /> Tampered
                        </span>
                    ) : (
                        <span className="text-green-600 text-xs font-medium bg-green-50 px-2 py-1 rounded">Secure</span>
                    )}
                </div>
            ) 
        }
    ];

    return (
        <DashboardLayout role="admin">
            <div className="space-y-6 relative pb-20">
                <div className="animate-in flex justify-between items-end">
                    <div>
                        <h1 className="text-xl md:text-2xl font-display font-bold text-slate-800">Batch Inspector</h1>
                        <p className="text-sm md:text-base text-slate-500">Monitor all platform crops and supply chain data</p>
                    </div>
                </div>

                <div className={`${isMobile ? 'flex overflow-x-auto gap-2 pb-2 custom-scrollbar' : 'flex gap-4'} animate-in`} style={{ animationDelay: '0.1s' }}>
                    {[
                        { key: 'all', label: 'All Batches' },
                        { key: 'active', label: 'Active (Farm)' },
                        { key: 'in-transit', label: 'In Transit' },
                        { key: 'delivered', label: 'At Retailer' },
                        { key: 'completed', label: 'Completed' }
                    ].map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => { setFilterStatus(tab.key); setPage(1); }}
                            className={`${isMobile ? 'px-4 py-2 text-sm whitespace-nowrap' : 'px-6 py-3'} 
                                rounded-lg font-medium transition-all ${filterStatus === tab.key
                                    ? 'bg-sage-100 text-sage-800 shadow-sm'
                                    : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="animate-in" style={{ animationDelay: '0.2s' }}>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by Batch ID or Crop..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-sage-400 focus:border-sage-400 focus:outline-none bg-white"
                        />
                    </div>
                </div>

                <div className="animate-in" style={{ animationDelay: '0.3s' }}>
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden relative min-h-[400px]">
                        
                        {isLoading && (
                            <div className="absolute inset-0 bg-white/80 z-10 flex items-center justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sage-600"></div>
                            </div>
                        )}
                        
                        <div className={isMobile ? 'overflow-x-auto' : ''}>
                            <DataTable 
                                columns={columns} 
                                data={batches} 
                                selectable={true}
                                selectedIds={selectedBatchIds}
                                onSelectionChange={setSelectedBatchIds}
                                idField="_id"
                            />
                        </div>
                        
                        {!isLoading && batches.length === 0 && (
                            <div className="text-center py-12">
                                <Database className="mx-auto text-slate-300 mb-4" size={48} />
                                <p className="text-slate-500">No batches found matching your criteria</p>
                            </div>
                        )}
                        
                        {batchesPagination && batchesPagination.pages > 1 && (
                            <div className="p-4 border-t border-slate-100 flex justify-between items-center bg-slate-50">
                                <span className="text-sm text-slate-500">
                                    Page {batchesPagination.page} of {batchesPagination.pages}
                                </span>
                                <div className="flex gap-2">
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        disabled={page === 1}
                                        onClick={() => setPage(page - 1)}
                                    >Prev</Button>
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        disabled={page === batchesPagination.pages}
                                        onClick={() => setPage(page + 1)}
                                    >Next</Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Bulk Actions Floating Bar */}
                <AnimatePresence>
                    {selectedBatchIds.length > 0 && (
                        <motion.div 
                            initial={{ y: 100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 100, opacity: 0 }}
                            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] md:w-auto"
                        >
                            <div className="bg-slate-900 text-white rounded-2xl shadow-2xl px-4 py-3 md:px-6 md:py-4 flex flex-col md:flex-row items-center gap-4 md:gap-8 border border-white/10 glass-panel">
                                <div className="flex items-center gap-3 pr-0 md:pr-8 border-b md:border-b-0 md:border-r border-white/20 pb-2 md:pb-0 w-full md:w-auto justify-between md:justify-start">
                                    <div className="flex items-center gap-2">
                                        <div className="bg-sage-500/20 p-1.5 rounded-lg">
                                            <Database size={18} className="text-sage-400" />
                                        </div>
                                        <span className="font-medium whitespace-nowrap">{selectedBatchIds.length} Selected</span>
                                    </div>
                                    <button 
                                        onClick={() => setSelectedBatchIds([])}
                                        className="p-1 hover:bg-white/10 rounded-full transition-colors"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>

                                <div className="flex items-center gap-2 md:gap-4 w-full md:w-auto justify-center">
                                    <button 
                                        onClick={() => handleBulkStatusUpdate('completed')}
                                        className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-green-500/20 text-green-400 transition-all text-sm font-medium"
                                    >
                                        <CheckCircle2 size={16} /> <span className="hidden md:inline">Mark Completed</span>
                                    </button>
                                    <button 
                                        onClick={() => handleBulkStatusUpdate('in-transit')}
                                        className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-yellow-500/20 text-yellow-400 transition-all text-sm font-medium"
                                    >
                                        <Truck size={16} /> <span className="hidden md:inline">In-Transit</span>
                                    </button>
                                    <button 
                                        onClick={() => handleBulkDelete()}
                                        className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-red-600/20 text-red-500 transition-all text-sm font-medium"
                                    >
                                        <Trash2 size={16} /> <span className="hidden md:inline">Delete Records</span>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </DashboardLayout>
    );
};

export default AdminBatches;
