import React from 'react';
import { MapPin } from 'lucide-react';

const MapboxMap = ({ center, zoom, className }) => {
    return (
        <div className={`relative bg-slate-100 overflow-hidden ${className}`}>
            {/* Placeholder Background Pattern */}
            <div className="absolute inset-0 opacity-10"
                style={{
                    backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                }}>
            </div>

            {/* Mock Map Features */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 border-2 border-dashed border-slate-300 rounded-full opacity-20"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 border-2 border-dashed border-slate-300 rounded-full opacity-20"></div>

            {/* Center Marker */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center animate-bounce">
                <MapPin className="text-emerald-500 drop-shadow-md" size={32} fill="currentColor" fillOpacity={0.2} />
                <div className="w-2 h-1 bg-emerald-500/50 rounded-full blur-[2px] mt-1"></div>
            </div>

            {/* Overlay Info */}
            <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg shadow-sm border border-slate-100 text-xs text-slate-500">
                <p className="font-mono">Lat: {center?.lat?.toFixed(4) || '17.3850'}</p>
                <p className="font-mono">Lng: {center?.lng?.toFixed(4) || '78.4867'}</p>
            </div>

            <div className="absolute top-4 right-4 bg-amber-50 text-amber-600 px-3 py-1.5 rounded-full text-[10px] font-bold border border-amber-100 shadow-sm">
                Map Preview Mode
            </div>
        </div>
    );
};

export default MapboxMap;
