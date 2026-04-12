import React, { useState, useEffect } from 'react';
import { Users, Search, Filter, ShieldBan, CheckCircle2, MoreVertical, Trash2, X, ShieldCheck, UserX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '../../components/layout/DashboardLayout';
import DataTable from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';
import Button from '../../components/ui/Button';
import useMediaQuery from '../../utils/useMediaQuery';
import useAdminStore from '../../utils/adminStore';
import { toast } from 'react-hot-toast';

const AdminUsers = () => {
    const isMobile = useMediaQuery('(max-width: 768px)');
    const [filterRole, setFilterRole] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [page, setPage] = useState(1);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [selectedUserIds, setSelectedUserIds] = useState([]);

    const { 
        users, usersPagination, isLoading, fetchUsers, 
        suspendUser, deleteUser, bulkSuspendUsers, 
        bulkVerifyUsers, bulkDeleteUsers 
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
        if (filterRole !== 'all') filters.role = filterRole;
        if (debouncedSearch) filters.search = debouncedSearch;
        fetchUsers(filters);
        setSelectedUserIds([]); // Clear selection on refresh/filter
    }, [filterRole, debouncedSearch, page]);

    const handleSuspend = async (id, currentState) => {
        if(window.confirm(`Are you sure you want to ${currentState ? 'suspend' : 'activate'} this user?`)) {
            await suspendUser(id);
            setActiveDropdown(null);
        }
    };

    const handleDelete = async (id) => {
        if(window.confirm('WARNING: Hard delete is permanent. Are you sure?')) {
            await deleteUser(id);
            setActiveDropdown(null);
        }
    };

    // Bulk Action Handlers
    const handleBulkSuspend = async (action) => {
        if (window.confirm(`Are you sure you want to bulk ${action} ${selectedUserIds.length} users?`)) {
            await bulkSuspendUsers(selectedUserIds, action);
            setSelectedUserIds([]);
        }
    };

    const handleBulkVerify = async () => {
        if (window.confirm(`Verify ${selectedUserIds.length} users?`)) {
            await bulkVerifyUsers(selectedUserIds);
            setSelectedUserIds([]);
        }
    };

    const handleBulkDelete = async () => {
        if (window.confirm(`DANGER: Permanently delete ${selectedUserIds.length} users? This cannot be undone.`)) {
            await bulkDeleteUsers(selectedUserIds);
            setSelectedUserIds([]);
        }
    };

    const columns = [
        { 
            header: 'Email / Name', 
            accessor: (row) => (
                <div>
                    <div className="font-medium text-slate-800">{row.profile?.fullName || row.profile?.companyName || 'Not Set'}</div>
                    <div className="text-xs text-slate-500">{row.email}</div>
                </div>
            ) 
        },
        { 
            header: 'Role', 
            accessor: (row) => <span className="capitalize">{row.role}</span> 
        },
        { 
            header: 'Join Date', 
            accessor: (row) => new Date(row.createdAt).toLocaleDateString() 
        },
        { 
            header: 'Status', 
            accessor: (row) => (
                <div className="flex gap-2">
                    <StatusBadge status={row.isActive ? 'good' : 'critical'} label={row.isActive ? 'Active' : 'Suspended'} />
                    {!row.isVerified && <StatusBadge status="warning" label="Unverified" />}
                </div>
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
                                <button 
                                    onClick={() => handleSuspend(row._id, row.isActive)}
                                    className="w-full text-left px-4 py-2 text-sm text-yellow-600 hover:bg-slate-50 flex items-center gap-2"
                                >
                                    {row.isActive ? <ShieldBan size={14} /> : <CheckCircle2 size={14} className="text-green-600" />}
                                    {row.isActive ? 'Suspend' : 'Activate'}
                                </button>
                                <button 
                                    onClick={() => handleDelete(row._id)}
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-slate-50 flex items-center gap-2"
                                >
                                    <Trash2 size={14} /> Delete
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
            <div className="space-y-6 relative pb-20">
                <div className="animate-in flex justify-between items-end">
                    <div>
                        <h1 className="text-xl md:text-2xl font-display font-bold text-slate-800">User Management</h1>
                        <p className="text-sm md:text-base text-slate-500">Manage all platform users ({usersPagination?.total || 0} total)</p>
                    </div>
                </div>

                {/* Role Filter */}
                <div className={`${isMobile ? 'flex overflow-x-auto gap-2 pb-2 custom-scrollbar' : 'flex gap-4'} animate-in`} style={{ animationDelay: '0.1s' }}>
                    {[
                        { key: 'all', label: 'All Users' },
                        { key: 'farmer', label: 'Farmers' },
                        { key: 'transporter', label: 'Transporters' },
                        { key: 'distributor', label: 'Distributors' },
                        { key: 'retailer', label: 'Retailers' }
                    ].map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => { setFilterRole(tab.key); setPage(1); }}
                            className={`${isMobile ? 'px-4 py-2 text-sm whitespace-nowrap' : 'px-6 py-3'} 
                                rounded-lg font-medium transition-all ${filterRole === tab.key
                                    ? 'bg-blue-100 text-blue-800 shadow-sm'
                                    : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Search Bar */}
                <div className="animate-in" style={{ animationDelay: '0.2s' }}>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none bg-white"
                        />
                    </div>
                </div>

                {/* Users Table */}
                <div className="animate-in" style={{ animationDelay: '0.3s' }}>
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden relative min-h-[400px]">
                        
                        {isLoading && (
                            <div className="absolute inset-0 bg-white/80 z-10 flex items-center justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600"></div>
                            </div>
                        )}
                        
                        <div className={isMobile ? 'overflow-x-auto' : ''}>
                            <DataTable 
                                columns={columns} 
                                data={users} 
                                selectable={true}
                                selectedIds={selectedUserIds}
                                onSelectionChange={setSelectedUserIds}
                                idField="_id"
                            />
                        </div>
                        
                        {!isLoading && users.length === 0 && (
                            <div className="text-center py-12">
                                <Users className="mx-auto text-slate-300 mb-4" size={48} />
                                <p className="text-slate-500">No users found matching your criteria</p>
                            </div>
                        )}
                        
                        {/* Pagination */}
                        {usersPagination && usersPagination.pages > 1 && (
                            <div className="p-4 border-t border-slate-100 flex justify-between items-center bg-slate-50">
                                <span className="text-sm text-slate-500">
                                    Page {usersPagination.page} of {usersPagination.pages}
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
                                        disabled={page === usersPagination.pages}
                                        onClick={() => setPage(page + 1)}
                                    >Next</Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Bulk Actions Floating Bar */}
                <AnimatePresence>
                    {selectedUserIds.length > 0 && (
                        <motion.div 
                            initial={{ y: 100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 100, opacity: 0 }}
                            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] md:w-auto"
                        >
                            <div className="bg-slate-900 text-white rounded-2xl shadow-2xl px-4 py-3 md:px-6 md:py-4 flex flex-col md:flex-row items-center gap-4 md:gap-8 border border-white/10 glass-panel">
                                <div className="flex items-center gap-3 pr-o md:pr-8 border-b md:border-b-0 md:border-r border-white/20 pb-2 md:pb-0 w-full md:w-auto justify-between md:justify-start">
                                    <div className="flex items-center gap-2">
                                        <div className="bg-blue-500/20 p-1.5 rounded-lg">
                                            <CheckCircle2 size={18} className="text-blue-400" />
                                        </div>
                                        <span className="font-medium whitespace-nowrap">{selectedUserIds.length} Selected</span>
                                    </div>
                                    <button 
                                        onClick={() => setSelectedUserIds([])}
                                        className="p-1 hover:bg-white/10 rounded-full transition-colors"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>

                                <div className="flex items-center gap-2 md:gap-4 w-full md:w-auto justify-center">
                                    <button 
                                        onClick={() => handleBulkVerify()}
                                        className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-green-500/20 text-green-400 transition-all text-sm font-medium"
                                    >
                                        <ShieldCheck size={16} /> <span className="hidden md:inline">Verify All</span>
                                    </button>
                                    <button 
                                        onClick={() => handleBulkSuspend('suspend')}
                                        className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-yellow-500/20 text-yellow-400 transition-all text-sm font-medium"
                                    >
                                        <ShieldBan size={16} /> <span className="hidden md:inline">Suspend</span>
                                    </button>
                                    <button 
                                        onClick={() => handleBulkSuspend('activate')}
                                        className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-blue-500/20 text-blue-400 transition-all text-sm font-medium"
                                    >
                                        <CheckCircle2 size={16} /> <span className="hidden md:inline">Activate</span>
                                    </button>
                                    <button 
                                        onClick={() => handleBulkDelete()}
                                        className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-red-500/20 text-red-400 transition-all text-sm font-medium"
                                    >
                                        <Trash2 size={16} /> <span className="hidden md:inline">Delete</span>
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

export default AdminUsers;
