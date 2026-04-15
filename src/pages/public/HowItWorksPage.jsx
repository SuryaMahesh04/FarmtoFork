import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
    Sprout, Truck, Database, QrCode, Shield, Lock,
    Fingerprint, CheckCircle2, ArrowRight, Key, Activity
} from 'lucide-react';
import LightPageLayout from '../../components/layout/LightPageLayout';

const STEPS = [
    {
        number: '01',
        icon: Sprout,
        title: 'Farmer Creates Batch',
        color: 'from-emerald-500 to-green-600',
        bg: 'bg-emerald-50',
        textColor: 'text-emerald-600',
        borderColor: 'border-emerald-200',
        spotlight: 'rgba(16,185,129,0.12)',
        details: [
            'Farmer logs in and creates a new harvest batch',
            'Enters: crop type, quantity, harvest date, GPS coordinates, price, certifications',
            'AES-256-GCM encrypts price + coordinates before DB write',
            'A unique 128-bit random IV is generated per field',
            'An HMAC-SHA256 signature is computed over the batch data',
            'A unique QR code is generated and stored against the batch',
        ],
        techNote: 'AES-256-GCM encryption with random IV + GCM authentication tag',
    },
    {
        number: '02',
        icon: Truck,
        title: 'Transporter Picks Up',
        color: 'from-blue-500 to-cyan-600',
        bg: 'bg-blue-50',
        textColor: 'text-blue-600',
        borderColor: 'border-blue-200',
        spotlight: 'rgba(59,130,246,0.12)',
        details: [
            'Farmer raises a shipment request linked to the batch',
            'Transporter views and accepts the request',
            'Admin/transporter assigns a registered driver',
            'Driver begins transit — GPS position logged in real time',
            'The pickup event is HMAC-SHA256 signed and chain-linked',
            'New batch signature = HMAC(currentData + previousSignature)',
        ],
        techNote: 'Sequential chain-linking: each signature includes the previous one',
    },
    {
        number: '03',
        icon: Database,
        title: 'Distributor Verifies Quality',
        color: 'from-amber-500 to-orange-500',
        bg: 'bg-amber-50',
        textColor: 'text-amber-600',
        borderColor: 'border-amber-200',
        spotlight: 'rgba(245,158,11,0.12)',
        details: [
            'Distributor receives the batch and runs a quality check',
            'Server re-verifies HMAC-SHA256 signature before accepting',
            'Quality grade, freshness score, and compliance notes added',
            'Delivery event is signed and chain-linked to previous signature',
            'Payment auto-releases to the farmer on verification',
            'All events visible in admin audit trail',
        ],
        techNote: 'Zero-tolerance tamper protocol: signature mismatch = batch locked',
    },
    {
        number: '04',
        icon: Shield,
        title: 'Retailer Lists Product',
        color: 'from-orange-500 to-red-500',
        bg: 'bg-orange-50',
        textColor: 'text-orange-600',
        borderColor: 'border-orange-200',
        spotlight: 'rgba(249,115,22,0.12)',
        details: [
            'Retailer places a purchase order with the distributor',
            'Upon fulfilment, batch is listed on the retail dashboard',
            'Product appears with blockchain-equivalent cryptographic provenance',
            'The QR code is printed or displayed on each unit',
            'Consumers can scan at any point on the shelf',
        ],
        techNote: 'Full chain of custody now cryptographically auditable end-to-end',
    },
    {
        number: '05',
        icon: QrCode,
        title: 'Consumer Scans & Traces',
        color: 'from-teal-500 to-emerald-600',
        bg: 'bg-teal-50',
        textColor: 'text-teal-600',
        borderColor: 'border-teal-200',
        spotlight: 'rgba(20,184,166,0.12)',
        details: [
            'Consumer opens the Farm2Fork trace app or web page',
            'QR code scans in < 2 seconds — no app download needed',
            'Farm origin, GPS map, farmer profile displayed',
            'Full timestamped timeline: harvest → transit → distribution → retail',
            'Cryptographic integrity status shown prominently',
            'Scan saved to personal history for dietary tracking',
        ],
        techNote: 'AES-256-GCM decrypted fields revealed only to authorised consumers',
    },
];

