import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, Filter, ShoppingCart, Info, TrendingUp, ShieldCheck, MapPin, Calendar, ArrowRight, X } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/ui/Button';
import StatusBadge from '../../components/ui/StatusBadge';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const Marketplace = () => {
    const [batches, setBatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedBatch, setSelectedBatch] = useState(null);
    const [orderQuantity, setOrderQuantity] = useState(1);
    const [submitting, setSubmitting] = useState(false);

    const categories = ['All', 'Grains', 'Vegetables', 'Fruits', 'Dairy', 'Others'];

    const fetchMarketplace = async () => {
        try {
            setLoading(true);
            const res = await api.retailer.getMarketplace();
            if (res.success) {
                setBatches(res.data);
            }
        } catch (error) {
            toast.error('Failed to load marketplace');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMarketplace();
    }, []);

    const determineCategory = (crop) => {
        const c = crop.toLowerCase();
        if (c.includes('rice') || c.includes('wheat') || c.includes('dal')) return 'Grains';
        if (c.includes('tomato') || c.includes('onion') || c.includes('potato')) return 'Vegetables';
        if (c.includes('apple') || c.includes('orange') || c.includes('mango')) return 'Fruits';
        if (c.includes('milk') || c.includes('yogurt')) return 'Dairy';
        return 'Others';
    };

    const filteredBatches = batches.filter(b => {
        const matchesSearch = b.crop.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             (b.variety && b.variety.toLowerCase().includes(searchQuery.toLowerCase()));
        const category = determineCategory(b.crop);
        const matchesCategory = selectedCategory === 'All' || category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const handlePlaceOrder = async () => {
        if (!selectedBatch) return;
        
        if (orderQuantity <= 0 || orderQuantity > selectedBatch.quantity) {
            toast.error(`Please enter a valid quantity (1 - ${selectedBatch.quantity})`);
            return;
        }

        try {
            setSubmitting(true);
            const res = await api.retailer.createPurchaseOrder({
                batchId: selectedBatch._id,
                quantityRequested: orderQuantity,
                priceOffered: selectedBatch.pricePerUnit || 0, // In real app, allow negotiation
                notes: `Purchase request for ${selectedBatch.crop} from marketplace.`
            });

            if (res.success) {
                toast.success('Purchase Order raised successfully!');
                setSelectedBatch(null);
                setOrderQuantity(1);
            }
        } catch (error) {
            toast.error(error.message || 'Failed to raise purchase order');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <DashboardLayout role="retailer">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-in">
                    <div>
                        <h1 className="text-xl md:text-2xl font-display font-bold text-slate-800">Distributor Marketplace 🛒</h1>
                        <p className="text-sm md:text-base text-slate-500">Source fresh produce directly from regional distributors</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search products, varieties..."
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                                    selectedCategory === cat 
                                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200' 
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-64 bg-slate-100 rounded-2xl animate-pulse"></div>
                        ))}
                    </div>
                ) : filteredBatches.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredBatches.map((batch, index) => (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                key={batch._id}
                                className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-all group"
                            >
                                <div className="p-5">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl group-hover:scale-110 transition-transform">
                                            <ShoppingBag size={24} />
                                        </div>
                                        <div className="flex flex-col items-end gap-1">
                                            <StatusBadge status={batch.qualityScore >= 80 ? 'good' : 'warning'}>
                                                Quality: {batch.qualityScore}%
                                            </StatusBadge>
                                            {batch.organicCertified && (
                                                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                                    <ShieldCheck size={10} />
                                                    Organic
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <h3 className="text-lg font-bold text-slate-800 mb-1">{batch.crop}</h3>
                                    <p className="text-sm text-slate-500 mb-4">{batch.variety || 'Standard Variety'}</p>

                                    <div className="space-y-2.5 mb-6">
                                        <div className="flex items-center gap-2 text-sm text-slate-600">
                                            <MapPin size={14} className="text-slate-400" />
                                            <span>{batch.location?.district}, {batch.location?.state}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-slate-600 text-amber-600 font-medium">
                                            <TrendingUp size={14} />
                                            <span>In Stock: {batch.quantity} {batch.unit}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-slate-600">
                                            <Calendar size={14} className="text-slate-400" />
                                            <span className="text-xs">Harvested: {new Date(batch.harvestDate).toLocaleDateString()}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                        <div className="flex flex-col">
                                            <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Price per {batch.unit}</span>
                                            <span className="text-xl font-bold text-slate-900">₹{batch.pricePerUnit || 0}</span>
                                        </div>
                                        <Button 
                                            size="sm" 
                                            icon={ArrowRight} 
                                            onClick={() => {
                                                setSelectedBatch(batch);
                                                setOrderQuantity(Math.min(10, batch.quantity));
                                            }}
                                        >
                                            Buy Now
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl p-12 text-center border-2 border-dashed border-slate-200">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                            <ShoppingCart size={40} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800">No products found</h3>
                        <p className="text-slate-500 max-w-sm mx-auto mt-2">Check back later or try adjusting your search terms to find available inventory from distributors.</p>
                    </div>
                )}
            </div>

            {/* Order Modal */}
            <AnimatePresence>
                {selectedBatch && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
                            onClick={() => setSelectedBatch(null)}
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
                        >
                            <div className="p-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                                <h2 className="text-xl font-bold text-slate-800">Raise Purchase Order</h2>
                                <button onClick={() => setSelectedBatch(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                                    <X size={20} className="text-slate-400" />
                                </button>
                            </div>
                            
                            <div className="p-8 space-y-6">
                                <div className="flex gap-4 items-center p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-emerald-600 shadow-sm font-bold">
                                        {selectedBatch.crop[0]}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800">{selectedBatch.crop}</h4>
                                        <p className="text-xs text-slate-500">Available: {selectedBatch.quantity} {selectedBatch.unit}</p>
                                    </div>
                                    <div className="ml-auto text-right text-emerald-600 text-lg font-bold">
                                        ₹{selectedBatch.pricePerUnit || 0}
                                        <span className="block text-[10px] text-slate-400 font-medium lowercase italic">per {selectedBatch.unit}</span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Quantity to Request ({selectedBatch.unit})</label>
                                        <input 
                                            type="number"
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none transition-all font-medium"
                                            value={orderQuantity}
                                            onChange={(e) => setOrderQuantity(Number(e.target.value))}
                                            min="1"
                                            max={selectedBatch.quantity}
                                        />
                                        <p className="text-[10px] text-slate-500 mt-2">Estimated Total: <span className="text-slate-900 font-bold">₹{(orderQuantity * (selectedBatch.pricePerUnit || 0)).toLocaleString()}</span></p>
                                    </div>
                                    
                                    <div className="p-3 bg-sky-50 rounded-xl border border-sky-100 flex gap-3">
                                        <Info size={16} className="text-sky-500 shrink-0 mt-0.5" />
                                        <p className="text-[11px] text-sky-700">Raising a PO notifies the distributor. Once they accept, the batch remains held until fulfilled or ownership is transferred.</p>
                                    </div>
                                </div>

                                <Button 
                                    className="w-full py-4 text-lg shadow-xl shadow-emerald-200"
                                    onClick={handlePlaceOrder}
                                    loading={submitting}
                                >
                                    Confirm Order
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </DashboardLayout>
    );
};

export default Marketplace;
