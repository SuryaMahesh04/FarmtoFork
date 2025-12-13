import React from 'react';
import { Users, AlertTriangle, CheckCircle, Database } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import DashboardLayout from '../../components/layout/DashboardLayout';
import MetricCard from '../../components/ui/MetricCard';
import ChartCard from '../../components/ui/ChartCard';
import DataTable from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';
import { seasonalTrendData } from '../../data/dummyData';
import { chartTheme } from '../../utils/chartConfig';

const AdminDashboard = () => {
    const recentUsers = [
        { id: 'USR-001', name: 'Ravi Kumar', role: 'Farmer', status: 'Approved', date: 'Today' },
        { id: 'USR-002', name: 'Fast Logistics', role: 'Transporter', status: 'Pending', date: 'Today' },
        { id: 'USR-003', name: 'Green Foods', role: 'Retailer', status: 'Approved', date: 'Yesterday' },
    ];

    const columns = [
        { header: 'User ID', accessor: 'id' },
        { header: 'Name', accessor: 'name' },
        { header: 'Role', accessor: 'role' },
        { header: 'Date', accessor: 'date' },
        { header: 'Status', accessor: 'status', render: (row) => <StatusBadge status={row.status} /> },
    ];

    return (
        <DashboardLayout role="admin">
            <div className="space-y-6">
                <h1 className="text-2xl font-display font-bold text-slate-800 animate-in">Platform Overview 🛡️</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <MetricCard title="Total Users" value={1250} icon={Users} trend={12} color="sky" delay={0.1} />
                    <MetricCard title="Active Batches" value={340} icon={Database} trend={8} color="sage" delay={0.2} />
                    <MetricCard title="Pending Approvals" value={45} icon={AlertTriangle} trend={5} color="wheat" delay={0.3} />
                    <MetricCard title="System Health" value={99} icon={CheckCircle} trend={0} color="sage" delay={0.4} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="animate-in" style={{ animationDelay: '0.2s' }}>
                        <ChartCard title="Platform Growth" subtitle="New registrations vs Active users">
                            <BarChart data={seasonalTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <XAxis dataKey="name" {...chartTheme.axis} />
                                <YAxis {...chartTheme.axis} />
                                <Tooltip {...chartTheme.tooltip} />
                                <Bar dataKey="revenue" fill={chartTheme.colors.sky[1]} radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ChartCard>
                    </div>

                    <div className="animate-in space-y-4" style={{ animationDelay: '0.3s' }}>
                        <h2 className="text-lg font-display font-semibold text-slate-700">Recent Registrations</h2>
                        <DataTable columns={columns} data={recentUsers} />
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AdminDashboard;
