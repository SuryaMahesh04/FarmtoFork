import React, { useState } from 'react';
import { Users, Search, Filter } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import DataTable from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';
import Button from '../../components/ui/Button';
import useMediaQuery from '../../utils/useMediaQuery';

const allUsers = [
    { id: 'USR-001', name: 'Ravi Kumar', email: 'ravi@farm.com', role: 'Farmer', status: 'good', joinDate: '2024-01-15' },
    { id: 'USR-002', name: 'Fast Logistics', email: 'contact@fastlog.com', role: 'Transp', status: 'warning', joinDate: '2024-02-20' },
    { id: 'USR-003', name: 'Green Foods', email: 'info@greenfoods.com', role: 'Retailer', status: 'good', joinDate: '2024-03-10' },
    { id: 'USR-004', name: 'Fresh Distribution', email: 'admin@freshdist.com', role: 'Distrib', status: 'good', joinDate: '2024-04-05' },
    { id: 'USR-005', name: 'Organic Farm Co.', email: 'organic@farm.com', role: 'Farmer', status: 'warning', joinDate: '2024-05-12' },
    { id: 'USR-006', name: 'Swift Transport', email: 'swift@transport.com', role: 'Transp', status: 'good', joinDate: '2024-06-18' },
    { id: 'USR-007', name: 'City Market', email: 'city@market.com', role: 'Retailer', status: 'critical', joinDate: '2024-07-22' },
    { id: 'USR-008', name: 'Central Warehouse', email: 'central@warehouse.com', role: 'Distrib', status: 'good', joinDate: '2024-08-30' },
    { id: 'USR-009', name: 'Valley Farms', email: 'valley@farms.com', role: 'Farmer', status: 'good', joinDate: '2024-09-14' },
    { id: 'USR-010', name: 'Quick Delivery', email: 'quick@delivery.com', role: 'Transp', status: 'good', joinDate: '2024-10-08' }
];

const AdminUsers = () => {
    const isMobile = useMediaQuery('(max-width: 768px)');
    const [filterRole, setFilterRole] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const columns = [
        { header: 'User ID', accessor: 'id' },
        { header: 'Name', accessor: 'name' },
        { header: 'Email', accessor: 'email' },
        { header: 'Role', accessor: 'role' },
        { header: 'Join Date', accessor: 'joinDate' },
        { header: 'Status', accessor: 'status', render: (row) => <StatusBadge status={row.status} /> },
    ];

    const filteredUsers = allUsers.filter(user => {
        const matchesRole = filterRole === 'all' || user.role.toLowerCase().startsWith(filterRole.toLowerCase());
        const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.id.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesRole && matchesSearch;
    });

    const roleCounts = {
        all: allUsers.length,
        farmer: allUsers.filter(u => u.role === 'Farmer').length,
        transporter: allUsers.filter(u => u.role === 'Transp').length,
        distributor: allUsers.filter(u => u.role === 'Distrib').length,
        retailer: allUsers.filter(u => u.role === 'Retailer').length
    };

    return (
        <DashboardLayout role="admin">
            <div className="space-y-6">
                <div className="animate-in">
                    <h1 className="text-xl md:text-2xl font-display font-bold text-slate-800">User Management</h1>
                    <p className="text-sm md:text-base text-slate-500">Manage all platform users</p>
                </div>

                {/* Role Filter */}
                <div className={`${isMobile ? 'flex overflow-x-auto gap-2 pb-2' : 'flex gap-4'} animate-in`} style={{ animationDelay: '0.1s' }}>
                    {[
                        { key: 'all', label: 'All Users', count: roleCounts.all },
                        { key: 'farmer', label: 'Farmers', count: roleCounts.farmer },
                        { key: 'transporter', label: 'Transporters', count: roleCounts.transporter },
                        { key: 'distributor', label: 'Distributors', count: roleCounts.distributor },
                        { key: 'retailer', label: 'Retailers', count: roleCounts.retailer }
                    ].map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setFilterRole(tab.key)}
                            className={`${isMobile ? 'px-4 py-2 text-sm whitespace-nowrap' : 'px-6 py-3'
                                } rounded-lg font-medium transition-all ${filterRole === tab.key
                                    ? 'bg-blue-100 text-blue-800 shadow-sm'
                                    : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                                }`}
                        >
                            {tab.label}
                            <span className={`ml-2 ${isMobile ? 'text-xs' : 'text-sm'} ${filterRole === tab.key ? 'text-blue-600' : 'text-slate-400'}`}>
                                ({tab.count})
                            </span>
                        </button>
                    ))}
                </div>

                {/* Search Bar */}
                <div className="animate-in" style={{ animationDelay: '0.2s' }}>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by name or user ID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none bg-white"
                        />
                    </div>
                </div>

                {/* Users Table */}
                <div className="animate-in" style={{ animationDelay: '0.3s' }}>
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                            <h2 className="text-base md:text-lg font-display font-semibold text-slate-700">
                                {filteredUsers.length} User{filteredUsers.length !== 1 ? 's' : ''}
                            </h2>
                            {!isMobile && (
                                <Button icon={Filter} variant="ghost" size="sm">Bulk Actions</Button>
                            )}
                        </div>
                        <div className={isMobile ? 'overflow-x-auto' : ''}>
                            <DataTable columns={columns} data={filteredUsers} />
                        </div>
                    </div>

                    {filteredUsers.length === 0 && (
                        <div className="text-center py-12">
                            <Users className="mx-auto text-slate-300 mb-4" size={48} />
                            <p className="text-slate-500">No users found matching your criteria</p>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AdminUsers;
