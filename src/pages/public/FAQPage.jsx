import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronDown, Search, HelpCircle, ArrowRight,
    Shield, Lock, QrCode, Users, Package, Globe,
    Sprout, Truck, Database, Store, User
} from 'lucide-react';
import LightPageLayout from '../../components/layout/LightPageLayout';

const FAQ_CATEGORIES = [
    {
        label: 'Platform & General',
        icon: Globe,
        color: 'text-emerald-600',
        bg: 'bg-emerald-50',
        items: [
            {
                q: 'What is Farm2Fork?',
                a: 'Farm2Fork is a cryptographically secured agricultural supply chain platform. It connects farmers, transporters, distributors, retailers, and consumers in a single auditable system. Every batch is AES-256-GCM encrypted and HMAC-SHA256 signed — ensuring tamper-proof integrity from farm to fork.',
            },
            {
                q: 'Do I need to install an app?',
                a: 'No. Farm2Fork is a fully web-based platform. Consumers can scan QR codes and view product journeys directly in any smartphone browser — no app download required. Dashboard users access their role-specific interface from any modern browser.',
            },
            {
                q: 'What agricultural products are supported?',
                a: 'Farm2Fork supports all agricultural products — grains, vegetables, fruits, pulses, dairy, spices, organic produce, and processed foods. If it grows on a farm, it can be registered and traced on the platform.',
            },
            {
                q: 'Is Farm2Fork available across India?',
                a: 'Yes. The platform is designed for India\'s agricultural supply chain and works across all states. GPS tracking, regional language support, and low-bandwidth optimisation make it accessible even in rural areas.',
            },
        ],
    },
    {
        label: 'Security & Data Integrity',
        icon: Shield,
        color: 'text-violet-600',
        bg: 'bg-violet-50',
        items: [
            {
                q: 'How does Farm2Fork ensure data integrity?',
                a: 'We use AES-256-GCM field-level encryption and HMAC-SHA256 digital signatures. Each batch record is chain-linked to the previous one — the signature of every record depends on all previous signatures. If any past record is altered, the chain breaks and we detect it instantly.',
            },
            {
                q: 'What is AES-256-GCM encryption?',
                a: 'AES-256-GCM (Advanced Encryption Standard, 256-bit key, Galois/Counter Mode) is a military-grade symmetric encryption algorithm. We use it to encrypt specific sensitive fields — price, GPS coordinates, quantity — at the application layer before they are stored in the database. A unique 128-bit initialization vector is generated for every field write, so identical values stored at different times produce different ciphertext.',
            },
            {
                q: 'What is HMAC-SHA256 chain-linking?',
                a: 'HMAC-SHA256 (Hash-based Message Authentication Code) produces a digital signature for each batch record. We chain-link these: the signature of Batch #N includes the signature of Batch #(N-1) as an input. This means you cannot alter any historical record without breaking all subsequent signatures — making the entire history tamper-evident.',
            },
            {
                q: 'What happens if someone tries to tamper with data?',
                a: 'Farm2Fork re-verifies every batch signature on every server read. If a signature mismatch is detected, the batch is instantly locked, a platform-wide visual warning is triggered, and the incident is logged in the admin audit trail. There is zero tolerance for silent corruption.',
            },
            {
                q: 'Can the database administrator see sensitive data?',
                a: 'No. Sensitive fields are encrypted at the application layer before they reach the database. Even if a database administrator or an attacker exports the raw MongoDB documents, price, coordinates, and quantity remain as ciphertext — unreadable without the application-level encryption key.',
            },
        ],
    },
    {
        label: 'For Farmers',
        icon: Sprout,
        color: 'text-green-600',
        bg: 'bg-green-50',
        items: [
            {
                q: 'How do I register as a farmer?',
                a: 'Sign up at farm2fork.com/signup and select the Farmer role. Your registration request is reviewed by an Admin with KYC context. Once approved, you gain full access to the Farmer Dashboard to create batches, request shipments, and monitor payments.',
            },
            {
                q: 'Is it free for farmers?',
                a: 'Yes. Farmer registration and core batch tracking features are free. Premium analytics and advanced reporting are available on subscription plans for larger farming operations.',
            },
            {
                q: 'How do I get paid?',
                a: 'Payments are triggered automatically during the quality verification step at the distribution centre. When a distributor verifies receipt of your batch, the platform flags the batch for payment settlement — reducing delays and eliminating payment middlemen.',
            },
        ],
    },
    {
        label: 'For Transporters',
        icon: Truck,
        color: 'text-blue-600',
        bg: 'bg-blue-50',
        items: [
            {
                q: 'How does driver GPS tracking work?',
                a: 'Registered drivers use the Driver app, which logs their GPS position in real time. The Transporter Dashboard shows a live fleet map powered by OpenStreetMap with GPS positions, current shipment info, and OSRM-calculated ETAs to destination.',
            },
            {
                q: 'Can I manage multiple vehicles?',
                a: 'Yes. The Logistics Hub supports unlimited vehicle registrations. You can track availability, assign shipments, and monitor all active drivers simultaneously from a single dashboard.',
            },
        ],
    },
    {
        label: 'For Consumers',
        icon: Users,
        color: 'text-teal-600',
        bg: 'bg-teal-50',
        items: [
            {
                q: 'How do I verify a product?',
                a: 'Look for the Farm2Fork QR code on the product packaging. Scan it with your smartphone — no app needed. Within 2 seconds you\'ll see the full journey: farm origin, GPS coordinates, transit events, quality check results, and cryptographic integrity status.',
            },
            {
                q: 'What if the QR scan shows a tampered record?',
                a: 'The trace page prominently displays the integrity status. If a tampered record is detected, a warning is shown and the incident is already locked and flagged in the admin console. You can trust that what the platform shows is either verified-authentic or explicitly flagged as suspicious.',
            },
            {
                q: 'Do I need to create an account to scan?',
                a: 'No account is required to scan a QR code and view a product\'s journey. Creating a free consumer account enables scan history, favourites, and recall alerts for products you\'ve previously scanned.',
            },
        ],
    },
    {
        label: 'Pricing & Plans',
        icon: Package,
        color: 'text-amber-600',
        bg: 'bg-amber-50',
        items: [
            {
                q: 'Is Farm2Fork free to use?',
                a: 'Core features are free for farmers and consumers. Transporters, distributors, and retailers access the platform through role-based subscription plans tailored to their transaction volume.',
            },
            {
                q: 'Are there enterprise options?',
                a: 'Yes. Enterprise plans are available for large retail chains, distributor networks, and logistics companies that need custom integrations, dedicated support, and advanced reporting. Contact our team for pricing.',
            },
        ],
    },
];

