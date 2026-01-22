import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Truck, MapPin, Package, User, Clock, CheckCircle, XCircle, Navigation, Calendar } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/ui/Button';
import StatusBadge from '../../components/ui/StatusBadge';
import useMediaQuery from '../../utils/useMediaQuery';

// Mock shipment data
// Mock shipment data removed

import { getNavigationUrl } from '../../utils/googleMaps';

const ShipmentDetail = ({ role: propsRole }) => {
    // Determine role from props or fallback to URL path check or auth
    // Ideally passed via App.jsx route
    const { shipmentId } = useParams();
    const navigate = useNavigate();
    const isMobile = useMediaQuery('(max-width: 768px)');

    // Quick fallback/deduction if not passed
    const locationRole = propsRole || (window.location.pathname.includes('transporter') ? 'transporter' :
        window.location.pathname.includes('distributor') ? 'distributor' : 'farmer');

    // Auth role check removed (unused)

    const [shipment, setShipment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updatingStatus, setUpdatingStatus] = useState(null); // Track which status is being updated

    useEffect(() => {
        fetchShipmentDetails();
    }, [shipmentId]);

    const fetchShipmentDetails = async () => {
        try {
            setLoading(true);
            const response = await api.request(`/shipments/${shipmentId}`);
            if (response.success) {
                setShipment(response.data);
            }
        } catch (error) {
            console.error('Error fetching shipment:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (newStatus) => {
        try {
            setUpdatingStatus(newStatus);
            const response = await api.shipment.updateStatus(shipmentId, newStatus);
            if (response.success) {
                // Update local state immediately
                setShipment(response.data);
                // Force page reload as explicitly requested by user to ensure UI updates
                window.location.reload();
            }
        } catch (error) {
            console.error(`Failed to update status to ${newStatus}`, error);
        } finally {
            setUpdatingStatus(null);
        }
    };

    if (loading) {
        return (
            <DashboardLayout role={locationRole}>
                <div className="flex justify-center items-center h-96">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
                </div>
            </DashboardLayout>
        );
    }

    if (!shipment) {
        return (
            <DashboardLayout role={locationRole}>
                <div className="text-center py-12">
                    <Package className="mx-auto text-slate-300 mb-4" size={48} />
                    <h2 className="text-xl font-bold text-slate-700 mb-2">Shipment Not Found</h2>
                    <Button onClick={() => navigate(`/${locationRole}/shipments`)}>Back to Shipments</Button>
                </div>
            </DashboardLayout>
        );
    }

    const getProgress = (status) => {
        switch (status) {
            case 'delivered': return 100;
            case 'in-transit': return 90;
            case 'picked_up': return 75;
            case 'at_pickup': return 50;
            case 'accepted': return 25;
            default: return 0;
        }
    };

    const getCurrentLocation = (s) => {
        if (s.trackingUpdates && s.trackingUpdates.length > 0) {
            return s.trackingUpdates[s.trackingUpdates.length - 1].location || 'In Transit';
        }
        return s.status === 'pending' ? 'Processing Request' : 'Order Confirmed';
    };

    const progressValue = getProgress(shipment.status);
    const currentLocation = getCurrentLocation(shipment);

    return (
        <DashboardLayout role={locationRole}>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4 animate-in">
                    <button
                        onClick={() => navigate(`/${locationRole}/shipments`)}
                        className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div className="flex-1">
                        <h1 className="text-xl md:text-2xl font-display font-bold text-slate-800">
                            Shipment {shipment.shipmentId}
                        </h1>
                        <p className="text-sm md:text-base text-slate-500">
                            From {shipment.farmer?.profile?.fullName || 'Farmer'}
                        </p>
                    </div>

                    {/* Action Buttons Area */}
                    <div className="flex gap-2 items-center">

                        {/* --- Distributor Actions --- */}
                        {locationRole === 'distributor' && (
                            <>
                                {(!shipment.distributorStatus || shipment.distributorStatus === 'pending') && shipment.status === 'pending' && (
                                    <div className="flex gap-2">
                                        <Button
                                            onClick={() => handleStatusUpdate('accepted')}
                                            isLoading={updatingStatus === 'accepted'}
                                            className="bg-emerald-600 hover:bg-emerald-700"
                                            icon={CheckCircle}
                                        >
                                            Accept
                                        </Button>
                                        <Button
                                            onClick={() => handleStatusUpdate('rejected')}
                                            isLoading={updatingStatus === 'rejected'}
                                            className="bg-red-600 hover:bg-red-700 border-red-200 text-white"
                                            icon={XCircle}
                                        >
                                            Decline
                                        </Button>
                                    </div>
                                )}
                                {shipment.distributorStatus === 'accepted' && shipment.status === 'pending' && (
                                    <div className="px-4 py-2 bg-amber-50 text-amber-700 rounded-lg text-sm font-medium border border-amber-200 flex items-center gap-2">
                                        <Clock size={16} /> Waiting for Transporter...
                                    </div>
                                )}
                            </>
                        )}

                        {/* --- Transporter Actions --- */}
                        {locationRole === 'transporter' && (
                            <>
                                {/* 0. Initial Acceptance */}
                                {(!shipment.transporterStatus || shipment.transporterStatus === 'pending') && shipment.status === 'pending' && (
                                    <div className="flex gap-2">
                                        <Button
                                            onClick={() => handleStatusUpdate('accepted')}
                                            isLoading={updatingStatus === 'accepted'}
                                            className="bg-emerald-600 hover:bg-emerald-700"
                                            icon={CheckCircle}
                                        >
                                            Accept
                                        </Button>
                                        <Button
                                            onClick={() => handleStatusUpdate('rejected')}
                                            isLoading={updatingStatus === 'rejected'}
                                            className="bg-red-600 hover:bg-red-700 border-red-200 text-white"
                                            icon={XCircle}
                                        >
                                            Decline
                                        </Button>
                                    </div>
                                )}

                                {/* Waiting State */}
                                {shipment.transporterStatus === 'accepted' && shipment.status === 'pending' && (
                                    <div className="px-4 py-2 bg-amber-50 text-amber-700 rounded-lg text-sm font-medium border border-amber-200 flex items-center gap-2">
                                        <Clock size={16} /> Waiting for Distributor...
                                    </div>
                                )}

                                {/* 1. Global Accepted -> Navigate to Farm */}
                                {shipment.status === 'accepted' && (
                                    <>
                                        <Button
                                            onClick={() => window.open(getNavigationUrl(
                                                shipment.farmer?.profile?.address,
                                                shipment.transporter?.profile?.address
                                            ), '_blank')}
                                            className="bg-blue-600 hover:bg-blue-700"
                                            icon={Navigation}
                                        >
                                            Navigate to Farm
                                        </Button>
                                        <Button
                                            onClick={() => handleStatusUpdate('at_pickup')}
                                            isLoading={updatingStatus === 'at_pickup'}
                                            className="bg-emerald-600 hover:bg-emerald-700"
                                            icon={MapPin}
                                        >
                                            Reached Farm
                                        </Button>
                                    </>
                                )}

                                {/* 2. At Pickup -> Picked Up Cargo */}
                                {shipment.status === 'at_pickup' && (
                                    <Button
                                        onClick={() => handleStatusUpdate('picked_up')}
                                        isLoading={updatingStatus === 'picked_up'}
                                        className="bg-emerald-600 hover:bg-emerald-700"
                                        icon={Package}
                                    >
                                        Picked Up Cargo
                                    </Button>
                                )}

                                {/* 3. Picked Up -> Navigate to Distributor */}
                                {shipment.status === 'picked_up' && (
                                    <>
                                        <Button
                                            onClick={() => window.open(getNavigationUrl(
                                                shipment.distributor?.profile?.address,
                                                shipment.farmer?.profile?.address
                                            ), '_blank')}
                                            className="bg-blue-600 hover:bg-blue-700"
                                            icon={Navigation}
                                        >
                                            Navigate to Distributor
                                        </Button>
                                        <Button
                                            onClick={() => handleStatusUpdate('in-transit')}
                                            isLoading={updatingStatus === 'in-transit'}
                                            className="bg-emerald-600 hover:bg-emerald-700"
                                            icon={Truck}
                                        >
                                            Start Journey
                                        </Button>
                                    </>
                                )}

                                {/* 4. In Transit -> Mark Delivered */}
                                {shipment.status === 'in-transit' && (
                                    <Button
                                        onClick={() => handleStatusUpdate('delivered')}
                                        isLoading={updatingStatus === 'delivered'}
                                        className="bg-emerald-600 hover:bg-emerald-700"
                                        icon={CheckCircle}
                                    >
                                        Mark Delivered
                                    </Button>
                                )}
                            </>
                        )}
                    </div>

                    <StatusBadge status={shipment.status} />
                </div>

                {/* Progress Bar */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 animate-in" style={{ animationDelay: '0.1s' }}>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-slate-600">Delivery Progress</span>
                        <span className="text-sm font-bold text-blue-600">{progressValue}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-3">
                        <div
                            className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${progressValue}%` }}
                        ></div>
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-slate-500">
                        <span>{shipment.origin?.city || shipment.farmer?.profile?.city || 'Origin'}</span>
                        <span className="font-medium text-blue-600">{currentLocation}</span>
                        <span>{shipment.destination?.city || shipment.distributor?.profile?.city || 'Destination'}</span>
                    </div>
                </div>

                <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-3 gap-6'}`}>
                    {/* Main Content - Timeline */}
                    <div className={`${isMobile ? '' : 'col-span-2'} space-y-6`}>

                        {/* Approval Timeline (New Feature) */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 animate-in">
                            <h2 className="text-lg font-display font-semibold text-slate-800 mb-6 flex items-center gap-2">
                                <CheckCircle className="text-emerald-600" size={20} />
                                Approval Status
                            </h2>
                            <div className="space-y-6">
                                {/* 1. Request Created (Always Done) */}
                                <div className="flex gap-4">
                                    <div className="flex flex-col items-center">
                                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center border-2 border-emerald-500">
                                            1
                                        </div>
                                        <div className="w-0.5 h-12 bg-emerald-500"></div>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-800">Shipment Requested</h3>
                                        <p className="text-sm text-slate-500">Request created by Farmer</p>
                                    </div>
                                </div>

                                {/* Dynamic Approval Steps */}
                                {[
                                    {
                                        role: 'Transporter',
                                        status: shipment.transporterStatus || 'pending', // Check granular status
                                        name: shipment.transporter?.profile?.companyName || 'Transporter',
                                        isMe: locationRole === 'transporter'
                                    },
                                    {
                                        role: 'Distributor',
                                        status: shipment.distributorStatus || 'pending',
                                        name: shipment.distributor?.profile?.companyName || 'Distributor',
                                        isMe: locationRole === 'distributor'
                                    }
                                ].sort((a, b) => {
                                    // Put accepted items first to mimic "Who accepted first" logic visually
                                    if (a.status === 'accepted' && b.status !== 'accepted') return -1;
                                    if (b.status === 'accepted' && a.status !== 'accepted') return 1;
                                    return 0;
                                }).map((party, index) => (
                                    <div key={party.role} className="flex gap-4">
                                        <div className="flex flex-col items-center">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${party.status === 'accepted'
                                                ? 'bg-emerald-100 text-emerald-600 border-emerald-500'
                                                : 'bg-slate-50 text-slate-400 border-slate-200'
                                                }`}>
                                                {index + 2}
                                            </div>
                                            {index === 0 && <div className={`w-0.5 h-12 ${party.status === 'accepted' ? 'bg-emerald-500' : 'bg-slate-200'}`}></div>}
                                        </div>
                                        <div>
                                            <h3 className={`font-semibold ${party.status === 'accepted' ? 'text-slate-800' : 'text-slate-500'}`}>
                                                {party.status === 'accepted'
                                                    ? `${party.role} Accepted`
                                                    : `Waiting for ${party.role} Acceptance`}
                                            </h3>
                                            <p className="text-sm text-slate-500">
                                                {party.name} • <span className="capitalize">
                                                    {(party.status || '')
                                                        .replace(/_/g, ' ')
                                                        .replace(/-/g, ' ')
                                                        .replace(/\b\w/g, c => c.toUpperCase())}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Live Tracking (Moved down) */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 animate-in" style={{ animationDelay: '0.2s' }}>
                            <h2 className="text-lg font-display font-semibold text-slate-800 mb-6 flex items-center gap-2">
                                <Navigation className="text-blue-600" size={20} />
                                Live Tracking
                            </h2>
                            <div className="space-y-6">
                                {(shipment.trackingUpdates || []).length > 0 ? (
                                    (shipment.trackingUpdates || []).map((event, index) => (
                                        <div key={index} className="flex gap-4">
                                            {/* Timeline Icon */}
                                            <div className="flex flex-col items-center">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${index === 0 ? 'bg-blue-600' : 'bg-emerald-600'
                                                    }`}>
                                                    <CheckCircle className="text-white" size={18} />
                                                </div>
                                                {index < (shipment.trackingUpdates || []).length - 1 && (
                                                    <div className="w-0.5 h-12 bg-slate-200"></div>
                                                )}
                                            </div>

                                            {/* Event Details */}
                                            <div className="flex-1 pb-6">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <h3 className="font-semibold text-slate-800">
                                                            {(event.status || '')
                                                                .replace(/_/g, ' ')
                                                                .replace(/-/g, ' ')
                                                                .replace(/\b\w/g, c => c.toUpperCase())}
                                                        </h3>
                                                        <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                                                            <MapPin size={14} />
                                                            {event.location || 'Unknown Location'}
                                                        </p>
                                                    </div>
                                                    <span className="text-xs text-slate-400 whitespace-nowrap ml-2">
                                                        {new Date(event.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                                {event.notes && <p className="text-sm text-slate-500 mt-1">{event.notes}</p>}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-slate-500 text-center py-4">No tracking updates yet.</p>
                                )}
                            </div>
                        </div>

                        {/* Route & Cargo Info */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                            <h2 className="text-lg font-display font-semibold text-slate-800 mb-4">Route Details</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-slate-500 mb-1">Origin</p>
                                    <p className="font-semibold text-slate-800">{shipment.origin?.city || shipment.farmer?.profile?.city || 'Unknown'}</p>
                                    <p className="text-sm text-slate-500">{shipment.origin?.state || shipment.farmer?.profile?.state || ''}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 mb-1">Destination</p>
                                    <p className="font-semibold text-slate-800">{shipment.destination?.city || shipment.distributor?.profile?.city || 'Unknown'}</p>
                                    <p className="text-sm text-slate-500">{shipment.destination?.state || shipment.distributor?.profile?.state || ''}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 mb-1">Total Distance</p>
                                    <p className="font-semibold text-slate-800">{shipment.distance || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 mb-1">Date Created</p>
                                    <p className="font-semibold text-blue-600">{new Date(shipment.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar - Details */}
                    <div className="space-y-6">
                        {/* Cargo Details */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 animate-in" style={{ animationDelay: '0.3s' }}>
                            <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                                <Package size={18} className="text-emerald-600" />
                                Cargo Details
                            </h3>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-xs text-slate-500">Crop</p>
                                    <p className="font-medium text-slate-800">{shipment.batch?.crop || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">Variety</p>
                                    <p className="font-medium text-slate-800">{shipment.batch?.variety || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">Quantity</p>
                                    <p className="font-medium text-slate-800">{shipment.batch?.quantity ? `${shipment.batch.quantity} Tons` : 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">Batch ID</p>
                                    <p className="font-medium text-blue-600">{shipment.batch?.batchId || 'N/A'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Vehicle Details */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                            <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                                <Truck size={18} className="text-blue-600" />
                                Transporter Info
                            </h3>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-xs text-slate-500">Company</p>
                                    <p className="font-medium text-slate-800">{shipment.transporter?.profile?.companyName || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">Contact</p>
                                    <p className="font-medium text-slate-800">{shipment.transporter?.profile?.fullName || 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ShipmentDetail;
