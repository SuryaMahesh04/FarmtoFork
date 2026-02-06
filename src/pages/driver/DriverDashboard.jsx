import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, Package, MapPin, Phone, LogOut, CheckCircle } from 'lucide-react';
import { authHelpers } from '../../utils/api';
// import { api } from '../../utils/api'; // Use for real data

const DriverDashboard = () => {
    const navigate = useNavigate();
    const user = authHelpers.getUser();
    const driverName = user?.profile?.fullName || 'Driver';

    const handleLogout = () => {
        authHelpers.logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Header */}
            <header className="bg-emerald-600 text-white p-6 rounded-b-[2.5rem] shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-xl"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-5 -mb-5 blur-xl"></div>
                
                <div className="relative z-10 flex justify-between items-start">
                    <div>
                        <p className="text-emerald-100 text-sm font-medium mb-1">Welcome back,</p>
                        <h1 className="text-2xl font-bold">{driverName}</h1>
                        <p className="text-xs text-emerald-200 mt-1">Ready for today's deliveries?</p>
                    </div>
                    <button 
                        onClick={handleLogout}
                        className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors backdrop-blur-sm"
                    >
                        <LogOut size={20} />
                    </button>
                </div>

                {/* Quick Stats */}
                <div className="flex gap-4 mt-6">
                    <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                        <div className="text-2xl font-bold">3</div>
                        <div className="text-xs text-emerald-100">Assigned</div>
                    </div>
                    <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                        <div className="text-2xl font-bold">12</div>
                        <div className="text-xs text-emerald-100">Completed</div>
                    </div>
                </div>
            </header>

            <div className="p-6 space-y-6">
                {/* Assigned Vehicle Card */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 relative overflow-hidden">
                     <div className="absolute right-0 top-0 w-24 h-full bg-gradient-to-l from-emerald-50 to-transparent"></div>
                    <div className="flex items-center gap-4 mb-4 relative z-10">
                        <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
                            <Truck size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800">Assigned Vehicle</h3>
                            <p className="text-sm text-slate-500">Tata 407 • KA-05-MJ-1234</p>
                        </div>
                    </div>
                    <div className="flex gap-2 relative z-10">
                        <button 
                            className="flex-1 py-2 text-sm font-medium text-emerald-700 bg-emerald-50 rounded-lg border border-emerald-100 hover:bg-emerald-100 transition-colors"
                            onClick={() => navigate('/driver/vehicle')}
                        >
                            View Details
                        </button>
                    </div>
                </div>

                {/* Current Shipment */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-slate-800">Current Trip</h3>
                        <span className="px-2.5 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full border border-blue-100">
                            IN TRANSIT
                        </span>
                    </div>

                    <div className="space-y-4 relative">
                        {/* Timeline Line */}
                        <div className="absolute left-[19px] top-2 bottom-8 w-0.5 bg-slate-200 border-l border-dashed border-slate-300"></div>

                        <div className="flex gap-4 relative z-10">
                            <div className="w-10 h-10 rounded-full bg-emerald-100 border-4 border-white shadow-sm flex items-center justify-center text-emerald-600 shrink-0">
                                <MapPin size={18} />
                            </div>
                            <div>
                                <p className="text-xs text-slate-400">Pickup</p>
                                <p className="font-semibold text-slate-800">Kolar Farms, Karnataka</p>
                                <p className="text-xs text-slate-500">10:30 AM • Completed</p>
                            </div>
                        </div>

                        <div className="flex gap-4 relative z-10">
                            <div className="w-10 h-10 rounded-full bg-white border-4 border-slate-100 shadow-sm flex items-center justify-center text-slate-400 shrink-0">
                                <MapPin size={18} />
                            </div>
                            <div>
                                <p className="text-xs text-slate-400">Dropoff</p>
                                <p className="font-semibold text-slate-800">Fresh Mart, Bangalore</p>
                                <p className="text-xs text-emerald-600 font-medium">Est: 2:30 PM</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-5 pt-4 border-t border-slate-100 flex justify-between items-center">
                        <div className="text-sm">
                             <p className="text-slate-500">Cargo</p>
                             <p className="font-medium text-slate-800">Tomatoes • 500kg</p>
                        </div>
                        <button 
                            className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg shadow-emerald-200 active:scale-95 transition-all"
                            onClick={() => navigate('/driver/shipments')}
                        >
                            Update Status
                        </button>
                    </div>
                </div>

                {/* Upcoming Tasks */}
                <div>
                     <h3 className="font-bold text-slate-800 mb-3 px-1">Upcoming</h3>
                     <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm flex items-center gap-4 opacity-60">
                         <div className="p-2 bg-slate-100 rounded-lg text-slate-400">
                             <Package size={20} />
                         </div>
                         <div>
                             <p className="font-medium text-slate-700">Next Assignment</p>
                             <p className="text-xs text-slate-500">Waiting for allocation...</p>
                         </div>
                     </div>
                </div>
            </div>
            
            {/* Bottom Nav (Mobile Only) */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-3 flex justify-between items-center z-40 md:hidden">
                <button className="flex flex-col items-center gap-1 text-emerald-600">
                    <CheckCircle size={24} />
                    <span className="text-[10px] font-medium">Home</span>
                </button>
                <button 
                    className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600"
                    onClick={() => navigate('/driver/vehicle')}
                >
                    <Truck size={24} />
                    <span className="text-[10px] font-medium">Vehicle</span>
                </button>
                <button 
                    className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600"
                    onClick={() => navigate('/driver/shipments')}
                >
                    <Package size={24} />
                    <span className="text-[10px] font-medium">Trips</span>
                </button>
            </div>
        </div>
    );
};

export default DriverDashboard;
