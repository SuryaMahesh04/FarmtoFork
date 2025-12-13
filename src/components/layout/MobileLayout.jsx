import React from 'react';
import MobileHeader from './MobileHeader';
import MobileNav from './MobileNav';

const MobileLayout = ({ children, role }) => {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Mobile Header */}
            <MobileHeader role={role} />

            {/* Main Content Area */}
            <main className="flex-1 pt-16 pb-20 px-4 overflow-y-auto">
                <div className="max-w-full mx-auto">
                    {children}
                </div>
            </main>

            {/* Bottom Navigation */}
            <MobileNav role={role} />
        </div>
    );
};

export default MobileLayout;
