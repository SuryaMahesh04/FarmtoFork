import React, { useState, useEffect } from 'react';
import { X, Plus, Package, MapPin, Truck, Calendar } from 'lucide-react';
import Button from '../ui/Button';
import { vehicleStore } from '../../utils/vehicleStore';

const AddShipmentModal = ({ isOpen, onClose, onAdd }) => {
    const [vehicles, setVehicles] = useState([]);
    const [formData, setFormData] = useState({
        type: 'Personal Shipment',
        origin: '',
        destination: '',
        cargo: '',
        capacity: '',
        vehicle: '',
        date: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        if (isOpen) {
            setVehicles(vehicleStore.getAll());
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const shipmentTypes = [
        "Personal Shipment",
        "Farmer Request",
        "Corporate Order",
        "Emergency Supply"
    ];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Generate Unique ID
        const randomId = Math.floor(1000 + Math.random() * 9000);
        const prefix = formData.type === 'Farmer Request' ? 'REQ' : 
                       formData.type === 'Corporate Order' ? 'CORP' : 
                       formData.type === 'Emergency Supply' ? 'EMG' : 'TRK';
        
        const newShipment = {
            id: `${prefix}-${randomId}`,
            ...formData,
            eta: 'Pending',
            status: 'Pending',
            vehicle: formData.vehicle || 'Pending Assignment' 
        };

        onAdd(newShipment);
        onClose();
        // Reset form
        setFormData({
            type: 'Personal Shipment',
            origin: '',
            destination: '',
            cargo: '',
            capacity: '',
            vehicle: '',
            date: new Date().toISOString().split('T')[0]
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg m-4 relative animate-in zoom-in-95 duration-200">
                
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50 rounded-t-xl">
                    <h3 className="text-xl font-display font-bold text-slate-800 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                            <Plus size={18} />
                        </div>
                        New Shipment
                    </h3>
                    <button 
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    
                    {/* Type */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700">Shipment Type</label>
                        <div className="relative">
                            <Package className="absolute left-3 top-3 text-slate-400" size={18} />
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 appearance-none"
                            >
                                {shipmentTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Origin */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700">Origin</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 text-slate-400" size={18} />
                                <input
                                    type="text"
                                    name="origin"
                                    required
                                    placeholder="City/Location"
                                    value={formData.origin}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                                />
                            </div>
                        </div>

                        {/* Destination */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700">Destination</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 text-slate-400" size={18} />
                                <input
                                    type="text"
                                    name="destination"
                                    required
                                    placeholder="City/Location"
                                    value={formData.destination}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Cargo */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700">Cargo Details</label>
                            <input
                                type="text"
                                name="cargo"
                                required
                                placeholder="e.g. Tomatoes"
                                value={formData.cargo}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                            />
                        </div>

                        {/* Capacity */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700">Capacity (Qty)</label>
                            <input
                                type="text"
                                name="capacity"
                                required
                                placeholder="e.g. 5 Tons"
                                value={formData.capacity}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Vehicle (Optional) */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700">Assign Vehicle (Optional)</label>
                            <div className="relative">
                                <Truck className="absolute left-3 top-3 text-slate-400" size={18} />
                                <select
                                    name="vehicle"
                                    value={formData.vehicle}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 appearance-none"
                                >
                                    <option value="">Pending Assignment</option>
                                    {vehicles.map(v => (
                                        <option key={v.vhNumber} value={v.id}>
                                            {v.id} - {v.type} ({v.status})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Date */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700">Date</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-3 text-slate-400" size={18} />
                                <input
                                    type="date"
                                    name="date"
                                    required
                                    value={formData.date}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-600"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 border border-slate-200 rounded-lg transition-all"
                        >
                            Cancel
                        </button>
                        <Button
                            type="submit"
                            className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20 px-6"
                        >
                            Create Shipment
                        </Button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default AddShipmentModal;
