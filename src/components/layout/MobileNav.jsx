import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
    Home, Package, BarChart3, QrCode, Settings,
    Truck, Warehouse, Store, Shield, Search, MapPin, MoreHorizontal
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
    const MAX_VISIBLE_ITEMS = 5;
    const showMoreButton = navItems.length > MAX_VISIBLE_ITEMS;

    const visibleItems = showMoreButton ? navItems.slice(0, MAX_VISIBLE_ITEMS - 1) : navItems;
    const moreItems = showMoreButton ? navItems.slice(MAX_VISIBLE_ITEMS - 1) : [];

    // State for more menu
    const [isMoreOpen, setIsMoreOpen] = React.useState(false);
    const moreMenuRef = React.useRef(null);

    // Close on click outside
    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (moreMenuRef.current && !moreMenuRef.current.contains(event.target)) {
                setIsMoreOpen(false);
            }
        };
        if (isMoreOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMoreOpen]);

    // Close menu when route changes
    const location = useLocation();
    React.useEffect(() => {
        setIsMoreOpen(false);
    }, [location.pathname]);

    // Helper to render a nav link
    // Helper to render a nav link
    const NavItem = ({ item, isMoreItem = false }) => (
        <NavLink
            to={item.path}
            end={item.path === `/${role}`}
            className={({ isActive }) => isMoreItem
                ? `flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${isActive ? 'bg-emerald-50 text-emerald-600 font-medium' : 'text-slate-600 hover:bg-slate-50'}`
                : `flex flex-col items-center justify-center py-1 px-1 w-full h-full transition-all duration-200 ${isActive ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'}`
            }
        >
            {({ isActive }) => (
                <>
                    <div className={isMoreItem ? '' : `relative p-1 rounded-xl transition-all duration-200 ${isActive ? 'bg-emerald-50' : ''}`}>
                        <item.icon size={isMoreItem ? 20 : 22} strokeWidth={isActive ? 2.5 : 2} />
                        {!isMoreItem && isActive && (
                            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-emerald-600 rounded-full"></div>
                        )}
                    </div>
                    <span className={isMoreItem ? 'text-sm' : `text-[10px] font-medium mt-0.5 leading-none ${isActive ? 'font-bold' : ''}`}>
                        {item.label}
                    </span>
                </>
            )}
        </NavLink>
    );

    return (
        <>
            {/* More Menu Backdrop */}
            {isMoreOpen && (
                <div className="fixed inset-0 bg-black/20 z-40 backdrop-blur-sm" onClick={() => setIsMoreOpen(false)} />
            )}

            {/* More Menu Popup */}
            <div
                ref={moreMenuRef}
                className={`
                    fixed bottom-20 right-4 z-50 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 min-w-[200px]
                    origin-bottom-right transition-all duration-200
                    ${isMoreOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4 pointer-events-none'}
                `}
            >
                <div className="flex flex-col gap-1">
                    {moreItems.map((item) => (
                        <NavItem key={item.path} item={item} isMoreItem={true} />
                    ))}
                </div>
            </div>

            {/* Bottom Nav Bar */}
            <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                <div className="grid grid-cols-5 items-center px-2 py-2">
                    {/* Standard Visible Items */}
                    {visibleItems.map((item) => (
                        <NavItem key={item.path} item={item} />
                    ))}

                    {/* More Button */}
                    {showMoreButton && (
                        <button
                            onClick={() => setIsMoreOpen(!isMoreOpen)}
                            className={`
                                flex flex-col items-center justify-center py-1 px-1 w-full h-full transition-all duration-200
                                ${isMoreOpen ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'}
                            `}
                        >
                            <div className={`relative p-1 rounded-xl transition-all duration-200 ${isMoreOpen ? 'bg-emerald-50' : ''}`}>
                                <MoreHorizontal size={22} strokeWidth={isMoreOpen ? 2.5 : 2} />
                            </div>
                            <span className={`text-[10px] font-medium mt-0.5 leading-none ${isMoreOpen ? 'font-bold' : ''}`}>
                                More
                            </span>
                        </button>
                    )}
                </div>
            </nav>
        </>
    );
};

export default MobileNav;
