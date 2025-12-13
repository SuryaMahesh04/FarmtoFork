import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sprout, TrendingUp, Package, Leaf, Plus } from 'lucide-react';
import {
    PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, ResponsiveContainer,
    AreaChart, Area, CartesianGrid, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import DashboardLayout from '../../components/layout/DashboardLayout';
import MetricCard from '../../components/ui/MetricCard';
import DataTable from '../../components/ui/DataTable';
import ChartCard from '../../components/ui/ChartCard';
import StatusBadge from '../../components/ui/StatusBadge';
import Button from '../../components/ui/Button';
import {
    farmerMetrics, farmerBatches, cropDistributionData, seasonalTrendData, marketPriceData, soilHealthData
} from '../../data/dummyData';
import { chartTheme } from '../../utils/chartConfig';

const FarmerDashboard = () => {
    const navigate = useNavigate();

    const columns = [
        { header: 'Batch ID', accessor: 'id' },
        { header: 'Crop', accessor: 'crop' },
        { header: 'Variety', accessor: 'variety' },
        { header: 'Quantity', accessor: 'quantity' },
        { header: 'Date', accessor: 'date' },
        { header: 'Status', accessor: 'status', render: (row) => <StatusBadge status={row.status} /> },
    ];

    return (
        <DashboardLayout role="farmer">
            <div className="space-y-6">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-in">
                    <div>
                        <h1 className="text-2xl font-display font-bold text-slate-800">Welcome back, Surya! 👨‍🌾</h1>
                        <p className="text-slate-500">Here's what's happening on your farm today.</p>
                    </div>
                    <Button icon={Plus} onClick={() => navigate('/farmer/create-batch')}>Create New Batch</Button>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <MetricCard title="Total Batches" value={124} icon={Package} trend={12} color="sage" delay={0.1} />
                    <MetricCard title="Active Batches" value={8} icon={Sprout} trend={0} color="wheat" delay={0.2} />
                    <MetricCard title="Total Revenue" value={845000} icon={TrendingUp} trend={24} color="sky" delay={0.3} />
                    <MetricCard title="Quality Score" value={98} icon={Leaf} trend={1.5} color="terra" delay={0.4} />
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Charts Column */}
                    {/* Main Charts Column */}
                    <div className="lg:col-span-2 space-y-6 animate-in transition-all" style={{ animationDelay: '0.2s' }}>
                        {/* Market Price Trends */}
                        <ChartCard title="Market Price Analysis" subtitle="My Sales vs Mandi Prices (₹/quintal)" height={300}>
                            <AreaChart data={marketPriceData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorMyPrice" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={chartTheme.colors.sage[0]} stopOpacity={0.8} />
                                        <stop offset="95%" stopColor={chartTheme.colors.sage[0]} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="month" {...chartTheme.axis} />
                                <YAxis {...chartTheme.axis} />
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
                        </ChartCard>

                        {/* Seasonal Revenue */}
                        <ChartCard title="Seasonal Revenue" subtitle="Income vs Batches over last 6 months" height={250}>
                            <BarChart data={seasonalTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <XAxis dataKey="name" {...chartTheme.axis} />
                                <YAxis {...chartTheme.axis} />
                                <Tooltip {...chartTheme.tooltip} />
                                <Bar dataKey="revenue" fill={chartTheme.colors.sage[0]} radius={[4, 4, 0, 0]} animationDuration={1500} />
                            </BarChart>
                        </ChartCard>
                    </div>

                    {/* Side Charts Column */}
                    <div className="space-y-6 animate-in transition-all" style={{ animationDelay: '0.3s' }}>
                        {/* Crop Distribution */}
                        <ChartCard title="Crop Distribution" subtitle="Based on active acres" height={300}>
                            <PieChart>
                                <Pie
                                    data={cropDistributionData}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {cropDistributionData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                                    ))}
                                </Pie>
                                <Tooltip {...chartTheme.tooltip} />
                            </PieChart>
                            <div className="flex justify-center flex-wrap gap-4 mt-2">
                                {cropDistributionData.map(d => (
                                    <div key={d.name} className="flex items-center gap-2 text-xs text-slate-500">
                                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }}></span>
                                        {d.name}
                                    </div>
                                ))}
                            </div>
                        </ChartCard>

                        {/* Soil Health - New Addition */}
                        <ChartCard title="Soil Health" subtitle="Nutrient Analysis" height={300}>
                            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={soilHealthData}>
                                <PolarGrid stroke="#E2E8F0" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748B', fontSize: 10 }} />
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
                        </ChartCard>
                    </div>
                </div>

                {/* Recent Batches Table */}
                <div className="animate-in transition-all" style={{ animationDelay: '0.4s' }}>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-display font-semibold text-slate-700">Recent Batches</h2>
                        <Button variant="ghost" size="sm" onClick={() => navigate('/farmer/batches')}>View All</Button>
                    </div>
                    <DataTable
                        columns={columns}
                        data={farmerBatches}
                        onRowClick={(row) => navigate(`/farmer/batch/${row.id}`)}
                    />
                </div>
            </div>
        </DashboardLayout>
    );
};

export default FarmerDashboard;
