import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Sprout, Truck, Store, User, Database, Search,
    QrCode, BarChart3, MapPin, Package, Shield, ClipboardList,
    Users, Zap, Lock, TrendingUp, CheckCircle2, Globe, Award,
    Leaf, Clock, Star, ArrowRight, ChevronRight, LogIn, UserPlus,
    Layers, AlertCircle, FileText, ShoppingCart, Eye, Map,
    Navigation, Car, Route, Settings, Activity, Bell
} from 'lucide-react';
import LightPageLayout from '../../components/layout/LightPageLayout';
import SpotlightCard from '../../components/ui/core/SpotlightCard';

/* ─────────────────────────────────────────────
   ROLE DATA
───────────────────────────────────────────── */
const ROLES = {
    farmer: {
        title: 'Farmer Portal',
        tagline: 'Register crops, manage batches, and get paid instantly through smart contracts.',
        accentColor: 'emerald',
        icon: Sprout,
        gradient: 'from-emerald-500 to-green-600',
        dashboardPath: '/farmer',
        chainPosition: 1,
        summary: `Farmers are the foundation of the Farm2Fork ecosystem. The Farmer Portal gives every grower a powerful digital workspace to register produce, create verifiable batch records on the blockchain, request logistics, and receive instant payments — all without leaving their phone.`,
        capabilities: [
            {
                icon: Sprout,
                title: 'Batch Creation',
                desc: 'Register crop batches with full metadata — quantity, variety, harvest date, certifications, and GPS-pinned farm location.',
                color: 'text-emerald-600',
                bg: 'bg-emerald-50',
                spotlight: 'rgba(16,185,129,0.08)',
            },
            {
                icon: QrCode,
                title: 'QR Code Generation',
                desc: 'Each batch gets a unique QR code linking to its complete blockchain record. Consumers scan it anywhere in the supply chain.',
                color: 'text-teal-600',
                bg: 'bg-teal-50',
                spotlight: 'rgba(20,184,166,0.08)',
            },
            {
                icon: Truck,
                title: 'Shipment Requests',
                desc: 'Raise shipment requests directly to registered transporters. Track pickup status and transit progress in real time.',
                color: 'text-blue-600',
                bg: 'bg-blue-50',
                spotlight: 'rgba(59,130,246,0.08)',
            },
            {
                icon: BarChart3,
                title: 'Analytics Dashboard',
                desc: 'View crop performance, revenue trends, and batch lifecycle data. Make data-driven decisions for the next season.',
                color: 'text-purple-600',
                bg: 'bg-purple-50',
                spotlight: 'rgba(139,92,246,0.08)',
            },
            {
                icon: MapPin,
                title: 'My Farm',
                desc: 'Maintain your farm profile — land area, certified practices, soil type, water source, and sustainability score.',
                color: 'text-amber-600',
                bg: 'bg-amber-50',
                spotlight: 'rgba(245,158,11,0.08)',
            },
            {
                icon: Zap,
                title: 'Instant Settlements',
                desc: 'Smart contracts auto-release payment to the farmer the moment a distributor verifies delivery — zero delays, zero intermediaries.',
                color: 'text-orange-600',
                bg: 'bg-orange-50',
                spotlight: 'rgba(249,115,22,0.08)',
            },
        ],
        stats: [
            { val: '5K+', label: 'Active Farmers' },
            { val: '100%', label: 'Transparent' },
            { val: '0s', label: 'Payment Delay' },
        ],
        quote: '"Finally, a platform that pays me the moment my produce is verified — no waiting, no middlemen."',
        quoteAuthor: 'Ravi Kumar, Tomato Farmer, Andhra Pradesh',
    },

    transporter: {
        title: 'Logistics Hub',
        tagline: 'Manage your fleet, assign drivers, and track every shipment live on the map.',
        accentColor: 'sky',
        icon: Truck,
        gradient: 'from-blue-500 to-cyan-600',
        dashboardPath: '/transporter',
        chainPosition: 2,
        summary: `Transporters are the critical link between farms and distribution centres. The Logistics Hub gives transport companies a command-and-control centre for their entire fleet — from accepting shipment requests to monitoring driver GPS positions in real time.`,
        capabilities: [
            {
                icon: ClipboardList,
                title: 'Shipment Requests',
                desc: 'View and accept pending shipment requests from farmers. Review batch details, pickup location, and payment terms before accepting.',
                color: 'text-blue-600',
                bg: 'bg-blue-50',
                spotlight: 'rgba(59,130,246,0.08)',
            },
            {
                icon: Car,
                title: 'Fleet Management',
                desc: 'Register and manage all vehicles in your fleet — type, capacity, registration, and real-time availability status.',
                color: 'text-sky-600',
                bg: 'bg-sky-50',
                spotlight: 'rgba(14,165,233,0.08)',
            },
            {
                icon: Users,
                title: 'Driver Dispatch',
                desc: 'Assign shipments to registered drivers. Monitor their status, contact them directly, and track completion.',
                color: 'text-indigo-600',
                bg: 'bg-indigo-50',
                spotlight: 'rgba(99,102,241,0.08)',
            },
            {
                icon: Map,
                title: 'Live Fleet Map',
                desc: 'Watch every active driver on a live map with GPS coordinates, current shipment, route, and estimated ETA.',
                color: 'text-teal-600',
                bg: 'bg-teal-50',
                spotlight: 'rgba(20,184,166,0.08)',
            },
            {
                icon: Route,
                title: 'Route Optimization',
                desc: 'OSRM-powered route suggestions to minimise fuel cost and delivery time across multiple drop points.',
                color: 'text-purple-600',
                bg: 'bg-purple-50',
                spotlight: 'rgba(139,92,246,0.08)',
            },
            {
                icon: BarChart3,
                title: 'Transport Analytics',
                desc: 'Track completed deliveries, on-time rates, revenue per route, and driver performance over time.',
                color: 'text-amber-600',
                bg: 'bg-amber-50',
                spotlight: 'rgba(245,158,11,0.08)',
            },
        ],
        stats: [
            { val: '24/7', label: 'Live Tracking' },
            { val: 'GPS', label: 'Real-time' },
            { val: '100%', label: 'Transparency' },
        ],
        quote: '"The fleet map alone saves us hours every day. We know exactly where every driver is at any moment."',
        quoteAuthor: 'Mohan Logistics, Hyderabad',
    },

    distributor: {
        title: 'Distribution Centre',
        tagline: 'Receive verified batches, run quality checks, and manage your cold-chain inventory.',
        accentColor: 'rose',
        icon: Database,
        gradient: 'from-amber-500 to-orange-500',
        dashboardPath: '/distributor',
        chainPosition: 3,
        summary: `Distributors act as the quality gateway in the supply chain. Every batch that arrives at a distribution centre is inspected, verified, and updated on the blockchain before it moves to retailers. The Distributor Dashboard makes this process fast, auditable, and transparent.`,
        capabilities: [
            {
                icon: Package,
                title: 'Incoming Batches',
                desc: 'View all inbound shipments, review farmer details, product type, and expected arrival time before physical receipt.',
                color: 'text-amber-600',
                bg: 'bg-amber-50',
                spotlight: 'rgba(245,158,11,0.08)',
            },
            {
                icon: CheckCircle2,
                title: 'Quality Verification',
                desc: 'Run structured quality checks on each batch — grade, freshness score, and compliance notes — all recorded on-chain.',
                color: 'text-green-600',
                bg: 'bg-green-50',
                spotlight: 'rgba(34,197,94,0.08)',
            },
            {
                icon: Layers,
                title: 'Smart Inventory',
                desc: 'Track stock levels, product categories, location within the warehouse, and quantity available for orders in real time.',
                color: 'text-blue-600',
                bg: 'bg-blue-50',
                spotlight: 'rgba(59,130,246,0.08)',
            },
            {
                icon: ShoppingCart,
                title: 'Purchase Orders',
                desc: 'Receive and manage purchase orders from retailers. Accept, negotiate, or reject orders and schedule outbound shipments.',
                color: 'text-purple-600',
                bg: 'bg-purple-50',
                spotlight: 'rgba(139,92,246,0.08)',
            },
            {
                icon: FileText,
                title: 'Compliance Reports',
                desc: 'Generate audit-ready quality reports for every batch processed — timestamps, inspector notes, and blockchain proof.',
                color: 'text-rose-600',
                bg: 'bg-rose-50',
                spotlight: 'rgba(244,63,94,0.08)',
            },
            {
                icon: TrendingUp,
                title: 'Inventory Analytics',
                desc: 'Monitor inventory turnover, wastage rates, and supplier reliability scores to optimise procurement decisions.',
                color: 'text-teal-600',
                bg: 'bg-teal-50',
                spotlight: 'rgba(20,184,166,0.08)',
            },
        ],
        stats: [
            { val: '0', label: 'Fraud Risk' },
            { val: 'Live', label: 'Inventory' },
            { val: '100%', label: 'Auditable' },
        ],
        quote: '"Quality checks used to take a full day with paperwork. Now it\'s 10 minutes and permanently on the blockchain."',
        quoteAuthor: 'FreshLink Distributors, Pune',
    },

    retailer: {
        title: 'Retail Dashboard',
        tagline: 'List verified products, place purchase orders, and let customers scan for authenticity.',
        accentColor: 'rose',
        icon: Store,
        gradient: 'from-orange-500 to-red-500',
        dashboardPath: '/retailer',
        chainPosition: 4,
        summary: `Retailers are the final B2B node before products reach consumers. The Retail Dashboard allows store owners and retail chains to procure from verified distributors, list products with blockchain-backed provenance, and give shoppers QR-scan confidence at the point of sale.`,
        capabilities: [
            {
                icon: ShoppingCart,
                title: 'Purchase Orders',
                desc: 'Browse distributor inventory and raise purchase orders for verified batches. Track approval and fulfilment status end-to-end.',
                color: 'text-orange-600',
                bg: 'bg-orange-50',
                spotlight: 'rgba(249,115,22,0.08)',
            },
            {
                icon: Package,
                title: 'Product Listings',
                desc: 'List received batches as retail products with pricing, stock counts, and provenance information pulled directly from the blockchain.',
                color: 'text-blue-600',
                bg: 'bg-blue-50',
                spotlight: 'rgba(59,130,246,0.08)',
            },
            {
                icon: Globe,
                title: 'Marketplace',
                desc: 'Access the Farm2Fork B2B marketplace to discover suppliers, compare prices, and lock in long-term procurement contracts.',
                color: 'text-teal-600',
                bg: 'bg-teal-50',
                spotlight: 'rgba(20,184,166,0.08)',
            },
            {
                icon: Eye,
                title: 'Consumer Preview',
                desc: 'See exactly what a consumer will see when they scan a product QR code — ensure the presented data is accurate and compelling.',
                color: 'text-purple-600',
                bg: 'bg-purple-50',
                spotlight: 'rgba(139,92,246,0.08)',
            },
            {
                icon: BarChart3,
                title: 'Sales Analytics',
                desc: 'Track revenue by product category, monitor sell-through rates, and identify your best-performing verified produce lines.',
                color: 'text-emerald-600',
                bg: 'bg-emerald-50',
                spotlight: 'rgba(16,185,129,0.08)',
            },
            {
                icon: QrCode,
                title: 'QR Trust Badge',
                desc: 'Every product on your shelf has a Farm2Fork QR that shoppers can scan to see farm origin, journey, and quality score.',
                color: 'text-amber-600',
                bg: 'bg-amber-50',
                spotlight: 'rgba(245,158,11,0.08)',
            },
        ],
        stats: [
            { val: '↑30%', label: 'Consumer Trust' },
            { val: 'Live', label: 'Stock Sync' },
            { val: 'QR', label: 'Every Product' },
        ],
        quote: '"We\'ve seen a 30% uplift in repeat buyers since adding the Farm2Fork QR badge to our fresh produce section."',
        quoteAuthor: 'GreenMart Retail Chain, Bengaluru',
    },

    admin: {
        title: 'Admin Control Panel',
        tagline: 'Govern the entire ecosystem — approve users, monitor the supply chain, and ensure platform integrity.',
        accentColor: 'violet',
        icon: User,
        gradient: 'from-slate-600 to-slate-800',
        dashboardPath: '/admin',
        chainPosition: 0,
        summary: `Platform Administrators oversee the entire Farm2Fork ecosystem. The Admin Control Panel provides a bird's-eye view of all users, batches, shipments, and system health — with full authority to approve new entity registrations, investigate anomalies, and ensure the platform's cryptographic integrity.`,
        capabilities: [
            {
                icon: CheckCircle2,
                title: 'User Approvals',
                desc: 'Review and approve or reject new Farmer, Transporter, Distributor, and Retailer registration requests with full KYC context.',
                color: 'text-emerald-600',
                bg: 'bg-emerald-50',
                spotlight: 'rgba(16,185,129,0.08)',
            },
            {
                icon: Users,
                title: 'User Management',
                desc: 'View all registered entities across roles, modify permissions, deactivate accounts, and audit login history.',
                color: 'text-blue-600',
                bg: 'bg-blue-50',
                spotlight: 'rgba(59,130,246,0.08)',
            },
            {
                icon: Activity,
                title: 'Platform Statistics',
                desc: 'Live KPIs across the ecosystem — total batches, active shipments, system integrity score, and daily transaction volume.',
                color: 'text-purple-600',
                bg: 'bg-purple-50',
                spotlight: 'rgba(139,92,246,0.08)',
            },
            {
                icon: Package,
                title: 'Batch Monitor',
                desc: 'Browse every batch on the platform with full blockchain history, integrity status, and current supply chain position.',
                color: 'text-amber-600',
                bg: 'bg-amber-50',
                spotlight: 'rgba(245,158,11,0.08)',
            },
            {
                icon: Map,
                title: 'Supply Chain Map',
                desc: 'A live geographic view of all active shipments and their routes across India — spot delays and bottlenecks instantly.',
                color: 'text-teal-600',
                bg: 'bg-teal-50',
                spotlight: 'rgba(20,184,166,0.08)',
            },
            {
                icon: Shield,
                title: 'Integrity Enforcement',
                desc: 'Cryptographic hash verification flags any tampered records instantly. Administrators receive alerts and can freeze compromised entities.',
                color: 'text-rose-600',
                bg: 'bg-rose-50',
                spotlight: 'rgba(244,63,94,0.08)',
            },
        ],
        stats: [
            { val: '100%', label: 'Integrity' },
            { val: 'Live', label: 'Monitoring' },
            { val: 'Full', label: 'Control' },
        ],
        quote: '"One dashboard to govern the entire agricultural supply chain — from seed registration to consumer QR scan."',
        quoteAuthor: 'Farm2Fork Platform Team',
    },

    consumer: {
        title: 'Consumer Traceability',
        tagline: 'Scan any QR code and instantly trace your food from the exact farm that grew it.',
        accentColor: 'emerald',
        icon: Search,
        gradient: 'from-teal-500 to-emerald-600',
        dashboardPath: '/trace',
        chainPosition: 5,
        summary: `Consumers are the reason Farm2Fork exists. With a simple QR scan, anyone can trace exactly where their food came from, who grew it, how it was transported, where it was stored, and what quality checks it passed — all cryptographically verified and tamper-proof.`,
        capabilities: [
            {
                icon: QrCode,
                title: 'QR Code Scanner',
                desc: 'Point your camera at any Farm2Fork QR code on a product to instantly pull up its complete, verified supply chain journey.',
                color: 'text-emerald-600',
                bg: 'bg-emerald-50',
                spotlight: 'rgba(16,185,129,0.08)',
            },
            {
                icon: MapPin,
                title: 'Farm Discovery',
                desc: 'See the exact GPS location of the farm that grew your food, explore the farmer\'s profile, and learn about their practices.',
                color: 'text-teal-600',
                bg: 'bg-teal-50',
                spotlight: 'rgba(20,184,166,0.08)',
            },
            {
                icon: Clock,
                title: 'Full Journey Timeline',
                desc: 'Step-by-step timeline from harvest to shelf — every handoff, quality check, and location update, timestamped and verified.',
                color: 'text-blue-600',
                bg: 'bg-blue-50',
                spotlight: 'rgba(59,130,246,0.08)',
            },
            {
                icon: Star,
                title: 'Favourites',
                desc: 'Save products and farms you trust. Get notified when your favourite seasonal produce arrives at a retailer near you.',
                color: 'text-amber-600',
                bg: 'bg-amber-50',
                spotlight: 'rgba(245,158,11,0.08)',
            },
            {
                icon: Bell,
                title: 'Quality Alerts',
                desc: 'Receive push alerts if any product you\'ve scanned is flagged for a quality recall or integrity anomaly by the platform.',
                color: 'text-rose-600',
                bg: 'bg-rose-50',
                spotlight: 'rgba(244,63,94,0.08)',
            },
            {
                icon: FileText,
                title: 'Scan History',
                desc: 'Browse every product you\'ve scanned in the past. Build a personal log of verified food for dietary and health tracking.',
                color: 'text-purple-600',
                bg: 'bg-purple-50',
                spotlight: 'rgba(139,92,246,0.08)',
            },
        ],
        stats: [
            { val: '100%', label: 'Verified' },
            { val: '< 2s', label: 'Scan Speed' },
            { val: 'Zero', label: 'Fraud' },
        ],
        quote: '"I finally know my spinach didn\'t sit in a warehouse for 3 weeks. The scan showed it was harvested 2 days ago."',
        quoteAuthor: 'Priya S., Consumer, Mumbai',
    },
};

