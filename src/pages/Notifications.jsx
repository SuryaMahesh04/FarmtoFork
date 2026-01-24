import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Package, Check, ArrowLeft, Trash2 } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Button from '../components/ui/Button';
import { api, authHelpers } from '../utils/api';
import Loader from '../components/ui/Loader';

const Notifications = () => {
    const navigate = useNavigate();
    const user = authHelpers.getUser();
    const role = user?.role || 'farmer'; // Default fallback

    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const minLoadTime = 3400;
            const [response] = await Promise.all([
                api.notification.getAll(),
                new Promise(resolve => setTimeout(resolve, minLoadTime))
            ]);

            if (response.success) {
                setNotifications(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch notifications', error);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await api.notification.markAllRead();
            // Optimistically update UI
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        } catch (error) {
            console.error('Failed to mark all read', error);
        }
    };

    const handleNotificationClick = (notification) => {
        // Navigate based on type
        if (notification.relatedModel === 'Shipment') {
            const path = role === 'transporter' ? `/transporter/shipment/${notification.relatedId}`
                : (role === 'distributor' ? `/distributor/shipment/${notification.relatedId}`
                    : (role === 'farmer' ? `/farmer/shipment/${notification.relatedId}` : null));

            // Note: Farmer might need a specific view route if not "shipments" list, 
            // but for now redirecting to detail if ID exists is best if route exists, else list.
            // Since we don't have a generic /farmer/shipment/:id route confirmed for farmers (only list), 
            // we will default to the list for them, or check if we made one.
            // We only made `CreateShipment` and `Shipments` list for farmer.
            // Let's stick to list for farmer for now unless we add detail.

            if (path) {
                navigate(path);
            } else if (role === 'farmer') {
                navigate('/farmer/shipments');
            }
        }
    };

    if (loading) {
        return (
            <DashboardLayout role={role}>
                <Loader text="Loading notifications..." />
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout role={role}>
            <div className="max-w-4xl mx-auto space-y-6 animate-in">
                {/* Header */}
                <div className="flex items-center gap-4 mb-2">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 rounded-lg hover:bg-slate-100 transition-colors md:hidden"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div className="flex-1">
                        <h1 className="text-2xl font-display font-bold text-slate-800 flex items-center gap-3">
                            <span className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                                <Bell size={24} />
                            </span>
                            Notifications
                        </h1>
                        <p className="text-slate-500 mt-1">Stay updated with your shipments and activities</p>
                    </div>
                    {notifications.some(n => !n.isRead) && (
                        <Button
                            variant="outline"
                            size="sm"
                            icon={Check}
                            onClick={handleMarkAllRead}
                            className="hidden md:flex"
                        >
                            Mark all as read
                        </Button>
                    )}
                </div>

                {/* Notifications List */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    {notifications.length > 0 ? (
                        <div className="divide-y divide-slate-100">
                            {notifications.map((notif) => (
                                <div
                                    key={notif._id}
                                    onClick={() => handleNotificationClick(notif)}
                                    className={`p-4 md:p-6 hover:bg-slate-50 cursor-pointer transition-colors group flex gap-4 ${!notif.isRead ? 'bg-blue-50/40' : ''}`}
                                >
                                    {/* Icon */}
                                    <div className={`mt-1 w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${notif.type === 'shipment_request' ? 'bg-blue-100 text-blue-600' :
                                        notif.type === 'shipment_accepted' ? 'bg-emerald-100 text-emerald-600' :
                                            'bg-slate-100 text-slate-500'
                                        }`}>
                                        <Package size={20} />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-1">
                                            <p className={`text-base ${!notif.isRead ? 'font-semibold text-slate-900' : 'text-slate-700'}`}>
                                                {notif.message}
                                            </p>
                                            <span className="text-xs text-slate-400 whitespace-nowrap ml-4">
                                                {new Date(notif.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-500">
                                            {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>

                                    {/* Status Dot */}
                                    {!notif.isRead && (
                                        <div className="flex items-center self-center">
                                            <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 flex flex-col items-center">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                <Bell className="text-slate-300" size={32} />
                            </div>
                            <h3 className="text-lg font-medium text-slate-800">No notifications</h3>
                            <p className="text-slate-500 max-w-sm mt-1">
                                You're all caught up! New updates will appear here.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Notifications;
