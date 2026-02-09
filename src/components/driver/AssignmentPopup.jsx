import React from 'react';
import { Truck, MapPin, Navigation, Clock, Package, X, CheckCircle } from 'lucide-react';
import Button from '../ui/Button';

const AssignmentPopup = ({ assignment, onAccept, onReject, onNavigate, loading }) => {
    if (!assignment) return null;

    const {
        shipmentId,
        farmer,
        distributor,
        batch,
        estimatedDistance
    } = assignment;

    return (
        <div className="fixed inset-x-0 bottom-0 z-[500] p-4 pb-6 flex justify-center pointer-events-none">
            <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-100 overflow-hidden pointer-events-auto animate-in slide-in-from-bottom-full duration-500">

                {/* Header */}
                <div className="bg-slate-900 text-white p-4 flex justify-between items-center relative overflow-hidden">
                    <div className="relative z-10 flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30 animate-pulse">
                            <Truck size={20} className="text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg leading-tight">New Trip Request!</h3>
                            <p className="text-slate-400 text-xs font-mono">#{shipmentId}</p>
                        </div>
                    </div>

                    {/* Background Decor */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-5">

                    {/* Route Visualizer */}
                    <div className="flex gap-4 relative">
                        {/* Connecting Line */}
                        <div className="absolute left-[19px] top-8 bottom-4 w-0.5 bg-slate-200 border-l border-dashed border-slate-300"></div>

                        {/* Pickup */}
                        <div className="w-full">
                            <div className="flex gap-3 mb-4">
                                <div className="z-10 w-10 h-10 rounded-full bg-emerald-50 border-4 border-white shadow-sm flex items-center justify-center flex-shrink-0 text-emerald-600">
                                    <MapPin size={18} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pickup</p>
                                    <h4 className="font-bold text-slate-800">{farmer?.profile?.fullName || 'Farm Location'}</h4>
                                    <p className="text-sm text-slate-500 truncate max-w-[200px]">
                                        {farmer?.profile?.city}, {farmer?.profile?.state}
                                    </p>
                                </div>
                            </div>

                            {/* Dropoff */}
                            <div className="flex gap-3">
                                <div className="z-10 w-10 h-10 rounded-full bg-blue-50 border-4 border-white shadow-sm flex items-center justify-center flex-shrink-0 text-blue-600">
                                    <Navigation size={18} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Dropoff</p>
                                    <h4 className="font-bold text-slate-800">{distributor?.profile?.fullName || 'Distributor'}</h4>
                                    <p className="text-sm text-slate-500 truncate max-w-[200px]">
                                        {distributor?.profile?.city}, {distributor?.profile?.state}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Cargo Info */}
                    <div className="bg-slate-50 rounded-xl p-3 flex items-center gap-3 border border-slate-100">
                        <div className="p-2 bg-white rounded-lg shadow-sm">
                            <Package size={20} className="text-amber-600" />
                        </div>
                        <div className="flex-1">
                            <p className="font-bold text-slate-700 text-sm">{batch?.crop} ({batch?.variety})</p>
                            <p className="text-xs text-slate-500 font-medium">{batch?.quantity} {batch?.unit}</p>
                        </div>
                        <div className="text-right">
                            {/* Placeholder for distance/earnings if available */}
                            <span className="bg-white px-2 py-1 rounded text-xs font-bold text-slate-600 shadow-sm border border-slate-100">
                                Standard
                            </span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <button
                            onClick={onReject}
                            className="flex-1 py-4 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 active:scale-95 transition-all text-sm flex items-center justify-center gap-2"
                        >
                            <X size={18} />
                            Decline
                        </button>
                        <button
                            onClick={onAccept}
                            disabled={loading}
                            className="flex-[2] py-4 rounded-xl font-bold text-white bg-emerald-600 shadow-lg shadow-emerald-500/30 hover:bg-emerald-700 active:scale-95 transition-all text-sm flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                            ) : (
                                <>
                                    <CheckCircle size={18} />
                                    Accept Trip
                                </>
                            )}
                        </button>
                    </div>

                    <button
                        onClick={onNavigate}
                        className="w-full text-center text-xs text-blue-600 font-bold hover:underline py-2"
                    >
                        Preview Route on Google Maps
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AssignmentPopup;
