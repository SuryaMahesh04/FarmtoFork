import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Truck, Calendar, ChevronRight, User, Phone, CheckCircle, Clock } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { api } from '../../utils/api';
import LeafletMap from '../../components/map/LeafletMap';

const ShipmentRequests = () => {
    const [activeTab, setActiveTab] = useState('pending');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [selectedDriverId, setSelectedDriverId] = useState('');
    const [calculatedDistance, setCalculatedDistance] = useState(null);

    // Data State
    const [requests, setRequests] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [shipmentsRes, driversRes] = await Promise.all([
                api.shipment.getAll(),
                api.driver.getAll()
            ]);

            if (shipmentsRes.success) {
                setRequests(shipmentsRes.data);
            }

            if (driversRes.success) {
                setDrivers(driversRes.data);
            }
        } catch (error) {
            console.error('Failed to load data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAssignDriver = async () => {
        if (!selectedDriverId || !selectedRequest) return;

        try {
            const response = await api.shipment.assignDriver(selectedRequest._id, selectedDriverId);

            if (response.success) {
                await loadData();
                setIsAssignModalOpen(false);
                setSelectedDriverId('');

                if (selectedRequest._id === response.data._id) {
                    setSelectedRequest(response.data);
                }
            }
        } catch (error) {
            console.error('Failed to assign driver:', error);
            alert('Failed to assign driver. Please try again.');
        }
    };

    const handleAcceptRequest = async (id) => {
        try {
            await api.shipment.updateStatus(id, 'accepted');
            await loadData();
            if (selectedRequest && selectedRequest._id === id) {
                setSelectedRequest(prev => ({ ...prev, transporterStatus: 'accepted' }));
            }
        } catch (err) {
            console.error(err);
        }
    };

    // Reset distance when request changes
    useEffect(() => {
        if (selectedRequest) {
            // Priority: previously calculated -> hardcoded default -> null
            setCalculatedDistance(selectedRequest.totalDistance || null);
        }
    }, [selectedRequest]);

    // Filter Logic
    const filteredRequests = requests.filter(req => {
        const matchesTab =
            activeTab === 'pending' ? req.transporterStatus === 'pending' :
                activeTab === 'accepted' ? (req.transporterStatus === 'accepted' && req.status !== 'completed' && req.status !== 'cancelled') :
                    activeTab === 'completed' ? req.status === 'completed' :
                        true;

        const matchesSearch =
            (req.shipmentId?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
            (req.batch?.crop?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
            (req.origin?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
            (req.destination?.toLowerCase() || '').includes(searchQuery.toLowerCase());

        return matchesTab && matchesSearch;
    });

    return (
        <DashboardLayout role="transporter">
            <div className="flex h-[calc(100vh-100px)] gap-6">

                {/* Left Panel: Request List */}
                <div className="w-1/3 flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    {/* Header & Search */}
                    <div className="p-4 border-b border-slate-100 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="font-bold text-slate-800 text-lg">Shipment Requests</h2>
                            <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-1 rounded-full">
                                {filteredRequests.length}
                            </span>
                        </div>

                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search ID, Cargo, Location..."
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* Tabs */}
                        <div className="flex p-1 bg-slate-50 rounded-lg">
                            {['pending', 'accepted', 'completed'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all capitalize ${activeTab === tab
                                            ? 'bg-white text-emerald-700 shadow-sm'
                                            : 'text-slate-500 hover:text-slate-700'
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* List */}
                    <div className="flex-1 overflow-y-auto">
                        {loading ? (
                            <div className="p-8 text-center text-slate-400">Loading requests...</div>
                        ) : filteredRequests.length > 0 ? (
                            <div className="divide-y divide-slate-50">
                                {filteredRequests.map(req => (
                                    <div
                                        key={req._id}
                                        onClick={() => setSelectedRequest(req)}
                                        className={`p-4 cursor-pointer transition-colors hover:bg-slate-50 ${selectedRequest?._id === req._id ? 'bg-emerald-50/50 border-l-4 border-emerald-500' : 'border-l-4 border-transparent'
                                            }`}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="font-mono text-xs font-bold text-slate-500">{req.shipmentId}</span>
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${req.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                                    req.status === 'in-transit' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-slate-100 text-slate-600'
                                                }`}>
                                                {req.status?.replace('_', ' ')}
                                            </span>
                                        </div>

                                        <div className="mb-3">
                                            <h3 className="font-bold text-slate-800 text-sm">{req.batch?.crop} - {req.batch?.variety}</h3>
                                            <p className="text-xs text-slate-500">{req.batch?.quantity} {req.batch?.unit}</p>
                                        </div>

                                        <div className="flex items-center gap-2 text-xs text-slate-600 mb-2">
                                            <MapPin size={14} className="text-slate-400" />
                                            <span className="truncate max-w-[100px]">{req.origin || req.farmer?.profile?.city}</span>
                                            <span className="text-slate-300">→</span>
                                            <span className="truncate max-w-[100px]">{req.destination || req.distributor?.profile?.city}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-48 text-slate-400">
                                <Truck size={32} className="mb-2 opacity-20" />
                                <p className="text-sm">No {activeTab} requests</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Panel: Details & Map */}
                <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                    {selectedRequest ? (
                        <>
                            {/* Map Header */}
                            <div className="h-64 bg-slate-100 relative group z-0">
                                <LeafletMap
                                    className="w-full h-full"
                                    // Origin: Try coordinates first, then city/address string
                                    origin={selectedRequest.farmer?.profile?.address?.coordinates}
                                    originLabel={selectedRequest.origin || selectedRequest.farmer?.profile?.city || 'Farm Location'}

                                    // Destination: Try coordinates first, then city/address string
                                    destination={selectedRequest.distributor?.profile?.address?.coordinates}
                                    destinationLabel={selectedRequest.destination || selectedRequest.distributor?.profile?.city || 'Distributor Location'}

                                    onDistanceCalculated={(dist) => setCalculatedDistance(dist)}
                                />
                                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg shadow-sm z-[400] pointer-events-none">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Origin</p>
                                    <p className="text-xs font-semibold text-slate-800 flex items-center gap-1">
                                        <MapPin size={12} className="text-emerald-500" />
                                        {selectedRequest.origin || selectedRequest.farmer?.profile?.city || 'Unknown Location'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6">
                                {/* Header Info */}
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h1 className="text-xl font-bold text-slate-800 mb-1">
                                            {selectedRequest.batch?.crop} Shipment
                                        </h1>
                                        <p className="text-sm text-slate-500 flex items-center gap-2">
                                            <Calendar size={14} />
                                            Created on {new Date(selectedRequest.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        {selectedRequest.transporterStatus === 'pending' && (
                                            <button
                                                onClick={() => handleAcceptRequest(selectedRequest._id)}
                                                className="px-6 py-2 bg-emerald-600 text-white font-bold text-sm rounded-lg shadow-lg shadow-emerald-200 hover:bg-emerald-700 active:scale-95 transition-all"
                                            >
                                                Accept Request
                                            </button>
                                        )}
                                        {selectedRequest.transporterStatus === 'accepted' && (
                                            selectedRequest.driver ? (
                                                <div className="px-4 py-2 bg-blue-50 text-blue-700 font-bold text-sm rounded-lg border border-blue-100 flex items-center gap-2">
                                                    <User size={16} />
                                                    Assigned: {selectedRequest.driver?.profile?.fullName || selectedRequest.driver?.fullName || 'Driver'}
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => setIsAssignModalOpen(true)}
                                                    className="px-6 py-2 bg-blue-600 text-white font-bold text-sm rounded-lg shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all flex items-center gap-2"
                                                >
                                                    <User size={18} />
                                                    Assign Driver
                                                </button>
                                            )
                                        )}
                                    </div>
                                </div>

                                {/* Details Grid */}
                                <div className="grid grid-cols-2 gap-6 mb-8">
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                                                <User size={18} />
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Farmer Details</p>
                                                <p className="font-semibold text-slate-800">{selectedRequest.farmer?.profile?.fullName}</p>
                                                <p className="text-sm text-slate-500 flex items-center gap-1">
                                                    <Phone size={12} /> {selectedRequest.farmer?.profile?.mobile}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                                                <Truck size={18} />
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Logistics</p>
                                                <p className="font-semibold text-slate-800">
                                                    {calculatedDistance ? `${calculatedDistance} km` : 'Calculating...'}
                                                </p>
                                                <p className="text-sm text-slate-500">
                                                    Est. Time: {calculatedDistance ? `${Math.ceil(calculatedDistance / 50)} hrs` : 'Pending'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Cargo Details */}
                                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                                    <h3 className="font-bold text-slate-800 text-sm mb-3">Cargo Specification</h3>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <p className="text-xs text-slate-500">Weight</p>
                                            <p className="font-medium text-slate-800">{selectedRequest.batch?.quantity} {selectedRequest.batch?.unit}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500">Variety</p>
                                            <p className="font-medium text-slate-800">{selectedRequest.batch?.variety}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500">Quality</p>
                                            <p className="font-medium text-slate-800">{selectedRequest.batch?.quality || 'Standard'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                            <Truck size={48} className="mb-4 opacity-20" />
                            <p>Select a shipment request to view details</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Assign Driver Modal */}
            {isAssignModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in z-[1000]">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="font-bold text-lg text-slate-800">Assign Driver</h3>
                            <button onClick={() => setIsAssignModalOpen(false)} className="text-slate-400 hover:text-slate-600">×</button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Select Driver</label>
                                <select
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none bg-slate-50"
                                    value={selectedDriverId}
                                    onChange={(e) => setSelectedDriverId(e.target.value)}
                                >
                                    <option value="">Choose a available driver...</option>
                                    {drivers && drivers.length > 0 ? drivers
                                        .filter(d => d.status === 'Active')
                                        .map(driver => (
                                            <option key={driver._id} value={driver._id}>
                                                {driver.fullName}
                                            </option>
                                        )) : <option disabled>No drivers found</option>}
                                </select>
                            </div>

                            <div className="bg-blue-50 p-4 rounded-xl flex gap-3 text-blue-700 border border-blue-100">
                                <Clock size={20} className="shrink-0" />
                                <div className="text-xs">
                                    <p className="font-bold mb-1">Assignment Note</p>
                                    <p className="opacity-80">Assigning a driver will automatically send them a notification and add this trip to their schedule.</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-slate-50 flex gap-3">
                            <button
                                onClick={() => setIsAssignModalOpen(false)}
                                className="flex-1 py-3 text-slate-600 font-bold text-sm bg-white border border-slate-200 rounded-xl hover:bg-slate-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAssignDriver}
                                disabled={!selectedDriverId}
                                className="flex-1 py-3 bg-emerald-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-200 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Confirm Assignment
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default ShipmentRequests;
