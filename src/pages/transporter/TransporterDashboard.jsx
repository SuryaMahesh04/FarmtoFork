import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, Navigation, CheckCircle2, Activity, TrendingUp, Package, Plus } from 'lucide-react';
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
import { chartTheme } from '../../utils/chartConfig';
import useMediaQuery from '../../utils/useMediaQuery';

// Dummy data for transporter dashboard
const routeAnalyticsData = [
    { month: 'Jul', deliveries: 120, distance: 2400 },
    { month: 'Aug', deliveries: 135, distance: 2700 },
    { month: 'Sep', deliveries: 150, distance: 3050 },
    { month: 'Oct', deliveries: 142, distance: 2900 },
    { month: 'Nov', deliveries: 165, distance: 3300 },
    { month: 'Dec', deliveries: 178, distance: 3600 }
];

const deliveryTimeData = [
    { name: 'Express', hours: 12 },
    { name: 'Standard', hours: 24 },
    { name: 'Economy', hours: 48 },
    { name: 'Bulk', hours: 72 }
];

const vehicleUtilizationData = [
    { name: 'Active', value: 14, color: '#5c9449' },
    { name: 'In Maintenance', value: 3, color: '#f5deb3' },
    { name: 'Available', value: 8, color: '#b4d7e8' }
];

const fleetHealthData = [
    { subject: 'Fuel Efficiency', A: 120 },
    { subject: 'Maintenance', A: 98 },
    { subject: 'Driver Score', A: 110 },
    { subject: 'Safety', A: 100 },
    { subject: 'Timeliness', A: 95 }
];

const activeShipments = [
    { id: 'TRK-2401', origin: 'Mumbai', destination: 'Delhi', cargo: 'Wheat - 15T', vehicle: 'MH-01-AB-1234', eta: '2 hours', status: 'in_transit' },
    { id: 'TRK-2402', origin: 'Pune', destination: 'Bangalore', cargo: 'Rice - 20T', vehicle: 'MH-12-CD-5678', eta: '5 hours', status: 'in_transit' },
    { id: 'TRK-2403', origin: 'Nashik', destination: 'Hyderabad', cargo: 'Tomatoes - 8T', vehicle: 'MH-15-EF-9101', eta: '3 hours', status: 'in_transit' },
    { id: 'TRK-2404', origin: 'Nagpur', destination: 'Chennai', cargo: 'Onions - 12T', vehicle: 'MH-31-GH-1121', eta: 'Tomorrow', status: 'scheduled' },
    { id: 'TRK-2405', origin: 'Aurangabad', destination: 'Kolkata', cargo: 'Pulses - 18T', vehicle: 'MH-20-IJ-3141', eta: '8 hours', status: 'in_transit' }
];

