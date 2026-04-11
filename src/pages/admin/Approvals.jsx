import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, Check, X, FileText } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import DataTable from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';
import useMediaQuery from '../../utils/useMediaQuery';
import useAdminStore from '../../utils/adminStore';

const AdminApprovals = () => {
    const isMobile = useMediaQuery('(max-width: 768px)');
    
    // Using live data from store
    const { approvals, fetchApprovals, approveKyc, rejectKyc, isLoading } = useAdminStore();
    
    useEffect(() => {
        fetchApprovals();
    }, []);

    const handleApprove = async (id) => {
        if(window.confirm('Are you sure you want to approve this KYC application?')) {
            await approveKyc(id);
        }
    };

    const handleReject = async (id) => {
        const reason = window.prompt("Reason for rejection:");
        if (reason) {
            await rejectKyc(id, reason);
        }
    };

    const columns = [
        { 
            header: 'User / Email', 
            accessor: (row) => (
                <div>
                    <div className="font-medium text-slate-800">{row.profile?.fullName || row.profile?.companyName || 'Unknown'}</div>
                    <div className="text-xs text-slate-500">{row.email}</div>
                </div>
            ) 
        },
        { 
            header: 'Role', 
            accessor: (row) => <span className="capitalize">{row.role}</span>
        },
        { 
            header: 'Submitted', 
            accessor: (row) => new Date(row.createdAt).toLocaleDateString()
        },
        { 
            header: 'KYC Docs', 
            accessor: (row) => (
                <div className="flex gap-2">
                     {row.profile?.aadhaarNumber && <StatusBadge status="neutral" label="Aadhaar" />}
                     {row.profile?.panNumber && <StatusBadge status="neutral" label="PAN" />}
                     {row.profile?.fssaiLicense && <StatusBadge status="neutral" label="FSSAI" />}
                </div>
            ) 
        },
        {
            header: 'Actions',
            accessor: (row) => (
                <div className="flex gap-2">
                    <button 
                        onClick={() => handleApprove(row._id)}
                        className="px-3 py-1 bg-green-100 text-green-700 rounded text-xs font-medium hover:bg-green-200 flex items-center gap-1"
                    >
                        <Check size={14}/> Approve
                    </button>
                    <button 
                        onClick={() => handleReject(row._id)}
                        className="px-3 py-1 bg-red-100 text-red-700 rounded text-xs font-medium hover:bg-red-200 flex items-center gap-1"
                    >
                        <X size={14}/> Reject
                    </button>
                </div>
            )
        },
    ];

    return (
        <DashboardLayout role="admin">
            <div className="space-y-6">
                <div className="animate-in">
                    <h1 className="text-xl md:text-2xl font-display font-bold text-slate-800">Pending KYC Approvals</h1>
                    <p className="text-sm md:text-base text-slate-500">Review and approve new user registrations</p>
                </div>

                {/* Stats Cards */}
                <div className={`grid ${isMobile ? 'grid-cols-2 gap-3' : 'grid-cols-4 gap-6'} animate-in`} style={{ animationDelay: '0.1s' }}>
                    <div className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-2 text-slate-600 mb-2">
                            <Clock size={18} />
                            <span className="text-xs font-medium">Pending Review</span>
                        </div>
                        <p className="text-2xl font-bold text-amber-600">{approvals?.length || 0}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm opacity-60">
                        <div className="flex items-center gap-2 text-slate-600 mb-2">
                            <CheckCircle size={18} />
                            <span className="text-xs font-medium">Approved Today</span>
                        </div>
                        <p className="text-2xl font-bold text-green-600">--</p>
                    </div>
                </div>

                {/* Approvals Table */}
                <div className="animate-in" style={{ animationDelay: '0.3s' }}>
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden relative min-h-[300px]">
                        
                        {isLoading && (
                            <div className="absolute inset-0 bg-white/80 z-10 flex items-center justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600"></div>
                            </div>
                        )}

                        <div className="p-4 border-b border-slate-100">
                            <h2 className="text-base md:text-lg font-display font-semibold text-slate-700">
                                {approvals?.length || 0} Pending Approval{(approvals?.length !== 1) ? 's' : ''}
                            </h2>
                        </div>
                        
                        <div className={isMobile ? 'overflow-x-auto' : ''}>
                            {approvals && approvals.length > 0 ? (
                                <DataTable columns={columns} data={approvals} />
                             ) : (
                                <div className="text-center py-12">
                                    <FileText className="mx-auto text-slate-300 mb-4" size={48} />
                                    <p className="text-slate-500">All caught up! No pending approvals.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AdminApprovals;
