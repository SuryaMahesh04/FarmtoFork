import React, { useState, useEffect } from 'react';
import { Truck, Search, MapPin, MoreVertical, X, CheckCircle2, ShieldBan, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '../../components/layout/DashboardLayout';
import DataTable from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';
import Button from '../../components/ui/Button';
import useMediaQuery from '../../utils/useMediaQuery';
import useAdminStore from '../../utils/adminStore';
import { toast } from 'react-hot-toast';

const AdminShipments = () => {
    const isMobile = useMediaQuery('(max-width: 768px)');
    const [filterStatus, setFilterStatus] = useState('all');
    const [page, setPage] = useState(1);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [selectedShipmentIds, setSelectedShipmentIds] = useState([]);

    const { 
        shipments, shipmentsPagination, isLoading, fetchShipments, 
        overrideShipmentStatus, bulkUpdateShipmentStatus, bulkDeleteShipments 
    } = useAdminStore();

    useEffect(() => {
        const filters = { page, limit: 15 };
        if (filterStatus !== 'all') filters.status = filterStatus;
        fetchShipments(filters);
        setSelectedShipmentIds([]); // Clear selection on filter/page change
    }, [filterStatus, page]);

    const handleOverride = async (id, status) => {
        if(window.confirm(`Force update shipment status to ${status}?`)) {
            await overrideShipmentStatus(id, status);
            setActiveDropdown(null);
        }
    };

    // Bulk Action Handlers
    const handleBulkStatusUpdate = async (status) => {
        if (window.confirm(`Force update ${selectedShipmentIds.length} shipments to ${status}?`)) {
            await bulkUpdateShipmentStatus(selectedShipmentIds, status);
            setSelectedShipmentIds([]);
        }
    };

    const handleBulkDelete = async () => {
        if (window.confirm(`DANGER: Permanently delete ${selectedShipmentIds.length} shipment records? This cannot be undone.`)) {
            await bulkDeleteShipments(selectedShipmentIds);
            setSelectedShipmentIds([]);
        }
    };

    const columns = [
        { 
            header: 'Shipment ID / Batch', 
            accessor: (row) => (
                <div>
                    <div className="font-medium text-slate-800">{row.shipmentId}</div>
                    <div className="text-xs text-slate-500">Batch: {row.batch?.batchId || 'N/A'} ({row.batch?.crop || 'N/A'})</div>
                </div>
            ) 
        },
        { 
            header: 'Participants', 
            accessor: (row) => (
                <div className="text-xs space-y-1">
                    <div className="text-green-700">F: {row.farmer?.profile?.fullName || 'Unknown'}</div>
                    <div className="text-blue-700">T: {row.transporter?.profile?.companyName || 'Unknown'}</div>
                    <div className="text-amber-700">D: {row.distributor?.profile?.companyName || 'Unknown'}</div>
                </div>
            ) 
        },
        { 
            header: 'Last Update', 
            accessor: (row) => new Date(row.updatedAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short'}) 
        },
        { 
            header: 'Status', 
            accessor: (row) => <StatusBadge status={
                ['delivered', 'completed'].includes(row.status) ? 'good' : 
                row.status === 'rejected' ? 'critical' :
                row.status === 'in-transit' ? 'warning' : 'neutral'
            } label={row.status} /> 
        },
        {
            header: 'Override',
            accessor: (row) => (
                <div className="relative">
                    <button 
                        onClick={() => setActiveDropdown(activeDropdown === row._id ? null : row._id)}
                        className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                    >
                        <MoreVertical size={16} />
                    </button>
                    
                    {activeDropdown === row._id && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={() => setActiveDropdown(null)}></div>
                            <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-slate-100 py-1 z-20">
                                <div className="px-3 py-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">Force Status</div>
                                {['pending', 'in-transit', 'delivered', 'rejected'].map(s => (
                                    <button 
                                        key={s}
                                        onClick={() => handleOverride(row._id, s)}
                                        disabled={row.status === s}
                                        className={`w-full text-left px-4 py-2 text-sm capitalize ${row.status === s ? 'text-slate-300 bg-slate-50 cursor-not-allowed' : 'text-slate-700 hover:bg-slate-50'}`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </>
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
                        <h1 className="text-xl md:text-2xl font-display font-bold text-slate-800">Shipment Monitor</h1>
                        <p className="text-sm md:text-base text-slate-500">Track all physical goods movement platform-wide</p>
                    </div>
                </div>

                <div className={`${isMobile ? 'flex overflow-x-auto gap-2 pb-2 custom-scrollbar' : 'flex gap-4'} animate-in`} style={{ animationDelay: '0.1s' }}>
                    {[
                        { key: 'all', label: 'All Shipments' },
                        { key: 'pending', label: 'Pending' },
                        { key: 'assigned', label: 'Assigned to Driver' },
                        { key: 'in-transit', label: 'In Transit' },
                        { key: 'delivered', label: 'Delivered' }
                    ].map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => { setFilterStatus(tab.key); setPage(1); }}
                            className={`${isMobile ? 'px-4 py-2 text-sm whitespace-nowrap' : 'px-6 py-3'} 
                                rounded-lg font-medium transition-all ${filterStatus === tab.key
                                    ? 'bg-amber-100 text-amber-800 shadow-sm'
                                    : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="animate-in" style={{ animationDelay: '0.3s' }}>
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden relative min-h-[400px]">
                        
                        {isLoading && (
                            <div className="absolute inset-0 bg-white/80 z-10 flex items-center justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
                            </div>
                        )}
                        
                        <div className={isMobile ? 'overflow-x-auto' : ''}>
                            <DataTable 
                                columns={columns} 
                                data={shipments} 
                                selectable={true}
                                selectedIds={selectedShipmentIds}
                                onSelectionChange={setSelectedShipmentIds}
                                idField="_id"
                            />
                        </div>
                        
                        {!isLoading && shipments.length === 0 && (
                            <div className="text-center py-12">
                                <Truck className="mx-auto text-slate-300 mb-4" size={48} />
                                <p className="text-slate-500">No shipments found matching your criteria</p>
                            </div>
                        )}
                        
                        {shipmentsPagination && shipmentsPagination.pages > 1 && (
                            <div className="p-4 border-t border-slate-100 flex justify-between items-center bg-slate-50">
                                <span className="text-sm text-slate-500">
                                    Page {shipmentsPagination.page} of {shipmentsPagination.pages}
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
                                        disabled={page === shipmentsPagination.pages}
                                        onClick={() => setPage(page + 1)}
                                    >Next</Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Bulk Actions Floating Bar */}
                <AnimatePresence>
                    {selectedShipmentIds.length > 0 && (
                        <motion.div 
                            initial={{ y: 100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 100, opacity: 0 }}
                            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] md:w-auto"
                        >
                            <div className="bg-slate-900 text-white rounded-2xl shadow-2xl px-4 py-3 md:px-6 md:py-4 flex flex-col md:flex-row items-center gap-4 md:gap-8 border border-white/10 glass-panel">
                                <div className="flex items-center gap-3 pr-0 md:pr-8 border-b md:border-b-0 md:border-r border-white/20 pb-2 md:pb-0 w-full md:w-auto justify-between md:justify-start">
                                    <div className="flex items-center gap-2">
                                        <div className="bg-amber-500/20 p-1.5 rounded-lg">
                                            <Truck size={18} className="text-amber-400" />
                                        </div>
                                        <span className="font-medium whitespace-nowrap">{selectedShipmentIds.length} Selected</span>
                                    </div>
                                    <button 
                                        onClick={() => setSelectedShipmentIds([])}
                                        className="p-1 hover:bg-white/10 rounded-full transition-colors"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>

                                <div className="flex items-center gap-2 md:gap-4 w-full md:w-auto justify-center">
                                    <button 
                                        onClick={() => handleBulkStatusUpdate('delivered')}
                                        className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-green-500/20 text-green-400 transition-all text-sm font-medium"
                                    >
                                        <CheckCircle2 size={16} /> <span className="hidden md:inline">Mark Delivered</span>
                                    </button>
                                    <button 
                                        onClick={() => handleBulkStatusUpdate('rejected')}
                                        className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-red-500/20 text-red-400 transition-all text-sm font-medium"
                                    >
                                        <ShieldBan size={16} /> <span className="hidden md:inline">Reject Shipments</span>
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

export default AdminShipments;
