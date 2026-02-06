import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { MessageSquareText } from 'lucide-react';

const Assistant = () => {
    return (
        <DashboardLayout role="transporter">
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-display font-bold text-slate-800 flex items-center gap-2">
                        <MessageSquareText className="text-emerald-600" />
                        Assistant Help
                    </h1>
                    <p className="text-slate-500">Get AI-powered assistance for your logistics</p>
                </div>
                
                <div className="bg-white p-12 rounded-xl border border-dashed border-slate-300 text-center">
                    <MessageSquareText size={48} className="mx-auto text-slate-300 mb-4" />
                    <h3 className="text-lg font-medium text-slate-700">AI Assistant Coming Soon</h3>
                    <p className="text-slate-500">This feature is currently under development.</p>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Assistant;
