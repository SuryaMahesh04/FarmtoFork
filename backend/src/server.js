require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');

// Initialize express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const authRoutes = require('./routes/auth');
const farmerRoutes = require('./routes/farmer');

app.use('/api/auth', authRoutes);
app.use('/api/farmer', farmerRoutes);
app.use('/api/distributor', require('./routes/distributor'));
app.use('/api/shipments', require('./routes/shipment'));
app.use('/api/drivers', require('./routes/drivers'));
app.use('/api/vehicles', require('./routes/vehicles'));
app.use('/api/notifications', require('./routes/notification'));

// Health check route
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Farm2Fork API is running',
        timestamp: new Date().toISOString()
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Handle 404
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Start server
// Export the app for Vercel
module.exports = app;

// Start server only if run directly (local dev)
if (require.main === module) {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
}
