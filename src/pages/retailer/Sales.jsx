import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, ShoppingBag, Package, Plus } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import DashboardLayout from '../../components/layout/DashboardLayout';
import DataTable from '../../components/ui/DataTable';
import ChartCard from '../../components/ui/ChartCard';
import Button from '../../components/ui/Button';
import { chartTheme } from '../../utils/chartConfig';
import useMediaQuery from '../../utils/useMediaQuery';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const Sales = () => {
    const isMobile = useMediaQuery('(max-width: 768px)');
    const [period, setPeriod] = useState('month');
    const [salesData, setSalesData] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showSaleModal, setShowSaleModal] = useState(false);
    
    // Form state
    const [saleBatchId, setSaleBatchId] = useState('');
    const [saleQty, setSaleQty] = useState(1);
    const [salePrice, setSalePrice] = useState('');
    const [consumerName, setConsumerName] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [salesRes, productsRes] = await Promise.all([
                api.retailer.getSales(),
                api.retailer.getProducts()
            ]);
            if (salesRes.success) setSalesData(salesRes.data);
            if (productsRes.success) {
                // Only products available for sale
                setProducts(productsRes.data.filter(p => p.availableForSale));
            }
        } catch (error) {
            toast.error('Failed to load sales data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSimulateSale = async (e) => {
        e.preventDefault();
        if (!saleBatchId || !salePrice) return toast.error('Please fill required fields');
        
        try {
            setSubmitting(true);
            await api.retailer.recordSale({
                batchId: saleBatchId,
                quantitySold: saleQty,
                salePrice: salePrice,
                consumerName: consumerName
            });
            toast.success('Sale recorded successfully');
            setShowSaleModal(false);
            // Reset form
            setSaleBatchId('');
            setSaleQty(1);
            setSalePrice('');
            setConsumerName('');
            fetchData();
        } catch (error) {
            toast.error(error.message || 'Failed to record sale');
        } finally {
            setSubmitting(false);
        }
    };

    // Calculate aggregations
    const determineCategory = (crop) => {
        if (!crop) return 'Others';
        const c = crop.toLowerCase();
        if (c.includes('rice') || c.includes('wheat') || c.includes('dal')) return 'Grains';
        if (c.includes('tomato') || c.includes('onion') || c.includes('potato')) return 'Vegetables';
        if (c.includes('apple') || c.includes('orange') || c.includes('mango')) return 'Fruits';
        if (c.includes('milk') || c.includes('yogurt')) return 'Dairy';
        return 'Others';
    };

    const totalRevenue = salesData.reduce((sum, s) => sum + s.salePrice, 0);
    const txnCount = salesData.length;
    const avgOrderValue = txnCount > 0 ? Math.round(totalRevenue / txnCount) : 0;

    // Category aggregation
    const catMap = {};
    salesData.forEach(s => {
        const cat = determineCategory(s.batchId?.crop);
        catMap[cat] = (catMap[cat] || 0) + s.salePrice;
    });
    const salesByCategory = Object.keys(catMap).map(k => ({ category: k, revenue: catMap[k] }));

    // Revenue tracking monthly
    const monthMap = {};
    salesData.forEach(s => {
        const month = new Date(s.timestamp).toLocaleString('default', { month: 'short' });
        monthMap[month] = (monthMap[month] || 0) + s.salePrice;
    });
    
    // Ensure we show at least recent months even if empty
    const revenueData = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => ({
        month: m,
        revenue: monthMap[m] || 0
    }));

    const recentTransactions = salesData.slice(0, 10).map(s => ({
        id: s._id.substring(s._id.length - 6).toUpperCase(),
        product: `${s.batchId?.crop || 'Unknown'} ${s.batchId?.variety ? `(${s.batchId.variety})` : ''}`,
        quantity: s.quantitySold,
        amount: `₹${s.salePrice}`,
        date: new Date(s.timestamp).toLocaleString(),
        customer: s.consumerName || 'Anonymous'
    }));

    const columns = [
        { header: 'TXN ID', accessor: 'id' },
        { header: 'Product', accessor: 'product' },
        { header: 'Qty', accessor: 'quantity' },
        { header: 'Amount', accessor: 'amount' },
        { header: 'Date & Time', accessor: 'date' },
        { header: 'Customer', accessor: 'customer' },
    ];

    return (
        <DashboardLayout role="retailer">
            <div className="space-y-6">
                <div className="flex justify-between items-start md:items-center gap-4 animate-in flex-col md:flex-row">
                    <div>
                        <h1 className="text-xl md:text-2xl font-display font-bold text-slate-800">Sales Analytics</h1>
                        <p className="text-sm md:text-base text-slate-500">Track revenue and real-time transactions</p>
                    </div>
                    <div className="flex gap-2">
                        <Button icon={Plus} onClick={() => setShowSaleModal(true)} variant="outline">
                            Record Sale
                        </Button>
                        <button
                            onClick={() => setPeriod('week')}
                            className={`px-4 py-2 text-sm rounded-lg font-medium transition-all ${period === 'week' ? 'bg-green-100 text-green-800' : 'bg-white text-slate-600 border border-slate-200'}`}
                        >
                            Week
                        </button>
                        <button
                            onClick={() => setPeriod('month')}
                            className={`px-4 py-2 text-sm rounded-lg font-medium transition-all ${period === 'month' ? 'bg-green-100 text-green-800' : 'bg-white text-slate-600 border border-slate-200'}`}
                        >
                            Month
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className={`grid ${isMobile ? 'grid-cols-2 gap-3' : 'grid-cols-4 gap-6'} animate-in`} style={{ animationDelay: '0.1s' }}>
                    <div className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-2 text-slate-600 mb-2">
                            <DollarSign size={18} />
                            <span className="text-xs font-medium">Total Revenue</span>
                        </div>
                        <p className="text-2xl font-bold text-slate-800">₹{totalRevenue.toLocaleString()}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-2 text-slate-600 mb-2">
                            <ShoppingBag size={18} />
                            <span className="text-xs font-medium">Transactions</span>
                        </div>
                        <p className="text-2xl font-bold text-slate-800">{txnCount}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-2 text-slate-600 mb-2">
                            <Package size={18} />
                            <span className="text-xs font-medium">Avg Order Value</span>
                        </div>
                        <p className="text-2xl font-bold text-slate-800">₹{avgOrderValue}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-2 text-slate-600 mb-2">
                            <TrendingUp size={18} />
                            <span className="text-xs font-medium">Growth Rate</span>
                        </div>
                        <p className="text-2xl font-bold text-green-600">Pending</p>
                    </div>
                </div>

                {/* Revenue Chart */}
                <div className="animate-in" style={{ animationDelay: '0.2s' }}>
                    <ChartCard title="Revenue Trend" subtitle="Monthly performance" height={isMobile ? 220 : 300}>
                        <LineChart data={revenueData} margin={{ top: 10, right: isMobile ? 10 : 30, left: isMobile ? -20 : 0, bottom: 0 }}>
                            <XAxis dataKey="month" {...chartTheme.axis} tick={{ fontSize: isMobile ? 10 : 12 }} />
                            <YAxis {...chartTheme.axis} tick={{ fontSize: isMobile ? 10 : 12 }} />
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                            <Tooltip {...chartTheme.tooltip} />
                            <Line type="monotone" dataKey="revenue" stroke={chartTheme.colors.sage[0]} strokeWidth={3} dot={{ r: 5 }} name="Revenue (₹)" />
                        </LineChart>
                    </ChartCard>
                </div>

                {/* Sales by Category & Recent TXN Grid */}
                <div className={isMobile ? "space-y-6 animate-in" : "grid grid-cols-3 gap-6 animate-in"} style={{ animationDelay: '0.3s' }}>
                    
                    <div className="col-span-1">
                        <ChartCard title="Sales by Category" subtitle="Revenue breakdown" height={isMobile ? 200 : 250}>
                            {salesByCategory.length === 0 ? (
                                <div className="flex h-full items-center justify-center text-slate-400">No category data</div>
                            ) : (
                                <BarChart data={salesByCategory} layout="vertical" margin={{ top: 10, right: 10, left: isMobile ? -20 : 0, bottom: 0 }}>
                                    <XAxis type="number" {...chartTheme.axis} tick={{ fontSize: isMobile ? 10 : 12 }} />
                                    <YAxis type="category" dataKey="category" {...chartTheme.axis} tick={{ fontSize: isMobile ? 10 : 12 }} width={isMobile ? 70 : 90} />
                                    <Tooltip {...chartTheme.tooltip} />
                                    <Bar dataKey="revenue" fill={chartTheme.colors.sage[0]} radius={[0, 4, 4, 0]} name="Revenue (₹)" />
                                </BarChart>
                            )}
                        </ChartCard>
                    </div>

                    <div className="col-span-2">
                        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden h-full">
                            <div className="p-4 border-b border-slate-100">
                                <h2 className="text-base md:text-lg font-display font-semibold text-slate-700">Recent Transactions</h2>
                            </div>
                            <div className={isMobile ? 'overflow-x-auto' : ''}>
                                {loading ? (
                                    <div className="p-8 text-center text-slate-500">Loading...</div>
                                ) : (
                                    <DataTable columns={columns} data={recentTransactions} />
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Simulated Sale Modal */}
                {showSaleModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
                        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95">
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                                <h2 className="text-xl font-display font-bold text-slate-800">Record Manual Sale</h2>
                            </div>
                            <form onSubmit={handleSimulateSale} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Select Product for Sale</label>
                                    <select
                                        required
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 bg-white"
                                        value={saleBatchId}
                                        onChange={(e) => setSaleBatchId(e.target.value)}
                                    >
                                        <option value="">Select a product...</option>
                                        {products.map(p => (
                                            <option key={p._id} value={p._id}>{p.crop} {p.variety ? `(${p.variety})` : ''} - {p.batchId}</option>
                                        ))}
                                    </select>
                                    {products.length === 0 && <p className="text-xs text-amber-500 mt-1">No products marked as available for sale.</p>}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Units Sold</label>
                                        <input
                                            type="number"
                                            required
                                            min="1"
                                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500"
                                            value={saleQty}
                                            onChange={(e) => setSaleQty(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Total Price (₹)</label>
                                        <input
                                            type="number"
                                            required
                                            min="1"
                                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500"
                                            placeholder="e.g. 500"
                                            value={salePrice}
                                            onChange={(e) => setSalePrice(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Consumer Name (Optional)</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500"
                                        placeholder="e.g. Rahul S."
                                        value={consumerName}
                                        onChange={(e) => setConsumerName(e.target.value)}
                                    />
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="flex-1"
                                        onClick={() => setShowSaleModal(false)}
                                        disabled={submitting}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="flex-1"
                                        disabled={submitting || products.length === 0}
                                    >
                                        {submitting ? 'Recording...' : 'Record Sale'}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

            </div>
        </DashboardLayout>
    );
};

export default Sales;
