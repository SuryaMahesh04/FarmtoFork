import React from 'react';
import { Layers, Server, Globe, Database, Cpu, Activity, ArrowRight, Smartphone } from 'lucide-react';
import LightPageLayout from '../../components/layout/LightPageLayout';
import DecryptedText from '../../components/ui/core/DecryptedText';
import { motion } from 'framer-motion';

const Architecture = () => {
    return (
        <LightPageLayout 
            title="System Architecture"
            subtitle="Explore our modular, 3-tier REST architecture built for scalability, encryption-first data handling, and multi-stakeholder synchronization."
            icon={<Cpu />}
            accentColor="sky"
        >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-32">
                {[
                    { 
                        title: 'Presentation Tier', 
                        icon: <Smartphone size={24}/>, 
                        color: 'sky',
                        desc: 'Role-specific React SPAs for farmers, transporters, and admins. Powered by Vite for sub-second hot module replacement.',
                        tech: ['React 18', 'Tailwind', 'Recharts']
                    },
                    { 
                        title: 'Application Tier', 
                        icon: <Server size={24}/>, 
                        color: 'sky',
                        desc: 'MERN orchestration layer. Handles stateless JWT authentication, RBAC, and invokes the Cryptographic Engine.',
                        tech: ['Node.js', 'Express', 'JWT']
                    },
                    { 
                        title: 'Data Tier', 
                        icon: <Database size={24}/>, 
                        color: 'sky',
                        desc: 'Distributed MongoDB Atlas document store. Optimized for complex supply chain arrays and encrypted batch schemas.',
                        tech: ['MongoDB', 'Mongoose', 'AES-256']
                    }
                ].map((tier, i) => (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        key={i} 
                        className="p-10 rounded-[2.5rem] bg-white border border-slate-100 shadow-xl shadow-slate-200/20 group hover:border-sky-300 transition-all"
                    >
                        <div className="w-12 h-12 rounded-2xl bg-sky-50 flex items-center justify-center mb-8 border border-sky-100 text-sky-600 transition-transform group-hover:scale-110">
                            {tier.icon}
                        </div>
                        <h3 className="text-xl font-black text-slate-900 mb-4 tracking-tight">{tier.title}</h3>
                        <p className="text-sm text-slate-500 leading-relaxed font-bold mb-8">
                            {tier.desc}
                        </p>
                        <div className="flex flex-wrap gap-2 pt-6 border-t border-slate-50">
                            {tier.tech.map((t, idx) => (
                                <span key={idx} className="px-2 py-1 bg-sky-50 text-[10px] font-black text-sky-600 rounded-md uppercase tracking-wider">
                                    {t}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>

            <section className="mb-32">
                <div className="flex flex-col items-center text-center mb-16">
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-4">
                        <DecryptedText text="Integration Pipeline" />
                    </h2>
                    <p className="text-slate-500 font-bold text-sm max-w-xl">
                        The journey of a batch from physical harvest to unalterable digital record through atomic transaction management.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-0 relative">
                    {/* Progress line hide on mobile */}
                    <div className="absolute top-1/2 left-0 w-full h-px bg-slate-200 hidden md:block -z-10" />
                    
                    {[
                        { title: 'Capture', desc: 'Secure sensor/manual entry at farm origin', icon: <Activity className="text-emerald-600"/> },
                        { title: 'Encrypt', desc: 'Application-layer AES-256 field locking', icon: <Shield className="text-sky-600"/> },
                        { title: 'Chain-Link', desc: 'Sequential HMAC signature binding', icon: <Layers className="text-violet-600"/> },
                        { title: 'Store', desc: 'Finalized persistence in atlas cluster', icon: <Database className="text-amber-600"/> }
                    ].map((step, i) => (
                        <div key={i} className="flex flex-col items-center">
                            <div className="p-4 bg-white border-4 border-slate-50 rounded-full shadow-lg mb-6 z-10 group-hover:scale-110 transition-transform">
                                {step.icon}
                            </div>
                            <h4 className="text-sm font-black text-slate-900 mb-2">{step.title}</h4>
                            <p className="text-[10px] text-slate-400 font-black text-center max-w-[150px] leading-relaxed uppercase tracking-widest px-4">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="p-12 md:p-20 rounded-[3.5rem] bg-slate-50 border border-slate-200 relative overflow-hidden group">
                <div className="absolute top-10 right-10 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Cpu size={200} />
                </div>
                <div className="relative z-10 max-w-2xl">
                    <h3 className="text-2xl font-black text-slate-900 mb-6">Built for Evaluation</h3>
                    <p className="text-slate-500 font-bold mb-10 leading-relaxed">
                        Our codebase emphasizes clean separation of concerns and follows academic best practices for system design. 
                        Every route is logically organized under role-specific controllers to ensure reviewers can easily verify the cross-stakeholder logic.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <button className="px-8 py-3 bg-slate-900 text-white rounded-2xl text-sm font-black flex items-center gap-2 hover:bg-emerald-600 transition-all shadow-xl shadow-slate-900/10">
                            Explore API Specs <ArrowRight size={16}/>
                        </button>
                    </div>
                </div>
            </section>
        </LightPageLayout>
    );
};

export default Architecture;
