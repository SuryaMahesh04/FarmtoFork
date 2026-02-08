// Utility to manage mock driver data with localStorage persistence

const STORAGE_KEY = 'daily_farm_drivers_v1';

const initialDrivers = [
    {
        id: 'DRV-101',
        fullName: 'Ramesh Kumar',
        phone: '+91 98765 43210',
        licenseNumber: 'TS-09-2020-001234',
        status: 'Active',
        assignedVehicleId: 'MH-15-EF-9101',
        experience: '5 Years',
        location: 'Hyderabad'
    },
    {
        id: 'DRV-102',
        fullName: 'Suresh Reddy',
        phone: '+91 91234 56789',
        licenseNumber: 'AP-12-2018-005678',
        status: 'Active',
        assignedVehicleId: 'MH-01-AB-1234',
        experience: '3 Years',
        location: 'Vijayawada'
    },
    {
        id: 'DRV-103',
        fullName: 'Mahesh Babu',
        phone: '+91 76543 21098',
        licenseNumber: 'KA-01-2019-009876',
        status: 'On Leave',
        assignedVehicleId: null,
        experience: '7 Years',
        location: 'Bangalore'
    },
    {
        id: 'DRV-104',
        fullName: 'Venkatesh',
        phone: '+91 88888 77777',
        licenseNumber: 'TN-01-2021-001122',
        status: 'Active',
        assignedVehicleId: 'MH-12-CD-5678',
        experience: '2 Years',
        location: 'Chennai'
    }
];

export const driverStore = {
    getAll: () => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(initialDrivers));
            return initialDrivers;
        }
        return JSON.parse(stored);
    },

    add: (driver) => {
        const drivers = driverStore.getAll();
        const newDriver = {
            id: driver.id || `DRV-${Math.floor(Math.random() * 10000)}`,
            status: 'Active',
            ...driver
        };
        const updated = [newDriver, ...drivers];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
    },

    update: (id, updates) => {
        const drivers = driverStore.getAll();
        const updated = drivers.map(d => d.id === id ? { ...d, ...updates } : d);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
    },

    delete: (id) => {
        const drivers = driverStore.getAll();
        const updated = drivers.filter(d => d.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
    },

    // Assign a vehicle to a driver
    assignVehicle: (driverId, vehicleId) => {
        const drivers = driverStore.getAll();
        const updated = drivers.map(d =>
            d.id === driverId ? { ...d, assignedVehicleId: vehicleId } : d
        );
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
    },

    // Get a specific driver by ID
    getById: (id) => {
        const drivers = driverStore.getAll();
        return drivers.find(d => d.id === id);
    },

    reset: () => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialDrivers));
        return initialDrivers;
    }
};
