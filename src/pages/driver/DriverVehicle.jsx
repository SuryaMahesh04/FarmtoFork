import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Truck, Calendar, Fuel, AlertTriangle } from 'lucide-react';

const DriverVehicle = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50">
            <header className="bg-white px-4 py-4 border-b border-slate-200 sticky top-0 z-20 flex items-center gap-3">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-slate-100 rounded-full">
                    <ArrowLeft size={20} className="text-slate-700" />
                </button>
                <h1 className="text-lg font-bold text-slate-800">My Vehicle</h1>
            </header>

            <div className="p-4 space-y-4">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 text-center">
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600">
                        <Truck size={40} />
                    </div>
                    <h2 className="text-xl font-bold text-slate-800">Tata 407</h2>
                    <p className="text-slate-500 font-mono mt-1">KA-05-MJ-1234</p>
                    <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                        ACTIVE & VERIFIED
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-2 text-slate-500 mb-1">
                            <Fuel size={16} />
                            <span className="text-xs">Fuel Efficiency</span>
                        </div>
                        <p className="text-lg font-bold text-slate-800">12 km/l</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-2 text-slate-500 mb-1">
                            <Calendar size={16} />
                            <span className="text-xs">Service Due</span>
                        </div>
                        <p className="text-lg font-bold text-slate-800">24 Days</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm col-span-2 flex items-center justify-between">
                         <div>
                            <div className="flex items-center gap-2 text-slate-500 mb-1">
                                <AlertTriangle size={16} className="text-amber-500" />
                                <span className="text-xs">Insurance Expiry</span>
                            </div>
                            <p className="font-bold text-slate-800">12 Oct 2026</p>
                        </div>
                        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                            <CheckCircle size={16} />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-slate-100">
                        <h3 className="font-bold text-slate-800">Documents</h3>
                    </div>
                    <div className="divide-y divide-slate-100">
                        <div className="p-4 flex justify-between items-center hover:bg-slate-50">
                            <span className="text-sm font-medium text-slate-700">RC Book</span>
                            <span className="text-xs text-emerald-600">Verified</span>
                        </div>
                         <div className="p-4 flex justify-between items-center hover:bg-slate-50">
                            <span className="text-sm font-medium text-slate-700">Pollution Certificate</span>
                            <span className="text-xs text-emerald-600">Verified</span>
                        </div>
                         <div className="p-4 flex justify-between items-center hover:bg-slate-50">
                            <span className="text-sm font-medium text-slate-700">Insurance Policy</span>
                            <span className="text-xs text-emerald-600">Verified</span>
                        </div>
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

export default DriverVehicle;
