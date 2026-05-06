require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');

// Initialize express app
const app = express();

// Removed global db connection call. Using per-request middleware for Vercel.

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure database connection in Serverless Environments
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Database connection failed. Please try again later.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Routes
const apiRouter = express.Router();

apiRouter.use('/auth', require('./routes/auth'));
apiRouter.use('/farmer', require('./routes/farmer'));
apiRouter.use('/transporter', require('./routes/transporter'));
apiRouter.use('/distributor', require('./routes/distributor'));
apiRouter.use('/retailer', require('./routes/retailer'));
apiRouter.use('/shipments', require('./routes/shipment'));
apiRouter.use('/drivers', require('./routes/drivers'));
apiRouter.use('/vehicles', require('./routes/vehicles'));
apiRouter.use('/notifications', require('./routes/notification'));
apiRouter.use('/upload', require('./routes/upload'));
apiRouter.use('/public', require('./routes/public'));
apiRouter.use('/admin', require('./routes/admin'));

apiRouter.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Farm2Fork API is running',
        timestamp: new Date().toISOString()
    });
});

// Mount the API router on both /api and / 
// This ensures compatibility whether Vercel strips the /api prefix or not
app.use('/api', apiRouter);
app.use('/', apiRouter);

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
