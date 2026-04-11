import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, ShoppingCart, AlertCircle, ScanLine, Plus, TrendingUp, PackageCheck } from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
    BarChart, Bar, PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import DashboardLayout from '../../components/layout/DashboardLayout';
import MetricCard from '../../components/ui/MetricCard';
import MobileMetricCard from '../../components/ui/MobileMetricCard';
import ChartCard from '../../components/ui/ChartCard';
import MobileChartCard from '../../components/ui/MobileChartCard';
import Button from '../../components/ui/Button';
import { chartTheme } from '../../utils/chartConfig';
import useMediaQuery from '../../utils/useMediaQuery';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const RetailerDashboard = () => {
    const navigate = useNavigate();
    const isMobile = useMediaQuery('(max-width: 768px)');
    
    // State for dashboard specs
    const [stats, setStats] = useState({
        totalProducts: 0,
        salesToday: 0,
        lowStockAlerts: 0,
        consumerScans: 0,
        weeklyData: [],
        stockLevels: [],
        topProducts: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.retailer.getStats();
                if (res.success) {
                    setStats(res.data);
                }
            } catch (error) {
                toast.error('Failed to load dashboard statistics');
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const ChartCardComponent = isMobile ? MobileChartCard : ChartCard;
    const chartHeight = isMobile ? 220 : 300;
    const barChartHeight = isMobile ? 200 : 250;

    return (
        <DashboardLayout role="retailer">
            <div className="space-y-6">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-in">
                    <div>
                        <h1 className="text-xl md:text-2xl font-display font-bold text-slate-800">Store Overview 🏪</h1>
                        <p className="text-sm md:text-base text-slate-500">Manage your retail operations and track sales</p>
                    </div>
                    {!isMobile && (
                        <Button icon={Plus} onClick={() => navigate('/retailer/products')}>Manage Products</Button>
                    )}
                </div>

                {/* Metrics Grid - Responsive */}
                <div className={`grid ${isMobile ? 'grid-cols-1 gap-3' : 'grid-cols-2 lg:grid-cols-4 gap-6'}`}>
                    {isMobile ? (
                        <>
                            <MobileMetricCard title="Inventory" value={stats.totalProducts} icon={Store} trend={0} color="wheat" delay={0.1} />
                            <MobileMetricCard title="Units Sold" value={stats.unitsSold || 0} icon={PackageCheck} trend={0} color="sage" delay={0.2} />
                            <MobileMetricCard title="Revenue" value={`₹${(stats.totalRevenue / 1000).toFixed(1)}k`} icon={TrendingUp} trend={0} color="terra" delay={0.3} />
                            <MobileMetricCard title="Consumer Scans" value={stats.consumerScans} icon={ScanLine} trend={0} color="sky" delay={0.4} />
                        </>
                    ) : (
                        <>
                            <MetricCard title="Inventory" value={stats.totalProducts} icon={Store} trend={0} color="wheat" delay={0.1} />
                            <MetricCard title="Units Sold" value={stats.unitsSold || 0} icon={PackageCheck} trend={0} color="sage" delay={0.2} />
                            <MetricCard title="Revenue" value={`₹${stats.totalRevenue?.toLocaleString() || 0}`} icon={TrendingUp} trend={0} color="terra" delay={0.3} />
                            <MetricCard title="Consumer Scans" value={stats.consumerScans} icon={ScanLine} trend={0} color="sky" delay={0.4} />
                        </>
                    )}
                </div>

                {/* Charts Section */}
                <div className={isMobile ? 'space-y-4' : 'grid grid-cols-1 lg:grid-cols-3 gap-6'}>
                    {/* Main Charts Column */}
                    <div className={isMobile ? 'space-y-4' : 'lg:col-span-2 space-y-6 animate-in'} style={!isMobile ? { animationDelay: '0.2s' } : {}}>
                        {/* Sales Trends */}
                        <ChartCardComponent title="Weekly Sales Trend" subtitle="Sales volume over last week" height={chartHeight}>
                            <AreaChart data={stats.weeklyData} margin={{ top: 10, right: isMobile ? 10 : 30, left: isMobile ? -20 : 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={chartTheme.colors.sage[0]} stopOpacity={0.8} />
                                        <stop offset="95%" stopColor={chartTheme.colors.sage[0]} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="day" {...chartTheme.axis} tick={{ fontSize: isMobile ? 10 : 12 }} />
                                <YAxis {...chartTheme.axis} tick={{ fontSize: isMobile ? 10 : 12 }} />
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <Tooltip {...chartTheme.tooltip} />
                                <Area
                                    type="monotone"
                                    dataKey="sales"
                                    stroke={chartTheme.colors.sage[0]}
                                    fillOpacity={1}
                                    fill="url(#colorSales)"
                                    name="Sales Count"
                                />
                            </AreaChart>
                        </ChartCardComponent>

                        {/* Top Products */}
                        <ChartCardComponent title="Top Selling Products" subtitle="Best performers" height={barChartHeight}>
                            {stats.topProducts && stats.topProducts.length > 0 ? (
                                <BarChart data={stats.topProducts} layout="vertical" margin={{ top: 10, right: 10, left: isMobile ? -20 : 0, bottom: 0 }}>
                                    <XAxis type="number" {...chartTheme.axis} tick={{ fontSize: isMobile ? 10 : 12 }} />
                                    <YAxis type="category" dataKey="product" {...chartTheme.axis} tick={{ fontSize: isMobile ? 10 : 12 }} width={isMobile ? 80 : 100} />
                                    <Tooltip {...chartTheme.tooltip} />
                                    <Bar dataKey="sales" fill={chartTheme.colors.wheat[0]} radius={[0, 4, 4, 0]} name="Units Sold" />
                                </BarChart>
                            ) : (
                                <div className="flex items-center justify-center h-full text-slate-400">No sales data directly available yet.</div>
                            )}
                        </ChartCardComponent>
                    </div>

                    {/* Side Charts Column */}
                    <div className={isMobile ? 'space-y-4' : 'space-y-6 animate-in'} style={!isMobile ? { animationDelay: '0.3s' } : {}}>
                        {/* Stock Levels */}
                        <ChartCardComponent title="Stock Distribution" subtitle="Inventory status" height={isMobile ? 250 : 280}>
                            {stats.stockLevels && stats.stockLevels.length > 0 && stats.totalProducts > 0 ? (
                                <>
                                    <PieChart>
                                        <Pie
                                            data={stats.stockLevels}
                                            innerRadius={isMobile ? 50 : 60}
                                            outerRadius={isMobile ? 70 : 80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {stats.stockLevels.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                                            ))}
                                        </Pie>
                                        <Tooltip {...chartTheme.tooltip} />
                                    </PieChart>
                                    <div className="flex justify-center flex-wrap gap-3 md:gap-4 mt-2">
                                        {stats.stockLevels.map(d => (
                                            <div key={d.name} className="flex items-center gap-2 text-xs text-slate-500">
                                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }}></span>
                                                {d.name} ({d.value})
                                            </div>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <div className="flex items-center justify-center h-full text-slate-400">No products available.</div>
                            )}
                        </ChartCardComponent>

                        {/* Low Stock Alert */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                            <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                                <AlertCircle size={18} className="text-amber-600" />
                                Inventory Actions
                            </h3>
                            <div className="space-y-3">
                                {stats.lowStockAlerts > 0 ? (
                                    <p className="text-sm text-slate-600">You have {stats.lowStockAlerts} products with low stock standing. Check your products page.</p>
                                ) : (
                                    <p className="text-sm text-slate-600">Inventory levels are looking healthy!</p>
                                )}
                            </div>
                            <Button variant="outline" size="sm" className="w-full mt-4" onClick={() => navigate('/retailer/products')}>
                                View All Products
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Mobile FAB */}
                {isMobile && (
                    <button
                        onClick={() => navigate('/retailer/products')}
                        className="fixed bottom-20 right-4 z-40 w-14 h-14 rounded-full bg-gradient-to-r from-green-600 to-green-500 text-white shadow-2xl shadow-green-500/50 flex items-center justify-center hover:scale-110 transition-transform active:scale-95"
                    >
                        <Plus size={24} strokeWidth={2.5} />
                    </button>
                )}
            </div>
        </DashboardLayout>
    );
};

export default RetailerDashboard;
