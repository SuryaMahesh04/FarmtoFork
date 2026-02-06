import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, CheckCircle2, Navigation, Activity, Plus, Search, Filter } from 'lucide-react';
import {
    PieChart, Pie, Cell, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer
} from 'recharts';
import DashboardLayout from '../../components/layout/DashboardLayout';
import MetricCard from '../../components/ui/MetricCard';
import MobileMetricCard from '../../components/ui/MobileMetricCard';
import ChartCard from '../../components/ui/ChartCard';
import MobileChartCard from '../../components/ui/MobileChartCard';
import DataTable from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';
import Button from '../../components/ui/Button';
import { chartTheme } from '../../utils/chartConfig';
import useMediaQuery from '../../utils/useMediaQuery';
import AddVehicleModal from '../../components/transporter/AddVehicleModal';
import AddShipmentModal from '../../components/transporter/AddShipmentModal';
import { vehicleStore } from '../../utils/vehicleStore';
import { shipmentStore } from '../../utils/shipmentStore';
import { authHelpers } from '../../utils/api';

const TransporterDashboard = () => {
    const navigate = useNavigate();
    const isMobile = useMediaQuery('(max-width: 768px)');
    const user = authHelpers.getUser();
    const profile = user?.profile || {};
    
    // Modals
    const [isAddVehicleModalOpen, setIsAddVehicleModalOpen] = useState(false);
    const [isAddShipmentModalOpen, setIsAddShipmentModalOpen] = useState(false);

    // Search State
    const [dashboardSearch, setDashboardSearch] = useState('');

    // State for dashboard data
    const [stats, setStats] = useState({
        totalFleet: 0,
        completedShipments: 0,
        totalDistance: 12500, // Mock initial state
        efficiency: 92
    });

    const [recentShipments, setRecentShipments] = useState([]);
    const [monthlyData, setMonthlyData] = useState([]);
    const [utilizationData, setUtilizationData] = useState([]);

    // Refresh Data Function
    const refreshDashboardData = () => {
        const vehicles = vehicleStore.getAll();
        const shipments = shipmentStore.getAll();

        // 1. Calculate Basic Stats
        const completed = shipments.filter(s => s.status === 'Delivered').length;
        const active = shipments.filter(s => ['On Route', 'In Transit'].includes(s.status)).length;
        const fleetSize = vehicles.length;
        
        // Mock Calculations for demo purposes
        const estimatedDistance = completed * 150 + 12000; 
        const calculatedEfficiency = 90 + (Math.random() * 5);

        setStats({
            totalFleet: fleetSize,
            completedShipments: completed,
            totalDistance: estimatedDistance,
            efficiency: Math.floor(calculatedEfficiency)
        });

        // 2. Recent Shipments for Table
        const recent = shipments
            .slice(0, 5)
            .map(s => ({
                id: s.id,
                origin: s.origin,
                destination: s.destination,
                cargo: s.cargo,
                status: s.status
            }));
        setRecentShipments(recent);

        // 3. Monthly Analytics (Mocked)
        const mockRouteAnalytics = [
            { name: 'Jul', value: 2400 },
            { name: 'Aug', value: 2700 },
            { name: 'Sep', value: 3100 },
            { name: 'Oct', value: 2900 },
            { name: 'Nov', value: 3400 },
            { name: 'Dec', value: 3600 },
        ];
        setMonthlyData(mockRouteAnalytics);

        // 4. Vehicle Utilization (Mocked based on real data)
        const maintenance = vehicles.filter(v => v.status === 'MAINTENANCE').length;
        const onRoute = vehicles.filter(v => v.status === 'ON ROUTE').length;
        const available = vehicles.filter(v => v.status === 'AVAILABLE').length;

        setUtilizationData([
            { name: 'On Route', value: onRoute || 5, color: '#4ade80' }, // Green
            { name: 'Available', value: available || 7, color: '#bae6fd' }, // Light Blue
            { name: 'Maintenance', value: maintenance || 3, color: '#fde68a' } // Beige
        ]);
    };

    // Initial Load
    useEffect(() => {
        refreshDashboardData();
    }, []);

    const handleAddVehicle = (newVehicle) => {
        vehicleStore.add(newVehicle);
        refreshDashboardData();
    };

    const handleAddShipment = (newShipment) => {
        shipmentStore.add(newShipment);
        refreshDashboardData();
    };

    // Filter Logic
    const filteredRecent = recentShipments.filter(s => 
        (s.id?.toLowerCase() || '').includes(dashboardSearch.toLowerCase()) ||
        (s.origin?.toLowerCase() || '').includes(dashboardSearch.toLowerCase()) ||
        (s.destination?.toLowerCase() || '').includes(dashboardSearch.toLowerCase()) ||
        (s.cargo?.toLowerCase() || '').includes(dashboardSearch.toLowerCase())
    );

    const columns = [
        { header: 'ID', accessor: 'id' },
        { header: 'Origin', accessor: 'origin' },
        { header: 'Destination', accessor: 'destination' },
        { header: 'Cargo', accessor: 'cargo' },
        { header: 'Status', accessor: 'status', render: (row) => <StatusBadge status={row.status} /> },
    ];

    const ChartCardComponent = isMobile ? MobileChartCard : ChartCard;
    const chartHeight = isMobile ? 220 : 300;

    return (
        <DashboardLayout role="transporter">
            <div className={`space-y-6 ${isMobile ? 'pb-20' : ''}`}>
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-in">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <div className="p-2 bg-emerald-600 rounded-lg shadow-emerald-200 shadow-lg">
                                <Truck className="text-white" size={24} />
                            </div>
                            <h1 className="text-2xl font-display font-bold text-slate-800">
                                {profile.companyName || 'ABC Logistics'}
                            </h1>
                        </div>
                        <p className="text-slate-500 ml-14">Real-time tracking and fleet management</p>
                    </div>
                    
                    <div className="flex gap-3 w-full md:w-auto">
                        <Button 
                            className="bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white flex-1 md:flex-none justify-center shadow-lg shadow-emerald-600/30 hover:shadow-emerald-600/50 transition-all duration-200 active:scale-95"
                            icon={Plus}
                            onClick={() => setIsAddVehicleModalOpen(true)} 
                        >
                            Add Vehicle
                        </Button>
                        <Button 
                            className="bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white flex-1 md:flex-none justify-center shadow-lg shadow-emerald-600/30 hover:shadow-emerald-600/50 transition-all duration-200 active:scale-95"
                            icon={Plus}
                            onClick={() => setIsAddShipmentModalOpen(true)}
                        >
                            New Shipment
                        </Button>
                    </div>
                </div>

                {/* Metrics Grid */}
                <div className={`grid ${isMobile ? 'grid-cols-1 gap-3' : 'grid-cols-2 lg:grid-cols-4 gap-6'}`}>
                    {isMobile ? (
                        <>
                            <MobileMetricCard title="TOTAL FLEET SIZE" value={stats.totalFleet} icon={Truck} color="emerald" delay={0.1} />
                            <MobileMetricCard title="COMPLETED" value={stats.completedShipments} icon={CheckCircle2} trend={15} color="blue" delay={0.2} />
                            <MobileMetricCard title="TOTAL DISTANCE" value={stats.totalDistance.toLocaleString()} icon={Navigation} trend={8} color="amber" delay={0.3} />
                            <MobileMetricCard title="FLEET EFFICIENCY" value={stats.efficiency} unit="%" icon={Activity} trend={-1} color="rose" delay={0.4} />
                        </>
                    ) : (
                        <>
                            <MetricCard 
                                title="TOTAL FLEET SIZE" 
                                value={stats.totalFleet} 
                                icon={Truck} 
                                color="emerald" 
                                delay={0.1} 
                            />
                            <MetricCard 
                                title="COMPLETED" 
                                value={stats.completedShipments} 
                                icon={CheckCircle2} 
                                trend={15} 
                                color="blue" 
                                delay={0.2} 
                            />
                            <MetricCard 
                                title="TOTAL DISTANCE" 
                                value={stats.totalDistance.toLocaleString()} 
                                icon={Navigation} 
                                trend={8} 
                                color="amber" 
                                delay={0.3} 
                            />
                            <MetricCard 
                                title="FLEET EFFICIENCY" 
                                value={stats.efficiency} 
                                unit="%" 
                                icon={Activity} 
                                trend={-1} 
                                color="rose" 
                                delay={0.4} 
                            />
                        </>
                    )}
                </div>

                {/* Charts Section */}
                <div className={isMobile ? 'space-y-4' : 'grid grid-cols-1 lg:grid-cols-3 gap-6'}>
                    {/* Route Analytics (Area Chart) */}
                    <div className={isMobile ? 'space-y-4' : 'lg:col-span-2 space-y-6 animate-in'} style={{ animationDelay: '0.2s' }}>
                        <ChartCardComponent 
                            title="Route Analytics" 
                            subtitle="Deliveries & Distance Covered" 
                            height={chartHeight}
                        >
                            <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorRoute" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" {...chartTheme.axis} />
                                <YAxis {...chartTheme.axis} />
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <Tooltip {...chartTheme.tooltip} />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#10b981" // Emerald 500
                                    strokeWidth={2}
                                    strokeDasharray="5 5" // Dashed line style
                                    fillOpacity={1}
                                    fill="url(#colorRoute)"
                                    name="Distance"
                                />
                            </AreaChart>
                        </ChartCardComponent>
                    </div>

                    {/* Vehicle Utilization (Donut Chart) */}
                    <div className="animate-in" style={{ animationDelay: '0.3s' }}>
                        <ChartCardComponent 
                            title="Vehicle Utilization" 
                            subtitle="Fleet status distribution" 
                            height={isMobile ? 250 : 300}
                        >
                            <div className="relative flex justify-center items-center h-full">
                                <PieChart width={isMobile ? 250 : 200} height={isMobile ? 250 : 200}>
                                    <Pie
                                        data={utilizationData}
                                        innerRadius={isMobile ? 60 : 60}
                                        outerRadius={isMobile ? 80 : 80}
                                        paddingAngle={0}
                                        dataKey="value"
                                        startAngle={90}
                                        endAngle={-270}
                                    >
                                        {utilizationData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                                        ))}
                                    </Pie>
                                    <Tooltip {...chartTheme.tooltip} />
                                </PieChart>
                            </div>
                            
                            <div className="flex justify-center gap-4 mt-2">
                                {utilizationData.map(d => (
                                    <div key={d.name} className="flex items-center gap-2 text-xs text-slate-500">
                                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }}></span>
                                        {d.name}
                                    </div>
                                ))}
                            </div>
                        </ChartCardComponent>
                    </div>
                </div>

                {/* Recent Shipments Table with Search Toolbar */}
                <div className="animate-in" style={{ animationDelay: '0.4s' }}>
                    
                    <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-6 gap-4">
                        <h2 className="text-xl font-display font-bold text-slate-800">Recent Shipments</h2>
                    </div>

                    {/* Toolbar */}
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-4 flex flex-col md:flex-row gap-4 justify-between items-center">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-2.5 text-slate-400" size={20} />
                            <input 
                                type="text"
                                placeholder="Search..."
                                value={dashboardSearch}
                                onChange={(e) => setDashboardSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                            />
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-all shadow-sm">
                            <Filter size={18} />
                            Filter
                        </button>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className={isMobile ? 'overflow-x-auto' : ''}>
                            <DataTable
                                columns={columns}
                                data={filteredRecent}
                                onRowClick={() => navigate('/transporter/shipments')}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <AddVehicleModal 
                isOpen={isAddVehicleModalOpen} 
                onClose={() => setIsAddVehicleModalOpen(false)} 
                onAdd={handleAddVehicle} 
            />
            
            <AddShipmentModal
                isOpen={isAddShipmentModalOpen}
                onClose={() => setIsAddShipmentModalOpen(false)}
                onAdd={handleAddShipment}
            />
        </DashboardLayout>
    );
};

export default TransporterDashboard;