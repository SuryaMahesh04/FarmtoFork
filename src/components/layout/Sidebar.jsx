import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { authHelpers } from '../../utils/api';
import {
    ShoppingBag,
    ClipboardList,
    Mail,
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
    X,
    MapPin,
    User,
    MessageSquareText,
    Search
} from 'lucide-react';
import logo from '../../assets/logo2.png';

const Sidebar = ({ isOpen, toggleSidebar, role = 'farmer' }) => {
    const navigate = useNavigate();

    const handleSignOut = () => {
        authHelpers.logout();
        navigate('/');
    };

    // Get user data from localStorage
    const user = authHelpers.getUser();

    // Define menu items based on role
    const getMenuItems = (role) => {
        const common = [
            { icon: Settings, label: 'Settings', path: `/${role}/settings` },
        ];

        switch (role) {
            case 'farmer':
                return [
                    { icon: LayoutDashboard, label: 'Dashboard', path: '/farmer' },
                    { icon: MapPin, label: 'My Farm', path: '/farmer/my-farm' },
                    { icon: Sprout, label: 'My Batches', path: '/farmer/batches' },
                    { icon: Truck, label: 'Shipments', path: '/farmer/shipments' },
                    { icon: QrCode, label: 'Generate QR', path: '/farmer/scan' },
                    { icon: BarChart3, label: 'Analytics', path: '/farmer/analytics' },
                    ...common
                ];
            case 'transporter':
                return [
                    { icon: LayoutDashboard, label: 'Dashboard', path: '/transporter' },
                    { icon: Truck, label: 'My Vehicles', path: '/transporter/vehicles' },
                    { icon: Package, label: 'Shipments', path: '/transporter/shipments' },
                    { icon: FileText, label: 'Shipment Requests', path: '/transporter/requests' },
                    { icon: Users, label: 'Drivers', path: '/transporter/drivers' },
                    { icon: Truck, label: 'Fleet Map', path: '/transporter/fleet-map' },
                    ...common
                ];
            case 'distributor':
                return [
                    { icon: LayoutDashboard, label: 'Dashboard', path: '/distributor' },
                    { icon: Truck, label: 'Shipments', path: '/distributor/shipments' },
                    { icon: Package, label: 'Inventory', path: '/distributor/inventory' },
                    { icon: Truck, label: 'Incoming', path: '/distributor/incoming' },
                    { icon: Mail, label: 'Purchase Requests', path: '/distributor/purchase-orders' },
                    ...common
                ];
            case 'retailer':
                return [
                    { icon: LayoutDashboard, label: 'Dashboard', path: '/retailer' },
                    { icon: ShoppingBag, label: 'Marketplace', path: '/retailer/marketplace' },
                    { icon: ClipboardList, label: 'Purchase Orders', path: '/retailer/purchase-orders' },
                    { icon: Store, label: 'My Products', path: '/retailer/products' },
                    { icon: BarChart3, label: 'Sales Records', path: '/retailer/sales' },
                    ...common
                ];
            case 'admin':
                return [
                    { icon: LayoutDashboard, label: 'Overview', path: '/admin' },
                    { icon: Users, label: 'Users', path: '/admin/users' },
                    { icon: Sprout, label: 'Batches', path: '/admin/batches' },
                    { icon: Truck, label: 'Shipments', path: '/admin/shipments' },
                    { icon: Truck, label: 'Fleet Hub', path: '/admin/fleet' },
                    { icon: MapPin, label: 'Ecosystem Map', path: '/admin/map' },
                    { icon: FileText, label: 'Approvals', path: '/admin/approvals' },
                    { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
                    ...common
                ];
            case 'consumer':
                return [
                    { icon: LayoutDashboard, label: 'Dashboard', path: '/consumer' },
                    { icon: Search, label: 'Verification History', path: '/consumer/history' },
                    // Consumers don't have typical settings yet, but adding for UI balance
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
        py-6 flex flex-col justify-between
      `}>
                <div className="absolute top-4 right-4 lg:hidden">
                    <button onClick={toggleSidebar} className="p-1 rounded text-slate-500 hover:bg-slate-100">
                        <X size={20} />
                    </button>
                </div>

                <div className="px-6 mb-2">
                    <NavLink to="/" className="flex items-center gap-2 group">
                        <img
                            src={logo}
                            alt="Farm2Fork Logo"
                            className="h-10 w-auto object-contain transition-all duration-300 group-hover:scale-105"
                        />
                        <span className="font-display font-bold text-xl text-slate-800 tracking-tight">
                            Farm<span className="text-emerald-600">2</span>Fork
                        </span>
                    </NavLink>
                </div>

                <nav className="px-4 space-y-1">
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

                    <button
                        onClick={(role === 'consumer' && !authHelpers.isAuthenticated()) ? () => navigate('/') : handleSignOut}
                        className={`flex items-center gap-3 px-4 py-3 mt-4 w-full rounded-lg text-sm font-semibold transition-all duration-200 hover:shadow-sm active:scale-95 ${(role === 'consumer' && !authHelpers.isAuthenticated()) ? 'text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300' : 'text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 hover:border-red-300'}`}
                    >
                        {(role === 'consumer' && !authHelpers.isAuthenticated()) ? <LogOut size={20} className="rotate-180" /> : <LogOut size={20} />}
                        {(role === 'consumer' && !authHelpers.isAuthenticated()) ? 'Return Home' : 'Sign Out'}
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
