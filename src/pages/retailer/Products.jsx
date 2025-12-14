import React, { useState } from 'react';
import { Store, Search, Filter } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import DataTable from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';
import Button from '../../components/ui/Button';
import useMediaQuery from '../../utils/useMediaQuery';

const allProducts = [
    { id: 'PRD-001', name: 'Basmati Rice 5kg', category: 'Grains', price: '₹450', stock: '85 bags', status: 'good', verified: true },
    { id: 'PRD-002', name: 'Wheat Flour 10kg', category: 'Grains', price: '₹380', stock: '120 bags', status: 'good', verified: true },
    { id: 'PRD-003', name: 'Organic Honey 500g', category: 'Others', price: '₹650', stock: '4 jars', status: 'critical', verified: true },
    { id: 'PRD-004', name: 'Fresh Tomatoes', category: 'Vegetables', price: '₹60/kg', stock: '45 kg', status: 'good', verified: true },
    { id: 'PRD-005', name: 'Red Onions', category: 'Vegetables', price: '₹45/kg', stock: '80 kg', status: 'good', verified: true },
    { id: 'PRD-006', name: 'Apples (Kashmiri)', category: 'Fruits', price: '₹180/kg', stock: '35 kg', status: 'good', verified: true },
    { id: 'PRD-007', name: 'Oranges', category: 'Fruits', price: '₹80/kg', stock: '8 kg', status: 'warning', verified: true },
    { id: 'PRD-008', name: 'Tur Dal Premium', category: 'Grains', price: '₹220/kg', stock: '5 pkts', status: 'critical', verified: true },
    { id: 'PRD-009', name: 'Milk (Fresh)', category: 'Dairy', price: '₹65/L', stock: '50 L', status: 'good', verified: true },
    { id: 'PRD-010', name: 'Yogurt Cups', category: 'Dairy', price: '₹25', stock: '120 cups', status: 'good', verified: true }
];

const Products = () => {
    const isMobile = useMediaQuery('(max-width: 768px)');
    const [filterCategory, setFilterCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const columns = [
        { header: 'Product ID', accessor: 'id' },
        { header: 'Product Name', accessor: 'name' },
        { header: 'Category', accessor: 'category' },
        { header: 'Price', accessor: 'price' },
        { header: 'Stock', accessor: 'stock' },
        { header: 'Status', accessor: 'status', render: (row) => <StatusBadge status={row.status} /> },
        { header: 'Verified', accessor: 'verified', render: (row) => row.verified ? <span className="text-green-600 text-xs">✓ QR</span> : <span className="text-slate-400 text-xs">-</span> },
    ];

    const filteredProducts = allProducts.filter(product => {
        const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.id.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const categoryCounts = {
        all: allProducts.length,
        Grains: allProducts.filter(p => p.category === 'Grains').length,
        Vegetables: allProducts.filter(p => p.category === 'Vegetables').length,
        Fruits: allProducts.filter(p => p.category === 'Fruits').length,
        Dairy: allProducts.filter(p => p.category === 'Dairy').length,
        Others: allProducts.filter(p => p.category === 'Others').length
    };

    return (
        <DashboardLayout role="retailer">
            <div className="space-y-6">
                <div className="animate-in">
                    <h1 className="text-xl md:text-2xl font-display font-bold text-slate-800">Product Catalog</h1>
                    <p className="text-sm md:text-base text-slate-500">Manage your store inventory</p>
                </div>

                {/* Category Filter */}
                <div className={`${isMobile ? 'flex overflow-x-auto gap-2 pb-2' : 'flex gap-4'} animate-in`} style={{ animationDelay: '0.1s' }}>
                    {[
                        { key: 'all', label: 'All Products', count: categoryCounts.all },
                        { key: 'Grains', label: 'Grains', count: categoryCounts.Grains },
                        { key: 'Vegetables', label: 'Vegetables', count: categoryCounts.Vegetables },
                        { key: 'Fruits', label: 'Fruits', count: categoryCounts.Fruits },
                        { key: 'Dairy', label: 'Dairy', count: categoryCounts.Dairy },
                        { key: 'Others', label: 'Others', count: categoryCounts.Others }
                    ].map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setFilterCategory(tab.key)}
                            className={`${isMobile ? 'px-4 py-2 text-sm whitespace-nowrap' : 'px-6 py-3'
                                } rounded-lg font-medium transition-all ${filterCategory === tab.key
                                    ? 'bg-green-100 text-green-800 shadow-sm'
                                    : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                                }`}
                        >
                            {tab.label}
                            <span className={`ml-2 ${isMobile ? 'text-xs' : 'text-sm'} ${filterCategory === tab.key ? 'text-green-600' : 'text-slate-400'}`}>
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
                            placeholder="Search by product name or ID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-green-400 focus:border-green-400 focus:outline-none bg-white"
                        />
                    </div>
                </div>

                {/* Products Table */}
                <div className="animate-in" style={{ animationDelay: '0.3s' }}>
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                            <h2 className="text-base md:text-lg font-display font-semibold text-slate-700">
                                {filteredProducts.length} Product{filteredProducts.length !== 1 ? 's' : ''}
                            </h2>
                            {!isMobile && (
                                <Button icon={Filter} variant="ghost" size="sm">Advanced Filter</Button>
                            )}
                        </div>
                        <div className={isMobile ? 'overflow-x-auto' : ''}>
                            <DataTable columns={columns} data={filteredProducts} />
                        </div>
                    </div>

                    {filteredProducts.length === 0 && (
                        <div className="text-center py-12">
                            <Store className="mx-auto text-slate-300 mb-4" size={48} />
                            <p className="text-slate-500">No products found matching your criteria</p>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Products;
