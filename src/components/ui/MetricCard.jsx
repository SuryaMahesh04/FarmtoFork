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
    delay = 0
}) => {

    const colors = {
        sage: { bg: 'bg-sage-100', text: 'text-sage-600', sub: 'text-sage-500' },
        wheat: { bg: 'bg-wheat-100', text: 'text-wheat-600', sub: 'text-wheat-500' },
        sky: { bg: 'bg-sky-100', text: 'text-sky-600', sub: 'text-sky-500' },
        terra: { bg: 'bg-terra-100/50', text: 'text-terra-400', sub: 'text-terra-400' },
    };

    const theme = colors[color] || colors.sage;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.5 }}
            whileHover={{ y: -5 }}
            className="glass-card p-6 rounded-2xl relative overflow-hidden"
        >
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-slate-500 text-sm font-medium mb-1">{title}</h3>
                    <div className="text-3xl font-display font-bold text-slate-800">
                        <CountUp end={value} duration={2.5} separator="," />
                    </div>
                </div>
                <div className={`p-3 rounded-xl ${theme.bg} ${theme.text}`}>
                    <Icon size={24} />
                </div>
            </div>

            <div className="flex items-center gap-2">
                {trend && (
                    <span className={`
            flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full
            ${trend > 0 ? 'bg-sage-100 text-sage-600' : 'bg-terra-100/50 text-terra-400'}
          `}>
                        {trend > 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                        {Math.abs(trend)}%
                    </span>
                )}
                <span className="text-xs text-slate-400">{trendLabel}</span>
            </div>

            {/* Decorative background blob */}
            <div className={`absolute -bottom-6 -right-6 w-24 h-24 rounded-full ${theme.bg} opacity-50 blur-xl`}></div>
        </motion.div>
    );
};

export default MetricCard;
