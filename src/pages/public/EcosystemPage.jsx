import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Sprout, Truck, Database, Store, User, Search,
    ArrowRight, CheckCircle2, Globe, Shield, Zap
} from 'lucide-react';
import LightPageLayout from '../../components/layout/LightPageLayout';
import SpotlightCard from '../../components/ui/core/SpotlightCard';

const ROLES = [
    {
        key: 'farmer',
        icon: Sprout,
        title: 'Farmer',
        subtitle: 'Crop Management',
        tagline: 'Register crops, create encrypted batches, and get paid instantly on delivery.',
        color: 'text-emerald-600',
        bg: 'bg-emerald-50',
        gradient: 'from-emerald-500 to-green-600',
        spotlight: 'rgba(16,185,129,0.09)',
        highlights: ['AES-256-GCM encrypted batch creation', 'QR code per batch', 'Shipment request to transporters', 'Revenue analytics dashboard'],
        position: 1,
    },
    {
        key: 'transporter',
        icon: Truck,
        title: 'Logistics',
        subtitle: 'Fleet & Driver Management',
        tagline: 'Manage fleets, dispatch drivers, and track every shipment live on GPS.',
        color: 'text-blue-600',
        bg: 'bg-blue-50',
        gradient: 'from-blue-500 to-cyan-600',
        spotlight: 'rgba(59,130,246,0.09)',
        highlights: ['Live GPS fleet map with OSRM ETAs', 'Driver dispatch & tracking', 'HMAC-signed handoff events', 'Route analytics'],
        position: 2,
    },
    {
        key: 'distributor',
        icon: Database,
        title: 'Distributor',
        subtitle: 'Cold-Chain Inventory',
        tagline: 'Receive verified batches, run quality checks, and manage inventory.',
        color: 'text-amber-600',
        bg: 'bg-amber-50',
        gradient: 'from-amber-500 to-orange-500',
        spotlight: 'rgba(245,158,11,0.09)',
        highlights: ['Quality verification with on-chain logging', 'Purchase order management', 'Inventory analytics', 'Compliance reports'],
        position: 3,
    },
    {
        key: 'retailer',
        icon: Store,
        title: 'Retailer',
        subtitle: 'Sales & Marketplace',
        tagline: 'List verified products, manage purchase orders, and offer QR trust badges.',
        color: 'text-orange-600',
        bg: 'bg-orange-50',
        gradient: 'from-orange-500 to-red-500',
        spotlight: 'rgba(249,115,22,0.09)',
        highlights: ['B2B marketplace procurement', 'Product listings with provenance', 'QR trust badge on every item', 'Sales analytics'],
        position: 4,
    },
    {
        key: 'admin',
        icon: User,
        title: 'Admin',
        subtitle: 'Platform Governance',
        tagline: 'Approve entities, monitor the supply chain, enforce cryptographic integrity.',
        color: 'text-slate-600',
        bg: 'bg-slate-100',
        gradient: 'from-slate-600 to-slate-800',
        spotlight: 'rgba(100,116,139,0.09)',
        highlights: ['KYC-backed user approvals', 'Platform-wide batch monitor', 'Integrity enforcement alerts', 'Supply chain map'],
        position: 0,
    },
    {
        key: 'consumer',
        icon: Search,
        title: 'Consumer',
        subtitle: 'Product Traceability',
        tagline: 'Scan any QR and trace your food from the exact farm that grew it.',
        color: 'text-teal-600',
        bg: 'bg-teal-50',
        gradient: 'from-teal-500 to-emerald-600',
        spotlight: 'rgba(20,184,166,0.09)',
        highlights: ['QR scan → full journey in < 2s', 'Farm GPS & profile', 'Quality score & supply chain timeline', 'Scan history & alerts'],
        position: 5,
    },
];

const CHAIN = [
    { label: 'Farmer',      icon: Sprout,   key: 'farmer' },
    { label: 'Transporter', icon: Truck,    key: 'transporter' },
    { label: 'Distributor', icon: Database, key: 'distributor' },
    { label: 'Retailer',    icon: Store,    key: 'retailer' },
    { label: 'Consumer',    icon: Search,   key: 'consumer' },
];

