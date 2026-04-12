import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, Bell, User, ChevronDown, Package, Check, X as CloseIcon } from 'lucide-react';
import logo from '../../assets/logo2.png';
import { api, authHelpers } from '../../utils/api';

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

    // Fetch unread count from actual API
    useEffect(() => {
        const fetchUnreadCount = async () => {
             if (!user) return; // Only fetch if logged in
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
    }, [user]);

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
