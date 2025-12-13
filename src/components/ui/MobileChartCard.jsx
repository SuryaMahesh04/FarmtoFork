import React from 'react';
import { ResponsiveContainer } from 'recharts';

const MobileChartCard = ({ title, subtitle, children, height = 250 }) => {
    return (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
            {/* Header */}
            <div className="mb-3">
                <h3 className="text-sm font-bold text-slate-800 mb-0.5">{title}</h3>
                {subtitle && (
                    <p className="text-xs text-slate-500">{subtitle}</p>
                )}
            </div>

            {/* Chart Container */}
            <div style={{ width: '100%', height }}>
                <ResponsiveContainer width="100%" height="100%">
                    {children}
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default MobileChartCard;
