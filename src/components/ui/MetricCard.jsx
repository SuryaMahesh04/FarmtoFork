import React from 'react';
import CountUp from 'react-countup';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { motion } from 'framer-motion';

const MetricCard = ({
    title,
    value,
    icon: Icon,
    trend,
    trendLabel,
    color = "sage",
    delay = 0,
    prefix = "",
    suffix = ""
}) => {

    const colors = {
        emerald: { 
            bg: 'bg-gradient-to-br from-emerald-50 to-white', 
            icon: 'bg-gradient-to-br from-emerald-400 to-emerald-600', 
            text: 'text-emerald-700',
            shadow: 'shadow-emerald-100'
        },
        blue: { 
            bg: 'bg-gradient-to-br from-blue-50 to-white', 
            icon: 'bg-gradient-to-br from-blue-400 to-blue-600', 
            text: 'text-blue-700',
            shadow: 'shadow-blue-100'
        },
        amber: { 
            bg: 'bg-gradient-to-br from-amber-50 to-white', 
            icon: 'bg-gradient-to-br from-amber-400 to-amber-600', 
            text: 'text-amber-700',
            shadow: 'shadow-amber-100'
        },
        rose: { 
            bg: 'bg-gradient-to-br from-rose-50 to-white', 
            icon: 'bg-gradient-to-br from-rose-400 to-rose-600', 
            text: 'text-rose-700',
            shadow: 'shadow-rose-100'
        },
        sage: { 
            bg: 'bg-gradient-to-br from-emerald-50 to-white', 
            icon: 'bg-gradient-to-br from-emerald-400 to-emerald-600', 
            text: 'text-emerald-700',
            shadow: 'shadow-emerald-100'
        },
        wheat: { 
            bg: 'bg-gradient-to-br from-amber-50 to-white', 
            icon: 'bg-gradient-to-br from-amber-400 to-amber-600', 
            text: 'text-amber-700',
            shadow: 'shadow-amber-100'
        },
        sky: { 
            bg: 'bg-gradient-to-br from-sky-50 to-white', 
            icon: 'bg-gradient-to-br from-sky-400 to-sky-600', 
            text: 'text-sky-700',
            shadow: 'shadow-sky-100'
        },
        terra: { 
            bg: 'bg-gradient-to-br from-orange-50 to-white', 
            icon: 'bg-gradient-to-br from-orange-400 to-orange-600', 
            text: 'text-orange-700',
            shadow: 'shadow-orange-100'
        }
    };

    const theme = colors[color] || colors.sage;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.5 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className={`p-6 rounded-2xl relative overflow-hidden shadow-xl ${theme.shadow} ${theme.bg} border border-white/60 backdrop-blur-sm`}
        >
            <div className="flex justify-between items-start mb-4 relative z-10">
                <div>
                    <h3 className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1 opacity-80">{title}</h3>
                    <div className="text-3xl font-display font-bold text-slate-800 tracking-tight">
                        {typeof value === 'number' ? (
                            <CountUp 
                                end={value} 
                                duration={2.5} 
                                separator="," 
                                prefix={prefix} 
                                suffix={suffix} 
                            />
                        ) : (
                            <span>{value}</span>
                        )}
                    </div>
                </div>
                <div className={`p-3.5 rounded-xl ${theme.icon} text-white shadow-lg shadow-black/5 flex items-center justify-center transform transition-transform group-hover:scale-110 duration-300`}>
                    <Icon size={22} className="stroke-[2.5]" />
                </div>
            </div>

            {/* Trend section removed */}
            <div className="h-4"></div>

            {/* Decorative background blob */}
            <div className={`absolute -bottom-8 -right-8 w-32 h-32 rounded-full ${theme.icon} opacity-5 blur-2xl group-hover:opacity-10 transition-opacity duration-500`}></div>
        </motion.div>
    );
};

export default MetricCard;
