import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, Activity, Github } from 'lucide-react';
import logo from '../../assets/logo2.png';
import SplitText from '../ui/core/SplitText';
import Grainient from '../ui/core/Grainient';

// Accent color maps
const ACCENT = {
    emerald: {
        pill: 'text-emerald-700 bg-emerald-50/80 border-emerald-200',
        text: 'text-emerald-600',
        color1: '#ecfdf5',
        color2: '#a7f3d0',
        color3: '#6ee7b7',
        glow: 'from-emerald-200/40 via-teal-100/20 to-transparent',
    },
    violet: {
        pill: 'text-violet-700 bg-violet-50/80 border-violet-200',
        text: 'text-violet-600',
        color1: '#f5f3ff',
        color2: '#ddd6fe',
        color3: '#c4b5fd',
        glow: 'from-violet-200/40 via-purple-100/20 to-transparent',
    },
    sky: {
        pill: 'text-sky-700 bg-sky-50/80 border-sky-200',
        text: 'text-sky-600',
        color1: '#f0f9ff',
        color2: '#bae6fd',
        color3: '#7dd3fc',
        glow: 'from-sky-200/40 via-cyan-100/20 to-transparent',
    },
    rose: {
        pill: 'text-rose-700 bg-rose-50/80 border-rose-200',
        text: 'text-rose-600',
        color1: '#fff1f2',
        color2: '#fecdd3',
        color3: '#fda4af',
        glow: 'from-rose-200/40 via-red-100/20 to-transparent',
    },
};

