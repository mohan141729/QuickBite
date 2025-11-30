import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Restaurant from '../models/Restaurant.js';
import MenuItem from '../models/MenuItem.js';
import Order from '../models/Order.js';
import DeliveryPartner from '../models/DeliveryPartner.js';

const verify = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // 1. Create User
        const user = await User.create({
            name: 'Test User',
            email: `test${Date.now()}@example.com`,
            clerkId: `clerk_${Date.now()}`,
            phone: `9876543210_${Date.now()}`, // Ensure uniqueness
            preferences: { isVeg: true, spicyLevel: 'medium', allergies: ['nuts'] },
            savedPaymentMethods: [{ type: 'card', details: { last4: '1234' } }]
        });
        console.log('✅ User created with new fields');

        // 2. Create Restaurant
        const restaurant = await Restaurant.create({
            owner: user._id,
            name: 'Test Restaurant',
            categories: [{ name: 'Starters' }],
            operatingHours: { open: '10:00', close: '23:00', holidays: ['Sunday'] },
            deliveryRadius: 10,
            commissionRate: 25,
            bankAccount: { accountNumber: '1234567890', ifscCode: 'HDFC0001234', accountHolderName: 'Test Owner' },
            documents: { fssai: '12345678901234', gst: '29ABCDE1234F1Z5' }
        });
        console.log('✅ Restaurant created with new fields');

        // 3. Create MenuItem
        const menuItem = await MenuItem.create({
            restaurant: restaurant._id,
            name: 'Test Item',
            price: 100,
            variants: [{ name: 'Small', price: 100 }, { name: 'Large', price: 150 }],
            addOns: [{ name: 'Cheese', price: 20 }],
            nutritionalInfo: { calories: 200, protein: 10 }
        });
        console.log('✅ MenuItem created with new fields');

        // 4. Create Order
        const order = await Order.create({
            user: user._id,
            restaurant: restaurant._id,
            items: [{ menuItem: menuItem._id, quantity: 1, price: 100 }],
            totalAmount: 150,
            deliveryFee: 30,
            packagingFee: 10,
            tax: 5,
            platformFee: 5,
            deliveryInstructions: 'Leave at door',
            address: { line1: '123 St', city: 'City', pincode: '123456', location: { lat: 12.9716, lng: 77.5946 } },
            pickupLocation: { lat: 12.9716, lng: 77.5946 },
            cancellationReason: 'Changed mind'
        });
        console.log('✅ Order created with new fields');

        // 5. Create DeliveryPartner
        const partner = await DeliveryPartner.create({
            user: user._id,
            activeZone: 'Bangalore-Central',
            vehicleType: 'bike',
            documents: { license: 'DL1234567890' },
            currentLocation: {
                type: 'Point',
                coordinates: [77.5946, 12.9716] // [lng, lat]
            }
        });
        console.log('✅ DeliveryPartner created with new fields');

        console.log('🎉 ALL CHECKS PASSED');
        process.exit(0);
    } catch (error) {
        console.error('❌ Verification Failed:', error);
        process.exit(1);
    }
};

verify();
