import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

const SupplyChainGame = () => {
    return (
        <div className="bg-gradient-to-br from-blue-50 via-white to-emerald-50 py-12 md:py-24 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-20 right-10 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 left-10 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl"></div>
            </div>

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="text-center mb-12">
                    <motion.h3
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4"
                    >
                        🎮 Try the Supply Chain Game!
                    </motion.h3>
                    <p className="text-slate-600 text-sm md:text-base max-w-2xl mx-auto">
                        Learn how blockchain tracking works! Move products through each stage, complete tasks, and collect blockchain stamps.
                    </p>
                </div>

                {/* Game Board */}
                <div className="max-w-6xl mx-auto">
                    {/* Timer & Score Banner */}
                    <div className="bg-gradient-to-r from-blue-600 to-emerald-600 rounded-2xl p-4 mb-6 flex flex-col md:flex-row items-center justify-between text-white shadow-xl gap-4">
                        <div className="flex items-center gap-4">
                            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
                                <div className="text-xs opacity-80 mb-1">Time</div>
                                <div className="text-2xl font-bold font-mono">02:45</div>
                            </div>
                            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
                                <div className="text-xs opacity-80 mb-1">Score</div>
                                <div className="text-2xl font-bold">850</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="text-2xl">⛓️</div>
                            <div>
                                <div className="text-xs opacity-80">Blockchain Stamps</div>
                                <div className="font-bold">3 / 5</div>
                            </div>
                        </div>
                    </div>

                    {/* Game Stages */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                        {[
                            { icon: '🚜', stage: 'Farm', task: 'Harvest', stamp: true },
                            { icon: '📦', stage: 'Pack', task: 'Package', stamp: true },
                            { icon: '🚛', stage: 'Transport', task: 'Ship', stamp: true },
                            { icon: '🏭', stage: 'Warehouse', task: 'Quality Check', stamp: false },
                            { icon: '🏪', stage: 'Retail', task: 'Sell', stamp: false }
                        ].map((step, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="relative"
                            >
                                <div className={`bg-white rounded-2xl p-4 md:p-6 border-4 ${step.stamp
                                        ? 'border-emerald-400 shadow-lg shadow-emerald-200'
                                        : 'border-slate-200'
                                    } hover:scale-105 transition-all cursor-pointer group`}>
                                    {step.stamp && (
                                        <div className="absolute -top-3 -right-3 w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg animate-bounce">
                                            ✓
                                        </div>
                                    )}

                                    <div className="text-4xl md:text-5xl mb-2 md:mb-3 text-center group-hover:scale-110 transition-transform">
                                        {step.icon}
                                    </div>

                                    <h4 className="font-bold text-slate-800 text-center mb-1 text-sm md:text-base">{step.stage}</h4>
                                    <p className="text-xs text-slate-500 text-center">{step.task}</p>

                                    {step.stamp ? (
                                        <div className="mt-2 md:mt-3 text-center text-xs text-emerald-600 font-semibold">
                                            ✨ Complete!
                                        </div>
                                    ) : (
                                        <div className="mt-2 md:mt-3 text-center text-xs text-slate-400">
                                            Locked
                                        </div>
                                    )}
                                </div>

                                {i < 4 && (
                                    <div className="hidden md:block absolute top-1/2 -right-2 -translate-y-1/2 z-10">
                                        <ArrowRight className="text-slate-300" size={24} />
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>

                    {/* Draggable Product & Tasks */}
                    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-2xl border-2 border-slate-100">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                            {/* Product to Drag */}
                            <div className="flex-1 w-full">
                                <h4 className="font-bold text-slate-800 mb-4 text-center md:text-left">📍 Current Product</h4>
                                <motion.div
                                    drag
                                    dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                                    whileDrag={{ scale: 1.1, rotate: 5 }}
                                    whileHover={{ scale: 1.05 }}
                                    className="bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl p-6 border-4 border-dashed border-orange-400 cursor-move shadow-xl"
                                >
                                    <div className="text-6xl text-center mb-3">🍅</div>
                                    <h5 className="font-bold text-slate-800 text-center mb-1">Organic Tomatoes</h5>
                                    <p className="text-xs text-slate-600 text-center mb-3">Batch #BTC-789</p>
                                    <div className="flex items-center justify-center gap-2 text-xs">
                                        <div className="px-3 py-1 bg-white/60 rounded-full font-semibold text-emerald-600">
                                            👆 Drag Me!
                                        </div>
                                    </div>
                                </motion.div>
                            </div>

                            {/* Next Stage Task */}
                            <div className="flex-1 w-full">
                                <h4 className="font-bold text-slate-800 mb-4 text-center md:text-left">🎯 Next Task: Warehouse</h4>
                                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border-2 border-purple-300">
                                    <div className="space-y-3">
                                        <button className="w-full bg-white hover:bg-purple-50 border-2 border-purple-200 rounded-xl p-3 text-left transition-all flex items-center justify-between group">
                                            <span className="font-semibold text-slate-700 text-sm">✓ Temperature Check</span>
                                            <CheckCircle2 className="text-emerald-500 flex-shrink-0" size={20} />
                                        </button>
                                        <button className="w-full bg-white hover:bg-purple-50 border-2 border-purple-200 rounded-xl p-3 text-left transition-all flex items-center justify-between group hover:border-purple-400">
                                            <span className="font-semibold text-slate-700 text-sm">○ Quality Inspection</span>
                                            <div className="w-5 h-5 rounded-full border-2 border-slate-300 group-hover:border-purple-500 flex-shrink-0"></div>
                                        </button>
                                        <button className="w-full bg-white hover:bg-purple-50 border-2 border-purple-200 rounded-xl p-3 text-left transition-all flex items-center justify-between group hover:border-purple-400">
                                            <span className="font-semibold text-slate-700 text-sm">○ Record to Blockchain</span>
                                            <div className="w-5 h-5 rounded-full border-2 border-slate-300 group-hover:border-purple-500 flex-shrink-0"></div>
                                        </button>
                                    </div>
                                    <button className="mt-4 w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 rounded-xl transition-all shadow-lg opacity-50 cursor-not-allowed text-sm">
                                        Complete All Tasks First
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Achievement Banner */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1 }}
                        className="mt-8 bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 rounded-2xl p-6 text-white relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjMpIi8+PC9zdmc+')] opacity-30"></div>
                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="text-4xl md:text-5xl">🏆</div>
                                <div>
                                    <h5 className="font-bold text-lg mb-1">Almost There!</h5>
                                    <p className="text-sm opacity-90">Complete 2 more stages to unlock "Supply Chain Master" achievement</p>
                                </div>
                            </div>
                            <button className="px-6 py-3 bg-white text-orange-600 font-bold rounded-xl hover:bg-orange-50 transition-all shadow-lg">
                                View Rewards
                            </button>
                        </div>
                    </motion.div>

                    {/* How to Play */}
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                            { icon: '👆', title: 'Drag & Drop', desc: 'Move products between stages' },
                            { icon: '✅', title: 'Complete Tasks', desc: 'Finish activities at each step' },
                            { icon: '⛓️', title: 'Collect Stamps', desc: 'Earn blockchain verification stamps' }
                        ].map((tip, i) => (
                            <div key={i} className="text-center p-4 bg-white/50 rounded-xl backdrop-blur-sm border border-slate-200">
                                <div className="text-3xl mb-2">{tip.icon}</div>
                                <h6 className="font-bold text-slate-800 text-sm mb-1">{tip.title}</h6>
                                <p className="text-xs text-slate-600">{tip.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SupplyChainGame;
