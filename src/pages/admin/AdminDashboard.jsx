import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Database, AlertTriangle, Activity, PackagePlus, Truck, QrCode, ShieldAlert, CheckCircle } from 'lucide-react';
import {
    PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, ResponsiveContainer,
    LineChart, Line, CartesianGrid
} from 'recharts';
import DashboardLayout from '../../components/layout/DashboardLayout';
import MetricCard from '../../components/ui/MetricCard';
import MobileMetricCard from '../../components/ui/MobileMetricCard';
import ChartCard from '../../components/ui/ChartCard';
import MobileChartCard from '../../components/ui/MobileChartCard';
import Button from '../../components/ui/Button';
import { chartTheme } from '../../utils/chartConfig';
import useMediaQuery from '../../utils/useMediaQuery';
import useAdminStore from '../../utils/adminStore';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const isMobile = useMediaQuery('(max-width: 768px)');
    
    const { overview, activityFeed, fetchOverview, fetchActivityFeed, fetchAnalytics, analytics, isLoading } = useAdminStore();

    useEffect(() => {
        fetchOverview();
        fetchActivityFeed();
        fetchAnalytics('users');
        fetchAnalytics('supply-chain');
        
        // Polling every 15 seconds for live feel
        const interval = setInterval(() => {
            fetchOverview();
            fetchActivityFeed();
        }, 15000);
        
        return () => clearInterval(interval);
    }, []);

    const ChartCardComponent = isMobile ? MobileChartCard : ChartCard;
    const chartHeight = isMobile ? 220 : 300;

    // Formatting for GMV
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(value || 0);
    };

    // Prepare chart data from API
    const userRoleData = analytics?.users?.roles?.map(r => ({
        name: r._id.charAt(0).toUpperCase() + r._id.slice(1),
        value: r.count,
        color: r._id === 'farmer' ? '#5c9449' : 
               r._id === 'transporter' ? '#3B82F6' : 
               r._id === 'distributor' ? '#f59e0b' : 
               r._id === 'retailer' ? '#10b981' : '#8b5cf6'
    })) || [];

    const getIconForEvent = (iconName) => {
        switch(iconName) {
            case 'UserPlus': return <Users size={16} className="text-blue-500" />;
            case 'PackagePlus': return <PackagePlus size={16} className="text-green-500" />;
            case 'Truck': return <Truck size={16} className="text-amber-500" />;
            case 'AlertTriangle': return <AlertTriangle size={16} className="text-red-500" />;
            case 'QrCode': return <QrCode size={16} className="text-purple-500" />;
            default: return <Activity size={16} className="text-slate-500" />;
        }
    };

    if (!overview) {
        return (
            <DashboardLayout role="admin">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage-600"></div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout role="admin">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-in">
                    <div>
                        <h1 className="text-xl md:text-2xl font-display font-bold text-slate-800 flex items-center gap-2">
                            Platform Command Center <ShieldAlert className="text-blue-600" size={24} />
                        </h1>
                        <p className="text-sm md:text-base text-slate-500">Live monitoring of all Farm2Fork operations</p>
                    </div>
                    {!isMobile && (
                        <div className="flex items-center gap-2 text-sm text-slate-500 bg-white px-3 py-1.5 rounded-full shadow-sm border border-slate-100">
                            <span className="relative flex h-3 w-3">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                            </span>
                            Live Updates Secure
                        </div>
                    )}
                </div>

                {/* Metrics Grid */}
                <div className={`grid ${isMobile ? 'grid-cols-2 gap-3' : 'grid-cols-2 lg:grid-cols-4 gap-6'}`}>
                    <MetricCard title="NETWORK SCALE" value={overview.totalUsers} icon={Users} color="sky" />
                    <MetricCard title="ECOSYSTEM VALUE" value={formatCurrency(overview.platformGMV)} icon={Activity} color="emerald" />
                    
                    <div className="relative group cursor-pointer" onClick={() => navigate('/admin/approvals')}>
                        <MetricCard title="GOVERNANCE ACTIONS" value={overview.pendingApprovals} icon={CheckCircle} color="amber" />
                        {overview.pendingApprovals > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-bounce shadow-md">
                                Action Req
                            </span>
                        )}
                    </div>
                    
                    <div className="relative group cursor-pointer" onClick={() => navigate('/admin/batches')}>
                        <MetricCard 
                            title={overview.tamperedBatches > 0 ? "SECURITY BREACH!" : "CRYPTOGRAPHIC INTEGRITY"} 
                            value={overview.tamperedBatches > 0 ? overview.tamperedBatches : '100%'} 
                            icon={AlertTriangle} 
                            color={overview.tamperedBatches > 0 ? "rose" : "sage"} 
                        />
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Charts Column (Left, 2/3 width) */}
                    <div className="lg:col-span-2 space-y-6 animate-in" style={{ animationDelay: '0.2s' }}>
                        
                        {/* User Growth */}
                        <ChartCardComponent title="User Growth Trend" subtitle="New registrations over past 6 months" height={chartHeight}>
                            <LineChart data={analytics?.users?.userGrowth || []} margin={{ top: 10, right: isMobile ? 10 : 30, left: isMobile ? -20 : 0, bottom: 0 }}>
                                <XAxis dataKey="name" {...chartTheme.axis} tick={{ fontSize: isMobile ? 10 : 12 }} />
                                <YAxis {...chartTheme.axis} tick={{ fontSize: isMobile ? 10 : 12 }} />
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <Tooltip {...chartTheme.tooltip} />
                                <Line type="monotone" dataKey="value" stroke={chartTheme.colors.sky[0]} strokeWidth={3} dot={{ r: 4 }} name="Total Users" />
                            </LineChart>
                        </ChartCardComponent>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Role Distribution */}
                            <ChartCardComponent title="Platform Demographics" subtitle="Active users by role" height={250}>
                                <PieChart>
                                    <Pie
                                        data={userRoleData}
                                        innerRadius={isMobile ? 40 : 50}
                                        outerRadius={isMobile ? 60 : 70}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {userRoleData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                                        ))}
                                    </Pie>
                                    <Tooltip {...chartTheme.tooltip} />
                                </PieChart>
                                <div className="flex justify-center flex-wrap gap-2 mt-2">
                                    {userRoleData.map(d => (
                                        <div key={d.name} className="flex items-center gap-1 text-[10px] md:text-xs text-slate-500">
                                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }}></span>
                                            {d.name}: {d.value}
                                        </div>
                                    ))}
                                </div>
                            </ChartCardComponent>

                            {/* Shipment Pipeline */}
                            <ChartCardComponent title="Supply Chain Volume" subtitle="Weekly shipment counts" height={250}>
                                <BarChart data={analytics?.['supply-chain']?.shipmentVolume || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <XAxis dataKey="name" {...chartTheme.axis} tick={{ fontSize: isMobile ? 10 : 12 }} />
                                    <YAxis {...chartTheme.axis} tick={{ fontSize: isMobile ? 10 : 12 }} />
                                    <Tooltip {...chartTheme.tooltip} />
                                    <Bar dataKey="value" fill={chartTheme.colors.wheat[0]} radius={[4, 4, 0, 0]} name="Shipments" />
                                </BarChart>
                            </ChartCardComponent>
                        </div>
                    </div>

                    {/* Activity Feed Sidebar (Right, 1/3 width) */}
                    <div className="space-y-6 animate-in" style={{ animationDelay: '0.3s' }}>
                        <div className="bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col h-[600px]">
                            <div className="p-4 border-b border-slate-100 bg-slate-50 rounded-t-xl flex justify-between items-center">
                                <h3 className="font-semibold text-slate-800 font-display flex items-center gap-2">
                                    <Activity size={18} className="text-blue-600" />
                                    Live Platform Feed
                                </h3>
                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                                    Polling
                                </span>
                            </div>
                            
                            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                                {activityFeed.length === 0 ? (
                                    <div className="text-center text-slate-400 py-10 text-sm">
                                        Waiting for platform activity...
                                    </div>
                                ) : (
                                    activityFeed.map((event, i) => (
                                        <div key={i} className="flex gap-3 relative before:absolute before:left-[11px] before:top-8 before:bottom-[-16px] before:w-[2px] before:bg-slate-100 last:before:hidden">
                                            <div className={`mt-0.5 z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white bg-slate-50 ring-2 ring-slate-100`}>
                                                {getIconForEvent(event.icon)}
                                            </div>
                                            <div>
                                                <p className="text-sm text-slate-700 leading-snug">{event.message}</p>
                                                <p className="text-xs text-slate-400 mt-0.5">
                                                    {new Date(event.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                            
                            <div className="p-3 border-t border-slate-100 bg-slate-50 rounded-b-xl text-center">
                                <Button variant="ghost" size="sm" className="w-full text-slate-500 hover:text-blue-600" onClick={() => fetchActivityFeed()}>
                                    Refresh Feed
                                </Button>
                            </div>
                        </div>
                        
                        {/* Quick Action Links */}
                        <div className="grid grid-cols-2 gap-3">
                            <button onClick={() => navigate('/admin/users')} className="p-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                                <Users size={16} /> Manage Users
                            </button>
                            <button onClick={() => navigate('/admin/batches')} className="p-3 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                                <Database size={16} /> View Batches
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AdminDashboard;
