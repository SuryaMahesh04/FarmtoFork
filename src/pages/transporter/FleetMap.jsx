import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { api } from '../../utils/api';
import { Truck, Navigation, Phone } from 'lucide-react';

// Fix Leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Icons
const activeTruckIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/2554/2554936.png', // The Delivery Truck Icon
    iconSize: [45, 45],
    iconAnchor: [22, 22],
    popupAnchor: [0, -22],
});

const inactiveTruckIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/2554/2554936.png',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
    className: 'grayscale opacity-50' // CSS class to make it look inactive
});

const FleetMap = () => {
    const [drivers, setDrivers] = useState([]);
    const [shipments, setShipments] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Routing state
    const [selectedDriverId, setSelectedDriverId] = useState(null);
    const [routePoints, setRoutePoints] = useState([]);
    const [routeInfo, setRouteInfo] = useState(null);

    const fetchDrivers = async () => {
        try {
            const [driversRes, shipmentsRes] = await Promise.all([
                api.driver.getAll(),
                api.shipment.getAll()
            ]);

            if (driversRes.success) {
                setDrivers(driversRes.data);
            }
            if (shipmentsRes.success) {
                setShipments(shipmentsRes.data);
            }
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDrivers();
        const interval = setInterval(fetchDrivers, 15000); // Poll every 15s for live updates
        return () => clearInterval(interval);
    }, []);

    // Helper to find active assignment for a driver
    const getDriverAssignment = (driver) => {
        return shipments.find(s => {
            const shipmentDriverId = s.driver?._id || s.driver;
            // The shipment stores the driver's User ID, not their Driver model ID
            const isMatch = String(shipmentDriverId) === String(driver.user) || String(shipmentDriverId) === String(driver._id);
            const isActiveStatus = ['assigned', 'accepted', 'at_pickup', 'picked_up', 'in_transit', 'in-transit', 'arrived'].includes(s.status);
            return isMatch && isActiveStatus;
        });
    };

    const handleDriverSelect = async (driver, activeJob) => {
        setSelectedDriverId(driver._id);
        if (!activeJob) {
            setRoutePoints([]);
            setRouteInfo(null);
            return;
        }

        // Determine destination coordinates
        let destCoords = null;
        if (activeJob.distributor?.profile?.address?.coordinates?.lat) {
            destCoords = activeJob.distributor.profile.address.coordinates;
        } else if (activeJob.distributor?.profile?.city) {
            const query = activeJob.distributor.profile.city;
            try {
                const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
                const data = await response.json();
                if (data && data.length > 0) {
                    destCoords = { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
                }
            } catch (err) {
                console.error("Geocoding failed", err);
            }
        }

        if (destCoords && driver.currentLocation?.lat) {
            const start = driver.currentLocation;
            const end = destCoords;
            try {
                const response = await fetch(
                    `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`
                );
                const data = await response.json();
                if (data.code === 'Ok' && data.routes?.length > 0) {
                    const route = data.routes[0];
                    const points = route.geometry.coordinates.map(coord => [coord[1], coord[0]]);
                    setRoutePoints(points);
                    
                    // Format duration
                    const hrs = Math.floor(route.duration / 3600);
                    const mins = Math.floor((route.duration % 3600) / 60);
                    const durationStr = hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
                    
                    // Format distance
                    const distKm = (route.distance / 1000).toFixed(1);

                    setRouteInfo({ duration: durationStr, distance: distKm });
                } else {
                    setRoutePoints([[start.lat, start.lng], [end.lat, end.lng]]);
                    setRouteInfo(null);
                }
            } catch (err) {
                console.error('Routing failed', err);
                setRoutePoints([[start.lat, start.lng], [end.lat, end.lng]]);
                setRouteInfo(null);
            }
        } else {
            setRoutePoints([]);
            setRouteInfo(null);
        }
    };

    // Filter drivers with valid locations
    const visibleDrivers = drivers.filter(d =>
        d.currentLocation &&
        d.currentLocation.lat &&
        d.currentLocation.lng
    );

    // Default center (India)
    const mapCenter = [20.5937, 78.9629];

    return (
        <DashboardLayout role="transporter">
            <div className="h-[calc(100vh-100px)] flex flex-col">
                <div className="mb-4 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Fleet Map</h1>
                        <p className="text-slate-500 text-sm">Real-time location of your drivers</p>
                    </div>
                </div>

                <div className="flex-1 rounded-2xl overflow-hidden border border-slate-200 shadow-sm relative">
                    <MapContainer
                        center={mapCenter}
                        zoom={5}
                        className="w-full h-full z-0"
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        {visibleDrivers.map(driver => {
                            const isOnDuty = driver.dutyStatus === 'on-duty';
                            const activeJob = getDriverAssignment(driver);

                            return (
                                <Marker
                                    key={driver._id}
                                    position={[driver.currentLocation.lat, driver.currentLocation.lng]}
                                    icon={isOnDuty ? activeTruckIcon : inactiveTruckIcon}
                                    eventHandlers={{
                                        click: () => handleDriverSelect(driver, activeJob)
                                    }}
                                >
                                    <Popup className="w-64" onClose={() => { setRoutePoints([]); setRouteInfo(null); }}>
                                        <div className="p-1 min-w-[200px]">
                                            <div className="flex justify-between items-start mb-3 border-b border-slate-100 pb-2">
                                                <div>
                                                    <h3 className="font-bold text-slate-800">{driver.fullName}</h3>
                                                    <p className="text-xs text-slate-500">{driver.phone}</p>
                                                </div>
                                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${isOnDuty ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                                                    {isOnDuty ? 'On Duty' : 'Off Duty'}
                                                </span>
                                            </div>

                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 p-2 rounded-lg">
                                                    <Truck size={16} className="text-slate-400" />
                                                    <span className="font-mono font-bold text-slate-700">{driver.assignedVehicle?.registrationNumber || 'No Vehicle'}</span>
                                                </div>

                                                {activeJob ? (
                                                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 flex flex-col gap-2">
                                                        <div className="flex justify-between items-center">
                                                            <div className="flex items-center gap-2 text-blue-700 font-bold text-xs uppercase tracking-wider">
                                                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                                                On Route
                                                            </div>
                                                            {selectedDriverId === driver._id && routeInfo && (
                                                                <div className="text-[10px] font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                                                                    {routeInfo.distance} km • ETA {routeInfo.duration}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="space-y-2 relative pl-3 border-l-2 border-blue-200 mt-1">
                                                            <div>
                                                                <p className="text-[10px] text-blue-400 font-bold">FROM</p>
                                                                <p className="text-xs font-semibold text-slate-700 truncate">{activeJob.farmer?.profile?.city || 'Farm'}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-[10px] text-blue-400 font-bold">TO</p>
                                                                <p className="text-xs font-semibold text-slate-700 truncate">{activeJob.distributor?.profile?.city || 'Distributor'}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="text-center py-2 text-xs text-slate-400 italic bg-slate-50 rounded-lg">
                                                        Idle - No active assignment
                                                    </div>
                                                )}

                                                {driver.lastLocationUpdate && (
                                                    <div className="text-[10px] text-slate-300 text-right mt-1">
                                                        {new Date(driver.lastLocationUpdate).toLocaleTimeString()}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </Popup>
                                </Marker>
                            );
                        })}

                        {routePoints.length > 0 && (
                            <Polyline
                                positions={routePoints}
                                color="#3b82f6" // Nice blue color
                                weight={4}
                                opacity={0.8}
                                dashArray="10, 10" // Make it dashed to indicate an active/estimated route
                            />
                        )}
                    </MapContainer>

                    {loading && (
                        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-[500]">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default FleetMap;
