import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, User as UserIcon, X as CloseIcon, Package, MapPin, Check } from 'lucide-react';
import logo from '../../assets/logo2.png';
import { api, authHelpers } from '../../utils/api';
import toast from 'react-hot-toast';

const MobileHeader = ({ role }) => {
    const navigate = useNavigate();
    const [unreadCount, setUnreadCount] = useState(0);
    const [showPopup, setShowPopup] = useState(false);
    const [popupData, setPopupData] = useState(null);
    const lastNotifiedId = useRef(localStorage.getItem('lastNotifiedId_mobile') || null);

    const handleAcceptShipment = async (shipmentId) => {
        try {
            const res = await api.shipment.updateStatus(shipmentId, 'accepted');
            if (res.success) {
                toast.success('Shipment accepted!');
                setShowPopup(false);
                // Refresh unread count
                const countRes = await api.notification.getAll();
                if (countRes.success) setUnreadCount(countRes.unreadCount);
            }
        } catch (error) {
            toast.error(error.message || 'Failed to accept');
        }
    };

    // Fetch unread count and latest notification from actual API
    useEffect(() => {
        const fetchNotifications = async () => {
             if (!authHelpers.isAuthenticated()) return; // Only fetch if logged in
             try {
                 const res = await api.notification.getAll();
                 if (res.success) {
                     const newest = res.data[0];
                     if (newest && !newest.isRead && newest._id !== lastNotifiedId.current) {
                         setPopupData(newest);
                         setShowPopup(true);
                         lastNotifiedId.current = newest._id;
                         localStorage.setItem('lastNotifiedId_mobile', newest._id);
                         setTimeout(() => setShowPopup(false), 6000);
                     }
                     setUnreadCount(res.unreadCount);
                 }
             } catch (error) {
                 // Silently fail to not clutter console
             }
        };
        
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 12000); // Polling every 12s
        return () => clearInterval(interval);
    }, []);

    const getRoleName = (role) => {
        const roleNames = {
            farmer: 'Farmer',
            transporter: 'Logistics',
            distributor: 'Distributor',
            retailer: 'Retailer',
            admin: 'Admin',
            consumer: 'Consumer'
        };
        return roleNames[role] || 'Dashboard';
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 px-4 py-3">
            <div className="flex items-center justify-between">
                {/* Logo and Role */}
                <div className="flex items-center gap-2">
                    <img
                        src={logo}
                        alt="Farm2Fork Logo"
                        className="h-8 w-auto object-contain"
                    />
                    <div className="flex flex-col">
                        <span className="font-display font-bold text-lg text-slate-800 leading-tight">
                            Farm<span className="text-emerald-600">2</span>Fork
                        </span>
                        <span className="text-[10px] text-slate-500 font-medium leading-none">{getRoleName(role)}</span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    {/* New Notification Popup - Mobile */}
                    {showPopup && popupData && (
                        <div className="absolute top-16 right-4 left-4 bg-white border border-emerald-100 shadow-2xl rounded-2xl p-4 animate-in slide-in-from-top-4 duration-300 z-[60]">
                            <div className="flex flex-col gap-3">
                                <div className="flex justify-between items-start">
                                    <div className="flex flex-col">
                                        <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest leading-none mb-1 flex items-center gap-1">
                                            <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></span>
                                            {popupData.type === 'shipment_request' ? 'Shipment Request' : 'New Alert'}
                                        </p>
                                        <p className="text-xs font-bold text-slate-800 truncate max-w-[200px]">
                                            {popupData.type === 'shipment_request' && popupData.relatedId 
                                                ? `Shipment ${popupData.relatedId.shipmentId || 'New'}`
                                                : popupData.message}
                                        </p>
                                    </div>
                                    <button onClick={() => setShowPopup(false)} className="text-slate-400 p-1">
                                        <CloseIcon size={16} />
                                    </button>
                                </div>

                                {popupData.type === 'shipment_request' && popupData.relatedId && (
                                    <div className="bg-slate-50 rounded-xl p-2 space-y-1">
                                        <p className="text-[10px] text-slate-600">
                                            <span className="font-bold">Farmer:</span> {popupData.relatedId.farmer?.profile?.fullName || 'N/A'}
                                        </p>
                                        <p className="text-[10px] text-slate-500 flex items-center gap-1">
                                            <MapPin size={10} /> {popupData.relatedId.farmer?.profile?.village}, {popupData.relatedId.farmer?.profile?.district}
                                        </p>
                                    </div>
                                )}

                                <div className="flex items-center gap-2">
                                    {popupData.type === 'shipment_request' && popupData.relatedId && (
                                        <button 
                                            onClick={() => handleAcceptShipment(popupData.relatedId._id)}
                                            className="flex-1 py-2 bg-emerald-600 text-white text-[10px] font-bold rounded-lg flex items-center justify-center gap-1"
                                        >
                                            <Check size={12} /> Accept
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
                                        className="flex-1 py-2 bg-slate-100 text-slate-700 text-[10px] font-bold rounded-lg"
                                    >
                                        View
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Notifications */}
                    <button 
                        onClick={() => navigate('/notifications')}
                        className="relative p-2 rounded-full hover:bg-slate-100 transition-colors"
                    >
                        <Bell size={20} className="text-slate-600" />
                        {unreadCount > 0 && (
                            <span className="absolute top-0 right-0 min-w-[16px] h-[16px] flex items-center justify-center text-[9px] font-bold text-white bg-red-500 rounded-full border border-white shadow-sm">
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        )}
                    </button>

                    {/* Profile */}
                    <button
                        onClick={() => navigate(`/${role}/settings`)}
                        className="p-2 rounded-full hover:bg-slate-100 transition-colors"
                    >
                        <UserIcon size={20} className="text-slate-600" />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default MobileHeader;
