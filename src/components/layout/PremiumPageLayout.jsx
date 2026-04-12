import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowUpRight, Shield } from 'lucide-react';
import logo from '../../assets/logo2.png';

export const PremiumPageLayout = ({ 
    title, 
    subtitle, 
    icon, 
    children, 
    accentColor = "emerald" // 'emerald', 'violet', 'sky', 'rose'
}) => {
    const { pathname } = useLocation();

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    // Color maps for dynamic accent rendering
    const gradients = {
        emerald: 'from-emerald-500 to-teal-900',
        violet: 'from-violet-500 to-indigo-900',
        sky: 'from-sky-500 to-cyan-900',
        rose: 'from-rose-500 to-pink-900'
    };

    const glows = {
        emerald: 'bg-emerald-500/20',
        violet: 'bg-violet-500/20',
        sky: 'bg-sky-500/20',
        rose: 'bg-rose-500/20'
    };

    const textColors = {
        emerald: 'text-emerald-400',
        violet: 'text-violet-400',
        sky: 'text-sky-400',
        rose: 'text-rose-400'
    };

    return (
        <div className="min-h-screen bg-[#0b1120] text-slate-300 font-sans selection:bg-emerald-500/30 selection:text-emerald-200 flex flex-col">
            {/* Sticky Nav */}
            <header className="sticky top-0 z-50 bg-[#0b1120]/80 backdrop-blur-xl border-b border-white/5">
                <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
                        <img src={logo} alt="Farm2Fork" className="h-8 w-auto brightness-0 invert" />
                        <span className="font-display font-bold text-xl text-white tracking-tight">
                            Farm<span className={textColors[accentColor]}>2</span>Fork
                        </span>
                    </Link>
                    <Link 
                        to="/" 
                        className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-white/5"
                    >
                        <ArrowLeft size={16} /> <span className="hidden sm:inline">Back to Platform</span>
                    </Link>
                </div>
            </header>

            {/* Hero Section */}
            <div className="relative overflow-hidden border-b border-white/5">
                {/* Animated Background Orbs */}
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 2, ease: "easeOut" }}
                        className={`absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full blur-[120px] mix-blend-screen opacity-50 ${glows[accentColor]}`} 
                    />
                    <motion.div 
                        initial={{ opacity: 0, scale: 1.2 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 3, ease: "easeOut", delay: 0.2 }}
                        className="absolute bottom-0 right-1/4 w-[600px] h-[600px] rounded-full blur-[150px] mix-blend-screen bg-slate-800/40" 
                    />
                </div>

                {/* Hero Content */}
                <div className="relative z-10 container mx-auto px-4 md:px-6 py-20 md:py-32">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="max-w-4xl"
                    >
                        {icon && (
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 border border-white/10 bg-white/5 backdrop-blur-md shadow-2xl`}>
                                {React.cloneElement(icon, { className: `${textColors[accentColor]} drop-shadow-lg`, size: 32 })}
                            </div>
                        )}
                        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6 leading-[1.1]">
                            {title}
                        </h1>
                        {subtitle && (
                            <p className="text-xl md:text-2xl text-slate-400 font-medium leading-relaxed max-w-2xl">
                                {subtitle}
                            </p>
                        )}
                    </motion.div>
                </div>
            </div>

            {/* Main Content Area */}
            <main className="flex-1 relative z-10 container mx-auto px-4 md:px-6 py-16 md:py-24">
                {children}
            </main>

            {/* Full-Width Footer */}
            <footer className="mt-auto bg-[#050914] border-t border-white/5 pt-16 pb-8">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                        <div className="md:col-span-1 space-y-6">
                            <Link to="/" className="flex items-center gap-3">
                                <img src={logo} alt="Farm2Fork" className="h-10 w-auto brightness-0 invert opacity-50" />
                            </Link>
                            <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
                                A cryptographically secured agricultural supply chain bridging the trust gap between farmers and consumers.
                            </p>
                        </div>
                        
                        <div>
                            <h4 className="text-white font-bold mb-6 tracking-wide">Platform</h4>
                            <ul className="space-y-4 text-sm font-medium">
                                <li><Link to="/trace" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1 group">Traceability Engine <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity"/></Link></li>
                                <li><Link to="/login" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1 group">Supply Chain Login <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity"/></Link></li>
                                <li><Link to="/signup" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1 group">Register Entity <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity"/></Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-bold mb-6 tracking-wide">Documentation</h4>
                            <ul className="space-y-4 text-sm font-medium">
                                <li><Link to="/architecture" className={`text-slate-400 hover:${textColors.sky} transition-colors`}>Architecture & API</Link></li>
                                <li><Link to="/security" className={`text-slate-400 hover:${textColors.violet} transition-colors`}>Security Model</Link></li>
                                <li><Link to="/documentation" className={`text-slate-400 hover:${textColors.emerald} transition-colors`}>Platform Docs</Link></li>
                                <li><Link to="/about-us" className={`text-slate-400 hover:${textColors.emerald} transition-colors`}>The Team</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-bold mb-6 tracking-wide">Legal</h4>
                            <ul className="space-y-4 text-sm font-medium">
                                <li><Link to="/privacy-policy" className={`text-slate-400 hover:${textColors.rose} transition-colors`}>Privacy Policy</Link></li>
                                <li><Link to="/terms-of-service" className={`text-slate-400 hover:${textColors.rose} transition-colors`}>Terms of Service</Link></li>
                                <li><Link to="/cookie-policy" className={`text-slate-400 hover:${textColors.rose} transition-colors`}>Cookie Policy</Link></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 pt-8 text-sm font-medium text-slate-600">
                        <p>&copy; {new Date().getFullYear()} Farm2Fork Project.</p>
                        <p className="flex items-center gap-2">Designed for trust <Shield size={14} className="text-slate-500" /></p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default PremiumPageLayout;
