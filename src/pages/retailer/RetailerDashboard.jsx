import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, ShoppingCart, AlertCircle, ScanLine, Plus, TrendingUp } from 'lucide-react';
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

// Dummy data for retailer dashboard
const salesTrendData = [
    { day: 'Mon', sales: 18, revenue: 8500 },
    { day: 'Tue', sales: 24, revenue: 11200 },
    { day: 'Wed', sales: 21, revenue: 9800 },
    { day: 'Thu', sales: 28, revenue: 13500 },
    { day: 'Fri', sales: 32, revenue: 15600 },
    { day: 'Sat', sales: 45, revenue: 21400 },
    { day: 'Sun', sales: 38, revenue: 18200 }
];

const topProductsData = [
    { product: 'Basmati Rice', sales: 85 },
    { product: 'Wheat Flour', sales: 72 },
    { product: 'Organic Honey', sales: 58 },
    { product: 'Tomatoes', sales: 45 }
];

const stockLevelsData = [
    { name: 'In Stock', value: 380, color: '#5c9449' },
    { name: 'Low Stock', value: 50, color: '#f59e0b' },
    { name: 'Out of Stock', value: 20, color: '#d4a574' }
];

const engagementData = [
    { month: 'Jul', scans: 420, purchases: 380 },
    { month: 'Aug', scans: 510, purchases: 460 },
    { month: 'Sep', scans: 580, purchases: 520 },
    { month: 'Oct', scans: 650, purchases: 590 },
    { month: 'Nov', scans: 720, purchases: 650 },
    { month: 'Dec', scans: 810, purchases: 730 }
];

