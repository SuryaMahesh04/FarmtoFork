const mongoose = require('mongoose');
const dns = require('dns');

// Force IPv4 first for DNS resolution to avoid ECONNREFUSED issues with SRV records on some systems/Node versions
if (dns.setDefaultResultOrder) {
    dns.setDefaultResultOrder('ipv4first');
}

// Use Google DNS servers to resolve MongoDB SRV records if local DNS fails
try {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {
    console.warn('Could not set custom DNS servers:', e.message);
}

// Cache the connection across Vercel Lambda warm invocations
let isConnected = false;

const connectDB = async () => {
    if (isConnected) {
        return;
    }

    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            family: 4, 
            serverSelectionTimeoutMS: 5000,
        });

        isConnected = !!conn.connections[0].readyState;
        console.log(`MongoDB Connected: ${conn.connection.host || 'Success'}`);
    } catch (error) {
        console.error(`MongoDB Connection Error: ${error.message}`);
        throw error; 
    }
};

module.exports = connectDB;
