import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, Navigation, CheckCircle2, Activity, Package, Clock } from 'lucide-react';
import {
    PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, ResponsiveContainer,
    AreaChart, Area, CartesianGrid
} from 'recharts';
import DashboardLayout from '../../components/layout/DashboardLayout';
import MetricCard from '../../components/ui/MetricCard';
import Button from '../../components/ui/Button';
import MobileMetricCard from '../../components/ui/MobileMetricCard';
import DataTable from '../../components/ui/DataTable';
import ChartCard from '../../components/ui/ChartCard';
import MobileChartCard from '../../components/ui/MobileChartCard';
import StatusBadge from '../../components/ui/StatusBadge';
import { chartTheme } from '../../utils/chartConfig';
import useMediaQuery from '../../utils/useMediaQuery';
import { authHelpers, api } from '../../utils/api';

const TransporterDashboard = () => {
    const navigate = useNavigate();
    const isMobile = useMediaQuery('(max-width: 768px)');
    const user = authHelpers.getUser();
    const profile = user?.profile || {};

    // State for dashboard data
    const [stats, setStats] = useState({
        totalShipments: 0,
        activeShipments: 0,
        completedShipments: 0,
        pendingRequests: 0
    });

    const [recentShipments, setRecentShipments] = useState([]);
    const [monthlyData, setMonthlyData] = useState([]);
    const [statusData, setStatusData] = useState([]);

    // Fleet Size from profile -> Utilization Logic
    const fleetSize = Number(profile.fleetSize) || 25;
    const [utilizationData, setUtilizationData] = useState([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await api.shipment.getAll();
                if (response.success) {
                    const allShipments = response.data;

                    // 1. Calculate Basic Stats
                    const completed = allShipments.filter(s => s.status === 'delivered').length;
                    const active = allShipments.filter(s => ['accepted', 'at_pickup', 'picked_up', 'in_transit'].includes(s.status)).length;
                    const pending = allShipments.filter(s => s.status === 'pending').length;

                    setStats({
                        totalShipments: allShipments.length,
                        activeShipments: active,
                        completedShipments: completed,
                        pendingRequests: pending
                    });

                    // 2. Recent Shipments for Table
                    const recent = allShipments
                        .slice(0, 5)
                        .map(s => ({
                            id: s.shipmentId,
                            _id: s._id,
                            origin: s.farmer?.profile?.address?.city || s.farmer?.profile?.address?.formattedAddress || 'Origin Pending',
                            destination: s.distributor?.profile?.address?.city || s.distributor?.profile?.address?.formattedAddress || 'Destination Pending',
                            cargo: `${s.batch?.crop || 'Crop'}`,
                            vehicle: 'Not Assigned',
                            eta: 'TBD',
                            status: s.status
                        }));
                    setRecentShipments(recent);

                    // 3. Monthly Analytics (Group by Creation Month)
                    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                    const monthlyCounts = {};
                    allShipments.forEach(s => {
                        const date = new Date(s.createdAt);
                        const month = months[date.getMonth()];
                        monthlyCounts[month] = (monthlyCounts[month] || 0) + 1;
                    });

                    // Generate last 6 months data for chart
                    const currentMonthIdx = new Date().getMonth();
                    const chartData = [];
                    for (let i = 5; i >= 0; i--) {
                        const idx = (currentMonthIdx - i + 12) % 12;
                        const monthName = months[idx];
                        chartData.push({
                            month: monthName,
                            deliveries: monthlyCounts[monthName] || 0
                        });
                    }
                    setMonthlyData(chartData);

                    // 4. Status Distribution Data
                    const statusCounts = allShipments.reduce((acc, curr) => {
                        acc[curr.status] = (acc[curr.status] || 0) + 1;
                        return acc;
                    }, {});

                    const statusChartData = [
                        { name: 'Pending', count: statusCounts['pending'] || 0, fill: '#FFA500' },
                        { name: 'Active', count: active, fill: '#3b82f6' },
                        { name: 'Delivered', count: statusCounts['delivered'] || 0, fill: '#10b981' },
                        { name: 'Rejected', count: statusCounts['rejected'] || 0, fill: '#ef4444' }
                    ];
                    setStatusData(statusChartData);

                    // 5. Fleet Utilization (Real Active vs Available)
                    // Assuming 'Active' shipments use 1 vehicle each
                    const vehiclesInUse = active;
                    const vehiclesAvailable = Math.max(0, fleetSize - vehiclesInUse);

                    setUtilizationData([
                        { name: 'En Route', value: vehiclesInUse, color: '#3b82f6' },
                        { name: 'Available', value: vehiclesAvailable, color: '#10b981' }
                    ]);
                }
            } catch (error) {
                console.error('Failed to fetch dashboard data', error);
            }
        };
        fetchDashboardData();
    }, [fleetSize]);

    const columns = [
        { header: 'Shipment ID', accessor: 'id' },
        { header: 'Origin', accessor: 'origin' },
        { header: 'Destination', accessor: 'destination' },
        { header: 'Cargo', accessor: 'cargo' },
        { header: 'Vehicle', accessor: 'vehicle' },
        { header: 'Status', accessor: 'status', render: (row) => <StatusBadge status={row.status} /> },
    ];

    const ChartCardComponent = isMobile ? MobileChartCard : ChartCard;
    const chartHeight = isMobile ? 220 : 300;

    return (
        <DashboardLayout role="transporter">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-in">
                    <div>
                        <h1 className="text-xl md:text-2xl font-display font-bold text-slate-800">
                            {profile.companyName || 'Fleet'} Command Center 🚚
                        </h1>
                        <p className="text-sm md:text-base text-slate-500">Real-time fleet tracking and analytics</p>
                    </div>
                </div>

                {/* Metrics Grid */}
                <div className={`grid ${isMobile ? 'grid-cols-1 gap-3' : 'grid-cols-2 lg:grid-cols-4 gap-6'}`}>
                    {isMobile ? (
                        <>
                            <MobileMetricCard title="Total Shipments" value={stats.totalShipments} icon={Package} trend={null} color="sage" delay={0.1} />
                            <MobileMetricCard title="Completed" value={stats.completedShipments} icon={CheckCircle2} trend={null} color="sky" delay={0.2} />
                            <MobileMetricCard title="Active Jobs" value={stats.activeShipments} icon={Truck} trend={null} color="wheat" delay={0.3} />
                            <MobileMetricCard title="Pending Requests" value={stats.pendingRequests} icon={Clock} trend={null} color="terra" delay={0.4} />
                        </>
                    ) : (
                        <>
                            <MetricCard title="Total Shipments" value={stats.totalShipments} icon={Package} trend={null} color="sage" delay={0.1} />
                            <MetricCard title="Completed" value={stats.completedShipments} icon={CheckCircle2} trend={null} color="sky" delay={0.2} />
                            <MetricCard title="Active Jobs" value={stats.activeShipments} icon={Truck} trend={null} color="wheat" delay={0.3} />
                            <MetricCard title="Pending Requests" value={stats.pendingRequests} icon={Clock} trend={null} color="terra" delay={0.4} />
                        </>
                    )}
                </div>

                {/* Charts Section */}
                <div className={isMobile ? 'space-y-4' : 'grid grid-cols-1 lg:grid-cols-3 gap-6'}>
                    {/* Main Chart: Monthly Volume */}
                    <div className={isMobile ? 'space-y-4' : 'lg:col-span-2 space-y-6 animate-in'}>
                        <ChartCardComponent title="Shipment Volume" subtitle="Monthly delivery performance" height={chartHeight}>
                            <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorDeliveries" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={chartTheme.colors.sky[1]} stopOpacity={0.8} />
                                        <stop offset="95%" stopColor={chartTheme.colors.sky[1]} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="month" {...chartTheme.axis} />
                                <YAxis {...chartTheme.axis} allowDecimals={false} />
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <Tooltip {...chartTheme.tooltip} />
                                <Area
                                    type="monotone"
                                    dataKey="deliveries"
                                    stroke={chartTheme.colors.sky[1]}
                                    fillOpacity={1}
                                    fill="url(#colorDeliveries)"
                                    name="Shipments"
                                />
                            </AreaChart>
                        </ChartCardComponent>

                        <ChartCardComponent title="Shipment Status" subtitle="Current distribution of jobs" height={chartHeight}>
                            <BarChart data={statusData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <XAxis dataKey="name" {...chartTheme.axis} />
                                <YAxis {...chartTheme.axis} allowDecimals={false} />
                                <Tooltip {...chartTheme.tooltip} cursor={{ fill: 'transparent' }} />
                                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ChartCardComponent>
                    </div>

                    {/* Side Chart: Utilization */}
                    <div className="animate-in">
                        <ChartCardComponent title="Fleet Utilization" subtitle={`Based on fleet size of ${fleetSize}`} height={isMobile ? 250 : 300}>
                            <PieChart>
                                <Pie
                                    data={utilizationData}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {utilizationData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                                    ))}
                                </Pie>
                                <Tooltip {...chartTheme.tooltip} />
                            </PieChart>
                            <div className="flex justify-center gap-4 mt-4">
                                {utilizationData.map(d => (
                                    <div key={d.name} className="flex items-center gap-2 text-xs text-slate-500">
                                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }}></span>
                                        {d.name} ({d.value})
                                    </div>
                                ))}
                            </div>
                        </ChartCardComponent>
                    </div>
                </div>

                {/* Recent Shipments Table */}
                <div className="animate-in">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-base md:text-lg font-display font-semibold text-slate-700">Recent Shipments</h2>
                        {!isMobile && (
                            <Button variant="ghost" size="sm" onClick={() => navigate('/transporter/shipments')}>View All</Button>
                        )}
                    </div>
                    <div className={isMobile ? 'overflow-x-auto' : ''}>
                        <DataTable
                            columns={columns}
                            data={recentShipments}
                            onRowClick={(row) => navigate(`/transporter/shipment/${row._id}`)}
                        />
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default TransporterDashboard;