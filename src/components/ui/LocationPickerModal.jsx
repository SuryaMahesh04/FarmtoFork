import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { X, MapPin, Navigation, Search, Check } from 'lucide-react';
import Button from './Button';

// Fix Leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const LocationPickerModal = ({ isOpen, onClose, onConfirm, initialLocation = null }) => {
    const [position, setPosition] = useState(initialLocation || { lat: 20.5937, lng: 78.9629 }); // Default to India center
    const [addressInfo, setAddressInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Update position if initialLocation changes
    useEffect(() => {
        if (initialLocation && initialLocation.lat && initialLocation.lng) {
            setPosition(initialLocation);
            reverseGeocode(initialLocation.lat, initialLocation.lng);
        }
    }, [initialLocation]);

    const reverseGeocode = async (lat, lng) => {
        setLoading(true);
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
            const data = await response.json();
            if (data && data.address) {
                setAddressInfo({
                    formattedAddress: data.display_name,
                    city: data.address.city || data.address.town || data.address.village || '',
                    district: data.address.county || data.address.state_district || data.address.district || '',
                    state: data.address.state || '',
                    pincode: data.address.postcode || '',
                    country: data.address.country || '',
                    suburb: data.address.suburb || data.address.neighbourhood || ''
                });
            }
        } catch (error) {
            console.error('Error reverse geocoding:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        if (!searchQuery) return;
        setLoading(true);
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`);
            const data = await response.json();
            if (data && data.length > 0) {
                const newPos = { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
                setPosition(newPos);
                reverseGeocode(newPos.lat, newPos.lng);
            }
        } catch (error) {
            console.error('Error searching location:', error);
        } finally {
            setLoading(false);
        }
    };

    // Component to handle map clicks
    const LocationMarkers = () => {
        useMapEvents({
            click(e) {
                const newPos = { lat: e.latlng.lat, lng: e.latlng.lng };
                setPosition(newPos);
                reverseGeocode(newPos.lat, newPos.lng);
            },
        });

        return position ? <Marker position={[position.lat, position.lng]} /> : null;
    };

    // Component to recenter map when position changes
    const RecenterMap = ({ pos }) => {
        const map = useMap();
        
        useEffect(() => {
            if (pos && pos.lat && pos.lng) {
                map.setView([pos.lat, pos.lng], map.getZoom());
                // Force leaflet to recalculate dimensions (fixes blank/gray maps in modals)
                setTimeout(() => {
                    map.invalidateSize();
                }, 100);
            }
        }, [pos, map]);
        
        return null;
    };

    const handleConfirm = () => {
        onConfirm({
            coordinates: position,
            address: addressInfo
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
            
            <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] z-10">
                {/* Header */}
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-20">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <MapPin className="text-emerald-500" size={20} />
                            Select Location
                        </h2>
                        <p className="text-xs text-slate-500">Click on the map to pinpoint your location precisely</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <X size={20} className="text-slate-400" />
                    </button>
                </div>

                {/* Search Bar Overlay */}
                <div className="absolute top-[80px] left-1/2 -translate-x-1/2 z-[1001] w-[90%] md:w-2/3">
                    <div className="flex bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
                        <input
                            type="text"
                            placeholder="Search for a place, city or area..."
                            className="flex-1 px-4 py-3 text-sm focus:outline-none"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        />
                        <button 
                            onClick={handleSearch}
                            type="button"
                            className="px-4 bg-emerald-500 text-white hover:bg-emerald-600 transition-colors flex items-center gap-2"
                        >
                            <Search size={18} />
                            <span className="hidden md:inline">Search</span>
                        </button>
                    </div>
                </div>

                {/* Map Area */}
                <div className="flex-1 relative min-h-[450px] bg-slate-50">
                    <MapContainer
                        center={[position.lat, position.lng]}
                        zoom={13}
                        style={{ height: '450px', width: '100%', zIndex: 1 }}
                        className="w-full h-full"
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                        />
                        <LocationMarkers />
                        <RecenterMap pos={position} />
                    </MapContainer>

                    {/* GPS Button */}
                    <button 
                        onClick={() => {
                            if (navigator.geolocation) {
                                navigator.geolocation.getCurrentPosition((pos) => {
                                    const newPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
                                    setPosition(newPos);
                                    reverseGeocode(newPos.lat, newPos.lng);
                                });
                            }
                        }}
                        className="absolute bottom-6 right-6 z-[1000] bg-white p-3 rounded-full shadow-lg border border-slate-200 hover:bg-slate-50 text-slate-700 transition-all active:scale-90"
                        title="Use My Current Location"
                    >
                        <Navigation size={22} />
                    </button>
                </div>

                {/* Footer Info */}
                <div className="p-4 bg-slate-50 border-t border-slate-200 sticky bottom-0 z-20">
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        <div className="flex-1 space-y-1 w-full text-center md:text-left">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Pinpointed Address</h4>
                            <p className="text-sm font-medium text-slate-700 truncate max-w-md mx-auto md:mx-0">
                                {loading ? 'Fetching address...' : (addressInfo?.formattedAddress || 'No location selected')}
                            </p>
                            <div className="flex gap-2 justify-center md:justify-start">
                                <span className="text-[10px] bg-slate-200 px-1.5 py-0.5 rounded text-slate-600">Lat: {position.lat.toFixed(4)}</span>
                                <span className="text-[10px] bg-slate-200 px-1.5 py-0.5 rounded text-slate-600">Lng: {position.lng.toFixed(4)}</span>
                            </div>
                        </div>
                        <Button 
                            icon={Check} 
                            onClick={handleConfirm}
                            disabled={loading || !addressInfo}
                            className="w-full md:w-auto min-w-[150px] shadow-lg shadow-emerald-500/20"
                        >
                            Confirm Location
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LocationPickerModal;
