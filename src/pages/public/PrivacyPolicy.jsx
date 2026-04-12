import React from 'react';
import { Shield, Lock, EyeOff, FileText, CheckCircle2 } from 'lucide-react';
import LightPageLayout from '../../components/layout/LightPageLayout';

const PrivacyPolicy = () => {
    return (
        <LightPageLayout 
            title="Privacy Principles"
            subtitle="Understand how we safeguard agricultural data and ensure consumer privacy through decentralized verification."
            icon={<Shield />}
            accentColor="rose"
        >
            <div className="flex flex-col lg:flex-row gap-20 items-start mt-12 pb-24">
                
                {/* Legal Sidebar */}
                <div className="w-full lg:w-72 shrink-0 lg:sticky lg:top-28 space-y-10 order-2 lg:order-1">
                    <div className="p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100 space-y-8">
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Navigation</h4>
                            <ul className="space-y-4 text-xs font-bold font-display">
                                <li><a href="#information" className="text-slate-500 hover:text-rose-600 transition-colors pl-2">Information We Collect</a></li>
                                <li><a href="#consumer" className="text-slate-500 hover:text-rose-600 transition-colors pl-2">Zero-Registration Policy</a></li>
                                <li><a href="#protection" className="text-slate-500 hover:text-rose-600 transition-colors pl-2">Data Protection</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="p-8 rounded-[2.5rem] bg-rose-50 border border-rose-100 flex items-start gap-4">
                        <div className="p-2 rounded-xl bg-white border border-rose-200 text-rose-600">
                             <EyeOff size={18} />
                        </div>
                        <div>
                            <h4 className="text-xs font-black text-rose-900 uppercase tracking-[0.1em] mb-2 leading-none">No Ads</h4>
                            <p className="text-[10px] text-rose-700/70 font-bold leading-relaxed">
                                Farm2Fork does not sell stakeholder data to third-party advertisers.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main Content Content */}
                <div className="flex-1 max-w-3xl space-y-24 order-1 lg:order-2">
                    <section id="information" className="scroll-mt-28">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-10 h-10 rounded-xl bg-rose-600/10 flex items-center justify-center border border-rose-600/10">
                                <FileText size={20} className="text-rose-600" />
                            </div>
                            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Information Collection</h2>
                        </div>
                        <div className="prose prose-slate prose-rose max-w-none text-slate-500 leading-relaxed font-medium">
                            <p className="text-lg text-slate-600 mb-10">
                                Depending on your role in the supply chain lifecycle, Farm2Fork collects and securely stores the following data through our decentralized verification portal.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    { title: 'Identity Records', desc: 'Secure representation of name, role, and business license for KYC.', icon: <CheckCircle2 size={16}/> },
                                    { title: 'Geospatial Data', desc: 'Precise farm and delivery coordinates for route optimization.', icon: <CheckCircle2 size={16}/> },
                                    { title: 'Supply Batch Logs', desc: 'Harvest yields and quality assessments (Fully Encrypted).', icon: <CheckCircle2 size={16}/> },
                                    { title: 'Fleet Activity', desc: 'Driver movement and real-time transit telemetry logs.', icon: <CheckCircle2 size={16}/> }
                                ].map((item, i) => (
                                    <div key={i} className="p-6 rounded-3xl bg-white border border-slate-100 hover:border-rose-200 transition-colors group">
                                        <div className="text-rose-600/20 mb-3 group-hover:scale-110 transition-transform">{item.icon}</div>
                                        <h3 className="text-sm font-black text-slate-900 mb-1">{item.title}</h3>
                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section id="consumer" className="scroll-mt-28">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-10 h-10 rounded-xl bg-gray-600/10 flex items-center justify-center border border-gray-600/10">
                                <ScanFace size={20} className="text-gray-900" />
                            </div>
                            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Zero-Registration Policy</h2>
                        </div>
                        <div className="p-12 rounded-[2.5rem] bg-slate-900 text-slate-300 relative overflow-hidden text-center">
                            <div className="relative z-10 max-w-md mx-auto">
                                <p className="text-lg font-bold mb-8 leading-relaxed">
                                    Consumers are never required to share PII, create accounts, or download proprietary trackers.
                                </p>
                                <div className="flex flex-col gap-4">
                                     <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 text-xs font-black uppercase text-white tracking-[0.2em] justify-center">
                                         <Lock size={14} className="text-rose-500"/> No Identity Requirements
                                     </div>
                                     <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 text-xs font-black uppercase text-white tracking-[0.2em] justify-center">
                                         <Lock size={14} className="text-rose-500"/> No App Download Needed
                                     </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </LightPageLayout>
    );
};

export default PrivacyPolicy;
