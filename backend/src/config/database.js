const mongoose = require('mongoose');

// Cache the connection across Vercel Lambda warm invocations
let isConnected = false;

const connectDB = async () => {
    if (isConnected) {
        return;
    }

    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            family: 4, // Force IPv4, helps with DNS/ECONNREFUSED issues on Windows
            serverSelectionTimeoutMS: 5000, // Fail quickly on Vercel to prevent Lambda timeout
        });

        isConnected = !!conn.connections[0].readyState;
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        throw error; // Let Express handle error, never process.exit(1) on Vercel 
    }
};

module.exports = connectDB;
