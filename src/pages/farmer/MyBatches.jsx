import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, Loader2, QrCode } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import DataTable from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';
import Button from '../../components/ui/Button';
import Loader from '../../components/ui/Loader';
import { api } from '../../utils/api';

const MyBatches = () => {
    const navigate = useNavigate();
    const [batches, setBatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');

    useEffect(() => {
        fetchBatches();
    }, []);

    const fetchBatches = async () => {
        try {
            setLoading(true);
            const minLoadTime = 1000;
            const [res] = await Promise.all([
                api.farmer.getBatches(),
                new Promise(resolve => setTimeout(resolve, minLoadTime))
            ]);

            if (res.success) {
                setBatches(res.data);
            } else {
                setError('Failed to load batches');
            }
        } catch (err) {
            console.error('Fetch error:', err);
            setError('Failed to load batches');
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        { header: 'Batch ID', accessor: 'batchId', render: (row) => row.isTampered ? <span className="text-red-500 font-bold flex items-center gap-1" title="Data Tampered">⚠️ <span className="font-mono text-xs text-red-500">{row.batchId}</span></span> : <span className="font-mono text-xs">{row.batchId}</span> },
        { header: 'Crop', accessor: 'crop' },
        { header: 'Variety', accessor: 'variety' },
        { header: 'Quantity', accessor: 'quantity', render: (row) => row.isTampered ? <span className="text-red-500 font-bold">TAMPERED</span> : `${row.quantity} ${row.unit}` },
        { header: 'Date', accessor: 'harvestDate', render: (row) => new Date(row.harvestDate).toLocaleDateString() },
        { header: 'Quality', accessor: 'qualityScore', render: (row) => row.isTampered ? <span className="text-red-500 font-bold">--</span> : row.qualityScore },
        { header: 'Status', accessor: 'status', render: (row) => row.isTampered ? <StatusBadge status="TAMPERED" type="error" /> : <StatusBadge status={row.status} /> },
    ];

    const filteredBatches = batches.filter(batch => {
        const matchesSearch =
            (batch.batchId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (batch.crop || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (batch.variety || '').toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter = filterStatus === 'All' || batch.status === filterStatus;

        return matchesSearch && matchesFilter;
    });

    const uniqueStatuses = ['All', ...new Set(batches.map(b => b.status))];

    return (
        <DashboardLayout role="farmer">
            <div className="space-y-6 animate-in pb-20 md:pb-0">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-display font-bold text-slate-800">My Batches</h1>
                        <p className="text-slate-500">Manage and track your crop batches</p>
                    </div>
                    <Button icon={Plus} onClick={() => navigate('/farmer/create-batch')} className="w-full md:w-auto justify-center">Create New Batch</Button>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-sage-100 p-4">
                    <div className="flex flex-col gap-4 mb-6">
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search batches..."
                                className="w-full pl-10 pr-4 py-3 md:py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sage-400 focus:border-transparent"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                            {uniqueStatuses.map(status => (
                                <button
                                    key={status}
                                    onClick={() => setFilterStatus(status)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${filterStatus === status
                                        ? 'bg-sage-100 text-sage-700'
                                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                                        }`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-12">
                            <Loader text="Loading batches..." />
                        </div>
                    ) : error ? (
                        <div className="text-center py-12 text-red-500">
                            {error}
                            <button onClick={fetchBatches} className="block mx-auto mt-2 text-sm text-blue-600 hover:underline">Retry</button>
                        </div>
                    ) : (
                        <DataTable
                            columns={columns}
                            data={filteredBatches}
                            onRowClick={(row) => navigate(`/farmer/batches/${row._id}`)}
                        />
                    )}

                    {!loading && !error && filteredBatches.length === 0 && (
                        <div className="text-center py-12 text-slate-500">
                            No batches found matching your criteria.
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default MyBatches;