const FAQPage = () => {
    const [search, setSearch] = useState('');
    const [openItem, setOpenItem] = useState(null); // "cat-item" key

    const filteredCategories = FAQ_CATEGORIES.map(cat => ({
        ...cat,
        items: cat.items.filter(item =>
            !search ||
            item.q.toLowerCase().includes(search.toLowerCase()) ||
            item.a.toLowerCase().includes(search.toLowerCase())
        ),
    })).filter(cat => cat.items.length > 0);

    return (
        <LightPageLayout
            title="Frequently Asked Questions"
            subtitle="Everything you need to know about Farm2Fork, our cryptographic integrity model, and how each stakeholder role works."
            accentColor="emerald"
        >
            {/* Search */}
            <div className="relative mb-12 max-w-xl mx-auto">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search questions…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl border-2 border-slate-100 bg-white/80 backdrop-blur text-slate-700 placeholder:text-slate-400 text-sm font-medium focus:border-emerald-400 focus:outline-none transition-colors shadow-sm"
                />
            </div>

            {/* Stats */}
            {!search && (
                <div className="grid grid-cols-3 gap-4 mb-12 max-w-lg mx-auto">
                    {[
                        { val: '20+', label: 'Questions' },
                        { val: '6',   label: 'Categories' },
                        { val: '< 2s', label: 'Answers' },
                    ].map((s, i) => (
                        <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                            <p className="text-xl font-black text-slate-900 mb-0.5">{s.val}</p>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Q&A */}
            <div className="space-y-4 mb-16">
                {filteredCategories.length === 0 && (
                    <div className="text-center py-16">
                        <HelpCircle size={40} className="text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-400 font-semibold">No questions match your search.</p>
                    </div>
                )}

                {filteredCategories.map((cat, ci) => {
                    const CatIcon = cat.icon;
                    return (
                        <div key={ci}>
                            {/* Category heading */}
                            <div className={`flex items-center gap-3 mb-3 px-1`}>
                                <div className={`w-8 h-8 rounded-xl ${cat.bg} ${cat.color} flex items-center justify-center`}>
                                    <CatIcon size={16} />
                                </div>
                                <h2 className="font-black text-slate-900 text-base">{cat.label}</h2>
                                <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${cat.bg} ${cat.color}`}>
                                    {cat.items.length}
                                </span>
                            </div>

                            <div className="space-y-2">
                                {cat.items.map((item, qi) => {
                                    const key = `${ci}-${qi}`;
                                    const isOpen = openItem === key;
                                    return (
                                        <motion.div
                                            key={qi}
                                            layout
                                            className="rounded-2xl border border-slate-200/80 overflow-hidden"
                                            style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(12px)' }}
                                        >
                                            <button
                                                onClick={() => setOpenItem(isOpen ? null : key)}
                                                className="w-full flex items-start gap-4 p-5 text-left hover:bg-slate-50/50 transition-colors"
                                            >
                                                <span className={`w-6 h-6 rounded-full ${cat.bg} ${cat.color} flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-black`}>
                                                    {qi + 1}
                                                </span>
                                                <span className="flex-1 font-semibold text-slate-800 text-sm leading-snug">{item.q}</span>
                                                <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.22 }}>
                                                    <ChevronDown size={18} className="text-slate-400 shrink-0" />
                                                </motion.div>
                                            </button>

                                            <AnimatePresence>
                                                {isOpen && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.25 }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="px-5 pb-5 ml-10">
                                                            <p className="text-slate-600 text-sm leading-relaxed">{item.a}</p>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Still confused CTA */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-600 p-8 md:p-12 text-white text-center relative overflow-hidden"
            >
                <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
                <h3 className="text-xl md:text-3xl font-black mb-3 relative z-10">Still have questions?</h3>
                <p className="text-emerald-100 text-sm mb-8 relative z-10 max-w-md mx-auto">
                    Chat with Forge — our AI assistant — or explore the full technical documentation.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center relative z-10">
                    <Link to="/documentation">
                        <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white text-emerald-700 font-black text-sm rounded-xl hover:bg-emerald-50 transition-all">
                            Read Docs <ArrowRight size={15} />
                        </motion.button>
                    </Link>
                    <Link to="/security">
                        <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white/15 text-white border border-white/20 font-black text-sm rounded-xl hover:bg-white/25 transition-all">
                            Security Model
                        </motion.button>
                    </Link>
                </div>
            </motion.div>
        </LightPageLayout>
    );
};

export default FAQPage;
