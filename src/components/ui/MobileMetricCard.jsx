import React from 'react';
import { motion } from 'framer-motion';

const MobileMetricCard = ({ title, value, icon: Icon, trend, color = 'emerald', delay = 0 }) => {
    const colorClasses = {
        sage: 'from-emerald-500 to-emerald-600',
        wheat: 'from-amber-500 to-amber-600',
        sky: 'from-blue-500 to-blue-600',
        terra: 'from-orange-500 to-orange-600',
        emerald: 'from-emerald-500 to-emerald-600'
    };

    const bgColorClasses = {
        sage: 'bg-emerald-50',
        wheat: 'bg-amber-50',
        sky: 'bg-blue-50',
        terra: 'bg-orange-50',
        emerald: 'bg-emerald-50'
    };

    const iconColorClasses = {
        sage: 'text-emerald-600',
        wheat: 'text-amber-600',
        sky: 'text-blue-600',
        terra: 'text-orange-600',
        emerald: 'text-emerald-600'
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.4 }}
            className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100"
        >
            <div className="flex items-center gap-3">
                {/* Icon */}
                <div className={`p-3 rounded-xl ${bgColorClasses[color]}`}>
                    <Icon size={24} className={iconColorClasses[color]} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-500 mb-0.5 font-medium">{title}</p>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-2xl font-bold text-slate-800 font-display">
                            {typeof value === 'number' && value > 1000
                                ? value.toLocaleString()
                                : value}
                        </h3>
                        {trend !== undefined && trend !== 0 && (
                            <span className={`text-xs font-semibold ${trend > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                {trend > 0 ? '+' : ''}{trend}%
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default MobileMetricCard;