/* Chain order for the "Your place in the chain" section */
const CHAIN = [
    { key: 'farmer',      label: 'Farmer',      icon: Sprout   },
    { key: 'transporter', label: 'Logistics',   icon: Truck    },
    { key: 'distributor', label: 'Distributor', icon: Database },
    { key: 'retailer',    label: 'Retailer',    icon: Store    },
    { key: 'consumer',    label: 'Consumer',    icon: Search   },
];

/* ─────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────── */
const RoleOverview = () => {
    const { role } = useParams();
    const navigate = useNavigate();

    const data = ROLES[role];

    // Unknown role → redirect home
    React.useEffect(() => {
        if (!data) navigate('/');
    }, [data, navigate]);

    if (!data) return null;

    const HeroIcon = data.icon;

    return (
        <LightPageLayout
            title={data.title}
            subtitle={data.tagline}
            accentColor={data.accentColor}
        >
            {/* ── HERO ICON BADGE ── */}
            <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                className="flex justify-center -mt-4 mb-10"
            >
                <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-3xl bg-gradient-to-br ${data.gradient} flex items-center justify-center shadow-2xl`}>
                    <HeroIcon size={28} className="text-white md:hidden" />
                    <HeroIcon size={36} className="text-white hidden md:block" />
                </div>
            </motion.div>

            {/* ── STATS ROW ── */}
            <div className="grid grid-cols-3 gap-3 mb-12 md:mb-20">
                {data.stats.map((s, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * i + 0.3 }}
                        className="p-4 md:p-8 rounded-2xl md:rounded-3xl bg-slate-50 border border-slate-100 text-center"
                    >
                        <p className="text-2xl md:text-4xl font-black text-slate-900 mb-0.5 leading-none">{s.val}</p>
                        <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">{s.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* ── SUMMARY ── */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-20"
            >
                <div className="flex items-center gap-4 mb-8">
                    <div className="h-px bg-slate-200 flex-1" />
                    <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.25em]">Overview</h2>
                    <div className="h-px bg-slate-200 flex-1" />
                </div>
                <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto text-center font-medium">
                    {data.summary}
                </p>
            </motion.section>

            {/* ── CAPABILITIES GRID ── */}
            <section className="mb-20">
                <div className="flex items-center gap-4 mb-12">
                    <div className="h-px bg-slate-200 flex-1" />
                    <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.25em]">Key Capabilities</h2>
                    <div className="h-px bg-slate-200 flex-1" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {data.capabilities.map((cap, i) => {
                        const Icon = cap.icon;
                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-40px' }}
                                transition={{ delay: i * 0.07 }}
                            >
                                <SpotlightCard
                                    spotlightColor={cap.spotlight}
                                    className="h-full"
                                >
                                    <div className="flex flex-col h-full">
                                        <div className={`w-11 h-11 rounded-2xl ${cap.bg} flex items-center justify-center ${cap.color} mb-5 shrink-0`}>
                                            <Icon size={22} />
                                        </div>
                                        <h3 className="font-black text-slate-900 text-lg mb-2 tracking-tight">{cap.title}</h3>
                                        <p className="text-slate-500 text-sm leading-relaxed flex-1">{cap.desc}</p>
                                    </div>
                                </SpotlightCard>
                            </motion.div>
                        );
                    })}
                </div>
            </section>

            {/* ── SUPPLY CHAIN POSITION ── */}
            {data.chainPosition !== 0 && (
                <section className="mb-20">
                    <div className="flex items-center gap-4 mb-12">
                        <div className="h-px bg-slate-200 flex-1" />
                        <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.25em]">Your Place in the Chain</h2>
                        <div className="h-px bg-slate-200 flex-1" />
                    </div>

                    {/* Horizontally scrollable on mobile, centered on desktop */}
                    <div className="overflow-x-auto md:overflow-visible -mx-4 px-4 md:mx-0 md:px-0">
                        <div className="flex items-center gap-2 md:gap-3 md:justify-center w-max md:w-auto pb-2 md:pb-0">
                            {CHAIN.map((node, i) => {
                                const NodeIcon = node.icon;
                                const isActive = node.key === role;
                                const isPast = CHAIN.findIndex(n => n.key === role) > i;
                                return (
                                    <React.Fragment key={node.key}>
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.85 }}
                                            whileInView={{ opacity: 1, scale: 1 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: i * 0.08 }}
                                            className={`flex flex-col items-center gap-1.5 shrink-0 ${isActive ? 'scale-110' : ''}`}
                                        >
                                            <div className={`
                                                w-11 h-11 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center
                                                transition-all duration-300
                                                ${isActive
                                                    ? `bg-gradient-to-br ${data.gradient} text-white shadow-lg`
                                                    : isPast
                                                        ? 'bg-slate-100 text-slate-400'
                                                        : 'bg-white border-2 border-slate-200 text-slate-300'}
                                            `}>
                                                <NodeIcon size={isActive ? 20 : 16} />
                                            </div>
                                            <span className={`text-[9px] md:text-[10px] font-black uppercase tracking-wider
                                                ${isActive ? 'text-slate-900' : 'text-slate-400'}`}>
                                                {node.label}
                                            </span>
                                            {isActive && (
                                                <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest -mt-0.5">
                                                    You
                                                </span>
                                            )}
                                        </motion.div>
                                        {i < CHAIN.length - 1 && (
                                            <ArrowRight
                                                size={14}
                                                className={`shrink-0 mb-5 ${isPast || isActive ? 'text-slate-400' : 'text-slate-200'}`}
                                            />
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}

            {/* ── QUOTE CALLOUT ── */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-20"
            >
                <div className={`bg-gradient-to-br ${data.gradient} rounded-3xl md:rounded-[2.5rem] p-8 md:p-16 text-white text-center relative overflow-hidden`}>
                    <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 blur-2xl pointer-events-none" />
                    <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-black/10 blur-2xl pointer-events-none" />
                    <p className="text-2xl md:text-3xl font-black leading-snug mb-4 relative z-10">
                        {data.quote}
                    </p>
                    <p className="text-white/70 text-sm font-semibold relative z-10">— {data.quoteAuthor}</p>
                </div>
            </motion.section>

            {/* ── CTA ── */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center"
            >
                <div className="flex items-center gap-4 mb-10">
                    <div className="h-px bg-slate-200 flex-1" />
                    <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.25em]">Get Started</h2>
                    <div className="h-px bg-slate-200 flex-1" />
                </div>

                <h3 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-4">
                    Ready to join as a {data.title.split(' ')[0]}?
                </h3>
                <p className="text-slate-500 text-base md:text-lg mb-10 max-w-xl mx-auto">
                    Log in to your existing account or create a new one to access the {data.title}.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link to="/login" className="w-full sm:w-auto">
                        <motion.button
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.97 }}
                            className="w-full inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-slate-900 text-white font-black text-sm rounded-2xl shadow-xl shadow-slate-900/10 hover:shadow-2xl hover:bg-slate-800 transition-all"
                        >
                            <LogIn size={18} />
                            Log In to Dashboard
                        </motion.button>
                    </Link>
                    <Link to="/signup" className="w-full sm:w-auto">
                        <motion.button
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.97 }}
                            className={`w-full inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-gradient-to-r ${data.gradient} text-white font-black text-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all`}
                        >
                            <UserPlus size={18} />
                            Create Account
                        </motion.button>
                    </Link>
                </div>

                <p className="mt-8 text-slate-400 text-sm">
                    Want to explore another role?{' '}
                    <Link to="/" className="text-slate-600 font-bold hover:text-slate-900 underline underline-offset-2 transition-colors">
                        Back to home
                    </Link>
                </p>
            </motion.section>
        </LightPageLayout>
    );
};

export default RoleOverview;
