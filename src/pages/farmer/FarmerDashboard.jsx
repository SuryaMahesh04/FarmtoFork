import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sprout, TrendingUp, Package, Leaf, Plus, Truck, ShieldCheck } from 'lucide-react';
import {
    PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, ResponsiveContainer,
    AreaChart, Area, CartesianGrid, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
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
import { api, authHelpers } from '../../utils/api';
import Loader from '../../components/ui/Loader';

const FarmerDashboard = () => {
    const navigate = useNavigate();
    const isMobile = useMediaQuery('(max-width: 768px)');

    // State management
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [batches, setBatches] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [error, setError] = useState(null);

    // Fetch data on component mount
    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Get user data
            const userData = authHelpers.getUser();
            setUser(userData);

            // Fetch batches and analytics in parallel with minimum load time of 3.4s
            const minLoadTime = 1000;
            const [batchesRes, analyticsRes] = await Promise.all([
                api.farmer.getBatches({ limit: 5 }),
                api.farmer.getAnalytics(),
                new Promise(resolve => setTimeout(resolve, minLoadTime))
            ]);

            if (batchesRes.success) {
                setBatches(batchesRes.data);
            }

            if (analyticsRes.success) {
                setAnalytics(analyticsRes.data);
            }
        } catch (err) {
            console.error('Dashboard data fetch error:', err);
            setError(err.message || 'Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        { header: 'Batch ID', accessor: 'batchId', render: (row) => row.isTampered ? <span className="text-red-500 font-bold flex items-center gap-1" title="Data Tampered">⚠️ BTH-{row.batchId}</span> : `BTH-${row.batchId}` },
        { header: 'Crop', accessor: 'crop' },
        { header: 'Variety', accessor: 'variety' },
        { header: 'Quantity', accessor: 'quantity', render: (row) => row.isTampered ? <span className="text-red-500 font-bold">TAMPERED</span> : `${row.quantity} ${row.unit}` },
        { header: 'Date', accessor: 'harvestDate', render: (row) => new Date(row.harvestDate).toLocaleDateString() },
        { header: 'Status', accessor: 'status', render: (row) => row.isTampered ? <StatusBadge status="TAMPERED" type="error" /> : <StatusBadge status={row.status} /> },
    ];

    // Use mobile or desktop chart card
    const ChartCardComponent = isMobile ? MobileChartCard : ChartCard;
    const chartHeight = isMobile ? 220 : 300;
    const barChartHeight = isMobile ? 200 : 250;

    // Prepare chart data with colors
    const harvestVolumeData = analytics?.harvestVolume || [];
    const revenueTrendData = analytics?.revenueTrend || [];
    const qualityDistData = analytics?.qualityDistribution || [];
    const integrityData = analytics?.integrityStatus || [];

    const cropDistWithColors = analytics?.cropDistribution?.map((item, index) => ({
        ...item,
        color: chartTheme.colors.sage[index % chartTheme.colors.sage.length]
    })) || [];

    const integrityWithColors = integrityData.map((item) => ({
        ...item,
        color: item.name === 'Verified' ? chartTheme.colors.sage[0] : '#EF4444' // Emerald vs Red
    }));

    if (loading) {
        return (
            <DashboardLayout role="farmer">
                <Loader text="Loading dashboard..." />
            </DashboardLayout>
        );
    }

    if (error) {
        return (
            <DashboardLayout role="farmer">
                <div className="flex items-center justify-center h-96">
                    <div className="text-center">
                        <p className="text-red-600 mb-4">{error}</p>
                        <Button onClick={fetchDashboardData}>Retry</Button>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    const tamperedBatchesCount = batches.filter(b => b.isTampered).length;

    return (
        <DashboardLayout role="farmer">
            <div className="space-y-6">
                {/* Global Security Warning */}
                {tamperedBatchesCount > 0 && (
                    <div className="bg-red-50 border border-red-200 p-4 rounded-xl flex items-start gap-4 mb-6 shadow-sm animate-pulse">
                        <span className="text-3xl">🛡️</span>
                        <div>
                            <h3 className="text-lg font-bold text-red-800">Security Alert: Data Manipulation Detected</h3>
                            <p className="text-sm text-red-700 mt-1">
                                Our cryptographic engine detected that <strong>{tamperedBatchesCount} of your batches</strong> have been unlawfully altered outside the system. The original signatures no longer match. Please review your recent batches immediately.
                            </p>
                        </div>
                    </div>
                )}

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-in">
                    <div>
                        <h1 className="text-xl md:text-2xl font-display font-bold text-slate-800">
                            Welcome back, {user?.profile?.fullName || 'Farmer'}! 👨‍🌾
                        </h1>
                        <p className="text-sm md:text-base text-slate-500">Here's what's happening on your farm today.</p>
                    </div>
                    {!isMobile && (
                        <div className="flex gap-4">
                            <Button icon={Truck} variant="secondary" onClick={() => navigate('/farmer/create-shipment')}>Create Shipment</Button>
                            <Button icon={Plus} onClick={() => navigate('/farmer/create-batch')}>Create New Batch</Button>
                        </div>
                    )}
                </div>

                {/* Metrics Grid - Responsive */}
                <div className={`grid ${isMobile ? 'grid-cols-1 gap-3' : 'grid-cols-2 lg:grid-cols-4 gap-6'}`}>
                    {isMobile ? (
                        <>
                            <MobileMetricCard title="Total Batches" value={analytics?.metrics?.totalBatches || 0} icon={Package} trend={12} color="sage" delay={0.1} />
                            <MobileMetricCard title="Active Shipments" value={analytics?.metrics?.activeShipments || 0} icon={Truck} trend={0} color="wheat" delay={0.2} />
                            <MobileMetricCard title="Total Revenue" value={`₹${(analytics?.metrics?.totalRevenue / 100000).toFixed(2) || 0}L`} icon={TrendingUp} trend={24} color="sky" delay={0.3} />
                            <MobileMetricCard title="System Integrity" value={`${analytics?.metrics?.integrityScore || 0}%`} icon={ShieldCheck} trend={0} color="terra" delay={0.4} />
                        </>
                    ) : (
                        <>
                            <MetricCard title="Total Batches" value={analytics?.metrics?.totalBatches || 0} icon={Package} trend={12} color="sage" delay={0.1} />
                            <MetricCard title="Active Shipments" value={analytics?.metrics?.activeShipments || 0} icon={Truck} trend={0} color="wheat" delay={0.2} />
                            <MetricCard title="Total Revenue" value={`₹${analytics?.metrics?.totalRevenue?.toLocaleString() || 0}`} icon={TrendingUp} trend={24} color="sky" delay={0.3} />
                            <MetricCard title="System Integrity" value={analytics?.metrics?.integrityScore || 0} unit="%" icon={ShieldCheck} trend={0} color="terra" delay={0.4} />
                        </>
                    )}
                </div>

                {/* Charts Section - Mobile: Vertical Stack, Desktop: Grid */}
                <div className={isMobile ? 'space-y-4' : 'grid grid-cols-1 lg:grid-cols-3 gap-6'}>
                    {/* Main Charts Column */}
                    <div className={isMobile ? 'space-y-4' : 'lg:col-span-2 space-y-6 animate-in transition-all'} style={!isMobile ? { animationDelay: '0.2s' } : {}}>
                        {/* Monthly Harvest Volume */}
                        <ChartCard title="Monthly Harvest Volume" subtitle="Total yield per month (kg)" height={chartHeight}>
                            <AreaChart data={harvestVolumeData} margin={{ top: 10, right: isMobile ? 10 : 30, left: isMobile ? -20 : 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorHarvest" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={chartTheme.colors.sage[0]} stopOpacity={0.8} />
                                        <stop offset="95%" stopColor={chartTheme.colors.sage[0]} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" {...chartTheme.axis} tick={{ fontSize: isMobile ? 10 : 12 }} />
                                <YAxis {...chartTheme.axis} tick={{ fontSize: isMobile ? 10 : 12 }} />
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <Tooltip {...chartTheme.tooltip} />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke={chartTheme.colors.sage[0]}
                                    fillOpacity={1}
                                    fill="url(#colorHarvest)"
                                    name="Harvest Volume (kg)"
                                />
                            </AreaChart>
                        </ChartCard>

                        {/* Revenue Trends */}
                        <ChartCard title="Revenue Trends" subtitle="Monthly earnings analysis" height={barChartHeight}>
                            <BarChart data={revenueTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <XAxis dataKey="name" {...chartTheme.axis} tick={{ fontSize: isMobile ? 10 : 12 }} />
                                <YAxis {...chartTheme.axis} tick={{ fontSize: isMobile ? 10 : 12 }} />
                                <Tooltip {...chartTheme.tooltip} />
                                <Bar dataKey="revenue" fill={chartTheme.colors.wheat[0]} radius={[4, 4, 0, 0]} animationDuration={1500} />
                            </BarChart>
                        </ChartCard>
                    </div>

                    {/* Side Charts Column */}
                    <div className={isMobile ? 'space-y-4' : 'space-y-6 animate-in transition-all'} style={!isMobile ? { animationDelay: '0.3s' } : {}}>
                        {/* Crop Distribution */}
                        <ChartCard 
                            title="Crop Mix" 
                            subtitle="Based on batch quantities" 
                            height={isMobile ? 240 : 280}
                            footer={
                                cropDistWithColors.length > 0 && (
                                    <div className="flex justify-center flex-wrap gap-x-4 gap-y-2">
                                        {cropDistWithColors.map(d => (
                                            <div key={d.name} className="flex items-center gap-2 text-xs text-slate-500 whitespace-nowrap">
                                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }}></span>
                                                {d.name}
                                            </div>
                                        ))}
                                    </div>
                                )
                            }
                        >
                            {cropDistWithColors.length > 0 ? (
                                <PieChart>
                                    <Pie
                                        data={cropDistWithColors}
                                        innerRadius={isMobile ? 50 : 60}
                                        outerRadius={isMobile ? 70 : 80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {cropDistWithColors.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                                        ))}
                                    </Pie>
                                    <Tooltip {...chartTheme.tooltip} />
                                </PieChart>
                            ) : (
                                <div className="flex items-center justify-center h-full text-slate-400 font-medium bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                                    No harvest data yet
                                </div>
                            )}
                        </ChartCard>

                        {/* Batch Integrity Status */}
                        <ChartCard 
                            title="Traceability Integrity" 
                            subtitle="Verification status of active stock" 
                            height={isMobile ? 200 : 250}
                            footer={
                                <div className="flex justify-center gap-6">
                                    {integrityWithColors.map(d => (
                                        <div key={d.name} className="flex items-center gap-2 text-xs font-medium text-slate-600">
                                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }}></span>
                                            {d.name}: {d.value}
                                        </div>
                                    ))}
                                </div>
                            }
                        >
                            <PieChart>
                                <Pie
                                    data={integrityWithColors}
                                    innerRadius={isMobile ? 40 : 50}
                                    outerRadius={isMobile ? 60 : 70}
                                    startAngle={90}
                                    endAngle={-270}
                                    dataKey="value"
                                >
                                    {integrityWithColors.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                                    ))}
                                </Pie>
                                <Tooltip {...chartTheme.tooltip} />
                            </PieChart>
                        </ChartCard>

                        {/* Quality Distribution */}
                        <ChartCard title="Quality Analysis" subtitle="Quality score distribution" height={isMobile ? 240 : 280}>
                            <RadarChart cx="50%" cy="50%" outerRadius={isMobile ? "60%" : "70%"} data={qualityDistData}>
                                <PolarGrid stroke="#E2E8F0" />
                                <PolarAngleAxis dataKey="name" tick={{ fill: '#64748B', fontSize: isMobile ? 10 : 11 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={false} />
                                <Radar
                                    name="Batches"
                                    dataKey="value"
                                    stroke={chartTheme.colors.sage[0]}
                                    fill={chartTheme.colors.sage[0]}
                                    fillOpacity={0.5}
                                />
                                <Tooltip />
                            </RadarChart>
                        </ChartCard>
                    </div>
                </div>

                {/* Recent Batches Table */}
                <div className="animate-in transition-all" style={{ animationDelay: '0.4s' }}>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-base md:text-lg font-display font-semibold text-slate-700">Recent Batches</h2>
                        {!isMobile && (
                            <Button variant="ghost" size="sm" onClick={() => navigate('/farmer/batches')}>View All</Button>
                        )}
                    </div>
                    <div className={isMobile ? 'overflow-x-auto' : ''}>
                        {batches.length > 0 ? (
                            <DataTable
                                columns={columns}
                                data={batches}
                                onRowClick={(row) => navigate(`/farmer/batches/${row._id}`)}
                            />
                        ) : (
                            <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
                                <Package size={48} className="mx-auto mb-4 text-slate-300" />
                                <p className="text-slate-500 mb-4">No batches yet</p>
                                <Button onClick={() => navigate('/farmer/create-batch')}>Create Your First Batch</Button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile FAB */}
                {isMobile && (
                    <button
                        onClick={() => navigate('/farmer/create-batch')}
                        className="fixed bottom-20 right-4 z-40 w-14 h-14 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-2xl shadow-emerald-500/50 flex items-center justify-center hover:scale-110 transition-transform active:scale-95"
                    >
                        <Plus size={24} strokeWidth={2.5} />
                    </button>
                )}
            </div>
        </DashboardLayout>
    );
};

export default FarmerDashboard;
