import React, { useState } from 'react';
import { QrCode, Download, Printer, Share2, Check } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/ui/Button';
import { farmerBatches } from '../../data/dummyData';

const GenerateQR = () => {
    const [selectedBatch, setSelectedBatch] = useState('');
    const [isGenerated, setIsGenerated] = useState(false);

    const handleGenerate = () => {
        if (selectedBatch) {
            setIsGenerated(true);
        }
    };

    const batch = farmerBatches.find(b => b.id === selectedBatch);

    return (
        <DashboardLayout role="farmer">
            <div className="max-w-4xl mx-auto space-y-6 animate-in">
                <div>
                    <h1 className="text-2xl font-display font-bold text-slate-800">Generate QR Code</h1>
                    <p className="text-slate-500">Create unique traceability codes for your batches</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Controls Section */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-sage-100">
                            <label className="block text-sm font-medium text-slate-700 mb-2">Select Batch</label>
                            <select
                                className="w-full p-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sage-400 bg-white"
                                value={selectedBatch}
                                onChange={(e) => {
                                    setSelectedBatch(e.target.value);
                                    setIsGenerated(false);
                                }}
                            >
                                <option value="">-- Select a batch --</option>
                                {farmerBatches.map(b => (
                                    <option key={b.id} value={b.id}>
                                        {b.id} - {b.crop} ({b.variety})
                                    </option>
                                ))}
                            </select>

                            <div className="mt-6">
                                <Button
                                    className="w-full justify-center"
                                    onClick={handleGenerate}
                                    disabled={!selectedBatch}
                                >
                                    Generate QR Code
                                </Button>
                            </div>
                        </div>

                        {isGenerated && batch && (
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-sage-100 animate-in">
                                <h3 className="font-semibold text-slate-800 mb-4">Batch Details</h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between py-2 border-b border-slate-100">
                                        <span className="text-slate-500">Product</span>
                                        <span className="font-medium">{batch.crop}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-slate-100">
                                        <span className="text-slate-500">Variety</span>
                                        <span className="font-medium">{batch.variety}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-slate-100">
                                        <span className="text-slate-500">Quantity</span>
                                        <span className="font-medium">{batch.quantity}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-slate-100">
                                        <span className="text-slate-500">Harvest Date</span>
                                        <span className="font-medium">{batch.date}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Preview Section */}
                    <div className="bg-gradient-to-br from-white to-sage-50 p-8 rounded-xl shadow-sm border border-sage-100 flex flex-col items-center justify-center text-center min-h-[400px]">
                        {isGenerated ? (
                            <div className="space-y-6 animate-in fade-in zoom-in duration-500">
                                <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 inline-block relative overflow-hidden group">
                                    {/* Simulated QR Code Pattern */}
                                    <div className="w-48 h-48 bg-slate-900 rounded-lg relative flex items-center justify-center overflow-hidden">
                                        <div className="absolute inset-0 bg-white opacity-90 p-2 grid grid-cols-6 grid-rows-6 gap-1">
                                            {[...Array(36)].map((_, i) => (
                                                <div
                                                    key={i}
                                                    className={`rounded-sm ${Math.random() > 0.5 ? 'bg-slate-900' : 'bg-transparent'}`}
                                                />
                                            ))}
                                            {/* Corner Markers */}
                                            <div className="absolute top-2 left-2 w-10 h-10 border-4 border-slate-900 rounded-md bg-transparent z-10"></div>
                                            <div className="absolute top-2 right-2 w-10 h-10 border-4 border-slate-900 rounded-md bg-transparent z-10"></div>
                                            <div className="absolute bottom-2 left-2 w-10 h-10 border-4 border-slate-900 rounded-md bg-transparent z-10"></div>
                                        </div>
                                        <QrCode size={40} className="text-sage-600 relative z-20" />
                                    </div>

                                    {/* Scan Line Animation */}
                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-sage-400/20 to-transparent w-full h-1/4 animate-scan pointer-events-none"></div>

                                    <p className="mt-4 font-mono text-sm font-bold text-slate-800">{selectedBatch}</p>
                                </div>

                                <div className="flex gap-3 justify-center">
                                    <Button variant="outline" size="sm" icon={Download}>PDF</Button>
                                    <Button variant="outline" size="sm" icon={Printer}>Print</Button>
                                    <Button variant="outline" size="sm" icon={Share2}>Share</Button>
                                </div>

                                <div className="text-xs text-slate-400 max-w-xs mx-auto">
                                    This QR code contains encrypted batch data and is ready for packaging.
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
            </div>
        </DashboardLayout>
    );
};

export default GenerateQR;
