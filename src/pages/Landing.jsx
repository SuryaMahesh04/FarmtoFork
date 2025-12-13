import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sprout, Truck, Store, User, Database, Search, Shield, Leaf, BarChart3, Globe, Award, ArrowRight, CheckCircle2, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/ui/Button';
import heroImage from '../assets/image22.png';
import useMediaQuery from '../utils/useMediaQuery';

const Landing = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const isMobile = useMediaQuery('(max-width: 768px)');

    return (
        <div className="relative min-h-screen overflow-x-hidden font-sans text-slate-800 bg-white flex flex-col selection:bg-emerald-100 selection:text-emerald-900">

            {/* Navbar */}
            <nav className="fixed top-0 inset-x-0 z-50 px-4 md:px-6 py-4 pointer-events-none">
                <div className="max-w-7xl mx-auto w-full pointer-events-auto">
                    <div className="bg-white/70 backdrop-blur-xl border border-white/40 shadow-sm rounded-full px-4 md:px-6 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-8 md:w-9 h-8 md:h-9 rounded-full bg-gradient-to-tr from-emerald-600 to-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                                <Sprout size={isMobile ? 18 : 20} />
                            </div>
                            <span className="font-display font-bold text-base md:text-lg tracking-tight text-slate-900">Agri<span className="text-emerald-700">Chain</span></span>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-8">
                            <a href="#features" className="text-sm font-medium text-slate-600 hover:text-emerald-700 transition-colors">Features</a>
                            <a href="#roles" className="text-sm font-medium text-slate-600 hover:text-emerald-700 transition-colors">Roles</a>
                            <Link to="/farmer">
                                <Button variant="primary" size="sm" className="rounded-full bg-slate-900 hover:bg-slate-800 text-white px-6">Log In</Button>
                            </Link>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 rounded-full hover:bg-slate-100 transition-colors"
                        >
                            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && isMobile && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-0 z-40 bg-white pt-20 px-6"
                    >
                        <div className="flex flex-col gap-6 mt-8">
                            <a
                                href="#features"
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-xl font-medium text-slate-700 hover:text-emerald-700 transition-colors py-3 border-b border-slate-100"
                            >
                                Features
                            </a>
                            <a
                                href="#roles"
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-xl font-medium text-slate-700 hover:text-emerald-700 transition-colors py-3 border-b border-slate-100"
                            >
                                Roles
                            </a>
                            <Link to="/farmer" className="mt-4">
                                <Button variant="primary" className="w-full rounded-full bg-slate-900 hover:bg-slate-800 text-white py-4">
                                    Log In
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Hero Content - App-style for mobile, website-style for desktop */}
            <div className={`flex-grow flex flex-col items-center ${isMobile ? 'justify-start pt-8' : 'justify-center'} relative ${isMobile ? 'mt-16' : 'mt-28'} px-4 z-10`}>

                {/* Badge */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className={isMobile ? 'mb-8' : 'mb-6'}
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-800 shadow-sm">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider">Live Blockchain Traceability</span>
                    </div>
                </motion.div>

                {/* Headlines */}
                <div className="text-center z-20 relative max-w-5xl mx-auto">
                    {/* Decorative Blurs */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[500px] h-[200px] md:h-[300px] bg-emerald-300/20 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

                    <motion.h1
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1, duration: 0.8, type: "spring" }}
                        className={`font-display font-extrabold text-slate-900 tracking-tight leading-none drop-shadow-sm ${isMobile ? 'text-5xl mb-3' : 'text-7xl mb-3'}`}
                    >
                        Farm <span className="font-light text-slate-400">to</span> <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Fork</span>
                    </motion.h1>

                    <motion.h2
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.8, type: "spring" }}
                        className={`font-display font-light text-slate-600 tracking-tight ${isMobile ? 'text-2xl mb-5' : 'text-5xl mb-6'}`}
                    >
                        Revolutionized with Trust.
                    </motion.h2>

                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className={`text-slate-500 max-w-xl mx-auto font-medium leading-relaxed ${isMobile ? 'text-sm mb-8 px-2' : 'text-base mb-8 px-4'}`}
                    >
                        The world's first decentralized agriculture ecosystem. Empowering farmers and consumers with <span className="text-emerald-700 font-bold bg-emerald-50 px-1 rounded">100% transparency</span> and verified quality.
                    </motion.p>

                    {/* Stats - Responsive Grid */}
                    <div className={`${isMobile ? 'grid grid-cols-3 gap-4 py-4 mb-8' : 'flex flex-wrap justify-center gap-12 py-4 mb-4'} max-w-md md:max-w-none mx-auto`}>
                        <StatItem value="10k+" label="Farmers" />
                        <StatItem value="50M+" label="Products" />
                        <StatItem value="100%" label="Transparent" />
                    </div>

                    {/* Mobile CTA Button - App Style */}
                    {isMobile && (
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="mb-12"
                        >
                            <Link to="/farmer">
                                <button className="w-full max-w-xs mx-auto px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-semibold rounded-2xl shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 transition-all active:scale-95">
                                    Get Started
                                </button>
                            </Link>
                        </motion.div>
                    )}
                </div>

                {/* Grass Image Hero - Desktop Only */}
                {!isMobile && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4, duration: 1 }}
                        className="w-full -mt-60 lg:-mt-[26rem] relative z-0 pointer-events-none select-none"
                        id="hero-image-container"
                    >
                        <img
                            src={heroImage}
                            alt="Organic farm field"
                            className="w-full max-w-[1500px] mx-auto object-contain transform scale-125 lg:scale-110 origin-bottom"
                        />
                        {/* Gradient Overlay to blend bottom of image */}
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[150%] h-32 bg-gradient-to-t from-white via-white/80 to-transparent"></div>
                    </motion.div>
                )}
            </div>

            {/* Role Selection / Core Features */}
            <div id="roles" className="bg-white py-12 md:py-20 relative z-10 w-full">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center mb-8 md:mb-16 max-w-2xl mx-auto">
                        <h3 className="text-2xl md:text-3xl font-display font-bold text-slate-800 mb-3 md:mb-4">Ecosystem Modules</h3>
                        <p className="text-sm md:text-base text-slate-500">Whether you grow, move, sell, or buy—AgriChain provides a dedicated dashboard for every stakeholder.</p>
                    </div>

                    <motion.div
                        initial={{ y: 40, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ staggerChildren: 0.1 }}
                        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 max-w-7xl mx-auto"
                    >
                        <RoleCard to="/farmer" icon={<Sprout size={isMobile ? 20 : 24} />} label="Farmer" desc="Crop Management" color="group-hover:text-emerald-600" bg="hover:bg-emerald-50" delay={0} />
                        <RoleCard to="/transporter" icon={<Truck size={isMobile ? 20 : 24} />} label="Logistics" desc="Fleet Tracking" color="group-hover:text-blue-600" bg="hover:bg-blue-50" delay={0.1} />
                        <RoleCard to="/distributor" icon={<Database size={isMobile ? 20 : 24} />} label="Distributor" desc="Smart Inventory" color="group-hover:text-amber-600" bg="hover:bg-amber-50" delay={0.2} />
                        <RoleCard to="/retailer" icon={<Store size={isMobile ? 20 : 24} />} label="Retailer" desc="Sales Analytics" color="group-hover:text-orange-600" bg="hover:bg-orange-50" delay={0.3} />
                        <RoleCard to="/admin" icon={<User size={isMobile ? 20 : 24} />} label="Admin" desc="Governance" color="group-hover:text-slate-600" bg="hover:bg-slate-50" delay={0.4} />
                        <RoleCard to="/trace" icon={<Search size={isMobile ? 20 : 24} />} label="Consumer" desc="Verify Origin" color="group-hover:text-teal-600" bg="hover:bg-teal-50" delay={0.5} />
                    </motion.div>
                </div>
            </div>

            {/* Why Choose Us */}
            <div id="features" className="bg-slate-50 py-12 md:py-24 relative overflow-hidden">
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-48 md:w-96 h-48 md:h-96 bg-emerald-200/20 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-48 md:w-96 h-48 md:h-96 bg-blue-200/20 rounded-full blur-3xl pointer-events-none"></div>

                <div className="container mx-auto px-4 md:px-6 relative z-10">
                    <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-center max-w-6xl mx-auto">
                        <div className="bg-white p-2 rounded-2xl shadow-xl shadow-slate-200/50 -rotate-2 md:-rotate-3 hover:rotate-0 transition-transform duration-500 w-full md:w-1/2">
                            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6 md:p-8 h-64 md:h-80 flex flex-col justify-center items-center text-center">
                                <Shield size={isMobile ? 48 : 64} className="text-emerald-500 mb-4 md:mb-6" />
                                <h4 className="font-display font-bold text-xl md:text-2xl text-slate-800 mb-2">Bank-Grade Security</h4>
                                <p className="text-slate-600 text-xs md:text-sm leading-relaxed">Immutable blockchain records ensure that data once written cannot be altered, preventing fraud in the supply chain.</p>
                            </div>
                        </div>
                        <div className="w-full md:w-1/2">
                            <h3 className="text-2xl md:text-4xl font-display font-bold text-slate-900 mb-4 md:mb-6">Why AgriChain?</h3>
                            <div className="space-y-6 md:space-y-8">
                                <FeatureItem
                                    icon={<Leaf size={isMobile ? 18 : 20} />}
                                    title="Sustainable Practices"
                                    desc="Promoting eco-friendly farming through verified carbon footprint tracking."
                                />
                                <FeatureItem
                                    icon={<Globe size={isMobile ? 18 : 20} />}
                                    title="Global Reach"
                                    desc="Connect local farmers to international markets with simplified logistics."
                                />
                                <FeatureItem
                                    icon={<Award size={isMobile ? 18 : 20} />}
                                    title="Fair Trade"
                                    desc="Smart contracts ensure farmers get paid instantly and fairly for their produce."
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-slate-900 text-slate-400 py-8 md:py-12 border-t border-slate-800">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-2 mb-2 md:mb-0">
                            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white">
                                <Sprout size={18} />
                            </div>
                            <span className="font-display font-bold text-lg md:text-xl text-white">AgriChain</span>
                        </div>
                        <div className="flex gap-6 md:gap-8 text-sm font-medium">
                            <a href="#" className="hover:text-white transition-colors">Privacy</a>
                            <a href="#" className="hover:text-white transition-colors">Terms</a>
                            <a href="#" className="hover:text-white transition-colors">Contact</a>
                        </div>
                        <div className="text-xs md:text-sm mt-2 md:mt-0">
                            &copy; 2024 AgriChain Inc.
                        </div>
                    </div>
                </div>
            </footer>

        </div>
    );
};

const StatItem = ({ value, label }) => (
    <div className="text-center">
        <div className="text-2xl md:text-4xl font-display font-bold text-slate-900 mb-0.5 md:mb-1">{value}</div>
        <div className="text-[10px] md:text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</div>
    </div>
);

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

export default Landing;
