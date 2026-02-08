import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapPin } from 'lucide-react';

// Fix Leaflet's default icon path issues
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom component to adjust map bounds
const MapAdjuster = ({ bounds }) => {
    const map = useMap();
    useEffect(() => {
        if (bounds && bounds.length > 0) {
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [bounds, map]);
    return null;
};

const LeafletMap = ({ origin, destination, originLabel, destinationLabel, onDistanceCalculated, className }) => {
    const [coords, setCoords] = useState({ origin: null, destination: null });
    const [isValid, setIsValid] = useState(false);
    const [calculatedDistance, setCalculatedDistance] = useState(null);

    // Geocode helper
    const geocode = async (query) => {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
            const data = await response.json();
            if (data && data.length > 0) {
                return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
            }
        } catch (error) {
            console.error('Geocoding error:', error);
        }
        return null; // Return null if not found
    };

    useEffect(() => {
        const resolveCoordinates = async () => {
            let originCoords = origin;
            let destCoords = destination;

            // Resolve Origin
            if (!originCoords && originLabel) {
                originCoords = await geocode(originLabel);
            }

            // Resolve Destination
            if (!destCoords && destinationLabel) {
                destCoords = await geocode(destinationLabel);
            }

            setCoords({ origin: originCoords, destination: destCoords });

            if (originCoords && destCoords) {
                setIsValid(true);
                const dist = calculateDistance(originCoords.lat, originCoords.lng, destCoords.lat, destCoords.lng);
                setCalculatedDistance(dist);
                if (onDistanceCalculated) onDistanceCalculated(dist);
            } else if (originCoords) {
                // Single point logic if needed
                setIsValid(true);
            }
        };

        resolveCoordinates();
    }, [origin, destination, originLabel, destinationLabel]); // Dependencies

    // Haversine formula for distance
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Radius of the earth in km
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c; // Distance in km
        return d.toFixed(1);
    };

    const deg2rad = (deg) => {
        return deg * (Math.PI / 180);
    };

    if (!isValid && !coords.origin) {
        // Show loading or default view
        return (
            <div className={`bg-slate-100 flex items-center justify-center text-slate-400 text-xs ${className}`}>
                <MapPin className="mr-1" size={16} /> Map loading...
            </div>
        );
    }

    // Determine center
    const defaultCenter = [20.5937, 78.9629]; // India center
    const center = coords.origin ? [coords.origin.lat, coords.origin.lng] : defaultCenter;

    // Create markers array
    const markers = [];
    if (coords.origin) markers.push({ position: [coords.origin.lat, coords.origin.lng], label: originLabel || 'Origin' });
    if (coords.destination) markers.push({ position: [coords.destination.lat, coords.destination.lng], label: destinationLabel || 'Destination' });

    const bounds = markers.map(m => m.position);

    return (
        <div className={`relative z-0 ${className}`}>
            <MapContainer center={center} zoom={5} style={{ height: '100%', width: '100%' }} scrollWheelZoom={false}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {markers.map((marker, index) => (
                    <Marker key={index} position={marker.position}>
                        <Popup>{marker.label}</Popup>
                    </Marker>
                ))}

                {coords.origin && coords.destination && (
                    <Polyline
                        positions={[
                            [coords.origin.lat, coords.origin.lng],
                            [coords.destination.lat, coords.destination.lng]
                        ]}
                        color="blue"
                    />
                )}

                <MapAdjuster bounds={bounds} />
            </MapContainer>

            {calculatedDistance && (
                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg shadow-md border border-slate-200 z-[1000] text-xs font-bold text-slate-700">
                    Distance: {calculatedDistance} km
                </div>
            )}
        </div>
    );
};

export default LeafletMap;
