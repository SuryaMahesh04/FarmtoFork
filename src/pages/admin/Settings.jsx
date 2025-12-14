import React, { useState } from 'react';
import { User, Bell, Shield, Save } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/ui/Button';

const Settings = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const [formData, setFormData] = useState({
        name: 'Admin User',
        email: 'admin@farm2fork.com',
        phone: '+91 98765 43210',
        notifications: true,
        platformAlerts: true,
    });

    const tabs = [
        { id: 'profile', label: 'Profile Settings', icon: User },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'security', label: 'Security', icon: Shield },
    ];

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSave = () => {
        alert('Settings saved successfully!');
    };

    return (
        <DashboardLayout role="admin">
            <div className="max-w-4xl mx-auto space-y-6 animate-in">
                <div>
                    <h1 className="text-2xl font-display font-bold text-slate-800">Settings</h1>
                    <p className="text-slate-500">Manage admin account and platform preferences</p>
                </div>

                <div className="flex flex-col md:flex-row gap-6">
                    {/* Sidebar Tabs */}
                    <div className="w-full md:w-64 space-y-2">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-white text-slate-600 hover:bg-blue-50'
                                    }`}
                            >
                                <tab.icon size={18} />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 bg-white p-6 rounded-xl shadow-sm border border-slate-100 min-h-[500px]">
                        {activeTab === 'profile' && (
                            <div className="space-y-6 animate-in fade-in">
                                <h2 className="text-lg font-semibold text-slate-800 border-b border-slate-100 pb-2">Admin Profile Information</h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Full Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full p-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Email Address</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full p-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Phone Number</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full p-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <Button icon={Save} onClick={handleSave}>Save Changes</Button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'notifications' && (
                            <div className="space-y-6 animate-in fade-in">
                                <h2 className="text-lg font-semibold text-slate-800 border-b border-slate-100 pb-2">Notification Preferences</h2>

                                <div className="space-y-4">
                                    <label className="flex items-center justify-between p-4 border border-slate-100 rounded-lg hover:bg-slate-50 cursor-pointer">
                                        <div className="flex gap-3">
                                            <Bell className="text-blue-600" />
                                            <div>
                                                <p className="font-medium text-slate-800">Push Notifications</p>
                                                <p className="text-sm text-slate-500">Receive alerts for platform activities</p>
                                            </div>
                                        </div>
                                        <input
                                            type="checkbox"
                                            name="notifications"
                                            checked={formData.notifications}
                                            onChange={handleChange}
                                            className="w-5 h-5 text-blue-600 rounded bg-gray-100 border-gray-300 focus:ring-blue-500"
                                        />
                                    </label>

                                    <label className="flex items-center justify-between p-4 border border-slate-100 rounded-lg hover:bg-slate-50 cursor-pointer">
                                        <div className="flex gap-3">
                                            <Shield className="text-blue-600" />
                                            <div>
                                                <p className="font-medium text-slate-800">Platform Alerts</p>
                                                <p className="text-sm text-slate-500">Critical system notifications</p>
                                            </div>
                                        </div>
                                        <input
                                            type="checkbox"
                                            name="platformAlerts"
                                            checked={formData.platformAlerts}
                                            onChange={handleChange}
                                            className="w-5 h-5 text-blue-600 rounded bg-gray-100 border-gray-300 focus:ring-blue-500"
                                        />
                                    </label>
                                </div>

                                <div className="pt-4">
                                    <Button icon={Save} onClick={handleSave}>Save Preferences</Button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div className="space-y-6 animate-in fade-in">
                                <h2 className="text-lg font-semibold text-slate-800 border-b border-slate-100 pb-2">Security Settings</h2>

                                <div className="space-y-4">
                                    <div className="p-4 border border-yellow-100 bg-yellow-50 rounded-lg text-yellow-800 text-sm">
                                        Password was last changed 2 months ago. It's recommended to update it regularly.
                                    </div>

                                    <Button variant="outline">Change Password</Button>
                                    <Button variant="outline" className="text-blue-600 hover:bg-blue-50 border-blue-200">
                                        Enable 2FA
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Settings;
