import React, { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer, Share2, QrCode, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/ui/Button';
import StatusBadge from '../../components/ui/StatusBadge';
import { api } from '../../utils/api';

const BatchDetail = () => {
    const { batchId } = useParams();
    const navigate = useNavigate();
    const [batch, setBatch] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBatch = async () => {
            try {
                setLoading(true);
                const res = await api.farmer.getBatchById(batchId);
                if (res.success) {
                    setBatch(res.data);
                } else {
                    setError('Failed to load batch details');
                }
            } catch (err) {
                console.error('Fetch error:', err);
                setError('Failed to load batch details');
            } finally {
                setLoading(false);
            }
        };

        if (batchId) {
            fetchBatch();
        }
    }, [batchId]);

    if (loading) return (
        <DashboardLayout role="farmer">
            <div className="flex justify-center items-center h-96">
                <Loader2 className="animate-spin text-sage-500" size={48} />
            </div>
        </DashboardLayout>
    );

    if (error || !batch) return (
        <DashboardLayout role="farmer">
            <div className="flex flex-col items-center justify-center h-96 gap-4">
                <p className="text-red-500">{error || 'Batch not found'}</p>
                <Button onClick={() => navigate('/farmer/batches')}>Back to Batches</Button>
            </div>
        </DashboardLayout>
    );

    const handlePrint = () => {
        const qrContainer = document.getElementById('detail-qr-container');
        if (!qrContainer) return;

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
                <title>Batch Receipt - ${batch.batchId}</title>
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
                    <div class="row"><span class="label">Batch ID:</span> <span>${batch.batchId}</span></div>
                    <div class="row"><span class="label">Crop:</span> <span>${batch.crop}</span></div>
                    <div class="row"><span class="label">Variety:</span> <span>${batch.variety}</span></div>
                    <div class="row"><span class="label">Quantity:</span> <span>${batch.quantity} ${batch.unit}</span></div>
                </div>

                <div class="qr-container">${qrSvg}</div>

                <div class="footer">
                    <p>Scan to verify authenticity</p>
                    <p>Powered by Farm2Fork Blockchain</p>
                </div>
                
                <script>
                    setTimeout(() => {
                        window.print();
                        setTimeout(() => window.close(), 500);
                    }, 500);
                </script>
            </body>
            </html>
        `;

        printWindow.document.write(receiptHtml);
        printWindow.document.close();
    };

    return (
        <DashboardLayout role="farmer">
            <div className="max-w-4xl mx-auto space-y-6 animate-in">

                {/* Header Actions */}
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => navigate('/farmer/batches')}
                        className="flex items-center gap-2 text-slate-500 hover:text-sage-600 transition-colors"
                    >
                        <ArrowLeft size={20} /> Back to Batches
                    </button>

                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" icon={Printer}>Print Label</Button>
                        <Button variant="outline" size="sm" icon={Share2}>Share</Button>
                    </div>
                </div>

                {/* Main Content Card */}
                <div className="glass-panel p-8 rounded-3xl shadow-lg relative overflow-hidden">
                    {/* Decorative background */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-sage-100 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                    <div className="flex flex-col md:flex-row gap-8 relative z-10">

                        {/* Product Image & QR Section */}
                        <div className="w-full md:w-1/3 flex flex-col gap-4">


                            <div className="bg-white p-4 rounded-xl border border-sage-200 shadow-inner flex flex-col items-center gap-2">
                                {batch.qrGenerated ? (
                                    <>
                                        <div id="detail-qr-container" className="bg-white p-2 rounded relative overflow-hidden">
                                            <QRCode
                                                value={`https://farm2fork.com/trace/${batch._id}`}
                                                size={120}
                                                level="H"
                                                fgColor="#0f172a"
                                            />
                                        </div>
                                        <p className="text-xs text-slate-400 font-mono tracking-wider break-all text-center">{batch.batchId}</p>
                                        <Button
                                            size="sm"
                                            className="w-full mt-2"
                                            onClick={handlePrint}
                                        >
                                            Print QR
                                        </Button>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center py-4">
                                        <QrCode size={64} className="text-slate-200 mb-2" />
                                        <p className="text-xs text-slate-400 text-center mb-3">No QR Code generated yet</p>
                                        <Button size="sm" onClick={() => navigate('/farmer/generate-qr')}>Generate Now</Button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Details Section */}
                        <div className="flex-1 space-y-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h1 className="text-3xl font-display font-bold text-slate-800 mb-1">{batch.crop}</h1>
                                    <p className="text-slate-500 text-lg">{batch.variety || 'Standard Variety'}</p>
                                </div>
                                <StatusBadge status={batch.status} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <DetailItem label="Batch ID" value={batch.batchId} />
                                <DetailItem label="Quantity" value={`${batch.quantity} ${batch.unit}`} />
                                <DetailItem label="Harvest Date" value={new Date(batch.harvestDate).toLocaleDateString()} />
                                <DetailItem label="Quality Grade" value={batch.qualityScore || 'N/A'} highlight />
                            </div>

                            <div className="pt-6 border-t border-sage-100">
                                <h3 className="text-sm font-semibold text-slate-700 mb-4 uppercase tracking-wider">Journey Timeline</h3>
                                <div className="space-y-6 ml-2 border-l-2 border-sage-200 pl-6 relative">
                                    {batch.journey && batch.journey.length > 0 ? (
                                        batch.journey.map((step, index) => (
                                            <TimelineItem
                                                key={index}
                                                title={step.status} // Or step.stage
                                                date={new Date(step.timestamp).toLocaleDateString()}
                                                status={step.status}
                                                description={step.notes || `${step.status} at ${step.location?.name || 'Farm'}`}
                                                active={index === 0} // Most recent is active
                                                isLast={index === batch.journey.length - 1}
                                            />
                                        ))
                                    ) : (
                                        <p className="text-slate-400 text-sm">No journey history yet.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

const DetailItem = ({ label, value, highlight }) => (
    <div className="p-3 rounded-lg bg-sage-50/50 border border-sage-100">
        <p className="text-xs text-slate-500 mb-1">{label}</p>
        <p className={`font-semibold ${highlight ? 'text-sage-600' : 'text-slate-700'}`}>{value}</p>
    </div>
);

const TimelineItem = ({ title, date, status, description, active, isLast }) => (
    <div className="relative">
        <div className={`
      absolute -left-[31px] w-4 h-4 rounded-full border-2 
      ${active ? 'bg-sage-500 border-white shadow-md scale-110' : 'bg-white border-sage-300'}
    `}></div>
        <div className="flex justify-between items-start">
            <div>
                <h4 className={`text-sm font-medium ${active ? 'text-sage-800' : 'text-slate-500'}`}>{title}</h4>
                {description && <p className="text-xs text-slate-400 mt-1 max-w-xs">{description}</p>}
            </div>
            <span className="text-xs text-slate-400 font-mono">{date}</span>
        </div>
    </div>
);

export default BatchDetail;
