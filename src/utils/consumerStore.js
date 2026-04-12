import { api, authHelpers } from './api';

const DEVICE_KEY = 'consumer_device_id';

export const getDeviceId = () => {
    let deviceId = localStorage.getItem(DEVICE_KEY);
    if (!deviceId) {
        deviceId = crypto.randomUUID ? crypto.randomUUID() : 'dev-' + Math.random().toString(36).substring(2, 15);
        localStorage.setItem(DEVICE_KEY, deviceId);
    }
    return deviceId;
};

export const getUserId = () => {
    const user = authHelpers.getUser();
    return user?.role === 'consumer' ? user.id : null;
};

// Track a new scan
export const trackConsumerScan = async (batchId, isTampered, location = {}) => {
    try {
        const deviceId = getDeviceId();
        const userId = getUserId();
        await api.request('/public/consumer/scan', {
            method: 'POST',
            body: JSON.stringify({
                deviceId,
                userId,
                batchId,
                isTampered,
                location
            })
        });
    } catch (error) {
        console.error('Failed to track consumer scan:', error);
    }
};

// Fetch aggregating metrics
export const getConsumerMetrics = async () => {
    try {
        const deviceId = getDeviceId();
        const userId = getUserId();
        const url = `/public/consumer/${deviceId}/metrics${userId ? `?userId=${userId}` : ''}`;
        const res = await api.request(url);
        if (res.success) {
            return res.data;
        }
    } catch (error) {
        console.error('Failed to fetch consumer metrics:', error);
    }
    return {
        totalVerified: 0,
        counterfeits: 0,
        uniqueFarms: 0,
        favouriteFarm: 'None yet'
    };
};

// Fetch full history
export const getConsumerHistory = async () => {
    try {
        const deviceId = getDeviceId();
        const userId = getUserId();
        const url = `/public/consumer/${deviceId}/history${userId ? `?userId=${userId}` : ''}`;
        const res = await api.request(url);
        if (res.success) {
            return res.data;
        }
    } catch (error) {
        console.error('Failed to fetch consumer history:', error);
    }
    return [];
};

// Fetch farms explored
export const getConsumerFarms = async () => {
    try {
        const deviceId = getDeviceId();
        const userId = getUserId();
        const url = `/public/consumer/${deviceId}/farms${userId ? `?userId=${userId}` : ''}`;
        const res = await api.request(url);
        if (res.success) {
            return res.data;
        }
    } catch (error) {
        console.error('Failed to fetch consumer farms:', error);
    }
    return [];
};

// Fetch tampered alerts
export const getConsumerAlerts = async () => {
    try {
        const deviceId = getDeviceId();
        const userId = getUserId();
        const url = `/public/consumer/${deviceId}/alerts${userId ? `?userId=${userId}` : ''}`;
        const res = await api.request(url);
        if (res.success) {
            return res.data;
        }
    } catch (error) {
        console.error('Failed to fetch consumer alerts:', error);
    }
    return [];
};

// Helper clear testing
export const clearConsumerScans = () => {
    localStorage.removeItem(DEVICE_KEY);
};
