import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ShieldCheck, ChevronLeft } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { getConsumerAlerts } from '../../utils/consumerStore';

const ConsumerAlerts = () => {
    const navigate = useNavigate();
    const [alerts, setAlerts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAlerts = async () => {
            const data = await getConsumerAlerts();
            setAlerts(data);
            setIsLoading(false);
        };
        fetchAlerts();
    }, []);

    return (
        <DashboardLayout role="consumer">
            <div className="space-y-6 max-w-3xl mx-auto">
                <div className="flex items-center gap-3 animate-in">
                    <button onClick={() => navigate('/consumer')} className="p-2 bg-white rounded-full border border-slate-200 mt-1 shadow-sm text-slate-500 hover:bg-slate-50">
                        <ChevronLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-xl md:text-2xl font-display font-bold text-slate-800">Tampered Alerts</h1>
                        <p className="text-sm text-slate-500 mt-0.5">Counterfeit products you've successfully avoided</p>
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-20 text-slate-400">Loading alerts...</div>
                ) : alerts.length > 0 ? (
                    <div className="space-y-4">
                        {alerts.map((alert) => (
                            <div 
                                key={alert._id}
                                onClick={() => navigate(`/trace/${alert.batchId}`, { state: { fromHistory: true } })}
                                className="bg-white rounded-2xl p-5 border border-red-100 shadow-[0_4px_15px_-5px_rgba(239,68,68,0.1)] hover:border-red-300 transition-colors cursor-pointer group flex items-start gap-4"
                            >
                                <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-red-500 border border-red-200 shrink-0 group-hover:bg-red-500 group-hover:text-white transition-colors">
                                    <ShieldAlert size={24} />
                                </div>
                                <div className="flex-grow">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="font-bold text-slate-800 text-base">{alert.crop} {alert.variety ? `(${alert.variety})` : ''}</h3>
                                        <span className="text-[10px] font-bold text-red-700 bg-red-50 px-2.5 py-1 rounded-full uppercase tracking-wider">Compromised</span>
                                    </div>
                                    <p className="text-xs text-slate-500 mb-2">Claimed Origin: {alert.farmerName} • {alert.location}</p>
                                    <div className="flex justify-between items-center border-t border-slate-50 pt-2 text-xs">
                                        <span className="text-slate-400 font-mono">ID: {alert.batchId}</span>
                                        <span className="font-medium text-slate-400">{new Date(alert.timestamp).toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-emerald-50/50 rounded-2xl border border-emerald-100 p-12 text-center shadow-sm">
                        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-white shadow-sm">
                            <ShieldCheck size={40} className="text-emerald-500" />
                        </div>
                        <h3 className="text-xl font-bold text-emerald-800 mb-2">Clean Record</h3>
                        <p className="text-emerald-600/80 max-w-sm mx-auto text-sm leading-relaxed mb-6">
                            You haven't encountered any tampered or counterfeit products yet. Keep scanning to ensure your food is truly Farm2Fork verified.
                        </p>
                        <button onClick={() => navigate('/consumer')} className="px-6 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold shadow-sm hover:bg-emerald-700 transition-colors">
                            Scan a Product
                        </button>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default ConsumerAlerts;
