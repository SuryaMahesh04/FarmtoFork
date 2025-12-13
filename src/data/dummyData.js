// FARMER DATA
export const farmerMetrics = [
    { title: "Total Batches", value: 124, trend: 12, trendLabel: "vs last month" },
    { title: "Active Batches", value: 8, trend: 0, trendLabel: "Currently growing" },
    { title: "Total Revenue (₹)", value: 845000, trend: 24, trendLabel: "vs last season" },
    { title: "Quality Score", value: 98, trend: 2, trendLabel: "Top 5% in region" },
];

export const farmerBatches = [
    { id: "B-2023-001", crop: "Organic Wheat", variety: "Sharbati", quantity: "2000 kg", date: "2023-11-15", status: "Delivered", quality: "A+" },
    { id: "B-2023-002", crop: "Basmati Rice", variety: "Pusa 1121", quantity: "5000 kg", date: "2023-11-20", status: "In Transit", quality: "A" },
    { id: "B-2023-003", crop: "Tur Dal", variety: "Desi", quantity: "1500 kg", date: "2023-12-01", status: "Processing", quality: "A+" },
    { id: "B-2023-004", crop: "Cotton", variety: "BT", quantity: "4000 kg", date: "2023-12-05", status: "Created", quality: "Pending" },
    { id: "B-2023-005", crop: "Sugarcane", variety: "Co 0238", quantity: "15000 kg", date: "2023-12-10", status: "Created", quality: "Pending" },
];

export const cropDistributionData = [
    { name: 'Wheat', value: 400, color: '#9dc88d' },
    { name: 'Rice', value: 300, color: '#f5deb3' },
    { name: 'Pulses', value: 200, color: '#e07a5f' },
    { name: 'Others', value: 100, color: '#b4d7e8' },
];

export const seasonalTrendData = [
    { name: 'Jan', batches: 4, revenue: 2400 },
    { name: 'Feb', batches: 3, revenue: 1398 },
    { name: 'Mar', batches: 2, revenue: 6800 },
    { name: 'Apr', batches: 2, revenue: 3908 },
    { name: 'May', batches: 1, revenue: 4800 },
    { name: 'Jun', batches: 2, revenue: 3800 },
    { name: 'Jul', batches: 3, revenue: 4300 },
];

// TRANSPORTER DATA
export const transportMetrics = [
    { title: "Active Shipments", value: 14, trend: 5, trendLabel: "On road" },
    { title: "Completed", value: 452, trend: 15, trendLabel: "This month" },
    { title: "Distance (km)", value: 12500, trend: 8, trendLabel: "Total covered" },
    { title: "Vehicle Health", value: 92, trend: -1, trendLabel: "Avg fleet score" },
];

export const activeShipments = [
    { id: "TR-8821", origin: "Guntur, AP", destination: "Hyderabad, TS", cargo: "Chilli", vehicle: "TS08 UA 1234", status: "In Transit", eta: "4 hrs" },
    { id: "TR-8825", origin: "Nasik, MH", destination: "Mumbai, MH", cargo: "Onions", vehicle: "MH15 AA 5555", status: "Loading", eta: "12 hrs" },
    { id: "TR-8829", origin: "Karnal, PB", destination: "Delhi, DL", cargo: "Rice", vehicle: "PB10 X 9999", status: "In Transit", eta: "2 hrs" },
];

export const vehicleUtilizationData = [
    { name: 'Active', value: 14, color: '#9dc88d' },
    { name: 'Maintenance', value: 2, color: '#e07a5f' },
    { name: 'Idle', value: 4, color: '#f5deb3' },
];

// DISTRIBUTOR DATA
export const distributorMetrics = [
    { title: "Inventory (MT)", value: 850, trend: 10, trendLabel: "Capacity utilization" },
    { title: "Incoming", value: 5, trend: 0, trendLabel: "Batches arriving today" },
    { title: "Dispatched", value: 12, trend: 20, trendLabel: "To retailers today" },
    { title: "Quality Check", value: 100, trend: 0, trendLabel: "Pass rate" },
];

export const inventoryData = [
    { id: "INV-001", item: "Premium Basmati Rice", stock: "5000 kg", warehouse: "Zone A - 12", expiry: "2024-12-01", status: "In Stock" },
    { id: "INV-002", item: "Organic Tur Dal", stock: "2000 kg", warehouse: "Zone B - 05", expiry: "2024-06-15", status: "Low Stock" },
    { id: "INV-003", item: "Grade A Wheat", stock: "15000 kg", warehouse: "Silo 4", expiry: "2024-10-30", status: "In Stock" },
];

// RETAILER DATA
export const retailerMetrics = [
    { title: "Total Products", value: 450, trend: 5, trendLabel: "SKUs listed" },
    { title: "Sales Today", value: 24, trend: 15, trendLabel: "Transactions" },
    { title: "Low Stock", value: 12, trend: -2, trendLabel: "Items to reorder" },
    { title: "Cust. Scans", value: 156, trend: 24, trendLabel: "QR traces today" },
];

export const resourceUsageData = [
    { month: 'Jan', water: 45000, fertilizer: 200, labor: 120 },
    { month: 'Feb', water: 52000, fertilizer: 150, labor: 100 },
    { month: 'Mar', water: 48000, fertilizer: 300, labor: 150 },
    { month: 'Apr', water: 61000, fertilizer: 250, labor: 180 },
    { month: 'May', water: 58000, fertilizer: 200, labor: 140 },
    { month: 'Jun', water: 65000, fertilizer: 400, labor: 200 },
];

export const soilHealthData = [
    { subject: 'Nitrogen (N)', A: 120, B: 150, fullMark: 200 },
    { subject: 'Phosphorus (P)', A: 98, B: 90, fullMark: 150 },
    { subject: 'Potassium (K)', A: 86, B: 130, fullMark: 150 },
    { subject: 'pH Level', A: 6.5, B: 7.0, fullMark: 14 },
    { subject: 'Moisture', A: 65, B: 85, fullMark: 100 },
    { subject: 'Organic C', A: 0.8, B: 1.2, fullMark: 2 },
];

export const marketPriceData = [
    { month: 'Jul', myPrice: 2200, marketPrice: 2100 },
    { month: 'Aug', myPrice: 2250, marketPrice: 2150 },
    { month: 'Sep', myPrice: 2400, marketPrice: 2300 },
    { month: 'Oct', myPrice: 2350, marketPrice: 2400 },
    { month: 'Nov', myPrice: 2500, marketPrice: 2450 },
    { month: 'Dec', myPrice: 2600, marketPrice: 2550 },
];
