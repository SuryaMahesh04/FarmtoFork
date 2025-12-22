import React, { useEffect, useState } from 'react';
import {
    TrendingUp, Activity, Droplets, Sprout, DollarSign, CloudRain, Loader2
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
    LineChart, Line, AreaChart, Area, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import DashboardLayout from '../../components/layout/DashboardLayout';
import MetricCard from '../../components/ui/MetricCard';
import ChartCard from '../../components/ui/ChartCard';
import { chartTheme } from '../../utils/chartConfig';
import { api } from '../../utils/api';

const Analytics = () => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const res = await api.farmer.getAnalytics();
            if (res.success) {
                setAnalytics(res.data);
            } else {
                setError('Failed to load analytics data');
            }
        } catch (err) {
            console.error('Fetch error:', err);
            setError('Failed to load analytics data');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <DashboardLayout role="farmer">
                <div className="flex justify-center items-center h-96">
                    <Loader2 className="animate-spin text-sage-500" size={48} />
                </div>
            </DashboardLayout>
        );
    }

    if (error || !analytics) {
        return (
            <DashboardLayout role="farmer">
                <div className="flex justify-center items-center h-96 text-red-500">
                    {error || 'No data available'}
                </div>
            </DashboardLayout>
        );
    }

    // Default empty data safety
    const seasonalTrends = analytics.seasonalTrends || [];
    const marketPrices = analytics.marketPrices || [];
    const resourceUsage = analytics.resourceUsage || [];
    const soilHealth = analytics.soilHealth || [];

    return (
        <DashboardLayout role="farmer">
            <div className="space-y-6 animate-in">
                <div>
                    <h1 className="text-2xl font-display font-bold text-slate-800">Advanced Analytics</h1>
                    <p className="text-slate-500">Data-driven insights for precision agriculture</p>
                </div>

                {/* Key Metrics Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <MetricCard
                        title="Est. Yield"
                        value={analytics.metrics?.activeBatches ? analytics.metrics.activeBatches * 50 : 0} // Estimate 50 units per batch
                        suffix=" Units"
                        icon={Sprout}
                        trend={8}
                        color="sage"
                    />
                    <MetricCard
                        title="Revenue Proj."
                        value={analytics.metrics?.totalRevenue ? (analytics.metrics.totalRevenue / 100000).toFixed(1) : 0}
                        suffix=" L"
                        icon={DollarSign}
                        trend={15}
                        color="wheat"
                    />
                    <MetricCard
                        title="Avg. Quality"
                        value={analytics.metrics?.qualityScore || 0}
                        suffix=" /100"
                        icon={Activity}
                        trend={2}
                        color="terra"
                    />
                    <MetricCard
                        title="Batches"
                        value={analytics.metrics?.totalBatches || 0}
                        suffix=""
                        icon={CloudRain}
                        trend={5}
                        color="sky"
                    />
                </div>

                {/* Main Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* 1. Market Price Trends (Line Chart) */}
                    <div className="lg:col-span-2">
                        <ChartCard title="Market Price Analysis" subtitle="My Sales vs Mandi Prices (₹/unit)" height={300}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={marketPrices} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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
                            </ResponsiveContainer>
                        </ChartCard>
                    </div>

                    {/* 2. Resource Consumption (Stacked Bar) */}
                    <ChartCard title="Resource Consumption" subtitle="Water (L), Fertilizer (kg), Labor (hrs)" height={350}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={resourceUsage} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <XAxis dataKey="month" {...chartTheme.axis} />
                                <YAxis {...chartTheme.axis} />
                                <Tooltip {...chartTheme.tooltip} cursor={{ fill: 'transparent' }} />
                                <Legend />
                                <Bar dataKey="labor" stackId="a" fill={chartTheme.colors.wheat[0]} name="Labor (Hrs)" />
                                <Bar dataKey="fertilizer" stackId="a" fill={chartTheme.colors.sage[0]} name="Fertilizer (Kg)" />
                            </BarChart>
                        </ResponsiveContainer>
                        <p className="text-xs text-slate-400 mt-2 text-center">*Water usage tracked separately due to scale</p>
                    </ChartCard>

                    {/* 3. Soil Health (Radar Chart) */}
                    <ChartCard title="Soil Health Analysis" subtitle="Nutrient Comparison (Actual vs Optimal)" height={350}>
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={soilHealth}>
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
                        </ResponsiveContainer>
                    </ChartCard>

                    {/* 4. Seasonal Revenue (Existing) */}
                    <ChartCard title="Revenue Trends" subtitle="Income vs Batches over last 6 months" height={300}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={seasonalTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <XAxis dataKey="name" {...chartTheme.axis} />
                                <YAxis {...chartTheme.axis} />
                                <Tooltip {...chartTheme.tooltip} />
                                <Bar dataKey="revenue" fill={chartTheme.colors.terra[0]} radius={[4, 4, 0, 0]} name="Net Revenue" />
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartCard>

                </div>
            </div>
        </DashboardLayout>
    );
};

export default Analytics;
