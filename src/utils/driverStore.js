// Driver Store for managing driver data
export const driverStore = {
    getAll: () => {
        const drivers = localStorage.getItem('drivers');
        return drivers ? JSON.parse(drivers) : [];
    },

    add: (driver) => {
        const drivers = driverStore.getAll();
        const newDriver = {
            ...driver,
            id: driver.id || \`DRV\${Math.floor(Math.random() * 10000)}\`,
            createdAt: new Date().toISOString(),
            status: 'Active'
        };
        drivers.unshift(newDriver);
        localStorage.setItem('drivers', JSON.stringify(drivers));
        return newDriver;
    },

    update: (id, updatedData) => {
        const drivers = driverStore.getAll();
        const index = drivers.findIndex(d => d.id === id);
        if (index !== -1) {
            drivers[index] = { ...drivers[index], ...updatedData };
            localStorage.setItem('drivers', JSON.stringify(drivers));
            return drivers[index];
        }
        return null;
    },

    delete: (id) => {
        const drivers = driverStore.getAll();
        const filteredDrivers = drivers.filter(d => d.id !== id);
        localStorage.setItem('drivers', JSON.stringify(filteredDrivers));
    },

    assignVehicle: (driverId, vehicleId) => {
        const drivers = driverStore.getAll();
        const driverIndex = drivers.findIndex(d => d.id === driverId);
        
        if (driverIndex !== -1) {
            drivers[driverIndex].assignedVehicleId = vehicleId;
            localStorage.setItem('drivers', JSON.stringify(drivers));
            return drivers[driverIndex];
        }
        return null;
    }
};
