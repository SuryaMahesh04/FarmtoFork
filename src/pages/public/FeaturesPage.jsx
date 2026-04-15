import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Lock, Shield, QrCode, Map, BarChart3, Zap, Clock,
    Users, Package, TrendingUp, ChevronDown, Eye, FileText,
    Fingerprint, Key, Activity, Globe, CheckCircle2, ArrowRight
} from 'lucide-react';
import LightPageLayout from '../../components/layout/LightPageLayout';
import SpotlightCard from '../../components/ui/core/SpotlightCard';

const FEATURES = [
    {
        category: 'Security & Integrity',
        color: 'violet',
        accent: 'from-violet-500 to-purple-600',
        spotlight: 'rgba(139,92,246,0.09)',
        bg: 'bg-violet-50',
        textColor: 'text-violet-600',
        items: [
            {
                icon: Lock,
                title: 'AES-256-GCM Field Encryption',
                desc: 'Sensitive fields — batch price, GPS coordinates, quantity — are encrypted at the application layer before DB write. Even a compromised database instance reveals nothing.',
                badge: 'Core Security',
            },
            {
                icon: Fingerprint,
                title: 'HMAC-SHA256 Signature Chain',
                desc: "Every batch record is signed with HMAC-SHA256. Each signature incorporates the previous batch's signature — creating a sequential chain that makes any past record tamper-evident.",
                badge: 'Integrity Engine',
            },
            {
                icon: Key,
                title: '128-bit Random IV Per Field',
                desc: 'A unique initialization vector is generated for every single encrypted field write. Identical values stored at different times produce different ciphertext — preventing pattern analysis.',
                badge: 'Cryptography',
            },
            {
                icon: Activity,
                title: 'Zero-Tolerance Tamper Protocol',
                desc: 'Batch signatures are re-verified on every server read. A single hash mismatch instantly locks the batch and triggers admin alerts — no silent corruption possible.',
                badge: 'Compliance',
            },
        ]
    },
    {
        category: 'Traceability & Visibility',
        color: 'emerald',
        accent: 'from-emerald-500 to-teal-600',
        spotlight: 'rgba(16,185,129,0.09)',
        bg: 'bg-emerald-50',
        textColor: 'text-emerald-600',
        items: [
            {
                icon: QrCode,
                title: 'Product QR Traceability',
                desc: 'Every batch gets a unique QR code. Consumers scan it to see the full journey: farm origin, transit route, quality checks, and cryptographic proof of authenticity — all in under 2 seconds.',
                badge: 'Consumer Feature',
            },
            {
                icon: Map,
                title: 'Live GPS Fleet Map',
                desc: "Transporters manage a live map showing every active driver's GPS position, current shipment, remaining route, and OSRM-calculated ETA. Updated in real time.",
                badge: 'Logistics',
            },
            {
                icon: Package,
                title: 'End-to-End Batch Lifecycle',
                desc: 'From the moment a farmer creates a harvest batch to the moment a consumer scans it on the shelf — every state change, handoff, and quality check is recorded and auditable.',
                badge: 'Supply Chain',
            },
            {
                icon: Eye,
                title: 'Consumer-Facing Proof',
                desc: 'The consumer trace page shows a full chronological timeline with farm photos, GPS origin maps, distributor quality scores, and the retail listing — all verifiable instantly.',
                badge: 'Transparency',
            },
        ]
    },
    {
        category: 'Operations & Analytics',
        color: 'sky',
        accent: 'from-sky-500 to-blue-600',
        spotlight: 'rgba(14,165,233,0.09)',
        bg: 'bg-sky-50',
        textColor: 'text-sky-600',
        items: [
            {
                icon: BarChart3,
                title: 'Role-Based Dashboards',
                desc: 'Every stakeholder — Farmer, Transporter, Distributor, Retailer, Admin, Consumer — gets a tailored dashboard with metrics, alerts, and actions specific to their role.',
                badge: 'Platform',
            },
            {
                icon: TrendingUp,
                title: 'Market & Revenue Analytics',
                desc: 'Farmers track revenue by batch and crop type. Retailers monitor sell-through rates. Distributors measure inventory turnover. Admins see platform-wide transaction volume.',
                badge: 'Analytics',
            },
            {
                icon: Clock,
                title: '24/7 Real-Time Monitoring',
                desc: 'All shipment positions, batch states, and quality verdicts update in real time. No stale dashboards — every stakeholder sees current ground truth.',
                badge: 'Monitoring',
            },
            {
                icon: Users,
                title: 'Admin Governance Engine',
                desc: 'Administrators approve or reject entity registrations with full KYC context, manage permissions, audit login history, and maintain a live map of all supply chain activity.',
                badge: 'Governance',
            },
        ]
    },
];

