import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, User, Phone, FileText, Truck, MoreVertical, Trash2, Edit, Key } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/ui/Button';
import DataTable from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';
import AddDriverModal from '../../components/transporter/AddDriverModal';
import DriverCredentialsModal from '../../components/transporter/DriverCredentialsModal';
import AssignVehicleModal from '../../components/transporter/AssignVehicleModal';
import { api } from '../../utils/api';

const Drivers = () => {
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // Vehicles state for assignment
    const [vehicles, setVehicles] = useState([]);

    // Credentials Modal State
    const [credentials, setCredentials] = useState(null);
    const [isCredentialsModalOpen, setIsCredentialsModalOpen] = useState(false);

    // Assign Vehicle Modal State
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [selectedDriverForAssignment, setSelectedDriverForAssignment] = useState(null);

    // Refresh Data
    const refreshData = async () => {
        try {
            setLoading(true);
            const [driversRes, vehiclesRes] = await Promise.all([
                api.driver.getAll(),
                api.vehicle.getAll()
            ]);

            if (driversRes.success) {
                setDrivers(driversRes.data);
            }
            if (vehiclesRes.success) {
                setVehicles(vehiclesRes.data);
            }
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshData();
    }, []);

    const handleAddDriver = async (driverData) => {
        try {
            const response = await api.driver.create(driverData);
            if (response.success) {
                refreshData();
                setIsAddModalOpen(false);
                // Show credentials modal
                if (response.data.credentials) {
                    setCredentials(response.data.credentials);
                    setIsCredentialsModalOpen(true);
                }
            }
        } catch (error) {
            alert(error.message || 'Failed to add driver');
        }
    };

    const handleDeleteDriver = async (id) => {
        if (window.confirm('Are you sure you want to delete this driver?')) {
            try {
                await api.driver.delete(id);
                refreshData();
            } catch (error) {
                console.error('Failed to delete driver:', error);
            }
        }
    };

    const openAssignModal = (driver) => {
        setSelectedDriverForAssignment(driver);
        setIsAssignModalOpen(true);
    };

    const handleAssignVehicle = async (driverId, vehicleId) => {
        try {
            const response = await api.driver.assignVehicle(driverId, vehicleId);
            if (response.success) {
                refreshData();
                setIsAssignModalOpen(false);
            }
        } catch (error) {
            alert(error.message || 'Failed to assign vehicle');
        }
    };

    // Filter Logic
    const filteredDrivers = drivers.filter(d =>
        (d.fullName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (d.licenseNumber?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (d.phone?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    const columns = [
        {
            header: 'Driver Name',
            accessor: 'fullName',
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-xs">
                        {row.fullName?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="font-medium text-slate-800">{row.fullName}</p>
                        <p className="text-xs text-slate-500">{row.email}</p>
                    </div>
                </div>
            )
        },
        {
            header: 'Contact',
            accessor: 'phone',
            render: (row) => (
                <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Phone size={14} />
                    {row.phone}
                </div>
            )
        },
        {
            header: 'License',
            accessor: 'licenseNumber',
            render: (row) => (
                <div className="flex items-center gap-2">
                    <FileText size={14} className="text-slate-400" />
                    <span className="font-mono text-xs">{row.licenseNumber}</span>
                </div>
            )
        },
        {
            header: 'Assigned Vehicle',
            accessor: 'assignedVehicle',
            render: (row) => {
                // Determine if assignedVehicle is populated object or ID (it should be populated)
                const vehicle = row.assignedVehicle && typeof row.assignedVehicle === 'object'
                    ? row.assignedVehicle
                    : vehicles.find(v => v._id === row.assignedVehicle);

                return vehicle ? (
                    <div className="flex items-center gap-2 text-sm text-slate-700">
                        <Truck size={14} className="text-emerald-500" />
                        <span>{vehicle.registrationNumber}</span>
                        <span className="text-xs text-slate-400">({vehicle.type})</span>
                    </div>
                ) : (
                    <span className="text-xs text-slate-400 italic">Unassigned</span>
                );
            }
        },
        {
            header: 'Status',
            accessor: 'dutyStatus',
            render: (row) => {
                const isActive = row.dutyStatus === 'on-duty';
                return (
                    <span
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${isActive
                            ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-500 border border-slate-200'
                            }`}
                    >
                        {isActive ? 'Active' : 'Inactive'}
                    </span>
                );
            }
        },
        {
            header: 'Actions',
            accessor: '_id',
            render: (row) => (
                <div className="flex items-center gap-2">
                    <button
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Assign Vehicle"
                        onClick={(e) => { e.stopPropagation(); openAssignModal(row); }}
                    >
                        <Truck size={16} />
                    </button>
                    <button className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="View Credentials">
                        <Key size={16} />
                    </button>
                    <button
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        onClick={(e) => { e.stopPropagation(); handleDeleteDriver(row._id); }}
                        title="Delete"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            )
        }
    ];

    return (
        <DashboardLayout role="transporter">
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-display font-bold text-slate-800">Driver Management</h1>
                        <p className="text-slate-500">Manage your fleet drivers and assignments</p>
                    </div>
                    <Button
                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                        icon={Plus}
                        onClick={() => setIsAddModalOpen(true)}
                    >
                        Add Driver
                    </Button>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-2.5 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search drivers..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                        />
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                    <DataTable
                        columns={columns}
                        data={filteredDrivers}
                        loading={loading}
                        emptyMessage="No drivers found. Add your first driver to get started."
                    />
                </div>
            </div>

            <AddDriverModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAdd={handleAddDriver}
            />

            <DriverCredentialsModal
                isOpen={isCredentialsModalOpen}
                onClose={() => setIsCredentialsModalOpen(false)}
                credentials={credentials}
            />

            <AssignVehicleModal
                isOpen={isAssignModalOpen}
                onClose={() => setIsAssignModalOpen(false)}
                driver={selectedDriverForAssignment}
                vehicles={vehicles}
                onAssign={handleAssignVehicle}
            />
        </DashboardLayout>
    );
};

export default Drivers;
