import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Plus, Truck, MapPin, Calendar, ArrowRight } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/ui/Button';
import Loader from '../../components/ui/Loader';
import useMediaQuery from '../../utils/useMediaQuery';
import { api } from '../../utils/api';
import LeafletMap from '../../components/map/LeafletMap';

const Shipments = () => {
    const navigate = useNavigate();
    const isMobile = useMediaQuery('(max-width: 768px)');
    const [filterStatus, setFilterStatus] = useState('All Shipments');
    const [searchQuery, setSearchQuery] = useState('');
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

    // Data State
    const [shipments, setShipments] = useState([]);
    const [loading, setLoading] = useState(true);

    // Initial State Matching Filter Modal
    const [activeFilters, setActiveFilters] = useState({
        types: [],
        status: [],
        origin: '',
        destination: '',
        dateStart: '',
        dateEnd: ''
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const res = await api.shipment.getAll();
            if (res.success) {
                setShipments(res.data);
            }
        } catch (error) {
            console.error('Failed to load shipments:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredShipments = shipments.filter(s => {
        // Tab Status Filter
        if (filterStatus === 'In Transit' && s.status !== 'in-transit') return false;
        if (filterStatus === 'Scheduled' && s.status !== 'pending') return false;
        if (filterStatus === 'Delivered' && s.status !== 'completed') return false;

        // Search Filter
        const matchesSearch =
            (s.shipmentId?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
            (s.origin?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
            (s.destination?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
            (s.batch?.crop?.toLowerCase() || '').includes(searchQuery.toLowerCase());

        if (!matchesSearch) return false;

        return true;
    });

    const tabs = [
        { name: 'All Shipments', count: shipments.length },
        { name: 'In Transit', count: shipments.filter(s => s.status === 'in-transit').length },
        { name: 'Scheduled', count: shipments.filter(s => s.status === 'pending').length },
        { name: 'Delivered', count: shipments.filter(s => s.status === 'completed').length }
    ];

    if (loading) {
        return (
            <DashboardLayout role="transporter">
                <Loader text="Loading shipments..." />
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout role="transporter">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-display font-bold text-slate-800">My Shipments</h1>
                        <p className="text-slate-500">Track and manage all your active shipments</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex flex-wrap gap-3">
                    {tabs.map(tab => (
                        <button
                            key={tab.name}
                            onClick={() => setFilterStatus(tab.name)}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${filterStatus === tab.name
                                    ? 'bg-blue-100 text-blue-700 shadow-sm ring-1 ring-blue-200'
                                    : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
                                }`}
                        >
                            {tab.name}
                            <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold tabular-nums ${filterStatus === tab.name
                                    ? 'bg-blue-200 text-blue-800'
                                    : 'bg-slate-100 text-slate-500'
                                }`}>
                                ({tab.count})
                            </span>
                        </button>
                    ))}
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by ID, crop, origin, or destination..."
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all shadow-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredShipments.length > 0 ? (
                        filteredShipments.map(shipment => (
                            <div
                                key={shipment._id}
                                className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
                                onClick={() => navigate(`/transporter/shipment/${shipment._id}`)}
                            >
                                {/* Mini Map Preview */}
                                <div className="h-32 bg-slate-100 relative">
                                    <LeafletMap
                                        className="w-full h-full pointer-events-none" // Disable interaction for preview
                                        origin={shipment.farmer?.profile?.address?.coordinates}
                                        originLabel={shipment.origin}
                                        destination={shipment.distributor?.profile?.address?.coordinates}
                                        destinationLabel={shipment.destination}
                                    />
                                    <div className="absolute inset-0 bg-slate-900/5 group-hover:bg-slate-900/0 transition-colors pointer-events-none" />

                                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-[10px] font-bold shadow-sm uppercase tracking-wider text-slate-600">
                                        {shipment.status.replace('_', ' ')}
                                    </div>
                                </div>

                                <div className="p-5">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="font-bold text-slate-800 text-lg">{shipment.batch?.crop}</h3>
                                            <p className="text-sm text-slate-500">{shipment.batch?.quantity} {shipment.batch?.unit}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-mono text-slate-400">ID: {shipment.shipmentId}</p>
                                            <p className="text-xs font-bold text-emerald-600 mt-1">{shipment.batch?.variety}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3 mb-4">
                                        <div className="flex items-center gap-3 text-sm text-slate-600">
                                            <div className="w-8 flex justify-center"><MapPin size={16} className="text-emerald-500" /></div>
                                            <span className="truncate flex-1">{shipment.origin || shipment.farmer?.profile?.city || 'Origin'}</span>
                                        </div>
                                        <div className="pl-4 ml-4 border-l-2 border-slate-100 h-2"></div>
                                        <div className="flex items-center gap-3 text-sm text-slate-600">
                                            <div className="w-8 flex justify-center"><MapPin size={16} className="text-red-500" /></div>
                                            <span className="truncate flex-1">{shipment.destination || shipment.distributor?.profile?.city || 'Destination'}</span>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
                                        <div className="flex items-center gap-1">
                                            <Calendar size={14} />
                                            {new Date(shipment.createdAt).toLocaleDateString()}
                                        </div>
                                        <span className="flex items-center gap-1 font-bold text-emerald-600 group-hover:translate-x-1 transition-transform">
                                            View Details <ArrowRight size={14} />
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-12 flex flex-col items-center justify-center text-slate-400">
                            <Truck size={48} className="mb-4 opacity-20" />
                            <p>No shipments found matching your criteria</p>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Shipments;
