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
        date: '2025-01-28'
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
        date: '2025-01-29'
    },
    // 3. Wheat to Delhi (On Route)
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
        date: '2025-01-27'
    },
    // 4. Rice to Bangalore (On Route)
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
        date: '2025-01-27'
    },
    // 5. Tomatoes to Hyd (On Route)
    {
        id: 'TRK-2403',
        type: 'Farmer Request',
        origin: 'Nashik',
        destination: 'Hyderabad',
        cargo: 'Tomatoes',
        capacity: '8 Tons',
        vehicle: 'MH-15-EF-9101',
        eta: '3 hours',
        status: 'On Route',
        date: '2025-01-26'
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
        date: '2025-01-25'
    },
    // 7. Emergency Supply (On Route)
    {
        id: 'EMG-3005',
        type: 'Emergency Supply',
        origin: 'Hyderabad',
        destination: 'Vijayawada',
        cargo: 'Medical Kits',
        capacity: '2 Tons',
        vehicle: 'TS-09-EM-1080',
        eta: '45 mins',
        status: 'On Route',
        date: '2025-01-28'
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
        date: '2025-01-30'
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
        date: '2025-01-24'
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
        date: '2025-01-28'
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
        date: '2025-02-01'
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
        date: '2025-01-20'
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
        date: '2025-01-31'
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

    reset: () => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialShipments));
        return initialShipments;
    }
};
