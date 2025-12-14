import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Truck, MapPin, Package, User, Clock, CheckCircle, Navigation, Calendar } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/ui/Button';
import StatusBadge from '../../components/ui/StatusBadge';
import useMediaQuery from '../../utils/useMediaQuery';

// Mock shipment data
const getShipmentData = (id) => {
    const shipments = {
        'TRK-2401': {
            id: 'TRK-2401',
            status: 'in_transit',
            origin: { city: 'Mumbai', state: 'Maharashtra', address: 'Warehouse A, Andheri East' },
            destination: { city: 'Delhi', state: 'Delhi', address: 'Distribution Center, Rohini' },
            cargo: { type: 'Wheat', quantity: '15 Tonnes', batchId: 'BATCH-5678' },
            vehicle: { number: 'MH-01-AB-1234', type: 'Heavy Truck', capacity: '20T' },
            driver: { name: 'Rajesh Kumar', phone: '+91 98765 43210', license: 'DL-2024-001234' },
            distance: '1,420 km',
            startDate: '2024-12-13 08:00 AM',
            estimatedArrival: '2024-12-14 6:00 PM',
            currentLocation: 'Near Vadodara, Gujarat',
            progress: 45,
            timeline: [
                { status: 'Shipment Created', time: '2024-12-13 07:30 AM', location: 'Mumbai', completed: true },
                { status: 'Loaded & Departed', time: '2024-12-13 08:00 AM', location: 'Mumbai Warehouse', completed: true },
                { status: 'Checkpoint: Surat', time: '2024-12-13 12:30 PM', location: 'Surat, Gujarat', completed: true },
                { status: 'Currently Near', time: '2024-12-14 10:30 AM', location: 'Vadodara, Gujarat', completed: true, current: true },
                { status: 'Expected: Ahmedabad', time: '2024-12-14 2:00 PM', location: 'Ahmedabad, Gujarat', completed: false },
                { status: 'Expected: Rajasthan Border', time: '2024-12-14 4:30 PM', location: 'Rajasthan', completed: false },
                { status: 'Arrival at Destination', time: '2024-12-14 6:00 PM', location: 'Delhi', completed: false }
            ]
        }
    };
    return shipments[id] || null;
};

