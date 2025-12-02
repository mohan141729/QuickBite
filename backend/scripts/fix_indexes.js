import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const fixIndexes = async () => {
    try {
        const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/quickbite_db';
        console.log('Environment variables loaded.');
        console.log('Using URI:', uri.substring(0, 15) + '...');

        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(uri);
        console.log('✅ Connected to MongoDB');

        const db = mongoose.connection.db;
        const collection = db.collection('reviews');

        console.log('🔍 Listing indexes...');
        const indexes = await collection.indexes();
        console.log('Indexes found:', indexes.map(i => i.name));

        const indexName = 'restaurant_1_user_1';
        const indexExists = indexes.some(i => i.name === indexName);

        if (indexExists) {
            console.log(`🗑️ Dropping index: ${indexName}...`);
            await collection.dropIndex(indexName);
            console.log(`✅ Index ${indexName} dropped successfully.`);
        } else {
            console.log(`ℹ️ Index ${indexName} does not exist.`);
        }

        console.log('🎉 Done!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

fixIndexes();
