import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Database, AlertTriangle, Activity, Plus, UserCheck } from 'lucide-react';
import {
    PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, ResponsiveContainer,
    LineChart, Line, CartesianGrid
} from 'recharts';
import DashboardLayout from '../../components/layout/DashboardLayout';
import MetricCard from '../../components/ui/MetricCard';
import MobileMetricCard from '../../components/ui/MobileMetricCard';
import DataTable from '../../components/ui/DataTable';
import ChartCard from '../../components/ui/ChartCard';
import MobileChartCard from '../../components/ui/MobileChartCard';
import StatusBadge from '../../components/ui/StatusBadge';
import Button from '../../components/ui/Button';
import { chartTheme } from '../../utils/chartConfig';
import useMediaQuery from '../../utils/useMediaQuery';

// Dummy data
const userGrowthData = [
    { month: 'Jul', users: 850 },
    { month: 'Aug', users: 920 },
    { month: 'Sep', users: 1050 },
    { month: 'Oct', users: 1150 },
    { month: 'Nov', users: 1200 },
    { month: 'Dec', users: 1250 }
];

const userDistributionData = [
    { name: 'Farmers', value: 520, color: '#5c9449' },
    { name: 'Transporters', value: 280, color: '#3B82F6' },
    { name: 'Distributors', value: 240, color: '#f59e0b' },
    { name: 'Retailers', value: 210, color: '#10b981' }
];

const activityData = [
    { day: 'Mon', transactions: 145 },
    { day: 'Tue', transactions: 168 },
    { day: 'Wed', transactions: 192 },
    { day: 'Thu', transactions: 210 },
    { day: 'Fri', transactions: 235 },
    { day: 'Sat', transactions: 198 },
    { day: 'Sun', transactions: 176 }
];

const recentUsers = [
    { id: 'USR-001', name: 'Ravi Kumar', role: 'Farmer', status: 'good', date: 'Today' },
    { id: 'USR-002', name: 'Fast Logistics', role: 'Transporter', status: 'warning', date: 'Today' },
    { id: 'USR-003', name: 'Green Foods', role: 'Retailer', status: 'good', date: 'Yesterday' },
    { id: 'USR-004', name: 'Fresh Distribution', role: 'Distributor', status: 'good', date: 'Yesterday' },
    { id: 'USR-005', name: 'Organic Farm Co.', role: 'Farmer', status: 'warning', date: '2 days ago' }
];

