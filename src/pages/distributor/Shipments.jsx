import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, MapPin, Package, Clock, Filter, Search } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import DataTable from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';
import Button from '../../components/ui/Button';
import useMediaQuery from '../../utils/useMediaQuery';
import api from '../../utils/api';

const DistributorShipments = () => {
    const navigate = useNavigate();
    const isMobile = useMediaQuery('(max-width: 768px)');
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [allShipments, setAllShipments] = useState([]);
    const [loading, setLoading] = useState(true);

    const [processingId, setProcessingId] = useState(null);

    const fetchShipments = async () => {
        try {
            // api.shipment.getAll() automatically filters by the logged-in user's role/ID on the backend
            const response = await api.shipment.getAll();
            if (response.success) {
                // Map backend data to table format
                const mappedData = response.data.map(s => ({
                    id: s.shipmentId,
                    _id: s._id, // Keep the actual mongo ID for navigation
                    origin: s.origin?.city || s.farmer?.profile?.city || 'Origin',
                    destination: s.destination?.city || s.distributor?.profile?.city || 'Destination',
                    cargo: `${s.batch?.crop || 'Crop'} - ${s.batch?.quantity || 0}T`,
                    driver: s.driver?.name || 'Unassigned',
                    eta: s.estimatedArrival || 'TBD',
                    status: s.status
                }));
                setAllShipments(mappedData);
            }
        } catch (error) {
            console.error('Failed to fetch shipments', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchShipments();
    }, []);

    const handleAction = async (e, shipmentId, status) => {
        e.stopPropagation(); // Prevent row click navigation
        setProcessingId(shipmentId);
        try {
            const response = await api.shipment.updateStatus(shipmentId, status);
            if (response.success) {
                fetchShipments(); // Refresh table
            }
        } catch (error) {
            console.error(`Failed to ${status} shipment`, error);
        } finally {
            setProcessingId(null);
        }
    };

    const columns = [
        { header: 'Shipment ID', accessor: 'id' },
        { header: 'Origin', accessor: 'origin' },
        { header: 'Destination', accessor: 'destination' },
        { header: 'Cargo', accessor: 'cargo' },
        { header: 'Driver', accessor: 'driver' },
        { header: 'Status', accessor: 'status', render: (row) => <StatusBadge status={row.status} /> },
        {
            header: 'Actions',
            accessor: 'actions',
            render: (row) => row.status === 'pending' && (
                <div className="flex gap-2">
                    <button
                        onClick={(e) => handleAction(e, row._id, 'accepted')}
                        disabled={processingId === row._id}
                        className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-md hover:bg-emerald-200 text-xs font-medium disabled:opacity-50"
                    >
                        Accept
                    </button>
                    <button
                        onClick={(e) => handleAction(e, row._id, 'rejected')}
                        disabled={processingId === row._id}
                        className="px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 text-xs font-medium disabled:opacity-50"
                    >
                        Decline
                    </button>
                </div>
            )
        }
    ];

    // Filter shipments
    const filteredShipments = allShipments.filter(shipment => {
        const matchesStatus = filterStatus === 'all' || shipment.status === filterStatus;
        const matchesSearch = shipment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            shipment.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
            shipment.destination.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const statusCounts = {
        all: allShipments.length,
        pending: allShipments.filter(s => s.status === 'pending').length,
        in_transit: allShipments.filter(s => s.status === 'in_transit').length,
        delivered: allShipments.filter(s => s.status === 'delivered').length
    };

    return (
        <DashboardLayout role="distributor">
            <div className="space-y-6">
                {/* Header */}
                <div className="animate-in">
                    <h1 className="text-xl md:text-2xl font-display font-bold text-slate-800">Shipment Requests</h1>
                    <p className="text-sm md:text-base text-slate-500">Manage incoming shipments and requests</p>
                </div>

                {/* Status Filter Tabs */}
                <div className={`${isMobile ? 'flex overflow-x-auto gap-2 pb-2' : 'flex gap-4'} animate-in`} style={{ animationDelay: '0.1s' }}>
                    {[
                        { key: 'all', label: 'All', count: statusCounts.all },
                        { key: 'pending', label: 'Requests', count: statusCounts.pending },
                        { key: 'in_transit', label: 'In Transit', count: statusCounts.in_transit },
                        { key: 'delivered', label: 'Delivered', count: statusCounts.delivered }
                    ].map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setFilterStatus(tab.key)}
                            className={`${isMobile ? 'px-4 py-2 text-sm whitespace-nowrap' : 'px-6 py-3'
                                } rounded-lg font-medium transition-all ${filterStatus === tab.key
                                    ? 'bg-emerald-100 text-emerald-800 shadow-sm'
                                    : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                                }`}
                        >
                            {tab.label}
                            <span className={`ml-2 ${isMobile ? 'text-xs' : 'text-sm'} ${filterStatus === tab.key ? 'text-emerald-600' : 'text-slate-400'
                                }`}>
                                ({tab.count})
                            </span>
                        </button>
                    ))}
                </div>

                {/* Search Bar */}
                <div className="animate-in" style={{ animationDelay: '0.2s' }}>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by ID, origin, or destination..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 focus:outline-none bg-white"
                        />
                    </div>
                </div>

                {/* Shipments Table */}
                <div className="animate-in" style={{ animationDelay: '0.3s' }}>
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                            <h2 className="text-base md:text-lg font-display font-semibold text-slate-700">
                                {filteredShipments.length} Shipment{filteredShipments.length !== 1 ? 's' : ''}
                            </h2>
                            {!isMobile && (
                                <Button icon={Filter} variant="ghost" size="sm">Filter</Button>
                            )}
                        </div>
                        <div className={isMobile ? 'overflow-x-auto' : ''}>
                            <DataTable
                                columns={columns}
                                data={filteredShipments}
                                onRowClick={(row) => navigate(`/distributor/shipment/${row._id}`)}
                            />
                        </div>
                    </div>

                    {filteredShipments.length === 0 && (
                        <div className="text-center py-12">
                            <Package className="mx-auto text-slate-300 mb-4" size={48} />
                            <p className="text-slate-500">No shipments found matching your criteria</p>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default DistributorShipments;
