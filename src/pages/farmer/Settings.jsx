import React, { useState, useEffect } from 'react';
import { User, Bell, Shield, Globe, Save, Loader2, AlertCircle, Sprout, FileText, MapPin } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import { api, authHelpers } from '../../utils/api';
import { indiaStates, cropTypes, landTypes } from '../../data/indiaGeoData';

const Settings = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const [formData, setFormData] = useState({
        // Personal
        fullName: '',
        email: '',
        mobile: '',
        state: '',
        district: '',
        village: '',

        // Farm
        landSize: '',
        landType: '',
        primaryCrop: '',
        organicCertified: false,

        // Banking & KYC
        aadhaarNumber: '',
        bankAccount: '',
        ifscCode: '',

        // Preferences
        notifications: true,
        newsletter: false,
    });

    const selectedState = formData.state;

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const res = await api.auth.getMe();
            if (res.success) {
                const user = res.data;
                const profile = user.profile || {};

                setFormData({
                    // Personal
                    fullName: profile.fullName || '',
                    email: user.email || '',
                    mobile: profile.mobile || '',
                    state: profile.state || '',
                    district: profile.district || '',
                    village: profile.village || '',

                    // Farm
                    landSize: profile.landSize || '',
                    landType: profile.landType || '',
                    primaryCrop: profile.primaryCrop || '',
                    organicCertified: profile.organicCertified || false,

                    // Banking & KYC
                    aadhaarNumber: profile.aadhaarNumber || '',
                    bankAccount: profile.bankAccount || '',
                    ifscCode: profile.ifscCode || '',

                    // Preferences
                    notifications: true,
                    newsletter: false,
                });
            }
        } catch (err) {
            console.error('Fetch profile error:', err);
            setMessage({ type: 'error', text: 'Failed to load profile data' });
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { id: 'profile', label: 'Profile & Farm', icon: User },
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

    // Specific handler for selects to match native event structure or direct value
    const handleSelectChange = (name, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            setMessage({ type: '', text: '' });

            // Construct specific profile object for backend
            const profileUpdate = {
                fullName: formData.fullName,
                mobile: formData.mobile,
                state: formData.state,
                district: formData.district,
                village: formData.village,

                landSize: parseFloat(formData.landSize),
                landType: formData.landType,
                primaryCrop: formData.primaryCrop,
                organicCertified: formData.organicCertified,

                aadhaarNumber: formData.aadhaarNumber,
                bankAccount: formData.bankAccount,
                ifscCode: formData.ifscCode
            };

            const res = await api.auth.updateProfile(profileUpdate);

            if (res.success) {
                setMessage({ type: 'success', text: 'Settings saved successfully!' });

                // Update local storage user
                const currentUser = authHelpers.getUser();
                if (currentUser) {
                    currentUser.profile = { ...currentUser.profile, ...profileUpdate };
                    authHelpers.saveUser(currentUser);
                }
            } else {
                setMessage({ type: 'error', text: res.message || 'Failed to save settings' });
            }
        } catch (err) {
            console.error('Save error:', err);
            setMessage({ type: 'error', text: 'Failed to save settings. Please try again.' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <DashboardLayout role="farmer">
                <div className="flex justify-center items-center h-96">
                    <Loader2 className="animate-spin text-sage-500" size={48} />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout role="farmer">
            <div className="max-w-4xl mx-auto space-y-6 animate-in">
                <div>
                    <h1 className="text-2xl font-display font-bold text-slate-800">Settings</h1>
                    <p className="text-slate-500">Manage your account and preferences</p>
                </div>

                {message.text && (
                    <div className={`p-4 rounded-lg flex items-center gap-2 ${message.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
                        }`}>
                        <AlertCircle size={20} />
                        {message.text}
                    </div>
                )}

                <div className="flex flex-col md:flex-row gap-6">
                    {/* Sidebar Tabs */}
                    <div className="w-full md:w-64 space-y-2">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id
                                    ? 'bg-sage-100 text-sage-800'
                                    : 'bg-white text-slate-600 hover:bg-sage-50'
                                    }`}
                            >
                                <tab.icon size={18} />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 bg-white p-6 rounded-xl shadow-sm border border-sage-100 min-h-[500px]">
                        {activeTab === 'profile' && (
                            <div className="space-y-8 animate-in fade-in">

                                {/* Personal Section */}
                                <section className="space-y-4">
                                    <h2 className="text-lg font-semibold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
                                        <User size={20} className="text-sage-500" /> Personal Details
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700">Full Name</label>
                                            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full p-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-sage-400 focus:outline-none" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700">Mobile Number</label>
                                            <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} className="w-full p-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-sage-400 focus:outline-none" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700">Email Address (Read Only)</label>
                                            <input type="email" name="email" value={formData.email} disabled className="w-full p-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700">State</label>
                                            <select
                                                name="state"
                                                value={formData.state}
                                                onChange={handleChange}
                                                className="w-full p-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-sage-400 focus:outline-none bg-white"
                                            >
                                                <option value="">Select State</option>
                                                {indiaStates.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700">District</label>
                                            <select
                                                name="district"
                                                value={formData.district}
                                                onChange={handleChange}
                                                disabled={!formData.state}
                                                className="w-full p-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-sage-400 focus:outline-none bg-white disabled:bg-slate-50"
                                            >
                                                <option value="">Select District</option>
                                                {formData.state && indiaStates.find(s => s.value === formData.state)?.districts.map(d => (
                                                    <option key={d.name} value={d.name}>{d.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700">Village</label>

                                            {(() => {
                                                const currentVillages = formData.state && formData.district
                                                    ? indiaStates.find(s => s.value === formData.state)?.districts.find(d => d.name === formData.district)?.villages || []
                                                    : [];

                                                const isCustomVillage = formData.village && !currentVillages.includes(formData.village) && formData.village !== 'Other';

                                                return (
                                                    <div className="space-y-2">
                                                        <select
                                                            name="village"
                                                            value={currentVillages.includes(formData.village) ? formData.village : 'Other'}
                                                            onChange={(e) => {
                                                                if (e.target.value === 'Other') {
                                                                    setFormData(prev => ({ ...prev, village: 'Other' })); // Temporary placeholder
                                                                } else {
                                                                    handleChange(e);
                                                                }
                                                            }}
                                                            disabled={!formData.district}
                                                            className="w-full p-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-sage-400 focus:outline-none bg-white disabled:bg-slate-50"
                                                        >
                                                            <option value="">Select Village</option>
                                                            {currentVillages.map(v => (
                                                                <option key={v} value={v}>{v}</option>
                                                            ))}
                                                        </select>

                                                        {(formData.village === 'Other' || isCustomVillage) && (
                                                            <input
                                                                type="text"
                                                                placeholder="Enter Village Name"
                                                                value={formData.village === 'Other' ? '' : formData.village}
                                                                onChange={(e) => setFormData(prev => ({ ...prev, village: e.target.value }))}
                                                                className="w-full p-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-sage-400 focus:outline-none animate-in fade-in slide-in-from-top-1"
                                                            />
                                                        )}
                                                    </div>
                                                );
                                            })()}
                                        </div>
                                    </div>
                                </section>

                                {/* Farm Section */}
                                <section className="space-y-4">
                                    <h2 className="text-lg font-semibold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
                                        <Sprout size={20} className="text-wheat-500" /> Farm Details
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700">Total Land Size (Acres)</label>
                                            <input type="number" name="landSize" value={formData.landSize} onChange={handleChange} className="w-full p-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-sage-400 focus:outline-none" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700">Land Type</label>
                                            <select name="landType" value={formData.landType} onChange={handleChange} className="w-full p-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-sage-400 focus:outline-none bg-white">
                                                <option value="">Select Type</option>
                                                {landTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700">Primary Crop</label>
                                            <select name="primaryCrop" value={formData.primaryCrop} onChange={handleChange} className="w-full p-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-sage-400 focus:outline-none bg-white">
                                                <option value="">Select Crop</option>
                                                {cropTypes.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                                            </select>
                                        </div>
                                        <div className="space-y-2 flex items-center pt-6">
                                            <label className="flex items-center gap-3 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    name="organicCertified"
                                                    checked={formData.organicCertified}
                                                    onChange={handleChange}
                                                    className="w-5 h-5 text-sage-600 rounded bg-gray-100 border-gray-300 focus:ring-sage-500"
                                                />
                                                <span className="text-sm font-medium text-slate-700">Organic Certified?</span>
                                            </label>
                                        </div>
                                    </div>
                                </section>

                                {/* Banking & KYC Section */}
                                <section className="space-y-4">
                                    <h2 className="text-lg font-semibold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
                                        <FileText size={20} className="text-sky-500" /> Banking & KYC
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700">Aadhaar Number</label>
                                            <input type="text" name="aadhaarNumber" value={formData.aadhaarNumber} onChange={handleChange} className="w-full p-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-sage-400 focus:outline-none" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700">Bank Account Number</label>
                                            <input type="text" name="bankAccount" value={formData.bankAccount} onChange={handleChange} className="w-full p-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-sage-400 focus:outline-none" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700">IFSC Code</label>
                                            <input type="text" name="ifscCode" value={formData.ifscCode} onChange={handleChange} className="w-full p-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-sage-400 focus:outline-none" />
                                        </div>
                                    </div>
                                </section>

                                <div className="pt-4 flex justify-end">
                                    <Button icon={Save} onClick={handleSave} disabled={saving} className="w-full md:w-auto">
                                        {saving ? 'Saving...' : 'Save All Changes'}
                                    </Button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'notifications' && (
                            <div className="space-y-6 animate-in fade-in">
                                <h2 className="text-lg font-semibold text-slate-800 border-b border-slate-100 pb-2">Notification Preferences</h2>

                                <div className="space-y-4">
                                    <label className="flex items-center justify-between p-4 border border-slate-100 rounded-lg hover:bg-slate-50 cursor-pointer">
                                        <div className="flex gap-3">
                                            <Bell className="text-sage-600" />
                                            <div>
                                                <p className="font-medium text-slate-800">Push Notifications</p>
                                                <p className="text-sm text-slate-500">Receive alerts on your device for updates</p>
                                            </div>
                                        </div>
                                        <input
                                            type="checkbox"
                                            name="notifications"
                                            checked={formData.notifications}
                                            onChange={handleChange}
                                            className="w-5 h-5 text-sage-600 rounded bg-gray-100 border-gray-300 focus:ring-sage-500"
                                        />
                                    </label>

                                    <label className="flex items-center justify-between p-4 border border-slate-100 rounded-lg hover:bg-slate-50 cursor-pointer">
                                        <div className="flex gap-3">
                                            <Globe className="text-wheat-600" />
                                            <div>
                                                <p className="font-medium text-slate-800">Email Newsletter</p>
                                                <p className="text-sm text-slate-500">Subscribe effectively to our weekly digest</p>
                                            </div>
                                        </div>
                                        <input
                                            type="checkbox"
                                            name="newsletter"
                                            checked={formData.newsletter}
                                            onChange={handleChange}
                                            className="w-5 h-5 text-sage-600 rounded bg-gray-100 border-gray-300 focus:ring-sage-500"
                                        />
                                    </label>
                                </div>
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div className="space-y-6 animate-in fade-in">
                                <h2 className="text-lg font-semibold text-slate-800 border-b border-slate-100 pb-2">Security Settings</h2>

                                <div className="space-y-4">
                                    <div className="p-4 border border-yellow-100 bg-yellow-50 rounded-lg text-yellow-800 text-sm">
                                        Password was last changed 3 months ago. It's recommended to update it regularly.
                                    </div>

                                    <Button variant="outline">Change Password</Button>
                                    <Button variant="outline" className="text-red-500 hover:bg-red-50 hover:text-red-600 border-red-200">
                                        Deactivate Account
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
