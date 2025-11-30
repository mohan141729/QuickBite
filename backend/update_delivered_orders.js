
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Order from './src/models/Order.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

const updateOrders = async () => {
    try {
        const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/quickbite";
        console.log('Connecting to MongoDB...', uri);
        await mongoose.connect(uri);
        console.log('Connected to MongoDB');

        const result = await Order.updateMany(
            { orderStatus: 'delivered', paymentStatus: { $ne: 'paid' } },
            { $set: { paymentStatus: 'paid' } }
        );

        console.log(`Updated ${result.modifiedCount} orders to 'paid' status.`);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
};

updateOrders();
