import React from 'react';
import { ResponsiveContainer } from 'recharts';

const ChartCard = ({ title, subtitle, children, height = 300, action }) => {
    return (
        <div className="glass-panel p-6 rounded-2xl shadow-sm flex flex-col">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-slate-700 font-semibold">{title}</h3>
                    {subtitle && <p className="text-slate-400 text-xs mt-1">{subtitle}</p>}
                </div>
                {action && (
                    <div>{action}</div>
                )}
            </div>

            <div style={{ height }} className="w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                    {children}
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default ChartCard;
