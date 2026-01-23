import React, { useState, useEffect } from 'react';
import { MapPin, Sprout, Wind, Droplets, ExternalLink, Edit } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/ui/Button';
import { api } from '../../utils/api';
import { useNavigate } from 'react-router-dom';

const MyFarm = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [weather, setWeather] = useState(null);

    useEffect(() => {
        const fetchFarmDetails = async () => {
            try {
                const res = await api.auth.getMe();
                if (res.success) {
                    setProfile(res.data.profile);

                    // Fetch weather if coordinates exist
                    if (res.data.profile?.address?.coordinates?.lat) {
                        fetchWeather(res.data.profile.address.coordinates.lat, res.data.profile.address.coordinates.lng);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch farm details', error);
            } finally {
                setLoading(false);
            }
        };
        fetchFarmDetails();
    }, []);

    const fetchWeather = async (lat, lng) => {
        try {
            // Using a default key for demo if variable is missing (NOT RECOMMENDED FOR PRODUCTION, BUT HELPS LOCAL DEV)
            const API_KEY = import.meta.env.VITE_WEATHER_API_KEY || '64a9388835f14feaa16164601242301';
            const res = await fetch(`https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${lat},${lng}`);

            if (!res.ok) {
                console.error('Weather API Error:', res.statusText);
                setWeather({ error: true });
                return;
            }

            const data = await res.json();
            setWeather(data);
        } catch (error) {
            console.error('Failed to fetch weather', error);
            setWeather({ error: true });
        }
    };

    // Generate Google Maps URL for "View on Map"
    const getMapUrl = () => {
        if (!profile?.address) return '#';
        const { coordinates, placeId, formattedAddress } = profile.address;

        if (placeId) {
            return `https://www.google.com/maps/search/?api=1&query=Google&query_place_id=${placeId}`;
        }
        if (coordinates?.lat && coordinates?.lng) {
            return `https://www.google.com/maps/search/?api=1&query=${coordinates.lat},${coordinates.lng}`;
        }
        return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(formattedAddress || 'Farm Location')}`;
    };

    if (loading) {
        return (
            <DashboardLayout role="farmer">
                <div className="flex h-96 items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage-500"></div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout role="farmer">
            <div className="space-y-6 animate-in pb-20 md:pb-0">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-display font-bold text-slate-800">My Farm</h1>
                        <p className="text-slate-500">Overview of your farm location and details</p>
                    </div>
                    <Button
                        variant="outline"
                        icon={Edit}
                        onClick={() => navigate('/farmer/settings')}
                        className="w-full md:w-auto justify-center"
                    >
                        Edit Details
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Farm Card */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Map / Location Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="h-48 bg-emerald-50 relative flex items-center justify-center">
                                {/* This would ideally be a Google Maps Iframe or Static Map Image */}
                                <div className="text-center p-6">
                                    <MapPin size={48} className="mx-auto text-emerald-600 mb-2" />
                                    <h3 className="text-lg font-semibold text-emerald-900">Farm Location</h3>
                                    <p className="text-emerald-700 text-sm max-w-md mx-auto">
                                        {profile?.address?.formattedAddress || 'Location not configured'}
                                    </p>
                                </div>
                                <div className="absolute bottom-4 right-4">
                                    <Button
                                        icon={ExternalLink}
                                        size="sm"
                                        onClick={() => window.open(getMapUrl(), '_blank')}
                                        disabled={!profile?.address}
                                    >
                                        View on Google Maps
                                    </Button>
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-lg font-semibold text-slate-800 mb-4">Location Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-4 bg-slate-50 rounded-lg">
                                        <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">State</div>
                                        <div className="font-medium text-slate-800">{profile?.state || 'N/A'}</div>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-lg">
                                        <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">District</div>
                                        <div className="font-medium text-slate-800">{profile?.district || 'N/A'}</div>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-lg">
                                        <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Village</div>
                                        <div className="font-medium text-slate-800">{profile?.village || 'N/A'}</div>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-lg">
                                        <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Coordinates</div>
                                        <div className="font-medium text-slate-800">
                                            {profile?.address?.coordinates?.lat
                                                ? `${profile.address.coordinates.lat.toFixed(4)}, ${profile.address.coordinates.lng.toFixed(4)}`
                                                : 'Not set'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats / Info Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                            <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                                <Sprout className="text-sage-500" /> Farm Statistics
                            </h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center py-2 border-b border-slate-50">
                                    <span className="text-slate-500">Total Land Size</span>
                                    <span className="font-medium text-slate-800">{profile?.landSize || 0} Acres</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-slate-50">
                                    <span className="text-slate-500">Land Type</span>
                                    <span className="font-medium text-slate-800 capitalize">{profile?.landType || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-slate-50">
                                    <span className="text-slate-500">Primary Crop</span>
                                    <span className="font-medium text-slate-800">{profile?.primaryCrop || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-slate-500">Organic Certified</span>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${profile?.organicCertified
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-slate-100 text-slate-500'
                                        }`}>
                                        {profile?.organicCertified ? 'Yes' : 'No'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Environmental - Real Data */}
                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl shadow-md text-white">
                            <h3 className="font-semibold mb-4 flex items-center gap-2">
                                <Wind className="text-blue-100" /> Current Weather
                            </h3>
                            {weather && weather.current ? (
                                <>
                                    <div className="flex items-end gap-4">
                                        <div className="text-4xl font-bold">{Math.round(weather.current.temp_c)}°C</div>
                                        <div className="text-blue-100 mb-1 capitalize">{weather.current.condition?.text}</div>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-blue-400/30 flex justify-between text-sm text-blue-50">
                                        <div className="flex items-center gap-1">
                                            <Droplets size={14} /> Humidity: {weather.current.humidity}%
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Wind size={14} /> Wind: {Math.round(weather.current.wind_kph)}km/h
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="text-blue-100 text-sm py-4 text-center">
                                    {weather?.error ? (
                                        <span className="text-yellow-200">Weather unavailable (Check API Key)</span>
                                    ) : (
                                        profile?.address?.coordinates?.lat ? 'Loading weather...' : 'Location not set'
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default MyFarm;
