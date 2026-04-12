// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// API utility functions
export const api = {
    // Helper function to make API calls
    async request(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        const token = localStorage.getItem('token');

        const config = {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        };

        // Add auth token if available
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    // Authentication APIs
    auth: {
        register: (userData) => api.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData),
        }),

        login: (credentials) => api.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        }),

        getMe: () => api.request('/auth/me'),

        updateProfile: (profileData) => api.request('/auth/profile', {
            method: 'PUT',
            body: JSON.stringify({ profile: profileData }),
        }),

        uploadFile: async (formData) => {
            const url = `${API_BASE_URL}/upload/certificate`;
            const token = localStorage.getItem('token');
            const config = {
                method: 'POST',
                body: formData,
            };
            if (token) {
                config.headers = { 'Authorization': `Bearer ${token}` };
            }
            const response = await fetch(url, config);
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'File upload failed');
            return data;
        },
    },

    // Farmer APIs
    farmer: {
        getBatches: (params) => {
            const queryString = new URLSearchParams(params).toString();
            return api.request(`/farmer/batches?${queryString}`);
        },

        getBatchById: (id) => api.request(`/farmer/batches/${id}`),

        createBatch: (batchData) => api.request('/farmer/batches', {
            method: 'POST',
            body: JSON.stringify(batchData),
        }),

        updateBatch: (id, batchData) => api.request(`/farmer/batches/${id}`, {
            method: 'PUT',
            body: JSON.stringify(batchData),
        }),

        deleteBatch: (id) => api.request(`/farmer/batches/${id}`, {
            method: 'DELETE',
        }),

        getAnalytics: () => api.request('/farmer/analytics'),
    },

    // Distributor APIs
    distributor: {
        getStats: () => api.request('/distributor/stats'),
        getInventory: () => api.request('/distributor/inventory'),
        getIncoming: () => api.request('/distributor/incoming'),
        getAnalytics: () => api.request('/distributor/analytics'),
        getWarehouses: () => api.request('/distributor/warehouses'),
        createWarehouse: (data) => api.request('/distributor/warehouses', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
        getIncomingPOs: () => api.request('/distributor/purchase-orders'),
        acceptPO: (id) => api.request(`/distributor/purchase-orders/${id}/accept`, {
            method: 'PUT'
        }),
        rejectPO: (id, reason) => api.request(`/distributor/purchase-orders/${id}/reject`, {
            method: 'PUT',
            body: JSON.stringify({ reason })
        }),
        publishInventory: (id, available) => api.request(`/distributor/inventory/${id}/publish`, {
            method: 'PUT',
            body: JSON.stringify({ available })
        }),
    },

    // Retailer APIs
    retailer: {
        getStats: () => api.request('/retailer/stats'),
        getProducts: () => api.request('/retailer/products'),
        acquireBatch: (batchId) => api.request('/retailer/acquire', {
            method: 'POST',
            body: JSON.stringify({ batchId })
        }),
        markAvailable: (id) => api.request(`/retailer/${id}/available`, {
            method: 'PUT'
        }),
        getSales: () => api.request('/retailer/sales'),
        recordSale: (saleData) => api.request('/retailer/sales', {
            method: 'POST',
            body: JSON.stringify(saleData)
        }),
        getMarketplace: () => api.request('/retailer/marketplace'),
        createPurchaseOrder: (data) => api.request('/retailer/purchase-orders', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
        getPurchaseOrders: () => api.request('/retailer/purchase-orders')
    },

    // Transporter APIs
    transporter: {
        getStats: () => api.request('/transporter/stats'),
    },

    // Shipment APIs
    shipment: {
        create: (data) => api.request('/shipments', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
        getAll: () => api.request('/shipments'),
        getDistributors: () => api.request('/shipments/distributors'),
        getTransporters: () => api.request('/shipments/transporters'),
        updateStatus: (id, status) => api.request(`/shipments/${id}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status })
        }),
        assignDriver: (id, driverId) => api.request(`/shipments/${id}/assign`, {
            method: 'PUT',
            body: JSON.stringify({ driverId })
        }),
    },

    // Notification APIs
    notification: {
        getAll: () => api.request('/notifications'),
        markAllRead: () => api.request('/notifications/read-all', {
            method: 'PUT'
        }),
    },

    // Vehicle APIs
    vehicle: {
        create: (data) => api.request('/vehicles', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
        getAll: () => api.request('/vehicles'),
        getById: (id) => api.request(`/vehicles/${id}`),
        update: (id, data) => api.request(`/vehicles/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),
        delete: (id) => api.request(`/vehicles/${id}`, {
            method: 'DELETE',
        }),
    },

    // Driver APIs
    driver: {
        create: (driverData) => api.request('/drivers', {
            method: 'POST',
            body: JSON.stringify(driverData),
        }),
        getAll: () => api.request('/drivers'),
        getById: (id) => api.request(`/drivers/${id}`),
        update: (id, data) => api.request(`/drivers/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),
        delete: (id) => api.request(`/drivers/${id}`, {
            method: 'DELETE',
        }),
        assignVehicle: (id, vehicleId) => api.request(`/drivers/${id}/assign-vehicle`, {
            method: 'PUT',
            body: JSON.stringify({ vehicleId }),
        }),
        updateDutyStatus: (status, location) => api.request('/drivers/duty-status', {
            method: 'PUT',
            body: JSON.stringify({ status, location }),
        }),
        updateLocation: (lat, lng) => api.request('/drivers/location', {
            method: 'PUT',
            body: JSON.stringify({ lat, lng }),
        }),
        getStatus: () => api.request('/drivers/me/status'),
    },

    // Public APIs
    public: {
        getTraceData: (batchId) => fetch(`${API_BASE_URL}/public/trace/${batchId}`).then(res => res.json())
    }
};

// Auth helper functions
export const authHelpers = {
    // Save token to localStorage
    saveToken: (token) => {
        localStorage.setItem('token', token);
    },

    // Get token from localStorage
    getToken: () => {
        return localStorage.getItem('token');
    },

    // Remove token from localStorage
    removeToken: () => {
        localStorage.removeItem('token');
    },

    // Check if user is authenticated
    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    },

    // Save user data to localStorage
    saveUser: (user) => {
        localStorage.setItem('user', JSON.stringify(user));
    },

    // Get user data from localStorage
    getUser: () => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    // Remove user data from localStorage
    removeUser: () => {
        localStorage.removeItem('user');
    },

    // Logout - remove all auth data
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },
};

export default api;
