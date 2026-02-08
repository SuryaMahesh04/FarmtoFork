import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, Package, MapPin, Phone, LogOut, CheckCircle, Bell } from 'lucide-react';
import { api, authHelpers } from '../../utils/api';

const DriverDashboard = () => {
    const navigate = useNavigate();
    const [driver, setDriver] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        try {
            // Get user info with populated driver profile
            const res = await api.auth.getMe();

            if (res.success && res.data) {
                const currentUser = res.data;
                authHelpers.saveUser(currentUser);

                // Extract driver profile and vehicle info
                const driverProfile = currentUser.driverProfile;
                const assignedVehicle = driverProfile?.assignedVehicle;

                setDriver({
                    fullName: driverProfile?.fullName || currentUser.profile?.fullName || currentUser.name || 'Driver',
                    status: driverProfile?.status || (currentUser.isActive ? 'Active' : 'Inactive'),
                    assignedVehicle: assignedVehicle // Full vehicle object or null
                });

                // Fetch Notifications
                const notifRes = await api.notification.getAll();
                if (notifRes.success) {
                    setNotifications(notifRes.data.slice(0, 5)); // Recent 5
                }
            }
        } catch (error) {
            console.error('Failed to load dashboard data:', error);
            // If unauthorized, redirect
            if (error.message && error.message.includes('401')) {
                handleLogout();
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        authHelpers.logout();
        navigate('/login');
    };

    if (isLoading) return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50 text-slate-400">
            <div className="animate-pulse flex flex-col items-center gap-2">
                <Truck size={32} className="opacity-50" />
                <span>Loading Dashboard...</span>
            </div>
        </div>
    );

    if (!driver) return null;

    return (
        <div className="min-h-screen bg-slate-50 relative pb-24">
            {/* Header Background */}
            <div className="bg-emerald-600 h-48 rounded-b-[40px] shadow-lg shadow-emerald-200/50 absolute top-0 left-0 right-0 z-0"></div>

            {/* Content Container */}
            <div className="relative z-10 px-6 pt-12 space-y-6">

                {/* Header Info */}
                <div className="flex justify-between items-start text-white mb-8">
                    <div>
                        <h1 className="text-2xl font-display font-bold">Hello, {driver.fullName?.split(' ')[0]}!</h1>
                        <p className="text-emerald-100 text-sm opacity-90">Ready to deliver today?</p>
                    </div>
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 shadow-inner">
                        <Truck size={20} className="text-white" />
                    </div>
                </div>

                {/* Status Card */}
                <div className="bg-white p-5 rounded-2xl shadow-xl shadow-slate-200/50 flex items-center justify-between border border-slate-100">
                    <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Current Status</p>
                        <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${driver.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
                            <span className="font-bold text-slate-700 text-sm">{driver.status}</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Vehicle</p>
                        <div className="font-bold text-slate-700 text-sm font-mono bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                            {driver.assignedVehicle
                                ? (driver.assignedVehicle.name || driver.assignedVehicle.registrationNumber)
                                : 'N/A'
                            }
                        </div>
                    </div>
                </div>

                {/* Quick Actions Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <button
                        onClick={() => navigate('/driver/shipments')}
                        className="bg-white p-4 py-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center gap-3 active:scale-95 transition-all text-center hover:shadow-md hover:border-emerald-100 group"
                    >
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Package size={24} />
                        </div>
                        <span className="font-bold text-slate-700 text-sm">My Trips</span>
                    </button>

                    <button className="bg-white p-4 py-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center gap-3 active:scale-95 transition-all text-center hover:shadow-md hover:border-amber-100 group">
                        <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <MapPin size={24} />
                        </div>
                        <span className="font-bold text-slate-700 text-sm">Routes</span>
                    </button>
                </div>

                {/* Notifications Section */}
                <div>
                    <h3 className="font-bold text-slate-800 mb-3 px-1 text-sm flex items-center gap-2">
                        <Bell size={16} className="text-emerald-600" />
                        Recent Notifications
                    </h3>
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden divide-y divide-slate-50">
                        {notifications.length > 0 ? (
                            notifications.map((notif, i) => (
                                <div key={notif._id || i}
                                    onClick={() => navigate('/driver/shipments')}
                                    className={`p-4 hover:bg-slate-50 transition-colors cursor-pointer ${!notif.read ? 'bg-blue-50/30' : ''}`}
                                >
                                    <div className="flex gap-3">
                                        <div className="mt-1 min-w-[16px]">
                                            <Bell size={16} className="text-emerald-500" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-semibold text-slate-800 leading-tight mb-1">{notif.message}</p>
                                            <p className="text-[10px] text-slate-400 mt-2 font-medium">
                                                {notif.createdAt ? new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center text-slate-400 text-xs">
                                No new notifications
                            </div>
                        )}
                        {notifications.length > 5 && (
                            <button className="w-full py-3 text-xs font-bold text-emerald-600 hover:bg-emerald-50 transition-colors">
                                View All
                            </button>
                        )}
                    </div>
                </div>

                {/* Logout Button */}
                <button
                    onClick={handleLogout}
                    className="w-full py-4 mt-4 bg-white text-red-500 font-bold rounded-xl shadow-lg shadow-slate-200 border border-slate-100 flex items-center justify-center gap-2 active:scale-95 transition-all hover:bg-red-50"
                >
                    <LogOut size={18} />
                    Log Out
                </button>
            </div>
        </div>
    );
};

export default DriverDashboard;
