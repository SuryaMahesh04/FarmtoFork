import React from 'react';
import { X, Copy, CheckCircle, ShieldAlert } from 'lucide-react';
import Button from '../ui/Button';

const DriverCredentialsModal = ({ isOpen, onClose, credentials }) => {
    const [copiedEmail, setCopiedEmail] = React.useState(false);
    const [copiedPassword, setCopiedPassword] = React.useState(false);

    if (!isOpen || !credentials) return null;

    const copyToClipboard = (text, type) => {
        navigator.clipboard.writeText(text);
        if (type === 'email') {
            setCopiedEmail(true);
            setTimeout(() => setCopiedEmail(false), 2000);
        } else {
            setCopiedPassword(true);
            setTimeout(() => setCopiedPassword(false), 2000);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white text-center">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                        <CheckCircle size={32} className="text-white" />
                    </div>
                    <h2 className="text-xl font-bold">Driver Account Created</h2>
                    <p className="text-emerald-100 text-sm mt-1">Please save these credentials securely</p>
                </div>

                <div className="p-6 space-y-6">
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
                        <ShieldAlert className="text-amber-600 shrink-0" size={20} />
                        <p className="text-xs text-amber-800">
                            For security reasons, this password will only be shown once. Please share it with the driver immediately.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Username / Email</label>
                            <div className="flex gap-2">
                                <div className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-800 font-mono">
                                    {credentials.email}
                                </div>
                                <button
                                    onClick={() => copyToClipboard(credentials.email, 'email')}
                                    className="p-2.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg border border-slate-200 transition-colors"
                                    title="Copy Email"
                                >
                                    {copiedEmail ? <CheckCircle size={18} /> : <Copy size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Password</label>
                            <div className="flex gap-2">
                                <div className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-800 font-mono">
                                    {credentials.password}
                                </div>
                                <button
                                    onClick={() => copyToClipboard(credentials.password, 'password')}
                                    className="p-2.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg border border-slate-200 transition-colors"
                                    title="Copy Password"
                                >
                                    {copiedPassword ? <CheckCircle size={18} /> : <Copy size={18} />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <Button 
                        className="w-full justify-center bg-slate-800 hover:bg-slate-900 text-white"
                        onClick={onClose}
                    >
                        I've Saved These Credentials
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default DriverCredentialsModal;
