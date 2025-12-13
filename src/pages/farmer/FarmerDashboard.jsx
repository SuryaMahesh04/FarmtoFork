import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sprout, TrendingUp, Package, Leaf, Plus } from 'lucide-react';
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
import {
    farmerMetrics, farmerBatches, cropDistributionData, seasonalTrendData, marketPriceData, soilHealthData
} from '../../data/dummyData';
import { chartTheme } from '../../utils/chartConfig';
import useMediaQuery from '../../utils/useMediaQuery';

const FarmerDashboard = () => {
    const navigate = useNavigate();
    const isMobile = useMediaQuery('(max-width: 768px)');

    const columns = [
        { header: 'Batch ID', accessor: 'id' },
        { header: 'Crop', accessor: 'crop' },
        { header: 'Variety', accessor: 'variety' },
        { header: 'Quantity', accessor: 'quantity' },
        { header: 'Date', accessor: 'date' },
        { header: 'Status', accessor: 'status', render: (row) => <StatusBadge status={row.status} /> },
    ];

    // Use mobile or desktop chart card
    const ChartCardComponent = isMobile ? MobileChartCard : ChartCard;
    const chartHeight = isMobile ? 220 : 300;
    const barChartHeight = isMobile ? 200 : 250;

    return (
        <DashboardLayout role="farmer">
            <div className="space-y-6">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-in">
                    <div>
                        <h1 className="text-xl md:text-2xl font-display font-bold text-slate-800">Welcome back, Surya! 👨‍🌾</h1>
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
                            <MobileMetricCard title="Total Batches" value={124} icon={Package} trend={12} color="sage" delay={0.1} />
                            <MobileMetricCard title="Active Batches" value={8} icon={Sprout} trend={0} color="wheat" delay={0.2} />
                            <MobileMetricCard title="Total Revenue" value="₹8.45L" icon={TrendingUp} trend={24} color="sky" delay={0.3} />
                            <MobileMetricCard title="Quality Score" value={98} icon={Leaf} trend={1.5} color="terra" delay={0.4} />
                        </>
                    ) : (
                        <>
                            <MetricCard title="Total Batches" value={124} icon={Package} trend={12} color="sage" delay={0.1} />
                            <MetricCard title="Active Batches" value={8} icon={Sprout} trend={0} color="wheat" delay={0.2} />
                            <MetricCard title="Total Revenue" value={845000} icon={TrendingUp} trend={24} color="sky" delay={0.3} />
                            <MetricCard title="Quality Score" value={98} icon={Leaf} trend={1.5} color="terra" delay={0.4} />
                        </>
                    )}
                </div>

                {/* Charts Section - Mobile: Vertical Stack, Desktop: Grid */}
                <div className={isMobile ? 'space-y-4' : 'grid grid-cols-1 lg:grid-cols-3 gap-6'}>
                    {/* Main Charts Column */}
                    <div className={isMobile ? 'space-y-4' : 'lg:col-span-2 space-y-6 animate-in transition-all'} style={!isMobile ? { animationDelay: '0.2s' } : {}}>
                        {/* Market Price Trends */}
                        <ChartCardComponent title="Market Price Analysis" subtitle="My Sales vs Mandi Prices (₹/quintal)" height={chartHeight}>
                            <AreaChart data={marketPriceData} margin={{ top: 10, right: isMobile ? 10 : 30, left: isMobile ? -20 : 0, bottom: 0 }}>
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
                            <BarChart data={seasonalTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                        <ChartCardComponent title="Crop Distribution" subtitle="Based on active acres" height={isMobile ? 250 : 300}>
                            <PieChart>
                                <Pie
                                    data={cropDistributionData}
                                    innerRadius={isMobile ? 50 : 60}
                                    outerRadius={isMobile ? 70 : 80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {cropDistributionData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                                    ))}
                                </Pie>
                                <Tooltip {...chartTheme.tooltip} />
                            </PieChart>
                            <div className="flex justify-center flex-wrap gap-3 md:gap-4 mt-2">
                                {cropDistributionData.map(d => (
                                    <div key={d.name} className="flex items-center gap-2 text-xs text-slate-500">
                                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }}></span>
                                        {d.name}
                                    </div>
                                ))}
                            </div>
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
                        <DataTable
                            columns={columns}
                            data={farmerBatches}
                            onRowClick={(row) => navigate(`/farmer/batch/${row.id}`)}
                        />
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
