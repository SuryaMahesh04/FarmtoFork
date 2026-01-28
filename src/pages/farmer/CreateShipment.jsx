import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, Package, User, Save, ArrowLeft } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import { api } from '../../utils/api';
import Loader from '../../components/ui/Loader';

const CreateShipment = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Data Loading State
    const [batches, setBatches] = useState([]);
    const [distributors, setDistributors] = useState([]);
    const [transporters, setTransporters] = useState([]);

    // Form State
    const [formData, setFormData] = useState({
        batchId: '',
        distributorId: '',
        transporterId: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const minLoadTime = 3400;
            const [batchesRes, distRes, transpRes, shipmentsRes] = await Promise.all([
                api.farmer.getBatches({ status: 'active' }), // Only active batches
                api.shipment.getDistributors(),
                api.shipment.getTransporters(),
                api.shipment.getAll(), // Fetch existing shipments to filter
                new Promise(resolve => setTimeout(resolve, minLoadTime))
            ]);

            if (batchesRes.success) {
                let availableBatches = batchesRes.data;

                if (shipmentsRes.success) {
                    // Create a Set of batch IDs that are already in a shipment
                    const shippedBatchIds = new Set(shipmentsRes.data.map(shipment =>
                        typeof shipment.batch === 'object' ? shipment.batch._id : shipment.batch
                    ));

                    // Filter out already shipped batches
                    availableBatches = availableBatches.filter(batch => !shippedBatchIds.has(batch._id));
                }

                setBatches(availableBatches);
            }
            if (distRes.success) setDistributors(distRes.data);
            if (transpRes.success) setTransporters(transpRes.data);

        } catch (error) {
            console.error('Failed to load data:', error);
            // In a real app, show a toast/notification here
        } finally {
            setLoading(false);
        }
    };

    const handleBatchChange = (e) => {
        setFormData({ ...formData, batchId: e.target.value });
    };

    const handleDistributorChange = (e) => {
        setFormData({ ...formData, distributorId: e.target.value });
    };

    const handleTransporterChange = (e) => {
        setFormData({ ...formData, transporterId: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            const response = await api.shipment.create(formData);

            if (response.success) {
                navigate('/farmer/shipments');
            }
        } catch (error) {
            console.error('Failed to create shipment:', error);
            // Handle error (show toast)
        } finally {
            setSubmitting(false);
        }
    };

    // Prepare options for Select components
    const batchOptions = batches.map(b => ({
        value: b._id,
        label: `${b.crop} - ${b.variety} (${b.formattedId || b.batchId})`
    }));

    const distributorOptions = distributors.map(d => ({
        value: d._id,
        label: d.profile?.companyName || d.profile?.fullName || 'Unknown Distributor'
    }));

    const transporterOptions = transporters.map(t => ({
        value: t._id,
        label: t.profile?.companyName || t.profile?.fullName || 'Unknown Transporter'
    }));

    if (loading) {
        return (
            <DashboardLayout role="farmer">
                <Loader text="Loading form data..." />
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout role="farmer">
            <div className="max-w-3xl mx-auto space-y-6 animate-in">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
                        <ArrowLeft size={20} />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-display font-bold text-slate-800">Create New Shipment</h1>
                        <p className="text-slate-500">Initiate shipment for your harvested batches</p>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Batch Selection */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-slate-700">Select Batch</label>
                            <div className="relative">
                                <Package className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <select
                                    required
                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all selection:bg-emerald-100"
                                    value={formData.batchId}
                                    onChange={handleBatchChange}
                                >
                                    <option value="">Select a batch...</option>
                                    {batchOptions.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>
                            <p className="text-xs text-slate-500">Only active batches are shown here.</p>
                        </div>

                        {/* Distributor Selection */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-slate-700">Preferred Distributor</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <select
                                    required
                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all selection:bg-emerald-100"
                                    value={formData.distributorId}
                                    onChange={handleDistributorChange}
                                >
                                    <option value="">Select a distributor...</option>
                                    {distributorOptions.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Transporter Selection */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-slate-700">Preferred Transporter</label>
                            <div className="relative">
                                <Truck className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <select
                                    required
                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all selection:bg-emerald-100"
                                    value={formData.transporterId}
                                    onChange={handleTransporterChange}
                                >
                                    <option value="">Select a transporter...</option>
                                    {transporterOptions.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="pt-6 flex items-center justify-end gap-4 border-t border-slate-100">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => navigate(-1)}
                                disabled={submitting}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                isLoading={submitting}
                                icon={Save}
                            >
                                Create Shipment
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default CreateShipment;
