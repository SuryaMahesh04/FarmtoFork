// Utility to manage mock notifications with localStorage persistence

const STORAGE_KEY = 'daily_farm_notifications_v2';

const initialNotifications = [
    {
        id: 'NOTIF-001',
        type: 'request',
        title: 'New Transport Request',
        timestamp: '1 hour ago',
        farmer: 'Green Earth Organics',
        price: '₹18,000',
        origin: 'Pune, MH',
        destination: 'Nagpur, MH',
        cargo: 'Onions (8 Ton)',
        status: 'pending' // pending, accepted, declined
    },
    {
        id: 'NOTIF-002',
        type: 'request',
        title: 'New Transport Request',
        timestamp: '3 hours ago',
        farmer: 'Fresh Veggies Co-op',
        price: '₹22,000',
        origin: 'Solapur, MH',
        destination: 'Hyderabad, TS',
        cargo: 'Mixed Vegetables (12 Ton)',
        status: 'pending'
    },
    {
        id: 'NOTIF-003',
        type: 'request',
        title: 'New Transport Request',
        timestamp: '5 hours ago',
        farmer: 'Organic Fields Ltd',
        price: '₹15,500',
        origin: 'Nashik, MH',
        destination: 'Mumbai, MH',
        cargo: 'Grapes (5 Ton)',
        status: 'pending'
    },
    // Accepted History Mock
    {
        id: 'NOTIF-004',
        type: 'request',
        title: 'Transport Request Accepted',
        timestamp: '1 day ago',
        farmer: 'Sunrise Farms',
        price: '₹12,000',
        origin: 'Satara, MH',
        destination: 'Pune, MH',
        cargo: 'Strawberries (2 Ton)',
        status: 'accepted'
    },
    // Declined History Mock
    {
        id: 'NOTIF-005',
        type: 'request',
        title: 'Transport Request Declined',
        timestamp: '2 days ago',
        farmer: 'AgriCorp India',
        price: '₹45,000',
        origin: 'Nagpur, MH',
        destination: 'Delhi, DEL',
        cargo: 'Oranges (20 Ton)',
        status: 'declined'
    },
    // New Mock Data for Testing
    {
        id: 'NOTIF-006',
        type: 'request',
        title: 'New Transport Request',
        timestamp: '10 mins ago',
        farmer: 'Golden Harvests',
        price: '₹28,000',
        origin: 'Indore, MP',
        destination: 'Bhopal, MP',
        cargo: 'Soybeans (15 Ton)',
        status: 'pending'
    },
    {
        id: 'NOTIF-007',
        type: 'request',
        title: 'New Transport Request',
        timestamp: '30 mins ago',
        farmer: 'Pure Earth Farms',
        price: '₹35,000',
        origin: 'Surat, GJ',
        destination: 'Ahmedabad, GJ',
        cargo: 'Cotton (10 Ton)',
        status: 'pending'
    },
    {
        id: 'NOTIF-008',
        type: 'request',
        title: 'Transport Request Accepted',
        timestamp: '3 days ago',
        farmer: 'Kisan Networks',
        price: '₹50,000',
        origin: 'Amravati, MH',
        destination: 'Bangalore, KA',
        cargo: 'Cotton Bales (25 Ton)',
        status: 'accepted'
    },
    {
        id: 'NOTIF-009',
        type: 'request',
        title: 'Transport Request Declined',
        timestamp: '4 days ago',
        farmer: 'Fresh Greens',
        price: '₹8,000',
        origin: 'Local Mandi',
        destination: 'City Market',
        cargo: 'Spinach (1 Ton)',
        status: 'declined'
    },
    {
        id: 'NOTIF-010',
        type: 'request',
        title: 'New Transport Request',
        timestamp: '2 hours ago',
        farmer: 'Sahyadri Farmers',
        price: '₹95,000',
        origin: 'Ratnagiri, MH',
        destination: 'Delhi, DEL',
        cargo: 'Alphonso Mangoes (10 Ton)',
        status: 'pending'
    }
];

export const notificationStore = {
    getAll: () => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(initialNotifications));
            return initialNotifications;
        }
        return JSON.parse(stored);
    },

    updateStatus: (id, newStatus) => {
        const notifications = notificationStore.getAll();
        const updated = notifications.map(n => 
            n.id === id ? { ...n, status: newStatus } : n
        );
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
    },

    add: (notification) => {
        const notifications = notificationStore.getAll();
        const updated = [notification, ...notifications];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
    },
    
    reset: () => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialNotifications));
        return initialNotifications;
    }
};