const EcosystemPage = () => {
    return (
        <LightPageLayout
            title="The Ecosystem"
            subtitle="Farm2Fork connects six distinct stakeholders in a single, cryptographically-secured supply chain platform."
            accentColor="emerald"
        >
            {/* Chain visualization */}
            <section className="mb-20">
                <div className="flex items-center gap-4 mb-10">
                    <div className="h-px bg-slate-200 flex-1" />
                    <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.25em]">Supply Chain Flow</h2>
                    <div className="h-px bg-slate-200 flex-1" />
                </div>

                <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
                    <div className="flex items-center gap-3 md:justify-center w-max md:w-auto pb-2 md:pb-0">
                        {CHAIN.map((node, i) => {
                            const Icon = node.icon;
                            const role = ROLES.find(r => r.key === node.key);
                            return (
                                <React.Fragment key={node.key}>
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.85 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1 }}
                                        className="flex flex-col items-center gap-2 shrink-0"
                                    >
                                        <Link to={`/roles/${node.key}`}>
                                            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${role.gradient} flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform`}>
                                                <Icon size={22} />
                                            </div>
                                        </Link>
                                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-600">{node.label}</span>
                                    </motion.div>
                                    {i < CHAIN.length - 1 && (
                                        <motion.div
                                            initial={{ opacity: 0, scaleX: 0 }}
                                            whileInView={{ opacity: 1, scaleX: 1 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: i * 0.1 + 0.15 }}
                                            className="flex items-center gap-1 mb-5 shrink-0"
                                        >
                                            <div className="w-6 h-px bg-slate-300" />
                                            <ArrowRight size={12} className="text-slate-300" />
                                        </motion.div>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </div>
                </div>

                <p className="text-center text-slate-400 text-sm mt-6 font-medium">
                    Every hand-off is HMAC-SHA256 signed and chain-linked — no silent tampering possible.
                </p>
            </section>

            {/* Role cards grid */}
            <section className="mb-20">
                <div className="flex items-center gap-4 mb-12">
                    <div className="h-px bg-slate-200 flex-1" />
                    <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.25em]">All Six Roles</h2>
                    <div className="h-px bg-slate-200 flex-1" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {ROLES.map((role, i) => {
                        const Icon = role.icon;
                        return (
                            <motion.div
                                key={role.key}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-40px' }}
                                transition={{ delay: i * 0.07 }}
                            >
                                <SpotlightCard spotlightColor={role.spotlight} className="h-full group">
                                    <div className="flex flex-col h-full">
                                        {/* Header */}
                                        <div className="flex items-start justify-between mb-5">
                                            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${role.gradient} flex items-center justify-center text-white shadow-md`}>
                                                <Icon size={22} />
                                            </div>
                                            <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${role.bg} ${role.color}`}>
                                                Role {role.position || 'Admin'}
                                            </span>
                                        </div>

                                        <h3 className="font-black text-slate-900 text-xl mb-1 tracking-tight">{role.title}</h3>
                                        <p className={`text-xs font-black uppercase tracking-widest mb-3 ${role.color}`}>{role.subtitle}</p>
                                        <p className="text-slate-500 text-sm leading-relaxed mb-5 flex-1">{role.tagline}</p>

                                        {/* Highlights */}
                                        <ul className="space-y-2 mb-6">
                                            {role.highlights.map((h, hi) => (
                                                <li key={hi} className="flex items-start gap-2.5 text-sm text-slate-600">
                                                    <CheckCircle2 size={14} className={`shrink-0 mt-0.5 ${role.color}`} />
                                                    {h}
                                                </li>
                                            ))}
                                        </ul>

                                        {/* Link */}
                                        <Link to={`/roles/${role.key}`}>
                                            <motion.div
                                                whileHover={{ x: 4 }}
                                                className={`inline-flex items-center gap-2 font-black text-sm ${role.color}`}
                                            >
                                                Explore {role.title} <ArrowRight size={14} />
                                            </motion.div>
                                        </Link>
                                    </div>
                                </SpotlightCard>
                            </motion.div>
                        );
                    })}
                </div>
            </section>

            {/* Platform stats */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-600 p-8 md:p-14 text-white relative overflow-hidden text-center"
            >
                <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />
                <p className="text-xs font-black uppercase tracking-widest text-emerald-200 mb-4">One Integrated Platform</p>
                <h2 className="text-2xl md:text-4xl font-black tracking-tight mb-8 max-w-2xl mx-auto">
                    6 roles. 1 cryptographic trust layer. Zero middlemen.
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-xl mx-auto mb-8">
                    {[
                        { val: '6', label: 'Stakeholder Roles' },
                        { val: '100%', label: 'Verifiable' },
                        { val: '0', label: 'Trusted Intermediaries' },
                    ].map((s, i) => (
                        <div key={i} className="p-4 rounded-2xl bg-white/10 border border-white/20">
                            <p className="text-2xl font-black mb-1">{s.val}</p>
                            <p className="text-[9px] font-black uppercase tracking-widest text-emerald-200">{s.label}</p>
                        </div>
                    ))}
                </div>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link to="/signup">
                        <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-emerald-700 font-black text-sm rounded-xl hover:bg-emerald-50 transition-all">
                            Join the Ecosystem
                        </motion.button>
                    </Link>
                    <Link to="/login">
                        <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white/10 text-white border border-white/20 font-black text-sm rounded-xl hover:bg-white/20 transition-all">
                            Log In
                        </motion.button>
                    </Link>
                </div>
            </motion.section>
        </LightPageLayout>
    );
};

export default EcosystemPage;
