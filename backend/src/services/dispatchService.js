import DeliveryPartner from "../models/DeliveryPartner.js";
import Order from "../models/Order.js";
import Restaurant from "../models/Restaurant.js";

// ✅ Find nearest available delivery partner
export const findNearestPartner = async (restaurantLocation, maxDistanceKm = 10) => {
    try {
        // Ensure location has lat/lng
        if (!restaurantLocation || !restaurantLocation.lat || !restaurantLocation.lng) {
            console.error("❌ Invalid restaurant location for dispatch");
            return null;
        }

        const partners = await DeliveryPartner.find({
            isAvailable: true,
            status: "approved",
            currentOrder: null, // Must not have an active order
            currentLocation: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [restaurantLocation.lng, restaurantLocation.lat], // MongoDB uses [lng, lat]
                    },
                    $maxDistance: maxDistanceKm * 1000, // Convert km to meters
                },
            },
        }).limit(1); // Get the closest one

        return partners.length > 0 ? partners[0] : null;
    } catch (error) {
        console.error("❌ Error finding nearest partner:", error);
        return null;
    }
};

// ✅ Assign order to partner
export const assignOrderToPartner = async (orderId, partnerId) => {
    try {
        const order = await Order.findById(orderId);
        const partner = await DeliveryPartner.findById(partnerId);

        if (!order || !partner) {
            console.error("❌ Order or Partner not found during assignment");
            return false;
        }

        // Update Order
        order.deliveryPartner = partner._id;
        order.orderStatus = "accepted"; // Or keep as is, but usually assignment happens after acceptance
        await order.save();

        // Update Partner
        partner.currentOrder = order._id;
        partner.isAvailable = false;
        await partner.save();

        console.log(`✅ Assigned Order ${order._id} to Partner ${partner._id}`);

        // Notify Partner via Socket
        if (global.io && partner.user) {
            global.io.to(`user-${partner.user}`).emit("new-delivery-request", {
                orderId: order._id,
                restaurantName: "Restaurant", // You might want to populate this
                pickupLocation: order.pickupLocation,
                dropLocation: order.address.location,
                earnings: order.deliveryFee + order.surgeFee, // Example earnings logic
            });
        }

        return true;
    } catch (error) {
        console.error("❌ Error assigning order:", error);
        return false;
    }
};

// ✅ Main Dispatch Function
export const autoAssignOrder = async (orderId) => {
    try {
        console.log(`🔄 Attempting auto-dispatch for Order ${orderId}...`);

        const order = await Order.findById(orderId).populate("restaurant");
        if (!order) {
            console.error("❌ Order not found for dispatch");
            return false;
        }

        if (order.deliveryPartner) {
            console.log("⚠️ Order already has a partner assigned");
            return true;
        }

        // ✅ Use Restaurant Location
        let pickupCoords = {
            lat: order.restaurant.location.lat,
            lng: order.restaurant.location.lng
        };

        if (!pickupCoords.lat || !pickupCoords.lng) {
            console.warn("⚠️ Restaurant location missing coordinates, falling back to pickupLocation");
            pickupCoords = order.pickupLocation;
        }

        if (!pickupCoords || !pickupCoords.lat) {
            console.error("❌ No pickup coordinates found for dispatch");
            return false;
        }

        const nearestPartner = await findNearestPartner(pickupCoords);

        if (nearestPartner) {
            console.log(`📍 Found nearest partner: ${nearestPartner._id}`);
            return await assignOrderToPartner(order._id, nearestPartner._id);
        } else {
            console.warn("⚠️ No available partners found nearby");
            return false;
        }
    } catch (error) {
        console.error("❌ Auto-dispatch failed:", error);
        return false;
    }
};
