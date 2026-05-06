import React, { useState, useEffect } from 'react';
import { Truck, MapPin, Calendar, Clock } from 'lucide-react';
import { api } from '../../utils/api';
import DashboardLayout from '../../components/layout/DashboardLayout';
import DataTable from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';
import useMediaQuery from '../../utils/useMediaQuery';
import Loader from '../../components/ui/Loader';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';

const Incoming = () => {
    const isMobile = useMediaQuery('(max-width: 768px)');
    const [incoming, setIncoming] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [assigning, setAssigning] = useState(false);
    const [selectedShipment, setSelectedShipment] = useState(null);
    const [selectedWarehouse, setSelectedWarehouse] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [stats, setStats] = useState({
        inTransit: 0,
        scheduled: 0,
        today: 0,
        totalWeight: 0
    });

    useEffect(() => {
        fetchIncoming();
        fetchWarehouses();
    }, []);

    const fetchWarehouses = async () => {
        try {
            const res = await api.distributor.getWarehouses();
            if (res.success) {
                setWarehouses(res.data);
            }
        } catch (error) {
            console.error('Failed to fetch warehouses:', error);
        }
    };

    const handleAssignClick = (shipment) => {
        setSelectedShipment(shipment);
        setSelectedWarehouse(shipment.warehouse?._id || '');
        setIsModalOpen(true);
    };

    const handleAssignWarehouse = async () => {
        if (!selectedWarehouse) {
            toast.error('Please select a warehouse');
            return;
        }

        try {
            setAssigning(true);
            const res = await api.distributor.assignWarehouse(selectedShipment._id, selectedWarehouse);
            if (res.success) {
                toast.success('Warehouse assigned successfully');
                setIsModalOpen(false);
                fetchIncoming();
            }
        } catch (error) {
            toast.error(error.message || 'Failed to assign warehouse');
        } finally {
            setAssigning(false);
        }
    };

    const fetchIncoming = async () => {
        try {
            setLoading(true);
            const res = await api.distributor.getIncoming();
            if (res.success) {
                setIncoming(res.data);
                
                // Calculate stats
                const now = new Date();
                const todayStr = now.toISOString().split('T')[0];
                
                let inTransit = 0;
                let scheduled = 0;
                let today = 0;
                let totalWeight = 0;

                res.data.forEach(ship => {
                    if (ship.status === 'in-transit') inTransit++;
                    else if (['pending', 'accepted', 'assigned', 'at_pickup', 'picked_up'].includes(ship.status)) scheduled++;
                    
                    const shipDate = new Date(ship.createdAt).toISOString().split('T')[0];
                    if (shipDate === todayStr) today++;
                    
                    if (ship.batch) totalWeight += (ship.batch.quantity || 0);
                });

                setStats({ inTransit, scheduled, today, totalWeight: Math.round(totalWeight) });
            }
        } catch (error) {
            console.error('Failed to fetch incoming shipments:', error);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        { header: 'Shipment ID', accessor: '_id', render: (row) => <span className="font-mono text-xs text-slate-500 uppercase">{row.shipmentId || row._id.slice(-8)}</span> },
        { header: 'Origin', accessor: 'farmer', render: (row) => row.farmer?.profile?.fullName || 'N/A' },
        { header: 'Items', accessor: 'batch', render: (row) => row.batch ? `${row.batch.crop} - ${row.batch.quantity}${row.batch.unit || 'kg'}` : 'N/A' },
        { header: 'Date', accessor: 'createdAt', render: (row) => new Date(row.createdAt).toLocaleDateString() },
        { header: 'Warehouse', accessor: 'warehouse', render: (row) => (
            <span className={row.warehouse ? "text-emerald-600 font-medium" : "text-amber-500 font-medium"}>
                {row.warehouse?.name || (warehouses.find(w => w._id === row.warehouse)?.name) || 'Not Assigned'}
            </span>
        )},
        { header: 'Status', accessor: 'status', render: (row) => <StatusBadge status={row.status} /> },
        { header: 'Action', accessor: 'action', render: (row) => (
            <button 
                onClick={() => handleAssignClick(row)}
                className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg transition-colors font-semibold"
            >
                Assign
            </button>
        )},
    ];

    if (loading) {
        return (
            <DashboardLayout role="distributor">
                <Loader text="Fetching incoming shipments..." />
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout role="distributor">
            <div className="space-y-6">
                <div className="animate-in">
                    <h1 className="text-xl md:text-2xl font-display font-bold text-slate-800">Incoming Shipments</h1>
                    <p className="text-sm md:text-base text-slate-500">Track arrivals and manage receiving</p>
                </div>

                {/* Stats Cards */}
                <div className={`grid ${isMobile ? 'grid-cols-2 gap-3' : 'grid-cols-4 gap-6'} animate-in`} style={{ animationDelay: '0.1s' }}>
                    <div className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-2 text-slate-600 mb-2">
                            <Truck size={18} />
                            <span className="text-xs font-medium">In Transit</span>
                        </div>
                        <p className="text-2xl font-bold text-slate-800">{stats.inTransit}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-2 text-slate-600 mb-2">
                            <Calendar size={18} />
                            <span className="text-xs font-medium">Scheduled</span>
                        </div>
                        <p className="text-2xl font-bold text-blue-600">{stats.scheduled}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-2 text-slate-600 mb-2">
                            <Clock size={18} />
                            <span className="text-xs font-medium">Received Today</span>
                        </div>
                        <p className="text-2xl font-bold text-emerald-600">{stats.today}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-2 text-slate-600 mb-2">
                            <MapPin size={18} />
                            <span className="text-xs font-medium">Total Weight</span>
                        </div>
                        <p className="text-2xl font-bold text-slate-800">{stats.totalWeight}kg</p>
                    </div>
                </div>

                {/* Shipments Table */}
                <div className="animate-in" style={{ animationDelay: '0.2s' }}>
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="p-4 border-b border-slate-100">
                            <h2 className="text-base md:text-lg font-display font-semibold text-slate-700">Active Incoming Shipments</h2>
                        </div>
                        <div className={isMobile ? 'overflow-x-auto' : ''}>
                            {incoming.length > 0 ? (
                                <DataTable columns={columns} data={incoming} />
                            ) : (
                                <div className="p-12 text-center text-slate-400">
                                    No active incoming shipments found.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Assign Warehouse Modal */}
                <Modal 
                    isOpen={isModalOpen} 
                    onClose={() => setIsModalOpen(false)}
                    title="Assign to Warehouse"
                >
                    <div className="space-y-6">
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <h4 className="text-sm font-bold text-slate-700 mb-2">Shipment Details</h4>
                            <p className="text-sm text-slate-600">ID: <span className="font-mono font-bold uppercase">{selectedShipment?.shipmentId}</span></p>
                            <p className="text-sm text-slate-600">Item: <span className="font-bold">{selectedShipment?.batch?.crop}</span></p>
                            <p className="text-sm text-slate-600">Quantity: <span className="font-bold">{selectedShipment?.batch?.quantity}{selectedShipment?.batch?.unit}</span></p>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Select Storage Facility</label>
                            <select 
                                value={selectedWarehouse}
                                onChange={(e) => setSelectedWarehouse(e.target.value)}
                                className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none bg-white text-slate-700"
                            >
                                <option value="">-- Choose a Warehouse --</option>
                                {warehouses.map(w => (
                                    <option key={w._id} value={w._id}>
                                        {w.name} ({w.type}) - Cap: {w.capacity}kg
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex gap-3">
                            <Button 
                                variant="outline" 
                                className="flex-1" 
                                onClick={() => setIsModalOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button 
                                className="flex-1 bg-emerald-600 text-white" 
                                onClick={handleAssignWarehouse}
                                loading={assigning}
                                disabled={!selectedWarehouse}
                            >
                                Assign Warehouse
                            </Button>
                        </div>
                    </div>
                </Modal>
            </div>
        </DashboardLayout>
    );
};

export default Incoming;
