import React from 'react';
import { Cookie, CheckCircle2, XCircle, Info } from 'lucide-react';
import LightPageLayout from '../../components/layout/LightPageLayout';

const CookiePolicy = () => {
    return (
        <LightPageLayout 
            title="Cookie Usage"
            subtitle="Understand how we use local storage mechanisms to authenticate supply chain participants without invasive tracking."
            icon={<Cookie />}
            accentColor="emerald"
        >
            <div className="max-w-4xl mx-auto mt-12 mb-32 space-y-24">
                <section className="text-center max-w-2xl mx-auto space-y-6">
                    <p className="text-xl text-slate-600 font-medium leading-relaxed">
                        To provide a secure and seamless journey from farm to fork, we utilize modern web storage mechanisms that prioritize functionality and security over analytics.
                    </p>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* What We Do */}
                    <div className="p-10 rounded-[2.5rem] bg-emerald-50 border border-emerald-100 space-y-8">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                                <CheckCircle2 size={20} />
                            </div>
                            <h3 className="text-xl font-black text-emerald-900">Functional Use</h3>
                        </div>
                        <ul className="space-y-6">
                            {[
                                { title: 'Authentication (JWT)', desc: 'Securing your session signature locally so you stay logged in across supply chain actions.' },
                                { title: 'Role Persistence', desc: 'Caching your stakeholder role to ensure your specific dashboard loads instantly.' },
                                { title: 'Fleet Map Caching', desc: 'Temporarily storing map tile data to optimize real-time route computation performance.' }
                            ].map((item, i) => (
                                <li key={i} className="space-y-1">
                                    <p className="text-sm font-black text-emerald-800 uppercase tracking-widest">{item.title}</p>
                                    <p className="text-xs text-emerald-700/60 font-bold leading-relaxed">{item.desc}</p>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* What We Don't Do */}
                    <div className="p-10 rounded-[2.5rem] bg-slate-50 border border-slate-200/60 space-y-8">
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                                <XCircle size={20} />
                            </div>
                            <h3 className="text-xl font-black text-slate-900">Privacy Safeguards</h3>
                        </div>
                        <ul className="space-y-6">
                            {[
                                { title: 'Zero Tracking', desc: 'Farm2Fork does not use cookies for cross-site tracking, profiling, or behavioral analysis.' },
                                { title: 'No Advertising', desc: 'We do not integrate with third-party retargeting or advertising data brokers.' },
                                { title: 'Anonymous Tracing', desc: 'The consumer portal (/trace) is entirely stateless. Zero cookies are set for public scans.' }
                            ].map((item, i) => (
                                <li key={i} className="space-y-1">
                                    <p className="text-sm font-black text-slate-800 uppercase tracking-widest">{item.title}</p>
                                    <p className="text-xs text-slate-400 font-black leading-relaxed">{item.desc}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="p-8 rounded-3xl bg-slate-900 text-white flex flex-col md:flex-row items-center gap-6 text-center md:text-left relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-600/20 blur-3xl" />
                    <Info className="text-emerald-400 shrink-0" size={32} />
                    <div>
                        <p className="text-xs font-black uppercase tracking-widest text-emerald-400 mb-1">User Consent</p>
                        <p className="text-sm font-bold opacity-80 leading-relaxed">
                            By using our supply chain dashboards, you acknowledge the use of essential authentication mechanisms required for technical security.
                        </p>
                    </div>
                </div>
            </div>
        </LightPageLayout>
    );
};

export default CookiePolicy;
