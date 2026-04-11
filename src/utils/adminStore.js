import { create } from 'zustand';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const useAdminStore = create((set, get) => ({
    overview: null,
    activityFeed: [],
    users: [],
    usersPagination: null,
    batches: [],
    batchesPagination: null,
    shipments: [],
    shipmentsPagination: null,
    vehicles: [],
    drivers: [],
    analytics: null,
    approvals: [],
    auditLogs: [],
    auditLogsPagination: null,
    mapData: [],
    isLoading: false,

    // Helper to get token
    getHeaders: () => {
        const token = localStorage.getItem('token');
        return {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };
    },

    fetchOverview: async () => {
        try {
            const res = await axios.get('/api/admin/overview', get().getHeaders());
            set({ overview: res.data.data });
        } catch (error) {
            console.error('Failed to fetch admin overview', error);
        }
    },

    fetchActivityFeed: async () => {
         try {
            const res = await axios.get('/api/admin/activity-feed', get().getHeaders());
            set({ activityFeed: res.data.data });
        } catch (error) {
            console.error('Failed to fetch activity feed', error);
        }
    },

    fetchUsers: async (filters = {}) => {
        set({ isLoading: true });
        try {
            const params = new URLSearchParams(filters).toString();
            const res = await axios.get(`/api/admin/users?${params}`, get().getHeaders());
            set({ users: res.data.data, usersPagination: res.data.pagination, isLoading: false });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to fetch users');
            set({ isLoading: false });
        }
    },

    verifyUser: async (id) => {
        try {
            const res = await axios.put(`/api/admin/users/${id}/verify`, {}, get().getHeaders());
            toast.success('User verified successfully');
            get().fetchUsers(); // Refresh list
            get().fetchApprovals();
            return res.data;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Verification failed');
            throw error;
        }
    },

    suspendUser: async (id) => {
         try {
            const res = await axios.put(`/api/admin/users/${id}/suspend`, {}, get().getHeaders());
            toast.success('User status toggled');
            get().fetchUsers(); // Refresh list
            return res.data;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Action failed');
            throw error;
        }
    },
    
    deleteUser: async (id) => {
        try {
            await axios.delete(`/api/admin/users/${id}`, get().getHeaders());
            toast.success('User permanently deleted');
            get().fetchUsers(); // Refresh list
        } catch (error) {
            toast.error(error.response?.data?.message || 'Action failed');
            throw error;
        }
    },

    bulkSuspendUsers: async (userIds, action) => {
        try {
            const res = await axios.post('/api/admin/users/bulk/suspend', { userIds, action }, get().getHeaders());
            toast.success(res.data.message);
            get().fetchUsers(); // Refresh
            return res.data;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Bulk suspension failed');
            throw error;
        }
    },

    bulkVerifyUsers: async (userIds) => {
        try {
            const res = await axios.post('/api/admin/users/bulk/verify', { userIds }, get().getHeaders());
            toast.success(res.data.message);
            get().fetchUsers(); // Refresh
            get().fetchApprovals();
            return res.data;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Bulk verification failed');
            throw error;
        }
    },

    bulkDeleteUsers: async (userIds) => {
        try {
            const res = await axios.post('/api/admin/users/bulk/delete', { userIds }, get().getHeaders());
            toast.success(res.data.message);
            get().fetchUsers(); // Refresh
            return res.data;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Bulk deletion failed');
            throw error;
        }
    },

    fetchBatches: async (filters = {}) => {
        set({ isLoading: true });
        try {
            const params = new URLSearchParams(filters).toString();
            const res = await axios.get(`/api/admin/batches?${params}`, get().getHeaders());
            set({ batches: res.data.data, batchesPagination: res.data.pagination, isLoading: false });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to fetch batches');
            set({ isLoading: false });
        }
    },
    
    overrideBatchStatus: async (id, status) => {
         try {
            const res = await axios.put(`/api/admin/batches/${id}/status`, { status }, get().getHeaders());
            toast.success('Batch status overridden');
            get().fetchBatches(); // Refresh
            return res.data;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Action failed');
            throw error;
        }
    },

    bulkUpdateBatchStatus: async (batchIds, status) => {
        try {
            const res = await axios.post('/api/admin/batches/bulk/status', { batchIds, status }, get().getHeaders());
            toast.success(res.data.message);
            get().fetchBatches(); // Refresh
            return res.data;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Bulk status update failed');
            throw error;
        }
    },

    bulkDeleteBatches: async (batchIds) => {
        try {
            const res = await axios.post('/api/admin/batches/bulk/delete', { batchIds }, get().getHeaders());
            toast.success(res.data.message);
            get().fetchBatches(); // Refresh
            return res.data;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Bulk deletion failed');
            throw error;
        }
    },

    fetchShipments: async (filters = {}) => {
        set({ isLoading: true });
        try {
            const params = new URLSearchParams(filters).toString();
            const res = await axios.get(`/api/admin/shipments?${params}`, get().getHeaders());
            set({ shipments: res.data.data, shipmentsPagination: res.data.pagination, isLoading: false });
        } catch (error) {
             toast.error(error.response?.data?.message || 'Failed to fetch shipments');
             set({ isLoading: false });
        }
    },
    
    overrideShipmentStatus: async (id, status) => {
        try {
            const res = await axios.put(`/api/admin/shipments/${id}/status`, { status }, get().getHeaders());
            toast.success('Shipment status overridden');
            get().fetchShipments(); // Refresh
            return res.data;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Action failed');
            throw error;
        }
    },

    bulkUpdateShipmentStatus: async (shipmentIds, status) => {
        try {
            const res = await axios.post('/api/admin/shipments/bulk/status', { shipmentIds, status }, get().getHeaders());
            toast.success(res.data.message);
            get().fetchShipments(); // Refresh
            return res.data;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Bulk status update failed');
            throw error;
        }
    },

    bulkDeleteShipments: async (shipmentIds) => {
        try {
            const res = await axios.post('/api/admin/shipments/bulk/delete', { shipmentIds }, get().getHeaders());
            toast.success(res.data.message);
            get().fetchShipments(); // Refresh
            return res.data;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Bulk deletion failed');
            throw error;
        }
    },

    fetchFleet: async () => {
        set({ isLoading: true });
        try {
            const [vehiclesRes, driversRes] = await Promise.all([
                axios.get('/api/admin/fleet/vehicles', get().getHeaders()),
                axios.get('/api/admin/fleet/drivers', get().getHeaders())
            ]);
            set({ 
                vehicles: vehiclesRes.data.data, 
                drivers: driversRes.data.data,
                isLoading: false 
            });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to fetch fleet data');
            set({ isLoading: false });
        }
    },
    
    overrideDriverStatus: async (id, dutyStatus) => {
        try {
            await axios.put(`/api/admin/fleet/drivers/${id}/status`, { dutyStatus }, get().getHeaders());
            toast.success('Driver status overridden');
            get().fetchFleet(); // Refresh
        } catch (error) {
            toast.error(error.response?.data?.message || 'Action failed');
            throw error;
        }
    },

    bulkUpdateDriverStatus: async (driverIds, dutyStatus) => {
        try {
            const res = await axios.post('/api/admin/fleet/drivers/bulk/status', { driverIds, dutyStatus }, get().getHeaders());
            toast.success(res.data.message);
            get().fetchFleet(); // Refresh
            return res.data;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Bulk status update failed');
            throw error;
        }
    },

    bulkDeleteDrivers: async (driverIds) => {
        try {
            const res = await axios.post('/api/admin/fleet/drivers/bulk/delete', { driverIds }, get().getHeaders());
            toast.success(res.data.message);
            get().fetchFleet(); // Refresh
            return res.data;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Bulk deletion failed');
            throw error;
        }
    },

    bulkDeleteVehicles: async (vehicleIds) => {
        try {
            const res = await axios.post('/api/admin/fleet/vehicles/bulk/delete', { vehicleIds }, get().getHeaders());
            toast.success(res.data.message);
            get().fetchFleet(); // Refresh
            return res.data;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Bulk deletion failed');
            throw error;
        }
    },

    fetchApprovals: async () => {
         try {
            const res = await axios.get('/api/admin/approvals', get().getHeaders());
            set({ approvals: res.data.data });
        } catch (error) {
            console.error('Failed to fetch approvals', error);
        }
    },

    approveKyc: async (id) => {
        try {
            await axios.put(`/api/admin/approvals/${id}/approve`, {}, get().getHeaders());
            toast.success('User KYC approved');
            get().fetchApprovals();
            get().fetchOverview();
        } catch (error) {
             toast.error(error.response?.data?.message || 'Action failed');
             throw error;
        }
    },

    rejectKyc: async (id, reason) => {
        try {
            await axios.put(`/api/admin/approvals/${id}/reject`, { reason }, get().getHeaders());
            toast.success('User KYC rejected');
            get().fetchApprovals();
             get().fetchOverview();
        } catch (error) {
             toast.error(error.response?.data?.message || 'Action failed');
             throw error;
        }
    },
    
    fetchAnalytics: async (type) => {
         try {
            const res = await axios.get(`/api/admin/analytics/${type}`, get().getHeaders());
            set((state) => ({ 
                analytics: { 
                    ...state.analytics, 
                    [type]: res.data.data 
                } 
            }));
        } catch (error) {
             console.error(`Failed to fetch ${type} analytics`, error);
        }
    },
    
    fetchAuditLogs: async (filters = {}) => {
        set({ isLoading: true });
        try {
            const params = new URLSearchParams(filters).toString();
            const res = await axios.get(`/api/admin/audit-log?${params}`, get().getHeaders());
            set({ auditLogs: res.data.data, auditLogsPagination: res.data.pagination, isLoading: false });
        } catch (error) {
            toast.error('Failed to fetch audit logs');
            set({ isLoading: false });
        }
    },
    
    fetchMapData: async () => {
        set({ isLoading: true });
        try {
            const res = await axios.get('/api/admin/analytics/map', get().getHeaders());
            set({ mapData: res.data.data });
        } catch (error) {
            console.error('Failed to fetch map data', error);
            toast.error('Failed to load supply chain map');
        } finally {
            set({ isLoading: false });
        }
    }
}));

export default useAdminStore;
