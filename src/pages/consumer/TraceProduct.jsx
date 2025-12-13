import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Truck, User, Leaf, CheckCircle, Search, ArrowRight } from 'lucide-react';
import { farmerBatches } from '../../data/dummyData';

const TraceProduct = () => {
    const { batchId } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate loading for effect
        setTimeout(() => {
            const found = farmerBatches.find(b => b.id === batchId) || farmerBatches[0];
            setProduct(found);
            setLoading(false);
        }, 1500);
    }, [batchId]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-sage-50">
                <div className="w-16 h-16 border-4 border-sage-200 border-t-sage-500 rounded-full animate-spin mb-4"></div>
                <p className="text-sage-600 animate-pulse">Tracing provenance on blockchain...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-sage-50 pb-20">
            {/* Hero Section */}
            <div className="relative h-[400px] overflow-hidden">
                <div className="absolute inset-0 bg-slate-900/40 z-10"></div>
                <img
                    src={`https://source.unsplash.com/1600x900/?${product.crop.split(' ')[0]},farm`}
                    className="w-full h-full object-cover"
                    alt="Farm background"
                />
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white text-center p-4">
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-xs font-medium uppercase tracking-wider mb-4 inline-block">
                            Verified Blockchain Trace
                        </span>
                        <h1 className="text-5xl md:text-7xl font-display font-bold mb-4">{product.crop}</h1>
                        <p className="text-xl opacity-90">{product.variety} Variety • Batch #{product.id}</p>
                    </motion.div>
                </div>
            </div>

            {/* Content Container */}
            <div className="max-w-3xl mx-auto px-4 -mt-20 relative z-30">

                {/* Summary Card */}
                <motion.div
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-white rounded-3xl shadow-xl p-8 mb-8"
                >
                    <div className="flex flex-wrap justify-center gap-8 md:gap-16 text-center">
                        <div>
                            <div className="w-12 h-12 rounded-full bg-sage-50 text-sage-600 flex items-center justify-center mx-auto mb-2">
                                <User size={24} />
                            </div>
                            <p className="text-xs text-slate-400 uppercase tracking-wide">Farmer</p>
                            <p className="font-semibold text-slate-700">Surya Mahesh</p>
                        </div>
                        <div>
                            <div className="w-12 h-12 rounded-full bg-wheat-50 text-wheat-600 flex items-center justify-center mx-auto mb-2">
                                <MapPin size={24} />
                            </div>
                            <p className="text-xs text-slate-400 uppercase tracking-wide">Origin</p>
                            <p className="font-semibold text-slate-700">Gunter, AP</p>
                        </div>
                        <div>
                            <div className="w-12 h-12 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center mx-auto mb-2">
                                <Calendar size={24} />
                            </div>
                            <p className="text-xs text-slate-400 uppercase tracking-wide">Harvested</p>
                            <p className="font-semibold text-slate-700">{product.date}</p>
                        </div>
                    </div>
                </motion.div>

                {/* Journey Timeline */}
                <div className="space-y-8 pl-4 md:pl-0">
                    <h2 className="text-2xl font-display font-bold text-center text-slate-800 mb-8">The Journey to You</h2>

                    <div className="relative border-l-2 border-sage-200 ml-4 md:ml-12 space-y-12 pb-12">
                        <TimelineEvent
                            icon={Leaf}
                            title="Harvested & Quality Check"
                            date={product.date}
                            location="Guntur Farms, AP"
                            details="Crop harvested at peak maturity. Quality grade A+ verified."
                            color="bg-sage-500"
                        />
                        <TimelineEvent
                            icon={Truck}
                            title="Transported to Warehouse"
                            date="2023-11-21"
                            location="Via Express Logistics"
                            details="Temperature controlled transport (-4°C maintained)."
                            color="bg-sky-500"
                        />
                        <TimelineEvent
                            icon={CheckCircle}
                            title="Distributor Verified"
                            date="2023-11-23"
                            location="Central Hub, Hyderabad"
                            details="Received and stored in Zone A. No damage reported."
                            color="bg-wheat-500"
                        />
                        <TimelineEvent
                            icon={MapPin}
                            title="Available at Retailer"
                            date="In Stock"
                            location="SuperMart, Jubilee Hills"
                            details="Ready for purchase. Shelf life: 6 months."
                            color="bg-terra-500"
                            isLast
                        />
                    </div>
                </div>

                {/* Trust Badge */}
                <div className="mt-12 text-center">
                    <div className="inline-flex items-center gap-3 px-6 py-3 bg-green-50 border border-green-100 rounded-full text-green-700">
                        <CheckCircle size={20} />
                        <span className="font-medium">100% Verified on AgriChain Blockchain</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const TimelineEvent = ({ icon: Icon, title, date, location, details, color, isLast }) => (
    <motion.div
        initial={{ x: -20, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        viewport={{ once: true }}
        className="relative pl-8 md:pl-12"
    >
        <div className={`absolute -left-[9px] top-0 w-6 h-6 rounded-full border-4 border-white shadow-sm ${color} z-10`}></div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative group hover:-translate-y-1 transition-transform duration-300">
            <div className={`absolute top-6 right-6 p-2 rounded-xl bg-slate-50 text-slate-400 group-hover:text-white transition-colors duration-300`} style={{ '--tw-bg-opacity': 1, backgroundColor: 'var(--tw-bg-opacity)' }}>
                <Icon size={20} className="group-hover:text-white" />
            </div>
            <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase mb-1 block">{date}</span>
            <h3 className="text-lg font-bold text-slate-800 mb-1">{title}</h3>
            <p className="text-sm font-medium text-sage-600 mb-2 flex items-center gap-1">
                <MapPin size={14} /> {location}
            </p>
            <p className="text-sm text-slate-500 leading-relaxed">{details}</p>
        </div>
    </motion.div>
);

export default TraceProduct;
