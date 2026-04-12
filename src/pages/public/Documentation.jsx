import React from 'react';
import { BookOpen, Shield, ScanFace, Database, Users, ChevronRight, Hash } from 'lucide-react';
import LightPageLayout from '../../components/layout/LightPageLayout';

const Documentation = () => {
    return (
        <LightPageLayout 
            title="Technical Documentation"
            subtitle="Deep dive into the cryptographic architecture, user roles, and traceability engine of the Farm2Fork ecosystem."
            icon={<BookOpen />}
            accentColor="emerald"
        >
            <div className="flex flex-col lg:flex-row gap-16 items-start mt-12">
                <div className="hidden lg:block w-72 shrink-0 sticky top-28">
                    <div className="p-10 rounded-[2.5rem] bg-slate-50 border border-slate-100 space-y-8">
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">On this page</h4>
                            <ul className="space-y-4 text-xs font-bold font-display">
                                <li><a href="#overview" className="flex items-center gap-3 text-slate-500 hover:text-emerald-600 transition-colors pl-2 border-l-2 border-emerald-500/0 hover:border-emerald-500 transition-all">Platform Overview</a></li>
                                <li><a href="#principles" className="flex items-center gap-3 text-slate-500 hover:text-emerald-600 transition-colors pl-2 border-l-2 border-emerald-500/0 hover:border-emerald-500 transition-all">Core principles</a></li>
                                <li><a href="#roles" className="flex items-center gap-3 text-slate-500 hover:text-emerald-600 transition-colors pl-2 border-l-2 border-emerald-500/0 hover:border-emerald-500 transition-all">Stakeholder Roles</a></li>
                                <li><a href="#traceability" className="flex items-center gap-3 text-slate-500 hover:text-emerald-600 transition-colors pl-2 border-l-2 border-emerald-500/0 hover:border-emerald-500 transition-all">Traceability Engine</a></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="flex-1 max-w-4xl space-y-24">
                    <section id="overview" className="scroll-mt-28">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-10 h-10 rounded-xl bg-emerald-600/10 flex items-center justify-center border border-emerald-600/10">
                                <Database size={20} className="text-emerald-600" />
                            </div>
                            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Platform Overview</h2>
                        </div>
                        <div className="prose prose-slate prose-emerald max-w-none text-slate-500 leading-relaxed font-medium">
                            <p className="text-lg text-slate-600">
                                Farm2Fork is a next-generation **Agricultural Supply Chain Management System** designed to eliminate information asymmetry and build absolute trust between producers and consumers.
                            </p>
                            <p>
                                By treating the database as an *untrusted medium*, our architecture cryptographically anchors batch information at the origin. This ensures that essential metrics—such as harvest coordinates, crop types, and quality scores—remain immutable regardless of administrator actions or database intrusion.
                            </p>
                        </div>
                    </section>

                    <section id="principles" className="scroll-mt-28">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-10 h-10 rounded-xl bg-emerald-600/10 flex items-center justify-center border border-emerald-600/10">
                                <Shield size={20} className="text-emerald-600" />
                            </div>
                            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Core Principles</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                { title: 'Mathematical Trust', desc: 'Relying on AES-256-GCM and HMAC-SHA256 instead of simple database permissions.' },
                                { title: 'Radical Transparency', desc: 'Allowing consumers to verify the entire journey via a single scan with zero required registration.' },
                                { title: 'Decentralized Data', desc: 'Ensuring that no single entity—even the platform admin—can modify historical supply chain events.' },
                                { title: 'Automated Integrity', desc: 'Real-time tamper alerts across dashboards if cryptographic validation fails.' }
                            ].map((item, i) => (
                                <div key={i} className="p-8 rounded-3xl bg-white border border-slate-100 shadow-xl shadow-slate-200/10 group hover:border-emerald-200 transition-colors">
                                    <Hash size={16} className="text-emerald-600/30 mb-4 group-hover:rotate-12 transition-transform"/>
                                    <h3 className="text-lg font-black text-slate-900 mb-2">{item.title}</h3>
                                    <p className="text-xs text-slate-500 leading-relaxed font-bold">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section id="roles" className="scroll-mt-28">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-10 h-10 rounded-xl bg-emerald-600/10 flex items-center justify-center border border-emerald-600/10">
                                <Users size={20} className="text-emerald-600" />
                            </div>
                            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Stakeholder Ecosystem</h2>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {[
                                { role: 'Farmer', power: 'Originator', desc: 'The source of truth. Creates encrypted batches and generates initial QR codes.' },
                                { role: 'Transporter', power: 'Logistics', desc: 'Orchestrates the movement. Assigns drivers and manages fleet status.' },
                                { role: 'Driver', power: 'Execution', desc: 'Provides real-time GPS-assisted updates from harvest sites to distributor bays.' },
                                { role: 'Distributor', power: 'Verification', desc: 'Assesses batch quality and provides independent scoring for the immutable record.' },
                                { role: 'Retailer', power: 'Fulfillment', desc: 'Bridges the digital record to the physical shelf for consumer verification.' },
                                { role: 'Administrator', power: 'Governance', desc: 'Manages identity and ecosystem health without permission to alter data.' }
                            ].map((item, i) => (
                                <div key={i} className="py-8 flex flex-col md:flex-row gap-6 group hover:translate-x-1 transition-transform">
                                    <div className="w-40 shrink-0">
                                        <p className="text-xs font-black text-emerald-600 uppercase tracking-widest">{item.role}</p>
                                        <p className="text-[10px] text-slate-400 font-black uppercase mt-1">{item.power}</p>
                                    </div>
                                    <p className="text-sm font-bold text-slate-500 leading-relaxed flex-1">
                                        {item.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section id="traceability" className="scroll-mt-28">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-10 h-10 rounded-xl bg-emerald-600/10 flex items-center justify-center border border-emerald-600/10">
                                <ScanFace size={20} className="text-emerald-600" />
                            </div>
                            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Traceability Engine</h2>
                        </div>
                        <div className="p-10 rounded-[2.5rem] bg-slate-900 text-slate-300 relative overflow-hidden group">
                           <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-600/20 blur-3xl pointer-events-none" />
                           <h3 className="text-white font-black mb-4">RESTful Trace Integration</h3>
                           <p className="text-sm text-slate-400 leading-relaxed mb-10 max-w-2xl">
                               The public traceability portal utilizes a stateless verification algorithm. When a QR is scanned, the API verifies the HMAC signature before revealing any journey data.
                           </p>
                           <div className="bg-black/40 rounded-2xl p-6 font-mono text-sm text-emerald-400 border border-white/5 backdrop-blur-md">
                               GET /api/public/trace/:batchId
                           </div>
                        </div>
                    </section>
                </div>
            </div>
        </LightPageLayout>
    );
};

export default Documentation;
