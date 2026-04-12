import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import logo from '../../assets/logo2.png';

const PublicPageLayout = ({ title, children, lastUpdated }) => {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 transition-transform hover:scale-105">
                        <img src={logo} alt="Farm2Fork" className="h-8 w-auto" />
                        <span className="font-display font-bold text-xl text-slate-800">
                            Farm<span className="text-emerald-600">2</span>Fork
                        </span>
                    </Link>
                    <Link to="/" className="text-sm font-medium text-slate-500 hover:text-emerald-600 flex items-center gap-1.5 transition-colors bg-slate-50 hover:bg-emerald-50 px-3 py-1.5 rounded-full">
                        <ArrowLeft size={14} /> Back to Home
                    </Link>
                </div>
            </header>
            
            <main className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 md:p-12">
                    <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-2">{title}</h1>
                    {lastUpdated && (
                        <p className="text-sm text-slate-500 font-medium mb-8 pb-8 border-b border-slate-100">
                            Last updated: {lastUpdated}
                        </p>
                    )}
                    
                    <div className="prose prose-slate prose-emerald max-w-none 
                        prose-headings:font-display prose-headings:font-bold prose-headings:text-slate-800 
                        prose-h2:mt-8 prose-h2:mb-4 prose-h2:border-b prose-h2:border-slate-100 prose-h2:pb-2
                        prose-p:text-slate-600 prose-p:leading-relaxed prose-p:mb-6
                        prose-ul:text-slate-600 prose-ul:mb-6 prose-li:my-1
                        prose-a:text-emerald-600 hover:prose-a:text-emerald-700 prose-strong:text-slate-800
                        prose-table:w-full prose-table:border-collapse prose-th:bg-slate-50 prose-th:p-3 prose-th:border prose-th:border-slate-200 prose-th:text-left
                        prose-td:p-3 prose-td:border prose-td:border-slate-200">
                        {children}
                    </div>
                </div>
            </main>

            <footer className="bg-white border-t border-slate-200 py-8 mt-auto">
                <div className="container mx-auto px-4 text-center flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="text-sm font-medium text-slate-500">
                        &copy; {new Date().getFullYear()} Farm2Fork Inc. All rights reserved.
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-medium text-slate-400">
                        <Link to="/about-us" className="hover:text-emerald-600 transition-colors">Team</Link>
                        <Link to="/architecture" className="hover:text-emerald-600 transition-colors">Architecture</Link>
                        <Link to="/security" className="hover:text-emerald-600 transition-colors">Security</Link>
                        <Link to="/documentation" className="hover:text-emerald-600 transition-colors">Docs</Link>
                        <Link to="/privacy-policy" className="hover:text-emerald-600 transition-colors">Privacy</Link>
                        <Link to="/terms-of-service" className="hover:text-emerald-600 transition-colors">Terms</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default PublicPageLayout;
