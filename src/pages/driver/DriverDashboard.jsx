import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Truck, Navigation, Locate, MapPin, Home, ClipboardList, User, Package, CheckCircle, Clock } from 'lucide-react';
import { api, authHelpers } from '../../utils/api';
import DutyToggle from '../../components/driver/DutyToggle';
import AssignmentPopup from '../../components/driver/AssignmentPopup';

// Fix Leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Icons
const driverIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/7541/7541900.png', // Back to the reliable truck icon or a simpler one
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
});

const farmIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/2098/2098313.png',
    iconSize: [35, 35],
    iconAnchor: [17, 35],
    popupAnchor: [0, -35],
});

// Map Controller Component
const MapController = ({ center }) => {
    const map = useMap();
    const prevCenterRef = useRef(null);

    useEffect(() => {
        if (center) {
            // Check if center has significantly changed (to prevent micro-jitters or ref issues)
            const [lat, lng] = center;
            const prev = prevCenterRef.current;

            if (!prev || prev[0] !== lat || prev[1] !== lng) {
                prevCenterRef.current = center;
                map.flyTo(center, 15, { animate: true, duration: 1.5 });
            }
        }
    }, [center[0], center[1], map]); // Depend on primitive values, not the array reference

    return null;
};

// --- Sub-Components ---

