import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    Home, Package, BarChart3, QrCode, Settings,
    Truck, Warehouse, Store, Shield, Search, MapPin
} from 'lucide-react';

const MobileNav = ({ role }) => {
    // Define navigation items based on role
    const getNavItems = () => {
        switch (role) {
            case 'farmer':
                return [
                    { path: '/farmer', icon: Home, label: 'Home' },
                    { path: '/farmer/my-farm', icon: MapPin, label: 'Farm' },
                    { path: '/farmer/batches', icon: Package, label: 'Batches' },
                    { path: '/farmer/shipments', icon: Truck, label: 'Shipments' },
                    { path: '/farmer/scan', icon: QrCode, label: 'QR' },
                    { path: '/farmer/analytics', icon: BarChart3, label: 'Analytics' },
                    { path: '/farmer/settings', icon: Settings, label: 'Settings' }
                ];
            case 'transporter':
                return [
                    { path: '/transporter', icon: Home, label: 'Home' },
                    { path: '/transporter/shipments', icon: Truck, label: 'Shipments' },
                    { path: '/transporter/analytics', icon: BarChart3, label: 'Analytics' },
                    { path: '/transporter/settings', icon: Settings, label: 'Settings' }
                ];
            case 'distributor':
                return [
                    { path: '/distributor', icon: Home, label: 'Home' },
                    { path: '/distributor/inventory', icon: Warehouse, label: 'Inventory' },
                    { path: '/distributor/analytics', icon: BarChart3, label: 'Analytics' },
                    { path: '/distributor/settings', icon: Settings, label: 'Settings' }
                ];
            case 'retailer':
                return [
                    { path: '/retailer', icon: Home, label: 'Home' },
                    { path: '/retailer/products', icon: Store, label: 'Products' },
                    { path: '/retailer/analytics', icon: BarChart3, label: 'Analytics' },
                    { path: '/retailer/settings', icon: Settings, label: 'Settings' }
                ];
            case 'admin':
                return [
                    { path: '/admin', icon: Home, label: 'Home' },
                    { path: '/admin/users', icon: Shield, label: 'Users' },
                    { path: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
                    { path: '/admin/settings', icon: Settings, label: 'Settings' }
                ];
            default:
                return [
                    { path: '/trace', icon: Search, label: 'Trace' },
                ];
        }
    };

    const navItems = getNavItems();

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 px-2 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <div className="flex items-center overflow-x-auto hide-scrollbar gap-1 py-1">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === `/${role}`}
                        className={({ isActive }) => `
                            flex flex-1 w-full flex-col items-center justify-center py-2 px-2 min-w-[64px] flex-shrink-0 transition-all duration-200
                            ${isActive
                                ? 'text-emerald-600'
                                : 'text-slate-400 hover:text-slate-600'
                            }
                        `}
                    >
                        {({ isActive }) => (
                            <>
                                <div className={`
                                    relative p-1.5 rounded-xl transition-all duration-200
                                    ${isActive ? 'bg-emerald-50' : ''}
                                `}>
                                    <item.icon
                                        size={22}
                                        strokeWidth={isActive ? 2.5 : 2}
                                    />
                                    {isActive && (
                                        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-emerald-600 rounded-full"></div>
                                    )}
                                </div>
                                <span className={`
                                    text-[10px] font-medium mt-0.5 transition-all duration-200
                                    ${isActive ? 'font-bold' : ''}
                                `}>
                                    {item.label}
                                </span>
                            </>
                        )}
                    </NavLink>
                ))}
            </div>
            <style>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </nav>
    );
};

export default MobileNav;
