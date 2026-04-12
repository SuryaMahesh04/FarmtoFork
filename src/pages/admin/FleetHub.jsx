import React, { useState, useEffect } from 'react';
import { Truck, Users, AlertTriangle, CheckCircle2, MoreVertical, X, Trash2, ShieldBan } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '../../components/layout/DashboardLayout';
import DataTable from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';
import Button from '../../components/ui/Button';
import useMediaQuery from '../../utils/useMediaQuery';
import useAdminStore from '../../utils/adminStore';
import { toast } from 'react-hot-toast';

const AdminFleet = () => {
    const isMobile = useMediaQuery('(max-width: 768px)');
    const [activeTab, setActiveTab] = useState('vehicles');
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [selectedVehicleIds, setSelectedVehicleIds] = useState([]);
    const [selectedDriverIds, setSelectedDriverIds] = useState([]);

    const { 
        vehicles, drivers, isLoading, fetchFleet, 
        overrideDriverStatus, bulkUpdateDriverStatus,
        bulkDeleteDrivers, bulkDeleteVehicles 
    } = useAdminStore();

    useEffect(() => {
        fetchFleet();
    }, []);

    // Clear selection when switching tabs
    useEffect(() => {
        setSelectedVehicleIds([]);
        setSelectedDriverIds([]);
        setActiveDropdown(null);
    }, [activeTab]);

    const handleDriverStatusOverride = async (id, status) => {
        if(window.confirm(`Force update driver status to ${status}?`)) {
            await overrideDriverStatus(id, status);
            setActiveDropdown(null);
        }
    };

    // Bulk action handlers
    const handleBulkDriverStatus = async (status) => {
        if (window.confirm(`Force update duty status for ${selectedDriverIds.length} drivers to ${status}?`)) {
            await bulkUpdateDriverStatus(selectedDriverIds, status);
            setSelectedDriverIds([]);
        }
    };

    const handleBulkDriverDelete = async () => {
        if (window.confirm(`DANGER: Permanently delete ${selectedDriverIds.length} driver records?`)) {
            await bulkDeleteDrivers(selectedDriverIds);
            setSelectedDriverIds([]);
        }
    };

    const handleBulkVehicleDelete = async () => {
        if (window.confirm(`DANGER: Permanently delete ${selectedVehicleIds.length} vehicle records?`)) {
            await bulkDeleteVehicles(selectedVehicleIds);
            setSelectedVehicleIds([]);
        }
    };

    const isExpiringSoon = (dateStr) => {
        if(!dateStr) return false;
        const expiry = new Date(dateStr);
        const now = new Date();
        const diffTime = expiry - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 && diffDays <= 30;
    };

    const isExpired = (dateStr) => {
        if(!dateStr) return true;
        return new Date(dateStr) < new Date();
    };

    const vehicleColumns = [
        { 
            header: 'Vehicle', 
            accessor: (row) => (
                <div>
                    <div className="font-medium text-slate-800">{row.registrationNumber}</div>
                    <div className="text-xs text-slate-500">{row.make} {row.model} ({row.type})</div>
                </div>
            ) 
        },
        { 
            header: 'Transporter / Driver', 
            accessor: (row) => (
                <div className="text-sm">
                    <div className="text-blue-700 font-medium">{row.transporter?.profile?.companyName || 'Unknown'}</div>
                    <div className="text-slate-500 text-xs">{row.assignedDriver?.fullName || 'No driver assigned'}</div>
                </div>
            ) 
        },
        { 
            header: 'Insurance', 
            accessor: (row) => {
                const expired = isExpired(row.insuranceExpiry);
                const expiringSoon = isExpiringSoon(row.insuranceExpiry);
                return (
                    <div className="flex items-center gap-1">
                        <StatusBadge 
                            status={expired ? 'critical' : expiringSoon ? 'warning' : 'good'} 
                            label={expired ? 'Expired' : expiringSoon ? 'Expiring Soon' : 'Valid'} 
                        />
                    </div>
                )
            } 
        },
        { 
            header: 'Status', 
            accessor: (row) => <StatusBadge status={row.status === 'Available' ? 'good' : 'warning'} label={row.status} /> 
        }
    ];

    const driverColumns = [
        { 
            header: 'Driver', 
            accessor: (row) => (
                <div>
                    <div className="font-medium text-slate-800">{row.fullName}</div>
                    <div className="text-xs text-slate-500">{row.phone}</div>
                </div>
            ) 
        },
        { 
            header: 'License Expiry', 
            accessor: (row) => {
                const expired = isExpired(row.licenseExpiry);
                const expiringSoon = isExpiringSoon(row.licenseExpiry);
                const dateStr = new Date(row.licenseExpiry).toLocaleDateString();
                return (
                    <div>
                        <div className={`text-sm font-medium ${expired ? 'text-red-600' : expiringSoon ? 'text-amber-600' : 'text-slate-700'}`}>
                            {dateStr}
                        </div>
                        {expired && <span className="text-[10px] bg-red-100 text-red-700 px-1 rounded">Expired</span>}
                        {expiringSoon && <span className="text-[10px] bg-amber-100 text-amber-700 px-1 rounded">Expiring</span>}
                    </div>
                )
            } 
        },
        { 
            header: 'Duty Status', 
            accessor: (row) => (
                 <StatusBadge status={row.dutyStatus === 'on-duty' ? 'good' : 'neutral'} label={row.dutyStatus} />
            ) 
        },
        {
            header: 'Actions',
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
                            <div className="absolute right-0 mt-1 w-36 bg-white rounded-lg shadow-lg border border-slate-100 py-1 z-20">
                                <div className="px-3 py-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">Duty Override</div>
                                <button 
                                    onClick={() => handleDriverStatusOverride(row._id, 'on-duty')}
                                    disabled={row.dutyStatus === 'on-duty'}
                                    className="w-full text-left px-4 py-2 text-sm text-green-700 hover:bg-slate-50 disabled:opacity-50"
                                >
                                    Force On-Duty
                                </button>
                                <button 
                                    onClick={() => handleDriverStatusOverride(row._id, 'off-duty')}
                                    disabled={row.dutyStatus === 'off-duty'}
                                    className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                                >
                                    Force Off-Duty
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )
        }
    ];

    return (
        <DashboardLayout role="admin">
            <div className="space-y-6 animate-in fade-in relative pb-20">
                <div>
                    <h1 className="text-xl md:text-2xl font-display font-bold text-slate-800">Fleet Hub</h1>
                    <p className="text-slate-500">Total platform logistics visibility</p>
                </div>

                <div className="flex gap-4 border-b border-slate-200">
                    <button 
                        onClick={() => setActiveTab('vehicles')}
                        className={`flex items-center gap-2 pb-3 px-2 border-b-2 font-medium text-sm transition-colors ${activeTab === 'vehicles' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                    >
                        <Truck size={18} /> Vehicles ({vehicles?.length || 0})
                    </button>
                    <button 
                        onClick={() => setActiveTab('drivers')}
                        className={`flex items-center gap-2 pb-3 px-2 border-b-2 font-medium text-sm transition-colors ${activeTab === 'drivers' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                    >
                        <Users size={18} /> Drivers ({drivers?.length || 0})
                    </button>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden relative min-h-[400px]">
                    {isLoading && (
                        <div className="absolute inset-0 bg-white/80 z-10 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                    )}
                    
                    <div className={isMobile ? 'overflow-x-auto' : ''}>
                        {activeTab === 'vehicles' ? (
                            <DataTable 
                                columns={vehicleColumns} 
                                data={vehicles} 
                                selectable={true}
                                selectedIds={selectedVehicleIds}
                                onSelectionChange={setSelectedVehicleIds}
                                idField="_id"
                            />
                        ) : (
                            <DataTable 
                                columns={driverColumns} 
                                data={drivers} 
                                selectable={true}
                                selectedIds={selectedDriverIds}
                                onSelectionChange={setSelectedDriverIds}
                                idField="_id"
                            />
                        )}
                    </div>
                </div>

                {/* Bulk Actions Floating Bar */}
                <AnimatePresence mode="wait">
                    {(activeTab === 'vehicles' && selectedVehicleIds.length > 0) && (
                        <motion.div 
                            key="vehicles-bar"
                            initial={{ y: 100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 100, opacity: 0 }}
                            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] md:w-auto"
                        >
                            <div className="bg-slate-900 text-white rounded-2xl shadow-2xl px-6 py-4 flex items-center gap-8 border border-white/10 glass-panel">
                                <div className="flex items-center gap-3 pr-8 border-r border-white/20">
                                    <div className="bg-blue-500/20 p-1.5 rounded-lg">
                                        <Truck size={18} className="text-blue-400" />
                                    </div>
                                    <span className="font-medium whitespace-nowrap">{selectedVehicleIds.length} Vehicles</span>
                                    <button onClick={() => setSelectedVehicleIds([])} className="p-1 hover:bg-white/10 rounded-full transition-colors"><X size={14}/></button>
                                </div>
                                <div className="flex items-center gap-4">
                                    <button 
                                        onClick={handleBulkVehicleDelete}
                                        className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-red-500/20 text-red-400 transition-all text-sm font-medium"
                                    >
                                        <Trash2 size={16} /> Delete Records
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {(activeTab === 'drivers' && selectedDriverIds.length > 0) && (
                        <motion.div 
                            key="drivers-bar"
                            initial={{ y: 100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 100, opacity: 0 }}
                            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] md:w-auto"
                        >
                            <div className="bg-slate-900 text-white rounded-2xl shadow-2xl px-6 py-4 flex items-center gap-8 border border-white/10 glass-panel">
                                <div className="flex items-center gap-3 pr-8 border-r border-white/20">
                                    <div className="bg-green-500/20 p-1.5 rounded-lg">
                                        <Users size={18} className="text-green-400" />
                                    </div>
                                    <span className="font-medium whitespace-nowrap">{selectedDriverIds.length} Drivers</span>
                                    <button onClick={() => setSelectedDriverIds([])} className="p-1 hover:bg-white/10 rounded-full transition-colors"><X size={14}/></button>
                                </div>
                                <div className="flex items-center gap-4">
                                    <button 
                                        onClick={() => handleBulkDriverStatus('on-duty')}
                                        className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-green-500/20 text-green-400 transition-all text-sm font-medium"
                                    >
                                        <CheckCircle2 size={16} /> Force On-Duty
                                    </button>
                                    <button 
                                        onClick={() => handleBulkDriverStatus('off-duty')}
                                        className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-slate-500/20 text-slate-400 transition-all text-sm font-medium"
                                    >
                                        <ShieldBan size={16} /> Force Off-Duty
                                    </button>
                                    <button 
                                        onClick={handleBulkDriverDelete}
                                        className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-red-500/20 text-red-400 transition-all text-sm font-medium"
                                    >
                                        <Trash2 size={16} /> Delete
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

export default AdminFleet;
