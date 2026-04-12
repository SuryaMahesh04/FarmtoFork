import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ChevronLeft, Award } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { getConsumerMetrics, getConsumerFarms } from '../../utils/consumerStore';

const ConsumerFavourite = () => {
    const navigate = useNavigate();
    const [favourite, setFavourite] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchFavourite = async () => {
            const metrics = await getConsumerMetrics();
            if (metrics.favouriteFarm !== 'None yet') {
                const farms = await getConsumerFarms();
                const topFarm = farms.find(f => f.farmerName === metrics.favouriteFarm);
                setFavourite(topFarm);
            }
            setIsLoading(false);
        };
        fetchFavourite();
    }, []);

    return (
        <DashboardLayout role="consumer">
            <div className="space-y-6 max-w-2xl mx-auto">
                <div className="flex items-center gap-3 animate-in">
                    <button onClick={() => navigate('/consumer')} className="p-2 bg-white rounded-full border border-slate-200 mt-1 shadow-sm text-slate-500 hover:bg-slate-50">
                        <ChevronLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-xl md:text-2xl font-display font-bold text-slate-800">Your Favourite Origin</h1>
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-20 text-slate-400">Loading favourite origin...</div>
                ) : favourite ? (
                    <div className="bg-gradient-to-br from-rose-50 to-white rounded-[2rem] p-6 md:p-10 border border-rose-100 shadow-[0_10px_40px_-15px_rgba(225,29,72,0.15)] relative overflow-hidden text-center animate-in">
                        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-rose-100/50 to-transparent"></div>
                        
                        <div className="relative z-10">
                            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl border-4 border-rose-50 text-rose-500">
                                <Heart size={40} className="fill-rose-500" />
                            </div>
                            
                            <h2 className="text-3xl font-display font-bold text-slate-800 mb-2">{favourite.farmerName}</h2>
                            <p className="text-slate-500 font-medium mb-8">{favourite.location}</p>
                            
                            <div className="flex justify-center gap-4 mb-8">
                                <div className="bg-white px-5 py-3 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center flex-1">
                                    <span className="text-2xl font-bold text-rose-600 mb-1">{favourite.scanCount}</span>
                                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Times Tracked</span>
                                </div>
                                <div className="bg-white px-5 py-3 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center flex-1">
                                    <span className="text-2xl font-bold text-emerald-600 mb-1">{favourite.crops.length}</span>
                                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Crops Tasted</span>
                                </div>
                            </div>

                            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-rose-50 flex items-center gap-3 w-fit mx-auto text-left">
                                <Award className="text-rose-400 shrink-0" size={24} />
                                <p className="text-xs text-slate-600 font-medium max-w-[200px]">
                                    You are a top supporter of this farm. Thank you for empowering genuine agriculture!
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center">
                        <Heart size={48} className="mx-auto text-slate-300 mb-4" />
                        <h3 className="text-lg font-bold text-slate-700 mb-2">No favourite origin yet</h3>
                        <p className="text-slate-500 max-w-sm mx-auto text-sm mb-6">
                            Start scanning products. The farm you support the most will appear here.
                        </p>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default ConsumerFavourite;
