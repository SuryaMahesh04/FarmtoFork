import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, Minimize2, Maximize2, Sparkles, ChevronRight } from 'lucide-react';
import forgeBotImg from '../../assets/forge_bot.png';
import { landingAssistantProcess } from '../../utils/landingAssistant';
import { VoiceAgentTab } from './VoiceAgentTab';

// Simple markdown-like renderer for bold and bullet formatting
const renderText = (text) => {
    const lines = text.split('\n');
    return lines.map((line, i) => {
        // Heading lines
        if (line.startsWith('## ')) {
            return <p key={i} className="font-bold text-emerald-800 text-sm mt-2 mb-1">{line.replace('## ', '')}</p>;
        }
        // Bullet points
        if (line.startsWith('• ')) {
            return (
                <div key={i} className="flex gap-1.5 text-xs text-slate-600 leading-relaxed">
                    <span className="text-emerald-500 mt-0.5 shrink-0">•</span>
                    <span dangerouslySetInnerHTML={{ __html: line.slice(2).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                </div>
            );
        }
        // Numbered
        if (/^\d+\./.test(line)) {
            return (
                <div key={i} className="flex gap-1.5 text-xs text-slate-600 leading-relaxed">
                    <span dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                </div>
            );
        }
        // Normal bold inline
        if (line.includes('**')) {
            return (
                <p key={i} className="text-xs text-slate-600 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-800">$1</strong>') }} />
            );
        }
        // Empty line
        if (!line.trim()) return <div key={i} className="h-1.5" />;
        // Italic lines like *"..."*
        if (line.startsWith('• *"')) {
            return (
                <div key={i} className="flex items-center gap-1.5 text-xs text-slate-500 leading-relaxed italic pl-1">
                    <ChevronRight size={10} className="text-emerald-400 shrink-0" />
                    {line.replace(/^• \*"/, '').replace(/"\*$/, '')}
                </div>
            );
        }
        return <p key={i} className="text-xs text-slate-600 leading-relaxed">{line}</p>;
    });
};

const QUICK_PROMPTS = [
    "What is Farm2Fork?",
    "Who built this?",
    "Tech stack",
    "Security features",
    "What makes it unique?",
    "Platform impact",
];

const LandingAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [activeTab, setActiveTab] = useState('voice'); // 'text' | 'voice'
    const [messages, setMessages] = useState([
        {
            id: 1,
            role: 'assistant',
            text: "👋 Hi! I'm **Forge**, the Farm2Fork AI guide.\n\nI'm here to tell evaluators & visitors everything about this platform — the team, technology, security, and impact.\n\nWhat would you like to know?",
            time: new Date(),
        }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        if (isOpen && !isMinimized) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen, isMinimized]);

    const sendMessage = async (text) => {
        const trimmed = (text || input).trim();
        if (!trimmed) return;

        const userMsg = { id: Date.now(), role: 'user', text: trimmed, time: new Date() };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        // Simulate brief thinking delay
        await new Promise(r => setTimeout(r, 600 + Math.random() * 400));

        const response = landingAssistantProcess(trimmed);
        const assistantMsg = {
            id: Date.now() + 1,
            role: 'assistant',
            text: response.text,
            time: new Date(),
        };

        setIsTyping(false);
        setMessages(prev => [...prev, assistantMsg]);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <>
            {/* Floating Button */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsOpen(true)}
                        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-2xl shadow-emerald-500/40 flex items-center justify-center"
                        aria-label="Open Farm2Fork Assistant"
                    >
                        {/* Ping ring */}
                        <span className="absolute inset-0 rounded-2xl bg-emerald-500 animate-ping opacity-20" />
                        <img src={forgeBotImg} alt="Forge AI Mascot" className="w-10 h-10 rounded-full border-2 border-emerald-400/50 shadow-md object-cover bg-white" />
                        {/* Badge */}
                        <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center w-5 h-5 rounded-full bg-amber-400 text-[9px] font-black text-slate-900 shadow-sm">AI</span>
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Chat Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.92, y: 20, originX: 1, originY: 1 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.92, y: 20 }}
                        transition={{ type: 'spring', damping: 22, stiffness: 280 }}
                        className="fixed bottom-6 right-6 z-50 w-[360px] max-w-[calc(100vw-24px)] flex flex-col rounded-3xl overflow-hidden shadow-2xl shadow-slate-900/20 border border-slate-200/80"
                        style={{ height: isMinimized ? 'auto' : '560px', maxHeight: 'calc(100vh - 80px)' }}
                    >
                        {/* Header */}
                        <div className="flex-shrink-0 bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center overflow-hidden border-2 border-white/40 shadow-sm">
                                    <img src={forgeBotImg} alt="Forge Bot" className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <p className="text-white font-bold text-sm leading-none">Forge</p>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                                        <p className="text-emerald-100 text-[10px] font-medium">Farm2Fork AI Guide</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => setIsMinimized(!isMinimized)}
                                    className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                    title={isMinimized ? "Expand" : "Minimize"}
                                >
                                    {isMinimized ? <Maximize2 size={15} /> : <Minimize2 size={15} />}
                                </button>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                    title="Close"
                                >
                                    <X size={15} />
                                </button>
                            </div>
                        </div>

                        {/* Tabs */}
                        {!isMinimized && (
                            <div className="flex bg-slate-50 border-b border-slate-200">
                                <button
                                    onClick={() => setActiveTab('voice')}
                                    className={`flex-1 py-2.5 text-xs font-bold transition-colors ${activeTab === 'voice' ? 'text-emerald-600 border-b-2 border-emerald-500' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    🎤 Talk to Forge
                                </button>
                                <button
                                    onClick={() => setActiveTab('text')}
                                    className={`flex-1 py-2.5 text-xs font-bold transition-colors ${activeTab === 'text' ? 'text-emerald-600 border-b-2 border-emerald-500' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    Text Chat
                                </button>
                            </div>
                        )}

                        {/* Body */}
                        {!isMinimized && activeTab === 'text' && (
                            <>
                                {/* Messages */}
                                <div className="flex-1 overflow-y-auto bg-slate-50 px-4 py-4 space-y-3 scroll-smooth">
                                    {messages.map((msg) => (
                                        <div key={msg.id} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                            {/* Avatar */}
                                            {msg.role === 'assistant' && (
                                                <div className="w-7 h-7 rounded-xl bg-white overflow-hidden shrink-0 mt-0.5 shadow-sm border border-slate-200">
                                                    <img src={forgeBotImg} alt="Forge Bot" className="w-full h-full object-cover" />
                                                </div>
                                            )}
                                            {/* Bubble */}
                                            <div
                                                className={`max-w-[88%] rounded-2xl px-4 py-3 shadow-sm ${
                                                    msg.role === 'user'
                                                        ? 'bg-emerald-600 text-white rounded-tr-sm'
                                                        : 'bg-white border border-slate-100 rounded-tl-sm'
                                                }`}
                                            >
                                                {msg.role === 'user' ? (
                                                    <p className="text-xs text-white leading-relaxed">{msg.text}</p>
                                                ) : (
                                                    <div className="space-y-0.5">
                                                        {renderText(msg.text)}
                                                    </div>
                                                )}
                                                <p className={`text-[9px] mt-2 ${msg.role === 'user' ? 'text-emerald-200 text-right' : 'text-slate-300'}`}>
                                                    {msg.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Typing indicator */}
                                    {isTyping && (
                                        <div className="flex gap-2">
                                            <div className="w-7 h-7 rounded-xl bg-white overflow-hidden shrink-0 shadow-sm border border-slate-200">
                                                <img src={forgeBotImg} alt="Forge Bot" className="w-full h-full object-cover" />
                                            </div>
                                            <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                                                <div className="flex items-center gap-1.5 h-4">
                                                    {[0, 1, 2].map(i => (
                                                        <motion.span
                                                            key={i}
                                                            className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                                                            animate={{ y: [0, -4, 0] }}
                                                            transition={{ duration: 0.7, delay: i * 0.15, repeat: Infinity }}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Quick prompts */}
                                <div className="flex-shrink-0 bg-white border-t border-slate-100 px-3 pt-2.5 pb-1">
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 px-1">Quick Questions</p>
                                    <div className="flex gap-1.5 overflow-x-auto pb-1.5 scrollbar-hide">
                                        {QUICK_PROMPTS.map((prompt) => (
                                            <button
                                                key={prompt}
                                                onClick={() => sendMessage(prompt)}
                                                className="shrink-0 text-[10px] px-2.5 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full hover:bg-emerald-100 transition-colors font-medium whitespace-nowrap"
                                            >
                                                {prompt}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Input */}
                                <div className="flex-shrink-0 bg-white border-t border-slate-100 p-3">
                                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-100 transition-all">
                                        <input
                                            ref={inputRef}
                                            type="text"
                                            value={input}
                                            onChange={e => setInput(e.target.value)}
                                            onKeyDown={handleKeyDown}
                                            placeholder="Ask anything about Farm2Fork..."
                                            className="flex-1 bg-transparent text-xs text-slate-700 placeholder-slate-400 outline-none font-medium"
                                        />
                                        <button
                                            onClick={() => sendMessage()}
                                            disabled={!input.trim() || isTyping}
                                            className="w-7 h-7 rounded-xl bg-emerald-600 disabled:bg-slate-200 text-white disabled:text-slate-400 flex items-center justify-center transition-all hover:bg-emerald-500 shrink-0"
                                        >
                                            <Send size={13} />
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                        {!isMinimized && activeTab === 'voice' && (
                            <VoiceAgentTab />
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default LandingAssistant;
