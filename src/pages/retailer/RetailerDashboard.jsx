import React from 'react';
import { Store, ShoppingCart, AlertCircle, ScanLine } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import DashboardLayout from '../../components/layout/DashboardLayout';
import MetricCard from '../../components/ui/MetricCard';
import ChartCard from '../../components/ui/ChartCard';
import { retailerMetrics, seasonalTrendData } from '../../data/dummyData';
import { chartTheme } from '../../utils/chartConfig';

const RetailerDashboard = () => {
    return (
        <DashboardLayout role="retailer">
            <div className="space-y-6">
                <h1 className="text-2xl font-display font-bold text-slate-800 animate-in">Store Overview 🏪</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <MetricCard title="Total Products" value={450} icon={Store} trend={5} color="wheat" delay={0.1} />
                    <MetricCard title="Sales Today" value={24} icon={ShoppingCart} trend={15} color="sage" delay={0.2} />
                    <MetricCard title="Low Stock Alerts" value={12} icon={AlertCircle} trend={-2} color="terra" delay={0.3} />
                    <MetricCard title="Consumer Scans" value={156} icon={ScanLine} trend={24} color="sky" delay={0.4} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 animate-in" style={{ animationDelay: '0.2s' }}>
                        <ChartCard title="Consumer Engagement" subtitle="QR Scans vs Sales">
                            <AreaChart data={seasonalTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={chartTheme.colors.sage[0]} stopOpacity={0.8} />
                                        <stop offset="95%" stopColor={chartTheme.colors.sage[0]} stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={chartTheme.colors.sky[0]} stopOpacity={0.8} />
                                        <stop offset="95%" stopColor={chartTheme.colors.sky[0]} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" {...chartTheme.axis} />
                                <YAxis {...chartTheme.axis} />
                                <Tooltip {...chartTheme.tooltip} />
                                <Area type="monotone" dataKey="revenue" stroke={chartTheme.colors.sage[0]} fillOpacity={1} fill="url(#colorSales)" />
                                <Area type="monotone" dataKey="batches" stroke={chartTheme.colors.sky[0]} fillOpacity={1} fill="url(#colorScans)" />
                            </AreaChart>
                        </ChartCard>
                    </div>

                    <div className="animate-in space-y-6" style={{ animationDelay: '0.3s' }}>
                        <div className="glass-panel p-6 rounded-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-terra-100 rounded-full blur-2xl -mr-16 -mt-16 opacity-50"></div>
                            <h3 className="font-semibold text-slate-700 mb-4 relative z-10">Low Stock Items</h3>
                            <div className="space-y-3 relative z-10">
                                <StockItem name="Organic Honey" count={4} unit="jars" />
                                <StockItem name="Basmati Rice 5kg" count={6} unit="bags" />
                                <StockItem name="Tur Dal Premium" count={5} unit="pkts" />
                            </div>
                        </div>

                        <div className="glass-panel p-6 rounded-2xl bg-gradient-to-br from-sage-50 to-white">
                            <h3 className="font-semibold text-sage-800 mb-2">Shelf Impact</h3>
                            <p className="text-sm text-slate-500 mb-4">Your transparency score is top 10% in the region! Consumers trust your verified products.</p>
                            <div className="w-full bg-sage-200 h-2 rounded-full overflow-hidden">
                                <div className="bg-sage-500 h-full w-[90%] rounded-full animate-in"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

const StockItem = ({ name, count, unit }) => (
    <div className="flex justify-between items-center p-3 bg-white/60 rounded-xl border border-terra-100">
        <span className="text-sm font-medium text-slate-700">{name}</span>
        <span className="text-xs font-bold text-terra-500 bg-terra-50 px-2 py-1 rounded-lg">{count} {unit}</span>
    </div>
);

export default RetailerDashboard;
