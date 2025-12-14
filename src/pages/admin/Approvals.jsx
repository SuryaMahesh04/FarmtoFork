import React, { useState } from 'react';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import DataTable from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';
import Button from '../../components/ui/Button';
import useMediaQuery from '../../utils/useMediaQuery';

const pendingApprovals = [
    { id: 'APP-001', type: 'User', item: 'Sunrise Farms', submittedBy: 'Auto', date: '2024-12-14', status: 'warning' },
    { id: 'APP-002', type: 'Batch', item: 'Wheat Batch #789', submittedBy: 'Ravi Kumar', date: '2024-12-14', status: 'warning' },
    { id: 'APP-003', type: 'User', item: 'City Transport LLC', submittedBy: 'Auto', date: '2024-12-13', status: 'warning' },
    { id: 'APP-004', type: 'Product', item: 'Organic Honey', submittedBy: 'Green Foods', date: '2024-12-13', status: 'warning' },
    { id: 'APP-005', type: 'Batch', item: 'Rice Batch #456', submittedBy: 'Valley Farms', date: '2024-12-12', status: 'warning' }
];

const Approvals = () => {
    const isMobile = useMediaQuery('(max-width: 768px)');
    const [filterType, setFilterType] = useState('all');

    const columns = [
        { header: 'Approval ID', accessor: 'id' },
        { header: 'Type', accessor: 'type' },
        { header: 'Item', accessor: 'item' },
        { header: 'Submitted By', accessor: 'submittedBy' },
        { header: 'Date', accessor: 'date' },
        {
            header: 'Actions',
            accessor: 'id',
            render: (row) => (
                <div className="flex gap-2">
                    <button className="px-3 py-1 bg-green-100 text-green-700 rounded text-xs font-medium hover:bg-green-200">
                        Approve
                    </button>
                    <button className="px-3 py-1 bg-red-100 text-red-700 rounded text-xs font-medium hover:bg-red-200">
                        Reject
                    </button>
                </div>
            )
        },
    ];

    const filteredApprovals = pendingApprovals.filter(approval =>
        filterType === 'all' || approval.type.toLowerCase() === filterType.toLowerCase()
    );

    const typeCounts = {
        all: pendingApprovals.length,
        user: pendingApprovals.filter(a => a.type === 'User').length,
        batch: pendingApprovals.filter(a => a.type === 'Batch').length,
        product: pendingApprovals.filter(a => a.type === 'Product').length
    };

    return (
        <DashboardLayout role="admin">
            <div className="space-y-6">
                <div className="animate-in">
                    <h1 className="text-xl md:text-2xl font-display font-bold text-slate-800">Pending Approvals</h1>
                    <p className="text-sm md:text-base text-slate-500">Review and approve platform requests</p>
                </div>

                {/* Stats Cards */}
                <div className={`grid ${isMobile ? 'grid-cols-2 gap-3' : 'grid-cols-4 gap-6'} animate-in`} style={{ animationDelay: '0.1s' }}>
                    <div className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-2 text-slate-600 mb-2">
                            <Clock size={18} />
                            <span className="text-xs font-medium">Pending</span>
                        </div>
                        <p className="text-2xl font-bold text-amber-600">{pendingApprovals.length}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-2 text-slate-600 mb-2">
                            <CheckCircle size={18} />
                            <span className="text-xs font-medium">Approved Today</span>
                        </div>
                        <p className="text-2xl font-bold text-green-600">12</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-2 text-slate-600 mb-2">
                            <XCircle size={18} />
                            <span className="text-xs font-medium">Rejected</span>
                        </div>
                        <p className="text-2xl font-bold text-red-600">3</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-2 text-slate-600 mb-2">
                            <Clock size={18} />
                            <span className="text-xs font-medium">Avg Time</span>
                        </div>
                        <p className="text-2xl font-bold text-slate-800">2.5h</p>
                    </div>
                </div>

                {/* Type Filter */}
                <div className={`${isMobile ? 'flex overflow-x-auto gap-2 pb-2' : 'flex gap-4'} animate-in`} style={{ animationDelay: '0.2s' }}>
                    {[
                        { key: 'all', label: 'All Types', count: typeCounts.all },
                        { key: 'user', label: 'Users', count: typeCounts.user },
                        { key: 'batch', label: 'Batches', count: typeCounts.batch },
                        { key: 'product', label: 'Products', count: typeCounts.product }
                    ].map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setFilterType(tab.key)}
                            className={`${isMobile ? 'px-4 py-2 text-sm whitespace-nowrap' : 'px-6 py-3'
                                } rounded-lg font-medium transition-all ${filterType === tab.key
                                    ? 'bg-blue-100 text-blue-800 shadow-sm'
                                    : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                                }`}
                        >
                            {tab.label}
                            <span className={`ml-2 ${isMobile ? 'text-xs' : 'text-sm'} ${filterType === tab.key ? 'text-blue-600' : 'text-slate-400'}`}>
                                ({tab.count})
                            </span>
                        </button>
                    ))}
                </div>

                {/* Approvals Table */}
                <div className="animate-in" style={{ animationDelay: '0.3s' }}>
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="p-4 border-b border-slate-100">
                            <h2 className="text-base md:text-lg font-display font-semibold text-slate-700">
                                {filteredApprovals.length} Pending Approval{filteredApprovals.length !== 1 ? 's' : ''}
                            </h2>
                        </div>
                        <div className={isMobile ? 'overflow-x-auto' : ''}>
                            <DataTable columns={columns} data={filteredApprovals} />
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Approvals;
