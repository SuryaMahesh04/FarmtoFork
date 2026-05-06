import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, Bell, User, ChevronDown, Package, Check, MapPin, X as CloseIcon } from 'lucide-react';
import logo from '../../assets/logo2.png';
import { api, authHelpers } from '../../utils/api';
import toast from 'react-hot-toast';

const Header = ({ toggleSidebar, role, userName = "Surya Mahesh" }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(authHelpers.getUser());
    const displayName = user?.profile?.fullName || userName;

    useEffect(() => {
        const currentUser = authHelpers.getUser();
        if (currentUser) setUser(currentUser);
    }, []);

    // Notification State
    const [unreadCount, setUnreadCount] = useState(0);
    const [showPopup, setShowPopup] = useState(false);
    const [popupData, setPopupData] = useState(null);
    const lastNotifiedId = useRef(localStorage.getItem('lastNotifiedId') || null);

    const handleAcceptShipment = async (shipmentId) => {
        try {
            const res = await api.shipment.updateStatus(shipmentId, 'accepted');
            if (res.success) {
                toast.success('Shipment accepted successfully!');
                setShowPopup(false);
                // Refresh unread count
                const countRes = await api.notification.getAll();
                if (countRes.success) setUnreadCount(countRes.unreadCount);
            }
        } catch (error) {
            toast.error(error.message || 'Failed to accept shipment');
        }
    };

    // Fetch unread count and latest notification from actual API
    useEffect(() => {
        const fetchNotifications = async () => {
             if (!user) return; // Only fetch if logged in
             try {
                 const res = await api.notification.getAll();
                 if (res.success) {
                     // Check for new unread notification
                     const newest = res.data[0];
                     if (newest && !newest.isRead && newest._id !== lastNotifiedId.current) {
                         setPopupData(newest);
                         setShowPopup(true);
                         lastNotifiedId.current = newest._id;
                         localStorage.setItem('lastNotifiedId', newest._id);
                         
                         // Auto-hide after 8 seconds
                         setTimeout(() => setShowPopup(false), 8000);
                     }
                     setUnreadCount(res.unreadCount);
                 }
             } catch (error) {
                 // Silently fail to not clutter console
             }
        };
        
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 10000); // Polling every 10s for better responsiveness
        return () => clearInterval(interval);
    }, [user, unreadCount]);


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
                <div className="relative flex items-center">
                    {/* New Notification Popup */}
                    {showPopup && popupData && (
                        <div className="absolute right-full mr-6 top-1/2 -translate-y-1/2 flex items-center gap-3 bg-white border border-emerald-100 shadow-2xl shadow-emerald-500/20 rounded-2xl px-5 py-4 min-w-[320px] animate-in fade-in slide-in-from-right-4 duration-500 z-[60]">
                            <div className="flex flex-col flex-1">
                                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest leading-none mb-2 flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                    {popupData.type === 'shipment_request' ? 'New Shipment Request' : 'New Alert'}
                                </p>
                                
                                {popupData.type === 'shipment_request' && popupData.relatedId ? (
                                    <div className="space-y-2 mb-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                                                <Package size={16} />
                                            </div>
                                            <div>
                                                <p className="text-[11px] font-bold text-slate-800 leading-none">Shipment {popupData.relatedId.shipmentId || 'Request'}</p>
                                                <p className="text-[10px] text-slate-500 font-medium">Farmer: {popupData.relatedId.farmer?.profile?.fullName || popupData.sender?.profile?.fullName || 'N/A'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 pl-1">
                                            <MapPin size={12} className="text-slate-400" />
                                            <p className="text-[10px] text-slate-600 font-medium italic">
                                                {popupData.relatedId.farmer?.profile?.village}, {popupData.relatedId.farmer?.profile?.district}
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-xs font-bold text-slate-800 mb-3">{popupData.message}</p>
                                )}

                                <div className="flex items-center gap-2">
                                    {popupData.type === 'shipment_request' && popupData.relatedId && (
                                        <button 
                                            onClick={() => handleAcceptShipment(popupData.relatedId._id)}
                                            className="flex-1 py-2 bg-emerald-600 text-white text-[11px] font-bold rounded-xl hover:bg-emerald-700 transition-all shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center gap-1.5"
                                        >
                                            <Check size={14} /> Accept
                                        </button>
                                    )}
                                    <button 
                                        onClick={() => {
                                            setShowPopup(false);
                                            const path = popupData.type === 'shipment_request' 
                                                ? `/${role}/shipment/${popupData.relatedId?._id || ''}`
                                                : '/notifications';
                                            navigate(path);
                                        }}
                                        className="flex-1 py-2 bg-slate-100 text-slate-700 text-[11px] font-bold rounded-xl hover:bg-slate-200 transition-all active:scale-95 flex items-center justify-center"
                                    >
                                        View Details
                                    </button>
                                </div>
                            </div>
                            
                            <button onClick={() => setShowPopup(false)} className="absolute top-3 right-3 p-1 hover:bg-slate-50 rounded-full transition-colors">
                                <CloseIcon size={14} className="text-slate-400" />
                            </button>
                            
                            {/* Pointer triangle */}
                            <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-r border-t border-emerald-50 rotate-45"></div>
                        </div>
                    )}
                    {/* Location Reminder for Distributors */}
                    {role?.toLowerCase() === 'distributor' && (!user?.profile?.address?.coordinates?.lat || !user?.profile?.address?.coordinates?.lng) && (
                        <div className="absolute right-full mr-6 top-1/2 -translate-y-1/2 flex items-center gap-3 bg-white border border-rose-100 shadow-2xl shadow-rose-500/20 rounded-xl px-4 py-2.5 whitespace-nowrap animate-bounce-slow z-[60]">
                            <div className="flex flex-col">
                                <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest leading-none mb-1">Alert</p>
                                <p className="text-xs font-bold text-slate-800">Assign Warehouse Location</p>
                            </div>
                            <button 
                                onClick={() => navigate('/distributor/settings')}
                                className="px-3 py-1.5 bg-rose-600 text-white text-[10px] font-bold rounded-lg hover:bg-rose-700 transition-all shadow-md hover:shadow-lg active:scale-95"
                            >
                                Setup Now
                            </button>
                            {/* Pointer triangle */}
                            <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-r border-t border-rose-100 rotate-45"></div>
                        </div>
                    )}

                    <button
                        onClick={() => navigate('/notifications')}
                        className={`p-2 rounded-full transition-all duration-200 relative hover:bg-slate-100 text-slate-500`}
                    >
                        <Bell size={20} />
                        {unreadCount > 0 && (
                            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold text-white bg-red-500 rounded-full border-2 border-white shadow-sm">
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        )}
                    </button>
                </div>

                {/* Organic Badge for Farmers */}
                {role?.toLowerCase() === 'farmer' && user?.profile?.organicCertified && (
                    <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider shadow-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                        Certified Organic
                    </div>
                )}

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
