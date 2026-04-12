import React from 'react';
import { Scale, FileText, CheckCircle2, AlertOctagon, HelpCircle } from 'lucide-react';
import LightPageLayout from '../../components/layout/LightPageLayout';

const TermsOfService = () => {
    return (
        <LightPageLayout 
            title="Terms of Service"
            subtitle="The operational rules and stakeholder responsibilities governing the Farm2Fork supply chain network."
            icon={<Scale />}
            accentColor="rose"
        >
            <div className="max-w-4xl mx-auto space-y-24 mt-12 mb-32">
                
                <section>
                    <div className="flex items-center gap-6 mb-8 group">
                        <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black transition-transform group-hover:scale-110">01</div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Acceptance of Terms</h2>
                    </div>
                    <div className="p-10 rounded-[2.5rem] bg-slate-50 border border-slate-100 text-slate-600 leading-relaxed font-medium">
                        <p className="text-lg">
                            By accessing or using the Farm2Fork platform, you are agreeing to these Terms of Service. If you do not agree 
                            with any part of these terms, you must not use our service. Farm2Fork is intended to provide supply chain 
                            transparency, bridging the gap between farmers and consumers via verifiable cryptographic records.
                        </p>
                    </div>
                </section>

                <section>
                    <div className="flex items-center gap-6 mb-12 group">
                        <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black transition-transform group-hover:scale-110">02</div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Stakeholder Roles</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                            { role: 'Farmers', text: 'Must provide accurate crop details, harvest dates, and location metrics when generating batches. Falsification undermines cryptographic integrity.' },
                            { role: 'Transporters', text: 'Must responsibly manage shipment logs and acknowledge route assignments in a timely manner.' },
                            { role: 'Drivers', text: 'Subject to precise location logging. Responsible for real-time progressive status updates.' },
                            { role: 'Distributors', text: 'Required to conduct honest quality checking operations as these metrics are embedded into the unalterable history.' },
                            { role: 'Retailers', text: 'Strictly responsible for ensuring generated QR codes are visibly displayed for consumer review at the point of sale.' },
                            { role: 'Admin', text: 'Governs the platform fairly, executing KYC with diligence without biased restriction.' }
                        ].map((item, i) => (
                            <div key={i} className="p-8 rounded-[2rem] bg-white border border-slate-100 hover:border-rose-300 transition-colors shadow-xl shadow-slate-200/10">
                                <h3 className="text-rose-600 font-black mb-3 flex items-center gap-2 text-sm uppercase tracking-widest">
                                    <CheckCircle2 size={16} /> {item.role}
                                </h3>
                                <p className="text-sm text-slate-500 font-bold leading-relaxed">{item.text}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section>
                    <div className="flex items-center gap-6 mb-8 group">
                        <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black transition-transform group-hover:scale-110">03</div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Integrity Violations</h2>
                    </div>
                    <div className="p-12 rounded-[3.5rem] bg-rose-600 text-white relative overflow-hidden group">
                        <div className="absolute top-10 right-10 text-white/5 opacity-5 group-hover:opacity-10 transition-opacity">
                            <AlertOctagon size={240} />
                        </div>
                        <div className="relative z-10 space-y-8">
                            <p className="text-xl font-bold max-w-2xl leading-relaxed">
                                Farm2Fork relies on sequential chain-linking and HMAC-SHA256 document signing to verify the accuracy of the supply chain history.
                            </p>
                            <div className="p-6 bg-white/10 rounded-2xl border border-white/20 backdrop-blur-md">
                                <p className="text-sm font-black text-rose-50 mb-2 uppercase tracking-widest">Enforcement Policy</p>
                                <p className="text-sm font-bold opacity-80 leading-relaxed">
                                    Any attempt to circumvent, reverse-engineer, or corrupt the security architecture will result in automated flagging of the compromised batch, and permanent termination of your network access.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="flex flex-col items-center gap-4 text-center border-t border-slate-100 pt-12">
                     <HelpCircle size={24} className="text-slate-300" />
                     <p className="text-xs text-slate-400 font-black uppercase tracking-[0.2em]">Questions regarding our terms? contact team farm2fork</p>
                </div>
            </div>
        </LightPageLayout>
    );
};

export default TermsOfService;
