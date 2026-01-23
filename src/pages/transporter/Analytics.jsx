import React, { useState, useEffect } from 'react';
import {
    TrendingUp, Truck, Clock, CheckCircle2, AlertTriangle, Calendar, Package
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
    AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import DashboardLayout from '../../components/layout/DashboardLayout';
import MetricCard from '../../components/ui/MetricCard';
import ChartCard from '../../components/ui/ChartCard';
import { chartTheme } from '../../utils/chartConfig';
import { api } from '../../utils/api';

const Analytics = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        total: 0,
        active: 0,
        completed: 0,
        onTimeRate: 0,
        avgTransitTime: 0
    });
    const [monthlyData, setMonthlyData] = useState([]);
    const [statusData, setStatusData] = useState([]);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const res = await api.shipment.getAll();
            if (res.success) {
                const shipments = res.data;
                calculateMetrics(shipments);
            }
        } catch (error) {
            console.error('Failed to load analytics', error);
        } finally {
            setLoading(false);
        }
    };

    const calculateMetrics = (shipments) => {
        // 1. Basic Counts
        const total = shipments.length;
        const completed = shipments.filter(s => s.status === 'delivered').length;
        const active = shipments.filter(s => ['accepted', 'picked_up', 'in_transit'].includes(s.status)).length;
        const delayed = shipments.filter(s => s.status === 'delayed' || s.status === 'rejected').length;

        // 2. Monthly Trend active last 6 months
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthlyCounts = {};

        shipments.forEach(s => {
            const date = new Date(s.createdAt);
            const month = months[date.getMonth()];
            monthlyCounts[month] = (monthlyCounts[month] || 0) + 1;
        });

        // Fill last 6 months
        const currentMonthIdx = new Date().getMonth();
        const chartData = [];
        for (let i = 5; i >= 0; i--) {
            const idx = (currentMonthIdx - i + 12) % 12;
            const monthName = months[idx];
            chartData.push({
                name: monthName,
                shipments: monthlyCounts[monthName] || 0,
                completed: Math.floor((monthlyCounts[monthName] || 0) * 0.8) // Mock completion rate for chart
            });
        }
        setMonthlyData(chartData);

        // 3. Status Distribution
        const statusCounts = shipments.reduce((acc, curr) => {
            acc[curr.status] = (acc[curr.status] || 0) + 1;
            return acc;
        }, {});

        const pieData = [
            { name: 'Active', value: active, color: '#3b82f6' },
            { name: 'Delivered', value: completed, color: '#10b981' },
            { name: 'Pending', value: statusCounts['pending'] || 0, color: '#f59e0b' },
            { name: 'Exceptions', value: delayed, color: '#ef4444' }
        ].filter(d => d.value > 0);
        setStatusData(pieData);

        setStats({
            total,
            active,
            completed,
            onTimeRate: total > 0 ? Math.round(((total - delayed) / total) * 100) : 100,
            avgTransitTime: 2.4 // Mocked average days
        });
    };

    return (
        <DashboardLayout role="transporter">
            <div className="space-y-6 animate-in pb-20 md:pb-0">
                <div>
                    <h1 className="text-2xl font-display font-bold text-slate-800">Fleet Analytics</h1>
                    <p className="text-slate-500">Performance metrics and delivery insights</p>
                </div>

                {/* Metrics Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <MetricCard
                        title="Total Deliveries"
                        value={stats.total}
                        icon={Package}
                        trend={12}
                        color="sage"
                    />
                    <MetricCard
                        title="On-Time Rate"
                        value={stats.onTimeRate}
                        suffix="%"
                        icon={CheckCircle2}
                        trend={2}
                        color="sky"
                    />
                    <MetricCard
                        title="Active Fleet"
                        value={stats.active}
                        icon={Truck}
                        color="wheat"
                    />
                    <MetricCard
                        title="Avg Transit Time"
                        value={stats.avgTransitTime}
                        suffix=" Days"
                        icon={Clock}
                        trend={-5}
                        color="terra"
                    />
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Monthly Volume */}
                    <ChartCard title="Shipment Volume" subtitle="Monthly pickup vs delivery" height={300}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorShipments" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={chartTheme.colors.sky[0]} stopOpacity={0.8} />
                                        <stop offset="95%" stopColor={chartTheme.colors.sky[0]} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" {...chartTheme.axis} />
                                <YAxis {...chartTheme.axis} />
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <Tooltip {...chartTheme.tooltip} />
                                <Legend />
                                <Area
                                    type="monotone"
                                    dataKey="shipments"
                                    stroke={chartTheme.colors.sky[0]}
                                    fillOpacity={1}
                                    fill="url(#colorShipments)"
                                    name="Total Jobs"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </ChartCard>

                    {/* Status Distribution */}
                    <ChartCard title="Fleet Status" subtitle="Current operational distribution" height={300}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    innerRadius={80}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                                    ))}
                                </Pie>
                                <Tooltip {...chartTheme.tooltip} />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </ChartCard>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Analytics;
