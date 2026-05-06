const Vehicle = require('../models/Vehicle');
const Shipment = require('../models/Shipment');
const Driver = require('../models/Driver');

/**
 * @desc    Get dashboard statistics for transporter
 * @route   GET /api/transporter/stats
 * @access  Private (Transporter only)
 */
exports.getDashboardStats = async (req, res) => {
    try {
        const transporterId = req.user.id;

        // 1. Basic Counts
        const totalFleet = await Vehicle.countDocuments({ transporter: transporterId });
        const totalDrivers = await Driver.countDocuments({ transporter: transporterId });
        const shipments = await Shipment.find({ transporter: transporterId });
        
        const completedShipments = shipments.filter(s => s.status === 'delivered').length;
        const activeShipmentsCount = shipments.filter(s => ['accepted', 'assigned', 'at_pickup', 'picked_up', 'in-transit'].includes(s.status)).length;

        // 3. Utilization (Pie Chart)
        const vehicles = await Vehicle.find({ transporter: transporterId });
        const onRouteCount = vehicles.filter(v => ['On Route', 'In Transit'].includes(v.status)).length;
        const maintenanceCount = vehicles.filter(v => v.status === 'Maintenance').length;
        const availableCount = vehicles.filter(v => v.status === 'Available').length;

        const utilizationData = [
            { name: 'On Route', value: onRouteCount || 0, color: '#4ade80' },
            { name: 'Available', value: availableCount || 0, color: '#bae6fd' },
            { name: 'Maintenance', value: maintenanceCount || 0, color: '#fde68a' }
        ];

        // 4. Monthly Analytics (Trends) - Calculate real shipments per month
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6));
        
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const shipmentsByMonth = {};
        
        // Initialize last 6 months
        for (let i = 5; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            shipmentsByMonth[monthNames[d.getMonth()]] = 0;
        }

        shipments.forEach(s => {
            const month = monthNames[new Date(s.createdAt).getMonth()];
            if (shipmentsByMonth.hasOwnProperty(month)) {
                shipmentsByMonth[month]++;
            }
        });

        const monthlyData = Object.keys(shipmentsByMonth).map(m => ({
            name: m,
            value: shipmentsByMonth[m]
        }));

        // 5. Recent Shipments
        const recentShipmentsData = await Shipment.find({ transporter: transporterId })
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('farmer', 'profile.fullName profile.village profile.district profile.city')
            .populate('distributor', 'profile.companyName profile.city')
            .populate('batch', 'crop quantity unit');

        res.json({
            success: true,
            data: {
                stats: { totalFleet, completedShipments, activeShipments: activeShipmentsCount, totalDrivers },
                utilizationData,
                monthlyData,
                recentShipments: recentShipmentsData.map(s => ({
                    id: s.shipmentId,
                    origin: s.farmer?.profile?.village ? `${s.farmer.profile.village}, ${s.farmer.profile.district || ''}` : (s.farmer?.profile?.city || 'Farm'),
                    destination: s.distributor?.profile?.city || s.distributor?.profile?.companyName || 'Warehouse',
                    cargo: s.batch ? `${s.batch.crop} (${s.batch.quantity}${s.batch.unit || 'kg'})` : 'General Cargo',
                    status: s.status
                }))
            }
        });
    } catch (error) {
        console.error('Transporter Stats Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch transporter stats',
            error: error.message
        });
    }
};
