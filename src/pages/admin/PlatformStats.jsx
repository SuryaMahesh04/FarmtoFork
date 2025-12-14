import React from 'react';
import { Activity, TrendingUp, Users, Database } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import DashboardLayout from '../../components/layout/DashboardLayout';
import ChartCard from '../../components/ui/ChartCard';
import { chartTheme } from '../../utils/chartConfig';
import useMediaQuery from '../../utils/useMediaQuery';

const transactionData = [
    { date: '12/08', count: 145 },
    { date: '12/09', count: 168 },
    { date: '12/10', count: 192 },
    { date: '12/11', count: 210 },
    { date: '12/12', count: 235 },
    { date: '12/13', count: 198 },
    { date: '12/14', count: 220 }
];

const categoryData = [
    { category: 'Batches', count: 340 },
    { category: 'Shipments', count: 285 },
    { category: 'Products', count: 450 },
    { category: 'Quality Tests', count: 127 }
];

const PlatformStats = () => {
    const isMobile = useMediaQuery('(max-width: 768px)');

    return (
        <DashboardLayout role="admin">
            <div className="space-y-6">
                <div className="animate-in">
                    <h1 className="text-xl md:text-2xl font-display font-bold text-slate-800">Platform Statistics</h1>
                    <p className="text-sm md:text-base text-slate-500">Detailed analytics and performance metrics</p>
                </div>

                {/* Stats Cards */}
                <div className={`grid ${isMobile ? 'grid-cols-2 gap-3' : 'grid-cols-4 gap-6'} animate-in`} style={{ animationDelay: '0.1s' }}>
                    <div className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-2 text-slate-600 mb-2">
                            <Activity size={18} />
                            <span className="text-xs font-medium">Total Transactions</span>
                        </div>
                        <p className="text-2xl font-bold text-slate-800">1,458</p>
                        <p className="text-xs text-emerald-600 mt-1">+12% this week</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-2 text-slate-600 mb-2">
                            <Users size={18} />
                            <span className="text-xs font-medium">Active Users</span>
                        </div>
                        <p className="text-2xl font-bold text-blue-600">1,250</p>
                        <p className="text-xs text-emerald-600 mt-1">+8% this month</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-2 text-slate-600 mb-2">
                            <Database size={18} />
                            <span className="text-xs font-medium">Total Batches</span>
                        </div>
                        <p className="text-2xl font-bold text-slate-800">340</p>
                        <p className="text-xs text-emerald-600 mt-1">+5% this week</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-2 text-slate-600 mb-2">
                            <TrendingUp size={18} />
                            <span className="text-xs font-medium">Growth Rate</span>
                        </div>
                        <p className="text-2xl font-bold text-green-600">12%</p>
                        <p className="text-xs text-slate-500 mt-1">Month over month</p>
                    </div>
                </div>

                {/* Transaction Trends */}
                <div className="animate-in" style={{ animationDelay: '0.2s' }}>
                    <ChartCard title="Transaction Volume" subtitle="Last 7 days" height={isMobile ? 220 : 300}>
                        <LineChart data={transactionData} margin={{ top: 10, right: isMobile ? 10 : 30, left: isMobile ? -20 : 0, bottom: 0 }}>
                            <XAxis dataKey="date" {...chartTheme.axis} tick={{ fontSize: isMobile ? 10 : 12 }} />
                            <YAxis {...chartTheme.axis} tick={{ fontSize: isMobile ? 10 : 12 }} />
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                            <Tooltip {...chartTheme.tooltip} />
                            <Line type="monotone" dataKey="count" stroke={chartTheme.colors.sky[0]} strokeWidth={3} dot={{ r: 5 }} name="Transactions" />
                        </LineChart>
                    </ChartCard>
                </div>

                {/* Category Breakdown */}
                <div className="animate-in" style={{ animationDelay: '0.3s' }}>
                    <ChartCard title="Activity by Category" subtitle="Current counts" height={isMobile ? 200 : 250}>
                        <BarChart data={categoryData} layout="vertical" margin={{ top: 10, right: 10, left: isMobile ? -20 : 0, bottom: 0 }}>
                            <XAxis type="number" {...chartTheme.axis} tick={{ fontSize: isMobile ? 10 : 12 }} />
                            <YAxis type="category" dataKey="category" {...chartTheme.axis} tick={{ fontSize: isMobile ? 10 : 12 }} width={isMobile ? 80 : 100} />
                            <Tooltip {...chartTheme.tooltip} />
                            <Bar dataKey="count" fill={chartTheme.colors.sage[0]} radius={[0, 4, 4, 0]} name="Count" />
                        </BarChart>
                    </ChartCard>
                </div>

                {/* Platform Health */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 animate-in" style={{ animationDelay: '0.4s' }}>
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Platform Health</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                            <span className="text-sm text-slate-700">Uptime</span>
                            <span className="text-sm font-bold text-green-600">99.8%</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                            <span className="text-sm text-slate-700">API Response Time</span>
                            <span className="text-sm font-bold text-blue-600">145ms</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg">
                            <span className="text-sm text-slate-700">Success Rate</span>
                            <span className="text-sm font-bold text-emerald-600">98.5%</span>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default PlatformStats;
