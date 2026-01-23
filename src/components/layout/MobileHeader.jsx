import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, User as UserIcon } from 'lucide-react';
import logo from '../../assets/logo2.png';

const MobileHeader = ({ role }) => {
    const navigate = useNavigate();

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
                    <button className="relative p-2 rounded-full hover:bg-slate-100 transition-colors">
                        <Bell size={20} className="text-slate-600" />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white"></span>
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
