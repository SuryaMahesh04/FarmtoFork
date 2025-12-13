import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

const DashboardLayout = ({ children, role }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className="min-h-screen bg-sage-50 flex flex-col">
            <Header toggleSidebar={toggleSidebar} role={role} />

            <Sidebar
                isOpen={isSidebarOpen}
                toggleSidebar={toggleSidebar}
                role={role}
            />

            <main className={`
        flex-1 pt-20 px-4 md:px-8 pb-8 transition-all duration-300 ease-in-out
        lg:ml-64 relative z-0
      `}>
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
