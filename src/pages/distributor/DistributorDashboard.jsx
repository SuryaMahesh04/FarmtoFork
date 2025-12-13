import React from 'react';
import { Package, Truck, ClipboardCheck, Warehouse, ArrowUpRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import DashboardLayout from '../../components/layout/DashboardLayout';
import MetricCard from '../../components/ui/MetricCard';
import DataTable from '../../components/ui/DataTable';
import ChartCard from '../../components/ui/ChartCard';
import StatusBadge from '../../components/ui/StatusBadge';
import { distributorMetrics, inventoryData, seasonalTrendData } from '../../data/dummyData';
import { chartTheme } from '../../utils/chartConfig';

const DistributorDashboard = () => {
    const columns = [
        { header: 'Item Code', accessor: 'id' },
        { header: 'Product', accessor: 'item' },
        { header: 'Stock Level', accessor: 'stock' },
        { header: 'Warehouse Loc', accessor: 'warehouse' },
        { header: 'Expiry', accessor: 'expiry' },
        { header: 'Status', accessor: 'status', render: (row) => <StatusBadge status={row.status} /> },
    ];

    return (
        <DashboardLayout role="distributor">
            <div className="space-y-6">
                <h1 className="text-2xl font-display font-bold text-slate-800 animate-in">Warehouse Operations 📦</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <MetricCard title="Total Inventory" value={850} icon={Warehouse} trend={10} color="wheat" delay={0.1} />
                    <MetricCard title="Incoming Batches" value={5} icon={Truck} trend={0} color="sage" delay={0.2} />
                    <MetricCard title="Dispatched" value={12} icon={ArrowUpRight} trend={20} color="sky" delay={0.3} />
                    <MetricCard title="Quality Check" value={100} icon={ClipboardCheck} trend={0} color="sage" delay={0.4} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="animate-in" style={{ animationDelay: '0.2s' }}>
                        <ChartCard title="Storage Capacity" subtitle="Metric Tonnes per Zone">
                            <BarChart data={seasonalTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <XAxis dataKey="name" {...chartTheme.axis} />
                                <YAxis {...chartTheme.axis} />
                                <Tooltip {...chartTheme.tooltip} />
                                <Bar dataKey="revenue" fill={chartTheme.colors.wheat[0]} radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ChartCard>
                    </div>

                    <div className="glass-panel p-6 rounded-2xl animate-in" style={{ animationDelay: '0.3s' }}>
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-slate-700 font-semibold">Warehouse Status</h3>
                                <p className="text-slate-400 text-xs mt-1">Real-time zone utilization</p>
                            </div>
                            <div className="text-2xl font-bold text-sage-600">85% Full</div>
                        </div>
                        <div className="space-y-4">
                            <UtilizationBar label="Zone A (Cold Storage)" percent={92} color="bg-sky-400" />
                            <UtilizationBar label="Zone B (Dry Storage)" percent={65} color="bg-wheat-400" />
                            <UtilizationBar label="Silos (Grains)" percent={45} color="bg-sage-400" />
                        </div>
                    </div>
                </div>

                <div className="animate-in" style={{ animationDelay: '0.4s' }}>
                    <h2 className="text-lg font-display font-semibold text-slate-700 mb-4">Current Inventory</h2>
                    <DataTable columns={columns} data={inventoryData} />
                </div>
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
