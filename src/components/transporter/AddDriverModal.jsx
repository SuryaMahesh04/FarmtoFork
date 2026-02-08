import React, { useState } from 'react';
import { X, User, Phone, Mail, FileText, Calendar, Truck, MapPin } from 'lucide-react';
import Button from '../ui/Button';

const AddDriverModal = ({ isOpen, onClose, onAdd, vehicles = [] }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        email: '',
        licenseNumber: '',
        licenseExpiry: '',
        assignedVehicleId: '',
        address: {
            city: '',
            state: ''
        }
    });

    const [errors, setErrors] = useState({});

    // Filter available vehicles (not assigned or assigned to current driver if editing)
    const availableVehicles = vehicles.filter(v =>
        v.status === 'Available' || v.status === 'Maintenance'
    );

    const validate = () => {
        const newErrors = {};
        if (!formData.fullName) newErrors.fullName = 'Full Name is required';
        if (!formData.phone) newErrors.phone = 'Phone number is required';
        if (!formData.email) newErrors.email = 'Email is required';
        if (!formData.licenseNumber) newErrors.licenseNumber = 'License Number is required';
        if (!formData.licenseExpiry) newErrors.licenseExpiry = 'License Expiry is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            onAdd(formData);
            // Reset form
            setFormData({
                fullName: '',
                phone: '',
                email: '',
                licenseNumber: '',
                licenseExpiry: '',
                assignedVehicleId: '',
                address: { city: '', state: '' }
            });
            onClose();
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
        // Clear error
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-6 border-b border-slate-100 sticky top-0 bg-white z-10">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Add New Driver</h2>
                        <p className="text-sm text-slate-500">Register a new driver to your fleet</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Personal Info */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Personal Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                    <User size={16} className="text-emerald-600" />
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all ${errors.fullName ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}
                                    placeholder="Enter full name"
                                />
                                {errors.fullName && <p className="text-xs text-red-500">{errors.fullName}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                    <Phone size={16} className="text-emerald-600" />
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all ${errors.phone ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}
                                    placeholder="+91 98765 43210"
                                />
                                {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
                            </div>

                            <div className="space-y-1.5 md:col-span-2">
                                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                    <Mail size={16} className="text-emerald-600" />
                                    Email Address (for login)
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all ${errors.email ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}
                                    placeholder="driver@example.com"
                                />
                                {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-slate-100 my-4"></div>

                    {/* Checkbox / License Info */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">License & Assignment</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                    <FileText size={16} className="text-emerald-600" />
                                    License Number
                                </label>
                                <input
                                    type="text"
                                    name="licenseNumber"
                                    value={formData.licenseNumber}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all ${errors.licenseNumber ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}
                                    placeholder="DL-1234567890"
                                />
                                {errors.licenseNumber && <p className="text-xs text-red-500">{errors.licenseNumber}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                    <Calendar size={16} className="text-emerald-600" />
                                    License Expiry
                                </label>
                                <input
                                    type="date"
                                    name="licenseExpiry"
                                    value={formData.licenseExpiry}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all ${errors.licenseExpiry ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}
                                />
                                {errors.licenseExpiry && <p className="text-xs text-red-500">{errors.licenseExpiry}</p>}
                            </div>

                            <div className="space-y-1.5 md:col-span-2">
                                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                    <Truck size={16} className="text-emerald-600" />
                                    Assign Vehicle (Optional)
                                </label>
                                <select
                                    name="assignedVehicleId"
                                    value={formData.assignedVehicleId}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                                >
                                    <option value="">No Vehicle Assigned</option>
                                    {availableVehicles.map(v => (
                                        <option key={v._id || v.id} value={v._id || v.id}>
                                            {v.registrationNumber} - {v.name || `${v.make} ${v.model}`} ({v.type})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-slate-100 my-4"></div>

                    {/* Address Info */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Address</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                    <MapPin size={16} className="text-emerald-600" />
                                    City
                                </label>
                                <input
                                    type="text"
                                    name="address.city"
                                    value={formData.address.city}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                                    placeholder="Enter city"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                    <MapPin size={16} className="text-emerald-600" />
                                    State
                                </label>
                                <input
                                    type="text"
                                    name="address.state"
                                    value={formData.address.state}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                                    placeholder="Enter state"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button
                            variant="secondary"
                            className="flex-1 justify-center"
                            onClick={onClose}
                            type="button"
                        >
                            Cancel
                        </Button>
                        <Button
                            className="flex-1 justify-center bg-emerald-600 hover:bg-emerald-700 text-white"
                            type="submit"
                        >
                            Save Driver
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddDriverModal;
