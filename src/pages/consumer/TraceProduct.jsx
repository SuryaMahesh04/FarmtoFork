import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Loader2, Package, MapPin, Calendar, User, ShieldCheck } from 'lucide-react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';

const TraceProduct = () => {
    const { batchId } = useParams();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate loading
        setTimeout(() => setLoading(false), 1500);
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Header />

            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="max-w-3xl mx-auto">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-64">
                            <Loader2 className="animate-spin text-sage-500 mb-4" size={48} />
                            <p className="text-slate-500">Fetching blockchain records...</p>
                        </div>
                    ) : (
                        <div className="space-y-6 animate-in fade-in">
                            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-sage-100">
                                <div className="bg-sage-600 p-6 text-white text-center">
                                    <ShieldCheck size={48} className="mx-auto mb-2 text-sage-200" />
                                    <h1 className="text-2xl font-display font-bold">Verified Authentic</h1>
                                    <p className="text-sage-100 mt-1">Batch ID: {batchId || 'BTH-00000X'}</p>
                                </div>

                                <div className="p-8">
                                    <div className="text-center mb-8">
                                        <p className="text-slate-500">
                                            This product has been securely traced via the Farm2Fork blockchain network.
                                            Orign: <strong>Guntur, Andhra Pradesh</strong>
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                            <div className="flex items-center gap-3 mb-2">
                                                <Package className="text-sage-600" size={20} />
                                                <h3 className="font-semibold text-slate-700">Product Info</h3>
                                            </div>
                                            <div className="space-y-1 text-sm">
                                                <div className="flex justify-between"><span>Crop:</span> <span className="font-medium">Premium Rice</span></div>
                                                <div className="flex justify-between"><span>Variety:</span> <span className="font-medium">Sona Masoori</span></div>
                                                <div className="flex justify-between"><span>Grade:</span> <span className="font-medium">A+ Export Quality</span></div>
                                            </div>
                                        </div>

                                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                            <div className="flex items-center gap-3 mb-2">
                                                <User className="text-sage-600" size={20} />
                                                <h3 className="font-semibold text-slate-700">Farmer Details</h3>
                                            </div>
                                            <div className="space-y-1 text-sm">
                                                <div className="flex justify-between"><span>Farmer:</span> <span className="font-medium">Rajesh Kumar</span></div>
                                                <div className="flex justify-between"><span>Location:</span> <span className="font-medium">Amaravati, AP</span></div>
                                                <div className="flex justify-between"><span>Harvested:</span> <span className="font-medium">12 Dec 2024</span></div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Timeline Placeholder */}
                                    <div className="mt-8 pt-8 border-t border-slate-100">
                                        <h3 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
                                            <MapPin size={18} /> Journey Timeline
                                        </h3>
                                        <div className="space-y-6 relative pl-4 border-l-2 border-slate-200 ml-2">
                                            <div className="relative">
                                                <span className="absolute -left-[21px] top-0 w-4 h-4 rounded-full bg-sage-500 border-2 border-white ring-2 ring-sage-100"></span>
                                                <p className="text-sm font-bold text-slate-800">Harvested</p>
                                                <p className="text-xs text-slate-500">12 Dec 2024 • 08:30 AM</p>
                                                <p className="text-sm text-slate-600 mt-1">Harvested at Krishna Farm, Block A</p>
                                            </div>
                                            <div className="relative">
                                                <span className="absolute -left-[21px] top-0 w-4 h-4 rounded-full bg-sage-500 border-2 border-white ring-2 ring-sage-100"></span>
                                                <p className="text-sm font-bold text-slate-800">Quality Check</p>
                                                <p className="text-xs text-slate-500">13 Dec 2024 • 10:15 AM</p>
                                                <p className="text-sm text-slate-600 mt-1">Passed inspection with Grade A score</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default TraceProduct;
