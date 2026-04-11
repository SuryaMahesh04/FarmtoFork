import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, User as UserIcon } from 'lucide-react';
import logo from '../../assets/logo2.png';
import { api, authHelpers } from '../../utils/api';

const MobileHeader = ({ role }) => {
    const navigate = useNavigate();
    const [unreadCount, setUnreadCount] = useState(0);

    // Fetch unread count from actual API
    useEffect(() => {
        const fetchUnreadCount = async () => {
             if (!authHelpers.isAuthenticated()) return; // Only fetch if logged in
             try {
                 const res = await api.notification.getAll();
                 if (res.success) {
                     setUnreadCount(res.unreadCount);
                 }
             } catch (error) {
                 // Silently fail to not clutter console
             }
        };
        
        fetchUnreadCount();
        const interval = setInterval(fetchUnreadCount, 15000); // Polling every 15s
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
