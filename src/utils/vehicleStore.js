// Utility to manage mock vehicle data with localStorage persistence

const STORAGE_KEY = 'daily_farm_vehicles_v4';

    const generateMockVehicles = (count) => {
    const types = ['Ashok Leyland 4220', 'Tata Ace EV', 'Eicher Pro 2049', 'Mahindra Bolero Pickup', 'BharatBenz 1923C', 'Open Truck', 'Refrigerated Truck', 'Container', 'Mini Van', 'Electric Van'];
    const statuses = ['AVAILABLE', 'ON ROUTE', 'MAINTENANCE'];
    const drivers = [
        { name: 'Naveen Reddy', avatar: 'N', color: 'bg-red-100 text-red-600' },
        { name: 'Adithya Goud', avatar: 'A', color: 'bg-indigo-100 text-indigo-600' },
        { name: 'Surya', avatar: 'S', color: 'bg-blue-100 text-blue-600' },
        { name: 'Manoj Kumar', avatar: 'M', color: 'bg-purple-100 text-purple-600' },
        { name: 'Raju M', avatar: 'R', color: 'bg-emerald-100 text-emerald-600' },
        { name: 'Suresh Raina', avatar: 'S', color: 'bg-orange-100 text-orange-600' },
        { name: 'Virat K', avatar: 'V', color: 'bg-pink-100 text-pink-600' },
        { name: 'Rohit S', avatar: 'R', color: 'bg-cyan-100 text-cyan-600' }
    ];

    const generatePlate = () => {
        const states = ['KA', 'TN', 'MH', 'DL', 'TS'];
        const rto = Math.floor(Math.random() * 99).toString().padStart(2, '0');
        const series = ['AB', 'XY', 'UV', 'KL', 'MN'][Math.floor(Math.random() * 5)];
        const num = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
        return `${states[Math.floor(Math.random() * states.length)]}-${rto}-${series}-${num}`;
    };

    return Array.from({ length: count }, (_, i) => {
        const type = types[Math.floor(Math.random() * types.length)];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const driver = drivers[Math.floor(Math.random() * drivers.length)];
        const isEV = type.includes('EV');

        return {
            id: generatePlate(), // Main large ID
            vhNumber: `VH-${9000 + i}`, // Small pill ID
            type,
            capacity: `${Math.floor(Math.random() * 20 + 2)} Ton`,
            mileage: `${Math.floor(Math.random() * 80000 + 1000).toLocaleString()} km`,
            driver: {
                ...driver,
                experience: `${Math.floor(Math.random() * 15 + 1)} yrs Exp`,
                phone: `98${Math.floor(Math.random() * 100000000)}`
            },
            status,
            assignment: status === 'ON ROUTE' ? `Route #${Math.floor(Math.random() * 1000)} - Delivering` : 
                       status === 'MAINTENANCE' ? 'Engine Tuning & Oil' : 'Available for assignment',
            isEV
        };
    });
};

const initialVehicles = generateMockVehicles(80);

export const vehicleStore = {
    getAll: () => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(initialVehicles));
            return initialVehicles;
        }
        return JSON.parse(stored);
    },

    add: (vehicle) => {
        const vehicles = vehicleStore.getAll();
        const newVehicle = {
            id: vehicle.plate, // Use plate as ID or maybe user wants Custom ID? strict match shows 'KA-05-UV-6666' as main ID. Let's assume Plate IS the main ID now to match image.
            type: vehicle.type,
            plate: vehicle.plate, // We'll use this for the VH- number or similar if user wants. But screenshot shows 'VH-011' as small tag. Let's Generate a Mock VH-ID for the small tag and use Plate as Main ID.
            vhNumber: `VH-${Math.floor(Math.random() * 9000 + 1000)}`, // Auto-generated internal ID
            capacity: `${vehicle.capacity} ${vehicle.capacityUnit || 'Tons'}`,
            mileage: '0 km',
            driver: {
                name: vehicle.driverName,
                experience: `${vehicle.driverExp || '0'} yrs Exp`,
                phone: vehicle.driverPhone,
                avatar: vehicle.driverName.charAt(0).toUpperCase(),
                color: 'bg-emerald-100 text-emerald-600'
            },
            status: 'AVAILABLE',
            assignment: 'Available for assignment',
            isEV: vehicle.type.toLowerCase().includes('ev')
        };
        
        const updated = [newVehicle, ...vehicles];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
    },

    // Reset to default for testing
    reset: () => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialVehicles));
        return initialVehicles;
    }
};