const HowItWorksPage = () => {
    return (
        <LightPageLayout
            title="How It Works"
            subtitle="A step-by-step walkthrough of Farm2Fork's cryptographically secured supply chain — from harvest to QR scan."
            accentColor="emerald"
        >
            {/* Intro */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
                {[
                    { icon: Lock,        label: 'AES-256-GCM',   desc: 'Field-level encryption',     color: 'text-violet-600', bg: 'bg-violet-50' },
                    { icon: Fingerprint, label: 'HMAC-SHA256',   desc: 'Signature chain-linking',    color: 'text-blue-600',   bg: 'bg-blue-50' },
                    { icon: Activity,    label: 'Zero-Tolerance', desc: 'Tamper detection on read',  color: 'text-rose-600',   bg: 'bg-rose-50' },
                ].map((item, i) => {
                    const Icon = item.icon;
                    return (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-center gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100"
                        >
                            <div className={`w-10 h-10 rounded-xl ${item.bg} ${item.color} flex items-center justify-center shrink-0`}>
                                <Icon size={20} />
                            </div>
                            <div>
                                <p className="font-black text-slate-900 text-sm">{item.label}</p>
                                <p className="text-xs text-slate-400 font-semibold">{item.desc}</p>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Steps timeline */}
            <div className="relative mb-20">
                {/* Vertical line on desktop */}
                <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-emerald-300 via-slate-200 to-teal-300 hidden md:block" style={{ left: '27px' }} />

                <div className="space-y-0">
                    {STEPS.map((step, i) => {
                        const Icon = step.icon;
                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -24 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: '-60px' }}
                                transition={{ duration: 0.5, delay: i * 0.05 }}
                                className="relative flex gap-6 md:gap-10 pb-10 last:pb-0"
                            >
                                {/* Step number bubble */}
                                <div className="hidden md:flex flex-col items-center shrink-0" style={{ width: '56px' }}>
                                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white font-black text-lg shadow-lg z-10`}>
                                        {step.number}
                                    </div>
                                </div>

                                {/* Card */}
                                <div
                                    className={`flex-1 rounded-3xl border ${step.borderColor} p-6 md:p-8`}
                                    style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(12px)' }}
                                >
                                    {/* Mobile step badge */}
                                    <div className={`inline-flex items-center gap-2 mb-4 md:hidden px-3 py-1.5 rounded-xl bg-gradient-to-r ${step.color}`}>
                                        <span className="text-white font-black text-xs">Step {step.number}</span>
                                    </div>

                                    <div className="flex items-start gap-4 mb-5">
                                        <div className={`w-11 h-11 rounded-2xl ${step.bg} ${step.textColor} flex items-center justify-center shrink-0`}>
                                            <Icon size={22} />
                                        </div>
                                        <div>
                                            <h3 className="font-black text-slate-900 text-xl tracking-tight">{step.title}</h3>
                                        </div>
                                    </div>

                                    <ul className="space-y-2.5 mb-5">
                                        {step.details.map((d, di) => (
                                            <li key={di} className="flex items-start gap-3 text-sm text-slate-600">
                                                <CheckCircle2 size={14} className={`shrink-0 mt-0.5 ${step.textColor}`} />
                                                {d}
                                            </li>
                                        ))}
                                    </ul>

                                    {/* Tech note */}
                                    <div className={`flex items-center gap-2.5 px-4 py-3 rounded-xl ${step.bg} border ${step.borderColor}`}>
                                        <Key size={14} className={step.textColor} />
                                        <p className={`text-xs font-bold ${step.textColor}`}>{step.techNote}</p>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Security summary callout */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="rounded-3xl bg-slate-900 p-8 md:p-14 text-white relative overflow-hidden mb-12"
            >
                <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-emerald-500/10 blur-2xl" />
                <div className="relative z-10 max-w-3xl">
                    <p className="text-xs font-black uppercase tracking-widest text-emerald-400 mb-4">Security Summary</p>
                    <h2 className="text-2xl md:text-4xl font-black tracking-tight mb-6">
                        Every step is cryptographically signed. Every read is cryptographically verified.
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                            { icon: Lock,        label: 'AES-256-GCM', desc: 'Field encryption with unique IV per write' },
                            { icon: Fingerprint, label: 'HMAC-SHA256',  desc: 'Sequential chain-linked signatures' },
                            { icon: Activity,    label: 'Tamper Guard', desc: 'Auto-lock on signature mismatch' },
                        ].map((item, i) => {
                            const Icon = item.icon;
                            return (
                                <div key={i} className="flex items-start gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
                                    <Icon size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-black text-white text-sm">{item.label}</p>
                                        <p className="text-slate-400 text-xs">{item.desc}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </motion.div>

            {/* CTA */}
            <div className="text-center">
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link to="/security">
                        <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 text-white font-black text-sm rounded-2xl hover:bg-slate-800 transition-all">
                            Full Security Model <ArrowRight size={16} />
                        </motion.button>
                    </Link>
                    <Link to="/signup">
                        <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-emerald-600 text-white font-black text-sm rounded-2xl hover:bg-emerald-700 transition-all">
                            Get Started
                        </motion.button>
                    </Link>
                </div>
            </div>
        </LightPageLayout>
    );
};

export default HowItWorksPage;
