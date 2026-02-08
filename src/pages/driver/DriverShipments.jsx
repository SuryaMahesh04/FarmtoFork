import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, MapPin, Clock, Calendar, CheckCircle, Truck, Navigation, XCircle } from 'lucide-react';
import { api } from '../../utils/api';
import LeafletMap from '../../components/map/LeafletMap';
import Button from '../../components/ui/Button';

const DriverShipments = () => {
    const navigate = useNavigate();
    const [activeTrip, setActiveTrip] = useState(null);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [pastTrips, setPastTrips] = useState([]);
    const [stats, setStats] = useState({ active: 0, completed: 0, requests: 0 });
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        loadShipments();
    }, []);

    const loadShipments = async () => {
        try {
            setLoading(true);
            const response = await api.shipment.getAll();

            if (response.success) {
                const myShipments = response.data;

                // Pending Requests: assigned to driver but driver hasn't accepted
                // Logic: status 'assigned' AND (driverStatus 'pending' OR 'assigned')?
                // Actually the backend sets status='assigned' when driver is assigned.
                // We need a way to distinguish "New Request" vs "Active Job".
                // Usually driverStatus='pending' means new request.
                const pending = myShipments.filter(s => s.status === 'assigned' && s.driverStatus === 'pending');

                // Active: Accepted and in progress
                const active = myShipments.find(s =>
                    (s.driverStatus === 'accepted' && ['assigned', 'at_pickup', 'picked_up', 'in-transit'].includes(s.status)) ||
                    (s.driverStatus === 'pending' && s.status !== 'assigned') // Fallback
                );

                const past = myShipments.filter(s => ['delivered', 'rejected', 'cancelled', 'completed'].includes(s.status));

                setPendingRequests(pending);
                setActiveTrip(active);
                setPastTrips(past);
                setStats({
                    active: active ? 1 : 0,
                    completed: past.length,
                    requests: pending.length
                });
            }
        } catch (error) {
            console.error('Failed to load shipments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAcceptRequest = async (shipmentId) => {
        try {
            setActionLoading(true);
            // When driver accepts, update status to 'at_pickup' which indicates driver is heading to farm
            // This will also set driverStatus to 'accepted' in the backend
            const response = await api.shipment.updateStatus(shipmentId, 'at_pickup');
            if (response.success) {
                await loadShipments(); // Reload to show the accepted job as active trip
            }
        } catch (error) {
            console.error('Failed to accept request:', error);
        } finally {
            setActionLoading(false);
        }
    };

    const handleUpdateStatus = async (shipmentId, newStatus) => {
        try {
            setActionLoading(true);
            const response = await api.shipment.updateStatus(shipmentId, newStatus);
            if (response.success) {
                await loadShipments(); // Reload to get fresh data/status
            }
        } catch (error) {
            console.error('Failed to update status:', error);
        } finally {
            setActionLoading(false);
        }
    };

    const openGoogleMaps = (location, label) => {
        if (!location?.coordinates) return;
        const { lat, lng } = location.coordinates;
        const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
        window.open(url, '_blank');
    };

    // Helper to get current target based on status
    const getTargetLocation = (trip) => {
        if (['assigned', 'at_pickup'].includes(trip.status)) {
            // Check if coordinates exist, otherwise let LeafletMap geocode using the label
            const coords = trip.farmer?.profile?.address?.coordinates || null;
            const label = trip.farmer?.profile?.city
                ? `${trip.farmer.profile.city}, ${trip.farmer.profile.state || 'India'}`
                : 'Farm Location';

            return {
                coords: coords,
                label: label,
                type: 'Pickup'
            };
        }
        if (['picked_up', 'in-transit'].includes(trip.status)) {
            // Check if coordinates exist, otherwise let LeafletMap geocode using the label
            const coords = trip.distributor?.profile?.address?.coordinates || null;
            const label = trip.distributor?.profile?.city
                ? `${trip.distributor.profile.city}, ${trip.distributor.profile.state || 'India'}`
                : 'Distributor Location';

            return {
                coords: coords,
                label: label,
                type: 'Dropoff'
            };
        }
        return null; // For delivered/completed
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-20 md:pb-0">
            <header className="bg-white px-4 py-4 border-b border-slate-200 sticky top-0 z-20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate('/driver')} className="p-2 -ml-2 hover:bg-slate-100 rounded-full">
                        <ArrowLeft size={20} className="text-slate-700" />
                    </button>
                    <h1 className="text-lg font-bold text-slate-800">My Jobs</h1>
                </div>
                <div className="flex gap-2">
                    <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-1 rounded-full">
                        {stats.active} Active
                    </span>
                </div>
            </header>

            <div className="p-4 space-y-6">

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                        <Truck size={32} className="animate-bounce mb-2 opacity-20" />
                        <p className="text-sm">Loading trips...</p>
                    </div>
                ) : activeTrip ? (
                    <div className="bg-white rounded-xl border border-emerald-100 shadow-lg overflow-hidden animate-in fade-in slide-in-from-bottom-4">
                        {/* Status Header */}
                        <div className="bg-emerald-600 px-4 py-3 flex justify-between items-center text-white">
                            <span className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                                <Truck size={16} />
                                {activeTrip.status.replace('_', ' ')}
                            </span>
                            <span className="text-xs font-mono opacity-80">#{activeTrip.shipmentId}</span>
                        </div>

                        {/* Map Section */}
                        <div className="h-48 bg-slate-100 relative">
                            {/* Logic: 
                                - parsedStatus 'assigned'/'at_pickup' -> Show Farm
                                - parsedStatus 'picked_up'/'in-transit' -> Show Distributor
                            */}
                            {(() => {
                                const target = getTargetLocation(activeTrip);
                                if (!target) return null; // Should not happen for active

                                return (
                                    <LeafletMap
                                        className="w-full h-full z-0"
                                        destination={target.coords}
                                        destinationLabel={target.label}
                                    // Origin can be implicit or simulated
                                    />
                                );
                            })()}

                            {/* Floating Navigate Button */}
                            <div className="absolute bottom-4 right-4 z-[400]">
                                <button
                                    onClick={() => {
                                        const target = getTargetLocation(activeTrip);
                                        if (target) openGoogleMaps({ coordinates: target.coords }, target.label);
                                    }}
                                    className="flex items-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-full shadow-lg font-bold text-sm border border-blue-100 hover:bg-blue-50 active:scale-95 transition-all"
                                >
                                    <Navigation size={16} className="fill-blue-600" />
                                    Navigate to {getTargetLocation(activeTrip)?.type}
                                </button>
                            </div>
                        </div>

                        {/* Details & Actions */}
                        <div className="p-5 space-y-6">

                            {/* Trip Info */}
                            <div className="flex gap-4">
                                <div className="flex flex-col items-center gap-1 pt-1">
                                    <div className={`w-3 h-3 rounded-full ${['assigned', 'at_pickup'].includes(activeTrip.status) ? 'bg-emerald-500 ring-4 ring-emerald-100' : 'bg-slate-300'}`}></div>
                                    <div className="w-0.5 h-full bg-slate-200 border-l border-dashed border-slate-300 min-h-[40px]"></div>
                                    <div className={`w-3 h-3 rounded-full ${['picked_up', 'in-transit', 'delivered'].includes(activeTrip.status) ? 'bg-red-500 ring-4 ring-red-100' : 'bg-slate-300'}`}></div>
                                </div>
                                <div className="flex-1 space-y-6">
                                    <div className={['assigned', 'at_pickup'].includes(activeTrip.status) ? 'opacity-100' : 'opacity-60'}>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Pickup Information</p>
                                        <h3 className="font-bold text-slate-800 text-lg">{activeTrip.farmer?.profile?.fullName}</h3>
                                        <p className="text-sm text-slate-600">{activeTrip.farmer?.profile?.city}, {activeTrip.farmer?.profile?.state}</p>
                                        <p className="text-xs text-slate-500 mt-1">{activeTrip.farmer?.profile?.mobile}</p>
                                    </div>
                                    <div className={['picked_up', 'in-transit', 'delivered'].includes(activeTrip.status) ? 'opacity-100' : 'opacity-60'}>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Dropoff Information</p>
                                        <h3 className="font-bold text-slate-800 text-lg">{activeTrip.distributor?.profile?.fullName || activeTrip.distributor?.profile?.companyName}</h3>
                                        <p className="text-sm text-slate-600">{activeTrip.distributor?.profile?.city}, {activeTrip.distributor?.profile?.state}</p>
                                        <p className="text-xs text-slate-500 mt-1">{activeTrip.distributor?.profile?.mobile}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Cargo Info Card */}
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center gap-4">
                                <div className="p-3 bg-white rounded-lg shadow-sm text-emerald-600">
                                    <Package size={24} />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-bold uppercase">Cargo Details</p>
                                    <p className="font-bold text-slate-800">{activeTrip.batch?.crop} ({activeTrip.batch?.variety})</p>
                                    <p className="text-sm text-slate-600">{activeTrip.batch?.quantity} {activeTrip.batch?.unit} • {activeTrip.batch?.quality || 'Standard'}</p>
                                </div>
                            </div>

                            {/* Action Buttons Workflow */}
                            <div className="pt-2">
                                {activeTrip.status === 'assigned' && (
                                    <Button
                                        onClick={() => handleUpdateStatus(activeTrip._id, 'at_pickup')}
                                        loading={actionLoading}
                                        className="w-full justify-center py-4 text-base shadow-emerald-500/20"
                                    >
                                        I have Reached the Farm
                                    </Button>
                                )}

                                {activeTrip.status === 'at_pickup' && (
                                    <Button
                                        onClick={() => handleUpdateStatus(activeTrip._id, 'picked_up')}
                                        loading={actionLoading}
                                        className="w-full justify-center py-4 text-base shadow-emerald-500/20"
                                    >
                                        Pickup Complete (Verify Cargo)
                                    </Button>
                                )}

                                {activeTrip.status === 'picked_up' && (
                                    <Button
                                        onClick={() => handleUpdateStatus(activeTrip._id, 'in-transit')}
                                        loading={actionLoading}
                                        className="w-full justify-center py-4 text-base bg-blue-600 hover:bg-blue-700 shadow-blue-500/20"
                                    >
                                        Start Journey to Distributor
                                    </Button>
                                )}

                                {activeTrip.status === 'in-transit' && (
                                    <Button
                                        onClick={() => handleUpdateStatus(activeTrip._id, 'delivered')}
                                        loading={actionLoading}
                                        className="w-full justify-center py-4 text-base bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20"
                                    >
                                        Arrived at Distributor (Deliver)
                                    </Button>
                                )}
                            </div>

                        </div>
                    </div>
                ) : pendingRequests.length > 0 ? (
                    <div className="space-y-4">
                        <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider opacity-60">Pending Job Requests</h3>
                        {pendingRequests.map(request => (
                            <div key={request._id} className="bg-white rounded-xl border border-blue-100 shadow-lg overflow-hidden">
                                <div className="bg-blue-600 px-4 py-3 flex justify-between items-center text-white">
                                    <span className="text-sm font-bold uppercase tracking-wider">New Assignment</span>
                                    <span className="text-xs font-mono opacity-80">#{request.shipmentId}</span>
                                </div>
                                <div className="p-4 space-y-3">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                                            <Package className="text-emerald-600" size={20} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold text-slate-800">{request.batch?.crop || 'Produce'}</p>
                                            <p className="text-sm text-slate-500">{request.batch?.quantity} {request.batch?.unit}</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div>
                                            <p className="text-xs text-slate-400 font-semibold uppercase">Pickup</p>
                                            <p className="text-slate-700 font-medium">{request.farmer?.profile?.city || 'Farm Location'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-400 font-semibold uppercase">Delivery</p>
                                            <p className="text-slate-700 font-medium">{request.distributor?.profile?.city || 'Distributor'}</p>
                                        </div>
                                    </div>
                                    <div className="pt-3 border-t border-slate-100">
                                        <Button
                                            onClick={() => handleAcceptRequest(request._id)}
                                            loading={actionLoading}
                                            className="w-full justify-center py-3 text-base shadow-blue-500/20"
                                        >
                                            Accept Job
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white rounded-xl border border-slate-100 border-dashed">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Truck className="text-slate-300" size={32} />
                        </div>
                        <h3 className="font-bold text-slate-800 mb-1">No Active Jobs</h3>
                        <p className="text-slate-500 text-sm max-w-xs mx-auto">You don't have any active shipments at the moment. Wait for a transporter to assign you a job.</p>
                    </div>
                )}

                {/* Past Trips Section */}
                {pastTrips.length > 0 && (
                    <div className="pt-4">
                        <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-4 opacity-60">Completed Trips</h3>
                        <div className="space-y-3">
                            {pastTrips.map(trip => (
                                <div key={trip._id} className="bg-white rounded-xl border border-slate-100 p-4 opacity-75 hover:opacity-100 transition-opacity">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <p className="font-bold text-slate-800">{trip.batch?.crop}</p>
                                            <p className="text-xs text-slate-400">{new Date(trip.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-bold uppercase">
                                            {trip.status}
                                        </span>
                                    </div>
                                    <div className="text-xs text-slate-500 flex items-center gap-2">
                                        <span>{trip.origin || trip.farmer?.profile?.city}</span>
                                        <span>→</span>
                                        <span>{trip.destination || trip.distributor?.profile?.city}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DriverShipments;
