import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Plus } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import DataTable from '../../components/ui/DataTable';
import Button from '../../components/ui/Button';
import useMediaQuery from '../../utils/useMediaQuery';
import ShipmentFilterModal from '../../components/transporter/ShipmentFilterModal';
import AddShipmentModal from '../../components/transporter/AddShipmentModal';

import { shipmentStore } from '../../utils/shipmentStore';

const Shipments = () => {
    const navigate = useNavigate();
    const isMobile = useMediaQuery('(max-width: 768px)');
    const [filterStatus, setFilterStatus] = useState('All Shipments');
    const [searchQuery, setSearchQuery] = useState('');
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    
    // Initial State Matching Filter Modal
    const [activeFilters, setActiveFilters] = useState({
        types: [],
        status: [],
        origin: '',
        destination: '',
        dateStart: '',
        dateEnd: ''
    });

    const [shipments, setShipments] = useState(shipmentStore.getAll()); 

    const handleAddShipment = (newShipment) => {
        const updatedShipments = shipmentStore.add(newShipment);
        setShipments(updatedShipments);
    };

    const columns = [
        { 
            header: 'Shipment ID', 
            accessor: 'id',
            render: (row) => <span className="font-medium text-slate-600">{row.id}</span>
        },
        { 
            header: 'Type', 
            accessor: 'type',
            render: (row) => (
                <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                    row.type === 'Personal Shipment' 
                    ? 'bg-indigo-100 text-indigo-700' 
                    : row.type === 'Farmer Request'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-purple-100 text-purple-700'
                }`}>
                    {row.type}
                </span>
            )
        },
        { header: 'Origin', accessor: 'origin', className: 'max-w-[150px] truncate' },
        { header: 'Destination', accessor: 'destination', className: 'max-w-[200px] truncate' },
        { header: 'Cargo', accessor: 'cargo' },
        { header: 'Capacity', accessor: 'capacity' },
        { 
            header: 'Vehicle', 
            accessor: 'vehicle',
            render: (row) => (
                <span className={row.vehicle === 'Pending Assignment' ? 'text-slate-400 italic' : 'font-medium'}>
                    {row.vehicle}
                </span>
            )
        },
        { header: 'ETA', accessor: 'eta' },
    ];

    const filteredShipments = shipments.filter(s => {
        // Tab Status Filter
        if (filterStatus === 'In Transit' && s.status !== 'On Route') return false;
        if (filterStatus === 'Scheduled' && s.status !== 'Pending') return false;
        if (filterStatus === 'Delivered' && s.status !== 'Delivered') return false;
        
        // Search Filter
        const matchesSearch = s.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              s.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              s.destination.toLowerCase().includes(searchQuery.toLowerCase());
        
        if (!matchesSearch) return false;

        // Modal Advanced Filters
        if (activeFilters.types.length > 0 && !activeFilters.types.includes(s.type)) return false;
        if (activeFilters.status.length > 0 && !activeFilters.status.includes(s.status)) return false;
        if (activeFilters.origin && !s.origin.toLowerCase().includes(activeFilters.origin.toLowerCase())) return false;
        if (activeFilters.destination && !s.destination.toLowerCase().includes(activeFilters.destination.toLowerCase())) return false;

        return true;
    });

    const tabs = [
        { name: 'All Shipments', count: shipments.length },
        { name: 'In Transit', count: shipments.filter(s => s.status === 'On Route').length },
        { name: 'Scheduled', count: shipments.filter(s => s.status === 'Pending').length },
        { name: 'Delivered', count: shipments.filter(s => s.status === 'Delivered').length }
    ];

    // Calculate Active Filters Count
    const activeFilterCount = activeFilters.types.length + 
                              activeFilters.status.length + 
                              (activeFilters.origin ? 1 : 0) + 
                              (activeFilters.destination ? 1 : 0);

    return (
        <DashboardLayout role="transporter">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-display font-bold text-slate-800">All Shipments</h1>
                        <p className="text-slate-500">Manage and track all your shipments</p>
                    </div>
                    <Button 
                        icon={Plus} 
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/30"
                    >
                        New Shipment
                    </Button>
                </div>

                {/* Tabs */}
                <div className="flex flex-wrap gap-3">
                    {tabs.map(tab => (
                        <button
                            key={tab.name}
                            onClick={() => setFilterStatus(tab.name)}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                                filterStatus === tab.name
                                ? 'bg-blue-100 text-blue-700 shadow-sm ring-1 ring-blue-200'
                                : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
                            }`}
                        >
                            {tab.name}
                            <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold tabular-nums ${
                                filterStatus === tab.name
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
                        placeholder="Search by shipment ID, origin, or destination..."
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all shadow-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Table Header & Content */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-5 border-b border-slate-100 flex justify-between items-center">
                        <h2 className="font-display font-bold text-slate-800 text-lg">
                            {filteredShipments.length} Shipments
                        </h2>
                        <button 
                            onClick={() => setIsFilterModalOpen(true)}
                            className={`flex items-center gap-2 font-medium text-sm transition-all ${
                                activeFilterCount > 0 
                                ? 'text-emerald-700 bg-emerald-50 border border-emerald-100 px-4 py-1.5 rounded-full shadow-sm'
                                : 'text-slate-500 hover:text-slate-700'
                            }`}
                        >
                            <Filter size={16} className={activeFilterCount > 0 ? "fill-emerald-700" : ""} />
                            Filter
                        </button>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <DataTable 
                            columns={columns} 
                            data={filteredShipments}
                            onRowClick={() => {}}
                            hideToolbar={true}
                        />
                    </div>
                </div>

                <ShipmentFilterModal
                    isOpen={isFilterModalOpen}
                    onClose={() => setIsFilterModalOpen(false)}
                    currentFilters={activeFilters}
                    onApply={setActiveFilters}
                    shipments={shipments}
                />

                <AddShipmentModal
                    isOpen={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    onAdd={handleAddShipment}
                />
            </div>
        </DashboardLayout>
    );
};

export default Shipments;
