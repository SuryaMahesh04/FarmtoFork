import React, { useState, useEffect } from 'react';
import { Package, Search, Filter, Warehouse, Plus, X, Thermometer, BarChart2, Layers } from 'lucide-react';
import { api } from '../../utils/api';
import DashboardLayout from '../../components/layout/DashboardLayout';
import DataTable from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';
import Button from '../../components/ui/Button';
import FormInput from '../../components/ui/FormInput';
import useMediaQuery from '../../utils/useMediaQuery';
import Loader from '../../components/ui/Loader';
import toast from 'react-hot-toast';

const Inventory = () => {
    const isMobile = useMediaQuery('(max-width: 768px)');
    const [selectedWarehouseId, setSelectedWarehouseId] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [inventory, setInventory] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Warehouse Modal State
    const [showWarehouseModal, setShowWarehouseModal] = useState(false);
    const [warehouseForm, setWarehouseForm] = useState({
        name: '',
        capacity: '',
        type: 'General',
        location: {
            city: '',
            state: '',
            address: '',
            pincode: ''
        }
    });

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        try {
            setLoading(true);
            const minLoadTime = 1000;
            const [invRes, warRes] = await Promise.all([
                api.distributor.getInventory(),
                api.distributor.getWarehouses(),
                new Promise(resolve => setTimeout(resolve, minLoadTime))
            ]);
    
            if (invRes.success) setInventory(invRes.data);
            if (warRes.success) setWarehouses(warRes.data);
            
            if (!invRes.success && !warRes.success) setError('Failed to load storage data');
        } catch (err) {
            console.error('Inventory fetch error:', err);
            setError('Failed to load inventory');
        } finally {
            setLoading(false);
        }
    };

    const togglePublish = async (id, currentStatus) => {
        try {
            const res = await api.distributor.publishInventory(id, !currentStatus);
            if (res.success) {
                toast.success(`Batch ${!currentStatus ? 'published to' : 'removed from'} marketplace`);
                fetchInventory();
            }
        } catch (err) {
            toast.error(err.message || 'Failed to update publishing status');
        }
    };

    const columns = [
        { header: 'Item Code', accessor: 'id' },
        { header: 'Product', accessor: 'item' },
        { header: 'Category', accessor: 'category' },
        { header: 'Stock Level', accessor: 'stock' },
        { header: 'Warehouse', accessor: 'warehouse', render: (row) => (
            <span className="text-emerald-600 font-medium">{row.warehouse}</span>
        )},
        { header: 'Status', accessor: 'status', render: (row) => <StatusBadge status={row.status} /> },
        { 
            header: 'Marketplace', 
            accessor: 'availableForSale',
            render: (row) => (
                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <button
                        onClick={() => togglePublish(row._id, row.availableForSale)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                            row.availableForSale ? 'bg-emerald-500' : 'bg-slate-200'
                        }`}
                    >
                        <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                row.availableForSale ? 'translate-x-6' : 'translate-x-1'
                            }`}
                        />
                    </button>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                        {row.availableForSale ? 'Live' : 'Hidden'}
                    </span>
                </div>
            )
        },
    ];

    // Fallback if category is missing in backend response
    const safeInventory = inventory.map(item => ({
        ...item,
        category: item.category || 'Uncategorized' // or derive from crop type if available
    }));

    const filteredInventory = inventory.filter(item => {
        const matchesWarehouse = selectedWarehouseId === 'all' || 
                                (item.warehouseId && item.warehouseId === selectedWarehouseId);
        const matchesSearch = (item.item || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.id || '').toLowerCase().includes(searchQuery.toLowerCase());
        return matchesWarehouse && matchesSearch;
    });

    const warehouseTabs = [
        { id: 'all', name: 'All Inventory', count: inventory.length },
        ...warehouses.map(w => ({
            id: w._id,
            name: w.name,
            count: inventory.filter(i => i.warehouseId === w._id).length
        }))
    ];

    // Calculate utilization for all warehouses
    const warehouseMetrics = warehouses.map(w => {
        const usedStock = inventory
            .filter(item => item.warehouseId === w._id)
            .reduce((sum, item) => {
                const weight = parseFloat(item.stock) || 0;
                return sum + weight;
            }, 0);
        
        return {
            ...w,
            used: Math.round(usedStock),
            percent: Math.min(Math.round((usedStock / (w.capacity || 1)) * 100), 100)
        };
    });

    if (loading) {
        return (
            <DashboardLayout role="distributor">
                <Loader text="Loading inventory and facilities..." />
            </DashboardLayout>
        );
    }

    const handleCreateWarehouse = async (e) => {
        e.preventDefault();
        try {
            const res = await api.distributor.createWarehouse(warehouseForm);
            if (res.success) {
                setShowWarehouseModal(false);
                setWarehouseForm({
                    name: '', capacity: '', type: 'General',
                    location: { city: '', state: '', address: '', pincode: '' }
                });
                fetchInventory(); // Refresh to show new warehouse tab
            }
        } catch (err) {
            console.error('Failed to create warehouse:', err);
        }
    };

    return (
        <DashboardLayout role="distributor">
            <div className="space-y-6">
                <div className="flex justify-between items-start animate-in">
                    <div>
                        <h1 className="text-xl md:text-2xl font-display font-bold text-slate-800">Inventory Management</h1>
                        <p className="text-sm md:text-base text-slate-500">Track and manage warehouse stock</p>
                    </div>
                    <Button 
                        icon={Warehouse} 
                        variant="primary" 
                        onClick={() => setShowWarehouseModal(true)}
                    >
                        Add Warehouse
                    </Button>
                </div>

                {/* Warehouse Capacity Grid */}
                {warehouses.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in" style={{ animationDelay: '0.05s' }}>
                        {warehouseMetrics.map(w => (
                            <div 
                                key={w._id} 
                                className={`bg-white p-5 rounded-2xl shadow-sm border-2 transition-all hover:shadow-md ${
                                    selectedWarehouseId === w._id ? 'border-amber-400' : 'border-slate-100'
                                }`}
                                onClick={() => setSelectedWarehouseId(w._id)}
                                role="button"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${
                                            w.type === 'Cold Storage' ? 'bg-sky-50 text-sky-600' : 
                                            w.type === 'Silo' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
                                        }`}>
                                            {w.type === 'Cold Storage' ? <Thermometer size={18} /> : 
                                             w.type === 'Silo' ? <Layers size={18} /> : <Warehouse size={18} />}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-800 text-sm">{w.name}</h3>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{w.type}</p>
                                        </div>
                                    </div>
                                    <div className={`px-2 py-1 rounded text-[10px] font-bold ${
                                        w.percent > 90 ? 'bg-red-100 text-red-600' : 
                                        w.percent > 70 ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'
                                    }`}>
                                        {w.percent === 100 ? 'FULL' : `${w.percent}% USED`}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between text-xs font-medium">
                                        <span className="text-slate-500">Utilization</span>
                                        <span className="text-slate-800">{w.used} / {w.capacity} kg</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full rounded-full transition-all duration-1000 ${
                                                w.percent > 90 ? 'bg-red-500' : 
                                                w.percent > 70 ? 'bg-amber-500' : 'bg-emerald-500'
                                            }`} 
                                            style={{ width: `${w.percent}%` }}
                                        ></div>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px]">
                                        <span className="text-slate-400">Available Space:</span>
                                        <span className="text-slate-600 font-bold">{Math.max(0, w.capacity - w.used)} kg</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Warehouse Filter Tabs */}
                <div className={`${isMobile ? 'flex overflow-x-auto gap-2 pb-2' : 'flex gap-4'} animate-in`} style={{ animationDelay: '0.1s' }}>
                    {warehouseTabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setSelectedWarehouseId(tab.id)}
                            className={`${isMobile ? 'px-4 py-2 text-sm whitespace-nowrap' : 'px-6 py-3'
                                } rounded-lg font-medium transition-all ${selectedWarehouseId === tab.id
                                    ? 'bg-amber-100 text-amber-800 shadow-sm'
                                    : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                                }`}
                        >
                            {tab.name}
                            <span className={`ml-2 ${isMobile ? 'text-xs' : 'text-sm'} ${selectedWarehouseId === tab.id ? 'text-amber-600' : 'text-slate-400'}`}>
                                ({tab.count})
                            </span>
                        </button>
                    ))}
                    {warehouses.length === 0 && selectedWarehouseId === 'all' && (
                        <div className="flex items-center text-xs text-slate-400 bg-slate-50 px-4 py-2 rounded-lg border border-dashed border-slate-200">
                             Click "Add Warehouse" to categorize your stock
                        </div>
                    )}
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

            {/* Add Warehouse Modal */}
            {showWarehouseModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in transition-all">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in slide-in-from-bottom-4">
                        <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50/50">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                                    <Warehouse size={20} />
                                </div>
                                <h2 className="text-xl font-display font-bold text-slate-800">New Storage Facility</h2>
                            </div>
                            <button onClick={() => setShowWarehouseModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        
                        <form onSubmit={handleCreateWarehouse} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormInput 
                                    label="Warehouse Name" 
                                    placeholder="main-warehouse-01" 
                                    value={warehouseForm.name}
                                    onChange={(e) => setWarehouseForm({...warehouseForm, name: e.target.value})}
                                    required
                                />
                                <FormInput 
                                    label="Total Capacity (kg)" 
                                    type="number"
                                    placeholder="5000" 
                                    value={warehouseForm.capacity}
                                    onChange={(e) => setWarehouseForm({...warehouseForm, capacity: e.target.value})}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Facility Type</label>
                                <select 
                                    className="w-full px-4 py-3 rounded-xl border border-sage-200 focus:ring-2 focus:ring-sage-500/20 focus:border-sage-500 transition-all outline-none bg-white text-slate-700 font-medium"
                                    value={warehouseForm.type}
                                    onChange={(e) => setWarehouseForm({...warehouseForm, type: e.target.value})}
                                >
                                    <option value="Dry Warehouse">Ambient/Dry Warehouse</option>
                                    <option value="Cold Storage">Cold Storage (Refrigerated)</option>
                                    <option value="Frozen Storage">Frozen Storage (Deep Freeze)</option>
                                    <option value="Climate Controlled">Climate Controlled (Humidity/Temp)</option>
                                    <option value="Silo">Silo (Bulk Grains)</option>
                                    <option value="Bonded">Bonded Warehouse (Customs)</option>
                                    <option value="Distribution Center">Regional Distribution Center</option>
                                    <option value="Cross-Dock">Cross-Docking Facility</option>
                                    <option value="Hazardous">Hazardous/Chemical Storage</option>
                                    <option value="Automated">Automated Storage (ASRS)</option>
                                </select>
                            </div>

                            <div className="pt-2 border-t border-slate-100 mt-4">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Location Details</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormInput 
                                        label="City" 
                                        value={warehouseForm.location.city}
                                        onChange={(e) => setWarehouseForm({...warehouseForm, location: {...warehouseForm.location, city: e.target.value}})}
                                        required
                                    />
                                    <FormInput 
                                        label="Pincode" 
                                        value={warehouseForm.location.pincode}
                                        onChange={(e) => setWarehouseForm({...warehouseForm, location: {...warehouseForm.location, pincode: e.target.value}})}
                                        required
                                    />
                                </div>
                                <div className="mt-4">
                                    <FormInput 
                                        label="Full Address" 
                                        value={warehouseForm.location.address}
                                        onChange={(e) => setWarehouseForm({...warehouseForm, location: {...warehouseForm.location, address: e.target.value}})}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 pt-6 border-t border-slate-100">
                                <Button className="flex-1" variant="ghost" type="button" onClick={() => setShowWarehouseModal(false)}>Cancel</Button>
                                <Button className="flex-1" variant="primary" type="submit" icon={Plus}>Register Warehouse</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default Inventory;
