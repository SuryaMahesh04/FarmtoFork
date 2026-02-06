import React, { useState } from 'react';
import { X, Truck, User, Hash, Weight, Star, Phone } from 'lucide-react';
import Button from '../ui/Button';

const AddVehicleModal = ({ isOpen, onClose, onAdd }) => {
    const [formData, setFormData] = useState({
        type: 'Open Truck',
        customType: '',
        plate: '',
        capacity: '',
        capacityUnit: 'Tons',
        driverName: '',
        driverPhone: '',
        driverExp: ''
    });

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        const finalType = formData.type === 'Other' ? formData.customType : formData.type;
        
        onAdd({
            ...formData,
            type: finalType
        });
        
        onClose();
        setFormData({ 
            type: 'Open Truck', 
            customType: '', 
            plate: '', 
            capacity: '', 
            capacityUnit: 'Tons',
            driverName: '', 
            driverPhone: '', 
            driverExp: '' 
        });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const vehicleTypes = [
        "Open Truck",
        "Refrigerated Truck",
        "Container",
        "Mini Van",
        "Electric Van",
        "Other"
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 m-4 relative animate-in zoom-in-95 duration-200">
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
                        <Truck size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-display font-bold text-slate-800">Add New Vehicle</h2>
                        <p className="text-sm text-slate-500">Register a new vehicle to your fleet</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-600 uppercase">Vehicle Type</label>
                            <div className="relative">
                                <Truck className="absolute left-3 top-2.5 text-slate-400" size={16} />
                                <select
                                    name="type"
                                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all appearance-none"
                                    required
                                    value={formData.type}
                                    onChange={handleChange}
                                >
                                    {vehicleTypes.map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-600 uppercase">Vehicle Number</label>
                            <div className="relative">
                                <Hash className="absolute left-3 top-2.5 text-slate-400" size={16} />
                                <input
                                    type="text"
                                    name="plate"
                                    placeholder="e.g. KA-01-AB-1234"
                                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                    required
                                    value={formData.plate}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Conditional Input for Other Type */}
                    {formData.type === 'Other' && (
                        <div className="space-y-1 animate-in fade-in slide-in-from-top-2 duration-200">
                            <label className="text-xs font-semibold text-slate-600 uppercase">Specify Vehicle Type</label>
                            <input
                                type="text"
                                name="customType"
                                placeholder="Enter custom vehicle type"
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                required
                                value={formData.customType}
                                onChange={handleChange}
                            />
                        </div>
                    )}

                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-600 uppercase">Capacity</label>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <Weight className="absolute left-3 top-2.5 text-slate-400" size={16} />
                                <input
                                    type="number"
                                    name="capacity"
                                    placeholder="e.g. 15"
                                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                    required
                                    value={formData.capacity}
                                    onChange={handleChange}
                                />
                            </div>
                            <select
                                name="capacityUnit"
                                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                value={formData.capacityUnit}
                                onChange={handleChange}
                            >
                                <option value="Tons">Tons</option>
                                <option value="Kgs">Kgs</option>
                                <option value="Ltrs">Ltrs</option>
                            </select>
                        </div>
                    </div>

                    <div className="border-t border-slate-100 my-4 pt-4">
                        <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
                            <User size={16} className="text-emerald-600" />
                            Driver Details
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-500">Driver Name</label>
                                <input
                                    type="text"
                                    name="driverName"
                                    placeholder="Full Name"
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                                    required
                                    value={formData.driverName}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-500">Phone Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-2.5 text-slate-400" size={14} />
                                    <input
                                        type="tel"
                                        name="driverPhone"
                                        placeholder="00000 00000"
                                        className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                                        required
                                        value={formData.driverPhone}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="col-span-2 space-y-1">
                                <label className="text-xs font-medium text-slate-500">Experience (Years)</label>
                                <div className="relative">
                                    <Star className="absolute left-3 top-2.5 text-slate-400" size={14} />
                                    <input
                                        type="number"
                                        name="driverExp"
                                        placeholder="e.g. 5"
                                        className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                                        value={formData.driverExp}
                                        onChange={handleChange}
                                        min="0"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <Button
                            type="submit"
                            className="bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                            Add Vehicle
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddVehicleModal;
