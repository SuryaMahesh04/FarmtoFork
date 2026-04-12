import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, History, Trash2 } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import DataTable from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';
import Button from '../../components/ui/Button';
import useMediaQuery from '../../utils/useMediaQuery';
import { getConsumerHistory, clearConsumerScans } from '../../utils/consumerStore';

const ConsumerHistory = () => {
    const navigate = useNavigate();
    const isMobile = useMediaQuery('(max-width: 768px)');
    
    const [scans, setScans] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            setIsLoading(true);
            const history = await getConsumerHistory();
            setScans(history);
            setIsLoading(false);
        };
        fetchHistory();
    }, []);

    const handleClearHistory = () => {
        if (window.confirm("Are you sure you want to clear your verification history? This will generate a new anonymous tracker id and cannot be undone.")) {
            clearConsumerScans();
            setScans([]);
        }
    };

    const columns = [
        { header: 'Date Scanned', accessor: 'date' },
        { header: 'Batch ID', accessor: 'id' },
        { header: 'Product', accessor: 'product' },
        { header: 'Farm / Origin', accessor: 'origin' },
        { header: 'Verification Status', accessor: 'status', render: (row) => <StatusBadge status={row.status} /> },
        { 
            header: 'Action', 
            accessor: 'action', 
            render: (row) => (
                <Button size="sm" variant="ghost" onClick={() => navigate(`/trace/${row.id}`, { state: { fromHistory: true } })}>
                    View Trace
                </Button>
            ) 
        },
    ];

    const mappedData = scans.map(s => ({
        id: s.batchId,
        date: new Date(s.timestamp).toLocaleString(),
        product: `${s.crop} ${s.variety ? `(${s.variety})` : ''}`,
        origin: s.location || s.farmerName,
        status: s.isTampered ? 'critical' : 'good' // Reusing StatusBadge colors
    }));

    const filteredData = mappedData.filter(item => 
        item.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.origin.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <DashboardLayout role="consumer">
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-in">
                    <div>
                        <h1 className="text-xl md:text-2xl font-display font-bold text-slate-800">Verification History</h1>
                        <p className="text-sm md:text-base text-slate-500">Your personal ledger of traced and verified products</p>
                    </div>
                    {scans.length > 0 && (
                        <div className="flex gap-2 w-full md:w-auto">
                            <div className="relative flex-grow md:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search history..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                                />
                            </div>
                            <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300" icon={Trash2} onClick={handleClearHistory}>
                                Clear
                            </Button>
                        </div>
                    )}
                </div>

                <div className="animate-in" style={{ animationDelay: '0.1s' }}>
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden min-h-[300px]">
                        {isLoading ? (
                            <div className="flex justify-center items-center h-48 text-slate-400">
                                Loading history...
                            </div>
                        ) : scans.length > 0 ? (
                            <div className={isMobile ? 'overflow-x-auto' : ''}>
                                <DataTable columns={columns} data={filteredData} />
                                {filteredData.length === 0 && (
                                    <div className="p-8 text-center text-slate-500">
                                        No matches found for "{searchQuery}"
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-16">
                                <History className="mx-auto text-slate-300 mb-4" size={48} />
                                <h3 className="text-lg font-bold text-slate-700 mb-2">No History Recorded</h3>
                                <p className="text-slate-500 max-w-sm mx-auto text-sm mb-6">
                                    You haven't scanned any products yet. Trace a product using the Authenticator to see it here.
                                </p>
                                <Button onClick={() => navigate('/consumer')}>Go to Authenticator</Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ConsumerHistory;
