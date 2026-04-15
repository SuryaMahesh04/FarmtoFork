import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Sprout, Truck, Store, User, Database, Search, Shield, Leaf,
    BarChart3, Globe, Award, ArrowRight, CheckCircle2, Menu, X,
    Zap, Lock, Clock, TrendingUp, Users, Package, Star, ChevronDown,
    Twitter, Linkedin, Instagram, ChevronRight, Sparkles, MapPin, QrCode
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import Button from '../components/ui/Button';
import heroImage from '../assets/image.png';
import logo from '../assets/logo2.png';
import useMediaQuery from '../utils/useMediaQuery';
import { authHelpers } from '../utils/api';
import LandingAssistant from '../components/ui/LandingAssistant';

/* ─────────────────────────────────────────────
   SHARED DATA
───────────────────────────────────────────── */
const roles = [
    { to: '/roles/farmer',      icon: Sprout,   label: 'Farmer',      desc: 'Crop Management',  gradient: 'from-emerald-500 to-green-600',  bg: 'bg-emerald-500' },
    { to: '/roles/transporter', icon: Truck,    label: 'Logistics',   desc: 'Fleet Tracking',   gradient: 'from-blue-500 to-cyan-600',       bg: 'bg-blue-500' },
    { to: '/roles/distributor', icon: Database, label: 'Distributor', desc: 'Smart Inventory',  gradient: 'from-amber-500 to-orange-500',    bg: 'bg-amber-500' },
    { to: '/roles/retailer',    icon: Store,    label: 'Retailer',    desc: 'Sales Analytics',  gradient: 'from-orange-500 to-red-500',      bg: 'bg-orange-500' },
    { to: '/roles/admin',       icon: User,     label: 'Admin',       desc: 'Governance',       gradient: 'from-slate-600 to-slate-800',     bg: 'bg-slate-700' },
    { to: '/roles/consumer',    icon: Search,   label: 'Consumer',    desc: 'Verify Origin',    gradient: 'from-teal-500 to-emerald-600',    bg: 'bg-teal-500' },
];

const howItWorks = [
    { step: '01', icon: Sprout,   title: 'Farmer Registers',        desc: 'Farmers create batches — AES-256-GCM encrypts price and origin fields before storing in the database.' },
    { step: '02', icon: Truck,    title: 'Transportation Tracked',   desc: 'Real-time GPS tracking ensures full transit visibility, with each handoff HMAC-signed and chain-linked.' },
    { step: '03', icon: Database, title: 'Quality Verification',     desc: 'Distributors verify quality and update batch status; signatures are verified server-side on every read.' },
    { step: '04', icon: QrCode,   title: 'Consumer Scans',           desc: 'End users scan QR codes to see the complete product journey, backed by cryptographic proof of integrity.' },
];

const benefits = [
    { icon: Zap,        title: 'Instant Payments',   desc: 'Auto-release payments on delivery verification',  color: 'text-amber-600',  bg: 'bg-amber-50' },
    { icon: Lock,       title: 'Tamper-Proof',        desc: 'HMAC-SHA256 + AES-256-GCM prevents all fraud',   color: 'text-blue-600',   bg: 'bg-blue-50' },
    { icon: Clock,      title: 'Real-Time GPS',       desc: 'Monitor every shipment 24/7 with live updates',   color: 'text-green-600',  bg: 'bg-green-50' },
    { icon: TrendingUp, title: 'Market Analytics',    desc: 'Data insights help optimise pricing & harvest',   color: 'text-purple-600', bg: 'bg-purple-50' },
    { icon: Users,      title: 'Trusted Network',     desc: 'Verified buyers, sellers & logistics partners',   color: 'text-teal-600',   bg: 'bg-teal-50' },
    { icon: Package,    title: 'Full Traceability',   desc: 'Track every product from seed to shelf',          color: 'text-orange-600', bg: 'bg-orange-50' },
];

const techStack = [
    { name: 'AES-256-GCM',        desc: 'Field-Level Encryption' },
    { name: 'HMAC-SHA256',        desc: 'Signature Integrity' },
    { name: 'Chain-Linking',      desc: 'Sequential Signing' },
    { name: 'MongoDB',            desc: 'Encrypted at Rest' },
    { name: 'AES-256-GCM',        desc: 'Field-Level Encryption' },
    { name: 'HMAC-SHA256',        desc: 'Signature Integrity' },
    { name: 'Chain-Linking',      desc: 'Sequential Signing' },
    { name: 'MongoDB',            desc: 'Encrypted at Rest' },
];

const faqs = [
    { q: 'What is Farm2Fork?', a: 'Farm2Fork is a cryptographically secured agriculture supply chain platform that enables complete transparency from farm to consumer. Every batch is AES-256-GCM encrypted and HMAC-SHA256 signed for tamper-proof integrity.', icon: '🌾' },
    { q: 'How does Farm2Fork ensure data integrity?', a: 'We use AES-256-GCM field-level encryption and HMAC-SHA256 digital signatures. Each batch record is chain-linked to the previous one — if any record is altered, the signature mismatch is detected instantly.', icon: '🔒' },
    { q: 'Is it free to use?', a: 'We offer different plans for different stakeholders. Farmers can register for free, while enterprise features require a subscription.', icon: '💰' },
    { q: 'How do I verify a product?', a: 'Simply scan the QR code on the product packaging using your smartphone. You will instantly see the complete journey from farm to store, along with its cryptographic verification status.', icon: '📱' },
    { q: 'What products can be tracked?', a: 'Farm2Fork supports tracking of all agricultural products including grains, vegetables, fruits, dairy, and organic produce.', icon: '🥬' },
    { q: 'How secure is the platform?', a: 'We use AES-256-GCM field-level encryption and HMAC-SHA256 signing. Sensitive fields (price, coordinates, quantity) are encrypted at the application layer before they ever reach the database — even a compromised DB instance cannot expose this data.', icon: '🛡️' },
];

