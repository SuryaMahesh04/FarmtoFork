import React from 'react';

const StatusBadge = ({ status, type = 'default' }) => {
    const styles = {
        success: 'bg-sage-100 text-sage-700 border-sage-200',
        warning: 'bg-wheat-100 text-wheat-700 border-wheat-200',
        error: 'bg-terra-100 text-terra-700 border-terra-200',
        info: 'bg-sky-100 text-sky-700 border-sky-200',
        default: 'bg-slate-100 text-slate-700 border-slate-200',
    };

    const dotColors = {
        success: 'bg-sage-500',
        warning: 'bg-wheat-500',
        error: 'bg-terra-500',
        info: 'bg-sky-500',
        default: 'bg-slate-500',
    };

    // Determine style based on status string (if simple mapping)
    const getStyle = (s) => {
        const lower = s.toLowerCase();
        if (['completed', 'delivered', 'active', 'approved', 'verified', 'passed'].includes(lower)) return 'success';
        if (['pending', 'in transit', 'processing', 'review'].includes(lower)) return 'warning';
        if (['failed', 'rejected', 'cancelled', 'expired'].includes(lower)) return 'error';
        if (['created', 'new', 'draft'].includes(lower)) return 'info';
        return 'default';
    };

    const finalType = type === 'default' ? getStyle(status) : type;

    return (
        <span className={`
      inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border
      ${styles[finalType]}
    `}>
            <span className={`relative flex h-2 w-2`}>
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${dotColors[finalType]}`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${dotColors[finalType]}`}></span>
            </span>
            {status}
        </span>
    );
};

export default StatusBadge;
