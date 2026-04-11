const mongoose = require('mongoose');
const dns = require('dns');

// Force Google DNS to bypass local ISP blocks on SRV queries
dns.setServers(['8.8.8.8', '1.1.1.1']);

// Cache the connection
let isConnected = false;

const connectDB = async () => {
    if (isConnected) {
        console.log('Using existing MongoDB connection');
        return;
    }

    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            family: 4, // Force IPv4, helps with DNS/ECONNREFUSED issues on Windows
        });

        isConnected = !!conn.connections[0].readyState;
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
