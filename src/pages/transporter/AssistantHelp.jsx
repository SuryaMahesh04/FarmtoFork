import React, { useState, useEffect, useRef } from 'react';
import { Send, Mic, User, Bot, Volume2, X, Globe } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { assistantLogic } from '../../utils/assistantLogic';
import { authHelpers } from '../../utils/api';

const AssistantHelp = () => {
    const [messages, setMessages] = useState([
        { id: 1, text: "Hello! How can I help you with your logistics today?", sender: 'bot', timestamp: new Date() }
    ]);
    const [input, setInput] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [language, setLanguage] = useState('en'); // en, hi, te
    const [showLanguageModal, setShowLanguageModal] = useState(true);
    
    const messagesEndRef = useRef(null);
    const user = authHelpers.getUser();

    // Scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Handle Send
    const handleSend = () => {
        if (!input.trim()) return;

        const userMsg = { id: Date.now(), text: input, sender: 'user', timestamp: new Date() };
        setMessages(prev => [...prev, userMsg]);
        setInput('');

        // Simulate thinking delay
        setTimeout(() => {
            const responseText = assistantLogic.processQuery(userMsg.text, language);
            const botMsg = { id: Date.now() + 1, text: responseText, sender: 'bot', timestamp: new Date() };
            setMessages(prev => [...prev, botMsg]);
            
            // Auto-speak response
            speak(responseText);
        }, 600);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') handleSend();
    };

    // Text to Speech
    const speak = (text) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel(); // Stop previous
            const utterance = new SpeechSynthesisUtterance(text);
            // Try to set language voice if available
            if (language === 'hi') utterance.lang = 'hi-IN';
            else if (language === 'te') utterance.lang = 'te-IN';
            else utterance.lang = 'en-US';
            
            window.speechSynthesis.speak(utterance);
        }
    };

    // Speech to Text (Web Speech API)
    const toggleListening = () => {
        if (!('webkitSpeechRecognition' in window)) {
            alert('Speech recognition is not supported in this browser.');
            return;
        }

        if (isListening) {
            setIsListening(false);
            return;
        }

        const recognition = new window.webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        
        if (language === 'hi') recognition.lang = 'hi-IN';
        else if (language === 'te') recognition.lang = 'te-IN';
        else recognition.lang = 'en-US';

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setInput(transcript);
            // Optionally auto-send
            // handleSend(transcript); 
        };

        recognition.start();
    };

    return (
        <DashboardLayout role="transporter">
            <div className="h-[calc(100vh-100px)] flex flex-col bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden relative">
                
                {/* Header */}
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-blue-200 shadow-lg">
                            <Bot size={24} />
                        </div>
                        <div>
                            <h2 className="font-bold text-slate-800">Transporter Assistant</h2>
                            <div className="flex items-center gap-2 text-xs">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                <span className="text-slate-500">Online • {language === 'en' ? 'English' : language === 'hi' ? 'Hindi' : 'Telugu'}</span>
                            </div>
                        </div>
                    </div>
                    <button 
                        onClick={() => setShowLanguageModal(true)}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                        title="Change Language"
                    >
                        <Globe size={20} />
                    </button>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50/50">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.sender === 'bot' && (
                                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 mr-2 mt-1">
                                    <Bot size={16} />
                                </div>
                            )}
                            <div className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${
                                msg.sender === 'user' 
                                ? 'bg-blue-600 text-white rounded-br-none' 
                                : 'bg-white text-slate-800 border border-slate-100 rounded-bl-none'
                            }`}>
                                <p className="text-sm md:text-base leading-relaxed">{msg.text}</p>
                                <div className={`mt-2 flex items-center justify-between text-xs ${msg.sender === 'user' ? 'text-blue-100' : 'text-slate-400'}`}>
                                    {msg.sender === 'bot' && (
                                        <button onClick={() => speak(msg.text)} className="hover:text-blue-500">
                                            <Volume2 size={14} />
                                        </button>
                                    )}
                                </div>
                            </div>
                            {msg.sender === 'user' && (
                                <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center flex-shrink-0 ml-2 mt-1">
                                    <User size={16} />
                                </div>
                            )}
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-slate-100">
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={toggleListening}
                            className={`p-3 rounded-full transition-all duration-300 ${
                                isListening 
                                ? 'bg-red-500 text-white shadow-lg shadow-red-200 scale-110 animate-pulse' 
                                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                            }`}
                        >
                            <Mic size={20} />
                        </button>
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Ask your question here..."
                                className="w-full pl-5 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm md:text-base"
                            />
                        </div>
                        <button 
                            onClick={handleSend}
                            disabled={!input.trim()}
                            className="p-3 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
                        >
                            <Send size={20} />
                        </button>
                    </div>
                </div>

                {/* Language Modal */}
                {showLanguageModal && (
                    <div className="absolute inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
                        <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
                            <div className="relative text-center mb-8">
                                <button 
                                    onClick={() => setShowLanguageModal(false)}
                                    className="absolute -top-4 -right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Globe size={32} />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-800 mb-2">Choose Language</h3>
                                <p className="text-slate-500">Select your preferred language for assistance</p>
                            </div>

                            <div className="space-y-3">
                                {[
                                    { code: 'en', label: 'English', sub: 'US' },
                                    { code: 'hi', label: 'हिंदी (Hindi)', sub: 'IN' },
                                    { code: 'te', label: 'తెలుగు (Telugu)', sub: 'IN' }
                                ].map((lang) => (
                                    <button
                                        key={lang.code}
                                        onClick={() => {
                                            setLanguage(lang.code);
                                            setShowLanguageModal(false);
                                            
                                            // Get new greeting
                                            const newGreeting = assistantLogic.processQuery('hello', lang.code);
                                            
                                            // Reset chat with greeting in new language
                                            setMessages([
                                                { 
                                                    id: Date.now(), 
                                                    text: newGreeting, 
                                                    sender: 'bot', 
                                                    timestamp: new Date() 
                                                }
                                            ]);

                                            // Auto-speak the greeting
                                            setTimeout(() => speak(newGreeting), 100);
                                        }}
                                        className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all group"
                                    >
                                        <span className="font-semibold text-slate-700 group-hover:text-blue-700 text-lg">{lang.label}</span>
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{lang.sub}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default AssistantHelp;
