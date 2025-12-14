import React from 'react';
import { Truck, MapPin, Calendar, Clock } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import DataTable from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';
import useMediaQuery from '../../utils/useMediaQuery';

const incomingShipments = [
    { id: 'INC-001', origin: 'Green Valley Farm', item: 'Wheat - 25T', vehicle: 'MH-01-AB-1234', eta: '2 hours', date: '2024-12-14', status: 'in_transit' },
    { id: 'INC-002', origin: 'Sunrise Organics', item: 'Tomatoes - 10T', vehicle: 'MH-12-CD-5678', eta: '4 hours', date: '2024-12-14', status: 'in_transit' },
    { id: 'INC-003', origin: 'Fresh Fruits Co.', item: 'Apples - 8T', vehicle: 'MH-15-EF-9101', eta: 'Tomorrow', date: '2024-12-15', status: 'scheduled' },
    { id: 'INC-004', origin: 'Dairy Fresh Ltd', item: 'Milk Products - 5T', vehicle: 'MH-31-GH-1121', eta: '6 hours', date: '2024-12-14', status: 'in_transit' },
    { id: 'INC-005', origin: 'Grain Masters', item: 'Rice - 30T', vehicle: 'MH-20-IJ-3141', eta: 'Tomorrow', date: '2024-12-15', status: 'scheduled' }
];

const Incoming = () => {
    const isMobile = useMediaQuery('(max-width: 768px)');

    const columns = [
        { header: 'Shipment ID', accessor: 'id' },
        { header: 'Origin', accessor: 'origin' },
        { header: 'Items', accessor: 'item' },
        { header: 'Vehicle', accessor: 'vehicle' },
        { header: 'ETA', accessor: 'eta' },
        { header: 'Status', accessor: 'status', render: (row) => <StatusBadge status={row.status} /> },
    ];

    return (
        <DashboardLayout role="distributor">
            <div className="space-y-6">
                <div className="animate-in">
                    <h1 className="text-xl md:text-2xl font-display font-bold text-slate-800">Incoming Shipments</h1>
                    <p className="text-sm md:text-base text-slate-500">Track arrivals and manage receiving</p>
                </div>

                {/* Stats Cards */}
                <div className={`grid ${isMobile ? 'grid-cols-2 gap-3' : 'grid-cols-4 gap-6'} animate-in`} style={{ animationDelay: '0.1s' }}>
                    <div className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-2 text-slate-600 mb-2">
                            <Truck size={18} />
                            <span className="text-xs font-medium">In Transit</span>
                        </div>
                        <p className="text-2xl font-bold text-slate-800">3</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-2 text-slate-600 mb-2">
                            <Calendar size={18} />
                            <span className="text-xs font-medium">Scheduled</span>
                        </div>
                        <p className="text-2xl font-bold text-blue-600">2</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-2 text-slate-600 mb-2">
                            <Clock size={18} />
                            <span className="text-xs font-medium">Today</span>
                        </div>
                        <p className="text-2xl font-bold text-emerald-600">3</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-2 text-slate-600 mb-2">
                            <MapPin size={18} />
                            <span className="text-xs font-medium">Total Weight</span>
                        </div>
                        <p className="text-2xl font-bold text-slate-800">78T</p>
                    </div>
                </div>

                {/* Shipments Table */}
                <div className="animate-in" style={{ animationDelay: '0.2s' }}>
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="p-4 border-b border-slate-100">
                            <h2 className="text-base md:text-lg font-display font-semibold text-slate-700">Active Incoming Shipments</h2>
                        </div>
                        <div className={isMobile ? 'overflow-x-auto' : ''}>
                            <DataTable columns={columns} data={incomingShipments} />
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Incoming;
