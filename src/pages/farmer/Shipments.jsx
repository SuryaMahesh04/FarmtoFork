import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, Plus, Package, MapPin, Calendar, User } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/ui/Button';
import StatusBadge from '../../components/ui/StatusBadge';
import { api } from '../../utils/api';

const Shipments = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [shipments, setShipments] = useState([]);

    useEffect(() => {
        fetchShipments();
    }, []);

    const fetchShipments = async () => {
        try {
            setLoading(true);
            const response = await api.shipment.getAll();
            if (response.success) {
                setShipments(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch shipments:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <DashboardLayout role="farmer">
                <div className="flex justify-center items-center h-96">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout role="farmer">
            <div className="space-y-6 animate-in pb-20 md:pb-0">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-display font-bold text-slate-800">My Shipments</h1>
                        <p className="text-slate-500">Track and manage your outgoing shipments</p>
                    </div>
                    <Button icon={Plus} onClick={() => navigate('/farmer/create-shipment')} className="w-full md:w-auto justify-center">Create Shipment</Button>
                </div>

                {shipments.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-xl border border-slate-200 shadow-sm">
                        <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Truck className="text-emerald-500" size={32} />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-800 mb-2">No shipments yet</h3>
                        <p className="text-slate-500 mb-6 max-w-sm mx-auto">Create a shipment to start tracking the journey of your produce to the distributor.</p>
                        <Button onClick={() => navigate('/farmer/create-shipment')}>Create First Shipment</Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {shipments.map((shipment) => (
                            <div key={shipment._id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                                            <Package size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-slate-800">{shipment.shipmentId}</h3>
                                            <p className="text-xs text-slate-500">{new Date(shipment.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <StatusBadge status={shipment.status} />
                                </div>

                                <div className="space-y-3 mb-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Batch:</span>
                                        <span className="font-medium text-slate-700">{shipment.batch?.crop} ({shipment.batch?.variety})</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Quantity:</span>
                                        <span className="font-medium text-slate-700">{shipment.batch?.quantity} kg</span>
                                    </div>
                                    <div className="border-t border-slate-100 my-2"></div>
                                    <div className="flex items-start gap-2 text-sm text-slate-600">
                                        <User size={16} className="mt-0.5 text-slate-400" />
                                        <span className="flex-1">
                                            <span className="text-xs text-slate-400 block">Distributor</span>
                                            {shipment.distributor?.profile?.companyName || shipment.distributor?.profile?.fullName}
                                        </span>
                                    </div>
                                    <div className="flex items-start gap-2 text-sm text-slate-600">
                                        <Truck size={16} className="mt-0.5 text-slate-400" />
                                        <span className="flex-1">
                                            <span className="text-xs text-slate-400 block">Transporter</span>
                                            {shipment.transporter?.profile?.companyName || shipment.transporter?.profile?.fullName}
                                        </span>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                                    <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                                        <MapPin size={14} />
                                        {shipment.trackingUpdates && shipment.trackingUpdates.length > 0
                                            ? shipment.trackingUpdates[shipment.trackingUpdates.length - 1].location
                                            : 'Origin'}
                                    </div>
                                    <button
                                        onClick={() => navigate(`/farmer/shipment/${shipment._id}`)}
                                        className="text-sm font-medium text-emerald-600 hover:text-emerald-700 hover:underline"
                                    >
                                        View Details
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default Shipments;