export const LightPageLayout = ({
    title,
    subtitle,
    children,
    accentColor = 'emerald',
}) => {
    const { pathname } = useLocation();
    const accent = ACCENT[accentColor] || ACCENT.emerald;
    const pageName = pathname.split('/').pop().replace(/-/g, ' ') || 'page';

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return (
        // Root has NO background - Grainient is the background
        <div className="min-h-screen font-sans relative overflow-x-hidden">

            {/* ── LAYER 0: Full-page Grainient WebGL Background ──────────── */}
            <div
                className="fixed inset-0"
                style={{ zIndex: 0 }}
            >
                <Grainient
                    color1={accent.color1}
                    color2={accent.color2}
                    color3={accent.color3}
                    timeSpeed={0.08}
                    warpStrength={0.6}
                    warpFrequency={4}
                    warpSpeed={1.5}
                    warpAmplitude={60}
                    grainAmount={0.04}
                    grainScale={2}
                    contrast={1.1}
                    saturation={0.8}
                    gamma={1.1}
                    zoom={1.0}
                />
            </div>

            {/* ── LAYER 1: All page content ────────────────────────────────── */}
            <div className="relative flex flex-col min-h-screen" style={{ zIndex: 1 }}>

                {/* NAV */}
                <header className="sticky top-0 z-50 border-b border-white/60"
                    style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(20px)' }}>
                    <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                        <Link to="/" className="flex items-center gap-2.5 group">
                            <img src={logo} alt="Farm2Fork" className="h-8 w-auto" />
                            <span className="font-bold text-xl text-slate-900 tracking-tight">
                                Farm<span className={accent.text}>2</span>Fork
                            </span>
                        </Link>

                        <nav className="hidden md:flex items-center gap-8">
                            {[
                                { to: '/trace', label: 'Traceability' },
                                { to: '/about-us', label: 'Team' },
                                { to: '/documentation', label: 'Docs' },
                                { to: '/architecture', label: 'Architecture' },
                            ].map(({ to, label }) => (
                                <Link
                                    key={to}
                                    to={to}
                                    className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                                >
                                    {label}
                                </Link>
                            ))}
                        </nav>

                        <Link
                            to="/"
                            className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 bg-white/80 hover:bg-white border border-slate-200 px-4 py-2 rounded-xl transition-all shadow-sm"
                        >
                            <ArrowLeft size={15} />
                            <span className="hidden sm:inline">Home</span>
                        </Link>
                    </div>
                </header>

                {/* HERO */}
                <section className="relative pt-24 pb-28 md:pt-36 md:pb-36 flex items-center justify-center text-center overflow-hidden">
                    {/* Radial top-glow */}
                    <div
                        className={`absolute inset-x-0 top-0 h-full bg-gradient-radial pointer-events-none`}
                        style={{
                            background: `radial-gradient(ellipse 70% 60% at 50% 0%, ${accent.color2}99, transparent 70%)`
                        }}
                    />

                    <div className="relative container mx-auto px-6 max-w-4xl">
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="flex justify-center mb-8"
                        >
                            <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-bold uppercase tracking-widest shadow-sm ${accent.pill}`}>
                                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                                {pageName}
                            </span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-[1.05] mb-8 text-center"
                        >
                            <SplitText text={title} />
                        </motion.h1>

                        {subtitle && (
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="text-xl md:text-2xl text-slate-600 font-medium leading-relaxed max-w-2xl mx-auto text-center"
                            >
                                {subtitle}
                            </motion.p>
                        )}

                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.35 }}
                            className="flex flex-wrap justify-center gap-4 mt-12"
                        >
                            <Link
                                to="/documentation"
                                className="px-7 py-3 bg-slate-900 text-white rounded-2xl text-sm font-bold hover:bg-slate-700 transition-all shadow-xl shadow-slate-900/10 hover:shadow-2xl hover:-translate-y-0.5"
                            >
                                View Docs
                            </Link>
                            <Link
                                to="/about-us"
                                className="px-7 py-3 bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-800 rounded-2xl text-sm font-bold hover:bg-white transition-all shadow-sm hover:-translate-y-0.5"
                            >
                                Meet the Team
                            </Link>
                        </motion.div>
                    </div>
                </section>

                {/* DIVIDER */}
                <div className="h-px bg-gradient-to-r from-transparent via-slate-900/10 to-transparent mx-8" />

                {/* MAIN CONTENT */}
                <main className="flex-1 container mx-auto px-6 py-16 md:py-24">
                    {children}
                </main>

                {/* FOOTER */}
                <footer
                    className="border-t border-white/40 pt-20 pb-12"
                    style={{ background: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(16px)' }}
                >
                    <div className="container mx-auto px-6">
                        {/* Top section */}
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 mb-16">
                            {/* Brand */}
                            <div className="lg:col-span-2 space-y-5">
                                <Link to="/" className="flex items-center gap-2.5">
                                    <img src={logo} alt="Farm2Fork" className="h-9 w-auto" />
                                    <span className="font-bold text-2xl text-slate-900">
                                        Farm<span className={accent.text}>2</span>Fork
                                    </span>
                                </Link>
                                <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
                                    A cryptographically secured traceability platform for India's agricultural supply chain — bridging farmers and consumers with transparent, verifiable data.
                                </p>
                                <div className="flex items-center gap-3 pt-2">
                                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border ${accent.pill}`}>
                                        <Activity size={10} className="animate-pulse" />
                                        System Operational
                                    </span>
                                </div>
                            </div>

                            {/* Links columns */}
                            <div>
                                <h5 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.18em] mb-6">Platform</h5>
                                <ul className="space-y-3.5">
                                    {[
                                        { to: '/trace', label: 'Traceability Engine' },
                                        { to: '/login', label: 'System Login' },
                                        { to: '/signup', label: 'Register Entity' },
                                    ].map(({ to, label }) => (
                                        <li key={to}>
                                            <Link to={to} className="text-sm text-slate-500 hover:text-slate-900 font-medium transition-colors">
                                                {label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h5 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.18em] mb-6">Resources</h5>
                                <ul className="space-y-3.5">
                                    {[
                                        { to: '/documentation', label: 'Documentation' },
                                        { to: '/architecture', label: 'Architecture' },
                                        { to: '/security', label: 'Security Model' },
                                        { to: '/about-us', label: 'About the Team' },
                                    ].map(({ to, label }) => (
                                        <li key={to}>
                                            <Link to={to} className="text-sm text-slate-500 hover:text-slate-900 font-medium transition-colors">
                                                {label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h5 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.18em] mb-6">Legal</h5>
                                <ul className="space-y-3.5">
                                    {[
                                        { to: '/privacy-policy', label: 'Privacy Policy' },
                                        { to: '/terms-of-service', label: 'Terms of Service' },
                                        { to: '/cookie-policy', label: 'Cookie Policy' },
                                    ].map(({ to, label }) => (
                                        <li key={to}>
                                            <Link to={to} className="text-sm text-slate-500 hover:text-slate-900 font-medium transition-colors">
                                                {label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Bottom bar */}
                        <div className="border-t border-slate-900/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <p className="text-xs text-slate-400 font-medium">
                                &copy; {new Date().getFullYear()} Farm2Fork — Final Year Major Project
                            </p>
                            <div className="flex items-center gap-6">
                                <p className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                                    <Shield size={12} className={accent.text} /> Secured with AES-256-GCM
                                </p>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default LightPageLayout;
