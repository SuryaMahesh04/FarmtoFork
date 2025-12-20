import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sprout, TrendingUp, Package, Leaf, Plus } from 'lucide-react';
import {
    PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis,
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

            // Fetch batches and analytics in parallel
            const [batchesRes, analyticsRes] = await Promise.all([
                api.farmer.getBatches({ limit: 5 }),
                api.farmer.getAnalytics()
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
        { header: 'Batch ID', accessor: 'batchId', render: (row) => `BTH-${row.batchId}` },
        { header: 'Crop', accessor: 'crop' },
        { header: 'Variety', accessor: 'variety' },
        { header: 'Quantity', accessor: (row) => `${row.quantity} ${row.unit}` },
        { header: 'Date', accessor: (row) => new Date(row.harvestDate).toLocaleDateString() },
        { header: 'Status', accessor: 'status', render: (row) => <StatusBadge status={row.status} /> },
    ];

    // Use mobile or desktop chart card
    const ChartCardComponent = isMobile ? MobileChartCard : ChartCard;
    const chartHeight = isMobile ? 220 : 300;
    const barChartHeight = isMobile ? 200 : 250;

    // Prepare chart data with colors
    const cropDistWithColors = analytics?.cropDistribution?.map((item, index) => ({
        ...item,
        color: ['#10b981', '#f59e0b', '#3b82f6', '#8b5cf6', '#ec4899'][index % 5]
    })) || [];

    // Soil health dummy data (can be replaced with real data later)
    const soilHealthData = [
        { subject: 'N', A: 120, fullMark: 150 },
        { subject: 'P', A: 98, fullMark: 150 },
        { subject: 'K', A: 86, fullMark: 150 },
        { subject: 'pH', A: 110, fullMark: 150 },
        { subject: 'Moisture', A: 99, fullMark: 150 },
    ];

    if (loading) {
        return (
            <DashboardLayout role="farmer">
                <div className="flex items-center justify-center h-96">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                        <p className="text-slate-600">Loading dashboard...</p>
                    </div>
                </div>
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

    return (
        <DashboardLayout role="farmer">
            <div className="space-y-6">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-in">
                    <div>
                        <h1 className="text-xl md:text-2xl font-display font-bold text-slate-800">
                            Welcome back, {user?.profile?.fullName || 'Farmer'}! 👨‍🌾
                        </h1>
                        <p className="text-sm md:text-base text-slate-500">Here's what's happening on your farm today.</p>
                    </div>
                    {!isMobile && (
                        <Button icon={Plus} onClick={() => navigate('/farmer/create-batch')}>Create New Batch</Button>
                    )}
                </div>

                {/* Metrics Grid - Responsive */}
                <div className={`grid ${isMobile ? 'grid-cols-1 gap-3' : 'grid-cols-2 lg:grid-cols-4 gap-6'}`}>
                    {isMobile ? (
                        <>
                            <MobileMetricCard title="Total Batches" value={analytics?.metrics?.totalBatches || 0} icon={Package} trend={12} color="sage" delay={0.1} />
                            <MobileMetricCard title="Active Batches" value={analytics?.metrics?.activeBatches || 0} icon={Sprout} trend={0} color="wheat" delay={0.2} />
                            <MobileMetricCard title="Total Revenue" value={`₹${(analytics?.metrics?.totalRevenue / 100000).toFixed(2) || 0}L`} icon={TrendingUp} trend={24} color="sky" delay={0.3} />
                            <MobileMetricCard title="Quality Score" value={analytics?.metrics?.qualityScore || 0} icon={Leaf} trend={1.5} color="terra" delay={0.4} />
                        </>
                    ) : (
                        <>
                            <MetricCard title="Total Batches" value={analytics?.metrics?.totalBatches || 0} icon={Package} trend={12} color="sage" delay={0.1} />
                            <MetricCard title="Active Batches" value={analytics?.metrics?.activeBatches || 0} icon={Sprout} trend={0} color="wheat" delay={0.2} />
                            <MetricCard title="Total Revenue" value={analytics?.metrics?.totalRevenue || 0} icon={TrendingUp} trend={24} color="sky" delay={0.3} />
                            <MetricCard title="Quality Score" value={analytics?.metrics?.qualityScore || 0} icon={Leaf} trend={1.5} color="terra" delay={0.4} />
                        </>
                    )}
                </div>

                {/* Charts Section - Mobile: Vertical Stack, Desktop: Grid */}
                <div className={isMobile ? 'space-y-4' : 'grid grid-cols-1 lg:grid-cols-3 gap-6'}>
                    {/* Main Charts Column */}
                    <div className={isMobile ? 'space-y-4' : 'lg:col-span-2 space-y-6 animate-in transition-all'} style={!isMobile ? { animationDelay: '0.2s' } : {}}>
                        {/* Market Price Trends */}
                        <ChartCardComponent title="Market Price Analysis" subtitle="My Sales vs Mandi Prices (₹/quintal)" height={chartHeight}>
                            <AreaChart data={analytics?.marketPrices || []} margin={{ top: 10, right: isMobile ? 10 : 30, left: isMobile ? -20 : 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorMyPrice" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={chartTheme.colors.sage[0]} stopOpacity={0.8} />
                                        <stop offset="95%" stopColor={chartTheme.colors.sage[0]} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="month" {...chartTheme.axis} tick={{ fontSize: isMobile ? 10 : 12 }} />
                                <YAxis {...chartTheme.axis} tick={{ fontSize: isMobile ? 10 : 12 }} />
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <Tooltip {...chartTheme.tooltip} />
                                <Area
                                    type="monotone"
                                    dataKey="myPrice"
                                    stroke={chartTheme.colors.sage[0]}
                                    fillOpacity={1}
                                    fill="url(#colorMyPrice)"
                                    name="My Farm Price"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="marketPrice"
                                    stroke={chartTheme.colors.terra[0]}
                                    fillOpacity={0.1}
                                    fill="transparent"
                                    strokeDasharray="5 5"
                                    name="Avg. Market Price"
                                />
                            </AreaChart>
                        </ChartCardComponent>

                        {/* Seasonal Revenue */}
                        <ChartCardComponent title="Seasonal Revenue" subtitle="Income vs Batches over last 6 months" height={barChartHeight}>
                            <BarChart data={analytics?.seasonalTrends || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <XAxis dataKey="name" {...chartTheme.axis} tick={{ fontSize: isMobile ? 10 : 12 }} />
                                <YAxis {...chartTheme.axis} tick={{ fontSize: isMobile ? 10 : 12 }} />
                                <Tooltip {...chartTheme.tooltip} />
                                <Bar dataKey="revenue" fill={chartTheme.colors.sage[0]} radius={[4, 4, 0, 0]} animationDuration={1500} />
                            </BarChart>
                        </ChartCardComponent>
                    </div>

                    {/* Side Charts Column */}
                    <div className={isMobile ? 'space-y-4' : 'space-y-6 animate-in transition-all'} style={!isMobile ? { animationDelay: '0.3s' } : {}}>
                        {/* Crop Distribution */}
                        <ChartCardComponent title="Crop Distribution" subtitle="Based on batch quantities" height={isMobile ? 250 : 300}>
                            {cropDistWithColors.length > 0 ? (
                                <>
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
                                    <div className="flex justify-center flex-wrap gap-3 md:gap-4 mt-2">
                                        {cropDistWithColors.map(d => (
                                            <div key={d.name} className="flex items-center gap-2 text-xs text-slate-500">
                                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }}></span>
                                                {d.name}
                                            </div>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <div className="flex items-center justify-center h-full text-slate-400">
                                    No crop data available
                                </div>
                            )}
                        </ChartCardComponent>

                        {/* Soil Health - New Addition */}
                        <ChartCardComponent title="Soil Health" subtitle="Nutrient Analysis" height={isMobile ? 250 : 300}>
                            <RadarChart cx="50%" cy="50%" outerRadius={isMobile ? "60%" : "70%"} data={soilHealthData}>
                                <PolarGrid stroke="#E2E8F0" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748B', fontSize: isMobile ? 9 : 10 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} />
                                <Radar
                                    name="Level"
                                    dataKey="A"
                                    stroke={chartTheme.colors.sage[0]}
                                    fill={chartTheme.colors.sage[0]}
                                    fillOpacity={0.5}
                                />
                                <Tooltip />
                            </RadarChart>
                        </ChartCardComponent>
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
                                onRowClick={(row) => navigate(`/farmer/batch/${row._id}`)}
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