const AdminDashboard = () => {
    const navigate = useNavigate();
    const isMobile = useMediaQuery('(max-width: 768px)');

    const columns = [
        { header: 'User ID', accessor: 'id' },
        { header: 'Name', accessor: 'name' },
        { header: 'Role', accessor: 'role' },
        { header: 'Date', accessor: 'date' },
        { header: 'Status', accessor: 'status', render: (row) => <StatusBadge status={row.status} /> },
    ];

    const ChartCardComponent = isMobile ? MobileChartCard : ChartCard;
    const chartHeight = isMobile ? 220 : 300;

    return (
        <DashboardLayout role="admin">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-in">
                    <div>
                        <h1 className="text-xl md:text-2xl font-display font-bold text-slate-800">Platform Overview 🛡️</h1>
                        <p className="text-sm md:text-base text-slate-500">Manage and monitor the entire platform</p>
                    </div>
                    {!isMobile && (
                        <Button icon={Plus} onClick={() => navigate('/admin/users')}>Add User</Button>
                    )}
                </div>

                {/* Metrics Grid */}
                <div className={`grid ${isMobile ? 'grid-cols-1 gap-3' : 'grid-cols-2 lg:grid-cols-4 gap-6'}`}>
                    {isMobile ? (
                        <>
                            <MobileMetricCard title="Total Users" value={1250} icon={Users} trend={12} color="sky" delay={0.1} />
                            <MobileMetricCard title="Active Batches" value={340} icon={Database} trend={8} color="sage" delay={0.2} />
                            <MobileMetricCard title="Pending Approvals" value={45} icon={AlertTriangle} trend={5} color="wheat" delay={0.3} />
                            <MobileMetricCard title="System Health" value="99%" icon={Activity} trend={0} color="sage" delay={0.4} />
                        </>
                    ) : (
                        <>
                            <MetricCard title="Total Users" value={1250} icon={Users} trend={12} color="sky" delay={0.1} />
                            <MetricCard title="Active Batches" value={340} icon={Database} trend={8} color="sage" delay={0.2} />
                            <MetricCard title="Pending Approvals" value={45} icon={AlertTriangle} trend={5} color="wheat" delay={0.3} />
                            <MetricCard title="System Health" value={99} icon={Activity} trend={0} color="sage" delay={0.4} />
                        </>
                    )}
                </div>

                {/* Charts Section */}
                <div className={isMobile ? 'space-y-4' : 'grid grid-cols-1 lg:grid-cols-3 gap-6'}>
                    <div className={isMobile ? 'space-y-4' : 'lg:col-span-2 space-y-6 animate-in'} style={!isMobile ? { animationDelay: '0.2s' } : {}}>
                        {/* User Growth */}
                        <ChartCardComponent title="Platform Growth" subtitle="Total users over time" height={chartHeight}>
                            <LineChart data={userGrowthData} margin={{ top: 10, right: isMobile ? 10 : 30, left: isMobile ? -20 : 0, bottom: 0 }}>
                                <XAxis dataKey="month" {...chartTheme.axis} tick={{ fontSize: isMobile ? 10 : 12 }} />
                                <YAxis {...chartTheme.axis} tick={{ fontSize: isMobile ? 10 : 12 }} />
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <Tooltip {...chartTheme.tooltip} />
                                <Line type="monotone" dataKey="users" stroke={chartTheme.colors.sky[0]} strokeWidth={3} dot={{ r: 5 }} name="Total Users" />
                            </LineChart>
                        </ChartCardComponent>

                        {/* Activity Trends */}
                        <ChartCardComponent title="Weekly Activity" subtitle="Transactions per day" height={isMobile ? 200 : 250}>
                            <BarChart data={activityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <XAxis dataKey="day" {...chartTheme.axis} tick={{ fontSize: isMobile ? 10 : 12 }} />
                                <YAxis {...chartTheme.axis} tick={{ fontSize: isMobile ? 10 : 12 }} />
                                <Tooltip {...chartTheme.tooltip} />
                                <Bar dataKey="transactions" fill={chartTheme.colors.sage[0]} radius={[4, 4, 0, 0]} name="Transactions" />
                            </BarChart>
                        </ChartCardComponent>
                    </div>

                    {/* Sidebar */}
                    <div className={isMobile ? 'space-y-4' : 'space-y-6 animate-in'} style={!isMobile ? { animationDelay: '0.3s' } : {}}>
                        {/* User Distribution */}
                        <ChartCardComponent title="User Distribution" subtitle="By role" height={isMobile ? 250 : 300}>
                            <PieChart>
                                <Pie
                                    data={userDistributionData}
                                    innerRadius={isMobile ? 50 : 60}
                                    outerRadius={isMobile ? 70 : 80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {userDistributionData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                                    ))}
                                </Pie>
                                <Tooltip {...chartTheme.tooltip} />
                            </PieChart>
                            <div className="flex justify-center flex-wrap gap-3 md:gap-4 mt-2">
                                {userDistributionData.map(d => (
                                    <div key={d.name} className="flex items-center gap-2 text-xs text-slate-500">
                                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }}></span>
                                        {d.name}
                                    </div>
                                ))}
                            </div>
                        </ChartCardComponent>

                        {/* Quick Stats */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                            <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                                <UserCheck size={18} className="text-blue-600" />
                                Quick Stats
                            </h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-slate-600">Approved Today</span>
                                    <span className="text-sm font-bold text-green-600">12</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-slate-600">Active Batches</span>
                                    <span className="text-sm font-bold text-slate-800">340</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-slate-600">Avg Response Time</span>
                                    <span className="text-sm font-bold text-blue-600">2.5h</span>
                                </div>
                            </div>
                            <Button variant="outline" size="sm" className="w-full mt-4" onClick={() => navigate('/admin/stats')}>
                                View Detailed Stats
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Recent Registrations */}
                <div className="animate-in" style={{ animationDelay: '0.4s' }}>
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                            <h2 className="text-base md:text-lg font-display font-semibold text-slate-700">Recent Registrations</h2>
                            {!isMobile && (
                                <Button variant="ghost" size="sm" onClick={() => navigate('/admin/users')}>View All</Button>
                            )}
                        </div>
                        <div className={isMobile ? 'overflow-x-auto' : ''}>
                            <DataTable columns={columns} data={recentUsers} onRowClick={(row) => navigate('/admin/users')} />
                        </div>
                    </div>
                </div>

                {/* Mobile FAB */}
                {isMobile && (
                    <button
                        onClick={() => navigate('/admin/users')}
                        className="fixed bottom-20 right-4 z-40 w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-2xl shadow-blue-500/50 flex items-center justify-center hover:scale-110 transition-transform active:scale-95"
                    >
                        <Plus size={24} strokeWidth={2.5} />
                    </button>
                )}
            </div>
        </DashboardLayout>
    );
};

export default AdminDashboard;
