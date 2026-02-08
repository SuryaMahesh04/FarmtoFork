// Utility to manage user notifications with localStorage persistence

const NOTIFICATION_KEY = 'daily_farm_notifications_v1';

const initialNotifications = [
    {
        id: 'NOT-1001',
        userId: 'DRV-101', // Example for Ramesh
        title: 'Welcome to DailyFarm',
        message: 'Your account has been successfully created.',
        type: 'info', // info, success, warning, error
        read: false,
        timestamp: new Date().toISOString()
    }
];

export const notificationStore = {
    getAll: () => {
        const stored = localStorage.getItem(NOTIFICATION_KEY);
        if (!stored) {
            localStorage.setItem(NOTIFICATION_KEY, JSON.stringify(initialNotifications));
            return initialNotifications;
        }
        return JSON.parse(stored);
    },

    // Get notifications for a specific user role or ID
    getForUser: (userId) => {
        const title = notificationStore.getAll();
        // Return notifications that match the userId or are broadcast (no userId)
        return title.filter(n => n.userId === userId || !n.userId)
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    },

    add: (notification) => {
        const notifications = notificationStore.getAll();
        const newNotification = {
            id: `NOT-${Date.now()}`,
            timestamp: new Date().toISOString(),
            read: false,
            type: 'info',
            ...notification
        };
        const updated = [newNotification, ...notifications];
        localStorage.setItem(NOTIFICATION_KEY, JSON.stringify(updated));
        return newNotification;
    },

    markAsRead: (id) => {
        const notifications = notificationStore.getAll();
        const updated = notifications.map(n =>
            n.id === id ? { ...n, read: true } : n
        );
        localStorage.setItem(NOTIFICATION_KEY, JSON.stringify(updated));
        return updated;
    },

    markAllAsRead: (userId) => {
        const notifications = notificationStore.getAll();
        const updated = notifications.map(n =>
            (n.userId === userId || !n.userId) ? { ...n, read: true } : n
        );
        localStorage.setItem(NOTIFICATION_KEY, JSON.stringify(updated));
        return updated;
    },

    delete: (id) => {
        const notifications = notificationStore.getAll();
        const updated = notifications.filter(n => n.id !== id);
        localStorage.setItem(NOTIFICATION_KEY, JSON.stringify(updated));
        return updated;
    },

    reset: () => {
        localStorage.setItem(NOTIFICATION_KEY, JSON.stringify(initialNotifications));
        return initialNotifications;
    }
};
