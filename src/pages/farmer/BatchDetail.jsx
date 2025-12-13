import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer, Share2, QrCode } from 'lucide-react';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/ui/Button';
import StatusBadge from '../../components/ui/StatusBadge';
import { farmerBatches } from '../../data/dummyData';

const BatchDetail = () => {
    const { batchId } = useParams();
    const navigate = useNavigate();
    const [batch, setBatch] = useState(null);

    useEffect(() => {
        // Simulate fetching data
        const found = farmerBatches.find(b => b.id === batchId) || farmerBatches[0];
        setBatch(found);
    }, [batchId]);

    if (!batch) return <div className="p-8 text-center">Loading...</div>;

    return (
        <DashboardLayout role="farmer">
            <div className="max-w-4xl mx-auto space-y-6">

                {/* Header Actions */}
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => navigate(-1)}
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
                            <div className="aspect-square rounded-2xl bg-wheat-50 border border-wheat-100 flex items-center justify-center relative overflow-hidden group">
                                <img
                                    src={`https://source.unsplash.com/400x400/?${batch.crop.split(' ')[0]}`}
                                    alt={batch.crop}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    onError={(e) => e.target.src = 'https://source.unsplash.com/400x400/?agriculture'}
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Button variant="secondary" size="sm">Update Photo</Button>
                                </div>
                            </div>

                            <div className="bg-white p-4 rounded-xl border border-sage-200 shadow-inner flex flex-col items-center gap-2">
                                <QrCode size={120} className="text-sage-800" />
                                <p className="text-xs text-slate-400 font-mono tracking-wider">{batch.id}</p>
                                <Button size="sm" className="w-full mt-2">Download QR</Button>
                            </div>
                        </div>

                        {/* Details Section */}
                        <div className="flex-1 space-y-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h1 className="text-3xl font-display font-bold text-slate-800 mb-1">{batch.crop}</h1>
                                    <p className="text-slate-500 text-lg">{batch.type || 'Standard Variety'}</p>
                                </div>
                                <StatusBadge status={batch.status} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <DetailItem label="Batch ID" value={batch.id} />
                                <DetailItem label="Quantity" value={batch.quantity} />
                                <DetailItem label="Harvest Date" value={batch.date} />
                                <DetailItem label="Quality Grade" value={batch.quality} highlight />
                            </div>

                            <div className="pt-6 border-t border-sage-100">
                                <h3 className="text-sm font-semibold text-slate-700 mb-4 uppercase tracking-wider">Journey Timeline</h3>
                                <div className="space-y-6 ml-2 border-l-2 border-sage-200 pl-6 relative">
                                    <TimelineItem
                                        title="Harvested & Packed"
                                        date={batch.date}
                                        status="Completed"
                                        description="Quality check passed. packed in 50kg jute bags."
                                        active
                                    />
                                    <TimelineItem
                                        title="Pickup Scheduled"
                                        date="Pending"
                                        status={batch.status === 'Created' ? 'Next' : 'Completed'}
                                        description="Transporter assigned: Express Logistics"
                                    />
                                    <TimelineItem
                                        title="Reached Distributor"
                                        date="Pending"
                                        status="Pending"
                                        isLast
                                    />
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