const AssignmentsView = ({ shipments }) => {
    const completed = shipments.filter(s => ['delivered', 'completed'].includes(s.status));

    return (
        <div className="h-full overflow-y-auto bg-slate-50 p-4 pb-24">
            <h2 className="text-xl font-bold text-slate-800 mb-4 px-1">Completed Assignments</h2>
            {completed.length > 0 ? (
                <div className="space-y-4">
                    {completed.map(trip => (
                        <div key={trip._id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-2">
                                    <div className="bg-emerald-100 p-2 rounded-full">
                                        <CheckCircle size={16} className="text-emerald-600" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-800 text-sm">{trip.batch?.crop || 'Produce'}</p>
                                        <p className="text-xs text-slate-500">{new Date(trip.updatedAt || trip.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-[10px] font-bold uppercase">
                                    {trip.status}
                                </span>
                            </div>

                            <div className="space-y-2 pl-2 border-l-2 border-slate-100 ml-3">
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">From</p>
                                    <p className="text-xs text-slate-700">{trip.farmer?.profile?.city || 'Farm'}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">To</p>
                                    <p className="text-xs text-slate-700">{trip.distributor?.profile?.city || 'Distributor'}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                    <Package size={48} className="opacity-20 mb-2" />
                    <p>No completed assignments yet</p>
                </div>
            )}
        </div>
    );
};

const ProfileView = ({ driver, onLogout }) => {
    if (!driver) return null;
    return (
        <div className="h-full bg-slate-50 p-6 flex flex-col items-center pt-10">
            <div className="w-24 h-24 bg-white rounded-full shadow-lg border-4 border-emerald-500 flex items-center justify-center mb-4">
                <User size={40} className="text-slate-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">{driver.fullName}</h2>
            <p className="text-slate-500 mb-8">{driver.email}</p>

            <div className="w-full max-w-sm space-y-4">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">Vehicle Details</p>
                    <div className="flex items-center gap-3">
                        <Truck size={20} className="text-blue-500" />
                        <div>
                            <p className="font-bold text-slate-800">{driver.assignedVehicle?.name || 'Unknown Vehicle'}</p>
                            <p className="text-xs text-slate-500 font-mono">{driver.assignedVehicle?.registrationNumber || 'No Plate'}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">License</p>
                    <p className="font-mono text-slate-700">{driver.licenseNumber || 'N/A'}</p>
                </div>

                <button
                    onClick={onLogout}
                    className="w-full py-4 bg-red-50 text-red-600 font-bold rounded-xl mt-8 hover:bg-red-100 transition-colors"
                >
                    Log Out
                </button>
            </div>
        </div>
    );
};

// --- Main Dashboard Component ---

const DriverDashboard = () => {
    const navigate = useNavigate();

    // State
    const [driverProfile, setDriverProfile] = useState(null);
    const [dutyStatus, setDutyStatus] = useState('off-duty');
    const [location, setLocation] = useState(null);
    const [activeTrip, setActiveTrip] = useState(null);
    const [pendingAssignment, setPendingAssignment] = useState(null);
    const [allShipments, setAllShipments] = useState([]);
    const [currentTab, setCurrentTab] = useState('home'); // home, assignments, profile
    const [loading, setLoading] = useState(true);
    const [toggleLoading, setToggleLoading] = useState(false);
    const [navigationState, setNavigationState] = useState('idle');

    // Refs
    const watchIdRef = useRef(null);
    const locationUpdateTimeoutRef = useRef(null);

    // Initial Load
    useEffect(() => {
        const init = async () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (pos) => {
                        if (isValidCoordinate(pos.coords.latitude, pos.coords.longitude)) {
                            setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
                        }
                    },
                    (err) => console.log('Location access denied or error'),
                    { enableHighAccuracy: true }
                );
            }
            await loadData();
        };
        init();

        return () => {
            if (watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current);
            if (locationUpdateTimeoutRef.current) clearTimeout(locationUpdateTimeoutRef.current);
        };
    }, []);

    // Helper
    const isValidCoordinate = (lat, lng) => typeof lat === 'number' && typeof lng === 'number' && !isNaN(lat) && !isNaN(lng);

    // Duty Status Effect
    useEffect(() => {
        if (dutyStatus === 'on-duty') {
            startLocationTracking();
            const interval = setInterval(loadAssignments, 10000);
            return () => clearInterval(interval);
        } else {
            stopLocationTracking();
        }
    }, [dutyStatus]);

    const loadData = async () => {
        try {
            setLoading(true);

            // 1. Get Me (Profile)
            const userRes = await api.auth.getMe();
            if (userRes.success) {
                const user = userRes.data;
                // Combine user profile with driver specific details
                const profile = {
                    ...user.profile,
                    email: user.email,
                    fullName: user.driverProfile?.fullName || user.profile?.fullName || user.name,
                    assignedVehicle: user.driverProfile?.assignedVehicle || {},
                    licenseNumber: user.driverProfile?.licenseNumber
                };
                setDriverProfile(profile);
            }

            // 2. Get Status
            const statusRes = await api.driver.getStatus();
            if (statusRes.success) {
                setDutyStatus(statusRes.data.dutyStatus || 'off-duty');
                const loc = statusRes.data.currentLocation;
                if (loc && isValidCoordinate(loc.lat, loc.lng)) {
                    setLocation({ lat: loc.lat, lng: loc.lng });
                }
            }

            // 3. Get Assignments
            await loadAssignments();

        } catch (error) {
            console.error('Init error:', error);
            if (error.message?.includes('401')) navigate('/login');
        } finally {
            setLoading(false);
        }
    };

    const loadAssignments = async () => {
        try {
            const res = await api.shipment.getAll();
            if (res.success) {
                const shipments = res.data;
                setAllShipments(shipments);

                // Find active trip: Check for various active statuses. 
                // We assume if status is > assigned, it is accepted.
                const active = shipments.find(s =>
                    ['at_pickup', 'picked_up', 'in-transit', 'in_transit'].includes(s.status)
                );
                setActiveTrip(active);

                // Only look for pending if no active trip
                if (!active) {
                    const pending = shipments.find(s =>
                        s.status === 'assigned' && s.driverStatus === 'pending'
                    );
                    setPendingAssignment(pending || null);
                } else {
                    setPendingAssignment(null);
                }
            }
        } catch (error) {
            console.error('Fetch assignments error:', error);
        }
    };

    const startLocationTracking = () => {
        if (!navigator.geolocation) return;
        watchIdRef.current = navigator.geolocation.watchPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                if (isValidCoordinate(latitude, longitude)) {
                    setLocation({ lat: latitude, lng: longitude });
                    if (!locationUpdateTimeoutRef.current) {
                        api.driver.updateLocation(latitude, longitude).catch(() => { });
                        locationUpdateTimeoutRef.current = setTimeout(() => {
                            locationUpdateTimeoutRef.current = null;
                        }, 10000);
                    }
                }
            },
            () => { },
            { enableHighAccuracy: true, maximumAge: 0 }
        );
    };

    const stopLocationTracking = () => {
        if (watchIdRef.current) {
            navigator.geolocation.clearWatch(watchIdRef.current);
            watchIdRef.current = null;
        }
    };

    const handleToggleDuty = async () => {
        try {
            setToggleLoading(true);
            const newStatus = dutyStatus === 'on-duty' ? 'off-duty' : 'on-duty';
            await api.driver.updateDutyStatus(newStatus, location);
            setDutyStatus(newStatus);
            if (newStatus === 'off-duty') {
                setActiveTrip(null);
                setPendingAssignment(null);
            }
        } catch (error) {
            alert('Status update failed');
        } finally {
            setToggleLoading(false);
        }
    };

    const handleAccept = async () => {
        if (!pendingAssignment) return;
        setToggleLoading(true);
        try {
            await api.shipment.updateStatus(pendingAssignment._id, 'at_pickup');
            // Optimistically update local state to avoid flicker before reload
            setActiveTrip({ ...pendingAssignment, status: 'at_pickup', driverStatus: 'accepted' });
            setPendingAssignment(null);
            await loadAssignments();
        } catch (e) {
            alert('Failed to accept');
        } finally {
            setToggleLoading(false);
        }
    };

    const handleNavigate = () => {
        let dest = null;
        if (activeTrip) {
            // Determine destination based on status
            dest = ['at_pickup', 'assigned'].includes(activeTrip.status)
                ? activeTrip.farmer?.profile?.address?.coordinates
                : activeTrip.distributor?.profile?.address?.coordinates;
        } else if (pendingAssignment) {
            dest = pendingAssignment.farmer?.profile?.address?.coordinates;
        }

        if (dest && isValidCoordinate(dest.lat, dest.lng)) {
            // Open Native Google Maps
            window.open(`https://www.google.com/maps/dir/?api=1&destination=${dest.lat},${dest.lng}`, '_blank');
            // Advance internal UI state to show the "Reached" button
            setNavigationState('navigating');
        } else {
            alert('Coordinates unavailable');
        }
    };

    const handleReachedLocation = async () => {
        if (!activeTrip) return;
        setToggleLoading(true);
        try {
            // If at pickup -> going to in-transit
            if (activeTrip.status === 'at_pickup') {
                await api.shipment.updateStatus(activeTrip._id, 'in-transit');
            }
            // If in transit -> going to delivered
            else if (activeTrip.status === 'in-transit' || activeTrip.status === 'in_transit') {
                await api.shipment.updateStatus(activeTrip._id, 'delivered');
            }
            setNavigationState('idle'); // Reset UI state for next phase
            await loadAssignments();
        } catch (e) {
            console.error(e);
            alert('Failed to update status');
        } finally {
            setToggleLoading(false);
        }
    };

    const completedCount = allShipments.filter(s => ['delivered', 'completed'].includes(s.status)).length;
    const hasValidLocation = location && isValidCoordinate(location.lat, location.lng);
    const mapCenter = hasValidLocation ? [location.lat, location.lng] : [20.5937, 78.9629];

    return (
        <div className="flex flex-col h-screen bg-slate-100">
            {/* --- Header --- */}
            <header className="bg-white shadow-sm z-[500] relative">
                <div className="p-4 flex justify-between items-stretch">
                    {/* Left: Driver Stats */}
                    <div className="flex flex-col justify-center">
                        <h1 className="text-lg font-bold text-slate-800 leading-tight">
                            {driverProfile?.fullName || 'Driver'}
                        </h1>
                        <p className="text-xs text-slate-500 font-medium mb-2">
                            {driverProfile?.assignedVehicle?.name || 'No Vehicle Assigned'}
                        </p>
                        <div className="flex items-center gap-2 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100 w-fit">
                            <CheckCircle size={12} className="text-emerald-500" />
                            <span className="text-xs font-bold text-slate-700">{completedCount} Completed</span>
                        </div>
                    </div>

                    {/* Right: Duty Switch */}
                    <div className="flex items-center">
                        <DutyToggle
                            status={dutyStatus}
                            onToggle={handleToggleDuty}
                            loading={toggleLoading}
                        />
                    </div>
                </div>
            </header>

            {/* --- Main Content --- */}
            <main className="flex-1 relative overflow-hidden">

                {/* 1. Map View (Home) */}
                {currentTab === 'home' && (
                    <div className="absolute inset-0">
                        <MapContainer
                            center={mapCenter}
                            zoom={14}
                            zoomControl={false}
                            className="w-full h-full"
                        >
                            <TileLayer
                                attribution='&copy; OpenStreetMap'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <MapController center={mapCenter} />

                            {hasValidLocation && (
                                <Marker position={[location.lat, location.lng]} icon={driverIcon} />
                            )}

                            {/* Trip Markers */}
                            {(activeTrip || pendingAssignment) && (() => {
                                const trip = activeTrip || pendingAssignment;
                                const target = ['at_pickup', 'assigned'].includes(trip.status)
                                    ? trip.farmer?.profile
                                    : trip.distributor?.profile;
                                const coords = target?.address?.coordinates;
                                if (coords && isValidCoordinate(coords.lat, coords.lng)) {
                                    return <Marker position={[coords.lat, coords.lng]} icon={farmIcon} />;
                                }
                                return null;
                            })()}
                        </MapContainer>

                        {/* Floating Locate Button */}
                        <button
                            onClick={() => {
                                if (navigator.geolocation) {
                                    navigator.geolocation.getCurrentPosition(
                                        (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude })
                                    );
                                }
                            }}
                            className="absolute bottom-6 right-4 z-[400] bg-white p-3 rounded-full shadow-lg border border-slate-200"
                        >
                            <Locate size={20} className="text-slate-600" />
                        </button>

                        {/* Assignment Layers */}
                        <AssignmentPopup
                            assignment={pendingAssignment}
                            onAccept={handleAccept}
                            onReject={() => setPendingAssignment(null)}
                            onNavigate={handleNavigate}
                            loading={toggleLoading}
                        />

                        {/* Active Trip Action Card - Workflow UI */}
                        {activeTrip && !pendingAssignment && (
                            <div className="absolute bottom-4 left-4 right-4 z-[400] animate-in slide-in-from-bottom-4">
                                <div className="bg-white rounded-2xl shadow-xl p-5 border border-slate-200">
                                    <div className="flex flex-col gap-4">
                                        {/* Trip Info Header */}
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-bold text-slate-800 text-lg">
                                                    {activeTrip.status === 'at_pickup' ? 'Heading to Farm' : 'On Route to Distributor'}
                                                </h3>
                                                <p className="text-sm text-slate-500">
                                                    {activeTrip.status === 'at_pickup'
                                                        ? `Pickup: ${activeTrip.farmer?.profile?.city || 'Farm Location'}`
                                                        : `Dropoff: ${activeTrip.distributor?.profile?.city || 'Distributor Location'}`
                                                    }
                                                </p>
                                            </div>
                                            <div className={`p-2 rounded-lg ${activeTrip.status === 'at_pickup' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                                                {activeTrip.status === 'at_pickup' ? <Truck size={20} /> : <Navigation size={20} />}
                                            </div>
                                        </div>

                                        {/* Action Buttons - The User Workflow */}
                                        <div className="flex flex-col gap-2">
                                            {/* Step 1 & 3: Navigation */}
                                            {navigationState === 'idle' && (
                                                <button
                                                    onClick={handleNavigate}
                                                    className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-blue-500/30 hover:bg-blue-700 active:scale-95 transition-all"
                                                >
                                                    <Navigation size={18} />
                                                    {activeTrip.status === 'at_pickup' ? 'Navigate to Farm' : 'Navigate to Distributor'}
                                                </button>
                                            )}

                                            {/* Step 2 & 4: Arrival/Completion */}
                                            {navigationState === 'navigating' && (
                                                <button
                                                    onClick={handleReachedLocation}
                                                    disabled={toggleLoading}
                                                    className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-emerald-500/30 hover:bg-emerald-700 active:scale-95 transition-all animate-pulse"
                                                >
                                                    {toggleLoading ? (
                                                        <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                                                    ) : (
                                                        <>
                                                            <MapPin size={18} />
                                                            {activeTrip.status === 'at_pickup' ? 'Reached Farm' : 'Order Delivered'}
                                                        </>
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* 2. Assignments View */}
                {currentTab === 'assignments' && (
                    <AssignmentsView shipments={allShipments} />
                )}

                {/* 3. Profile View */}
                {currentTab === 'profile' && (
                    <ProfileView
                        driver={driverProfile}
                        onLogout={() => { authHelpers.logout(); navigate('/login'); }}
                    />
                )}
            </main>

            {/* --- Bottom Navigation --- */}
            <nav className="bg-white border-t border-slate-200 flex justify-around items-center p-2 pb-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-[600]">
                <button
                    onClick={() => setCurrentTab('home')}
                    className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all w-20 ${currentTab === 'home' ? 'text-emerald-600 bg-emerald-50' : 'text-slate-400'}`}
                >
                    <Home size={24} strokeWidth={currentTab === 'home' ? 2.5 : 2} />
                    <span className="text-[10px] font-bold">Home</span>
                </button>

                <button
                    onClick={() => setCurrentTab('assignments')}
                    className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all w-20 ${currentTab === 'assignments' ? 'text-emerald-600 bg-emerald-50' : 'text-slate-400'}`}
                >
                    <ClipboardList size={24} strokeWidth={currentTab === 'assignments' ? 2.5 : 2} />
                    <span className="text-[10px] font-bold">Orders</span>
                </button>

                <button
                    onClick={() => setCurrentTab('profile')}
                    className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all w-20 ${currentTab === 'profile' ? 'text-emerald-600 bg-emerald-50' : 'text-slate-400'}`}
                >
                    <User size={24} strokeWidth={currentTab === 'profile' ? 2.5 : 2} />
                    <span className="text-[10px] font-bold">Profile</span>
                </button>
            </nav>
        </div>
    );
};

export default DriverDashboard;
