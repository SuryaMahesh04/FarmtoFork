import React, { useState } from 'react';
import { Package, Search, Filter } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import DataTable from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';
import Button from '../../components/ui/Button';
import useMediaQuery from '../../utils/useMediaQuery';

const allInventory = [
    { id: 'INV-001', item: 'Wheat', category: 'Grains', stock: '120T', warehouse: 'Zone A', expiry: '2025-06-15', status: 'good' },
    { id: 'INV-002', item: 'Rice (Basmati)', category: 'Grains', stock: '85T', warehouse: 'Zone A', expiry: '2025-05-20', status: 'good' },
    { id: 'INV-003', item: 'Tomatoes', category: 'Vegetables', stock: '15T', warehouse: 'Zone B (Cold)', expiry: '2024-12-20', status: 'warning' },
    { id: 'INV-004', item: 'Onions', category: 'Vegetables', stock: '40T', warehouse: 'Zone B', expiry: '2025-02-10', status: 'good' },
    { id: 'INV-005', item: 'Milk Products', category: 'Dairy', stock: '8T', warehouse: 'Cold Storage', expiry: '2024-12-25', status: 'critical' },
    { id: 'INV-006', item: 'Apples', category: 'Fruits', stock: '25T', warehouse: 'Zone B (Cold)', expiry: '2025-01-10', status: 'good' },
    { id: 'INV-007', item: 'Pulses (Moong)', category: 'Grains', stock: '55T', warehouse: 'Zone A', expiry: '2025-08-15', status: 'good' },
    { id: 'INV-008', item: 'Potatoes', category: 'Vegetables', stock: '30T', warehouse: 'Zone B', expiry: '2025-03-01', status: 'good' },
    { id: 'INV-009', item: 'Oranges', category: 'Fruits', stock: '12T', warehouse: 'Zone B (Cold)', expiry: '2024-12-22', status: 'warning' },
    { id: 'INV-010', item: 'Yogurt', category: 'Dairy', stock: '5T', warehouse: 'Cold Storage', expiry: '2024-12-18', status: 'critical' }
];

const Inventory = () => {
    const isMobile = useMediaQuery('(max-width: 768px)');
    const [filterCategory, setFilterCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const columns = [
        { header: 'Item Code', accessor: 'id' },
        { header: 'Product', accessor: 'item' },
        { header: 'Category', accessor: 'category' },
        { header: 'Stock Level', accessor: 'stock' },
        { header: 'Warehouse', accessor: 'warehouse' },
        { header: 'Expiry', accessor: 'expiry' },
        { header: 'Status', accessor: 'status', render: (row) => <StatusBadge status={row.status} /> },
    ];

    const filteredInventory = allInventory.filter(item => {
        const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
        const matchesSearch = item.item.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.id.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const categoryCounts = {
        all: allInventory.length,
        Grains: allInventory.filter(i => i.category === 'Grains').length,
        Vegetables: allInventory.filter(i => i.category === 'Vegetables').length,
        Fruits: allInventory.filter(i => i.category === 'Fruits').length,
        Dairy: allInventory.filter(i => i.category === 'Dairy').length
    };

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
                            <p className="text-slate-500">No inventory items found matching your criteria</p>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Inventory;
