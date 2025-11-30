import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import DeliveryPartner from '../models/DeliveryPartner.js';
import Order from '../models/Order.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load env vars
const envPath = 'c:\\Users\\mohan\\OneDrive\\Desktop\\QuickBite\\backend\\.env';
console.log(`Loading .env from: ${envPath}`);
if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    for (const line of envConfig.split('\n')) {
        const [key, value] = line.split('=');
        if (key && value) {
            process.env[key.trim()] = value.trim();
        }
    }
} else {
    console.log('❌ .env file not found');
}

const logFile = join(__dirname, '../../debug_output_3.txt');
const log = (msg) => {
    console.log(msg);
    fs.appendFileSync(logFile, msg + '\n');
};

const runDebug = async () => {
    try {
        fs.writeFileSync(logFile, 'Starting debug script...\n');
        log(`MONGODB_URI exists: ${!!process.env.MONGODB_URI}`);

        log('🔌 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        log('✅ Connected to MongoDB');

        log('🔍 Checking DeliveryPartner model...');
        const partners = await DeliveryPartner.find({}).limit(1);
        log(`✅ Found ${partners.length} partners`);
        if (partners.length > 0) {
            log(`Sample partner ID: ${partners[0]._id}`);
        }

        log('🔍 Checking Order model...');
        const orders = await Order.find({
            orderStatus: { $in: ["ready", "out-for-delivery"] },
        })
            .populate("restaurant", "name")
            .populate("user", "name")
            .limit(5);

        log(`✅ Found ${orders.length} active orders`);
        if (orders.length > 0) {
            log(`Sample order ID: ${orders[0]._id}`);
            log(`Sample order Restaurant: ${orders[0].restaurant?.name}`);
        }

        log('✅ Debug script completed successfully');
    } catch (error) {
        log(`❌ Error in debug script: ${error.message}`);
        log(error.stack);
    } finally {
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
        }
    }
};

runDebug();
