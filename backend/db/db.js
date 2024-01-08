const mongoose = require('mongoose');
const { DB_NAME } = require('../constants');

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
        console.log(`MONGODB Connected !! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.error(`MONGODB Connection error`, error);
        process.exit(1);
    }
};

module.exports = { connectDB };
