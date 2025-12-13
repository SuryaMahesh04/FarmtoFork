import React from 'react';
import {
    TrendingUp, Activity, Droplets, Sprout, DollarSign, CloudRain
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
    LineChart, Line, AreaChart, Area, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import DashboardLayout from '../../components/layout/DashboardLayout';
import MetricCard from '../../components/ui/MetricCard';
import ChartCard from '../../components/ui/ChartCard';
import { chartTheme } from '../../utils/chartConfig';
import {
    seasonalTrendData,
    resourceUsageData,
    soilHealthData,
    marketPriceData
} from '../../data/dummyData';

const Analytics = () => {
    return (
        <DashboardLayout role="farmer">
            <div className="space-y-6 animate-in">
                <div>
                    <h1 className="text-2xl font-display font-bold text-slate-800">Advanced Analytics</h1>
                    <p className="text-slate-500">Data-driven insights for precision agriculture</p>
                </div>

                {/* Key Metrics Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <MetricCard title="Est. Yield" value={14.2} suffix=" MT" icon={Sprout} trend={8} color="sage" />
                    <MetricCard title="Revenue Proj." value={12.5} suffix=" L" icon={DollarSign} trend={15} color="wheat" />
                    <MetricCard title="Water Usage" value={18.2} suffix=" kL" icon={Droplets} trend={-5} color="sky" />
                    <MetricCard title="Soil Health" value={92} suffix=" /100" icon={Activity} trend={2} color="terra" />
                </div>

                {/* Main Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* 1. Market Price Trends (Line Chart) */}
                    <div className="lg:col-span-2">
                        <ChartCard title="Market Price Analysis" subtitle="My Sales vs Mandi Prices (₹/quintal)" height={300}>
                            <AreaChart data={marketPriceData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorMyPrice" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={chartTheme.colors.sage[0]} stopOpacity={0.8} />
                                        <stop offset="95%" stopColor={chartTheme.colors.sage[0]} stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorMarket" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={chartTheme.colors.terra[0]} stopOpacity={0.8} />
                                        <stop offset="95%" stopColor={chartTheme.colors.terra[0]} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="month" {...chartTheme.axis} />
                                <YAxis {...chartTheme.axis} />
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <Tooltip {...chartTheme.tooltip} />
                                <Legend />
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
                                    fillOpacity={0.3}
                                    fill="url(#colorMarket)"
                                    name="Avg. Market Price"
                                />
                            </AreaChart>
                        </ChartCard>
                    </div>

                    {/* 2. Resource Consumption (Stacked Bar) */}
                    <ChartCard title="Resource Consumption" subtitle="Water (L), Fertilizer (kg), Labor (hrs)" height={350}>
                        <BarChart data={resourceUsageData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <XAxis dataKey="month" {...chartTheme.axis} />
                            <YAxis {...chartTheme.axis} />
                            <Tooltip {...chartTheme.tooltip} cursor={{ fill: 'transparent' }} />
                            <Legend />
                            {/* Normalize data visually or use separate axes in real app. For now stacking different units for trend visualization */}
                            <Bar dataKey="labor" stackId="a" fill={chartTheme.colors.wheat[0]} name="Labor (Hrs)" />
                            <Bar dataKey="fertilizer" stackId="a" fill={chartTheme.colors.sage[0]} name="Fertilizer (Kg)" />
                            {/* Water is too large for stack, maybe separate or scaled down 1/100 for viz */}
                        </BarChart>
                        <p className="text-xs text-slate-400 mt-2 text-center">*Water usage tracked separately due to scale</p>
                    </ChartCard>

                    {/* 3. Soil Health (Radar Chart) */}
                    <ChartCard title="Soil Health Analysis" subtitle="Nutrient Comparison (Actual vs Optimal)" height={350}>
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={soilHealthData}>
                            <PolarGrid stroke="#E2E8F0" />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748B', fontSize: 12 }} />
                            <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} />
                            <Radar
                                name="Current Levels"
                                dataKey="A"
                                stroke={chartTheme.colors.sage[0]}
                                fill={chartTheme.colors.sage[0]}
                                fillOpacity={0.6}
                            />
                            <Radar
                                name="Optimal Levels"
                                dataKey="B"
                                stroke={chartTheme.colors.sky[0]}
                                fill={chartTheme.colors.sky[0]}
                                fillOpacity={0.3}
                            />
                            <Legend />
                            <Tooltip />
                        </RadarChart>
                    </ChartCard>

                    {/* 4. Seasonal Revenue (Existing but valid) */}
                    <ChartCard title="Revenue Trends" subtitle="Income vs Batches over last 6 months" height={300}>
                        <BarChart data={seasonalTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <XAxis dataKey="name" {...chartTheme.axis} />
                            <YAxis {...chartTheme.axis} />
                            <Tooltip {...chartTheme.tooltip} />
                            <Bar dataKey="revenue" fill={chartTheme.colors.terra[0]} radius={[4, 4, 0, 0]} name="Net Revenue" />
                        </BarChart>
                    </ChartCard>

                </div>
            </div>
        </DashboardLayout>
    );
};

export default Analytics;
