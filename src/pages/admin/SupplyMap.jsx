import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, LayersControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { 
    Layout, 
    Truck, 
    Warehouse, 
    Store, 
    Factory, 
    Sprout, 
    Filter, 
    Info, 
    Navigation,
    Phone,
    User,
    Clock,
    Activity
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import useAdminStore from '../../utils/adminStore';

// Fix Leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// High-Fidelity Custom Icons for Supply Chain
const createCustomIcon = (color, bgClass) => {
    return new L.DivIcon({
        className: 'custom-div-icon',
        html: `<div class="w-10 h-10 ${bgClass} rounded-full border-2 border-white shadow-xl flex items-center justify-center transform transition-transform hover:scale-110">
                <div class="w-6 h-6 text-white">${color}</div>
              </div>`,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
        popupAnchor: [0, -20]
    });
};

const icons = {
    farmer: createCustomIcon('', 'bg-green-500'),
    transporter: createCustomIcon('', 'bg-blue-600'),
    distributor: createCustomIcon('', 'bg-amber-600'),
    retailer: createCustomIcon('', 'bg-purple-600'),
    driver: createCustomIcon('', 'bg-emerald-500'),
    driver_off: createCustomIcon('', 'bg-slate-400')
};

// Overwrite html for specific roles with SVGs
icons.farmer.options.html = `<div class="w-10 h-10 bg-green-500 rounded-full border-2 border-white shadow-xl flex items-center justify-center"><svg viewBox="0 0 24 24" width="20" height="20" stroke="white" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"/></svg></div>`;
icons.transporter.options.html = `<div class="w-10 h-10 bg-blue-600 rounded-full border-2 border-white shadow-xl flex items-center justify-center"><svg viewBox="0 0 24 24" width="20" height="20" stroke="white" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg></div>`;
icons.distributor.options.html = `<div class="w-10 h-10 bg-amber-600 rounded-full border-2 border-white shadow-xl flex items-center justify-center"><svg viewBox="0 0 24 24" width="20" height="20" stroke="white" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg></div>`;
icons.retailer.options.html = `<div class="w-10 h-10 bg-purple-600 rounded-full border-2 border-white shadow-xl flex items-center justify-center"><svg viewBox="0 0 24 24" width="20" height="20" stroke="white" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></div>`;
icons.driver.options.html = `<div class="w-10 h-10 bg-emerald-500 rounded-full border-2 border-white shadow-xl flex items-center justify-center animate-bounce"><svg viewBox="0 0 24 24" width="20" height="20" stroke="white" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg></div>`;
icons.driver_off.options.html = `<div class="w-10 h-10 bg-slate-400 rounded-full border-2 border-white shadow-xl flex items-center justify-center opacity-80"><svg viewBox="0 0 24 24" width="20" height="20" stroke="white" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg></div>`;

const SupplyMap = () => {
    const { mapData, fetchMapData, isLoading } = useAdminStore();
    const [activeFilters, setActiveFilters] = useState({
        farmer: true,
        transporter: true,
        distributor: true,
        retailer: true,
        driver: true
    });

    useEffect(() => {
        fetchMapData();
        const interval = setInterval(fetchMapData, 30000); // 30s live updates
        return () => clearInterval(interval);
    }, []);

    const toggleFilter = (type) => {
        setActiveFilters(prev => ({ ...prev, [type]: !prev[type] }));
    };

    const mapCenter = [20.5937, 78.9629]; // India Center

    const filteredData = mapData.filter(item => activeFilters[item.type]);

    const getRoleColor = (role) => {
        switch(role) {
            case 'farmer': return 'text-green-600 bg-green-100';
            case 'transporter': return 'text-blue-600 bg-blue-100';
            case 'distributor': return 'text-amber-600 bg-amber-100';
            case 'retailer': return 'text-purple-600 bg-purple-100';
            case 'driver': return 'text-emerald-600 bg-emerald-100';
            default: return 'text-slate-600 bg-slate-100';
        }
    };

    return (
        <DashboardLayout role="admin">
            <div className="h-[calc(100vh-100px)] flex flex-col gap-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                    <div>
                        <h1 className="text-xl md:text-2xl font-display font-bold text-slate-800">Global Supply Chain Map</h1>
                        <p className="text-sm text-slate-500">Live visualization of your entire logistics network</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {Object.entries(activeFilters).map(([type, active]) => (
                            <button
                                key={type}
                                onClick={() => toggleFilter(type)}
                                className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase transition-all flex items-center gap-2 border ${active 
                                    ? 'bg-slate-800 text-white border-slate-800 shadow-md transform scale-105' 
                                    : 'bg-white text-slate-400 border-slate-200 opacity-60'}`}
                            >
                                <div className={`w-2 h-2 rounded-full ${active ? 'bg-current' : 'bg-slate-300'}`}></div>
                                {type}s
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 rounded-2xl overflow-hidden border border-slate-200 shadow-2xl relative bg-slate-50">
                    <MapContainer
                        center={mapCenter}
                        zoom={5}
                        className="w-full h-full z-0"
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        {filteredData.map(point => (
                            <Marker
                                key={point.id}
                                position={[point.coordinates.lat, point.coordinates.lng]}
                                icon={point.type === 'driver' ? (point.status === 'on-duty' ? icons.driver : icons.driver_off) : icons[point.type]}
                            >
                                <Popup className="custom-popup">
                                    <div className="p-3 w-64">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getRoleColor(point.type)}`}>
                                                {point.type}
                                            </span>
                                            {point.updatedAt && (
                                                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                                                    <Clock size={10} /> {new Date(point.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            )}
                                        </div>

                                        <h3 className="font-bold text-slate-800 mb-1 leading-tight">{point.name}</h3>
                                        
                                        {point.city && (
                                            <div className="flex items-center gap-1 text-[11px] text-slate-500 mb-3">
                                                <Navigation size={10} /> {point.city}
                                            </div>
                                        )}

                                        <div className="space-y-2 pt-2 border-t border-slate-100">
                                            <div className="flex items-center gap-2 text-xs text-slate-600">
                                                <Info size={14} className="text-slate-400" />
                                                <span>{point.details}</span>
                                            </div>
                                            
                                            <div className="flex items-center gap-2 text-xs text-slate-600">
                                                <Phone size={14} className="text-slate-400" />
                                                <a href={`tel:${point.contact}`} className="hover:text-amber-600 transition-colors">{point.contact}</a>
                                            </div>

                                            {point.type === 'driver' && (
                                                <div className={`mt-2 flex items-center gap-2 text-xs font-bold ${point.status === 'on-duty' ? 'text-emerald-600' : 'text-slate-400'}`}>
                                                    <Activity size={14} />
                                                    {point.status === 'on-duty' ? 'Live & On-Duty' : 'Off-Duty'}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>

                    {isLoading && (
                        <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] flex items-center justify-center z-[500]">
                            <div className="bg-white px-6 py-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-amber-600"></div>
                                <span className="font-medium text-slate-700">Syncing Supply Chain Data...</span>
                            </div>
                        </div>
                    )}

                    {/* Stats Overlay */}
                    <div className="absolute top-4 right-4 z-[400] flex flex-col gap-2 pointer-events-none">
                        <div className="bg-white/90 backdrop-blur-md px-4 py-3 rounded-xl shadow-lg border border-slate-100 pointer-events-auto">
                            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Live Registry</h4>
                            <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                    <span className="text-xs font-bold text-slate-700">{mapData.filter(i => i.type === 'farmer').length} Farms</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                    <span className="text-xs font-bold text-slate-700">{mapData.filter(i => i.type === 'driver' && i.status === 'on-duty').length} Active Drivers</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                                    <span className="text-xs font-bold text-slate-700">{mapData.filter(i => i.type === 'retailer').length} Stores</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                    <span className="text-xs font-bold text-slate-700">{mapData.filter(i => i.type === 'transporter').length} Logistics</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .custom-div-icon {
                    background: none !important;
                    border: none !important;
                }
                .custom-popup .leaflet-popup-content-wrapper {
                    padding: 0;
                    border-radius: 1rem;
                    overflow: hidden;
                    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
                }
                .custom-popup .leaflet-popup-content {
                    margin: 0;
                }
                .animate-bounce {
                    animation: bounce 2s infinite;
                }
                @keyframes bounce {
                    0%, 100% { transform: translateY(-5%); animation-timing-function: cubic-bezier(0.8,0,1,1); }
                    50% { transform: translateY(0); animation-timing-function: cubic-bezier(0,0,0.2,1); }
                }
            `}} />
        </DashboardLayout>
    );
};

export default SupplyMap;
