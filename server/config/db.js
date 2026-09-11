const dns = require('dns');
const mongoose = require('mongoose');

dns.setServers(['1.1.1.1', '8.8.8.8']);

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(
            process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/movie_discovery'
        );

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`MongoDB Connection Error: ${error.message}`);
    }
};

module.exports = connectDB;
