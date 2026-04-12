import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, MapPin, Store, ChevronLeft } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { getConsumerFarms } from '../../utils/consumerStore';

const ConsumerFarms = () => {
    const navigate = useNavigate();
    const [farms, setFarms] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchFarms = async () => {
            const data = await getConsumerFarms();
            setFarms(data);
            setIsLoading(false);
        };
        fetchFarms();
    }, []);

    return (
        <DashboardLayout role="consumer">
            <div className="space-y-6">
                <div className="flex items-center gap-3 animate-in">
                    <button onClick={() => navigate('/consumer')} className="p-2 bg-white rounded-full border border-slate-200 mt-1 shadow-sm text-slate-500 hover:bg-slate-50">
                        <ChevronLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-xl md:text-2xl font-display font-bold text-slate-800">Farms Explored</h1>
                        <p className="text-sm text-slate-500 mt-0.5">The unique agricultural sources you've supported</p>
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-20 text-slate-400">Loading farms...</div>
                ) : farms.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {farms.map((farm) => (
                            <div key={farm.farmerId} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 border border-amber-100">
                                            <Store size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-800 text-lg">{farm.farmerName}</h3>
                                            <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                                                <MapPin size={12} />
                                                <span>{farm.location}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-slate-50 px-2 py-1 rounded text-xs font-bold text-slate-600">
                                        {farm.scanCount} Scans
                                    </div>
                                </div>
                                <div className="pt-4 border-t border-slate-50">
                                    <p className="text-xs font-medium text-slate-400 mb-2 uppercase tracking-wide">Products Tracked</p>
                                    <div className="flex flex-wrap gap-2">
                                        {farm.crops.map((crop, idx) => (
                                            <span key={idx} className="inline-flex items-center gap-1 text-xs font-medium bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full border border-emerald-100">
                                                <Leaf size={10} />
                                                {crop}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center">
                        <Store size={48} className="mx-auto text-slate-300 mb-4" />
                        <h3 className="text-lg font-bold text-slate-700 mb-2">No farms explored yet</h3>
                        <p className="text-slate-500 max-w-sm mx-auto text-sm mb-6">
                            Start scanning Farm2Fork products to build your map of supported farmers.
                        </p>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default ConsumerFarms;
