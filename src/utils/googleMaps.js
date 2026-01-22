/**
 * Google Maps Utility Functions
 */

// Load Google Maps API Script dynamically
export const loadGoogleMapsScript = (apiKey) => {
    return new Promise((resolve, reject) => {
        if (window.google && window.google.maps) {
            resolve(window.google.maps);
            return;
        }

        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
        script.async = true;
        script.defer = true;

        script.onload = () => {
            if (window.google && window.google.maps) {
                resolve(window.google.maps);
            } else {
                reject(new Error('Google Maps SDK loaded but window.google.maps not found'));
            }
        };

        script.onerror = (err) => {
            reject(err);
        };

        document.head.appendChild(script);
    });
};

// Generate Deep Link for Navigation
export const getNavigationUrl = (destination, origin = null) => {
    const baseUrl = 'https://www.google.com/maps/dir/?api=1';

    // Check if we have valid destination
    if (!destination) return '#';

    // Prefer coordinates if available, otherwise use formatted address
    const destParam = destination.coordinates && destination.coordinates.lat && destination.coordinates.lng
        ? `${destination.coordinates.lat},${destination.coordinates.lng}`
        : encodeURIComponent(destination.formattedAddress || destination.city || '');

    let params = `&destination=${destParam}`;

    // Add origin if provided
    if (origin) {
        const originParam = origin.coordinates && origin.coordinates.lat && origin.coordinates.lng
            ? `${origin.coordinates.lat},${origin.coordinates.lng}`
            : encodeURIComponent(origin.formattedAddress || origin.city || '');

        params += `&origin=${originParam}`;
    }

    return `${baseUrl}${params}`;
};

// Parse Google Place object to our schema
export const formatAddressComponents = (place) => {
    const componentForm = {
        street_number: 'short_name',
        route: 'long_name',
        locality: 'long_name',
        administrative_area_level_1: 'long_name',
        country: 'long_name',
        postal_code: 'short_name'
    };

    const address = {
        formattedAddress: place.formatted_address,
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        coordinates: {
            lat: place.geometry?.location?.lat() || 0,
            lng: place.geometry?.location?.lng() || 0
        },
        placeId: place.place_id
    };

    // Get each component of the address from the place details
    // and fill the corresponding field on the form.
    if (place.address_components) {
        for (const component of place.address_components) {
            const addressType = component.types[0];
            if (componentForm[addressType]) {
                const val = component[componentForm[addressType]];

                if (addressType === 'street_number') {
                    address.street = val + ' ';
                } else if (addressType === 'route') {
                    address.street += val;
                } else if (addressType === 'locality') {
                    address.city = val;
                } else if (addressType === 'administrative_area_level_1') {
                    address.state = val;
                } else if (addressType === 'country') {
                    address.country = val;
                } else if (addressType === 'postal_code') {
                    address.zipCode = val;
                }
            }
        }
    }

    return address;
};
