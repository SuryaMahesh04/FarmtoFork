import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, Search, Filter, Plus, CheckCircle, Package, Scan } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import DataTable from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';
import Button from '../../components/ui/Button';
import useMediaQuery from '../../utils/useMediaQuery';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import QRCode from 'react-qr-code';
import Modal from '../../components/ui/Modal';
import { Printer, QrCode as QrIcon } from 'lucide-react';

const Products = () => {
    const isMobile = useMediaQuery('(max-width: 768px)');
    const [filterCategory, setFilterCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAcquireModal, setShowAcquireModal] = useState(false);
    const [acquireBatchId, setAcquireBatchId] = useState('');
    const [acquiring, setAcquiring] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showQRModal, setShowQRModal] = useState(false);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const res = await api.retailer.getProducts();
            if (res.success) {
                // Map to UI friendly format
                const formatted = res.data.map(b => ({
                    id: b.batchId,
                    _id: b._id,
                    name: `${b.crop} ${b.variety ? `(${b.variety})` : ''}`,
                    category: determineCategory(b.crop),
                    price: b.pricePerUnit ? `₹${b.pricePerUnit}` : 'N/A',
                    stock: `${b.quantity} ${b.unit}`,
                    status: b.qualityScore >= 80 ? 'good' : (b.qualityScore >= 50 ? 'warning' : 'critical'),
                    verified: b.qrGenerated,
                    availableForSale: b.availableForSale
                }));
                setProducts(formatted);
            }
        } catch (error) {
            toast.error('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const determineCategory = (crop) => {
        const c = crop.toLowerCase();
        if (c.includes('rice') || c.includes('wheat') || c.includes('dal')) return 'Grains';
        if (c.includes('tomato') || c.includes('onion') || c.includes('potato')) return 'Vegetables';
        if (c.includes('apple') || c.includes('orange') || c.includes('mango')) return 'Fruits';
        if (c.includes('milk') || c.includes('yogurt')) return 'Dairy';
        return 'Others';
    };

    const handleAcquire = async (e) => {
        e.preventDefault();
        if (!acquireBatchId) return toast.error('Enter a Batch ID');
        try {
            setAcquiring(true);
            await api.retailer.acquireBatch(acquireBatchId);
            toast.success('Batch acquired successfully');
            setShowAcquireModal(false);
            setAcquireBatchId('');
            fetchProducts();
        } catch (error) {
            toast.error(error.message || 'Failed to acquire batch');
        } finally {
            setAcquiring(false);
        }
    };

    const handleMarkAvailable = async (id) => {
        try {
            await api.retailer.markAvailable(id);
            toast.success('Product marked as available for sale');
            fetchProducts();
        } catch (error) {
            toast.error(error.message || 'Failed to mark available');
        }
    };

    const handlePrint = () => {
        if (!selectedProduct) return;

        const qrContainer = document.getElementById('qr-code-print-container');
        if (!qrContainer) return;

        const qrSvg = qrContainer.innerHTML;
        const printWindow = window.open('', '_blank', 'width=400,height=600');

        if (!printWindow) {
            toast.error('Please allow popups to print');
            return;
        }

        const receiptHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Product QR - ${selectedProduct.id}</title>
                <style>
                    body { font-family: 'Courier New', monospace; padding: 20px; max-width: 300px; margin: 0 auto; background: white; text-align: center; }
                    .header { margin-bottom: 15px; border-bottom: 2px dashed #000; padding-bottom: 10px; }
                    .title { font-size: 18px; font-weight: bold; display: block; }
                    .content { margin-bottom: 15px; text-align: left; }
                    .row { display: flex; justify-content: space-between; margin-bottom: 3px; font-size: 12px; }
                    .label { font-weight: bold; }
                    .qr-container { margin: 15px 0; }
                    .footer { font-size: 10px; margin-top: 15px; border-top: 2px dashed #000; padding-top: 10px; }
                    @media print { body { padding: 10px; } }
                </style>
            </head>
            <body>
                <div class="header">
                    <span class="title">Farm2Fork Trace</span>
                </div>
                <div class="content">
                    <div class="row"><span class="label">ID:</span> <span>${selectedProduct.id}</span></div>
                    <div class="row"><span class="label">Product:</span> <span>${selectedProduct.name}</span></div>
                    <div class="row"><span class="label">Stock:</span> <span>${selectedProduct.stock}</span></div>
                </div>
                <div class="qr-container">${qrSvg}</div>
                <div class="footer">
                    <p>Scan to verify authenticity</p>
                    <p>Powered by Farm2Fork Blockchain</p>
                </div>
                <script>
                    setTimeout(() => { window.print(); window.close(); }, 500);
                </script>
            </body>
            </html>
        `;

        printWindow.document.open();
        printWindow.document.write(receiptHtml);
        printWindow.document.close();
    };

    const handleGetQR = (product) => {
        setSelectedProduct(product);
        setShowQRModal(true);
    };

    const columns = [
        { header: 'Product ID', accessor: 'id' },
        { header: 'Product Name', accessor: 'name' },
        { header: 'Category', accessor: 'category' },
        { header: 'Stock', accessor: 'stock' },
        { header: 'Quality', accessor: 'status', render: (row) => <StatusBadge status={row.status} /> },
        { 
            header: 'Sale Status', 
            accessor: 'availableForSale', 
            render: (row) => row.availableForSale ? 
                <span className="text-green-600 text-xs font-semibold flex items-center gap-1"><CheckCircle size={14}/> Selling</span> : 
                <Button size="sm" variant="outline" className="text-xs py-1 h-7" onClick={() => handleMarkAvailable(row._id)}>Mark For Sale</Button>
        },
        {
            header: 'Actions',
            accessor: '_id',
            render: (row) => (
                <div className="flex gap-2">
                    <Button 
                        size="sm" 
                        variant="outline" 
                        icon={QrIcon} 
                        onClick={() => handleGetQR(row)}
                        className="text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                    >
                        Get QR
                    </Button>
                </div>
            )
        }
    ];

    const filteredProducts = products.filter(product => {
        const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.id.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const categoryCounts = {
        all: products.length,
        Grains: products.filter(p => p.category === 'Grains').length,
        Vegetables: products.filter(p => p.category === 'Vegetables').length,
        Fruits: products.filter(p => p.category === 'Fruits').length,
        Dairy: products.filter(p => p.category === 'Dairy').length,
        Others: products.filter(p => p.category === 'Others').length
    };

    return (
        <DashboardLayout role="retailer">
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-in">
                    <div>
                        <h1 className="text-xl md:text-2xl font-display font-bold text-slate-800">Product Catalog</h1>
                        <p className="text-sm md:text-base text-slate-500">Manage your store inventory</p>
                    </div>
                    <Button icon={Package} onClick={() => setShowAcquireModal(true)}>
                        Acquire Batch
                    </Button>
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
                            {loading ? (
                                <div className="p-8 text-center text-slate-500">Loading products...</div>
                            ) : (
                                <DataTable columns={columns} data={filteredProducts} />
                            )}
                        </div>
                    </div>

                    {!loading && filteredProducts.length === 0 && (
                        <div className="text-center py-12">
                            <Store className="mx-auto text-slate-300 mb-4" size={48} />
                            <p className="text-slate-500">No products found matching your criteria</p>
                        </div>
                    )}
                </div>

                {/* Acquire Modal */}
                {showAcquireModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
                        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95">
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                                <h2 className="text-xl font-display font-bold text-slate-800">Acquire Received Batch</h2>
                            </div>
                            <form onSubmit={handleAcquire} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Batch ID or Scanner Input
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. BTH-000001"
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                        value={acquireBatchId}
                                        onChange={(e) => setAcquireBatchId(e.target.value)}
                                    />
                                    <p className="text-xs text-slate-500 mt-2">Enter the ID of the batch delivered to your store by the distributor to add it to your inventory.</p>
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="flex-1"
                                        onClick={() => setShowAcquireModal(false)}
                                        disabled={acquiring}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="flex-1"
                                        disabled={acquiring}
                                    >
                                        {acquiring ? 'Acquiring...' : 'Acquire Batch'}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* QR Preview Modal */}
                <Modal
                    isOpen={showQRModal}
                    onClose={() => setShowQRModal(false)}
                    title="Product QR Code"
                >
                    <div className="flex flex-col items-center space-y-6">
                        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 flex flex-col items-center">
                            <div id="qr-code-print-container" className="bg-white p-2 rounded-lg">
                                <QRCode
                                    value={`${window.location.origin}/trace/${selectedProduct?._id}`}
                                    size={200}
                                    level="H"
                                />
                            </div>
                            <div className="mt-4 text-center">
                                <p className="font-bold text-slate-800">{selectedProduct?.id}</p>
                                <p className="text-xs text-slate-400 truncate w-48">{selectedProduct?.name}</p>
                            </div>
                        </div>

                        <div className="w-full flex gap-3">
                            <Button
                                variant="outline"
                                className="flex-1"
                                onClick={() => setShowQRModal(false)}
                            >
                                Close
                            </Button>
                            <Button
                                className="flex-1 bg-emerald-600 text-white"
                                icon={Printer}
                                onClick={handlePrint}
                            >
                                Print QR
                            </Button>
                        </div>

                        <p className="text-xs text-slate-400 text-center">
                            Print this QR code and attach it to the product. Customers can scan it to verify the blockchain traceability and quality details.
                        </p>
                    </div>
                </Modal>
            </div>
        </DashboardLayout>
    );
};

export default Products;
