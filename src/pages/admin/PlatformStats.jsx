import React, { useEffect, useState } from 'react';
import { Activity, TrendingUp, Users, Database, ShieldAlert, Package, Store, Truck, QrCode } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import DashboardLayout from '../../components/layout/DashboardLayout';
import ChartCard from '../../components/ui/ChartCard';
import { chartTheme } from '../../utils/chartConfig';
import useMediaQuery from '../../utils/useMediaQuery';
import useAdminStore from '../../utils/adminStore';

const Analytics = () => {
    const isMobile = useMediaQuery('(max-width: 768px)');
    const [activeTab, setActiveTab] = useState('platform');
    
    const { analytics, fetchAnalytics, overview, fetchOverview } = useAdminStore();

    useEffect(() => {
        fetchOverview();
        fetchAnalytics('users');
        fetchAnalytics('supply-chain');
        fetchAnalytics('engagement');
        fetchAnalytics('commerce');
        fetchAnalytics('fleet');
    }, []);

    // Format currency
    const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val || 0);

    // Render Platform/Commerce Tab
    const renderPlatformTab = () => (
        <div className="space-y-6 animate-in fade-in">
             <div className={`grid ${isMobile ? 'grid-cols-2 gap-3' : 'grid-cols-4 gap-6'}`}>
                <div className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-2 text-slate-600 mb-2">
                        <Activity size={18} />
                        <span className="text-xs font-medium">Platform GMV</span>
                    </div>
                    <p className="text-2xl font-bold text-slate-800">{formatCurrency(overview?.platformGMV)}</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-2 text-slate-600 mb-2">
                        <Users size={18} />
                        <span className="text-xs font-medium">Active Users</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">{overview?.totalUsers || 0}</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-2 text-slate-600 mb-2">
                        <Database size={18} />
                        <span className="text-xs font-medium">Total Batches</span>
                    </div>
                    <p className="text-2xl font-bold text-sage-600">{overview?.totalBatches || 0}</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-2 text-slate-600 mb-2">
                        <ShieldAlert size={18} />
                        <span className="text-xs font-medium">Tamper Events</span>
                    </div>
                    <p className="text-2xl font-bold text-red-600">{overview?.tamperedBatches || 0}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard title="Platform Revenue Trend" subtitle="GMV over time" height={isMobile ? 220 : 300}>
                    <LineChart data={analytics?.commerce?.revenueTrend || []} margin={{ top: 10, right: 10, left: 20, bottom: 0 }}>
                        <XAxis dataKey="name" {...chartTheme.axis} />
                        <YAxis {...chartTheme.axis} tickFormatter={(val) => `₹${val/1000}k`} />
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                        <Tooltip {...chartTheme.tooltip} formatter={(val) => formatCurrency(val)} />
                        <Line type="monotone" dataKey="value" stroke={chartTheme.colors.sage[0]} strokeWidth={3} dot={{ r: 5 }} />
                    </LineChart>
                </ChartCard>

                 <ChartCard title="Top Crops by Value" subtitle="Platform-wide breakdown" height={isMobile ? 220 : 300}>
                    <BarChart data={analytics?.commerce?.topCrops || []} margin={{ top: 10, right: 10, left: 20, bottom: 0 }}>
                        <XAxis dataKey="name" {...chartTheme.axis} />
                        <YAxis {...chartTheme.axis} tickFormatter={(val) => `₹${val/1000}k`} />
                        <Tooltip {...chartTheme.tooltip} formatter={(val) => formatCurrency(val)}/>
                        <Bar dataKey="value" fill={chartTheme.colors.sage[0]} radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ChartCard>
            </div>
        </div>
    );

    // Render Supply Chain Tab
    const renderSupplyTab = () => (
        <div className="space-y-6 animate-in fade-in">
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard title="Shipment Volume" subtitle="Weekly transit activity" height={300}>
                     <BarChart data={analytics?.['supply-chain']?.shipmentVolume || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <XAxis dataKey="name" {...chartTheme.axis} />
                        <YAxis {...chartTheme.axis} />
                        <Tooltip {...chartTheme.tooltip} />
                        <Bar dataKey="value" fill={chartTheme.colors.wheat[0]} radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ChartCard>

                <ChartCard title="Batch Status Distribution" subtitle="All crops lifecycle" height={300}>
                    <PieChart>
                         <Pie
                            data={analytics?.['supply-chain']?.batchStatus?.map(s => ({
                                name: s._id,
                                value: s.count,
                                color: s._id === 'completed' ? chartTheme.colors.sage[0] : 
                                       s._id === 'in-transit' ? chartTheme.colors.wheat[0] : 
                                       chartTheme.colors.sky[0]
                            })) || []}
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {(analytics?.['supply-chain']?.batchStatus || []).map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry._id === 'completed' ? chartTheme.colors.sage[0] : entry._id === 'in-transit' ? chartTheme.colors.wheat[0] : chartTheme.colors.sky[0]} />
                            ))}
                        </Pie>
                        <Tooltip {...chartTheme.tooltip} />
                    </PieChart>
                </ChartCard>
             </div>
        </div>
    );

    // Render Engagement Tab
    const renderEngagementTab = () => (
        <div className="space-y-6 animate-in fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <ChartCard title="Consumer QR Scans" subtitle="Verification engagement" height={300}>
                     <LineChart data={analytics?.engagement?.scanTrend || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <XAxis dataKey="name" {...chartTheme.axis} />
                        <YAxis {...chartTheme.axis} />
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                        <Tooltip {...chartTheme.tooltip} />
                        <Line type="monotone" dataKey="value" stroke={chartTheme.colors.sky[0]} strokeWidth={3} />
                    </LineChart>
                </ChartCard>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-center items-center text-center">
                    <ShieldAlert size={48} className="text-red-500 mb-4" />
                    <h3 className="text-xl font-bold text-slate-800">Tamper Events Detected</h3>
                    <p className="text-4xl font-black text-red-600 my-4">{analytics?.engagement?.tamperEvents || 0}</p>
                    <p className="text-sm text-slate-500">Total consumer scans that failed cryptographic verification.</p>
                </div>
            </div>
        </div>
    );

    return (
        <DashboardLayout role="admin">
            <div className="space-y-6">
                <div className="animate-in">
                    <h1 className="text-xl md:text-2xl font-display font-bold text-slate-800">Platform Analytics</h1>
                    <p className="text-sm md:text-base text-slate-500">Cross-platform data insights and reporting</p>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 border-b border-slate-200 overflow-x-auto pb-1 custom-scrollbar">
                    {[
                        { id: 'platform', label: 'Platform & Commerce', icon: Activity },
                        { id: 'supply', label: 'Supply Chain', icon: Truck },
                        { id: 'engagement', label: 'Consumer Engagement', icon: QrCode }
                    ].map(tab => (
                        <button 
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 pb-3 px-2 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${activeTab === tab.id ? 'border-sage-600 text-sage-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                        >
                            <tab.icon size={16} /> {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="pt-2">
                    {activeTab === 'platform' && renderPlatformTab()}
                    {activeTab === 'supply' && renderSupplyTab()}
                    {activeTab === 'engagement' && renderEngagementTab()}
                </div>

            </div>
        </DashboardLayout>
    );
};

export default Analytics;
