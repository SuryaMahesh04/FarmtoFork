import React, { useState } from 'react';
import { X, Filter, RotateCcw, Truck, MapPin, Calendar, Package } from 'lucide-react';
import Button from '../ui/Button';

const ShipmentFilterModal = ({ isOpen, onClose, onApply, currentFilters, shipments = [] }) => {
    const [filters, setFilters] = useState(currentFilters || {
        types: [],
        status: [],
        origin: '',
        destination: '',
        dateStart: '',
        dateEnd: ''
    });

    if (!isOpen) return null;

    const shipmentTypes = [
        "Personal Shipment",
        "Farmer Request",
        "Corporate Order",
        "Emergency Supply"
    ];

    const definedStatuses = ['Pending', 'On Route', 'Delivered'];

    // Result Count Calculation
    const filteredCount = shipments.filter(s => {
        // Status
        if (filters.status && filters.status.length > 0) {
            if (!filters.status.includes(s.status)) return false;
        }
        
        // Type
        if (filters.types && filters.types.length > 0) {
            if (!filters.types.includes(s.type)) return false;
        }

        // Origin
        if (filters.origin && !s.origin.toLowerCase().includes(filters.origin.toLowerCase())) return false;

        // Destination
        if (filters.destination && !s.destination.toLowerCase().includes(filters.destination.toLowerCase())) return false;

        // Date Range (Simple string comparison for now as mock data dates are 'YYYY-MM-DD')
        if (filters.dateStart && s.date < filters.dateStart) return false;
        if (filters.dateEnd && s.date > filters.dateEnd) return false;

        return true;
    }).length;

    const handleTypeChange = (type) => {
        setFilters(prev => ({
            ...prev,
            types: prev.types.includes(type) 
                ? prev.types.filter(t => t !== type)
                : [...prev.types, type]
        }));
    };

    const handleStatusChange = (status) => {
        setFilters(prev => ({
            ...prev,
            status: prev.status.includes(status)
                ? prev.status.filter(s => s !== status)
                : [...prev.status, status]
        }));
    };

    const handleChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleReset = () => {
        setFilters({
            types: [],
            status: [],
            origin: '',
            destination: '',
            dateStart: '',
            dateEnd: ''
        });
    };

    const handleSubmit = () => {
        onApply(filters);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg m-4 relative animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/30 rounded-t-xl">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <Filter size={20} className="text-emerald-600" />
                            Filter Shipments
                        </h3>
                        <p className="text-slate-500 text-xs mt-0.5">Refine your search results</p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="p-6 overflow-y-auto space-y-6 custom-scrollbar">
                    
                    {/* Status */}
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-2">
                            <Truck size={14} /> Status
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {definedStatuses.map(status => (
                                <button
                                    key={status}
                                    onClick={() => handleStatusChange(status)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                                        filters.status.includes(status)
                                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-200'
                                        : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-200 hover:text-emerald-600'
                                    }`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>

                    <hr className="border-slate-100" />
                    
                    {/* Shipment Type */}
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-2">
                            <Package size={14} /> Shipment Type
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {shipmentTypes.map(type => (
                                <label key={type} className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-2 rounded-lg transition-colors border border-transparent hover:border-slate-100">
                                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors shadow-sm ${filters.types.includes(type) ? 'bg-emerald-600 border-emerald-600' : 'border-slate-300 bg-white'}`}>
                                        {filters.types.includes(type) && <div className="w-2 h-2 bg-white rounded-sm" />}
                                    </div>
                                    <input 
                                        type="checkbox" 
                                        className="hidden" 
                                        checked={filters.types.includes(type)}
                                        onChange={() => handleTypeChange(type)}
                                    />
                                    <span className={`text-sm ${filters.types.includes(type) ? 'text-slate-800 font-medium' : 'text-slate-600'}`}>
                                        {type}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <hr className="border-slate-100" />

                    {/* Location */}
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-2">
                            <MapPin size={14} /> Location
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <span className="text-xs text-slate-400 font-medium ml-1">Origin City</span>
                                <input
                                    type="text"
                                    name="origin"
                                    placeholder="e.g. Mumbai"
                                    value={filters.origin}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                                />
                            </div>
                            <div className="space-y-1">
                                <span className="text-xs text-slate-400 font-medium ml-1">Destination City</span>
                                <input
                                    type="text"
                                    name="destination"
                                    placeholder="e.g. Delhi"
                                    value={filters.destination}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                                />
                            </div>
                        </div>
                    </div>

                    <hr className="border-slate-100" />

                    {/* Date Range */}
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-2">
                            <Calendar size={14} /> Date Range
                        </label>
                        <div className="flex items-center gap-2">
                            <input
                                type="date"
                                name="dateStart"
                                value={filters.dateStart}
                                onChange={handleChange}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-600"
                            />
                            <span className="text-slate-400">-</span>
                            <input
                                type="date"
                                name="dateEnd"
                                value={filters.dateEnd}
                                onChange={handleChange}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-600"
                            />
                        </div>
                    </div>

                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-100 bg-slate-50/50 rounded-b-xl flex justify-between items-center">
                    <button
                        onClick={handleReset}
                        className="text-sm font-medium text-slate-500 hover:text-slate-800 flex items-center gap-1.5 px-2 py-1 rounded hover:bg-slate-100 transition-colors"
                    >
                        <RotateCcw size={14} />
                        Reset All
                    </button>
                    <div className="flex gap-2">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-white border border-transparent hover:border-slate-200 hover:shadow-sm rounded-lg transition-all"
                        >
                            Cancel
                        </button>
                        <Button
                            onClick={handleSubmit}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20"
                        >
                            Apply Filters
                        </Button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ShipmentFilterModal;
