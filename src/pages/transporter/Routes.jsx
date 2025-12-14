import React from 'react';
import { MapPin, TrendingUp, Clock, Navigation } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import useMediaQuery from '../../utils/useMediaQuery';

// Route data
const routes = [
    { id: 1, origin: 'Mumbai', destination: 'Delhi', distance: '1,420 km', avgTime: '18-20 hrs', frequency: 45, efficiency: 94 },
    { id: 2, origin: 'Pune', destination: 'Bangalore', distance: '840 km', avgTime: '12-14 hrs', frequency: 38, efficiency: 92 },
    { id: 3, origin: 'Delhi', destination: 'Jaipur', distance: '280 km', avgTime: '4-5 hrs', frequency: 52, efficiency: 96 },
    { id: 4, origin: 'Mumbai', destination: 'Surat', distance: '265 km', avgTime: '4-5 hrs', frequency: 41, efficiency: 95 },
    { id: 5, origin: 'Bangalore', destination: 'Chennai', distance: '350 km', avgTime: '6-7 hrs', frequency: 35, efficiency: 91 },
    { id: 6, origin: 'Hyderabad', destination: 'Vijayawada', distance: '275 km', avgTime: '5-6 hrs', frequency: 28, efficiency: 89 },
    { id: 7, origin: 'Kolkata', destination: 'Bhubaneswar', distance: '445 km', avgTime: '7-8 hrs', frequency: 22, efficiency: 87 },
    { id: 8, origin: 'Chennai', destination: 'Coimbatore', distance: '505 km', avgTime: '8-9 hrs', frequency: 31, efficiency: 90 }
];

const Routes = () => {
    const isMobile = useMediaQuery('(max-width: 768px)');

    return (
        <DashboardLayout role="transporter">
            <div className="space-y-6">
                {/* Header */}
                <div className="animate-in">
                    <h1 className="text-xl md:text-2xl font-display font-bold text-slate-800">Routes & Analytics</h1>
                    <p className="text-sm md:text-base text-slate-500">Overview of your most frequented delivery routes</p>
                </div>

                {/* Summary Cards */}
                <div className={`grid ${isMobile ? 'grid-cols-2 gap-3' : 'grid-cols-4 gap-6'} animate-in`} style={{ animationDelay: '0.1s' }}>
                    <div className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-2 text-slate-600 mb-2">
                            <Navigation size={18} />
                            <span className="text-xs font-medium">Total Routes</span>
                        </div>
                        <p className="text-2xl font-bold text-slate-800">{routes.length}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-2 text-slate-600 mb-2">
                            <TrendingUp size={18} />
                            <span className="text-xs font-medium">Avg Efficiency</span>
                        </div>
                        <p className="text-2xl font-bold text-blue-600">92%</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-2 text-slate-600 mb-2">
                            <Clock size={18} />
                            <span className="text-xs font-medium">Total Trips</span>
                        </div>
                        <p className="text-2xl font-bold text-slate-800">292</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-2 text-slate-600 mb-2">
                            <MapPin size={18} />
                            <span className="text-xs font-medium">Coverage</span>
                        </div>
                        <p className="text-2xl font-bold text-emerald-600">8 States</p>
                    </div>
                </div>

                {/* Routes Grid */}
                <div className="animate-in" style={{ animationDelay: '0.2s' }}>
                    <h2 className="text-base md:text-lg font-display font-semibold text-slate-700 mb-4">Popular Routes</h2>
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
                                        <span className="text-xs font-medium text-slate-500">Route #{route.id}</span>
                                    </div>
                                    <div className={`px-2 py-1 rounded-full text-xs font-semibold ${route.efficiency >= 95 ? 'bg-emerald-100 text-emerald-700' :
                                        route.efficiency >= 90 ? 'bg-blue-100 text-blue-700' :
                                            'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {route.efficiency}% Efficient
                                    </div>
                                </div>

                                {/* Origin → Destination */}
                                <div className="mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1">
                                            <p className="text-xs text-slate-500 mb-1">Origin</p>
                                            <p className="font-semibold text-slate-800">{route.origin}</p>
                                        </div>
                                        <div className="flex-shrink-0">
                                            <Navigation size={20} className="text-slate-400 rotate-90" />
                                        </div>
                                        <div className="flex-1 text-right">
                                            <p className="text-xs text-slate-500 mb-1">Destination</p>
                                            <p className="font-semibold text-slate-800">{route.destination}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-100">
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">Distance</p>
                                        <p className="text-sm font-semibold text-slate-700">{route.distance}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">Avg Time</p>
                                        <p className="text-sm font-semibold text-slate-700">{route.avgTime}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">Trips/mo</p>
                                        <p className="text-sm font-semibold text-blue-600">{route.frequency}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Routes;