const ShipmentDetail = () => {
    const { shipmentId } = useParams();
    const navigate = useNavigate();
    const isMobile = useMediaQuery('(max-width: 768px)');
    const shipment = getShipmentData(shipmentId);

    if (!shipment) {
        return (
            <DashboardLayout role="transporter">
                <div className="text-center py-12">
                    <Package className="mx-auto text-slate-300 mb-4" size={48} />
                    <h2 className="text-xl font-bold text-slate-700 mb-2">Shipment Not Found</h2>
                    <p className="text-slate-500 mb-4">The shipment you're looking for doesn't exist.</p>
                    <Button onClick={() => navigate('/transporter/shipments')}>Back to Shipments</Button>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout role="transporter">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4 animate-in">
                    <button
                        onClick={() => navigate('/transporter/shipments')}
                        className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div className="flex-1">
                        <h1 className="text-xl md:text-2xl font-display font-bold text-slate-800">
                            Shipment {shipment.id}
                        </h1>
                        <p className="text-sm md:text-base text-slate-500">Live tracking and shipment details</p>
                    </div>
                    <StatusBadge status={shipment.status} />
                </div>

                {/* Progress Bar */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 animate-in" style={{ animationDelay: '0.1s' }}>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-slate-600">Delivery Progress</span>
                        <span className="text-sm font-bold text-blue-600">{shipment.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-3">
                        <div
                            className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${shipment.progress}%` }}
                        ></div>
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-slate-500">
                        <span>{shipment.origin.city}</span>
                        <span className="font-medium text-blue-600">{shipment.currentLocation}</span>
                        <span>{shipment.destination.city}</span>
                    </div>
                </div>

                <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-3 gap-6'}`}>
                    {/* Main Content - Timeline */}
                    <div className={`${isMobile ? '' : 'col-span-2'} space-y-6`}>
                        {/* Live Tracking Timeline */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 animate-in" style={{ animationDelay: '0.2s' }}>
                            <h2 className="text-lg font-display font-semibold text-slate-800 mb-6 flex items-center gap-2">
                                <Navigation className="text-blue-600" size={20} />
                                Live Tracking
                            </h2>
                            <div className="space-y-6">
                                {shipment.timeline.map((event, index) => (
                                    <div key={index} className="flex gap-4">
                                        {/* Timeline Icon */}
                                        <div className="flex flex-col items-center">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${event.completed
                                                ? event.current
                                                    ? 'bg-blue-600 animate-pulse'
                                                    : 'bg-emerald-600'
                                                : 'bg-slate-200'
                                                }`}>
                                                {event.completed ? (
                                                    event.current ? (
                                                        <Truck className="text-white" size={18} />
                                                    ) : (
                                                        <CheckCircle className="text-white" size={18} />
                                                    )
                                                ) : (
                                                    <Clock className="text-slate-400" size={18} />
                                                )}
                                            </div>
                                            {index < shipment.timeline.length - 1 && (
                                                <div className={`w-0.5 h-12 ${event.completed ? 'bg-emerald-300' : 'bg-slate-200'}`}></div>
                                            )}
                                        </div>

                                        {/* Event Details */}
                                        <div className="flex-1 pb-6">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h3 className={`font-semibold ${event.current ? 'text-blue-700' : event.completed ? 'text-slate-800' : 'text-slate-500'
                                                        }`}>
                                                        {event.status}
                                                        {event.current && (
                                                            <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                                                                Current Location
                                                            </span>
                                                        )}
                                                    </h3>
                                                    <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                                                        <MapPin size={14} />
                                                        {event.location}
                                                    </p>
                                                </div>
                                                <span className="text-xs text-slate-400 whitespace-nowrap ml-2">
                                                    {event.time}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Route & Cargo Info */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                            <h2 className="text-lg font-display font-semibold text-slate-800 mb-4">Route Details</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-slate-500 mb-1">Origin</p>
                                    <p className="font-semibold text-slate-800">{shipment.origin.city}, {shipment.origin.state}</p>
                                    <p className="text-sm text-slate-500">{shipment.origin.address}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 mb-1">Destination</p>
                                    <p className="font-semibold text-slate-800">{shipment.destination.city}, {shipment.destination.state}</p>
                                    <p className="text-sm text-slate-500">{shipment.destination.address}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 mb-1">Total Distance</p>
                                    <p className="font-semibold text-slate-800">{shipment.distance}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 mb-1">Est. Arrival</p>
                                    <p className="font-semibold text-blue-600">{shipment.estimatedArrival}</p>
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
                                    <p className="text-xs text-slate-500">Type</p>
                                    <p className="font-medium text-slate-800">{shipment.cargo.type}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">Quantity</p>
                                    <p className="font-medium text-slate-800">{shipment.cargo.quantity}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">Batch ID</p>
                                    <p className="font-medium text-blue-600">{shipment.cargo.batchId}</p>
                                </div>
                            </div>
                        </div>

                        {/* Vehicle Details */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                            <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                                <Truck size={18} className="text-blue-600" />
                                Vehicle Info
                            </h3>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-xs text-slate-500">Vehicle Number</p>
                                    <p className="font-medium text-slate-800">{shipment.vehicle.number}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">Type</p>
                                    <p className="font-medium text-slate-800">{shipment.vehicle.type}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">Capacity</p>
                                    <p className="font-medium text-slate-800">{shipment.vehicle.capacity}</p>
                                </div>
                            </div>
                        </div>

                        {/* Driver Details */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                            <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                                <User size={18} className="text-slate-600" />
                                Driver Info
                            </h3>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-xs text-slate-500">Name</p>
                                    <p className="font-medium text-slate-800">{shipment.driver.name}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">Contact</p>
                                    <p className="font-medium text-slate-800">{shipment.driver.phone}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">License</p>
                                    <p className="font-medium text-slate-800">{shipment.driver.license}</p>
                                </div>
                                <Button variant="outline" size="sm" className="w-full mt-2">
                                    Contact Driver
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ShipmentDetail;
