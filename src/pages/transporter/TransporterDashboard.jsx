import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, CheckCircle2, Navigation, Activity, Plus, Search, Filter, Users } from 'lucide-react';
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
import { api, authHelpers } from '../../utils/api';

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
    const [loading, setLoading] = useState(true);

    // State for dashboard data
    const [stats, setStats] = useState({
        totalFleet: 0,
        completedShipments: 0,
        activeShipments: 0,
        totalDrivers: 0
    });

    const [recentShipments, setRecentShipments] = useState([]);
    const [monthlyData, setMonthlyData] = useState([]);
    const [utilizationData, setUtilizationData] = useState([]);

    // Fetch Dashboard Data from API
    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const response = await api.transporter.getStats();
            if (response.success) {
                const { stats, utilizationData, monthlyData, recentShipments } = response.data;
                setStats(stats);
                setUtilizationData(utilizationData);
                setMonthlyData(monthlyData);
                setRecentShipments(recentShipments);
            }
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Initial Load
    useEffect(() => {
        fetchDashboardData();
    }, []);

    const handleAddVehicle = (newVehicle) => {
        // vehicleStore logic or just re-fetch
        fetchDashboardData();
    };

    const handleAddShipment = (newShipment) => {
        // shipmentStore logic or just re-fetch
        fetchDashboardData();
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
                {loading && (
                    <div className="fixed inset-0 bg-white/60 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
                        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-slate-600 font-medium animate-pulse">Syncing Global Fleet Data...</p>
                    </div>
                )}

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-in">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <div className="p-2 bg-emerald-600 rounded-lg shadow-emerald-200 shadow-lg">
                                <Truck className="text-white" size={24} />
                            </div>
                            <h1 className="text-xl md:text-2xl font-display font-bold text-slate-800">
                                {profile.companyName || 'ABC Logistics'}
                            </h1>
                        </div>
                        <p className="text-sm md:text-base text-slate-500 ml-14">Real-time tracking and fleet management</p>
                    </div>

                    {!isMobile && (
                        <div className="flex gap-3">
                            <Button
                                className="bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-lg shadow-emerald-600/30 hover:shadow-emerald-600/50 transition-all duration-200 active:scale-95"
                                icon={Plus}
                                onClick={() => setIsAddVehicleModalOpen(true)}
                            >
                                Add Vehicle
                            </Button>
                            <Button
                                className="bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-lg shadow-emerald-600/30 hover:shadow-emerald-600/50 transition-all duration-200 active:scale-95"
                                icon={Plus}
                                onClick={() => setIsAddShipmentModalOpen(true)}
                            >
                                New Shipment
                            </Button>
                        </div>
                    )}
                </div>

                {/* Metrics Grid */}
                <div className={`grid ${isMobile ? 'grid-cols-1 gap-3' : 'grid-cols-2 lg:grid-cols-4 gap-6'}`}>
                    {isMobile ? (
                        <>
                            <MobileMetricCard title="TOTAL FLEET" value={stats.totalFleet} icon={Truck} color="emerald" delay={0.1} />
                            <MobileMetricCard title="ACTIVE SHIPMENTS" value={stats.activeShipments} icon={Activity} color="orange" delay={0.2} />
                            <MobileMetricCard title="COMPLETED" value={stats.completedShipments} icon={CheckCircle2} color="blue" delay={0.3} />
                            <MobileMetricCard title="REGISTERED DRIVERS" value={stats.totalDrivers} icon={Users} color="indigo" delay={0.4} />
                        </>
                    ) : (
                        <>
                            <MetricCard
                                title="TOTAL FLEET"
                                value={stats.totalFleet}
                                icon={Truck}
                                color="emerald"
                                delay={0.1}
                            />
                            <MetricCard
                                title="ACTIVE SHIPMENTS"
                                value={stats.activeShipments}
                                icon={Activity}
                                color="orange"
                                delay={0.2}
                            />
                            <MetricCard
                                title="COMPLETED"
                                value={stats.completedShipments}
                                icon={CheckCircle2}
                                color="blue"
                                delay={0.3}
                            />
                            <MetricCard
                                title="REGISTERED DRIVERS"
                                value={stats.totalDrivers}
                                icon={Users}
                                color="indigo"
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
                                <XAxis dataKey="name" {...chartTheme.axis} tick={{ fontSize: isMobile ? 10 : 12 }} />
                                <YAxis {...chartTheme.axis} tick={{ fontSize: isMobile ? 10 : 12 }} />
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <Tooltip {...chartTheme.tooltip} />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#10b981" 
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill="url(#colorRoute)"
                                    name="Shipments"
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
                            <PieChart>
                                <Pie
                                    data={utilizationData}
                                    innerRadius={isMobile ? 50 : 60}
                                    outerRadius={isMobile ? 70 : 80}
                                    paddingAngle={5}
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
                        <h2 className="text-lg md:text-xl font-display font-bold text-slate-800">Recent Shipments</h2>
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
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-all shadow-sm w-full md:w-auto justify-center">
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

                {/* Mobile FAB */}
                {isMobile && (
                    <div className="fixed bottom-20 right-4 z-40 flex flex-col gap-3 items-end">
                        {/* Expandable Menu Logic could go here, for now simple stack or just primary action */}
                        <button
                            onClick={() => setIsAddShipmentModalOpen(true)}
                            className="w-12 h-12 rounded-full bg-white text-emerald-600 shadow-lg border border-emerald-100 flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
                        >
                            <Navigation size={20} />
                        </button>
                        <button
                            onClick={() => setIsAddVehicleModalOpen(true)}
                            className="w-14 h-14 rounded-full bg-emerald-600 text-white shadow-xl shadow-emerald-500/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
                        >
                            <Plus size={28} />
                        </button>
                    </div>
                )}
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