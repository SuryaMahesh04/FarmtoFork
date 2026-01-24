import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Warehouse, TrendingUp, ClipboardCheck, Truck, Plus } from 'lucide-react';
import {
    PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, ResponsiveContainer,
    AreaChart, Area, CartesianGrid, LineChart, Line
} from 'recharts';
import { api, authHelpers } from '../../utils/api';
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
import Loader from '../../components/ui/Loader';

// Dummy data replaced by real API data

const DistributorDashboard = () => {
    const navigate = useNavigate();
    const isMobile = useMediaQuery('(max-width: 768px)');

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState(null);
    const [inventory, setInventory] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const currentUser = authHelpers.getUser();
                setUser(currentUser);

                const minLoadTime = 3400;
                const [statsRes, inventoryRes, analyticsRes, userRes] = await Promise.all([
                    api.distributor.getStats(),
                    api.distributor.getInventory(),
                    api.distributor.getAnalytics(),
                    api.auth.getMe(),
                    new Promise(resolve => setTimeout(resolve, minLoadTime))
                ]);

                if (statsRes.success) setStats(statsRes.data);
                if (inventoryRes.success) setInventory(inventoryRes.data);
                if (analyticsRes.success) setAnalytics(analyticsRes.data);
                if (userRes.success) {
                    setUser(userRes.data);
                    // Update local storage to keep it fresh
                    authHelpers.saveUser(userRes.data);
                }

            } catch (err) {
                console.error("Dashboard fetch error:", err);
                setError("Failed to load dashboard data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const columns = [
        { header: 'Item Code', accessor: 'id' },
        { header: 'Product', accessor: 'item' },
        { header: 'Stock Level', accessor: 'stock' },
        { header: 'Warehouse Loc', accessor: 'warehouse' },
        { header: 'Expiry', accessor: 'expiry' },
        { header: 'Status', accessor: 'status', render: (row) => <StatusBadge status={row.status} /> },
    ];

    const ChartCardComponent = isMobile ? MobileChartCard : ChartCard;
    const chartHeight = isMobile ? 220 : 300;
    const barChartHeight = isMobile ? 200 : 250;

    if (loading) {
        return (
            <DashboardLayout role="distributor">
                <Loader text="Loading dashboard..." />
            </DashboardLayout>
        );
    }

    // Fallback data if API returns empty/null to avoid crashes during initial dev
    const inventoryTrendData = analytics?.inventoryTrend || [];
    const productCategoryData = analytics?.productDistribution || [];
    const qualityMetricsData = analytics?.qualityMetrics || [];

    return (
        <DashboardLayout role="distributor">
            <div className="space-y-6">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-in">
                    <div>
                        <h1 className="text-xl md:text-2xl font-display font-bold text-slate-800">
                            Warehouse Operations 📦
                        </h1>
                        <p className="text-sm md:text-base text-slate-500">
                            Welcome back, {user?.profile?.fullName || 'Distributor'}
                        </p>
                    </div>
                    {!isMobile && (
                        <Button icon={Plus} onClick={() => navigate('/distributor/inventory')}>Add Item</Button>
                    )}
                </div>

                {/* Metrics Grid - Responsive */}
                <div className={`grid ${isMobile ? 'grid-cols-1 gap-3' : 'grid-cols-2 lg:grid-cols-4 gap-6'}`}>
                    {isMobile ? (
                        <>
                            <MobileMetricCard title="Total Inventory" value={`${stats?.totalInventory || 0}kg`} icon={Warehouse} trend={10} color="wheat" delay={0.1} />
                            <MobileMetricCard title="Incoming Batches" value={stats?.incomingBatches || 0} icon={Truck} trend={0} color="sage" delay={0.2} />
                            <MobileMetricCard title="Quality Passed" value={`${stats?.qualityScore || 0}%`} icon={ClipboardCheck} trend={2} color="sky" delay={0.3} />
                            <MobileMetricCard title="Storage Used" value={`${stats?.storageUsed || 0}%`} icon={Package} trend={-5} color="terra" delay={0.4} />
                        </>
                    ) : (
                        <>
                            <MetricCard title="Total Inventory" value={stats?.totalInventory || 0} unit=" kg" icon={Warehouse} trend={10} color="wheat" delay={0.1} />
                            <MetricCard title="Incoming Batches" value={stats?.incomingBatches || 0} icon={Truck} trend={0} color="sage" delay={0.2} />
                            <MetricCard title="Quality Passed" value={stats?.qualityScore || 0} unit="%" icon={ClipboardCheck} trend={2} color="sky" delay={0.3} />
                            <MetricCard title="Storage Used" value={stats?.storageUsed || 0} unit="%" icon={Package} trend={-5} color="terra" delay={0.4} />
                        </>
                    )}
                </div>

                {/* Charts Section */}
                <div className={isMobile ? 'space-y-4' : 'grid grid-cols-1 lg:grid-cols-3 gap-6'}>
                    {/* Main Charts Column */}
                    <div className={isMobile ? 'space-y-4' : 'lg:col-span-2 space-y-6 animate-in transition-all'} style={!isMobile ? { animationDelay: '0.2s' } : {}}>
                        {/* Inventory Trends */}
                        <ChartCardComponent title="Inventory Trends" subtitle="Stock levels vs Capacity" height={chartHeight}>
                            <AreaChart data={inventoryTrendData} margin={{ top: 10, right: isMobile ? 10 : 30, left: isMobile ? -20 : 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorStock" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={chartTheme.colors.wheat[0]} stopOpacity={0.8} />
                                        <stop offset="95%" stopColor={chartTheme.colors.wheat[0]} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="month" {...chartTheme.axis} tick={{ fontSize: isMobile ? 10 : 12 }} />
                                <YAxis {...chartTheme.axis} tick={{ fontSize: isMobile ? 10 : 12 }} />
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <Tooltip {...chartTheme.tooltip} />
                                <Area
                                    type="monotone"
                                    dataKey="stock"
                                    stroke={chartTheme.colors.wheat[0]}
                                    fillOpacity={1}
                                    fill="url(#colorStock)"
                                    name="Stock Level (kg)"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="capacity"
                                    stroke={chartTheme.colors.sage[0]}
                                    fillOpacity={0.1}
                                    fill="transparent"
                                    strokeDasharray="5 5"
                                    name="Max Capacity (kg)"
                                />
                            </AreaChart>
                        </ChartCardComponent>

                        {/* Quality Metrics */}
                        <ChartCardComponent title="Quality Control Metrics" subtitle="Pass vs Fail by category" height={barChartHeight}>
                            <BarChart data={qualityMetricsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <XAxis dataKey="category" {...chartTheme.axis} tick={{ fontSize: isMobile ? 10 : 12 }} />
                                <YAxis {...chartTheme.axis} tick={{ fontSize: isMobile ? 10 : 12 }} />
                                <Tooltip {...chartTheme.tooltip} />
                                <Bar dataKey="passed" fill={chartTheme.colors.sage[0]} radius={[4, 4, 0, 0]} name="Passed" />
                                <Bar dataKey="failed" fill={chartTheme.colors.terra[0]} radius={[4, 4, 0, 0]} name="Failed" />
                            </BarChart>
                        </ChartCardComponent>
                    </div>

                    {/* Side Charts Column */}
                    <div className={isMobile ? 'space-y-4' : 'space-y-6 animate-in transition-all'} style={!isMobile ? { animationDelay: '0.3s' } : {}}>
                        {/* Product Categories */}
                        <ChartCardComponent title="Product Categories" subtitle="Inventory distribution" height={isMobile ? 250 : 300}>
                            <PieChart>
                                <Pie
                                    data={productCategoryData}
                                    innerRadius={isMobile ? 50 : 60}
                                    outerRadius={isMobile ? 70 : 80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {productCategoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                                    ))}
                                </Pie>
                                <Tooltip {...chartTheme.tooltip} />
                            </PieChart>
                            <div className="flex justify-center flex-wrap gap-3 md:gap-4 mt-2">
                                {productCategoryData.map(d => (
                                    <div key={d.name} className="flex items-center gap-2 text-xs text-slate-500">
                                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }}></span>
                                        {d.name}
                                    </div>
                                ))}
                            </div>
                        </ChartCardComponent>

                        {/* Warehouse Zones - Keeping static for now as we don't have zone data in backend yet */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                            <h3 className="font-semibold text-slate-800 mb-4">Warehouse Zones</h3>
                            <div className="space-y-4">
                                <UtilizationBar label="Zone A (Cold)" percent={92} color="bg-sky-400" />
                                <UtilizationBar label="Zone B (Dry)" percent={65} color="bg-wheat-400" />
                                <UtilizationBar label="Silos (Grains)" percent={45} color="bg-sage-400" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Current Inventory Table */}
                <div className="animate-in transition-all" style={{ animationDelay: '0.4s' }}>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-base md:text-lg font-display font-semibold text-slate-700">Current Inventory</h2>
                        {!isMobile && (
                            <Button variant="ghost" size="sm" onClick={() => navigate('/distributor/inventory')}>View All</Button>
                        )}
                    </div>
                    <div className={isMobile ? 'overflow-x-auto' : ''}>
                        {inventory.length > 0 ? (
                            <DataTable
                                columns={columns}
                                data={inventory}
                                onRowClick={(row) => navigate(`/distributor/inventory`)}
                            />
                        ) : (
                            <div className="text-center py-10 bg-white rounded-xl border border-dashed border-slate-300">
                                <Package className="mx-auto text-slate-300 mb-2" size={48} />
                                <p className="text-slate-500">No inventory available</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile FAB */}
                {isMobile && (
                    <button
                        onClick={() => navigate('/distributor/inventory')}
                        className="fixed bottom-20 right-4 z-40 w-14 h-14 rounded-full bg-gradient-to-r from-amber-600 to-amber-500 text-white shadow-2xl shadow-amber-500/50 flex items-center justify-center hover:scale-110 transition-transform active:scale-95"
                    >
                        <Plus size={24} strokeWidth={2.5} />
                    </button>
                )}
            </div>
        </DashboardLayout>
    );
};

const UtilizationBar = ({ label, percent, color }) => (
    <div>
        <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-600 font-medium">{label}</span>
            <span className="text-slate-500">{percent}%</span>
        </div>
        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all duration-1000 ${color}`} style={{ width: `${percent}%` }}></div>
        </div>
    </div>
);

export default DistributorDashboard;
