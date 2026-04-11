import React, { useState, useEffect } from 'react';
import { Truck, MapPin, Calendar, Clock } from 'lucide-react';
import { api } from '../../utils/api';
import DashboardLayout from '../../components/layout/DashboardLayout';
import DataTable from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';
import useMediaQuery from '../../utils/useMediaQuery';
import Loader from '../../components/ui/Loader';

const Incoming = () => {
    const isMobile = useMediaQuery('(max-width: 768px)');
    const [incoming, setIncoming] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        inTransit: 0,
        scheduled: 0,
        today: 0,
        totalWeight: 0
    });

    useEffect(() => {
        fetchIncoming();
    }, []);

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
                    if (ship.status === 'pending' || ship.status === 'accepted') scheduled++;
                    
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
        { header: 'Shipment ID', accessor: '_id', render: (row) => <span className="font-mono text-xs text-slate-500 uppercase">{row._id.slice(-8)}</span> },
        { header: 'Origin', accessor: 'farmer', render: (row) => row.farmer?.profile?.fullName || 'N/A' },
        { header: 'Items', accessor: 'batch', render: (row) => row.batch ? `${row.batch.crop} - ${row.batch.quantity}${row.batch.unit}` : 'N/A' },
        { header: 'Date', accessor: 'createdAt', render: (row) => new Date(row.createdAt).toLocaleDateString() },
        { header: 'ETA', accessor: 'eta', render: (row) => row.eta || 'Calculating...' },
        { header: 'Status', accessor: 'status', render: (row) => <StatusBadge status={row.status} /> },
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
            </div>
        </DashboardLayout>
    );
};

export default Incoming;
