import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sprout, Truck, Store, Database, Search, ArrowRight } from 'lucide-react';
import logo from '../assets/logo2.png';

const SignupPage = () => {
    const roles = [
        {
            id: 'farmer',
            label: 'Farmer',
            desc: 'Register my farm & crops',
            icon: Sprout,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
            hover: 'hover:border-emerald-200 hover:shadow-emerald-500/10',
            path: '/onboarding/farmer'
        },
        {
            id: 'distributor',
            label: 'Distributor',
            desc: 'Manage warehouse & stock',
            icon: Database,
            color: 'text-amber-600',
            bg: 'bg-amber-50',
            hover: 'hover:border-amber-200 hover:shadow-amber-500/10',
            path: '/onboarding/distributor'
        },
        {
            id: 'transporter',
            label: 'Transporter',
            desc: 'Fleet & logistics provider',
            icon: Truck,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
            hover: 'hover:border-blue-200 hover:shadow-blue-500/10',
            path: '/onboarding/transporter'
        },
        {
            id: 'retailer',
            label: 'Retailer',
            desc: 'Sell to end consumers',
            icon: Store,
            color: 'text-purple-600',
            bg: 'bg-purple-50',
            hover: 'hover:border-purple-200 hover:shadow-purple-500/10',
            path: '/onboarding/retailer'
        },
        {
            id: 'consumer',
            label: 'Consumer',
            desc: 'Trace & verify products',
            icon: Search,
            color: 'text-teal-600',
            bg: 'bg-teal-50',
            hover: 'hover:border-teal-200 hover:shadow-teal-500/10',
            path: '/trace'
        }
    ];

    return (
        <div className="h-screen bg-slate-50 flex flex-col justify-center overflow-hidden p-6">
            <div className="max-w-6xl mx-auto w-full max-h-screen overflow-y-auto px-2">
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center gap-3 mb-6 justify-center">
                        <img src={logo} alt="Farm2Fork" className="h-14 w-auto" />
                        <span className="font-display font-bold text-3xl tracking-tight text-slate-900">
                            Farm<span className="text-emerald-600">2</span>Fork
                        </span>
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-4">
                        Select your <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">role</span>
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Choose your role to get started with the transparent agriculture supply chain network.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
                    {roles.map((role, index) => (
                        <Link to={role.path} key={role.id} className="group h-full">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={`
                                    h-full bg-white rounded-2xl p-6 border-2 border-slate-100 shadow-sm transition-all duration-300
                                    ${role.hover} group-hover:-translate-y-2 relative overflow-hidden flex flex-col items-center text-center
                                `}
                            >
                                <div className={`w-16 h-16 rounded-2xl ${role.bg} flex items-center justify-center ${role.color} mb-6 group-hover:scale-110 transition-transform`}>
                                    <role.icon size={32} strokeWidth={1.5} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 mb-2">{role.label}</h3>
                                <p className="text-sm text-slate-500 mb-6 flex-grow">{role.desc}</p>

                                <span className={`flex items-center gap-2 text-sm font-semibold ${role.color}`}>
                                    Get Started <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </span>

                                {/* Decorative bg blob */}
                                <div className={`absolute -bottom-10 -right-10 w-24 h-24 ${role.bg} rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity`}></div>
                            </motion.div>
                        </Link>
                    ))}
                </div>

                <div className="text-center">
                    <p className="text-slate-600">
                        Already have an account?{' '}
                        <Link to="/login" className="font-semibold text-emerald-600 hover:text-emerald-500 transition-colors">
                            Sign in instead
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
