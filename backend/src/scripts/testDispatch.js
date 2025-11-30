import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Restaurant from '../models/Restaurant.js';
import Order from '../models/Order.js';
import DeliveryPartner from '../models/DeliveryPartner.js';
import { autoAssignOrder } from '../services/dispatchService.js';

const testDispatch = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // 1. Create a Restaurant with Location
        const restaurantUser = await User.create({
            name: 'Dispatch Rest Owner',
            email: `rest_${Date.now()}@test.com`,
            clerkId: `clerk_rest_${Date.now()}`,
            role: 'restaurant_owner'
        });

        const restaurant = await Restaurant.create({
            owner: restaurantUser._id,
            name: 'Dispatch Test Restaurant',
            location: { lat: 12.9716, lng: 77.5946, address: 'Bangalore', city: 'Bangalore', pincode: '560001' },
            categories: [{ name: 'Test' }]
        });
        console.log('✅ Restaurant created at 12.9716, 77.5946');

        // 2. Create 2 Delivery Partners
        // Partner A: Close (1km away)
        const userA = await User.create({ name: 'Partner A', email: `pa_${Date.now()}@test.com`, clerkId: `clerk_pa_${Date.now()}`, role: 'delivery_partner' });
        const partnerA = await DeliveryPartner.create({
            user: userA._id,
            isAvailable: true,
            status: 'approved',
            currentLocation: { type: 'Point', coordinates: [77.5946, 12.9800] } // [lng, lat] ~1km north
        });
        console.log('✅ Partner A created (Close)');

        // Partner B: Far (20km away)
        const userB = await User.create({ name: 'Partner B', email: `pb_${Date.now()}@test.com`, clerkId: `clerk_pb_${Date.now()}`, role: 'delivery_partner' });
        const partnerB = await DeliveryPartner.create({
            user: userB._id,
            isAvailable: true,
            status: 'approved',
            currentLocation: { type: 'Point', coordinates: [77.5946, 13.1500] } // [lng, lat] ~20km north
        });
        console.log('✅ Partner B created (Far)');

        // 3. Create an Order
        const customer = await User.create({ name: 'Customer', email: `cust_${Date.now()}@test.com`, clerkId: `clerk_cust_${Date.now()}` });
        const order = await Order.create({
            user: customer._id,
            restaurant: restaurant._id,
            items: [],
            totalAmount: 100,
            pickupLocation: { lat: 12.9716, lng: 77.5946 }, // Same as restaurant
            address: { location: { lat: 12.9750, lng: 77.5950 } }
        });
        console.log('✅ Order created');

        // 4. Trigger Dispatch
        console.log('🔄 Triggering Auto-Dispatch...');
        const result = await autoAssignOrder(order._id);

        // 5. Verify
        const updatedOrder = await Order.findById(order._id);
        const updatedPartnerA = await DeliveryPartner.findById(partnerA._id);

        if (updatedOrder.deliveryPartner && updatedOrder.deliveryPartner.toString() === partnerA._id.toString()) {
            console.log('🎉 SUCCESS: Order assigned to Partner A (Nearest)');
        } else {
            console.error('❌ FAILURE: Order NOT assigned to Partner A');
            console.log('Assigned to:', updatedOrder.deliveryPartner);
        }

        if (updatedPartnerA.currentOrder && updatedPartnerA.currentOrder.toString() === order._id.toString()) {
            console.log('🎉 SUCCESS: Partner A marked as busy with order');
        } else {
            console.error('❌ FAILURE: Partner A not updated correctly');
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Test Failed:', error);
        process.exit(1);
    }
};

testDispatch();
