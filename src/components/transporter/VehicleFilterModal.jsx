import React, { useState } from 'react';
import { X, Filter, RotateCcw } from 'lucide-react';
import Button from '../ui/Button';

const VehicleFilterModal = ({ isOpen, onClose, onApply, currentFilters }) => {
    const [filters, setFilters] = useState(currentFilters || {
        types: [],
        statuses: [],
        capacityMin: '',
        capacityMax: '',
        expMin: '',
        expMax: ''
    });

    if (!isOpen) return null;

    const vehicleTypes = [
        "Ashok Leyland 4220",
        "Tata Ace EV",
        "Eicher Pro 2049",
        "Mahindra Bolero Pickup",
        "BharatBenz 1923C",
        "Open Truck", // Keeping as fallback for manual entries
        "Refrigerated",
        "Container",
        "Mini Van",
        "Electric Van"
    ];

    const definedStatuses = ['AVAILABLE', 'ON ROUTE', 'MAINTENANCE'];

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
            statuses: prev.statuses.includes(status) 
                ? prev.statuses.filter(s => s !== status)
                : [...prev.statuses, status]
        }));
    };

    const handleChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleReset = () => {
        const defaultFilters = {
            types: [],
            statuses: [],
            capacityMin: '',
            capacityMax: '',
            expMin: '',
            expMax: ''
        };
        setFilters(defaultFilters);
        // Optional: Apply reset immediately or wait for 'Apply'? 
        // User typically expects 'Reset' to clear the form, 'Apply' to commit.
    };

    const handleSubmit = () => {
        onApply(filters);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md m-4 relative animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <Filter size={20} className="text-emerald-600" />
                        Filter Vehicles
                    </h3>
                    <button 
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="p-6 overflow-y-auto space-y-6 custom-scrollbar">
                    
                    {/* Vehicle Type */}
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Vehicle Type</label>
                        <div className="grid grid-cols-2 gap-2">
                            {vehicleTypes.map(type => (
                                <label key={type} className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-1.5 rounded-lg transition-colors">
                                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${filters.types.includes(type) ? 'bg-emerald-600 border-emerald-600' : 'border-slate-300 bg-white'}`}>
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

                    {/* Status */}
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Status</label>
                        <div className="flex flex-wrap gap-2">
                            {definedStatuses.map(status => (
                                <button
                                    key={status}
                                    onClick={() => handleStatusChange(status)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                                        filters.statuses.includes(status)
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

                    {/* Capacity Range */}
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Capacity (Tons)</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                name="capacityMin"
                                placeholder="Min"
                                value={filters.capacityMin}
                                onChange={handleChange}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                            />
                            <span className="text-slate-400">-</span>
                            <input
                                type="number"
                                name="capacityMax"
                                placeholder="Max"
                                value={filters.capacityMax}
                                onChange={handleChange}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                            />
                        </div>
                    </div>

                    <hr className="border-slate-100" />

                    {/* Experience Range */}
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Driver Experience (Years)</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                name="expMin"
                                placeholder="Min"
                                value={filters.expMin}
                                onChange={handleChange}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                            />
                            <span className="text-slate-400">-</span>
                            <input
                                type="number"
                                name="expMax"
                                placeholder="Max"
                                value={filters.expMax}
                                onChange={handleChange}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
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

export default VehicleFilterModal;
