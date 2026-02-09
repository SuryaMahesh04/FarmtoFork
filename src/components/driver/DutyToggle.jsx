import React from 'react';
import { Power, MapPin } from 'lucide-react';

const DutyToggle = ({ status, onToggle, loading }) => {
    const isOnDuty = status === 'on-duty';

    return (
        <div className="absolute top-4 right-4 z-[400] flex flex-col items-end gap-2">
            <button
                onClick={() => !loading && onToggle()}
                disabled={loading}
                className={`
                    relative flex items-center gap-3 px-4 py-3 rounded-full shadow-lg border transition-all duration-300 active:scale-95
                    ${isOnDuty
                        ? 'bg-white border-emerald-500 text-emerald-700 hover:shadow-emerald-500/20'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:shadow-slate-900/40'
                    }
                `}
            >
                <span className={`font-bold text-sm tracking-wide ${loading ? 'opacity-50' : ''}`}>
                    {loading ? 'Updating...' : (isOnDuty ? 'ON DUTY' : 'OFF DUTY')}
                </span>

                <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500
                    ${isOnDuty ? 'bg-emerald-500 text-white' : 'bg-slate-600 text-slate-400'}
                `}>
                    <Power size={16} strokeWidth={3} />
                </div>

                {/* Status Indicator Ring */}
                {isOnDuty && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full animate-ping"></span>
                )}
            </button>

            {isOnDuty && (
                <div className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md animate-in slide-in-from-right-2 fade-in">
                    You are visible to transporters
                </div>
            )}
        </div>
    );
};

export default DutyToggle;
