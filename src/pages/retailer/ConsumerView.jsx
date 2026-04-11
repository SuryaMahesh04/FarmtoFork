import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Scan, ShieldCheck, MapPin, Truck, Store, User, ArrowLeft, History, ChevronRight } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/ui/Button';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const ConsumerView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [batch, setBatch] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBatch = async () => {
            try {
                setLoading(true);
                // We use public trace endpoint but we are authenticated as retailer
                const res = await api.public.getTraceData(id);
                if (res.success) {
                    setBatch(res.data);
                }
            } catch (error) {
                toast.error('Failed to load consumer preview');
            } finally {
                setLoading(false);
            }
        };
        fetchBatch();
    }, [id]);

    if (loading) return <DashboardLayout role="retailer"><div className="p-10 text-center">Loading preview...</div></DashboardLayout>;
    if (!batch) return <DashboardLayout role="retailer"><div className="p-10 text-center text-rose-500">Trace data not found for this product.</div></DashboardLayout>;

    return (
        <DashboardLayout role="retailer">
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors">
                        <ArrowLeft size={20} />
                        <span className="font-medium">Back to Inventory</span>
                    </button>
                    <div className="bg-sky-100 text-sky-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm border border-sky-200">
                        <Scan size={14} />
                        Consumer Preview Mode
                    </div>
                </div>

                {/* Hero Card */}
                <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                    <div className="bg-gradient-to-br from-emerald-600 to-emerald-500 p-8 text-white relative">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                        
                        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/30">Verified Origin</span>
                                    {batch.qualityScore >= 80 && <span className="bg-emerald-400 text-emerald-950 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">Premium Quality</span>}
                                </div>
                                <h1 className="text-4xl font-display font-bold mb-1 tracking-tight">{batch.crop}</h1>
                                <p className="text-emerald-50 font-medium opacity-90">{batch.variety || 'A-Grade Fresh Selection'}</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-xl p-4 rounded-3xl border border-white/20 text-center min-w-[140px]">
                                <p className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-1">Trace Identity</p>
                                <p className="text-xl font-mono font-bold tracking-tighter">BTH-{batch.batchId}</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Highlights */}
                        <div className="md:col-span-2 space-y-8">
                            <div>
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <History size={16} />
                                    Production Timeline
                                </h3>
                                <div className="space-y-0 pl-3 border-l-2 border-slate-100 ml-2">
                                    {batch.journey.map((step, idx) => (
                                        <div key={idx} className="relative pb-8 last:pb-0 pl-8">
                                            <div className="absolute left-[-9px] top-1 w-4 h-4 rounded-full bg-white border-4 border-emerald-500 shadow-sm z-10"></div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{new Date(step.timestamp).toLocaleDateString()}</span>
                                                <h4 className="text-base font-bold text-slate-800">{step.stage}</h4>
                                                <p className="text-sm text-slate-500 leading-relaxed mt-1">{step.details}</p>
                                                <div className="mt-2 flex items-center gap-3 text-xs text-slate-400">
                                                    <span className="flex items-center gap-1"><MapPin size={10} /> {step.location}</span>
                                                    <span className="flex items-center gap-1 font-mono text-[9px]">Hash: {step.transactionHash.slice(0, 12)}...</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 border-dashed">
                                <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                                     <ShieldCheck size={18} className="text-emerald-500" />
                                    Cryptographic Verification
                                </h4>
                                <p className="text-xs text-slate-500 leading-relaxed">
                                    Every touchpoint in this product's lifecycle is digitally signed and indexed on our secure ledger. This ensures that the data you see hasn't been tampered with since the point of origin at the farm.
                                </p>
                            </div>
                        </div>

                        {/* Stakeholders Card */}
                        <div className="space-y-6">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Ecosystem Partners</h3>
                            
                            {[
                                { role: 'Farmer', icon: User, name: batch.farmerId?.profile?.fullName || 'Certified Farmer' },
                                { role: 'Quality Check', icon: ShieldCheck, name: 'Verified Protocol 8.2' }, // Mocking protocol
                                { role: 'Transporter', icon: Truck, name: 'Eco-Smart Logistics' },
                                { role: 'Store', icon: Store, name: 'Retailer Branch' }
                            ].map((p, idx) => (
                                <div key={idx} className="flex items-center gap-4 group p-2 hover:bg-slate-50 rounded-2xl transition-all">
                                    <div className="w-10 h-10 bg-white shadow-sm border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-emerald-500 group-hover:border-emerald-200 transition-colors">
                                        <p.icon size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{p.role}</p>
                                        <p className="text-sm font-bold text-slate-800">{p.name}</p>
                                    </div>
                                </div>
                            ))}

                            <div className="mt-8 pt-8 border-t border-slate-100">
                               <div className="text-center p-6 bg-emerald-50 rounded-3xl">
                                    <p className="text-xs font-bold text-emerald-800 mb-2 uppercase">Safe to consume</p>
                                    <h4 className="text-lg font-bold text-emerald-900 leading-tight">Trust Your Food. Source Better.</h4>
                               </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ConsumerView;
