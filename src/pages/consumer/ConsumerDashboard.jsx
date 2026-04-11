import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Search, ShieldAlert, Store, PieChart, ScanLine, ArrowRight, Camera, History, Heart, User, ChevronRight, LogOut } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import MetricCard from '../../components/ui/MetricCard';
import MobileMetricCard from '../../components/ui/MobileMetricCard';
import Button from '../../components/ui/Button';
import QRScannerModal from '../../components/ui/QRScannerModal';
import useMediaQuery from '../../utils/useMediaQuery';
import { getConsumerMetrics, getConsumerHistory } from '../../utils/consumerStore';
import { authHelpers } from '../../utils/api';

const ConsumerDashboard = () => {
    const navigate = useNavigate();
    const isMobile = useMediaQuery('(max-width: 768px)');
    
    const [metrics, setMetrics] = useState({
        totalVerified: 0,
        counterfeits: 0,
        uniqueFarms: 0,
        favouriteFarm: 'None yet'
    });
    
    const [recentScans, setRecentScans] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const [isScanning, setIsScanning] = useState(false);

    useEffect(() => {
        const fetchDashboardData = async () => {
            const fetchedMetrics = await getConsumerMetrics();
            setMetrics(fetchedMetrics);
            
            const history = await getConsumerHistory();
            setRecentScans(history.slice(0, 4));
        };
        fetchDashboardData();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchInput.trim()) {
            navigate(`/trace/${searchInput.trim()}`);
        }
    };

    const handleLogout = () => {
        authHelpers.logout();
        navigate('/');
    };

    return (
        <DashboardLayout role="consumer">
            <div className="space-y-6">
                
                {isMobile ? (
                    <div className="space-y-6 pb-20 -mx-4 -mt-6 pt-4 bg-slate-50 min-h-screen font-sans">
                        
                        {/* Huge Tap to Scan Card (Pure White Light Theme) */}
                        <div className="px-5 relative z-10 mt-6">
                            <div 
                                onClick={() => setIsScanning(true)}
                                className="w-full aspect-[4/3.5] max-h-[340px] bg-white rounded-[2rem] shadow-[0_15px_40px_-15px_rgba(16,185,129,0.2)] relative overflow-hidden flex flex-col items-center justify-center mx-auto cursor-pointer active:scale-95 transition-transform border border-emerald-100"
                            >
                                {/* Subtle inner gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-transparent pointer-events-none"></div>

                                {/* Abstract large icon in background */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
                                    <ScanLine size={240} className="text-emerald-900" />
                                </div>

                                <div className="w-20 h-20 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-emerald-100 text-emerald-600 z-10 transition-transform">
                                    <ScanLine size={40} strokeWidth={1.5} />
                                </div>

                                <h2 className="text-[2.5rem] font-serif italic text-slate-800 z-10 mb-2 leading-none tracking-tight">
                                    Tap to scan
                                </h2>
                                
                                <div className="z-10 mt-2 px-6 py-2 rounded-full bg-slate-50 border border-slate-100 flex items-center gap-1.5 shadow-sm">
                                    <ShieldCheck size={14} className="text-emerald-500" />
                                    <span className="text-xs font-bold text-slate-600 tracking-wide uppercase">Farm2Fork Protection</span>
                                </div>
                            </div>
                        </div>

                        {/* Everything Scanned Grid (Light Theme) */}
                        <div className="px-5 mt-8">
                            <div className="flex justify-between items-center mb-5">
                                <h3 className="text-[1.1rem] font-bold text-slate-900">Your Impact</h3>
                                <ChevronRight size={20} className="text-slate-400 cursor-pointer" onClick={() => navigate('/consumer/history')} />
                            </div>
                            <div className="grid grid-cols-5 gap-3">
                                {/* Light theme highly rounded squares */}
                                <div className="flex flex-col items-center group cursor-pointer active:scale-95 transition-transform" onClick={() => navigate('/consumer/history')}>
                                    <div className="w-[4.2rem] h-[4.2rem] bg-white rounded-[1.25rem] flex items-center justify-center mb-2 shadow-sm border border-slate-100 text-slate-500">
                                        <History size={24} strokeWidth={1.5} />
                                    </div>
                                    <span className="text-[11px] text-center font-bold text-slate-600 leading-tight">Full<br/>history</span>
                                </div>
                                <div className="flex flex-col items-center group cursor-pointer active:scale-95 transition-transform" onClick={() => navigate('/consumer/farms')}>
                                    <div className="w-[4.2rem] h-[4.2rem] bg-white rounded-[1.25rem] flex items-center justify-center mb-2 shadow-sm border border-slate-100 text-amber-500">
                                        <Store size={24} strokeWidth={1.5} />
                                    </div>
                                    <span className="text-[11px] text-center font-bold text-slate-600 leading-tight">Farms<br/>explored</span>
                                </div>
                                <div className="flex flex-col items-center group cursor-pointer active:scale-95 transition-transform" onClick={() => navigate('/consumer/favourite')}>
                                    <div className="w-[4.2rem] h-[4.2rem] bg-white rounded-[1.25rem] flex items-center justify-center mb-2 shadow-sm border border-slate-100 text-rose-500">
                                        <Heart size={24} strokeWidth={1.5} />
                                    </div>
                                    <span className="text-[11px] text-center font-bold text-slate-600 leading-tight">Favourite<br/>origin</span>
                                </div>
                                <div className="flex flex-col items-center group cursor-pointer active:scale-95 transition-transform" onClick={() => navigate('/consumer/alerts')}>
                                    <div className="w-[4.2rem] h-[4.2rem] bg-white rounded-[1.25rem] flex items-center justify-center mb-2 shadow-sm border border-slate-100">
                                        {metrics.counterfeits > 0 ? (
                                            <ShieldAlert size={24} className="text-red-500" strokeWidth={1.5} />
                                        ) : (
                                            <ShieldCheck size={24} className="text-emerald-500" strokeWidth={1.5} />
                                        )}
                                    </div>
                                    <span className="text-[11px] text-center font-bold text-slate-600 leading-tight">Tampered<br/>alerts</span>
                                </div>
                                {authHelpers.isAuthenticated() && (
                                    <div className="flex flex-col items-center group cursor-pointer active:scale-95 transition-transform" onClick={handleLogout}>
                                        <div className="w-[4.2rem] h-[4.2rem] bg-white rounded-[1.25rem] flex items-center justify-center mb-2 shadow-sm border border-slate-100 text-red-500">
                                            <LogOut size={24} strokeWidth={1.5} />
                                        </div>
                                        <span className="text-[11px] text-center font-bold text-slate-600 leading-tight">Log<br/>Out</span>
                                    </div>
                                )}
                            </div>
                            
                            {/* Manual Entry Fallback / ID Box */}
                            <div className="mt-8 flex items-center bg-white border border-slate-200 rounded-[1.25rem] p-1.5 shadow-sm h-14 w-full">
                                <Search size={20} className="text-slate-400 ml-3 shrink-0" />
                                <input 
                                    type="text" 
                                    placeholder="Enter Batch ID manually" 
                                    className="bg-transparent text-[14px] w-full px-3 outline-none text-slate-800 font-medium placeholder-slate-400"
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    // if user presses enter, call verify
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && searchInput.trim()) {
                                            navigate(`/trace/${searchInput.trim()}`);
                                        }
                                    }}
                                />
                                {searchInput.trim() && (
                                    <button 
                                        className="bg-emerald-600 text-white rounded-xl px-4 py-2 text-[13px] font-bold ml-1 shrink-0 h-full shadow-sm"
                                        onClick={() => navigate(`/trace/${searchInput.trim()}`)}
                                    >
                                        Verify
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Recent Verifications List */}
                        <div className="mt-10 px-5 pt-8 bg-white border-t border-slate-100 pb-24 shadow-[0_-5px_15px_rgb(0,0,0,0.02)] min-h-[40vh] rounded-t-[2.5rem]">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-[1.1rem] font-bold text-slate-900">Recent Verifications</h3>
                                <ChevronRight size={20} className="text-slate-400 cursor-pointer" onClick={() => navigate('/consumer/history')} />
                            </div>
                            {recentScans.length > 0 ? (
                                <div className="space-y-5">
                                    {recentScans.map((scan) => (
                                        <div 
                                            key={scan._id}
                                            onClick={() => navigate(`/trace/${scan.batchId}`, { state: { fromHistory: true } })}
                                            className="flex items-center group cursor-pointer bg-white"
                                        >
                                            <div className={`w-[3.5rem] h-[3.5rem] rounded-[1.2rem] flex items-center justify-center mr-4 shrink-0 transition-colors border shadow-sm ${scan.isTampered ? 'bg-red-50 text-red-500 border-red-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                                                {scan.isTampered ? <ShieldAlert size={24} strokeWidth={1.5} /> : <ScanLine size={24} strokeWidth={1.5} />}
                                            </div>
                                            <div className="flex-grow overflow-hidden pb-1">
                                                <div className="flex justify-between items-start mb-0.5">
                                                    <h4 className="font-bold text-slate-800 text-[15px] truncate mr-2">{scan.crop} {scan.variety ? `(${scan.variety})` : ''}</h4>
                                                    <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border mt-0.5 shrink-0 ${scan.isTampered ? 'bg-red-50 text-red-700 border-red-100' : 'bg-emerald-50 text-emerald-700 border-emerald-100'}`}>
                                                        {scan.isTampered ? 'Fake' : 'Real'}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <p className="text-[13px] text-slate-500 font-medium truncate">{scan.farmerName}</p>
                                                    <p className="text-[11px] text-slate-400 font-medium shrink-0 ml-2">{new Date(scan.timestamp).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 p-8 text-center mt-2">
                                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm">
                                        <ScanLine size={28} className="text-slate-300" />
                                    </div>
                                    <p className="text-sm font-medium text-slate-500">Tap the card above to scan a product</p>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    // Desktop UI
                    <>
                        {/* Hero / Authenticator Section */}
                        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 md:p-10 shadow-xl border border-slate-700 animate-in fade-in text-white relative overflow-hidden">
                            {/* Decorative Background */}
                            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>
                            
                            <div className="relative z-10 max-w-3xl">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 shadow-sm mb-4">
                                    <ShieldCheck size={14} />
                                    <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider">Provenance Engine</span>
                                </div>
                                <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-4 leading-tight">
                                    Verify Your Food's <br/> <span className="text-emerald-400">Authentic Roots</span>
                                </h1>
                                <p className="text-slate-400 text-sm md:text-base max-w-xl mb-8">
                                    Enter a Batch ID from any Farm2Fork certified product to instantly trace its immutable journey from the soil to your table.
                                </p>
                                
                                <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 max-w-2xl">
                                    <Button 
                                        type="button" 
                                        size="lg" 
                                        variant="outline"
                                        onClick={() => setIsScanning(true)}
                                        className="w-full sm:w-auto h-14 px-6 border-2 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/10 hover:border-emerald-400 bg-slate-800/80 shadow-lg shrink-0 flex items-center justify-center"
                                    >
                                        <Camera size={20} className="mr-2" />
                                        Scan QR
                                    </Button>
                                    <div className="relative flex-grow">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                        <input
                                            type="text"
                                            placeholder="Enter Batch ID (e.g., BTH-000001)"
                                            className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-800/80 border-2 border-slate-700 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 text-white placeholder-slate-500 outline-none transition-all"
                                            value={searchInput}
                                            onChange={(e) => setSearchInput(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <Button type="submit" size="lg" className="w-full sm:w-auto h-14 px-8 bg-emerald-600 hover:bg-emerald-500 text-white border-0 shadow-lg shadow-emerald-600/30 shrink-0">
                                        Verify
                                    </Button>
                                </form>
                            </div>
                        </div>

                        {/* Impact Metrics Grid */}
                        <div>
                            <div className="flex justify-between items-center mb-4 px-1">
                                <h2 className="text-lg md:text-xl font-display font-semibold text-slate-800">Your Impact Dashboard</h2>
                                {authHelpers.isAuthenticated() && (
                                    <button 
                                        onClick={handleLogout}
                                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg border border-red-100 transition-colors"
                                    >
                                        <LogOut size={16} />
                                        Log Out
                                    </button>
                                )}
                            </div>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                                <MetricCard title="Products Verified" value={metrics.totalVerified} icon={ShieldCheck} color="sage" delay={0.1} />
                                <MetricCard title="Farms Explored" value={metrics.uniqueFarms} icon={Store} color="wheat" delay={0.2} />
                                <MetricCard title="Counterfeits Spotted" value={metrics.counterfeits} icon={ShieldAlert} color="terra" delay={0.3} />
                                <MetricCard title="Favorite Farm" value={metrics.favouriteFarm} icon={Heart} color="sky" delay={0.4} />
                            </div>
                        </div>

                        {/* Recent Scans */}
                        {recentScans.length > 0 && (
                            <div className="animate-in" style={{ animationDelay: '0.4s' }}>
                                <div className="flex justify-between items-end mb-4 px-1">
                                    <h2 className="text-lg md:text-xl font-display font-semibold text-slate-800">Recent Verifications</h2>
                                    <button onClick={() => navigate('/consumer/history')} className="text-sm font-medium text-sage-600 hover:text-sage-700 flex items-center gap-1 group">
                                        View Full History <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {recentScans.map((scan) => (
                                        <div 
                                            key={scan._id} 
                                            onClick={() => navigate(`/trace/${scan.batchId}`, { state: { fromHistory: true } })}
                                            className={`bg-white rounded-xl p-5 border ${scan.isTampered ? 'border-red-100 hover:border-red-300 shadow-red-50' : 'border-slate-100 hover:border-emerald-200 shadow-slate-100'} shadow-sm hover:shadow-md transition-all cursor-pointer group`}
                                        >
                                            <div className="flex justify-between items-start mb-3">
                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${scan.isTampered ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-600'}`}>
                                                    {scan.isTampered ? <ShieldAlert size={20} /> : <ScanLine size={20} />}
                                                </div>
                                                <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${scan.isTampered ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}>
                                                    {scan.isTampered ? 'Tampered' : 'Authentic'}
                                                </div>
                                            </div>
                                            
                                            <h3 className="font-bold text-slate-800 mb-1 line-clamp-1">{scan.crop} {scan.variety ? `(${scan.variety})` : ''}</h3>
                                            <p className="text-xs text-slate-500 mb-4 line-clamp-1">From: {scan.farmerName}</p>
                                            
                                            <div className="flex items-center justify-between text-xs border-t border-slate-50 pt-3 mt-auto">
                                                <span className="text-slate-400 font-mono">{scan.batchId}</span>
                                                <span className="text-slate-400">{new Date(scan.timestamp).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        {recentScans.length === 0 && (
                            <div className="bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center animate-in" style={{ animationDelay: '0.4s' }}>
                                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                                    <ScanLine size={32} />
                                </div>
                                <h3 className="text-lg font-bold text-slate-700 mb-2">No verification history yet</h3>
                                <p className="text-slate-500 max-w-sm mx-auto text-sm">
                                    Enter a batch ID above to trace your first product and start building your impact profile.
                                </p>
                            </div>
                        )}
                    </>
                )}

                <QRScannerModal 
                    isOpen={isScanning} 
                    onClose={() => setIsScanning(false)}
                    onScanSuccess={(scannedId) => {
                        setIsScanning(false);
                        navigate(`/trace/${scannedId}`);
                    }}
                />

            </div>
        </DashboardLayout>
    );
};

// ActionSquare Component for Mobile Action Grid
const ActionSquare = ({ icon: Icon, label, subtext, onClick, highlight = false, alert = false }) => (
    <div 
        onClick={onClick}
        className="flex flex-col items-center justify-between p-3 h-24 bg-white rounded-2xl border border-slate-100 shadow-sm cursor-pointer active:scale-95 transition-transform"
    >
        <div className={`
            w-8 h-8 rounded-full flex items-center justify-center mb-1
            ${alert ? 'text-red-500 bg-red-50' : (highlight ? 'text-emerald-500 bg-emerald-50' : 'text-slate-500 bg-slate-50')}
        `}>
            <Icon size={16} />
        </div>
        <div className="text-center w-full">
            <p className="text-[10px] sm:text-xs font-medium text-slate-600 leading-tight mb-0.5">{label}</p>
            {subtext !== undefined && (
                <p className={`text-[10px] font-bold ${alert ? 'text-red-600' : 'text-slate-800'}`}>
                    {subtext}
                </p>
            )}
        </div>
    </div>
);

export default ConsumerDashboard;
