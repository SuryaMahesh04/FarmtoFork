import React, { useState, useEffect } from 'react';
import { User, Shield, Terminal, Save, Activity } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import DataTable from '../../components/ui/DataTable';
import Button from '../../components/ui/Button';
import useAdminStore from '../../utils/adminStore';

const Settings = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const { auditLogs, fetchAuditLogs, isLoading, auditLogsPagination } = useAdminStore();
    const [page, setPage] = useState(1);
    
    // Hardcoded for now as admin auth profile isn't fully expanded
    const [formData, setFormData] = useState({
        name: 'Super Admin',
        email: 'admin@farm2fork.com',
        phone: '+91 98765 43210',
    });

    useEffect(() => {
        if (activeTab === 'audit') {
            fetchAuditLogs({ page, limit: 15 });
        }
    }, [activeTab, page]);

    const tabs = [
        { id: 'profile', label: 'Profile Settings', icon: User },
        { id: 'security', label: 'Security', icon: Shield },
        { id: 'audit', label: 'Audit Log 🛡️', icon: Terminal },
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = () => {
        alert('Settings saved successfully!');
    };

    const auditColumns = [
        { 
            header: 'Timestamp', 
            accessor: (row) => new Date(row.createdAt).toLocaleString()
        },
        { 
            header: 'Admin', 
            accessor: (row) => (
                <div className="text-sm">
                    {row.adminId?.profile?.fullName || row.adminId?.email || 'System'}
                </div>
            )
        },
        { 
            header: 'Action', 
            accessor: (row) => (
                <span className="text-xs font-mono bg-slate-100 text-slate-700 px-2 py-1 rounded">
                    {row.action}
                </span>
            )
        },
        { 
            header: 'Details', 
            accessor: 'details'
        }
    ];

    return (
        <DashboardLayout role="admin">
            <div className="max-w-6xl mx-auto space-y-6 animate-in">
                <div>
                    <h1 className="text-2xl font-display font-bold text-slate-800">Admin Settings</h1>
                    <p className="text-slate-500">Manage your account and view platform audit logs</p>
                </div>

                <div className="flex flex-col md:flex-row gap-6">
                    {/* Sidebar Tabs */}
                    <div className="w-full md:w-64 space-y-2">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-white text-slate-600 hover:bg-blue-50'
                                    }`}
                            >
                                <tab.icon size={18} />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 bg-white p-6 rounded-xl shadow-sm border border-slate-100 min-h-[500px]">
                        {activeTab === 'profile' && (
                            <div className="space-y-6 animate-in fade-in">
                                <h2 className="text-lg font-semibold text-slate-800 border-b border-slate-100 pb-2">Admin Profile Information</h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Full Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full p-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Email Address</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            disabled
                                            className="w-full p-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Phone Number</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full p-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <Button icon={Save} onClick={handleSave}>Save Changes</Button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div className="space-y-6 animate-in fade-in">
                                <h2 className="text-lg font-semibold text-slate-800 border-b border-slate-100 pb-2">Security Settings</h2>

                                <div className="space-y-4">
                                    <div className="p-4 border border-yellow-100 bg-yellow-50 rounded-lg text-yellow-800 text-sm">
                                        Admin accounts are highly privileged. Ensure you use a strong password.
                                    </div>

                                    <Button variant="outline">Change Password</Button>
                                    <Button variant="outline" className="text-blue-600 hover:bg-blue-50 border-blue-200 ml-4">
                                        Enable 2FA (Recommended)
                                    </Button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'audit' && (
                            <div className="space-y-4 animate-in fade-in">
                                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                                    <h2 className="text-lg font-semibold text-slate-800">System Audit Log</h2>
                                    <Button size="sm" variant="outline" icon={Activity} onClick={() => fetchAuditLogs()}>Refresh</Button>
                                </div>
                                <p className="text-sm text-slate-500">Immutable record of all administrative actions platform-wide.</p>
                                
                                <div className="border border-slate-100 rounded-lg overflow-hidden relative min-h-[300px]">
                                    {isLoading && (
                                        <div className="absolute inset-0 bg-white/80 z-10 flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600"></div>
                                        </div>
                                    )}
                                    <DataTable columns={auditColumns} data={auditLogs} />
                                </div>
                                
                                {auditLogsPagination && auditLogsPagination.pages > 1 && (
                                    <div className="flex justify-between items-center pt-2">
                                        <span className="text-sm text-slate-500">
                                            Page {auditLogsPagination.page} of {auditLogsPagination.pages}
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
                                                disabled={page === auditLogsPagination.pages}
                                                onClick={() => setPage(page + 1)}
                                            >Next</Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Settings;
