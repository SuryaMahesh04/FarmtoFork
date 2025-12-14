import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sprout, Truck, Store, User, Database, Search, Shield, Leaf, BarChart3, Globe, Award, ArrowRight, CheckCircle2, Menu, X, Zap, Lock, Clock, TrendingUp, Users, Package, Star, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/ui/Button';
import heroImage from '../assets/image.png';
import logo from '../assets/logo2.png';
import useMediaQuery from '../utils/useMediaQuery';

const Landing = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const isMobile = useMediaQuery('(max-width: 768px)');
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
    const [currentTestimonial, setCurrentTestimonial] = useState(0);
    const [faqSearch, setFaqSearch] = useState('');
    const [isPaused, setIsPaused] = useState(false);

    // Cursor tracking
    React.useEffect(() => {
        const handleMouseMove = (e) => {
            setCursorPos({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Testimonials carousel auto-rotate
    React.useEffect(() => {
        if (isPaused) return;
        const interval = setInterval(() => {
            setCurrentTestimonial(prev => (prev + 1) % 5);
        }, 5000);
        return () => clearInterval(interval);
    }, [isPaused]);

    const testimonials = [
        { name: 'Ravi Kumar', role: 'Farmer, Punjab', text: 'Farm2Fork gave me direct access to buyers. I get fair prices and instant payments through smart contracts. Game changer!', rating: 5, avatar: '🧑‍🌾' },
        { name: 'Sarah Mitchell', role: 'Consumer, Mumbai', text: 'I can finally see where my food comes from! Scanning the QR code shows me everything from the farm to my local store.', rating: 5, avatar: '👩' },
        { name: 'Green Logistics Co.', role: 'Transporter', text: 'The fleet tracking and automated documentation saves us hours every day. Our delivery efficiency increased by 40%.', rating: 5, avatar: '🚛' },
        { name: 'Kumar Distributors', role: 'Distributor, Delhi', text: 'Inventory management became a breeze. Real-time updates help us reduce waste and optimize storage.', rating: 5, avatar: '📦' },
        { name: 'FreshMart Retail', role: 'Retailer, Bangalore', text: 'Our customers love the transparency! They can verify every product. Sales increased by 25% since joining.', rating: 5, avatar: '🏪' }
    ];

    const faqs = [
        { q: 'What is Farm2Fork?', a: 'Farm2Fork is a blockchain-based agriculture supply chain platform that enables complete transparency from farm to consumer. Every transaction is recorded on an immutable ledger.', icon: '🌾' },
        { q: 'How does blockchain ensure transparency?', a: 'Blockchain creates an unchangeable record of every step in the supply chain. Once data is written, it cannot be altered, ensuring 100% authentic tracking.', icon: '🔒' },
        { q: 'Is it free to use?', a: 'We offer different plans for different stakeholders. Farmers can register for free, while enterprise features require a subscription. Contact us for pricing details.', icon: '💰' },
        { q: 'How do I verify a product?', a: 'Simply scan the QR code on the product packaging using your smartphone. You will instantly see the complete journey from farm to store.', icon: '📱' },
        { q: 'What kind of products can be tracked?', a: 'Farm2Fork supports tracking of all agricultural products including grains, vegetables, fruits, dairy, and organic produce.', icon: '🥬' },
        { q: 'How secure is the platform?', a: 'We use bank-grade encryption and blockchain technology to ensure all data is secure and tamper-proof. Your information is protected at every level.', icon: '🛡️' }
    ];

    const filteredFaqs = faqs.filter(faq =>
        faq.q.toLowerCase().includes(faqSearch.toLowerCase()) ||
        faq.a.toLowerCase().includes(faqSearch.toLowerCase())
    );

    return (
        <div className="relative min-h-screen overflow-x-hidden font-sans text-slate-800 bg-white flex flex-col selection:bg-emerald-100 selection:text-emerald-900">

            {/* Navbar */}
            <nav className="fixed top-0 inset-x-0 z-50 px-4 md:px-6 py-4 pointer-events-none">
                <div className="max-w-7xl mx-auto w-full pointer-events-auto">
                    <div className="bg-white/70 backdrop-blur-xl border border-white/40 shadow-sm rounded-full px-4 md:px-6 py-3 flex items-center justify-between">
                        <Link to="/" className="flex items-center gap-2 md:gap-3">
                            <img
                                src={logo}
                                alt="Farm2Fork Logo"
                                className="h-14 md:h-16 w-auto object-contain"
                            />
                            <span className="font-display font-bold text-lg md:text-xl tracking-tight text-slate-900">
                                Farm<span className="text-emerald-700">2</span>Fork
                            </span>
                        </Link>

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

            {/* Interactive Cursor Spotlight Effect - Desktop Only */}
            {!isMobile && (
                <div
                    className="pointer-events-none fixed inset-0 z-50 transition-opacity duration-300"
                    style={{
                        background: `radial-gradient(600px circle at ${cursorPos.x}px ${cursorPos.y}px, rgba(16, 185, 129, 0.08), transparent 80%)`
                    }}
                />
            )}

            {/* Partner Organizations - Simple and Easy to Update */}
            <div className="bg-slate-50 py-12 md:py-20">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center mb-12">
                        <h3 className="text-2xl md:text-3xl font-display font-bold text-slate-900 mb-3">Trusted by Leading Organizations</h3>
                        <p className="text-slate-600 text-sm md:text-base">Join thousands of verified stakeholders in the agriculture supply chain</p>
                    </div>

                    {/* Partner Logos Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-8 max-w-6xl mx-auto">
                        {[
                            { name: 'Farmer Co-op Network', icon: '🌾' },
                            { name: 'Agricultural Board', icon: '🏛️' },
                            { name: 'Organic Certified', icon: '✓' },
                            { name: 'Quality Standards', icon: '⭐' },
                            { name: 'Logistics Partners', icon: '🚛' },
                            { name: 'Retail Alliance', icon: '🏪' }
                        ].map((partner, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md hover:border-emerald-200 transition-all group"
                            >
                                <div className="text-4xl md:text-5xl text-center mb-3 group-hover:scale-110 transition-transform">
                                    {partner.icon}
                                </div>
                                <p className="text-xs md:text-sm font-medium text-slate-700 text-center leading-tight">
                                    {partner.name}
                                </p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Simple Stats Banner */}
                    <div className="mt-12 md:mt-16 grid grid-cols-3 gap-4 md:gap-8 max-w-3xl mx-auto">
                        <div className="text-center">
                            <p className="text-3xl md:text-4xl font-bold text-emerald-600 mb-2">10k+</p>
                            <p className="text-sm text-slate-600">Verified Users</p>
                        </div>
                        <div className="text-center">
                            <p className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">50M+</p>
                            <p className="text-sm text-slate-600">Products Tracked</p>
                        </div>
                        <div className="text-center">
                            <p className="text-3xl md:text-4xl font-bold text-amber-600 mb-2">100%</p>
                            <p className="text-sm text-slate-600">Transparent</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Interactive 3D Tilt Cards */}
            <div className="bg-white py-12 md:py-20">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center mb-12">
                        <h3 className="text-2xl md:text-4xl font-display font-bold text-slate-900 mb-4">Interactive Product Scanner</h3>
                        <p className="text-slate-600 text-sm md:text-base">Hover over products to see their blockchain journey</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {[
                            { name: 'Organic Wheat', origin: 'Punjab Farms', id: '#BTC-0x7F2A', color: 'from-amber-500 to-orange-500' },
                            { name: 'Fresh Tomatoes', origin: 'Maharashtra', id: '#BTC-0x9C4E', color: 'from-red-500 to-pink-500' },
                            { name: 'Basmati Rice', origin: 'Haryana Fields', id: '#BTC-0x1A8B', color: 'from-green-500 to-emerald-500' }
                        ].map((product, i) => (
                            <TiltCard key={i} product={product} cursorPos={cursorPos} isMobile={isMobile} />
                        ))}
                    </div>
                </div>
            </div>

            {/* How It Works */}
            <div className="bg-white py-12 md:py-24 relative z-10">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center mb-12 md:mb-20 max-w-3xl mx-auto">
                        <h3 className="text-2xl md:text-4xl font-display font-bold text-slate-900 mb-4">How It Works</h3>
                        <p className="text-slate-600 text-sm md:text-base">From farm to your table, every step is tracked, verified, and transparent on the blockchain.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-6xl mx-auto">
                        {[
                            { step: '01', icon: <Sprout size={28} />, title: 'Farmer Registers', desc: 'Farmers create batches and upload crop details to the blockchain.' },
                            { step: '02', icon: <Truck size={28} />, title: 'Transportation Tracked', desc: 'Real-time GPS tracking ensures transparency during transit.' },
                            { step: '03', icon: <Database size={28} />, title: 'Quality Verification', desc: 'Distributors verify quality and update batch status instantly.' },
                            { step: '04', icon: <Search size={28} />, title: 'Consumer Scans', desc: 'End users scan QR codes to see complete product journey.' }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.15 }}
                                className="relative"
                            >
                                <div className="bg-gradient-to-br from-emerald-50 to-white p-6 md:p-8 rounded-2xl border border-emerald-100 hover:shadow-xl transition-all group">
                                    <div className="text-6xl md:text-7xl font-display font-black text-emerald-100 absolute top-4 right-4 group-hover:scale-110 transition-transform">{item.step}</div>
                                    <div className="relative z-10">
                                        <div className="w-14 h-14 rounded-full bg-emerald-500 text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                            {item.icon}
                                        </div>
                                        <h4 className="font-display font-bold text-lg md:text-xl text-slate-800 mb-2">{item.title}</h4>
                                        <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                                {i < 3 && !isMobile && (
                                    <ArrowRight className="absolute top-1/2 -right-4 -translate-y-1/2 text-emerald-300" size={32} />
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>


            {/* Interactive Testimonials Carousel */}
            <div className="bg-gradient-to-b from-slate-50 to-white py-12 md:py-24 relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-20 left-10 w-64 h-64 bg-emerald-200/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-200/10 rounded-full blur-3xl"></div>
                </div>

                <div className="container mx-auto px-4 md:px-6 relative z-10">
                    <div className="text-center mb-12 md:mb-16">
                        <h3 className="text-2xl md:text-4xl font-display font-bold text-slate-900 mb-4">Trusted by Thousands</h3>
                        <p className="text-slate-600 text-sm md:text-base">See what our community is saying about Farm2Fork</p>
                    </div>

                    <div className="max-w-4xl mx-auto relative">
                        {/* Main Testimonial Card */}
                        <motion.div
                            key={currentTestimonial}
                            initial={{ opacity: 0, scale: 0.95, rotateY: -10 }}
                            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                            transition={{ duration: 0.6, type: "spring" }}
                            onMouseEnter={() => setIsPaused(true)}
                            onMouseLeave={() => setIsPaused(false)}
                            className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl border-2 border-slate-100 relative"
                        >
                            <div className="absolute -top-6 left-8 w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-2xl shadow-lg">
                                {testimonials[currentTestimonial].avatar}
                            </div>

                            <div className="flex gap-2 mb-6 mt-2">
                                {[...Array(testimonials[currentTestimonial].rating)].map((_, j) => (
                                    <Star key={j} size={20} className="fill-amber-400 text-amber-400" />
                                ))}
                            </div>

                            <p className="text-slate-700 text-lg md:text-xl italic leading-relaxed mb-8">
                                "{testimonials[currentTestimonial].text}"
                            </p>

                            <div>
                                <p className="font-bold text-slate-900 text-lg">{testimonials[currentTestimonial].name}</p>
                                <p className="text-sm text-slate-500">{testimonials[currentTestimonial].role}</p>
                            </div>

                            <div className="absolute top-8 right-8 text-6xl md:text-8xl text-emerald-100 font-serif select-none">"</div>
                        </motion.div>

                        {/* Navigation Controls */}
                        <div className="flex items-center justify-center gap-6 mt-8">
                            <button
                                onClick={() => setCurrentTestimonial(prev => (prev - 1 + testimonials.length) % testimonials.length)}
                                className="w-10 h-10 rounded-full bg-white border-2 border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 transition-all flex items-center justify-center group"
                            >
                                <ChevronDown size={20} className="rotate-90 text-slate-600 group-hover:text-emerald-600" />
                            </button>

                            {/* Progress Dots */}
                            <div className="flex gap-2">
                                {testimonials.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentTestimonial(i)}
                                        className={`h-2 rounded-full transition-all ${i === currentTestimonial
                                            ? 'w-8 bg-emerald-500'
                                            : 'w-2 bg-slate-300 hover:bg-slate-400'
                                            }`}
                                    />
                                ))}
                            </div>

                            <button
                                onClick={() => setCurrentTestimonial(prev => (prev + 1) % testimonials.length)}
                                className="w-10 h-10 rounded-full bg-white border-2 border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 transition-all flex items-center justify-center group"
                            >
                                <ChevronDown size={20} className="-rotate-90 text-slate-600 group-hover:text-emerald-600" />
                            </button>
                        </div>

                        {isPaused && (
                            <p className="text-center text-xs text-slate-400 mt-4">Auto-play paused</p>
                        )}
                    </div>
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

            {/* Comprehensive Benefits Grid */}
            <div className="bg-white py-12 md:py-24">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center mb-12 md:mb-16">
                        <h3 className="text-2xl md:text-4xl font-display font-bold text-slate-900 mb-4">Platform Benefits</h3>
                        <p className="text-slate-600 text-sm md:text-base max-w-2xl mx-auto">Discover how our blockchain technology transforms the agriculture supply chain</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
                        {[
                            { icon: <Zap size={24} />, title: 'Instant Settlements', desc: 'Smart contracts enable automatic, instant payments to farmers upon delivery verification', color: 'text-amber-600', bg: 'bg-amber-50' },
                            { icon: <Lock size={24} />, title: 'Tamper-Proof Records', desc: 'Blockchain ensures all data is immutable and cannot be altered by anyone', color: 'text-blue-600', bg: 'bg-blue-50' },
                            { icon: <Clock size={24} />, title: 'Real-Time Tracking', desc: 'Monitor shipments 24/7 with GPS integration and instant status updates', color: 'text-green-600', bg: 'bg-green-50' },
                            { icon: <TrendingUp size={24} />, title: 'Market Analytics', desc: 'Data-driven insights help farmers optimize pricing and harvest timing', color: 'text-purple-600', bg: 'bg-purple-50' },
                            { icon: <Users size={24} />, title: 'Community Network', desc: 'Connect with verified buyers, sellers, and logistics partners nationwide', color: 'text-teal-600', bg: 'bg-teal-50' },
                            { icon: <Package size={24} />, title: 'Batch Traceability', desc: 'Track every product from seed to sale with complete transparency', color: 'text-orange-600', bg: 'bg-orange-50' }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white p-6 rounded-xl border border-slate-100 hover:shadow-lg transition-all group"
                            >
                                <div className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center ${item.color} mb-4 group-hover:scale-110 transition-transform`}>
                                    {item.icon}
                                </div>
                                <h4 className="font-bold text-lg text-slate-800 mb-2">{item.title}</h4>
                                <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Technology Stack */}
            <div className="bg-gradient-to-b from-slate-900 to-slate-800 py-12 md:py-20 text-white">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center mb-12">
                        <h3 className="text-2xl md:text-4xl font-display font-bold mb-4">Built with Cutting-Edge Technology</h3>
                        <p className="text-slate-400 text-sm md:text-base">Enterprise-grade infrastructure powering transparent agriculture</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-5xl mx-auto">
                        {[
                            { name: 'Blockchain', desc: 'Ethereum Network' },
                            { name: 'Smart Contracts', desc: 'Solidity' },
                            { name: 'Storage', desc: 'IPFS Distributed' },
                            { name: 'Security', desc: 'End-to-End Encryption' }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="text-center p-6 bg-slate-800/50 rounded-xl border border-slate-700 hover:border-emerald-500/50 transition-all"
                            >
                                <p className="font-display font-bold text-lg md:text-xl mb-1">{item.name}</p>
                                <p className="text-xs md:text-sm text-slate-400">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Interactive FAQ Section */}
            <div className="bg-white py-12 md:py-24">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center mb-12 md:mb-16">
                        <h3 className="text-2xl md:text-4xl font-display font-bold text-slate-900 mb-4">Frequently Asked Questions</h3>
                        <p className="text-slate-600 text-sm md:text-base">Everything you need to know about Farm2Fork</p>
                    </div>

                    {/* Search Bar */}
                    <div className="max-w-2xl mx-auto mb-8">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search FAQs..."
                                value={faqSearch}
                                onChange={(e) => setFaqSearch(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 focus:outline-none transition-all text-slate-700 placeholder:text-slate-400"
                            />
                        </div>
                        {faqSearch && (
                            <p className="text-sm text-slate-500 mt-3 text-center">
                                Found {filteredFaqs.length} result{filteredFaqs.length !== 1 ? 's' : ''}
                            </p>
                        )}
                    </div>

                    <div className="max-w-3xl mx-auto space-y-4">
                        {filteredFaqs.length > 0 ? (
                            filteredFaqs.map((item, i) => (
                                <motion.details
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="bg-gradient-to-br from-white to-slate-50 rounded-2xl border-2 border-slate-100 group hover:border-emerald-200 hover:shadow-lg transition-all relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

                                    <summary className="cursor-pointer p-5 md:p-6 font-semibold text-slate-800 flex items-center gap-4 hover:text-emerald-600 transition-colors relative z-10">
                                        <span className="text-2xl flex-shrink-0 group-open:scale-110 transition-transform">{item.icon}</span>
                                        <span className="text-sm md:text-base flex-1">{item.q}</span>
                                        <ChevronDown size={24} className="flex-shrink-0 text-slate-400 group-open:rotate-180 group-open:text-emerald-600 transition-all duration-300" />
                                    </summary>

                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: "auto" }}
                                        className="px-5 md:px-6 pb-5 md:pb-6 ml-12 text-sm md:text-base text-slate-600 leading-relaxed relative z-10"
                                    >
                                        {item.a}
                                    </motion.div>
                                </motion.details>
                            ))
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-slate-500 text-lg mb-2">No FAQs found</p>
                                <p className="text-slate-400 text-sm">Try a different search term</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Final CTA */}
            <div className="bg-gradient-to-br from-emerald-600 to-teal-600 py-16 md:py-24">
                <div className="container mx-auto px-4 md:px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="max-w-3xl mx-auto"
                    >
                        <h3 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">Ready to Transform Agriculture?</h3>
                        <p className="text-emerald-50 text-base md:text-lg mb-8 md:mb-10">Join thousands of farmers, transporters, and distributors building a transparent food system.</p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/farmer">
                                <button className="px-8 py-4 bg-white text-emerald-600 font-bold rounded-full hover:bg-emerald-50 transition-all shadow-lg hover:shadow-xl w-full sm:w-auto">
                                    Get Started Free
                                </button>
                            </Link>
                            <button className="px-8 py-4 bg-emerald-700 text-white font-bold rounded-full hover:bg-emerald-800 transition-all border-2 border-white/20 w-full sm:w-auto">
                                Contact Sales
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-slate-900 text-slate-400 py-8 md:py-12 border-t border-slate-800">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <Link to="/" className="flex items-center gap-2 md:gap-3 mb-2 md:mb-0">
                            <img
                                src={logo}
                                alt="Farm2Fork Logo"
                                className="h-12 md:h-16 w-auto object-contain brightness-0 invert"
                            />
                            <span className="font-display font-bold text-xl md:text-2xl text-white">
                                Farm<span className="text-emerald-400">2</span>Fork
                            </span>
                        </Link>
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

const TiltCard = ({ product, cursorPos, isMobile }) => {
    const cardRef = React.useRef(null);
    const [transform, setTransform] = React.useState('');
    const [isHovered, setIsHovered] = React.useState(false);

    const handleMouseMove = (e) => {
        if (isMobile || !cardRef.current) return;

        const card = cardRef.current;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;

        setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`);
    };

    const handleMouseLeave = () => {
        setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
        setIsHovered(false);
    };

    return (
        <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            className="relative group cursor-pointer"
            style={{
                transform: transform,
                transition: 'transform 0.1s ease-out'
            }}
        >
            <div className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden shadow-lg hover:shadow-2xl transition-shadow">
                <div className={`h-48 bg-gradient-to-br ${product.color} relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Package size={64} className="text-white/90" strokeWidth={1.5} />
                    </div>
                    {isHovered && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-4 right-4 bg-white rounded-full p-2"
                        >
                            <CheckCircle2 size={24} className="text-green-600" />
                        </motion.div>
                    )}
                </div>
                <div className="p-6">
                    <h4 className="font-display font-bold text-xl text-slate-800 mb-2">{product.name}</h4>
                    <p className="text-sm text-slate-600 mb-3">Origin: {product.origin}</p>
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-slate-400">{product.id}</span>
                        <Shield size={16} className="text-emerald-600" />
                    </div>
                </div>
            </div>
            {isHovered && !isMobile && (
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-2xl pointer-events-none"></div>
            )}
        </div>
    );
};

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