const STATS = [
    { val: '6',       label: 'Stakeholder Roles' },
    { val: 'AES-256', label: 'Encryption Standard' },
    { val: '< 2s',    label: 'QR Trace Speed' },
    { val: '100%',    label: 'Field Coverage' },
];

const FeaturesPage = () => {
    const [openCategory, setOpenCategory] = useState(0);

    return (
        <LightPageLayout
            title="Platform Features"
            subtitle="A complete cryptographically-secured supply chain platform built for every stakeholder — from farm to fork."
            accentColor="emerald"
        >
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
                {STATS.map((s, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="p-6 rounded-2xl bg-slate-50 border border-slate-100 text-center"
                    >
                        <p className="text-2xl md:text-3xl font-black text-slate-900 mb-1">{s.val}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* Feature Categories */}
            <div className="space-y-4 mb-16">
                {FEATURES.map((cat, ci) => (
                    <motion.div
                        key={ci}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: ci * 0.1 }}
                        className="rounded-3xl border border-slate-200/80 overflow-hidden"
                        style={{ background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(12px)' }}
                    >
                        {/* Category header */}
                        <button
                            onClick={() => setOpenCategory(openCategory === ci ? -1 : ci)}
                            className="w-full flex items-center justify-between p-6 md:p-8 text-left group"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cat.accent} flex items-center justify-center shadow-md`}>
                                    <Shield size={18} className="text-white" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-black text-slate-900 tracking-tight">{cat.category}</h2>
                                    <p className="text-xs text-slate-400 font-semibold">{cat.items.length} features</p>
                                </div>
                            </div>
                            <motion.div animate={{ rotate: openCategory === ci ? 180 : 0 }} transition={{ duration: 0.25 }}>
                                <ChevronDown size={20} className="text-slate-400" />
                            </motion.div>
                        </button>

                        <AnimatePresence>
                            {openCategory === ci && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="overflow-hidden"
                                >
                                    <div className="px-6 md:px-8 pb-8 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 pt-6">
                                        {cat.items.map((feat, fi) => {
                                            const Icon = feat.icon;
                                            return (
                                                <SpotlightCard key={fi} spotlightColor={cat.spotlight} className="h-full">
                                                    <div className="flex flex-col h-full">
                                                        <div className="flex items-start justify-between mb-4">
                                                            <div className={`w-10 h-10 rounded-xl ${cat.bg} ${cat.textColor} flex items-center justify-center shrink-0`}>
                                                                <Icon size={20} />
                                                            </div>
                                                            <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${cat.bg} ${cat.textColor}`}>
                                                                {feat.badge}
                                                            </span>
                                                        </div>
                                                        <h3 className="font-black text-slate-900 text-base mb-2 tracking-tight">{feat.title}</h3>
                                                        <p className="text-slate-500 text-sm leading-relaxed flex-1">{feat.desc}</p>
                                                    </div>
                                                </SpotlightCard>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}
            </div>

            {/* Security deep-dive callout */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="rounded-3xl bg-gradient-to-br from-violet-600 to-purple-700 p-8 md:p-14 text-white relative overflow-hidden mb-16"
            >
                <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/10 blur-2xl" />
                <div className="relative z-10">
                    <p className="text-xs font-black uppercase tracking-widest text-violet-200 mb-4">Security Deep Dive</p>
                    <h2 className="text-2xl md:text-4xl font-black tracking-tight mb-6 max-w-2xl leading-tight">
                        Field-level AES-256-GCM encryption means the database is treated as an untrusted medium.
                    </h2>
                    <p className="text-violet-200 text-base max-w-2xl leading-relaxed mb-8">
                        We don't just encrypt disks. Every sensitive field is encrypted individually at the application layer with a unique IV. Even if the entire database were exported, price, coordinates and quantity remain ciphertext.
                    </p>
                    <Link to="/security">
                        <motion.button
                            whileHover={{ x: 4 }}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-violet-700 font-black text-sm rounded-xl hover:bg-violet-50 transition-colors"
                        >
                            Read the Security Model <ArrowRight size={16} />
                        </motion.button>
                    </Link>
                </div>
            </motion.div>

            {/* CTA */}
            <div className="text-center">
                <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-4">Ready to get started?</h3>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link to="/signup">
                        <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-emerald-600 text-white font-black text-sm rounded-2xl shadow-lg hover:bg-emerald-700 transition-all">
                            Create Account
                        </motion.button>
                    </Link>
                    <Link to="/documentation">
                        <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white border border-slate-200 text-slate-800 font-black text-sm rounded-2xl hover:bg-slate-50 transition-all">
                            Read Docs <ArrowRight size={16} />
                        </motion.button>
                    </Link>
                </div>
            </div>
        </LightPageLayout>
    );
};

export default FeaturesPage;
