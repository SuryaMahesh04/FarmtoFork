import React, { useState, useEffect } from 'react';
import { Package, Search, Filter } from 'lucide-react';
import { api } from '../../utils/api';
import DashboardLayout from '../../components/layout/DashboardLayout';
import DataTable from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';
import Button from '../../components/ui/Button';
import useMediaQuery from '../../utils/useMediaQuery';
import Loader from '../../components/ui/Loader';

// Dummy data replaced by real API call

const Inventory = () => {
    const isMobile = useMediaQuery('(max-width: 768px)');
    const [filterCategory, setFilterCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        try {
            setLoading(true);
            const minLoadTime = 3400;
            const [res] = await Promise.all([
                api.distributor.getInventory(),
                new Promise(resolve => setTimeout(resolve, minLoadTime))
            ]);

            if (res.success) {
                setInventory(res.data);
            } else {
                setError('Failed to load inventory');
            }
        } catch (err) {
            console.error('Inventory fetch error:', err);
            setError('Failed to load inventory');
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        { header: 'Item Code', accessor: 'id' },
        { header: 'Product', accessor: 'item' },
        { header: 'Category', accessor: 'category' }, // Note: Backend might not send category yet, need to handle graceful fallback or hide
        { header: 'Stock Level', accessor: 'stock' },
        { header: 'Warehouse', accessor: 'warehouse' },
        { header: 'Expiry', accessor: 'expiry' },
        { header: 'Status', accessor: 'status', render: (row) => <StatusBadge status={row.status} /> },
    ];

    // Fallback if category is missing in backend response
    const safeInventory = inventory.map(item => ({
        ...item,
        category: item.category || 'Uncategorized' // or derive from crop type if available
    }));

    const filteredInventory = safeInventory.filter(item => {
        const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
        const matchesSearch = (item.item || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.id || '').toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const categoryCounts = {
        all: safeInventory.length,
        Grains: safeInventory.filter(i => i.category === 'Grains').length,
        Vegetables: safeInventory.filter(i => i.category === 'Vegetables').length,
        Fruits: safeInventory.filter(i => i.category === 'Fruits').length,
        Dairy: safeInventory.filter(i => i.category === 'Dairy').length
    };

    if (loading) {
        return (
            <DashboardLayout role="distributor">
                <Loader text="Loading inventory..." />
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout role="distributor">
            <div className="space-y-6">
                <div className="animate-in">
                    <h1 className="text-xl md:text-2xl font-display font-bold text-slate-800">Inventory Management</h1>
                    <p className="text-sm md:text-base text-slate-500">Track and manage warehouse stock</p>
                </div>

                {/* Category Filter */}
                <div className={`${isMobile ? 'flex overflow-x-auto gap-2 pb-2' : 'flex gap-4'} animate-in`} style={{ animationDelay: '0.1s' }}>
                    {[
                        { key: 'all', label: 'All Items', count: categoryCounts.all },
                        { key: 'Grains', label: 'Grains', count: categoryCounts.Grains },
                        { key: 'Vegetables', label: 'Vegetables', count: categoryCounts.Vegetables },
                        { key: 'Fruits', label: 'Fruits', count: categoryCounts.Fruits },
                        { key: 'Dairy', label: 'Dairy', count: categoryCounts.Dairy }
                    ].map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setFilterCategory(tab.key)}
                            className={`${isMobile ? 'px-4 py-2 text-sm whitespace-nowrap' : 'px-6 py-3'
                                } rounded-lg font-medium transition-all ${filterCategory === tab.key
                                    ? 'bg-amber-100 text-amber-800 shadow-sm'
                                    : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                                }`}
                        >
                            {tab.label}
                            <span className={`ml-2 ${isMobile ? 'text-xs' : 'text-sm'} ${filterCategory === tab.key ? 'text-amber-600' : 'text-slate-400'}`}>
                                ({tab.count})
                            </span>
                        </button>
                    ))}
                </div>

                {/* Search Bar */}
                <div className="animate-in" style={{ animationDelay: '0.2s' }}>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by product name or item code..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 focus:outline-none bg-white"
                        />
                    </div>
                </div>

                {/* Inventory Table */}
                <div className="animate-in" style={{ animationDelay: '0.3s' }}>
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                            <h2 className="text-base md:text-lg font-display font-semibold text-slate-700">
                                {filteredInventory.length} Item{filteredInventory.length !== 1 ? 's' : ''}
                            </h2>
                            {!isMobile && (
                                <Button icon={Filter} variant="ghost" size="sm">Advanced Filter</Button>
                            )}
                        </div>
                        <div className={isMobile ? 'overflow-x-auto' : ''}>
                            <DataTable columns={columns} data={filteredInventory} />
                        </div>
                    </div>

                    {filteredInventory.length === 0 && (
                        <div className="text-center py-12">
                            <Package className="mx-auto text-slate-300 mb-4" size={48} />
                            <p className="text-slate-500">{error ? error : "No inventory items found matching your criteria"}</p>
                            {error && <Button onClick={fetchInventory} variant="ghost" className="mt-2 text-blue-600">Retry</Button>}
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Inventory;
