import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { Package, MapPin, Calendar, User, ShieldCheck, AlertCircle, ArrowLeft } from 'lucide-react';
import Header from '../../components/layout/Header';
import Loader from '../../components/ui/Loader';
import Footer from '../../components/layout/Footer';
import Button from '../../components/ui/Button';
import { api } from '../../utils/api';
import { trackConsumerScan } from '../../utils/consumerStore';

const TraceProduct = () => {
    const { batchId } = useParams();
    const navigate = useNavigate();
    const locationState = useLocation().state;
    const [loading, setLoading] = useState(true);
    const [batchData, setBatchData] = useState(null);
    const [error, setError] = useState(null);
    const hasTracked = useRef(false);

    useEffect(() => {
        const fetchTraceData = async () => {
            try {
                setLoading(true);
                const minLoadTime = 1000;
                
                const [res] = await Promise.all([
                    api.public.getTraceData(batchId),
                    new Promise(resolve => setTimeout(resolve, minLoadTime))
                ]);

                if (res.success) {
                    setBatchData(res.data);
                    if (!hasTracked.current && !locationState?.fromHistory) {
                        trackConsumerScan(res.data._id || batchId, res.data.isTampered, res.data.location);
                        hasTracked.current = true;
                    }
                } else {
                    setError('Failed to load traceability data. The batch might not exist.');
                }
            } catch (err) {
                console.error("Trace error:", err);
                setError(err.message || 'Failed to load traceability data.');
            } finally {
                setLoading(false);
            }
        };

        if (batchId) {
            fetchTraceData();
        } else {
            // Redirect to consumer dashboard if no batch ID is provided
            navigate('/consumer', { replace: true });
        }
    }, [batchId]);

    const renderJourneyTimeline = (journey, harvestDate, location) => {
        const timeline = [];

        // 1. Initial Harvest
        timeline.push({
            title: 'Harvested',
            date: new Date(harvestDate),
            desc: `Harvested at ${location?.village || location?.city || 'Farm'}`,
            active: false
        });

        // 2. Journey Stages
        if (journey && journey.length > 0) {
            journey.forEach((step) => {
                let stage = step.stage || step.status || 'Update';
                let title = stage.charAt(0).toUpperCase() + stage.slice(1).replace('_', ' ');

                timeline.push({
                    title: title,
                    date: new Date(step.timestamp),
                    desc: step.details || step.notes || `Update at ${step.location || 'Location'}`,
                    active: false
                });
            });
        }

        // Sort by date ascending (oldest first) so timeline flows downward
        timeline.sort((a, b) => a.date - b.date);

        // Mark the last one as active
        if (timeline.length > 0) {
            timeline[timeline.length - 1].active = true;
        }

        return timeline.reverse().map((item, idx) => (
            <div key={idx} className="relative">
                <span className={`absolute -left-[21px] top-0 w-4 h-4 rounded-full border-2 border-white ring-2 ${item.active ? 'bg-sage-600 ring-sage-300 shadow-md scale-110' : 'bg-sage-300 ring-sage-100'}`}></span>
                <p className={`text-sm font-bold ${item.active ? 'text-sage-800' : 'text-slate-800'}`}>{item.title}</p>
                <p className="text-xs text-slate-500">{item.date.toLocaleString()}</p>
                <p className="text-sm text-slate-600 mt-1">{item.desc}</p>
            </div>
        ));
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Header />

            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="max-w-3xl mx-auto">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-96">
                            <Loader text="Fetching blockchain records..." />
                            <p className="text-sm text-slate-500 mt-4 text-center max-w-xs">
                                Querying the decentralized ledger for immutable product history...
                            </p>
                        </div>
                    ) : error ? (
                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-red-100 p-8 text-center animate-in fade-in">
                            <AlertCircle size={64} className="mx-auto text-red-400 mb-4" />
                            <h2 className="text-2xl font-bold text-slate-800 mb-2">Record Not Found</h2>
                            <p className="text-slate-600 mb-6">{error}</p>
                            <Link to="/">
                                <Button>Return Home</Button>
                            </Link>
                        </div>
                    ) : batchData ? (
                        <div className="space-y-6 animate-in fade-in">
                            <button 
                                onClick={() => navigate('/consumer')}
                                className="flex items-center gap-2 text-sm font-medium text-sage-600 hover:text-sage-700 transition-colors bg-white px-4 py-2 rounded-lg border border-sage-200 hover:border-sage-300 w-fit shadow-sm"
                            >
                                <ArrowLeft size={16} />
                                Return to Authenticator
                            </button>

                            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-sage-100">
                                <div className={`${batchData.isTampered ? 'bg-red-600' : 'bg-sage-600'} p-6 text-white text-center transition-colors duration-500`}>
                                    {batchData.isTampered ? (
                                        <>
                                            <AlertCircle size={48} className="mx-auto mb-2 text-red-200" />
                                            <h1 className="text-2xl font-display font-bold">Data Compromised</h1>
                                            <p className="text-red-100 mt-1 uppercase tracking-widest text-sm font-bold">WARNING: Blockchain Verification Failed</p>
                                        </>
                                    ) : (
                                        <>
                                            <ShieldCheck size={48} className="mx-auto mb-2 text-sage-200" />
                                            <h1 className="text-2xl font-display font-bold">Verified Authentic</h1>
                                            <p className="text-sage-100 mt-1 text-sm">Batch ID: {batchData.batchId}</p>
                                        </>
                                    )}
                                </div>

                                <div className="p-8">
                                    <div className="text-center mb-8">
                                        <p className="text-slate-500">
                                            This product has been securely traced via the Farm2Fork blockchain network.
                                            <br/>
                                            Origin: <strong className="text-slate-700">{batchData.location?.district || batchData.farmerId?.profile?.district || 'Unknown'}, {batchData.location?.state || batchData.farmerId?.profile?.state || 'Unknown'}</strong>
                                        </p>
                                        
                                        {!batchData.isTampered && batchData.blockchainHash && (
                                            <div className="mt-3 inline-block bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5">
                                                <p className="text-xs text-slate-400 font-mono flex items-center gap-2">
                                                    <span className="font-bold text-slate-600">HASH:</span> 
                                                    <span className="truncate max-w-[200px] md:max-w-[400px] inline-block align-bottom">{batchData.blockchainHash}</span>
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                                        {/* Tampered Overlay */}
                                        {batchData.isTampered && (
                                            <div className="absolute inset-0 bg-red-50/80 backdrop-blur-[1px] z-10 flex items-center justify-center rounded-xl border border-red-200">
                                                <p className="text-red-700 font-bold bg-white/90 px-4 py-2 rounded-lg shadow-sm border border-red-100">
                                                    Data Integrity Compromised
                                                </p>
                                            </div>
                                        )}
                                        
                                        <div className={`p-4 rounded-xl border ${batchData.isTampered ? 'bg-red-50/50 border-red-100' : 'bg-slate-50 border-slate-100'}`}>
                                            <div className="flex items-center gap-3 mb-2">
                                                <Package className={batchData.isTampered ? 'text-red-400' : 'text-sage-600'} size={20} />
                                                <h3 className={`font-semibold ${batchData.isTampered ? 'text-red-700' : 'text-slate-700'}`}>Product Info</h3>
                                            </div>
                                            <div className="space-y-1 text-sm bg-white/50 rounded-lg p-3">
                                                <div className="flex justify-between border-b border-slate-100 pb-1">
                                                    <span className="text-slate-500">Crop:</span> 
                                                    <span className="font-medium text-slate-800">{batchData.crop}</span>
                                                </div>
                                                <div className="flex justify-between border-b border-slate-100 py-1">
                                                    <span className="text-slate-500">Variety:</span> 
                                                    <span className="font-medium text-slate-800">{batchData.variety || 'Standard'}</span>
                                                </div>
                                                <div className="flex justify-between border-b border-slate-100 py-1">
                                                    <span className="text-slate-500">Quantity:</span> 
                                                    <span className="font-medium text-slate-800">{batchData.quantity} {batchData.unit}</span>
                                                </div>
                                                <div className="flex justify-between pt-1">
                                                    <span className="text-slate-500">Quality Score:</span> 
                                                    <span className="font-medium text-sage-600">{batchData.qualityScore || 'N/A'}/100</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                            <div className="flex items-center gap-3 mb-2">
                                                <User className="text-sage-600" size={20} />
                                                <h3 className="font-semibold text-slate-700">Farmer Details</h3>
                                            </div>
                                            <div className="space-y-1 text-sm bg-white/50 rounded-lg p-3">
                                                <div className="flex justify-between border-b border-slate-100 pb-1">
                                                    <span className="text-slate-500">Farmer:</span> 
                                                    <span className="font-medium text-slate-800">{batchData.farmerId?.profile?.fullName || 'Verified Farmer'}</span>
                                                </div>
                                                <div className="flex justify-between border-b border-slate-100 py-1">
                                                    <span className="text-slate-500">Location:</span> 
                                                    <span className="font-medium text-slate-800">{batchData.location?.village || batchData.farmerId?.profile?.village}, {batchData.location?.district || batchData.farmerId?.profile?.district}</span>
                                                </div>
                                                <div className="flex justify-between pt-1">
                                                    <span className="text-slate-500">Harvest Date:</span> 
                                                    <span className="font-medium text-slate-800">{new Date(batchData.harvestDate).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Timeline */}
                                    <div className="mt-8 pt-8 border-t border-slate-100">
                                        <h3 className="font-semibold text-slate-700 mb-6 flex items-center gap-2">
                                            <MapPin size={18} /> Supply Chain Journey
                                        </h3>
                                        <div className="space-y-6 relative pl-4 border-l-2 border-slate-200 ml-2">
                                            {renderJourneyTimeline(batchData.journey, batchData.harvestDate, batchData.location)}
                                        </div>
                                    </div>
                                    
                                </div>
                            </div>
                        </div>
                    ) : null}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default TraceProduct;
