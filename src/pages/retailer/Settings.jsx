import React, { useState, useEffect } from 'react';
import { User, Bell, Shield, Save, Store } from 'lucide-react';
import { api, authHelpers } from '../../utils/api';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/ui/Button';
import PlacesAutocomplete from '../../components/ui/PlacesAutocomplete';
import LocationPickerModal from '../../components/ui/LocationPickerModal';
import { MapPin } from 'lucide-react';

const Settings = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(false);
    const [isMapOpen, setIsMapOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        storeName: '',
        storeAddress: '',
        address: null,
        gstNumber: '',
        notifications: true,
        stockAlerts: false,
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const res = await api.auth.getMe();
            if (res.success && res.data) {
                const user = res.data;
                const profile = user.profile || {};
                setFormData(prev => ({
                    ...prev,
                    name: profile.fullName || '',
                    email: user.email || '',
                    phone: profile.mobile || '',
                    storeName: profile.storeName || '',
                    storeAddress: profile.storeAddress || '',
                    address: profile.address || null,
                    gstNumber: profile.gstNumber || '',
                }));
            }
        } catch (error) {
            console.error('Fetch profile error', error);
        } finally {
            setLoading(false);
        }
    };

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

    const handleSave = async () => {
        try {
            setLoading(true);
            const profileUpdate = {
                fullName: formData.name,
                mobile: formData.phone,
                storeName: formData.storeName,
                storeAddress: formData.storeAddress,
                gstNumber: formData.gstNumber,
                address: formData.address
            };

            const res = await api.auth.updateProfile(profileUpdate);
            if (res.success) {
                authHelpers.saveUser(res.data);
                alert('Settings saved successfully!');
            }
        } catch (error) {
            alert('Failed to save settings: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout role="retailer">
            <div className="max-w-4xl mx-auto space-y-6 animate-in">
                <div>
                    <h1 className="text-2xl font-display font-bold text-slate-800">Settings</h1>
                    <p className="text-slate-500">Manage your account and preferences</p>
                </div>

                <div className="flex flex-col md:flex-row gap-6">
                    {/* Sidebar Tabs */}
                    <div className="w-full md:w-64 space-y-2">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-white text-slate-600 hover:bg-emerald-50'
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
                                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                                    <h2 className="text-lg font-semibold text-slate-800">Store & Profile Information</h2>
                                    <button 
                                        type="button"
                                        onClick={() => setIsMapOpen(true)}
                                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 hover:bg-emerald-100 transition-all shadow-sm"
                                    >
                                        <MapPin size={14} />
                                        Pin on Map
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Full Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full p-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Store Name</label>
                                        <input
                                            type="text"
                                            name="storeName"
                                            value={formData.storeName}
                                            onChange={handleChange}
                                            className="w-full p-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Email Address</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            disabled
                                            className="w-full p-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Phone Number</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full p-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                                        />
                                    </div>

                                    <div className="space-y-4 md:col-span-2">
                                        <label className="text-sm font-medium text-slate-700">Store Location (GPS)</label>
                                        <div className="p-3 bg-emerald-50 text-emerald-800 rounded-lg text-sm border border-emerald-100 mb-2">
                                            Pinpoint your store on the global map for supply chain transparency.
                                        </div>
                                        <PlacesAutocomplete
                                            value={formData.address}
                                            onChange={(addr) => {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    address: addr,
                                                    storeAddress: addr.formattedAddress || prev.storeAddress
                                                }));
                                            }}
                                            placeholder="Search for your store location..."
                                        />
                                        
                                        <div className="grid grid-cols-2 gap-4 mt-2">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-slate-700">Latitude</label>
                                                <input
                                                    type="number"
                                                    placeholder="e.g. 12.9716"
                                                    value={formData.address?.coordinates?.lat || ''}
                                                    onChange={(e) => {
                                                        const newLat = parseFloat(e.target.value);
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            address: {
                                                                ...prev.address,
                                                                coordinates: {
                                                                    ...prev.address?.coordinates,
                                                                    lat: isNaN(newLat) ? '' : newLat
                                                                }
                                                            }
                                                        }));
                                                    }}
                                                    className="w-full p-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-slate-700">Longitude</label>
                                                <input
                                                    type="number"
                                                    placeholder="e.g. 77.5946"
                                                    value={formData.address?.coordinates?.lng || ''}
                                                    onChange={(e) => {
                                                        const newLng = parseFloat(e.target.value);
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            address: {
                                                                ...prev.address,
                                                                coordinates: {
                                                                    ...prev.address?.coordinates,
                                                                    lng: isNaN(newLng) ? '' : newLng
                                                                }
                                                            }
                                                        }));
                                                    }}
                                                    className="w-full p-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-sm font-medium text-slate-700">Full Store Address</label>
                                        <input
                                            type="text"
                                            name="storeAddress"
                                            value={formData.storeAddress}
                                            onChange={handleChange}
                                            className="w-full p-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">GST Number</label>
                                        <input
                                            type="text"
                                            name="gstNumber"
                                            value={formData.gstNumber}
                                            onChange={handleChange}
                                            className="w-full p-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-400 focus:outline-none"
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
                                            <Bell className="text-emerald-600" />
                                            <div>
                                                <p className="font-medium text-slate-800">Push Notifications</p>
                                                <p className="text-sm text-slate-500">Receive alerts for new sales and orders</p>
                                            </div>
                                        </div>
                                        <input
                                            type="checkbox"
                                            name="notifications"
                                            checked={formData.notifications}
                                            onChange={handleChange}
                                            className="w-5 h-5 text-emerald-600 rounded bg-gray-100 border-gray-300 focus:ring-emerald-500"
                                        />
                                    </label>

                                    <label className="flex items-center justify-between p-4 border border-slate-100 rounded-lg hover:bg-slate-50 cursor-pointer">
                                        <div className="flex gap-3">
                                            <Store className="text-emerald-600" />
                                            <div>
                                                <p className="font-medium text-slate-800">Stock Alerts</p>
                                                <p className="text-sm text-slate-500">Get notified when products are running low</p>
                                            </div>
                                        </div>
                                        <input
                                            type="checkbox"
                                            name="stockAlerts"
                                            checked={formData.stockAlerts}
                                            onChange={handleChange}
                                            className="w-5 h-5 text-emerald-600 rounded bg-gray-100 border-gray-300 focus:ring-emerald-500"
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

            <LocationPickerModal
                isOpen={isMapOpen}
                onClose={() => setIsMapOpen(false)}
                onConfirm={(locData) => {
                    const { coordinates, address } = locData;
                    setFormData(prev => ({
                        ...prev,
                        address: {
                            ...prev.address,
                            formattedAddress: address.formattedAddress,
                            city: address.city,
                            state: address.state,
                            coordinates: coordinates
                        },
                        storeAddress: address.formattedAddress
                    }));
                }}
                initialLocation={formData.address?.coordinates}
            />
        </DashboardLayout>
    );
};

export default Settings;
