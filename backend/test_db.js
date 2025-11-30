import mongoose from 'mongoose';
import fs from 'fs';

const logFile = 'db_test_result.txt';
const log = (msg) => {
    console.log(msg);
    fs.appendFileSync(logFile, msg + '\n');
};

const testConnection = async () => {
    fs.writeFileSync(logFile, 'Starting DB Test...\n');

    const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/quickbite_db';
    log(`Trying to connect to: ${uri}`);

    try {
        await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
        log('✅ Connection Successful!');

        const collections = await mongoose.connection.db.listCollections().toArray();
        log(`Found ${collections.length} collections:`);
        collections.forEach(c => log(` - ${c.name}`));

        await mongoose.disconnect();
        log('Disconnected.');
        process.exit(0);
    } catch (err) {
        log('❌ Connection Failed!');
        log(`Error: ${err.message}`);
        log(`Code: ${err.code}`);
        process.exit(1);
    }
};

testConnection();
