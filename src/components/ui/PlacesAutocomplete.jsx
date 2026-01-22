import React, { useEffect, useRef, useState } from 'react';
import { loadGoogleMapsScript, formatAddressComponents } from '../../utils/googleMaps';
import { MapPin } from 'lucide-react';

const PlacesAutocomplete = ({ value, onChange, placeholder = "Enter location" }) => {
    const inputRef = useRef(null);
    const autocompleteRef = useRef(null);
    const [scriptLoaded, setScriptLoaded] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Get API key from env
        const apiKey = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;

        if (!apiKey) {
            console.warn('VITE_GOOGLE_PLACES_API_KEY is not defined');
            // Allow manual entry if API key is missing
            return;
        }

        loadGoogleMapsScript(apiKey)
            .then((maps) => {
                setScriptLoaded(true);
                initAutocomplete(maps);
            })
            .catch((err) => {
                console.error('Failed to load Google Maps:', err);
                setError('Maps failed to load');
            });

        return () => {
            // Cleanup placeholder if needed
        };
    }, []);

    const initAutocomplete = (maps) => {
        if (!inputRef.current) return;

        autocompleteRef.current = new maps.places.Autocomplete(inputRef.current, {
            types: ['geocode', 'establishment'],
            fields: ['formatted_address', 'geometry', 'address_components', 'place_id']
        });

        autocompleteRef.current.addListener('place_changed', () => {
            const place = autocompleteRef.current.getPlace();

            if (!place.geometry || !place.geometry.location) {
                // User entered name of a place that was not suggested
                // Just pass the text value
                return;
            }

            const structuredAddress = formatAddressComponents(place);
            onChange(structuredAddress);
        });
    };

    // Handle manual text changes
    const handleInputChange = (e) => {
        // If we are just typing, we only update the formatted string part loosely
        // Real update happens on selection or we can treat it as manual input
        const newVal = {
            ...value,
            formattedAddress: e.target.value
        };
        // We generally want to bubble up the change so the parent controls the state
        // But for complex object `onChange` usually expects the full object.
        // For manual typing we might lose coord data if we aren't careful, 
        // but here we just pass what we have plus the new text
        onChange(newVal);
    };

    return (
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-slate-400" />
            </div>
            <input
                ref={inputRef}
                type="text"
                className="pl-10 w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500 transition-colors"
                placeholder={placeholder}
                value={value?.formattedAddress || ''}
                onChange={handleInputChange}
                disabled={!scriptLoaded && import.meta.env.VITE_GOOGLE_PLACES_API_KEY}
            />
            {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
            {!import.meta.env.VITE_GOOGLE_PLACES_API_KEY && (
                <span className="text-xs text-slate-400 mt-1 block">Google Maps API Key not configured. Manual entry enabled.</span>
            )}
        </div>
    );
};

export default PlacesAutocomplete;
