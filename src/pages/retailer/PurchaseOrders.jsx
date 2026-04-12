import React, { useState, useEffect } from 'react';
import { ClipboardList, Filter, Search, Clock, CheckCircle2, XCircle, ChevronRight, Package, User } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import DataTable from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';
import Button from '../../components/ui/Button';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const PurchaseOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('all');

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const res = await api.retailer.getPurchaseOrders();
            if (res.success) {
                setOrders(res.data);
            }
        } catch (error) {
            toast.error('Failed to load purchase orders');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const filteredOrders = orders.filter(o => 
        filterStatus === 'all' || o.status === filterStatus
    );

    const columns = [
        {
            header: 'PO Number',
            accessor: 'poNumber',
            render: (row) => (
                <div className="flex flex-col">
                    <span className="font-bold text-slate-800 tracking-tight">{row.poNumber}</span>
                    <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{row.createdAt ? new Date(row.createdAt).toLocaleDateString() : 'N/A'}</span>
                </div>
            )
        },
        {
            header: 'Product',
            accessor: 'batchId',
            render: (row) => {
                const batch = row.batchId;
                return batch ? (
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
                            {batch.crop ? batch.crop[0] : '?'}
                        </div>
                        <div className="flex flex-col">
                            <span className="font-medium text-slate-700">{batch.crop}</span>
                            <span className="text-xs text-slate-400 capitalize">{batch.variety || 'Standard'}</span>
                        </div>
                    </div>
                ) : 'N/A';
            }
        },
        {
            header: 'Distributor',
            accessor: 'distributorId',
            render: (row) => {
                const dist = row.distributorId;
                return (
                    <div className="flex items-center gap-2">
                        <User size={14} className="text-slate-400" />
                        <span className="text-sm text-slate-600">{dist?.profile?.companyName || dist?.profile?.fullName || 'Distributor'}</span>
                    </div>
                );
            }
        },
        {
            header: 'Ordered Info',
            accessor: 'quantityRequested',
            render: (row) => (
                <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-800">{row.quantityRequested} {row.batchId?.unit}</span>
                    <span className="text-xs text-slate-500 font-medium">₹{row.priceOffered} / {row.batchId?.unit}</span>
                </div>
            )
        },
        {
            header: 'Status',
            accessor: 'status',
            render: (row) => {
                const status = row.status;
                return (
                    <StatusBadge 
                        status={status === 'accepted' ? 'good' : (status === 'pending' ? 'warning' : 'critical')}
                        className="capitalize px-3 py-1 font-bold text-[10px] bg-white border border-slate-100"
                    >
                        {status}
                    </StatusBadge>
                );
            }
        },
        {
            header: 'Total Value',
            accessor: '_id',
            render: (row) => (
                <span className="font-bold text-slate-900">₹{(row.quantityRequested * row.priceOffered).toLocaleString()}</span>
            )
        }
    ];

    const stats = [
        { label: 'Total Raised', count: orders.length, color: 'blue', icon: ClipboardList },
        { label: 'Pending', count: orders.filter(o => o.status === 'pending').length, color: 'amber', icon: Clock },
        { label: 'Accepted', count: orders.filter(o => o.status === 'accepted').length, color: 'emerald', icon: CheckCircle2 },
        { label: 'Rejected', count: orders.filter(o => o.status === 'rejected').length, color: 'rose', icon: XCircle },
    ];

    return (
        <DashboardLayout role="retailer">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-in">
                    <div>
                        <h1 className="text-xl md:text-2xl font-display font-bold text-slate-800">My Purchase Orders 📋</h1>
                        <p className="text-sm md:text-base text-slate-500">Track and manage your procurement requests</p>
                    </div>
                    <Button icon={Filter} onClick={() => window.location.href = '/retailer/marketplace'} variant="outline">Browse Marketplace</Button>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {stats.map((stat, i) => (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            key={stat.label} 
                            className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4"
                        >
                            <div className={`p-3 rounded-xl bg-${stat.color}-50 text-${stat.color}-600`}>
                                <stat.icon size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{stat.label}</p>
                                <p className="text-xl font-bold text-slate-800">{stat.count}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Table Section */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <span className="text-sm font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">Filter By:</span>
                            <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-full">
                                {['all', 'pending', 'accepted', 'rejected'].map(s => (
                                    <button
                                        key={s}
                                        onClick={() => setFilterStatus(s)}
                                        className={`flex-1 md:flex-none px-4 py-1.5 rounded-lg text-xs font-bold transition-all capitalize ${
                                            filterStatus === s ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                                        }`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    
                    <DataTable 
                        columns={columns} 
                        data={filteredOrders} 
                        loading={loading}
                        onRowClick={(row) => console.log('View PO Details', row)}
                    />

                    {!loading && filteredOrders.length === 0 && (
                        <div className="p-12 text-center text-slate-400">
                            <Package className="mx-auto mb-4 opacity-20" size={48} />
                            <p className="font-medium">No purchase orders matching your filters.</p>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default PurchaseOrders;