const TransporterDashboard = () => {
    const navigate = useNavigate();
    const isMobile = useMediaQuery('(max-width: 768px)');

    const columns = [
        { header: 'Shipment ID', accessor: 'id' },
        { header: 'Origin', accessor: 'origin' },
        { header: 'Destination', accessor: 'destination' },
        { header: 'Cargo', accessor: 'cargo' },
        { header: 'Vehicle', accessor: 'vehicle' },
        { header: 'ETA', accessor: 'eta' },
        { header: 'Status', accessor: 'status', render: (row) => <StatusBadge status={row.status} /> },
    ];

    // Use mobile or desktop chart card
    const ChartCardComponent = isMobile ? MobileChartCard : ChartCard;
    const chartHeight = isMobile ? 220 : 300;
    const barChartHeight = isMobile ? 200 : 250;

    return (
        <DashboardLayout role="transporter">
            <div className="space-y-6">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-in">
                    <div>
                        <h1 className="text-xl md:text-2xl font-display font-bold text-slate-800">Fleet Command Center 🚚</h1>
                        <p className="text-sm md:text-base text-slate-500">Real-time tracking and fleet management</p>
                    </div>
                    {!isMobile && (
                        <Button icon={Plus} onClick={() => navigate('/transporter/new-shipment')}>New Shipment</Button>
                    )}
                </div>

                {/* Metrics Grid - Responsive */}
                <div className={`grid ${isMobile ? 'grid-cols-1 gap-3' : 'grid-cols-2 lg:grid-cols-4 gap-6'}`}>
                    {isMobile ? (
                        <>
                            <MobileMetricCard title="Active Shipments" value={14} icon={Truck} trend={5} color="sage" delay={0.1} />
                            <MobileMetricCard title="Completed" value={452} icon={CheckCircle2} trend={15} color="sky" delay={0.2} />
                            <MobileMetricCard title="Total Distance" value="12.5K km" icon={Navigation} trend={8} color="wheat" delay={0.3} />
                            <MobileMetricCard title="Fleet Efficiency" value={92} icon={Activity} trend={-1} color="terra" delay={0.4} />
                        </>
                    ) : (
                        <>
                            <MetricCard title="Active Shipments" value={14} icon={Truck} trend={5} color="sage" delay={0.1} />
                            <MetricCard title="Completed" value={452} icon={CheckCircle2} trend={15} color="sky" delay={0.2} />
                            <MetricCard title="Total Distance" value={12500} icon={Navigation} trend={8} color="wheat" delay={0.3} />
                            <MetricCard title="Fleet Efficiency" value={92} icon={Activity} trend={-1} color="terra" delay={0.4} />
                        </>
                    )}
                </div>

                {/* Charts Section - Mobile: Vertical Stack, Desktop: Grid */}
                <div className={isMobile ? 'space-y-4' : 'grid grid-cols-1 lg:grid-cols-3 gap-6'}>
                    {/* Main Charts Column */}
                    <div className={isMobile ? 'space-y-4' : 'lg:col-span-2 space-y-6 animate-in transition-all'} style={!isMobile ? { animationDelay: '0.2s' } : {}}>
                        {/* Route Analytics */}
                        <ChartCardComponent title="Route Analytics" subtitle="Deliveries & Distance Covered" height={chartHeight}>
                            <AreaChart data={routeAnalyticsData} margin={{ top: 10, right: isMobile ? 10 : 30, left: isMobile ? -20 : 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorDeliveries" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={chartTheme.colors.sky[1]} stopOpacity={0.8} />
                                        <stop offset="95%" stopColor={chartTheme.colors.sky[1]} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="month" {...chartTheme.axis} tick={{ fontSize: isMobile ? 10 : 12 }} />
                                <YAxis {...chartTheme.axis} tick={{ fontSize: isMobile ? 10 : 12 }} />
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <Tooltip {...chartTheme.tooltip} />
                                <Area
                                    type="monotone"
                                    dataKey="deliveries"
                                    stroke={chartTheme.colors.sky[1]}
                                    fillOpacity={1}
                                    fill="url(#colorDeliveries)"
                                    name="Deliveries"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="distance"
                                    stroke={chartTheme.colors.sage[0]}
                                    fillOpacity={0.1}
                                    fill="transparent"
                                    strokeDasharray="5 5"
                                    name="Distance (km)"
                                />
                            </AreaChart>
                        </ChartCardComponent>

                        {/* Delivery Time Analysis */}
                        <ChartCardComponent title="Delivery Time Analysis" subtitle="Average delivery hours by service type" height={barChartHeight}>
                            <BarChart data={deliveryTimeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <XAxis dataKey="name" {...chartTheme.axis} tick={{ fontSize: isMobile ? 10 : 12 }} />
                                <YAxis {...chartTheme.axis} tick={{ fontSize: isMobile ? 10 : 12 }} />
                                <Tooltip {...chartTheme.tooltip} />
                                <Bar dataKey="hours" fill={chartTheme.colors.sky[1]} radius={[4, 4, 0, 0]} animationDuration={1500} />
                            </BarChart>
                        </ChartCardComponent>
                    </div>

                    {/* Side Charts Column */}
                    <div className={isMobile ? 'space-y-4' : 'space-y-6 animate-in transition-all'} style={!isMobile ? { animationDelay: '0.3s' } : {}}>
                        {/* Vehicle Utilization */}
                        <ChartCardComponent title="Vehicle Utilization" subtitle="Fleet status distribution" height={isMobile ? 250 : 300}>
                            <PieChart>
                                <Pie
                                    data={vehicleUtilizationData}
                                    innerRadius={isMobile ? 50 : 60}
                                    outerRadius={isMobile ? 70 : 80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {vehicleUtilizationData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                                    ))}
                                </Pie>
                                <Tooltip {...chartTheme.tooltip} />
                            </PieChart>
                            <div className="flex justify-center flex-wrap gap-3 md:gap-4 mt-2">
                                {vehicleUtilizationData.map(d => (
                                    <div key={d.name} className="flex items-center gap-2 text-xs text-slate-500">
                                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }}></span>
                                        {d.name}
                                    </div>
                                ))}
                            </div>
                        </ChartCardComponent>

                        {/* Fleet Health */}
                        <ChartCardComponent title="Fleet Health" subtitle="Vehicle performance metrics" height={isMobile ? 250 : 300}>
                            <RadarChart cx="50%" cy="50%" outerRadius={isMobile ? "60%" : "70%"} data={fleetHealthData}>
                                <PolarGrid stroke="#E2E8F0" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748B', fontSize: isMobile ? 9 : 10 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} />
                                <Radar
                                    name="Score"
                                    dataKey="A"
                                    stroke={chartTheme.colors.sky[1]}
                                    fill={chartTheme.colors.sky[1]}
                                    fillOpacity={0.5}
                                />
                                <Tooltip />
                            </RadarChart>
                        </ChartCardComponent>
                    </div>
                </div>

                {/* Active Shipments Table */}
                <div className="animate-in transition-all" style={{ animationDelay: '0.4s' }}>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-base md:text-lg font-display font-semibold text-slate-700">Live Tracking</h2>
                        {!isMobile && (
                            <Button variant="ghost" size="sm" onClick={() => navigate('/transporter/shipments')}>View All</Button>
                        )}
                    </div>
                    <div className={isMobile ? 'overflow-x-auto' : ''}>
                        <DataTable
                            columns={columns}
                            data={activeShipments}
                            onRowClick={(row) => navigate(`/transporter/shipment/${row.id}`)}
                        />
                    </div>
                </div>

                {/* Mobile FAB */}
                {isMobile && (
                    <button
                        onClick={() => navigate('/transporter/new-shipment')}
                        className="fixed bottom-20 right-4 z-40 w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-2xl shadow-blue-500/50 flex items-center justify-center hover:scale-110 transition-transform active:scale-95"
                    >
                        <Plus size={24} strokeWidth={2.5} />
                    </button>
                )}
            </div>
        </DashboardLayout>
    );
};

export default TransporterDashboard;