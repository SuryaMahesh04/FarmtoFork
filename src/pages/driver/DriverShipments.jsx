import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, MapPin, Clock, Calendar } from 'lucide-react';

const DriverShipments = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50">
            <header className="bg-white px-4 py-4 border-b border-slate-200 sticky top-0 z-20 flex items-center gap-3">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-slate-100 rounded-full">
                    <ArrowLeft size={20} className="text-slate-700" />
                </button>
                <h1 className="text-lg font-bold text-slate-800">My Trips</h1>
            </header>

            <div className="p-4 space-y-4">
                <div className="flex gap-2 mb-2 overflow-x-auto pb-2">
                    <button className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-full shadow-lg shadow-emerald-200 whitespace-nowrap">
                        Active (1)
                    </button>
                    <button className="px-4 py-2 bg-white text-slate-600 border border-slate-200 text-xs font-bold rounded-full whitespace-nowrap">
                        Completed (12)
                    </button>
                    <button className="px-4 py-2 bg-white text-slate-600 border border-slate-200 text-xs font-bold rounded-full whitespace-nowrap">
                        Scheduled (2)
                    </button>
                </div>

                {/* Active Trip Card */}
                <div className="bg-white rounded-xl border border-emerald-100 shadow-md overflow-hidden">
                    <div className="bg-emerald-50 px-4 py-3 flex justify-between items-center border-b border-emerald-100">
                        <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Current Trip</span>
                        <span className="text-xs text-emerald-600 font-mono">#SHP-8923</span>
                    </div>
                    <div className="p-4 space-y-4">
                        <div className="flex gap-4">
                             <div className="flex flex-col items-center gap-1">
                                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                <div className="w-0.5 h-full bg-slate-200 border-l border-dashed border-slate-300 min-h-[40px]"></div>
                                <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                            </div>
                            <div className="flex-1 space-y-6">
                                <div>
                                    <p className="text-xs text-slate-400">Pickup</p>
                                    <p className="font-semibold text-slate-800">Kolar Farms, Karnataka</p>
                                </div>
                                <div className="-mt-2">
                                    <p className="text-xs text-slate-400">Dropoff</p>
                                    <p className="font-semibold text-slate-800">Fresh Mart, Bangalore</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-lg">
                            <div className="p-2 bg-white rounded shadow-sm text-slate-500">
                                <Package size={18} />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500">Cargo</p>
                                <p className="font-semibold text-slate-800 text-sm">Tomatoes • 500kg</p>
                            </div>
                        </div>

                        <button className="w-full py-3 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 active:scale-95 transition-all">
                            Update Status
                        </button>
                    </div>
                </div>

                <div className="relative py-2 flex items-center gap-4">
                     <div className="h-px bg-slate-200 flex-1"></div>
                     <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Past Trips</span>
                     <div className="h-px bg-slate-200 flex-1"></div>
                </div>

                {/* Past Trip Item */}
                <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 opacity-75">
                    <div className="flex justify-between items-start mb-3">
                        <div>
                             <p className="font-bold text-slate-800">Potatoes • 1200kg</p>
                             <p className="text-xs text-slate-400 font-mono">#SHP-8810</p>
                        </div>
                        <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold">
                            <CheckCircle size={14} />
                            Delivered
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Calendar size={14} />
                        Yesterday • 4:20 PM
                    </div>
                </div>
                 {/* Past Trip Item */}
                 <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 opacity-75">
                    <div className="flex justify-between items-start mb-3">
                        <div>
                             <p className="font-bold text-slate-800">Onions • 800kg</p>
                             <p className="text-xs text-slate-400 font-mono">#SHP-8755</p>
                        </div>
                        <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold">
                            <CheckCircle size={14} />
                            Delivered
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Calendar size={14} />
                        2 days ago • 11:15 AM
                    </div>
                </div>
            </div>
        </div>
    );
};

// Helper component
const CheckCircle = ({ size, className }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
);

export default DriverShipments;
