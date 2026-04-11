import React, { useState, useEffect } from 'react';
import { Mail, Check, X, ClipboardCheck, User, Package, Clock, Filter, AlertTriangle } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import DataTable from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';
import Button from '../../components/ui/Button';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const PurchaseOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [showRejectModal, setShowRejectModal] = useState(false);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const res = await api.distributor.getIncomingPOs();
            if (res.success) {
                setOrders(res.data);
            }
        } catch (error) {
            toast.error('Failed to load purchase requests');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleAccept = async (id) => {
        try {
            setProcessing(true);
            const res = await api.distributor.acceptPO(id);
            if (res.success) {
                toast.success('Purchase Order accepted. Batch ownership transferred.');
                fetchOrders();
            }
        } catch (error) {
            toast.error(error.message || 'Operation failed');
        } finally {
            setProcessing(false);
        }
    };

    const handleReject = async () => {
        if (!rejectionReason) {
            toast.error('Please provide a reason for rejection');
            return;
        }
        try {
            setProcessing(true);
            const res = await api.distributor.rejectPO(selectedOrder._id, rejectionReason);
            if (res.success) {
                toast.success('Order rejected');
                setShowRejectModal(false);
                setSelectedOrder(null);
                setRejectionReason('');
                fetchOrders();
            }
        } catch (error) {
            toast.error(error.message || 'Operation failed');
        } finally {
            setProcessing(false);
        }
    };

    const columns = [
        {
            header: 'Order Details',
            accessor: 'poNumber',
            render: (row) => (
                <div className="flex flex-col">
                    <span className="font-bold text-slate-800 leading-none mb-1">{row.poNumber}</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{row.createdAt ? new Date(row.createdAt).toLocaleDateString() : 'N/A'}</span>
                </div>
            )
        },
        {
            header: 'Retailer',
            accessor: 'retailerId',
            render: (row) => {
                const retailer = row.retailerId;
                return (
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-wheat-100 flex items-center justify-center text-wheat-600 font-bold text-xs border border-wheat-200">
                            {retailer?.profile?.storeName ? retailer.profile.storeName[0] : 'R'}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-700">{retailer?.profile?.storeName || 'Retailer'}</span>
                            <span className="text-[10px] text-slate-400 font-medium">{retailer?.profile?.city}, {retailer?.profile?.state}</span>
                        </div>
                    </div>
                );
            }
        },
        {
            header: 'Product Requested',
            accessor: 'batchId',
            render: (row) => {
                const batch = row.batchId;
                return batch ? (
                    <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                            <Package size={14} className="text-slate-400" />
                            <span className="text-sm font-bold text-slate-800">{batch.crop}</span>
                        </div>
                        <span className="text-xs text-slate-500 font-medium ml-5">{batch.variety || 'Standard'} • Quality: {batch.qualityScore}%</span>
                    </div>
                ) : <span className="text-slate-400 italic">Product Removed</span>;
            }
        },
        {
            header: 'Requested Quantity',
            accessor: 'quantityRequested',
            render: (row) => (
                <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-800">{row.quantityRequested} {row.batchId?.unit}</span>
                    <span className="text-xs text-slate-500 font-medium text-emerald-600">Offered: ₹{row.priceOffered} / {row.batchId?.unit}</span>
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
                        className="capitalize font-bold text-[10px] bg-white border border-slate-100"
                    >
                        {status}
                    </StatusBadge>
                );
            }
        },
        {
            header: 'Actions',
            accessor: '_id',
            className: 'text-right',
            render: (row) => {
                const id = row._id;
                return row.status === 'pending' ? (
                    <div className="flex justify-end gap-2">
                        <button
                            onClick={() => handleAccept(id)}
                            disabled={processing}
                            title="Accept Order"
                            className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors disabled:opacity-50"
                        >
                            <Check size={18} />
                        </button>
                        <button
                            onClick={() => {
                                setSelectedOrder(row);
                                setShowRejectModal(true);
                            }}
                            disabled={processing}
                            title="Reject Order"
                            className="p-2 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition-colors disabled:opacity-50"
                        >
                            <X size={18} />
                        </button>
                    </div>
                ) : (
                    <span className="text-xs text-slate-300 font-medium flex items-center gap-1.5 justify-end">
                        <Clock size={12} />
                        Processed
                    </span>
                );
            }
        }
    ];

    return (
        <DashboardLayout role="distributor">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-in">
                    <div>
                        <h1 className="text-xl md:text-2xl font-display font-bold text-slate-800">Purchase Requests 📥</h1>
                        <p className="text-sm md:text-base text-slate-500">Manage incoming inventory requests from regional retailers</p>
                    </div>
                </div>

                {/* Dashboard stats cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-5 rounded-3xl shadow-sm border border-slate-50">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl"><Clock size={18}/></div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Pending</span>
                        </div>
                        <p className="text-3xl font-display font-bold text-slate-800">{orders.filter(o => o.status === 'pending').length}</p>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{delay: 0.1}} className="bg-white p-5 rounded-3xl shadow-sm border border-slate-50">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl"><Check size={18}/></div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Accepted</span>
                        </div>
                        <p className="text-3xl font-display font-bold text-slate-800">{orders.filter(o => o.status === 'accepted').length}</p>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{delay: 0.2}} className="bg-white p-5 rounded-3xl shadow-sm border border-slate-50">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl"><Mail size={18}/></div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Value</span>
                        </div>
                        <p className="text-3xl font-display font-bold text-slate-800">₹{(orders.reduce((sum, o) => sum + (o.quantityRequested * o.priceOffered), 0) / 1000).toFixed(1)}k</p>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{delay: 0.3}} className="bg-white p-5 rounded-3xl shadow-sm border border-slate-50">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-slate-100 text-slate-500 rounded-xl"><Filter size={18}/></div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Stock</span>
                        </div>
                        <p className="text-3xl font-display font-bold text-slate-800">{orders.length}</p>
                    </motion.div>
                </div>

                <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
                    <DataTable 
                        columns={columns} 
                        data={orders} 
                        loading={loading}
                    />

                    {!loading && orders.length === 0 && (
                        <div className="p-20 text-center animate-in">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                                <Mail size={40} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-700">Inbox is empty!</h3>
                            <p className="text-slate-400 max-w-sm mx-auto mt-2 font-medium">No purchase orders have been received from retailers yet. Good time to check your inventory publishing status.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Rejection Modal */}
            <AnimatePresence>
                {showRejectModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowRejectModal(false)} />
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-md bg-white rounded-[2rem] shadow-2xl p-8">
                            <div className="flex flex-col items-center gap-4 text-center mb-6">
                                <div className="p-4 bg-rose-50 text-rose-500 rounded-full">
                                    <AlertTriangle size={32} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-800">Reject Purchase Order</h3>
                                    <p className="text-sm text-slate-400">Please provide a reason why you are unable to fulfill this request from {selectedOrder?.retailerId?.profile?.storeName || 'the retailer'}.</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <textarea
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all text-sm font-medium"
                                    placeholder="e.g. Stock unavailable, Price mismatch..."
                                    rows={4}
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                />
                                <div className="grid grid-cols-2 gap-3 pt-2">
                                    <Button variant="ghost" onClick={() => setShowRejectModal(false)} disabled={processing}>Cancel</Button>
                                    <Button className="bg-rose-500 hover:bg-rose-600 shadow-lg shadow-rose-200" onClick={handleReject} loading={processing}>Reject Order</Button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </DashboardLayout>
    );
};

export default PurchaseOrders;
