import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useConversation } from '@elevenlabs/react';
import { Mic, Square, Loader2, AlertCircle, Volume2, MicOff } from 'lucide-react';
import forgeBotImg from '../../assets/forge_bot.png';

export const VoiceAgentTab = () => {
    const [signedUrl, setSignedUrl] = useState(null);
    const [hasMicPermission, setHasMicPermission] = useState(false);
    const [fetchError, setFetchError] = useState('');

    const conversation = useConversation({
        onConnect: () => console.log('Connected to ElevenLabs'),
        onDisconnect: () => console.log('Disconnected from ElevenLabs'),
        onMessage: (message) => console.log('Message:', message),
        onError: (error) => console.error('ElevenLabs Error:', error)
    });

    const checkMicPermission = async () => {
        try {
            await navigator.mediaDevices.getUserMedia({ audio: true });
            setHasMicPermission(true);
            return true;
        } catch (err) {
            console.error("Mic permission denied", err);
            setHasMicPermission(false);
            setFetchError("Microphone access is required to talk to Forge.");
            return false;
        }
    };

    const fetchSignedUrl = async () => {
        try {
            setFetchError('');
            const res = await fetch('http://localhost:5000/api/public/voice-session');
            const data = await res.json();
            if (data.success && data.signedUrl) {
                setSignedUrl(data.signedUrl);
                return data.signedUrl;
            } else {
                setFetchError(data.message || 'Failed to get secure session token.');
                return null;
            }
        } catch (error) {
            setFetchError('Connection error. Is the backend running?');
            return null;
        }
    };

    const handleStartConversation = async () => {
        const hasMic = await checkMicPermission();
        if (!hasMic) return;

        let urlToUse = signedUrl;
        if (!urlToUse) {
            urlToUse = await fetchSignedUrl();
        }

        if (urlToUse) {
            try {
                // useConversation expects either agentId OR signedUrl
                // We pass signedUrl to keep our API key safe on the backend.
                await conversation.startSession({ signedUrl: urlToUse });
            } catch (error) {
                console.error("Failed to start session:", error);
                setFetchError("Failed to connect to Forge Voice.");
            }
        }
    };

    const handleStopConversation = useCallback(async () => {
        await conversation.endSession();
    }, [conversation]);


    return (
        <div className="flex flex-col items-center justify-center p-6 h-[400px]">
            {fetchError && (
                <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2 text-red-600 text-xs w-full">
                    <AlertCircle size={14} className="shrink-0 mt-0.5" />
                    <span>{fetchError}</span>
                </div>
            )}

            <div className="relative mb-8">
                {/* Visualizer Rings */}
                <AnimatePresence>
                    {conversation.status === 'connected' && (
                        <>
                            <motion.div
                                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute inset-[-20px] rounded-full bg-emerald-400"
                            />
                            <motion.div
                                animate={{ scale: [1, 1.4, 1], opacity: [0.2, 0, 0.2] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                                className="absolute inset-[-40px] rounded-full bg-emerald-200"
                            />
                        </>
                    )}
                </AnimatePresence>

                <div className={`relative z-10 w-24 h-24 rounded-full border-4 shadow-xl overflow-hidden bg-white flex items-center justify-center transition-colors duration-500 ${conversation.status === 'connected' ? (conversation.isSpeaking ? 'border-emerald-400 shadow-emerald-200' : 'border-teal-400 shadow-teal-200') : 'border-slate-100'}`}>
                    {conversation.status === 'connected' && !conversation.isSpeaking && (
                        <div className="absolute inset-0 bg-teal-50/50 flex items-center justify-center opacity-70">
                            <Mic size={32} className="text-teal-400" />
                        </div>
                    )}
                    <img src={forgeBotImg} alt="Forge Bot" className={`w-full h-full object-cover transition-opacity duration-300 ${conversation.status === 'connected' && !conversation.isSpeaking ? 'opacity-30' : 'opacity-100'}`} />
                </div>
            </div>

            <div className="text-center mb-10 h-10">
                {conversation.status === 'disconnected' && (
                    <>
                        <h4 className="font-bold text-slate-800">Voice Assistant</h4>
                        <p className="text-xs text-slate-500 mt-1">Talk to Forge directly</p>
                    </>
                )}
                {conversation.status === 'connecting' && (
                    <div className="flex flex-col items-center gap-2 text-emerald-600">
                        <Loader2 size={18} className="animate-spin" />
                        <span className="text-xs font-semibold">Connecting...</span>
                    </div>
                )}
                {conversation.status === 'connected' && (
                    <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center">
                        <div className="flex items-center gap-2">
                            {conversation.isSpeaking ? <Volume2 size={16} className="text-emerald-500" /> : <Mic size={16} className="text-teal-500 animate-pulse" />}
                            <h4 className={`font-bold ${conversation.isSpeaking ? 'text-emerald-600' : 'text-teal-600'}`}>
                                {conversation.isSpeaking ? 'Forge is speaking...' : 'Listening...'}
                            </h4>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">Speak clearly into your microphone</p>
                    </motion.div>
                )}
            </div>

            <div className="flex gap-4 w-full px-6">
                {conversation.status === 'connected' ? (
                    <button
                        onClick={handleStopConversation}
                        className="flex-1 py-3 bg-red-50 text-red-600 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-100 transition-colors"
                    >
                        <Square size={16} className="fill-current" /> Stop
                    </button>
                ) : (
                    <button
                        onClick={handleStartConversation}
                        disabled={conversation.status === 'connecting'}
                        className="flex-1 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-lg disabled:opacity-50 transition-all active:scale-95 shadow-emerald-500/25"
                    >
                        <Mic size={18} /> {conversation.status === 'connecting' ? 'Connecting...' : 'Start Voice Chat'}
                    </button>
                )}
            </div>

            {conversation.status === 'connected' && (
                <button
                    onClick={() => conversation.setVolume({ volume: conversation.isMuted ? 1 : 0 })}
                    className="mt-6 text-slate-400 hover:text-slate-600 text-xs flex items-center gap-1 transition-colors"
                >
                    {conversation.isMuted ? <MicOff size={14} /> : <Mic size={14} />}
                    {conversation.isMuted ? 'Unmute microphone' : 'Mute microphone'}
                </button>
            )}

        </div>
    );
};
