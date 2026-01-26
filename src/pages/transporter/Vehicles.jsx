import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Truck, Search, Filter, Plus, Phone, Star } from 'lucide-react';
import Button from '../../components/ui/Button';
import AddVehicleModal from '../../components/transporter/AddVehicleModal';
import VehicleFilterModal from '../../components/transporter/VehicleFilterModal';
import { vehicleStore } from '../../utils/vehicleStore';

const Vehicles = () => {
    const [vehicles, setVehicles] = useState([]);
    const [filter, setFilter] = useState('All Fleet');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        // Load data from store on mount
        setVehicles(vehicleStore.getAll());
    }, []);

    const handleAddVehicle = (newVehicle) => {
        const updatedList = vehicleStore.add(newVehicle);
        setVehicles(updatedList);
    };

    // Calculate counts
    const counts = {
        'All Fleet': vehicles.length,
        'Available': vehicles.filter(v => v.status === 'AVAILABLE').length,
        'On Route': vehicles.filter(v => v.status === 'ON ROUTE').length,
        'Maintenance': vehicles.filter(v => v.status === 'MAINTENANCE').length
    };

    const tabs = ['All Fleet', 'Available', 'On Route', 'Maintenance'];

    const getStatusColor = (status) => {
        switch (status) {
            case 'AVAILABLE': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'ON ROUTE': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'MAINTENANCE': return 'bg-amber-100 text-amber-700 border-amber-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [activeFilters, setActiveFilters] = useState({
        types: [],
        statuses: [],
        capacityMin: '',
        capacityMax: '',
        expMin: '',
        expMax: ''
    });

    const handleApplyFilters = (newFilters) => {
        setActiveFilters(newFilters);
        // If modal sets status, maybe switch tab to 'All Fleet' so user sees exactly what they filtered?
        // Or kept separate. Let's keep separate: Tab AND Modal.
        // If user selects "Available" in Modal, but Tab is "Maintenance", result is 0. 
        // Logic: filteredVehicles = TabStatus && Search && ModalFilters.
    };

    const hasActiveFilters = Object.values(activeFilters).some(val => 
        Array.isArray(val) ? val.length > 0 : val !== ''
    );

    const filteredVehicles = vehicles.filter(v => {
        // 1. Tab Filter
        const matchesTab = filter === 'All Fleet' || v.status.toLowerCase().replace(' ', '') === filter.toLowerCase().replace(' ', '');
        
        // 2. Search Filter
        const matchesSearch = v.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              v.vhNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              v.driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              v.type.toLowerCase().includes(searchQuery.toLowerCase());

        // 3. Modal Advanced Filters
        let matchesModal = true;
        if (hasActiveFilters) {
            // Type (Case insensitive check)
            if (activeFilters.types.length > 0) {
                const vehicleTypeLower = v.type.toLowerCase();
                const hasMatch = activeFilters.types.some(t => vehicleTypeLower.includes(t.toLowerCase()) || t.toLowerCase().includes(vehicleTypeLower));
                if (!hasMatch) matchesModal = false;
            }

            // Status (Exact match needed as these are fixed enums)
            if (activeFilters.statuses.length > 0 && !activeFilters.statuses.includes(v.status)) matchesModal = false;
            
            // Capacity (Extract numeric part safely)
            const capacityStr = v.capacity.toLowerCase();
            const capacityVal = parseFloat(capacityStr.match(/(\d+(\.\d+)?)/)?.[0] || '0');
            
            if (activeFilters.capacityMin && capacityVal < parseFloat(activeFilters.capacityMin)) matchesModal = false;
            if (activeFilters.capacityMax && capacityVal > parseFloat(activeFilters.capacityMax)) matchesModal = false;

            // Experience (Extract numeric part)
            const expStr = v.driver.experience.toString().toLowerCase();
            const expVal = parseFloat(expStr.match(/(\d+)/)?.[0] || '0'); 
            
            if (activeFilters.expMin && expVal < parseFloat(activeFilters.expMin)) matchesModal = false;
            if (activeFilters.expMax && expVal > parseFloat(activeFilters.expMax)) matchesModal = false;
        }

        return matchesTab && matchesSearch && matchesModal;
    });

    return (
        <DashboardLayout role="transporter">
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-display font-bold text-slate-800">My Vehicles</h1>
                        <p className="text-slate-500">Manage your fleet and driver assignments</p>
                    </div>
                    <Button 
                        icon={Plus} 
                        className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/30"
                        onClick={() => setIsAddModalOpen(true)}
                    >
                        Add Vehicle
                    </Button>
                </div>

                {/* Filters and Search */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-2 rounded-xl sticky top-0 z-10 shadow-sm border border-slate-100">
                    <div className="flex bg-slate-50/50 p-1.5 rounded-xl w-full md:w-auto overflow-x-auto gap-1 border border-slate-100">
                        {tabs.map(tab => {
                            const isActive = filter === tab;
                            
                            // Color Configuration
                            const colorMap = {
                                'All Fleet': { 
                                    active: 'bg-slate-800 text-white shadow-lg shadow-slate-200', 
                                    badge: 'bg-slate-600 text-slate-100',
                                    hover: 'hover:bg-slate-200'
                                },
                                'Available': { 
                                    active: 'bg-emerald-500 text-white shadow-lg shadow-emerald-200', 
                                    badge: 'bg-emerald-600 text-emerald-50',
                                    hover: 'hover:bg-emerald-50 text-emerald-700'
                                },
                                'On Route': { 
                                    active: 'bg-blue-500 text-white shadow-lg shadow-blue-200', 
                                    badge: 'bg-blue-600 text-blue-50',
                                    hover: 'hover:bg-blue-50 text-blue-700'
                                },
                                'Maintenance': { 
                                    active: 'bg-amber-500 text-white shadow-lg shadow-amber-200', 
                                    badge: 'bg-amber-600 text-amber-50',
                                    hover: 'hover:bg-amber-50 text-amber-700'
                                }
                            };
                            
                            const colors = colorMap[tab];
                            
                            return (
                                <button
                                    key={tab}
                                    onClick={() => setFilter(tab)}
                                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 whitespace-nowrap flex items-center gap-2.5 ${
                                        isActive 
                                        ? colors.active 
                                        : `text-slate-500 hover:text-slate-700 ${colors.hover}`
                                    }`}
                                >
                                    {tab}
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold tabular-nums transition-colors ${
                                        isActive 
                                        ? colors.badge 
                                        : 'bg-slate-200/60 text-slate-500'
                                    }`}>
                                        {counts[tab]}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                    
                    <div className="flex gap-2 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                            <input 
                                type="text"
                                placeholder="Search vehicle or driver..."
                                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-slate-400"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <button 
                            onClick={() => setIsFilterModalOpen(true)}
                            className={`px-4 py-2 border rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${
                                hasActiveFilters 
                                ? 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100 shadow-sm' 
                                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                            }`}
                        >
                            <Filter size={18} className={hasActiveFilters ? "fill-emerald-600" : ""} />
                            Filter
                        </button>
                    </div>
                </div>

                {/* Vehicle List */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                    {/* Header Row */}
                    <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-slate-50/50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        <div className="col-span-12 md:col-span-4">Vehicle Profile</div>
                        <div className="col-span-6 md:col-span-3">Assigned Driver</div>
                        <div className="col-span-6 md:col-span-3">Current Assignment</div>
                        <div className="col-span-6 md:col-span-2 text-right md:text-left">Status</div>
                    </div>

                    <div className="divide-y divide-slate-100">
                        {filteredVehicles.length > 0 ? (
                            filteredVehicles.map((vehicle) => (
                                <div key={vehicle.vhNumber} className="grid grid-cols-12 gap-4 px-6 py-6 items-center hover:bg-slate-50/50 transition-colors group">
                                    
                                    {/* Vehicle Profile */}
                                    <div className="col-span-12 md:col-span-4 flex items-start gap-5">
                                        <div className="relative w-14 h-14 shrink-0">
                                            <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center shadow-lg shadow-slate-200">
                                                <Truck size={24} className="text-white" strokeWidth={1.5} />
                                            </div>
                                            <div className="absolute -bottom-2 -left-1 bg-white border border-slate-100 px-1.5 py-0.5 rounded shadow-sm">
                                                <span className="text-[10px] font-bold text-slate-600 tracking-wide uppercase whitespace-nowrap">
                                                    {vehicle.vhNumber}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col pt-0.5">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-display font-bold text-slate-800 text-lg leading-tight">{vehicle.id}</h3>
                                            </div>
                                            <p className="font-medium text-slate-500 text-sm mt-0.5">{vehicle.type}</p>
                                            <div className="flex items-center gap-1.5 mt-1.5 ml-0.5">
                                                <span className="text-xs text-slate-500 font-medium">{vehicle.capacity}</span>
                                                <span className="text-[10px] text-slate-300">•</span>
                                                <span className="text-xs text-slate-500 font-medium">{vehicle.mileage}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Assigned Driver */}
                                    <div className="col-span-6 md:col-span-3 flex items-center gap-3 pl-2">
                                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm bg-indigo-50 text-indigo-600`}>
                                            {vehicle.driver.avatar}
                                            {/* Status Dot */}
                                            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
                                        </div>
                                        <div className="flex flex-col">
                                            <p className="font-bold text-slate-800 text-sm leading-tight">
                                                {vehicle.driver.name}
                                            </p>
                                            <div className="flex flex-col gap-0.5 mt-1">
                                                <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded w-fit">
                                                    {vehicle.driver.experience}
                                                </span>
                                                <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                                                    <Phone size={10} />
                                                    {vehicle.driver.phone}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Current Assignment */}
                                    <div className="col-span-12 md:col-span-3 my-2 md:my-0">
                                        <div className="bg-slate-50/80 border border-slate-100 rounded-lg px-4 py-3 text-center">
                                            <span className="text-sm text-slate-500 font-medium italic">
                                                {vehicle.assignment}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Status */}
                                    <div className="col-span-6 md:col-span-2 flex justify-end">
                                        <span className={`px-4 py-1.5 rounded-lg text-xs font-bold border flex items-center gap-1.5 shadow-sm uppercase tracking-wide ${getStatusColor(vehicle.status)}`}>
                                            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
                                            {vehicle.status}
                                        </span>
                                    </div>

                                </div>
                            ))
                        ) : (
                            <div className="py-20 text-center flex flex-col items-center justify-center">
                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                    <Truck size={32} className="text-slate-300" />
                                </div>
                                <h3 className="text-slate-800 font-semibold text-lg">No vehicles found</h3>
                                <p className="text-slate-500 text-sm max-w-xs mx-auto mt-1">
                                    Try adjusting your search or filters to find what you're looking for.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <AddVehicleModal 
                isOpen={isAddModalOpen} 
                onClose={() => setIsAddModalOpen(false)} 
                onAdd={handleAddVehicle} 
            />
            <VehicleFilterModal
                isOpen={isFilterModalOpen}
                onClose={() => setIsFilterModalOpen(false)}
                onApply={handleApplyFilters}
                currentFilters={activeFilters}
            />
        </DashboardLayout>
    );
};

export default Vehicles;
