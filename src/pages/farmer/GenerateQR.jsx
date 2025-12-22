import React, { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import { QrCode, Download, Printer, Share2, AlertCircle, Loader2 } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/ui/Button';
import { api } from '../../utils/api';

const GenerateQR = () => {
    const [batches, setBatches] = useState([]);
    const [selectedBatchId, setSelectedBatchId] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isGenerated, setIsGenerated] = useState(false);

    useEffect(() => {
        fetchBatches();
    }, []);

    const fetchBatches = async () => {
        try {
            setLoading(true);
            const res = await api.farmer.getBatches();
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

    const handleGenerate = async () => {
        if (selectedBatchId) {
            try {
                // Update batch status in backend
                await api.farmer.updateBatch(selectedBatchId, { qrGenerated: true });
                setIsGenerated(true);
                // Refresh batches to sync state
                fetchBatches();
            } catch (err) {
                console.error("Failed to update batch QR status", err);
                setError("Failed to generate QR code. Please try again.");
            }
        }
    };

    const selectedBatch = batches.find(b => b.id === selectedBatchId || b._id === selectedBatchId);

    const handlePrint = () => {
        const qrContainer = document.getElementById('qr-code-container');
        if (!qrContainer) {
            console.error("QR Container not found");
            return;
        }

        const qrSvg = qrContainer.innerHTML;
        const printWindow = window.open('', '_blank', 'width=400,height=600');

        if (!printWindow) {
            alert('Please allow popups for this site to print the receipt.');
            return;
        }

        const receiptHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Batch Receipt - ${selectedBatch.batchId}</title>
                <style>
                    body { font-family: 'Courier New', monospace; padding: 20px; max-width: 300px; margin: 0 auto; background: white; }
                    .header { text-align: center; margin-bottom: 20px; border-bottom: 2px dashed #000; padding-bottom: 10px; }
                    .title { font-size: 18px; font-weight: bold; display: block; margin-bottom: 5px; }
                    .subtitle { font-size: 12px; color: #555; }
                    .content { margin-bottom: 20px; }
                    .row { display: flex; justify-content: space-between; margin-bottom: 5px; font-size: 14px; }
                    .label { font-weight: bold; }
                    .qr-container { text-align: center; margin: 20px 0; display: flex; justify-content: center; }
                    .footer { text-align: center; font-size: 10px; margin-top: 20px; border-top: 2px dashed #000; padding-top: 10px; }
                    @media print {
                        body { width: 100%; margin: 0; padding: 10px; }
                        .no-print { display: none; }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <span class="title">Farm2Fork</span>
                    <span class="subtitle">Traceability Receipt</span>
                </div>
                
                <div class="content">
                    <div class="row"><span class="label">Date:</span> <span>${new Date().toLocaleDateString()}</span></div>
                    <div class="row"><span class="label">Batch ID:</span> <span>${selectedBatch.batchId}</span></div>
                    <div class="row"><span class="label">Crop:</span> <span>${selectedBatch.crop}</span></div>
                    <div class="row"><span class="label">Variety:</span> <span>${selectedBatch.variety}</span></div>
                    <div class="row"><span class="label">Quantity:</span> <span>${selectedBatch.quantity} ${selectedBatch.unit}</span></div>
                </div>

                <div class="qr-container">
                    ${qrSvg}
                </div>

                <div class="footer">
                    <p>Scan to verify authenticity</p>
                    <p>Powered by Farm2Fork Blockchain</p>
                </div>
                <script>
                    setTimeout(function() {
                        window.print();
                        window.close();
                    }, 500);
                </script>
            </body>
            </html>
        `;

        printWindow.document.open();
        printWindow.document.write(receiptHtml);
        printWindow.document.close();
    };

    return (
        <DashboardLayout role="farmer">
            <div className="max-w-4xl mx-auto space-y-6 animate-in">
                <div>
                    <h1 className="text-2xl font-display font-bold text-slate-800">Generate QR Code</h1>
                    <p className="text-slate-500">Create unique traceability codes for your batches</p>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="animate-spin text-sage-500" size={32} />
                    </div>
                ) : error ? (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-center gap-2">
                        <AlertCircle size={20} />
                        {error}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Controls Section */}
                        <div className="space-y-6">
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-sage-100">
                                <label className="block text-sm font-medium text-slate-700 mb-2">Select Batch</label>
                                <select
                                    className="w-full p-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sage-400 bg-white"
                                    value={selectedBatchId}
                                    onChange={(e) => {
                                        const newBatchId = e.target.value;
                                        setSelectedBatchId(newBatchId);
                                        const batch = batches.find(b => b._id === newBatchId);
                                        if (batch && batch.qrGenerated) {
                                            setIsGenerated(true);
                                        } else {
                                            setIsGenerated(false);
                                        }
                                    }}
                                >
                                    <option value="">-- Select a batch --</option>
                                    {batches.map(b => (
                                        <option key={b._id} value={b._id}>
                                            {b.batchId} - {b.crop} ({b.variety})
                                        </option>
                                    ))}
                                </select>

                                <div className="mt-6">
                                    <Button
                                        className="w-full justify-center"
                                        onClick={handleGenerate}
                                        disabled={!selectedBatchId}
                                    >
                                        {selectedBatch?.qrGenerated ? 'Regenerate QR Code' : 'Generate QR Code'}
                                    </Button>
                                </div>
                            </div>

                            {isGenerated && selectedBatch && (
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-sage-100 animate-in">
                                    <h3 className="font-semibold text-slate-800 mb-4">Batch Details</h3>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between py-2 border-b border-slate-100">
                                            <span className="text-slate-500">Product</span>
                                            <span className="font-medium">{selectedBatch.crop}</span>
                                        </div>
                                        <div className="flex justify-between py-2 border-b border-slate-100">
                                            <span className="text-slate-500">Variety</span>
                                            <span className="font-medium">{selectedBatch.variety}</span>
                                        </div>
                                        <div className="flex justify-between py-2 border-b border-slate-100">
                                            <span className="text-slate-500">Quantity</span>
                                            <span className="font-medium">{selectedBatch.quantity} {selectedBatch.unit}</span>
                                        </div>
                                        <div className="flex justify-between py-2 border-b border-slate-100">
                                            <span className="text-slate-500">Harvest Date</span>
                                            <span className="font-medium">{new Date(selectedBatch.harvestDate).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex justify-between py-2 border-b border-slate-100">
                                            <span className="text-slate-500">Blockchain Hash</span>
                                            <span className="font-mono text-xs truncate max-w-[150px]" title={selectedBatch.blockchainHash}>
                                                {selectedBatch.blockchainHash?.substring(0, 16)}...
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Preview Section */}
                        <div className="bg-gradient-to-br from-white to-sage-50 p-8 rounded-xl shadow-sm border border-sage-100 flex flex-col items-center justify-center text-center min-h-[400px]">
                            {isGenerated && selectedBatch ? (
                                <div className="space-y-6 animate-in fade-in zoom-in duration-500">
                                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 inline-block relative overflow-hidden group">
                                        {/* Real QR Code */}
                                        <div id="qr-code-container" className="bg-white p-2 rounded-lg relative flex items-center justify-center overflow-hidden">
                                            <QRCode
                                                value={`https://farm2fork.com/trace/${selectedBatch._id}`}
                                                size={180}
                                                level="H"
                                                fgColor="#0f172a"
                                            />
                                        </div>

                                        {/* Scan Line Animation */}
                                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-sage-400/20 to-transparent w-full h-1/4 animate-scan pointer-events-none"></div>

                                        <div className="mt-4">
                                            <p className="font-display font-bold text-slate-800 text-lg">{selectedBatch.batchId}</p>
                                            <p className="text-xs text-slate-400 font-mono">HASH: {selectedBatch.blockchainHash?.substring(0, 8)}...</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 justify-center">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            icon={Printer}
                                            onClick={handlePrint}
                                        >
                                            Print Receipt
                                        </Button>
                                    </div>

                                    <div className="text-xs text-slate-400 max-w-xs mx-auto">
                                        This QR code contains encrypted batch data and is linked to the blockchain for traceability.
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center text-slate-400">
                                    <QrCode size={64} className="mx-auto mb-4 opacity-20" />
                                    <p>Select a batch to generate its traceability QR code</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default GenerateQR;