const RetailerDashboard = () => {
    const navigate = useNavigate();
    const isMobile = useMediaQuery('(max-width: 768px)');

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
                        <Button icon={Plus} onClick={() => navigate('/retailer/products')}>Add Product</Button>
                    )}
                </div>

                {/* Metrics Grid - Responsive */}
                <div className={`grid ${isMobile ? 'grid-cols-1 gap-3' : 'grid-cols-2 lg:grid-cols-4 gap-6'}`}>
                    {isMobile ? (
                        <>
                            <MobileMetricCard title="Total Products" value={450} icon={Store} trend={5} color="wheat" delay={0.1} />
                            <MobileMetricCard title="Sales Today" value={24} icon={ShoppingCart} trend={15} color="sage" delay={0.2} />
                            <MobileMetricCard title="Low Stock Alerts" value={12} icon={AlertCircle} trend={-2} color="terra" delay={0.3} />
                            <MobileMetricCard title="Consumer Scans" value={156} icon={ScanLine} trend={24} color="sky" delay={0.4} />
                        </>
                    ) : (
                        <>
                            <MetricCard title="Total Products" value={450} icon={Store} trend={5} color="wheat" delay={0.1} />
                            <MetricCard title="Sales Today" value={24} icon={ShoppingCart} trend={15} color="sage" delay={0.2} />
                            <MetricCard title="Low Stock Alerts" value={12} icon={AlertCircle} trend={-2} color="terra" delay={0.3} />
                            <MetricCard title="Consumer Scans" value={156} icon={ScanLine} trend={24} color="sky" delay={0.4} />
                        </>
                    )}
                </div>

                {/* Charts Section */}
                <div className={isMobile ? 'space-y-4' : 'grid grid-cols-1 lg:grid-cols-3 gap-6'}>
                    {/* Main Charts Column */}
                    <div className={isMobile ? 'space-y-4' : 'lg:col-span-2 space-y-6 animate-in'} style={!isMobile ? { animationDelay: '0.2s' } : {}}>
                        {/* Sales Trends */}
                        <ChartCardComponent title="Weekly Sales Trend" subtitle="Sales count and revenue" height={chartHeight}>
                            <AreaChart data={salesTrendData} margin={{ top: 10, right: isMobile ? 10 : 30, left: isMobile ? -20 : 0, bottom: 0 }}>
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
                        <ChartCardComponent title="Top Selling Products" subtitle="This month's best performers" height={barChartHeight}>
                            <BarChart data={topProductsData} layout="vertical" margin={{ top: 10, right: 10, left: isMobile ? -20 : 0, bottom: 0 }}>
                                <XAxis type="number" {...chartTheme.axis} tick={{ fontSize: isMobile ? 10 : 12 }} />
                                <YAxis type="category" dataKey="product" {...chartTheme.axis} tick={{ fontSize: isMobile ? 10 : 12 }} width={isMobile ? 80 : 100} />
                                <Tooltip {...chartTheme.tooltip} />
                                <Bar dataKey="sales" fill={chartTheme.colors.wheat[0]} radius={[0, 4, 4, 0]} name="Units Sold" />
                            </BarChart>
                        </ChartCardComponent>
                    </div>

                    {/* Side Charts Column */}
                    <div className={isMobile ? 'space-y-4' : 'space-y-6 animate-in'} style={!isMobile ? { animationDelay: '0.3s' } : {}}>
                        {/* Stock Levels */}
                        <ChartCardComponent title="Stock Distribution" subtitle="Inventory status" height={isMobile ? 250 : 280}>
                            <PieChart>
                                <Pie
                                    data={stockLevelsData}
                                    innerRadius={isMobile ? 50 : 60}
                                    outerRadius={isMobile ? 70 : 80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {stockLevelsData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                                    ))}
                                </Pie>
                                <Tooltip {...chartTheme.tooltip} />
                            </PieChart>
                            <div className="flex justify-center flex-wrap gap-3 md:gap-4 mt-2">
                                {stockLevelsData.map(d => (
                                    <div key={d.name} className="flex items-center gap-2 text-xs text-slate-500">
                                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }}></span>
                                        {d.name}
                                    </div>
                                ))}
                            </div>
                        </ChartCardComponent>

                        {/* Low Stock Alert */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                            <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                                <AlertCircle size={18} className="text-amber-600" />
                                Low Stock Items
                            </h3>
                            <div className="space-y-3">
                                <StockItem name="Organic Honey" count={4} unit="jars" />
                                <StockItem name="Basmati Rice 5kg" count={6} unit="bags" />
                                <StockItem name="Tur Dal Premium" count={5} unit="pkts" />
                            </div>
                            <Button variant="outline" size="sm" className="w-full mt-4" onClick={() => navigate('/retailer/products')}>
                                View All Products
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Consumer Engagement */}
                <div className="animate-in" style={{ animationDelay: '0.4s' }}>
                    <ChartCardComponent title="Consumer Engagement" subtitle="QR Scans vs Purchases" height={chartHeight}>
                        <LineChart data={engagementData} margin={{ top: 10, right: isMobile ? 10 : 30, left: isMobile ? -20 : 0, bottom: 0 }}>
                            <XAxis dataKey="month" {...chartTheme.axis} tick={{ fontSize: isMobile ? 10 : 12 }} />
                            <YAxis {...chartTheme.axis} tick={{ fontSize: isMobile ? 10 : 12 }} />
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                            <Tooltip {...chartTheme.tooltip} />
                            <Line type="monotone" dataKey="scans" stroke={chartTheme.colors.sky[0]} strokeWidth={2} dot={{ r: 4 }} name="QR Scans" />
                            <Line type="monotone" dataKey="purchases" stroke={chartTheme.colors.sage[0]} strokeWidth={2} dot={{ r: 4 }} name="Purchases" />
                        </LineChart>
                    </ChartCardComponent>
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

const StockItem = ({ name, count, unit }) => (
    <div className="flex justify-between items-center p-3 bg-amber-50 rounded-xl border border-amber-100">
        <span className="text-sm font-medium text-slate-700">{name}</span>
        <span className="text-xs font-bold text-amber-600 bg-white px-2 py-1 rounded-lg">{count} {unit}</span>
    </div>
);

export default RetailerDashboard;
