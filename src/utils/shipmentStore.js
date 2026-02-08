// Utility to manage mock shipment data with localStorage persistence

const STORAGE_KEY = 'daily_farm_shipments_v1';

const initialShipments = [
    // 1. Personal Shipment (Pending)
    {
        id: 'TRK-6168',
        type: 'Personal Shipment',
        origin: '501301',
        destination: 'Ghatkesar, Padmavathi Hostel, DCB Bank',
        cargo: 'Tomatoes',
        capacity: '5 Tons',
        vehicle: 'MH-15-EF-9101',
        eta: 'Pending',
        status: 'Pending',
        date: '2025-01-28',
        coordinates: { lat: 17.3850, lng: 78.4867 } // Hyderabadish
    },
    // 2. Farmer Request (Pending Assignment)
    {
        id: 'REQ-11562',
        type: 'Farmer Request',
        origin: 'Satara',
        destination: 'Pune',
        cargo: 'Strawberries',
        capacity: '3 Tons',
        vehicle: 'Pending Assignment',
        eta: 'Pending',
        status: 'Pending',
        date: '2025-01-29',
        coordinates: { lat: 17.6805, lng: 74.0183 }
    },
    // 3. Wheat to Delhi (On Route - Accepted)
    {
        id: 'TRK-2401',
        type: 'Farmer Request',
        origin: 'Mumbai',
        destination: 'Delhi',
        cargo: 'Wheat',
        capacity: '15 Tons',
        vehicle: 'MH-01-AB-1234',
        eta: '2 hours',
        status: 'On Route',
        date: '2025-01-27',
        coordinates: { lat: 19.0760, lng: 72.8777 }
    },
    // 4. Rice to Bangalore (On Route - Accepted)
    {
        id: 'TRK-2402',
        type: 'Farmer Request',
        origin: 'Pune',
        destination: 'Bangalore',
        cargo: 'Rice',
        capacity: '20 Tons',
        vehicle: 'MH-12-CD-5678',
        eta: '5 hours',
        status: 'On Route',
        date: '2025-01-27',
        coordinates: { lat: 18.5204, lng: 73.8567 }
    },
    // 5. Tomatoes to Hyd (Rejected Example)
    {
        id: 'TRK-2403',
        type: 'Farmer Request',
        origin: 'Nashik',
        destination: 'Hyderabad',
        cargo: 'Tomatoes',
        capacity: '8 Tons',
        vehicle: 'N/A',
        eta: 'N/A',
        status: 'Rejected',
        date: '2025-01-26',
        coordinates: { lat: 19.9975, lng: 73.7898 }
    },
    // 6. Corporate Order (Delivered)
    {
        id: 'CORP-9901',
        type: 'Corporate Order',
        origin: 'Nagpur',
        destination: 'Mumbai Port',
        cargo: 'Oranges',
        capacity: '12 Tons',
        vehicle: 'MH-40-BL-7777',
        eta: 'Delivered',
        status: 'Delivered',
        date: '2025-01-25',
        coordinates: { lat: 21.1458, lng: 79.0882 }
    },
    // 7. Emergency Supply (Accepted Example)
    {
        id: 'EMG-3005',
        type: 'Emergency Supply',
        origin: 'Hyderabad',
        destination: 'Vijayawada',
        cargo: 'Medical Kits',
        capacity: '2 Tons',
        vehicle: 'TS-09-EM-1080',
        eta: '45 mins',
        status: 'Accepted',
        date: '2025-01-28',
        coordinates: { lat: 17.3850, lng: 78.4867 }
    },
    // 8. Farmer Request (Pending)
    {
        id: 'REQ-11588',
        type: 'Farmer Request',
        origin: 'Karnal',
        destination: 'Delhi',
        cargo: 'Basmati Rice',
        capacity: '25 Tons',
        vehicle: 'Pending Assignment',
        eta: 'Pending',
        status: 'Pending',
        date: '2025-01-30',
        coordinates: { lat: 29.6857, lng: 76.9905 }
    },
    // 9. Personal Shipment (Delivered)
    {
        id: 'TRK-6190',
        type: 'Personal Shipment',
        origin: 'Bangalore',
        destination: 'Mysore',
        cargo: 'Furniture',
        capacity: '1.5 Tons',
        vehicle: 'KA-05-MV-4040',
        eta: 'Delivered',
        status: 'Delivered',
        date: '2025-01-24',
        coordinates: { lat: 12.9716, lng: 77.5946 }
    },
    // 10. Farmer Request (On Route)
    {
        id: 'TRK-2550',
        type: 'Farmer Request',
        origin: 'Surat',
        destination: 'Ahmedabad',
        cargo: 'Cotton Bales',
        capacity: '10 Tons',
        vehicle: 'GJ-06-XX-5500',
        eta: '1 hour',
        status: 'On Route',
        date: '2025-01-28',
        coordinates: { lat: 21.1702, lng: 72.8311 }
    },
    // 11. Corporate Order (Pending)
    {
        id: 'CORP-9922',
        type: 'Corporate Order',
        origin: 'Indore',
        destination: 'Bhopal',
        cargo: 'Soybeans',
        capacity: '18 Tons',
        vehicle: 'MP-09-ZZ-8888',
        eta: 'Pending',
        status: 'Pending',
        date: '2025-02-01',
        coordinates: { lat: 22.7196, lng: 75.8577 }
    },
    // 12. Delivered Shipment
    {
        id: 'TRK-6001',
        type: 'Farmer Request',
        origin: 'Warangal',
        destination: 'Hyderabad',
        cargo: 'Chillis',
        capacity: '4 Tons',
        vehicle: 'TS-03-RD-1122',
        eta: 'Delivered',
        status: 'Delivered',
        date: '2025-01-20',
        coordinates: { lat: 17.9689, lng: 79.5941 }
    },
    // 13. Pending Request
    {
        id: 'REQ-11600',
        type: 'Farmer Request',
        origin: 'Guntur',
        destination: 'Chennai',
        cargo: 'Tobacco',
        capacity: '7 Tons',
        vehicle: 'Pending Assignment',
        eta: 'Pending',
        status: 'Pending',
        date: '2025-01-31',
        coordinates: { lat: 16.3067, lng: 80.4365 }
    }
];

export const shipmentStore = {
    getAll: () => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(initialShipments));
            return initialShipments;
        }
        return JSON.parse(stored);
    },

    add: (shipment) => {
        const shipments = shipmentStore.getAll();
        const newShipment = { ...shipment };

        // Ensure status consistency
        if (!newShipment.status) newShipment.status = 'Pending';
        if (!newShipment.eta) newShipment.eta = 'Pending';

        const updated = [newShipment, ...shipments];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
    },

    update: (id, updates) => {
        const shipments = shipmentStore.getAll();
        const updated = shipments.map(s => s.id === id ? { ...s, ...updates } : s);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
    },

    reset: () => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialShipments));
        return initialShipments;
    }
};
