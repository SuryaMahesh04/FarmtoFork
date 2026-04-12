import React from 'react';
import { Shield, Lock, Eye, AlertTriangle, FileCheck, ArrowDown, Fingerprint, Key, Activity } from 'lucide-react';
import LightPageLayout from '../../components/layout/LightPageLayout';
import DecryptedText from '../../components/ui/core/DecryptedText';
import { motion } from 'framer-motion';

const SecurityModel = () => {
    return (
        <LightPageLayout 
            title="Cryptographic Integrity Model"
            subtitle="Farm2Fork treats the database as an untrusted medium. Learn about our field-level AES-256 encryption, HMAC signing payloads, and historical batch chain-linking."
            icon={<Shield />}
            accentColor="violet"
        >
            <div className="flex flex-col gap-32 mt-12 mb-32">
                
                {/* Section 1: Encryption */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8">
                        <div className="w-12 h-12 rounded-2xl bg-violet-600/10 flex items-center justify-center border border-violet-600/10">
                            <Lock size={24} className="text-violet-600" />
                        </div>
                        <h2 className="text-4xl font-black text-slate-900 tracking-tight">
                            <DecryptedText text="Field-Level AES-256-GCM" />
                        </h2>
                        <p className="text-slate-500 font-bold leading-relaxed">
                            Rather than simple transparent disk encryption, Farm2Fork encrypts specific data fields (price, quantity, coordinates) at the application layer. This means database administrators or potentially compromised DB instances cannot view sensitive financial or origin data.
                        </p>
                        <ul className="space-y-4">
                            {[
                                { title: '128-bit Initialization Vector', desc: 'A unique, random IV is generated for every single encrypted field.', icon: <Fingerprint size={16}/> },
                                { title: 'Authenticity Tag', desc: '16-byte GCM tags ensure data hasn\'t been modified in the database.', icon: <Key size={16}/> },
                                { title: 'Volatile Key Management', desc: 'Keys are derived from hardware/environment-locked secrets.', icon: <Shield size={16}/> }
                            ].map((item, i) => (
                                <li key={i} className="flex gap-4 p-4 rounded-3xl bg-slate-50 border border-slate-100 items-start group hover:bg-white hover:shadow-xl hover:shadow-slate-200/20 transition-all">
                                    <div className="mt-1 text-violet-600 transition-transform group-hover:scale-110">{item.icon}</div>
                                    <div>
                                        <h4 className="text-sm font-black text-slate-900 mb-1">{item.title}</h4>
                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{item.desc}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="p-8 md:p-12 rounded-[3.5rem] bg-indigo-950 text-indigo-400 font-mono text-sm relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/20 blur-[100px]" />
                        <div className="relative z-10 space-y-4">
                            <p className="text-slate-500">// Pseudo-implementation: Encrypting Harvest Record</p>
                            <div className="space-y-2">
                                <p><span className="text-violet-400">const</span> iv = crypto.randomBytes(16);</p>
                                <p><span className="text-violet-400">const</span> cipher = crypto.createCipheriv(<span className="text-emerald-400">'aes-256-gcm'</span>, key, iv);</p>
                                <p><span className="text-violet-400">let</span> encrypted = cipher.update(batch_origin_price, <span className="text-emerald-400">'utf8'</span>, <span className="text-emerald-400">'hex'</span>);</p>
                                <p>encrypted += cipher.final(<span className="text-emerald-400">'hex'</span>);</p>
                                <p><span className="text-violet-400">const</span> tag = cipher.getAuthTag();</p>
                            </div>
                            <div className="pt-8 border-t border-indigo-900 mt-8">
                                <span className="text-emerald-500">✔</span> Batch price secured before database persistence.
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 2: Chain-Linking */}
                <section>
                    <div className="flex flex-col items-center text-center mb-16">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-600/10 flex items-center justify-center border border-emerald-600/10 mb-6">
                            <Activity size={24} className="text-emerald-600" />
                        </div>
                        <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-4">Sequential Chain-Linking</h2>
                        <p className="text-slate-500 font-bold text-sm max-w-xl">
                            Each new batch signature incorporates the HMAC signature of the preceding batch, forming an unalterable chain of history.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                        <div className="absolute top-1/2 left-0 w-full h-px bg-slate-200 hidden lg:block -z-10" />
                        
                        {[1, 2, 3].map((num) => (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: num * 0.1 }}
                                key={num}
                                className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-xl shadow-slate-200/10"
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-black">
                                        #0{num}
                                    </div>
                                    <h4 className="font-black text-slate-900">Batch Document</h4>
                                </div>
                                <div className="space-y-6 pt-6 border-t border-slate-50">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Self Signature</p>
                                        <p className="text-xs font-mono text-emerald-600 truncate">7f8c0a21b3...{num}a</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Previous Parent</p>
                                        <p className="text-xs font-mono text-violet-600 truncate">
                                            {num === 1 ? '00000_ROOT_HASH' : `7f8c0a21b3...${num-1}a`}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Section 3: Tamper Policy */}
                <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    className="p-12 md:p-20 rounded-[3.5rem] bg-rose-600 text-white relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 blur-[150px] pointer-events-none" />
                    <div className="relative z-10 flex flex-col md:flex-row gap-12 items-start">
                        <div className="w-20 h-20 rounded-[2rem] bg-white/20 flex items-center justify-center border border-white/30 shrink-0">
                            <AlertTriangle size={32} className="text-white" />
                        </div>
                        <div className="space-y-8">
                            <h3 className="text-3xl font-black tracking-tight leading-tight">
                                Zero-Tolerance Tamper Protocol
                            </h3>
                            <p className="text-rose-100 font-bold text-lg max-w-2xl leading-relaxed">
                                Our platform periodically re-verifies batch signatures during read operations. If a batch hash fails to match its original HMAC-SHA256 signature, the batch is instantly locked. 
                            </p>
                            <div className="flex flex-wrap gap-4 pt-8 border-t border-white/20">
                                <div className="flex items-center gap-2 text-rose-100 text-[10px] font-black uppercase tracking-widest">
                                    <FileCheck size={16}/> Identity logged in admin trail
                                </div>
                                <div className="flex items-center gap-2 text-rose-100 text-[10px] font-black uppercase tracking-widest">
                                    <Shield size={16}/> Immediate visual warnings globally
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </LightPageLayout>
    );
};

export default SecurityModel;
