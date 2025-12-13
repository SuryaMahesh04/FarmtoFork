import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Package,
    Truck,
    Store,
    Users,
    Settings,
    BarChart3,
    QrCode,
    FileText,
    Sprout,
    LogOut,
    X
} from 'lucide-react';

const Sidebar = ({ isOpen, toggleSidebar, role = 'farmer' }) => {
    // Define menu items based on role
    const getMenuItems = (role) => {
        const common = [
            { icon: Settings, label: 'Settings', path: `/${role}/settings` },
        ];

        switch (role) {
            case 'farmer':
                return [
                    { icon: LayoutDashboard, label: 'Dashboard', path: '/farmer' },
                    { icon: Sprout, label: 'My Batches', path: '/farmer/batches' },
                    { icon: QrCode, label: 'Generate QR', path: '/farmer/scan' },
                    { icon: BarChart3, label: 'Analytics', path: '/farmer/analytics' },
                    ...common
                ];
            case 'transporter':
                return [
                    { icon: LayoutDashboard, label: 'Dashboard', path: '/transporter' },
                    { icon: Truck, label: 'Shipments', path: '/transporter/shipments' },
                    { icon: MapPin, label: 'Routes', path: '/transporter/routes' },
                    ...common
                ];
            case 'distributor':
                return [
                    { icon: LayoutDashboard, label: 'Dashboard', path: '/distributor' },
                    { icon: Package, label: 'Inventory', path: '/distributor/inventory' },
                    { icon: Truck, label: 'Incoming', path: '/distributor/incoming' },
                    { icon: BarChart3, label: 'Quality', path: '/distributor/quality' },
                    ...common
                ];
            case 'retailer':
                return [
                    { icon: LayoutDashboard, label: 'Dashboard', path: '/retailer' },
                    { icon: Store, label: 'Products', path: '/retailer/products' },
                    { icon: BarChart3, label: 'Sales', path: '/retailer/sales' },
                    ...common
                ];
            case 'admin':
                return [
                    { icon: LayoutDashboard, label: 'Overview', path: '/admin' },
                    { icon: Users, label: 'Users', path: '/admin/users' },
                    { icon: FileText, label: 'Approvals', path: '/admin/approvals' },
                    { icon: BarChart3, label: 'Platform Stats', path: '/admin/stats' },
                    ...common
                ];
            default:
                return [];
        }
    };

    const menuItems = getMenuItems(role);

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden"
                    onClick={toggleSidebar}
                ></div>
            )}

            {/* Sidebar */}
            <aside className={`
        fixed top-0 left-0 bottom-0 z-50 w-64 glass-panel border-r border-sage-200
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        pt-16 pb-6 flex flex-col justify-between
      `}>
                <div className="absolute top-4 right-4 lg:hidden">
                    <button onClick={toggleSidebar} className="p-1 rounded text-slate-500 hover:bg-slate-100">
                        <X size={20} />
                    </button>
                </div>

                <nav className="px-4 py-6 space-y-1">
                    {menuItems.map((item, index) => (
                        <NavLink
                            key={index}
                            to={item.path}
                            end={item.path === `/${role}`} // Only exact match for dashboard home
                            className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                ${isActive
                                    ? 'bg-sage-100 text-sage-700 shadow-sm'
                                    : 'text-slate-600 hover:bg-white/50 hover:text-sage-600'}
              `}
                        >
                            <item.icon size={20} className={({ isActive }) => isActive ? 'text-sage-600' : 'text-slate-400'} />
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="px-4">
                    <div className="p-4 rounded-xl bg-gradient-to-br from-sage-50 to-wheat-50 border border-sage-100">
                        <h4 className="text-xs font-semibold text-sage-800 uppercase tracking-wider mb-2">Sustainable Help</h4>
                        <p className="text-xs text-slate-500 mb-3">Need assistance with the platform?</p>
                        <button className="w-full py-2 text-xs font-medium text-sage-700 bg-white rounded-lg border border-sage-200 hover:bg-sage-50 transition-colors">
                            Contact Support
                        </button>
                    </div>

                    <button className="flex items-center gap-3 px-3 py-2.5 mt-4 w-full rounded-lg text-sm font-medium text-terra-400 hover:bg-terra-50 transition-colors">
                        <LogOut size={20} />
                        Sign Out
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
