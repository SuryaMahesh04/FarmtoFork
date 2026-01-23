import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, Bell, User, ChevronDown, Package, Check, X as CloseIcon } from 'lucide-react';
import logo from '../../assets/logo2.png';
import { api, authHelpers } from '../../utils/api';

const Header = ({ toggleSidebar, role, userName = "Surya Mahesh" }) => {
    const user = authHelpers.getUser();
    const displayName = user?.profile?.fullName || userName;
    const navigate = useNavigate();

    // Notification State
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showNotifications, setShowNotifications] = useState(false);
    const notificationRef = useRef(null);

    // Fetch Notifications
    const fetchNotifications = async () => {
        try {
            const response = await api.notification.getAll();
            if (response.success) {
                setNotifications(response.data);
                setUnreadCount(response.unreadCount);
            }
        } catch (error) {
            console.error('Failed to fetch notifications', error);
        }
    };

    useEffect(() => {
        if (user) {
            fetchNotifications();
            // Poll for notifications every 30 seconds
            const interval = setInterval(fetchNotifications, 30000);
            return () => clearInterval(interval);
        }
    }, []);

    // Close notifications when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleNotificationClick = async (notification) => {
        setShowNotifications(false);
        // Navigate based on type
        if (notification.relatedModel === 'Shipment') {
            let path = null;
            if (role === 'transporter') {
                path = `/transporter/shipment/${notification.relatedId}`;
            } else if (role === 'distributor') {
                path = `/distributor/shipment/${notification.relatedId}`;
            } else if (role === 'farmer') {
                path = `/farmer/shipment/${notification.relatedId}`;
            }

            if (path) navigate(path);
        }

        // Mark all as read for simplicity (or implement single mark read)
        await api.notification.markAllRead();
        fetchNotifications();
    };

    return (
        <header className="h-16 fixed top-0 left-0 right-0 z-40 glass-panel border-b border-sage-200 px-4 md:px-6 flex items-center justify-between transition-all duration-300">
            <div className="flex items-center gap-4">
                <button
                    onClick={toggleSidebar}
                    className="p-2 rounded-lg hover:bg-sage-100 text-slate-600 transition-colors lg:hidden"
                >
                    <Menu size={20} />
                </button>


                <Link to="/" className="flex items-center gap-3 group">
                    <img
                        src={logo}
                        alt="Farm2Fork Logo"
                        className="h-20 md:h-24 w-auto object-contain transition-all duration-300 group-hover:scale-105"
                    />
                    <span className="font-display font-bold text-xl md:text-2xl text-slate-800 tracking-tight">
                        Farm<span className="text-emerald-600">2</span>Fork
                    </span>
                </Link>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
                {/* Role Badge (Demo Only) */}
                <div className="hidden md:flex items-center px-3 py-1 rounded-full bg-sage-100 border border-sage-200 text-sage-700 text-xs font-medium uppercase tracking-wider">
                    {role || 'Guest'}
                </div>

                {/* Notifications */}
                <div className="relative" ref={notificationRef}>
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className={`p-2 rounded-full transition-all duration-200 relative ${showNotifications ? 'bg-emerald-50 text-emerald-600' : 'hover:bg-slate-100 text-slate-500'}`}
                    >
                        <Bell size={20} />
                        {unreadCount > 0 && (
                            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold text-white bg-red-500 rounded-full border-2 border-white shadow-sm">
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        )}
                    </button>

                    {/* Notification Dropdown */}
                    {showNotifications && (
                        <div className="absolute right-0 top-full mt-3 w-80 md:w-96 bg-white rounded-2xl shadow-xl border border-slate-100 py-0 animate-in fade-in slide-in-from-top-2 z-50 overflow-hidden ring-1 ring-black/5">
                            <div className="px-4 py-3 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                                <h3 className="font-semibold text-slate-800 flex items-center gap-2 text-sm">
                                    Notifications
                                    {unreadCount > 0 && (
                                        <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-0.5 rounded-full">
                                            {unreadCount} New
                                        </span>
                                    )}
                                </h3>
                                {unreadCount > 0 && (
                                    <button
                                        onClick={async () => {
                                            await api.notification.markAllRead();
                                            fetchNotifications();
                                        }}
                                        className="text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-2 py-1 rounded transition-colors"
                                    >
                                        Mark all read
                                    </button>
                                )}
                            </div>

                            <div className="max-h-[24rem] overflow-y-auto custom-scrollbar">
                                {notifications.length > 0 ? (
                                    notifications.map((notif) => (
                                        <div
                                            key={notif._id}
                                            onClick={() => handleNotificationClick(notif)}
                                            className={`px-4 py-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0 transition-colors ${!notif.isRead ? 'bg-blue-50/30' : ''}`}
                                        >
                                            <div className="flex gap-3 items-start">
                                                <div className={`mt-1 p-2 rounded-full shrink-0 ${!notif.isRead ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
                                                    <Package size={16} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className={`text-sm ${!notif.isRead ? 'font-semibold text-slate-800' : 'text-slate-600'}`}>
                                                        {notif.message}
                                                    </p>
                                                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                                                        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                                        {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                </div>
                                                {!notif.isRead && (
                                                    <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-2"></span>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="px-4 py-12 text-center flex flex-col items-center justify-center">
                                        <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                                            <Bell className="text-slate-300" size={24} />
                                        </div>
                                        <p className="text-slate-500 text-sm font-medium">No notifications yet</p>
                                        <p className="text-slate-400 text-xs mt-1">We'll let you know when updates arrive</p>
                                    </div>
                                )}
                            </div>

                            <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 text-center">
                                <Link to="/notifications" className="text-xs font-medium text-slate-500 hover:text-emerald-600 transition-colors">
                                    View all notifications
                                </Link>
                            </div>
                        </div>
                    )}
                </div>

                {/* User Profile */}
                <div className="flex items-center gap-3 pl-2 md:border-l md:border-slate-200">
                    <div className="hidden md:block text-right">
                        <p className="text-sm font-medium text-slate-700">{displayName}</p>
                        <p className="text-xs text-slate-500">{user?.email || role}</p>
                    </div>
                    <button className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 border border-white shadow-sm flex items-center justify-center text-white font-semibold overflow-hidden hover:ring-2 hover:ring-emerald-200 transition-all">
                        {user?.profile?.fullName ? user.profile.fullName.charAt(0).toUpperCase() : <User size={20} />}
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
