import React, { useState, useEffect } from 'react';
import { X, Truck, User } from 'lucide-react';
import Button from '../ui/Button';

const AssignVehicleModal = ({ isOpen, onClose, driver, vehicles, onAssign }) => {
    const [selectedVehicleId, setSelectedVehicleId] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && driver) {
            setSelectedVehicleId(driver.assignedVehicle?._id || driver.assignedVehicle || '');
        }
    }, [isOpen, driver]);

    if (!isOpen || !driver) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Pass null or empty string to unassign
            await onAssign(driver._id, selectedVehicleId || null);
            onClose();
        } catch (error) {
            console.error('Assignment failed', error);
        } finally {
            setLoading(false);
        }
    };

    // Filter vehicles: Show currently assigned one OR available ones
    const availableVehicles = vehicles.filter(v =>
        v.status === 'Available' || v._id === (driver.assignedVehicle?._id || driver.assignedVehicle)
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 m-4 relative animate-in zoom-in-95 duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                        <Truck size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-display font-bold text-slate-800">Assign Vehicle</h2>
                        <p className="text-sm text-slate-500">Select a vehicle for {driver.fullName}</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-600 uppercase">Select Vehicle</label>
                        <select
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none"
                            value={selectedVehicleId}
                            onChange={(e) => setSelectedVehicleId(e.target.value)}
                        >
                            <option value="">-- No Vehicle Assigned --</option>
                            {availableVehicles.map(vehicle => (
                                <option key={vehicle._id} value={vehicle._id}>
                                    {vehicle.registrationNumber} - {vehicle.name || `${vehicle.make} ${vehicle.model}`} ({vehicle.type})
                                </option>
                            ))}
                        </select>
                        <p className="text-xs text-slate-400 mt-1">
                            Only available vehicles are shown.
                        </p>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <Button
                            type="submit"
                            loading={loading}
                            className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20"
                        >
                            Save Assignment
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AssignVehicleModal;
