import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, Bell, User, ChevronDown, Package, Check, X as CloseIcon } from 'lucide-react';
import logo from '../../assets/logo2.png';
import NotificationPopover from './NotificationPopover';
import { notificationStore } from '../../utils/notificationStore';
import { authHelpers } from '../../utils/api';

const Header = ({ toggleSidebar, role, userName = "Surya Mahesh" }) => {
    const user = authHelpers.getUser();
    const displayName = user?.profile?.fullName || userName;
    const navigate = useNavigate();

    // Notification State
    const [unreadCount, setUnreadCount] = useState(0);
    const [showNotifications, setShowNotifications] = useState(false);
    const notificationRef = useRef(null);

    // Update badge count
    useEffect(() => {
        const updateCount = () => {
             // Mock: Count 'pending' as unread
             const count = notificationStore.getAll().filter(n => n.status === 'pending').length;
             setUnreadCount(count);
        };
        
        updateCount();
        // Set up an interval or event listener if needed, for now just initial load + polling
        const interval = setInterval(updateCount, 2000);
        return () => clearInterval(interval);
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

                    <NotificationPopover 
                        isOpen={showNotifications} 
                        onClose={() => setShowNotifications(false)} 
                    />
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
