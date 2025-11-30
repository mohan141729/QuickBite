
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Order from './src/models/Order.js';
import User from './src/models/User.js'; // Ensure User model is registered
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

const checkOrders = async () => {
    try {
        const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/quickbite";
        console.log('Connecting to MongoDB...', uri);
        await mongoose.connect(uri);
        console.log('Connected to MongoDB');

        // Fetch last 5 orders and populate user
        const orders = await Order.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('user', 'name email');

        console.log(`Found ${orders.length} recent orders.`);

        orders.forEach(order => {
            console.log(`Order ID: ${order._id}`);
            console.log(`User Field:`, order.user);
            console.log(`User Name: ${order.user?.name || 'MISSING'}`);
            console.log('---');
        });

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
};

checkOrders();
