import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ShieldCheck, Activity, ArrowUpRight } from 'lucide-react';

const HeroVisual = ({ accentColor = "emerald" }) => {
    const accentHex = {
        emerald: '#10b981',
        violet: '#8b5cf6',
        sky: '#0ea5e9',
        rose: '#f43f5e'
    };

    return (
        <div className="relative w-full h-full min-h-[300px] flex items-center justify-center">
            {/* Background floating element */}
            <motion.div 
                animate={{ 
                    y: [0, -20, 0],
                    rotate: [0, 5, 0]
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-gradient-to-tr from-slate-100 to-white rounded-[3rem] border border-slate-200 shadow-2xl -z-10"
            />

            <div className="relative w-full max-w-[400px] space-y-4 p-4">
                {/* Status Card 1 */}
                <motion.div 
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white/80 backdrop-blur-xl border border-white p-6 rounded-3xl shadow-xl shadow-slate-200/40 flex items-center gap-4"
                >
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white" style={{ backgroundColor: accentHex[accentColor] }}>
                        <ShieldCheck size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Security Status</p>
                        <p className="text-sm font-black text-slate-900 leading-tight">Cryptographic Integrity Verified</p>
                    </div>
                    <CheckCircle2 className="ml-auto text-emerald-500" size={20} />
                </motion.div>

                {/* Status Card 2 (Chart Mockup) */}
                <motion.div 
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white/90 backdrop-blur-xl border border-slate-100 p-6 rounded-[2.5rem] shadow-2xl shadow-slate-200/40 relative overflow-hidden h-40"
                >
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Network Activity</p>
                        <Activity size={14} className="text-slate-300" />
                    </div>
                    <div className="flex items-end gap-1.5 h-16">
                        {[40, 70, 45, 90, 65, 80, 55, 100, 75, 85].map((h, i) => (
                            <motion.div 
                                key={i}
                                initial={{ height: 0 }}
                                animate={{ height: `${h}%` }}
                                transition={{ delay: 0.5 + (i * 0.05), duration: 1 }}
                                className="flex-1 rounded-t-sm"
                                style={{ backgroundColor: `${accentHex[accentColor]}20` }}
                            />
                        ))}
                    </div>
                    <p className="mt-4 text-[10px] font-bold text-slate-400">Live synchronization active</p>
                </motion.div>

                {/* Floating link bubble */}
                <motion.div 
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute -top-4 -right-4 bg-slate-900 text-white p-4 rounded-2xl shadow-xl flex items-center gap-3 cursor-pointer hover:scale-105 transition-transform"
                >
                    <div className="text-[10px] font-black uppercase tracking-tight">System<br/>Health</div>
                    <ArrowUpRight size={16} className="text-emerald-400" />
                </motion.div>
            </div>
        </div>
    );
};

export default HeroVisual;
