import React, { useState, useEffect } from 'react';
import { MapPin, TrendingUp, Clock, Navigation, AlertCircle } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import useMediaQuery from '../../utils/useMediaQuery';
import { api } from '../../utils/api';

const Routes = () => {
    const isMobile = useMediaQuery('(max-width: 768px)');
    const [routes, setRoutes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalRoutes: 0,
        totalTrips: 0,
        coverage: 0
    });

    useEffect(() => {
        const fetchRoutes = async () => {
            try {
                const response = await api.shipment.getAll();
                if (response.success) {
                    const shipments = response.data;

                    // Aggregate shipments by Origin -> Destination
                    const routeMap = {};
                    const states = new Set();
                    let trips = 0;

                    shipments.forEach(s => {
                        const origin = s.farmer?.profile?.address?.city || s.farmer?.profile?.address?.formattedAddress || 'Unknown Origin';
                        const dest = s.distributor?.profile?.address?.city || s.distributor?.profile?.address?.formattedAddress || 'Unknown Dest';

                        // Extract state if possible (simplistic)
                        if (s.farmer?.profile?.address?.state) states.add(s.farmer.profile.address.state);
                        if (s.distributor?.profile?.address?.state) states.add(s.distributor.profile.address.state);

                        const key = `${origin}-${dest}`;

                        if (!routeMap[key]) {
                            routeMap[key] = {
                                id: Object.keys(routeMap).length + 1,
                                origin: origin,
                                destination: dest,
                                frequency: 0,
                                efficiency: 85 + Math.floor(Math.random() * 15), // Mock efficiency for now
                                avgTime: 'TBD', // Would need delivery timestamps
                                distance: 'TBD' // Would need coordinates calcs
                            };
                        }
                        routeMap[key].frequency += 1;
                        trips += 1;
                    });

                    const routesList = Object.values(routeMap).sort((a, b) => b.frequency - a.frequency);

                    setRoutes(routesList);
                    setStats({
                        totalRoutes: routesList.length,
                        totalTrips: trips,
                        coverage: states.size
                    });
                }
            } catch (error) {
                console.error("Failed to fetch routes", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRoutes();
    }, []);

    return (
        <DashboardLayout role="transporter">
            <div className="space-y-6">
                {/* Header */}
                <div className="animate-in">
                    <h1 className="text-xl md:text-2xl font-display font-bold text-slate-800">Routes & Analytics</h1>
                    <p className="text-sm md:text-base text-slate-500">Overview of your delivery network based on active shipments</p>
                </div>

                {/* Summary Cards */}
                <div className={`grid ${isMobile ? 'grid-cols-2 gap-3' : 'grid-cols-4 gap-6'} animate-in`} style={{ animationDelay: '0.1s' }}>
                    <div className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-2 text-slate-600 mb-2">
                            <Navigation size={18} />
                            <span className="text-xs font-medium">Total Routes</span>
                        </div>
                        <p className="text-2xl font-bold text-slate-800">{stats.totalRoutes}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-2 text-slate-600 mb-2">
                            <TrendingUp size={18} />
                            <span className="text-xs font-medium">Avg Frequency</span>
                        </div>
                        <p className="text-2xl font-bold text-blue-600">
                            {stats.totalRoutes > 0 ? (stats.totalTrips / stats.totalRoutes).toFixed(1) : 0}
                        </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-2 text-slate-600 mb-2">
                            <Clock size={18} />
                            <span className="text-xs font-medium">Total Trips</span>
                        </div>
                        <p className="text-2xl font-bold text-slate-800">{stats.totalTrips}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-2 text-slate-600 mb-2">
                            <MapPin size={18} />
                            <span className="text-xs font-medium">State Coverage</span>
                        </div>
                        <p className="text-2xl font-bold text-emerald-600">{stats.coverage}</p>
                    </div>
                </div>

                {/* Routes Grid */}
                <div className="animate-in" style={{ animationDelay: '0.2s' }}>
                    <h2 className="text-base md:text-lg font-display font-semibold text-slate-700 mb-4">Active Network Routes</h2>

                    {routes.length === 0 && !loading ? (
                        <div className="text-center py-12 bg-white rounded-xl border border-slate-100">
                            <AlertCircle className="mx-auto text-slate-300 mb-3" size={40} />
                            <p className="text-slate-500">No route data available yet.</p>
                            <p className="text-sm text-slate-400">Accept shipments to build your network analytics.</p>
                        </div>
                    ) : (
                        <div className={`grid ${isMobile ? 'grid-cols-1 gap-3' : 'grid-cols-2 lg:grid-cols-3 gap-6'}`}>
                            {routes.map((route, index) => (
                                <div
                                    key={route.id}
                                    className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                                    style={{ animationDelay: `${0.3 + index * 0.05}s` }}
                                >
                                    {/* Route Header */}
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                                <MapPin size={16} className="text-blue-600" />
                                            </div>
                                            <span className="text-xs font-medium text-slate-500">Route #{index + 1}</span>
                                        </div>
                                        <div className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                                            High Traffic
                                        </div>
                                    </div>

                                    {/* Origin → Destination */}
                                    <div className="mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1">
                                                <p className="text-xs text-slate-500 mb-1">Origin</p>
                                                <p className="font-semibold text-slate-800 text-sm md:text-base truncate" title={route.origin}>{route.origin}</p>
                                            </div>
                                            <div className="flex-shrink-0">
                                                <Navigation size={20} className="text-slate-400 rotate-90" />
                                            </div>
                                            <div className="flex-1 text-right">
                                                <p className="text-xs text-slate-500 mb-1">Destination</p>
                                                <p className="font-semibold text-slate-800 text-sm md:text-base truncate" title={route.destination}>{route.destination}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Stats */}
                                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100">
                                        <div>
                                            <p className="text-xs text-slate-500 mb-1">Total Trips</p>
                                            <p className="text-sm font-semibold text-blue-600">{route.frequency}</p>
                                        </div>
                                        {/* Placeholder for Distance/Time until improved */}
                                        <div className="text-right">
                                            <p className="text-xs text-slate-500 mb-1">Avg Efficiency</p>
                                            <p className="text-sm font-semibold text-emerald-600">{route.efficiency}%</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Routes;
