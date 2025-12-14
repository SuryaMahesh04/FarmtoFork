import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, MapPin, Package, Clock, Filter, Search } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import DataTable from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';
import Button from '../../components/ui/Button';
import useMediaQuery from '../../utils/useMediaQuery';

// Extended shipments data
const allShipments = [
    { id: 'TRK-2401', origin: 'Mumbai', destination: 'Delhi', cargo: 'Wheat - 15T', vehicle: 'MH-01-AB-1234', eta: '2 hours', date: '2024-12-14', status: 'in_transit' },
    { id: 'TRK-2402', origin: 'Pune', destination: 'Bangalore', cargo: 'Rice - 20T', vehicle: 'MH-12-CD-5678', eta: '5 hours', date: '2024-12-14', status: 'in_transit' },
    { id: 'TRK-2403', origin: 'Nashik', destination: 'Hyderabad', cargo: 'Tomatoes - 8T', vehicle: 'MH-15-EF-9101', eta: '3 hours', date: '2024-12-14', status: 'in_transit' },
    { id: 'TRK-2404', origin: 'Nagpur', destination: 'Chennai', cargo: 'Onions - 12T', vehicle: 'MH-31-GH-1121', eta: 'Tomorrow', date: '2024-12-15', status: 'scheduled' },
    { id: 'TRK-2405', origin: 'Aurangabad', destination: 'Kolkata', cargo: 'Pulses - 18T', vehicle: 'MH-20-IJ-3141', eta: '8 hours', date: '2024-12-14', status: 'in_transit' },
    { id: 'TRK-2406', origin: 'Mumbai', destination: 'Jaipur', cargo: 'Vegetables - 10T', vehicle: 'MH-02-KL-4152', eta: 'Delivered', date: '2024-12-13', status: 'delivered' },
    { id: 'TRK-2407', origin: 'Pune', destination: 'Surat', cargo: 'Fruits - 5T', vehicle: 'MH-13-MN-6173', eta: 'Delivered', date: '2024-12-12', status: 'delivered' },
    { id: 'TRK-2408', origin: 'Delhi', destination: 'Chandigarh', cargo: 'Grains - 25T', vehicle: 'DL-10-OP-8194', eta: 'Tomorrow', date: '2024-12-15', status: 'scheduled' },
    { id: 'TRK-2409', origin: 'Bangalore', destination: 'Mysore', cargo: 'Dairy - 3T', vehicle: 'KA-01-QR-0215', eta: 'Delivered', date: '2024-12-11', status: 'delivered' },
    { id: 'TRK-2410', origin: 'Chennai', destination: 'Coimbatore', cargo: 'Spices - 2T', vehicle: 'TN-01-ST-2236', eta: '4 hours', date: '2024-12-14', status: 'in_transit' }
];

const Shipments = () => {
    const navigate = useNavigate();
    const isMobile = useMediaQuery('(max-width: 768px)');
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const columns = [
        { header: 'Shipment ID', accessor: 'id' },
        { header: 'Origin', accessor: 'origin' },
        { header: 'Destination', accessor: 'destination' },
        { header: 'Cargo', accessor: 'cargo' },
        { header: 'Vehicle', accessor: 'vehicle' },
        { header: 'ETA', accessor: 'eta' },
        { header: 'Status', accessor: 'status', render: (row) => <StatusBadge status={row.status} /> },
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
        in_transit: allShipments.filter(s => s.status === 'in_transit').length,
        scheduled: allShipments.filter(s => s.status === 'scheduled').length,
        delivered: allShipments.filter(s => s.status === 'delivered').length
    };

    return (
        <DashboardLayout role="transporter">
            <div className="space-y-6">
                {/* Header */}
                <div className="animate-in">
                    <h1 className="text-xl md:text-2xl font-display font-bold text-slate-800">All Shipments</h1>
                    <p className="text-sm md:text-base text-slate-500">Manage and track all your shipments</p>
                </div>

                {/* Status Filter Tabs */}
                <div className={`${isMobile ? 'flex overflow-x-auto gap-2 pb-2' : 'flex gap-4'} animate-in`} style={{ animationDelay: '0.1s' }}>
                    {[
                        { key: 'all', label: 'All Shipments', count: statusCounts.all },
                        { key: 'in_transit', label: 'In Transit', count: statusCounts.in_transit },
                        { key: 'scheduled', label: 'Scheduled', count: statusCounts.scheduled },
                        { key: 'delivered', label: 'Delivered', count: statusCounts.delivered }
                    ].map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setFilterStatus(tab.key)}
                            className={`${isMobile ? 'px-4 py-2 text-sm whitespace-nowrap' : 'px-6 py-3'
                                } rounded-lg font-medium transition-all ${filterStatus === tab.key
                                    ? 'bg-blue-100 text-blue-800 shadow-sm'
                                    : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                                }`}
                        >
                            {tab.label}
                            <span className={`ml-2 ${isMobile ? 'text-xs' : 'text-sm'} ${filterStatus === tab.key ? 'text-blue-600' : 'text-slate-400'
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
                            placeholder="Search by shipment ID, origin, or destination..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none bg-white"
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
                                onRowClick={(row) => navigate(`/transporter/shipment/${row.id}`)}
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

export default Shipments;
