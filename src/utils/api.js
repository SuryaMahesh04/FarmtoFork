// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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
