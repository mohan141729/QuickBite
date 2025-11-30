import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:5001";

const testTracking = async () => {
    console.log("🚀 Starting Tracking Test...");

    // Simulate Customer
    const customerSocket = io(SOCKET_URL);
    const customerId = "test-customer-123";

    // Simulate Driver
    const driverSocket = io(SOCKET_URL);

    // 1. Customer joins room
    customerSocket.on("connect", () => {
        console.log("👤 Customer connected");
        customerSocket.emit("join-user-room", customerId);
    });

    // 2. Listen for updates
    const locationPromise = new Promise((resolve, reject) => {
        customerSocket.on("driver-location-updated", (data) => {
            console.log("✅ Customer received location update:", data);
            if (data.location.lat === 12.9716 && data.location.lng === 77.5946) {
                resolve();
            } else {
                reject(new Error("Incorrect location data"));
            }
        });

        // Timeout if no event received
        setTimeout(() => reject(new Error("Timeout waiting for location update")), 5000);
    });

    // 3. Driver emits update
    driverSocket.on("connect", () => {
        console.log("🚴 Driver connected");

        // Wait a bit for customer to join room
        setTimeout(() => {
            console.log("📤 Driver sending location...");
            driverSocket.emit("update-location", {
                orderId: "order-123",
                customerId: customerId,
                location: { lat: 12.9716, lng: 77.5946 }
            });
        }, 1000);
    });

    try {
        await locationPromise;
        console.log("🎉 SUCCESS: Tracking flow verified!");
        process.exit(0);
    } catch (error) {
        console.error("❌ FAILURE:", error.message);
        process.exit(1);
    }
};

testTracking();