/* ─────────────────────────────────────────────
   MOBILE LANDING — complete mobile-app experience
───────────────────────────────────────────── */
const MobileLanding = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [openFaq, setOpenFaq] = useState(null);
    const [faqSearch, setFaqSearch] = useState('');
    const [footerSection, setFooterSection] = useState(null);
    const marqueeRef = useRef(null);

    const filteredFaqs = faqs.filter(f =>
        f.q.toLowerCase().includes(faqSearch.toLowerCase()) ||
        f.a.toLowerCase().includes(faqSearch.toLowerCase())
    );

    return (
        <div className="relative bg-white min-h-screen overflow-x-hidden font-sans text-slate-800 selection:bg-emerald-100">

            {/* ── TOP MINIMAL NAV BAR ── */}
            <header className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-4 py-3 bg-white/80 backdrop-blur-xl border-b border-slate-100/80">
                <Link to="/" className="flex items-center gap-2">
                    <img src={logo} alt="Farm2Fork" className="h-9 w-auto object-contain" />
                    <span className="font-display font-bold text-base text-slate-900">
                        Farm<span className="text-emerald-600">2</span>Fork
                    </span>
                </Link>
                <button
                    id="mobile-menu-btn"
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 active:scale-95 transition-transform"
                >
                    {menuOpen ? <X size={18} /> : <Menu size={18} />}
                </button>
            </header>

            {/* ── SLIDE-DOWN MENU OVERLAY ── */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                        className="fixed top-[60px] inset-x-0 z-40 bg-white/95 backdrop-blur-xl border-b border-slate-100 shadow-xl px-5 py-4 flex flex-col gap-3"
                    >
                        {[
                            { label: 'Features', href: '#features' },
                            { label: 'How It Works', href: '#how-it-works' },
                            { label: 'Roles', href: '#roles' },
                            { label: 'FAQ', href: '#faq' },
                        ].map(item => (
                            <a
                                key={item.label}
                                href={item.href}
                                onClick={() => setMenuOpen(false)}
                                className="flex items-center justify-between py-3 text-base font-semibold text-slate-700 border-b border-slate-50 active:text-emerald-600"
                            >
                                {item.label}
                                <ChevronRight size={16} className="text-slate-400" />
                            </a>
                        ))}
                        <div className="flex gap-3 mt-2">
                            <Link to="/login" className="flex-1" onClick={() => setMenuOpen(false)}>
                                <button className="w-full py-3 rounded-2xl bg-slate-900 text-white font-bold text-sm active:scale-95 transition-transform">
                                    Log In
                                </button>
                            </Link>
                            <Link to="/signup" className="flex-1" onClick={() => setMenuOpen(false)}>
                                <button className="w-full py-3 rounded-2xl border-2 border-emerald-500 text-emerald-600 font-bold text-sm active:scale-95 transition-transform">
                                    Sign Up
                                </button>
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ═══════════════════════════════════════
                HERO — full-screen, app-launch feel
            ═══════════════════════════════════════ */}
            <section
                id="hero"
                className="relative min-h-screen flex flex-col items-center justify-center px-5 pt-[72px] pb-28 overflow-hidden"
            >
                {/* Animated gradient orbs */}
                <div className="absolute top-16 left-[-60px] w-64 h-64 rounded-full bg-emerald-300/25 blur-3xl animate-pulse pointer-events-none" />
                <div className="absolute bottom-24 right-[-40px] w-56 h-56 rounded-full bg-teal-300/20 blur-3xl animate-pulse pointer-events-none" style={{ animationDelay: '1.2s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-emerald-100/40 blur-[80px] pointer-events-none" />

                {/* LIVE badge */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1, type: 'spring', stiffness: 260 }}
                    className="mb-6"
                >
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 shadow-sm">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-800">AES-256-GCM Encrypted Traceability</span>
                    </div>
                </motion.div>

                {/* Main headline */}
                <motion.div
                    className="text-center relative z-10 max-w-xs mx-auto"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.7, type: 'spring' }}
                >
                    <h1 className="font-display font-black text-[52px] leading-[1.0] tracking-tight text-slate-900 mb-3">
                        Farm{' '}
                        <span className="font-light text-slate-400">to</span>
                        {' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">
                            Fork
                        </span>
                    </h1>
                    <h2 className="font-display font-light text-2xl text-slate-600 tracking-tight mb-5">
                        Revolutionized with Trust.
                    </h2>
                    <p className="text-slate-500 text-sm leading-relaxed mb-8 font-medium">
                        The world's first decentralized agriculture ecosystem — empowering farmers and consumers with{' '}
                        <span className="text-emerald-700 font-bold bg-emerald-50 px-1 rounded">100% transparency</span>
                        {' '}and verified quality.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex gap-3 justify-center">
                        <Link to="/signup">
                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                className="px-7 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-bold text-sm rounded-2xl shadow-lg shadow-emerald-500/30 active:shadow-sm transition-all"
                            >
                                Get Started
                            </motion.button>
                        </Link>
                        <Link to="/login">
                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                className="px-7 py-3.5 bg-white text-slate-800 font-bold text-sm rounded-2xl border-2 border-slate-200 shadow-sm active:bg-slate-50 transition-all"
                            >
                                Log In
                            </motion.button>
                        </Link>
                    </div>
                </motion.div>

                {/* Stats strip */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="absolute bottom-24 inset-x-5 flex items-center justify-around bg-white/80 backdrop-blur-md border border-slate-100 rounded-2xl py-4 shadow-lg shadow-slate-100"
                >
                    {[
                        { val: '5K+', label: 'Farmers' },
                        { val: '100%', label: 'Transparent' },
                        { val: '24/7', label: 'Tracking' },
                    ].map((s, i) => (
                        <div key={i} className="text-center">
                            <p className="font-display font-black text-xl text-emerald-600 leading-none">{s.val}</p>
                            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">{s.label}</p>
                        </div>
                    ))}
                </motion.div>

                {/* Scroll indicator */}
                <motion.div
                    animate={{ y: [0, 6, 0] }}
                    transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-slate-300"
                >
                    <ChevronDown size={20} />
                </motion.div>
            </section>

            {/* ═══════════════════════════════════════
                ECOSYSTEM ROLES — horizontal swipe carousel
            ═══════════════════════════════════════ */}
            <section id="roles" className="bg-slate-50 py-10">
                <div className="px-5 mb-5">
                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-1">Ecosystem</p>
                    <h3 className="font-display font-bold text-2xl text-slate-900">Built for Everyone</h3>
                    <p className="text-slate-500 text-sm mt-1">Every stakeholder has a dedicated dashboard.</p>
                </div>

                {/* Swipeable card carousel */}
                <div
                    className="flex gap-4 overflow-x-auto px-5 pb-4 scroll-smooth"
                    style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}
                >
                    {roles.map((role, i) => {
                        const Icon = role.icon;
                        return (
                            <Link
                                key={i}
                                to={role.to}
                                className="shrink-0"
                                style={{ scrollSnapAlign: 'start' }}
                            >
                                <motion.div
                                    whileTap={{ scale: 0.97 }}
                                    className={`w-[190px] h-[220px] rounded-3xl bg-gradient-to-br ${role.gradient} p-5 flex flex-col justify-between shadow-lg shadow-${role.bg}/20`}
                                >
                                    <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                        <Icon size={24} className="text-white" />
                                    </div>
                                    <div>
                                        <p className="font-display font-bold text-xl text-white leading-tight">{role.label}</p>
                                        <p className="text-white/75 text-xs font-medium mt-0.5">{role.desc}</p>
                                        <div className="flex items-center gap-1 mt-3">
                                            <span className="text-white/90 text-xs font-bold">Explore</span>
                                            <ArrowRight size={12} className="text-white/90" />
                                        </div>
                                    </div>
                                </motion.div>
                            </Link>
                        );
                    })}
                    {/* trailing padding */}
                    <div className="shrink-0 w-1" />
                </div>

                {/* Scroll hint dots */}
                <div className="flex justify-center gap-1.5 mt-3">
                    {roles.map((_, i) => (
                        <div key={i} className={`h-1.5 rounded-full transition-all ${i === 0 ? 'w-5 bg-emerald-500' : 'w-1.5 bg-slate-300'}`} />
                    ))}
                </div>
            </section>

            {/* ═══════════════════════════════════════
                HOW IT WORKS — vertical timeline
            ═══════════════════════════════════════ */}
            <section id="how-it-works" className="bg-white py-10 px-5">
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-1">Process</p>
                <h3 className="font-display font-bold text-2xl text-slate-900 mb-8">How It Works</h3>

                <div className="relative pl-8">
                    {/* Vertical progress line */}
                    <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-gradient-to-b from-emerald-400 via-emerald-300 to-slate-200 rounded-full" />

                    <div className="flex flex-col gap-8">
                        {howItWorks.map((item, i) => {
                            const Icon = item.icon;
                            return (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -16 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true, margin: '-40px' }}
                                    transition={{ delay: i * 0.1, duration: 0.5 }}
                                    className="relative"
                                >
                                    {/* Timeline dot */}
                                    <div className="absolute -left-8 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-200 text-[10px] font-black border-2 border-white">
                                        {i + 1}
                                    </div>

                                    <div className="bg-gradient-to-br from-emerald-50 to-white rounded-2xl p-4 border border-emerald-100 shadow-sm active:scale-[0.99] transition-transform">
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center shrink-0">
                                                <Icon size={18} className="text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Step {item.step}</span>
                                                </div>
                                                <h4 className="font-bold text-base text-slate-800 leading-tight mb-1">{item.title}</h4>
                                                <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════
                WHY FARM2FORK — features
            ═══════════════════════════════════════ */}
            <section id="features" className="bg-slate-900 py-10 px-5">
                {/* Shield hero illustration */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center mb-8"
                >
                    <div className="relative">
                        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-2xl shadow-emerald-500/40">
                            <Shield size={44} className="text-white" />
                        </div>
                        {/* Glow rings */}
                        <div className="absolute inset-0 rounded-3xl bg-emerald-500/20 blur-xl -z-10 scale-125" />
                        <div className="absolute inset-0 rounded-3xl bg-emerald-500/10 blur-2xl -z-10 scale-150" />
                    </div>
                    <h3 className="font-display font-bold text-2xl text-white mt-5 mb-1 text-center">Why Farm2Fork?</h3>
                    <p className="text-slate-400 text-sm text-center max-w-[260px]">Bank-grade security meets real-world agriculture.</p>
                </motion.div>

                {/* Feature pills */}
                <div className="flex flex-col gap-3">
                    {[
                        { icon: Leaf,   title: 'Sustainable Practices', desc: 'Verified carbon footprint tracking for eco-friendly farms.',       color: 'text-emerald-400' },
                        { icon: Globe,  title: 'Global Reach',           desc: 'Connect local farmers to international markets seamlessly.',       color: 'text-blue-400' },
                        { icon: Award,  title: 'Fair Trade',             desc: 'Smart contracts ensure farmers get paid instantly and fairly.',    color: 'text-amber-400' },
                    ].map((feat, i) => {
                        const Icon = feat.icon;
                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                whileTap={{ scale: 0.98 }}
                                className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl px-4 py-4 backdrop-blur-sm active:bg-white/10 transition-colors cursor-pointer"
                            >
                                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                                    <Icon size={20} className={feat.color} />
                                </div>
                                <div>
                                    <p className="font-bold text-white text-sm">{feat.title}</p>
                                    <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">{feat.desc}</p>
                                </div>
                                <ChevronRight size={16} className="text-slate-600 ml-auto shrink-0" />
                            </motion.div>
                        );
                    })}
                </div>
            </section>

            {/* ═══════════════════════════════════════
                BENEFITS — compact 2-column grid
            ═══════════════════════════════════════ */}
            <section className="bg-white py-10 px-5">
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-1">Platform</p>
                <h3 className="font-display font-bold text-2xl text-slate-900 mb-6">Benefits</h3>

                <div className="grid grid-cols-2 gap-3">
                    {benefits.map((item, i) => {
                        const Icon = item.icon;
                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.06 }}
                                whileTap={{ scale: 0.96 }}
                                className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm active:shadow-md transition-all"
                            >
                                <div className={`w-9 h-9 rounded-xl ${item.bg} flex items-center justify-center ${item.color} mb-3`}>
                                    <Icon size={18} />
                                </div>
                                <p className="font-bold text-slate-800 text-sm leading-tight mb-1">{item.title}</p>
                                <p className="text-slate-500 text-[11px] leading-relaxed">{item.desc}</p>
                            </motion.div>
                        );
                    })}
                </div>
            </section>

            {/* ═══════════════════════════════════════
                TECH STACK — auto-scroll marquee
            ═══════════════════════════════════════ */}
            <section className="bg-slate-950 py-10">
                <div className="px-5 mb-6">
                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-1">Infrastructure</p>
                    <h3 className="font-display font-bold text-xl text-white">Cutting-Edge Technology</h3>
                </div>

                {/* Marquee strip */}
                <div className="relative overflow-hidden">
                    <motion.div
                        animate={{ x: ['0%', '-50%'] }}
                        transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
                        className="flex gap-3 w-max"
                        ref={marqueeRef}
                    >
                        {techStack.map((item, i) => (
                            <div
                                key={i}
                                className="shrink-0 flex items-center gap-3 bg-slate-800/70 border border-slate-700 rounded-2xl px-4 py-3"
                            >
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                                <div>
                                    <p className="font-bold text-white text-sm leading-none">{item.name}</p>
                                    <p className="text-slate-400 text-[10px] mt-0.5">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                    {/* Fade edges */}
                    <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-slate-950 to-transparent pointer-events-none" />
                    <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-slate-950 to-transparent pointer-events-none" />
                </div>
            </section>

            {/* ═══════════════════════════════════════
                FAQ — mobile-optimized accordion
            ═══════════════════════════════════════ */}
            <section id="faq" className="bg-white py-10 px-5">
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-1">Support</p>
                <h3 className="font-display font-bold text-2xl text-slate-900 mb-5">FAQ</h3>

                {/* Search */}
                <div className="relative mb-5">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search questions..."
                        value={faqSearch}
                        onChange={e => setFaqSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-3.5 rounded-2xl border-2 border-slate-100 bg-slate-50 focus:border-emerald-400 focus:outline-none text-sm text-slate-700 placeholder:text-slate-400 transition-all"
                    />
                </div>

                {/* FAQ items */}
                <div className="flex flex-col gap-2">
                    {filteredFaqs.length > 0 ? filteredFaqs.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: i * 0.04 }}
                            className="rounded-2xl border-2 border-slate-100 overflow-hidden"
                        >
                            <button
                                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                className="w-full flex items-center gap-3 p-4 text-left active:bg-slate-50 transition-colors"
                                style={{ minHeight: 60 }}
                            >
                                <span className="text-xl flex-shrink-0">{item.icon}</span>
                                <span className="flex-1 font-semibold text-slate-800 text-sm leading-snug">{item.q}</span>
                                <motion.div
                                    animate={{ rotate: openFaq === i ? 180 : 0 }}
                                    transition={{ duration: 0.25 }}
                                    className="shrink-0"
                                >
                                    <ChevronDown size={18} className="text-slate-400" />
                                </motion.div>
                            </button>
                            <AnimatePresence>
                                {openFaq === i && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                                        className="overflow-hidden"
                                    >
                                        <div className="px-4 pb-4 ml-8">
                                            <div className="h-px bg-slate-100 mb-3" />
                                            <p className="text-sm text-slate-600 leading-relaxed">{item.a}</p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    )) : (
                        <div className="text-center py-8">
                            <p className="text-slate-400 text-sm">No results found. Try a different search.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* ═══════════════════════════════════════
                FINAL CTA — full-screen gradient
            ═══════════════════════════════════════ */}
            <section className="relative bg-gradient-to-br from-emerald-600 to-teal-600 py-16 px-5 flex flex-col items-center text-center overflow-hidden">
                {/* Decorative circles */}
                <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-white/10 pointer-events-none" />
                <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white/10 pointer-events-none" />

                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-5xl mb-4"
                >
                    🌱
                </motion.div>
                <motion.h3
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="font-display font-black text-3xl text-white leading-tight mb-3"
                >
                    Ready to Transform Agriculture?
                </motion.h3>
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="text-emerald-100 text-sm mb-8 max-w-[280px] leading-relaxed"
                >
                    Join thousands of farmers, transporters, and distributors building a transparent food system.
                </motion.p>
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-col gap-3 w-full max-w-xs"
                >
                    <Link to="/signup">
                        <motion.button
                            whileTap={{ scale: 0.96 }}
                            className="w-full py-4 bg-white text-emerald-600 font-black text-base rounded-2xl shadow-xl shadow-black/20 active:shadow-sm transition-all"
                        >
                            Get Started Free
                        </motion.button>
                    </Link>
                    <Link to="/login">
                        <motion.button
                            whileTap={{ scale: 0.96 }}
                            className="w-full py-3.5 bg-transparent border-2 border-white/40 text-white font-bold text-sm rounded-2xl active:bg-white/10 transition-all"
                        >
                            Already have an account? Log In
                        </motion.button>
                    </Link>
                </motion.div>
            </section>

            {/* ═══════════════════════════════════════
                FOOTER — compact accordion style
            ═══════════════════════════════════════ */}
            <footer className="bg-slate-900 pt-8 pb-28 px-5">
                {/* Brand */}
                <Link to="/" className="flex items-center gap-2 mb-3">
                    <img src={logo} alt="Farm2Fork" className="h-8 w-auto brightness-0 invert opacity-90" />
                    <span className="font-display font-bold text-lg text-white">
                        Farm<span className="text-emerald-500">2</span>Fork
                    </span>
                </Link>
                <p className="text-slate-400 text-xs leading-relaxed mb-5 max-w-xs">
                    Revolutionizing agriculture through cryptographic transparency. From farm to table, every harvest is verified, trusted, and fair.
                </p>

                {/* Social row */}
                <div className="flex gap-3 mb-6">
                    {[
                        { icon: Twitter,   color: 'hover:bg-slate-600' },
                        { icon: Linkedin,  color: 'hover:bg-blue-600' },
                        { icon: Instagram, color: 'hover:bg-pink-600' },
                    ].map(({ icon: Icon, color }, i) => (
                        <a key={i} href="#" className={`w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white ${color} transition-all active:scale-95`}>
                            <Icon size={16} />
                        </a>
                    ))}
                </div>

                {/* Accordion link sections */}
                {[
                    {
                        title: 'Platform',
                        links: [
                            { label: 'Features', href: '#features' },
                            { label: 'Solutions', href: '#roles' },
                            { label: 'Traceability Engine', to: '/trace' },
                            { label: 'Supply Chain Portal', to: '/login' },
                        ]
                    },
                    {
                        title: 'Team',
                        links: [
                            { label: 'About Us', to: '/about-us' },
                            { label: 'Architecture', to: '/architecture' },
                            { label: 'Security Model', to: '/security' },
                            { label: 'Technology Stack', to: '/documentation' },
                        ]
                    },
                    {
                        title: 'Resources',
                        links: [
                            { label: 'Documentation', to: '/documentation' },
                            { label: 'Privacy Policy', to: '/privacy-policy' },
                            { label: 'Terms of Service', to: '/terms-of-service' },
                            { label: 'Cookie Policy', to: '/cookie-policy' },
                        ]
                    }
                ].map((section, i) => (
                    <div key={i} className="border-t border-slate-800">
                        <button
                            onClick={() => setFooterSection(footerSection === i ? null : i)}
                            className="w-full flex items-center justify-between py-4 text-left"
                        >
                            <span className="font-bold text-white text-sm">{section.title}</span>
                            <motion.div animate={{ rotate: footerSection === i ? 180 : 0 }} transition={{ duration: 0.2 }}>
                                <ChevronDown size={16} className="text-slate-500" />
                            </motion.div>
                        </button>
                        <AnimatePresence>
                            {footerSection === i && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.22 }}
                                    className="overflow-hidden"
                                >
                                    <div className="pb-4 flex flex-col gap-3">
                                        {section.links.map((link, j) => (
                                            link.to ? (
                                                <Link key={j} to={link.to} className="text-slate-400 text-sm hover:text-emerald-400 transition-colors">
                                                    {link.label}
                                                </Link>
                                            ) : (
                                                <a key={j} href={link.href} className="text-slate-400 text-sm hover:text-emerald-400 transition-colors">
                                                    {link.label}
                                                </a>
                                            )
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}

                <div className="border-t border-slate-800 pt-5 mt-2">
                    <p className="text-slate-500 text-xs">© {new Date().getFullYear()} Farm2Fork Inc. All rights reserved.</p>
                    <p className="text-slate-600 text-xs mt-1">Made with 💚 for a sustainable future</p>
                </div>
            </footer>

            {/* ── BOTTOM STICKY ACTION BAR ── */}
            <div className="fixed bottom-0 inset-x-0 z-50 px-4 pb-4 pt-2 bg-white/90 backdrop-blur-xl border-t border-slate-100 shadow-2xl shadow-slate-900/10">
                <div className="flex items-center gap-3 max-w-sm mx-auto">
                    <a href="#features" className="flex-1 text-center text-xs font-bold text-slate-500 active:text-emerald-600 py-2 transition-colors">
                        Features
                    </a>
                    <Link to="/login" className="flex-1">
                        <motion.button
                            whileTap={{ scale: 0.96 }}
                            className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-sm shadow-sm active:bg-slate-800 transition-all"
                        >
                            Log In
                        </motion.button>
                    </Link>
                    <Link to="/signup" className="flex-1">
                        <motion.button
                            whileTap={{ scale: 0.96 }}
                            className="w-full py-2.5 rounded-xl bg-emerald-500 text-white font-bold text-sm shadow-sm active:bg-emerald-600 transition-all"
                        >
                            Sign Up
                        </motion.button>
                    </Link>
                </div>
            </div>

            {/* Forge AI Assistant */}
            <LandingAssistant />
        </div>
    );
};


/* ─────────────────────────────────────────────
   DESKTOP COMPONENTS — unchanged from before
───────────────────────────────────────────── */
const FeatureItem = ({ icon, title, desc }) => (
    <div className="flex gap-3 md:gap-4">
        <div className="w-9 md:w-10 h-9 md:h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
            {icon}
        </div>
        <div>
            <h5 className="font-bold text-slate-800 mb-1 text-base md:text-lg">{title}</h5>
            <p className="text-slate-500 text-xs md:text-sm leading-relaxed">{desc}</p>
        </div>
    </div>
);

const RoleCard = ({ to, icon, label, desc, color, bg, delay }) => (
    <Link to={to} className="h-full">
        <motion.div
            whileHover={{ y: -5 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * delay }}
            className={`
           h-full flex flex-col items-center justify-center p-4 md:p-6 rounded-xl md:rounded-2xl cursor-pointer border border-slate-100 shadow-sm hover:shadow-xl hover:border-emerald-100
           bg-white transition-all duration-300 relative overflow-hidden group ${bg}
         `}
        >
            <div className={`mb-2 md:mb-4 p-3 md:p-4 rounded-full bg-slate-50 group-hover:bg-white group-hover:scale-110 transition-all duration-300 shadow-sm ${color} text-slate-400`}>
                {icon}
            </div>
            <span className="font-bold text-slate-700 group-hover:text-slate-900 text-sm md:text-lg mb-0.5 md:mb-1 transition-colors">{label}</span>
            <span className="text-[10px] md:text-xs font-medium text-slate-400 uppercase tracking-wide group-hover:text-emerald-600 transition-colors">{desc}</span>
        </motion.div>
    </Link>
);

/* ─────────────────────────────────────────────
   DESKTOP LANDING — original experience preserved
───────────────────────────────────────────── */
const DesktopLanding = ({ navigate }) => {
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
    const [faqSearch, setFaqSearch] = useState('');
    const [scrolled, setScrolled] = useState(false);

    React.useEffect(() => {
        const handleMouseMove = (e) => setCursorPos({ x: e.clientX, y: e.clientY });
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    React.useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 60);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const filteredFaqs = faqs.filter(faq =>
        faq.q.toLowerCase().includes(faqSearch.toLowerCase()) ||
        faq.a.toLowerCase().includes(faqSearch.toLowerCase())
    );

    return (
        <div className="relative min-h-screen overflow-x-hidden font-sans text-slate-800 bg-white flex flex-col selection:bg-emerald-100 selection:text-emerald-900">

            {/* ── REDESIGNED NAVBAR ── */}
            <motion.nav
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="fixed top-0 inset-x-0 z-50 px-6 py-4"
            >
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        animate={scrolled ? {
                            backgroundColor: 'rgba(15,23,42,0.95)',
                            backdropFilter: 'blur(24px)',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
                            paddingLeft: '20px',
                            paddingRight: '20px',
                        } : {
                            backgroundColor: 'rgba(255,255,255,0.12)',
                            backdropFilter: 'blur(16px)',
                            boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
                            paddingLeft: '24px',
                            paddingRight: '24px',
                        }}
                        transition={{ duration: 0.35, ease: 'easeInOut' }}
                        className="rounded-2xl py-3 flex items-center justify-between border"
                        style={{
                            borderColor: scrolled ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.25)',
                        }}
                    >
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-2.5 group shrink-0">
                            <img
                                src={logo}
                                alt="Farm2Fork Logo"
                                className={`h-9 w-auto object-contain transition-all duration-300 group-hover:scale-105 ${scrolled ? 'brightness-0 invert' : ''}`}
                            />
                            <span className={`font-display font-black text-xl tracking-tight transition-colors duration-300 ${scrolled ? 'text-white' : 'text-slate-900'}`}>
                                Farm<span className="text-emerald-500">2</span>Fork
                            </span>
                        </Link>

                        {/* Centre nav links */}
                        <div className="hidden lg:flex items-center gap-1 bg-white/10 rounded-xl px-2 py-1.5">
                            {[
                                { to: '/features',     label: 'Features' },
                                { to: '/ecosystem',    label: 'Ecosystem' },
                                { to: '/how-it-works', label: 'How It Works' },
                                { to: '/faq',          label: 'FAQ' },
                            ].map(item => (
                                <Link
                                    key={item.label}
                                    to={item.to}
                                    className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200
                                        ${ scrolled
                                            ? 'text-slate-300 hover:text-white hover:bg-white/10'
                                            : 'text-slate-700 hover:text-slate-900 hover:bg-white/30'
                                        }`}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>

                        {/* Right CTAs */}
                        <div className="flex items-center gap-3">
                            {/* Live indicator */}
                            <div className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest transition-colors duration-300 ${
                                scrolled
                                    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                                    : 'border-emerald-300/60 bg-emerald-50/80 text-emerald-700'
                            }`}>
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                Live
                            </div>

                            <Link to="/login">
                                <motion.button
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    className={`px-5 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
                                        scrolled
                                            ? 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                                            : 'bg-slate-900/90 text-white hover:bg-slate-800 shadow-lg shadow-slate-900/20'
                                    }`}
                                >
                                    Log In
                                </motion.button>
                            </Link>
                            <Link to="/signup">
                                <motion.button
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-bold shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all duration-200"
                                >
                                    Sign Up
                                </motion.button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </motion.nav>

            {/* Hero Content */}
            <div className="flex-grow flex flex-col items-center justify-center relative mt-28 px-4 z-10">

                {/* Badge */}
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-800 shadow-sm">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                        </span>
                        <span className="text-xs font-bold uppercase tracking-wider">AES-256-GCM Encrypted Traceability</span>
                    </div>
                </motion.div>

                {/* Headlines */}
                <div className="text-center z-20 relative max-w-5xl mx-auto">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-emerald-300/20 rounded-full blur-[100px] -z-10 pointer-events-none" />

                    <motion.h1
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1, duration: 0.8, type: 'spring' }}
                        className="font-display font-extrabold text-slate-900 tracking-tight leading-none drop-shadow-sm text-7xl mb-3"
                    >
                        Farm <span className="font-light text-slate-400">to</span> <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Fork</span>
                    </motion.h1>

                    <motion.h2
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.8, type: 'spring' }}
                        className="font-display font-light text-slate-600 tracking-tight text-5xl mb-6"
                    >
                        Revolutionized with Trust.
                    </motion.h2>

                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-slate-500 max-w-xl mx-auto font-medium leading-relaxed text-base mb-8 px-4"
                    >
                        The world's first decentralized agriculture ecosystem. Empowering farmers and consumers with{' '}
                        <span className="text-emerald-700 font-bold bg-emerald-50 px-1 rounded">100% transparency</span> and verified quality.
                    </motion.p>

                    <div className="h-20" />
                </div>

                {/* Grass Image Hero */}
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 1 }}
                    className="w-full -mt-60 lg:-mt-[26rem] relative z-0 pointer-events-none select-none"
                >
                    <img
                        src={heroImage}
                        alt="Organic farm field"
                        className="w-full max-w-[1500px] mx-auto object-contain transform scale-125 lg:scale-110 origin-bottom"
                    />
                </motion.div>
            </div>

            {/* Role Selection */}
            <div id="roles" className="bg-white py-20 relative z-10 w-full">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16 max-w-2xl mx-auto">
                        <h3 className="text-3xl font-display font-bold text-slate-800 mb-4">Ecosystem Modules</h3>
                        <p className="text-base text-slate-500">Whether you grow, move, sell, or buy—Farm2Fork provides a dedicated dashboard for every stakeholder.</p>
                    </div>
                    <motion.div
                        initial={{ y: 40, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ staggerChildren: 0.1 }}
                        className="grid grid-cols-3 lg:grid-cols-6 gap-4 max-w-7xl mx-auto"
                    >
                        <RoleCard to="/roles/farmer"      icon={<Sprout size={24} />}   label="Farmer"      desc="Crop Management" color="group-hover:text-emerald-600" bg="hover:bg-emerald-50"  delay={0} />
                        <RoleCard to="/roles/transporter" icon={<Truck size={24} />}    label="Logistics"   desc="Fleet Tracking"  color="group-hover:text-blue-600"    bg="hover:bg-blue-50"    delay={0.1} />
                        <RoleCard to="/roles/distributor" icon={<Database size={24} />} label="Distributor" desc="Smart Inventory" color="group-hover:text-amber-600"   bg="hover:bg-amber-50"   delay={0.2} />
                        <RoleCard to="/roles/retailer"    icon={<Store size={24} />}    label="Retailer"    desc="Sales Analytics" color="group-hover:text-orange-600"  bg="hover:bg-orange-50"  delay={0.3} />
                        <RoleCard to="/roles/admin"       icon={<User size={24} />}     label="Admin"       desc="Governance"      color="group-hover:text-slate-600"   bg="hover:bg-slate-50"   delay={0.4} />
                        <RoleCard to="/roles/consumer"    icon={<Search size={24} />}   label="Consumer"    desc="Verify Origin"   color="group-hover:text-teal-600"    bg="hover:bg-teal-50"    delay={0.5} />
                    </motion.div>
                </div>
            </div>

            {/* Interactive Cursor Spotlight */}
            <div
                className="pointer-events-none fixed inset-0 z-50 transition-opacity duration-300"
                style={{ background: `radial-gradient(600px circle at ${cursorPos.x}px ${cursorPos.y}px, rgba(16, 185, 129, 0.08), transparent 80%)` }}
            />

            {/* How It Works */}
            <div className="bg-white py-24 relative z-10">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-20 max-w-3xl mx-auto">
                        <h3 className="text-4xl font-display font-bold text-slate-900 mb-4">How It Works</h3>
                        <p className="text-slate-600 text-base">From farm to your table, every step is tracked, verified, and secured with HMAC-SHA256.</p>
                    </div>
                    <div className="grid grid-cols-4 gap-8 max-w-6xl mx-auto">
                        {howItWorks.map((item, i) => {
                            const Icon = item.icon;
                            return (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.15 }}
                                    className="relative"
                                >
                                    <div className="bg-gradient-to-br from-emerald-50 to-white p-8 rounded-2xl border border-emerald-100 hover:shadow-xl transition-all group">
                                        <div className="text-7xl font-display font-black text-emerald-100 absolute top-4 right-4 group-hover:scale-110 transition-transform">{item.step}</div>
                                        <div className="relative z-10">
                                            <div className="w-14 h-14 rounded-full bg-emerald-500 text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                                <Icon size={28} />
                                            </div>
                                            <h4 className="font-display font-bold text-xl text-slate-800 mb-2">{item.title}</h4>
                                            <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                    {i < 3 && (
                                        <ArrowRight className="absolute top-1/2 -right-4 -translate-y-1/2 text-emerald-300" size={32} />
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Why Choose Us */}
            <div id="features" className="bg-slate-50 py-24 relative overflow-hidden">
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl pointer-events-none" />
                <div className="container mx-auto px-6 relative z-10">
                    <div className="flex flex-row gap-16 items-center max-w-6xl mx-auto">
                        <div className="bg-white p-2 rounded-2xl shadow-xl shadow-slate-200/50 -rotate-3 hover:rotate-0 transition-transform duration-500 w-1/2">
                            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-8 h-80 flex flex-col justify-center items-center text-center">
                                <Shield size={64} className="text-emerald-500 mb-6" />
                                <h4 className="font-display font-bold text-2xl text-slate-800 mb-2">Bank-Grade Security</h4>
                                <p className="text-slate-600 text-sm leading-relaxed">Chain-linked digital signatures ensure that data once written cannot be altered, preventing fraud in the supply chain.</p>
                            </div>
                        </div>
                        <div className="w-1/2">
                            <h3 className="text-4xl font-display font-bold text-slate-900 mb-6">Why Farm2Fork?</h3>
                            <div className="space-y-8">
                                <FeatureItem icon={<Leaf size={20} />} title="Sustainable Practices" desc="Promoting eco-friendly farming through verified carbon footprint tracking." />
                                <FeatureItem icon={<Globe size={20} />} title="Global Reach" desc="Connect local farmers to international markets with simplified logistics." />
                                <FeatureItem icon={<Award size={20} />} title="Fair Trade" desc="Smart contracts ensure farmers get paid instantly and fairly for their produce." />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Benefits Grid */}
            <div className="bg-white py-24">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h3 className="text-4xl font-display font-bold text-slate-900 mb-4">Platform Benefits</h3>
                        <p className="text-slate-600 text-base max-w-2xl mx-auto">Discover how our cryptographic integrity engine transforms the agriculture supply chain</p>
                    </div>
                    <div className="grid grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {benefits.map((item, i) => {
                            const Icon = item.icon;
                            return (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="bg-white p-6 rounded-xl border border-slate-100 hover:shadow-lg transition-all group"
                                >
                                    <div className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center ${item.color} mb-4 group-hover:scale-110 transition-transform`}>
                                        <Icon size={24} />
                                    </div>
                                    <h4 className="font-bold text-lg text-slate-800 mb-2">{item.title}</h4>
                                    <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Technology Stack */}
            <div className="bg-gradient-to-b from-slate-900 to-slate-800 py-20 text-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h3 className="text-4xl font-display font-bold mb-4">Built with Cutting-Edge Technology</h3>
                        <p className="text-slate-400 text-base">Enterprise-grade infrastructure powering transparent agriculture</p>
                    </div>
                    <div className="grid grid-cols-4 gap-8 max-w-5xl mx-auto">
                        {techStack.slice(0, 4).map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="text-center p-6 bg-slate-800/50 rounded-xl border border-slate-700 hover:border-emerald-500/50 transition-all"
                            >
                                <p className="font-display font-bold text-xl mb-1">{item.name}</p>
                                <p className="text-sm text-slate-400">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* FAQ */}
            <div className="bg-white py-24">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h3 className="text-4xl font-display font-bold text-slate-900 mb-4">Frequently Asked Questions</h3>
                        <p className="text-slate-600 text-base">Everything you need to know about Farm2Fork</p>
                    </div>
                    <div className="max-w-2xl mx-auto mb-8">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search FAQs..."
                                value={faqSearch}
                                onChange={e => setFaqSearch(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 focus:outline-none transition-all text-slate-700 placeholder:text-slate-400"
                            />
                        </div>
                        {faqSearch && (
                            <p className="text-sm text-slate-500 mt-3 text-center">Found {filteredFaqs.length} result{filteredFaqs.length !== 1 ? 's' : ''}</p>
                        )}
                    </div>
                    <div className="max-w-3xl mx-auto space-y-4">
                        {filteredFaqs.length > 0 ? filteredFaqs.map((item, i) => (
                            <motion.details
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="bg-gradient-to-br from-white to-slate-50 rounded-2xl border-2 border-slate-100 group hover:border-emerald-200 hover:shadow-lg transition-all relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                                <summary className="cursor-pointer p-6 font-semibold text-slate-800 flex items-center gap-4 hover:text-emerald-600 transition-colors relative z-10">
                                    <span className="text-2xl flex-shrink-0">{item.icon}</span>
                                    <span className="text-base flex-1">{item.q}</span>
                                    <ChevronDown size={24} className="flex-shrink-0 text-slate-400 group-open:rotate-180 group-open:text-emerald-600 transition-all duration-300" />
                                </summary>
                                <div className="px-6 pb-6 ml-12 text-base text-slate-600 leading-relaxed relative z-10">
                                    {item.a}
                                </div>
                            </motion.details>
                        )) : (
                            <div className="text-center py-12">
                                <p className="text-slate-500 text-lg mb-2">No FAQs found</p>
                                <p className="text-slate-400 text-sm">Try a different search term</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Final CTA */}
            <div className="bg-gradient-to-br from-emerald-600 to-teal-600 py-24">
                <div className="container mx-auto px-6 text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-3xl mx-auto">
                        <h3 className="text-5xl font-display font-bold text-white mb-6">Ready to Transform Agriculture?</h3>
                        <p className="text-emerald-50 text-lg mb-10">Join thousands of farmers, transporters, and distributors building a transparent food system.</p>
                        <div className="flex flex-row gap-4 justify-center">
                            <Link to="/signup">
                                <button className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-semibold rounded-2xl shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 transition-all active:scale-95">
                                    Get Started
                                </button>
                            </Link>
                            <button className="px-8 py-4 bg-emerald-700 text-white font-bold rounded-full hover:bg-emerald-800 transition-all border-2 border-white/20">
                                Contact Sales
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-slate-900 pt-16 pb-8 border-t border-slate-800">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-4 gap-12 mb-16">
                        <div className="space-y-6">
                            <Link to="/" className="flex items-center gap-2">
                                <img src={logo} alt="Farm2Fork Logo" className="h-16 w-auto brightness-0 invert" />
                                <span className="font-display font-bold text-xl text-white">Farm<span className="text-emerald-500">2</span>Fork</span>
                            </Link>
                            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
                                Revolutionizing agriculture through cryptographic transparency. From farm to table, we ensure every harvest is verified, trusted, and fair.
                            </p>
                            <div className="flex gap-4">
                                {[
                                    { icon: Twitter, color: 'hover:bg-emerald-600' },
                                    { icon: Linkedin, color: 'hover:bg-blue-600' },
                                    { icon: Instagram, color: 'hover:bg-pink-600' },
                                ].map(({ icon: Icon, color }, i) => (
                                    <a key={i} href="#" className={`w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white ${color} transition-all transform hover:-translate-y-1`}>
                                        <Icon size={18} />
                                    </a>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h4 className="font-bold text-white mb-6">Platform</h4>
                            <ul className="space-y-4 text-sm text-slate-400">
                                <li><a href="#features" className="hover:text-emerald-400 transition-colors">Features</a></li>
                                <li><a href="#roles" className="hover:text-emerald-400 transition-colors">Solutions</a></li>
                                <li><Link to="/trace" className="hover:text-emerald-400 transition-colors">Traceability Engine</Link></li>
                                <li><Link to="/login" className="hover:text-emerald-400 transition-colors">Supply Chain Portal</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-white mb-6">Team</h4>
                            <ul className="space-y-4 text-sm text-slate-400">
                                <li><Link to="/about-us" className="hover:text-emerald-400 transition-colors">About Us</Link></li>
                                <li><Link to="/architecture" className="hover:text-emerald-400 transition-colors">Platform Architecture</Link></li>
                                <li><Link to="/security" className="hover:text-emerald-400 transition-colors">Security Model</Link></li>
                                <li><Link to="/documentation" className="hover:text-emerald-400 transition-colors">Technology Stack</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-white mb-6">Resources</h4>
                            <ul className="space-y-4 text-sm text-slate-400">
                                <li><Link to="/documentation" className="hover:text-emerald-400 transition-colors">Documentation</Link></li>
                                <li><Link to="/privacy-policy" className="hover:text-emerald-400 transition-colors">Privacy Policy</Link></li>
                                <li><Link to="/terms-of-service" className="hover:text-emerald-400 transition-colors">Terms of Service</Link></li>
                                <li><Link to="/cookie-policy" className="hover:text-emerald-400 transition-colors">Cookie Policy</Link></li>
                                <li>
                                    <a href="#" className="hover:text-emerald-400 transition-colors flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                        System Status
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-slate-800 pt-8 flex justify-between items-center gap-4">
                        <p className="text-slate-500 text-sm">© {new Date().getFullYear()} Farm2Fork Inc. All rights reserved.</p>
                        <div className="flex gap-6 text-sm text-slate-500">
                            <span>Made with 💚 for a sustainable future</span>
                        </div>
                    </div>
                </div>
            </footer>

            <LandingAssistant />
        </div>
    );
};

/* ─────────────────────────────────────────────
   ROOT EXPORT — routes by device
───────────────────────────────────────────── */
const Landing = () => {
    const isMobile = useMediaQuery('(max-width: 768px)');
    const navigate = useNavigate();

    // Redirect if already authenticated
    React.useEffect(() => {
        if (authHelpers.isAuthenticated()) {
            const user = authHelpers.getUser();
            if (user && user.role) navigate(`/${user.role}`);
        }
    }, [navigate]);

    return isMobile ? <MobileLanding /> : <DesktopLanding navigate={navigate} />;
};

export default Landing;
