import React from 'react';
import { Truck, Navigation, Clock, Activity, MapPin, CheckCircle2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';
import DashboardLayout from '../../components/layout/DashboardLayout';
import MetricCard from '../../components/ui/MetricCard';
import DataTable from '../../components/ui/DataTable';
import ChartCard from '../../components/ui/ChartCard';
import StatusBadge from '../../components/ui/StatusBadge';
import { transportMetrics, activeShipments, vehicleUtilizationData, seasonalTrendData } from '../../data/dummyData';
import { chartTheme } from '../../utils/chartConfig';

const TransporterDashboard = () => {
    const columns = [
        { header: 'Shipment ID', accessor: 'id' },
        { header: 'Origin', accessor: 'origin' },
        { header: 'Destination', accessor: 'destination' },
        { header: 'Cargo', accessor: 'cargo' },
        { header: 'Vehicle', accessor: 'vehicle' },
        { header: 'ETA', accessor: 'eta' },
        { header: 'Status', accessor: 'status', render: (row) => <StatusBadge status={row.status} /> },
    ];

    return (
        <DashboardLayout role="transporter">
            <div className="space-y-6">
                <h1 className="text-2xl font-display font-bold text-slate-800 animate-in">Fleet Command Center 🚚</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <MetricCard title="Active Shipments" value={14} icon={Truck} trend={5} color="sage" delay={0.1} />
                    <MetricCard title="Completed" value={452} icon={CheckCircle2} trend={15} color="sky" delay={0.2} />
                    <MetricCard title="Total Distance (km)" value={12500} icon={Navigation} trend={8} color="wheat" delay={0.3} />
                    <MetricCard title="Fleet Health" value={92} icon={Activity} trend={-1} color="terra" delay={0.4} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 animate-in" style={{ animationDelay: '0.2s' }}>
                        <ChartCard title="Delivery Performance" subtitle="Completed deliveries vs Time" height={300}>
                            <LineChart data={seasonalTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <XAxis dataKey="name" {...chartTheme.axis} />
                                <YAxis {...chartTheme.axis} />
                                <Tooltip {...chartTheme.tooltip} />
                                <Line type="monotone" dataKey="batches" stroke={chartTheme.colors.sky[1]} strokeWidth={3} dot={{ r: 4, fill: '#fff', strokeWidth: 2 }} />
                            </LineChart>
                        </ChartCard>
                    </div>
                    <div className="animate-in" style={{ animationDelay: '0.3s' }}>
                        <ChartCard title="Vehicle Utilization" subtitle="Fleet status distribution" height={300}>
                            <PieChart>
                                <Pie data={vehicleUtilizationData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                    {vehicleUtilizationData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                                    ))}
                                </Pie>
                                <Tooltip {...chartTheme.tooltip} />
                            </PieChart>
                            <div className="flex justify-center flex-wrap gap-4 mt-2">
                                {vehicleUtilizationData.map(d => (
                                    <div key={d.name} className="flex items-center gap-2 text-xs text-slate-500">
                                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }}></span>
                                        {d.name}
                                    </div>
                                ))}
                            </div>
                        </ChartCard>
                    </div>
                </div>

                <div className="animate-in" style={{ animationDelay: '0.4s' }}>
                    <h2 className="text-lg font-display font-semibold text-slate-700 mb-4">Live Tracking</h2>
                    <DataTable columns={columns} data={activeShipments} />
                </div>
            </div>
        </DashboardLayout>
    );
};

export default TransporterDashboard;
