import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Truck, Search, Filter, Plus, Phone, Star } from 'lucide-react';
import useMediaQuery from '../../utils/useMediaQuery';
import Button from '../../components/ui/Button';
import AddVehicleModal from '../../components/transporter/AddVehicleModal';
import VehicleFilterModal from '../../components/transporter/VehicleFilterModal';
import { api } from '../../utils/api';

const Vehicles = () => {
    const [vehicles, setVehicles] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [shipments, setShipments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All Fleet');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [vehiclesRes, driversRes, shipmentsRes] = await Promise.all([
                api.vehicle.getAll(),
                api.driver.getAll(),
                api.shipment.getAll()
            ]);

            if (vehiclesRes.success) setVehicles(vehiclesRes.data);
            if (driversRes.success) setDrivers(driversRes.data);
            if (shipmentsRes.success) setShipments(shipmentsRes.data);

        } catch (error) {
            console.error('Failed to load data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddVehicle = async (newVehicleData) => {
        try {
            const response = await api.vehicle.create({
                name: newVehicleData.vehicleName,
                registrationNumber: newVehicleData.plate,
                type: newVehicleData.type,
                capacity: `${newVehicleData.capacity} ${newVehicleData.capacityUnit}`,
                make: 'Generic',
                model: 'Truck',
                fuelType: 'Diesel'
            });

            if (response.success) {
                loadData();
            }
        } catch (error) {
            console.error('Failed to create vehicle:', error);
            alert('Failed to add vehicle');
        }
    };

    // Calculate counts
    const counts = {
        'All Fleet': vehicles.length,
        'Available': vehicles.filter(v => v.status === 'Available').length,
        'On Route': vehicles.filter(v => ['On Route', 'In Transit'].includes(v.status)).length,
        'Maintenance': vehicles.filter(v => v.status === 'Maintenance').length
    };

    const tabs = ['All Fleet', 'Available', 'On Route', 'Maintenance'];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Available': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'On Route':
            case 'In Transit': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Maintenance': return 'bg-amber-100 text-amber-700 border-amber-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    // Keep filter modal logic separate for now or verify if it needs API integration
    // For simplicity, client-side filtering on fetched data 
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
    };

    const hasActiveFilters = Object.values(activeFilters).some(val =>
        Array.isArray(val) ? val.length > 0 : val !== ''
    );

    const filteredVehicles = vehicles.filter(v => {
        // 1. Tab Filter
        const statusMap = {
            'Available': ['Available'],
            'On Route': ['On Route', 'In Transit'],
            'Maintenance': ['Maintenance']
        };

        const matchesTab = filter === 'All Fleet' || (statusMap[filter] && statusMap[filter].includes(v.status));

        // 2. Search Filter
        const matchesSearch =
            (v.registrationNumber?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
            (v.type?.toLowerCase() || '').includes(searchQuery.toLowerCase());

        // 3. Modal Advanced Filters (Simplified)
        let matchesModal = true;
        if (hasActiveFilters) {
            if (activeFilters.types.length > 0) {
                const vehicleTypeLower = v.type.toLowerCase();
                if (!activeFilters.types.some(t => vehicleTypeLower.includes(t.toLowerCase()))) matchesModal = false;
            }
            // Add other filters as needed based on new data structure
        }

        return matchesTab && matchesSearch && matchesModal;
    });

    const isMobile = useMediaQuery('(max-width: 768px)');

    return (
        <DashboardLayout role="transporter">
            <div className="space-y-6 pb-20 md:pb-0">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-display font-bold text-slate-800">My Vehicles</h1>
                        <p className="text-slate-500">Manage your fleet and driver assignments</p>
                    </div>
                    <Button
                        icon={Plus}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/30 w-full md:w-auto"
                        onClick={() => setIsAddModalOpen(true)}
                    >
                        Add Vehicle
                    </Button>
                </div>

                {/* Filters and Search */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-2 rounded-xl sticky top-0 md:static z-10 shadow-sm border border-slate-100">
                    <div className="flex bg-slate-50/50 p-1.5 rounded-xl w-full md:w-auto overflow-x-auto gap-1 border border-slate-100 no-scrollbar">
                        {tabs.map(tab => {
                            const isActive = filter === tab;
                            const colors = {
                                'All Fleet': { active: 'bg-slate-800 text-white', badge: 'bg-slate-600 text-slate-100' },
                                'Available': { active: 'bg-emerald-500 text-white', badge: 'bg-emerald-600 text-emerald-50' },
                                'On Route': { active: 'bg-blue-500 text-white', badge: 'bg-blue-600 text-blue-50' },
                                'Maintenance': { active: 'bg-amber-500 text-white', badge: 'bg-amber-600 text-amber-50' }
                            }[tab] || { active: 'bg-slate-500 text-white', badge: 'bg-slate-600 text-white' };

                            return (
                                <button
                                    key={tab}
                                    onClick={() => setFilter(tab)}
                                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 whitespace-nowrap flex items-center gap-2.5 shrink-0 ${isActive ? colors.active : 'text-slate-500 hover:text-slate-700'
                                        }`}
                                >
                                    {tab}
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold tabular-nums ${isActive ? colors.badge : 'bg-slate-200/60 text-slate-500'
                                        }`}>
                                        {counts[tab] || 0}
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
                                placeholder="Search..."
                                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <button
                            onClick={() => setIsFilterModalOpen(true)}
                            className={`px-4 py-2 border rounded-lg text-sm font-medium flex items-center gap-2 ${hasActiveFilters ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-white text-slate-600 border-slate-200'
                                }`}
                        >
                            <Filter size={18} />
                            <span className="hidden md:inline">Filter</span>
                        </button>
                    </div>
                </div>

                {/* Vehicle List */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                    {/* Header - Hidden on Mobile */}
                    <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-slate-50/50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        <div className="col-span-4">Vehicle Profile</div>
                        <div className="col-span-3">Assigned Driver</div>
                        <div className="col-span-3">Assignment</div>
                        <div className="col-span-2 text-right">Status</div>
                    </div>

                    <div className="divide-y divide-slate-100">
                        {loading ? (
                            <div className="py-20 text-center text-slate-400">Loading vehicles...</div>
                        ) : filteredVehicles.length > 0 ? (
                            filteredVehicles.map((vehicle) => {
                                // Find driver for this vehicle
                                const assignedDriver = drivers.find(d => {
                                    const vId = d.assignedVehicle?._id || d.assignedVehicle;
                                    return vId && String(vId) === String(vehicle._id);
                                });

                                // Find active shipment for this driver
                                const activeAssignment = assignedDriver ? shipments.find(s => {
                                    const dId = s.driver?._id || s.driver;
                                    return String(dId) === String(assignedDriver._id) &&
                                        ['assigned', 'accepted', 'at_pickup', 'picked_up', 'in_transit', 'arrived'].includes(s.status);
                                }) : null;

                                return (
                                    <div key={vehicle._id} className="relative p-4 md:px-6 md:py-6 hover:bg-slate-50/50 transition-colors group">

                                        {/* Mobile Layout: Stacked with absolute positioning for status */}
                                        <div className="flex flex-col md:grid md:grid-cols-12 gap-4">

                                            {/* Vehicle Profile */}
                                            <div className="md:col-span-4 flex items-start gap-4">
                                                <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-slate-800 flex items-center justify-center shadow-lg shadow-slate-200 shrink-0">
                                                    <Truck size={isMobile ? 20 : 24} className="text-white" strokeWidth={1.5} />
                                                </div>
                                                <div className="flex flex-col">
                                                    <h3 className="font-display font-bold text-slate-800 text-base md:text-lg leading-tight">
                                                        {vehicle.name || `${vehicle.make} ${vehicle.model}`}
                                                    </h3>
                                                    <p className="font-medium text-slate-500 text-xs md:text-sm mt-0.5">{vehicle.type}</p>

                                                    {isMobile && (
                                                        <span className={`mt-2 inline-flex w-fit px-2 py-1 rounded-md text-[10px] font-bold border uppercase tracking-wide ${getStatusColor(vehicle.status)}`}>
                                                            {vehicle.status}
                                                        </span>
                                                    )}

                                                    <div className="flex items-center gap-1.5 mt-1.5 text-xs text-slate-500">
                                                        <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 border border-slate-200">{vehicle.registrationNumber}</span>
                                                        <span className="text-[10px] text-slate-300">•</span>
                                                        <span className="font-medium">{vehicle.capacity}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Status - Desktop Only Position */}
                                            <div className="hidden md:flex md:col-span-2 md:col-start-11 justify-end items-center">
                                                <span className={`px-4 py-1.5 rounded-lg text-xs font-bold border flex items-center gap-1.5 shadow-sm uppercase tracking-wide ${getStatusColor(vehicle.status)}`}>
                                                    <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
                                                    {vehicle.status}
                                                </span>
                                            </div>

                                            {/* Info Grid for Mobile / Columns for Desktop */}
                                            <div className="flex flex-col gap-3 mt-2 md:mt-0 md:col-span-6 md:col-start-5 md:grid md:grid-cols-6 md:gap-4 md:items-center w-full">

                                                {/* Assigned Driver */}
                                                <div className="md:col-span-3 flex items-center gap-3 bg-slate-50 px-3 py-2 md:p-0 md:bg-transparent rounded-lg md:rounded-none border border-slate-100 md:border-none">
                                                    {assignedDriver ? (
                                                        <>
                                                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl md:rounded-2xl flex items-center justify-center font-bold text-xs md:text-sm bg-indigo-50 text-indigo-600 uppercase shrink-0">
                                                                {assignedDriver.fullName?.charAt(0)}
                                                            </div>
                                                            <div className="flex flex-col min-w-0">
                                                                <p className="text-xs text-slate-400 font-bold uppercase md:hidden mb-0.5">Driver</p>
                                                                <p className="font-bold text-slate-800 text-sm leading-tight truncate">
                                                                    {assignedDriver.fullName}
                                                                </p>
                                                                <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium whitespace-nowrap">
                                                                    <Phone size={10} />
                                                                    {assignedDriver.phone}
                                                                </div>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <span className="text-sm text-slate-400 italic px-2">No Driver Assigned</span>
                                                    )}
                                                </div>

                                                {/* Assignment */}
                                                <div className="md:col-span-3">
                                                    {activeAssignment ? (
                                                        <div className="bg-blue-50/80 border border-blue-100 rounded-lg px-4 py-2 md:py-3 cursor-pointer hover:bg-blue-100/80 transition-colors">
                                                            <div className="flex justify-between items-center mb-1">
                                                                <p className="text-[10px] font-bold text-blue-700 uppercase">{activeAssignment.status.replace('_', ' ')}</p>
                                                                {isMobile && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>}
                                                            </div>
                                                            <p className="text-xs text-slate-600 truncate flex items-center gap-1">
                                                                <span className="text-slate-400">To:</span>
                                                                <span className="font-medium text-slate-800">{activeAssignment.distributor?.profile?.city || 'Distributor'}</span>
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        <div className="bg-slate-50/80 border border-slate-100 rounded-lg px-4 py-3 text-center md:h-full md:flex md:items-center md:justify-center">
                                                            <span className="text-sm text-slate-500 font-medium italic">
                                                                {(vehicle.status === 'Available' && !assignedDriver) ? 'Unassigned' : 'Ready'}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                )
                            })
                        ) : (
                            <div className="py-20 text-center flex flex-col items-center justify-center">
                                <Truck size={32} className="text-slate-300 mb-4" />
                                <h3 className="text-slate-800 font-semibold text-lg">No vehicles found</h3>
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
