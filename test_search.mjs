import axios from 'axios';
import { io } from 'socket.io-client';

const API_URL = 'http://localhost:5001';

async function testSearch() {
    console.log('🔍 Testing Search API...');
    try {
        // Test 1: Search with query
        const res = await axios.get(`${API_URL}/api/restaurants/search`, {
            params: { q: 'test' }
        });

        console.log('Response status:', res.status);
        if (res.data.restaurants && Array.isArray(res.data.restaurants)) {
            console.log('✅ Search API returned valid structure: { restaurants: [...] }');
            console.log('Restaurants found:', res.data.restaurants.length);
        } else if (Array.isArray(res.data)) {
            console.log('⚠️ Search API returned array (Old format?):', res.data.length);
        } else {
            console.error('❌ Unexpected response format:', Object.keys(res.data));
        }

    } catch (error) {
        console.error('❌ Search API failed:', error.message);
    }
}

async function testSocket() {
    console.log('\n🔌 Testing WebSocket Connection...');
    return new Promise((resolve) => {
        const socket = io(API_URL, {
            transports: ['websocket', 'polling']
        });

        socket.on('connect', () => {
            console.log('✅ WebSocket Connected!', socket.id);
            socket.disconnect();
            resolve();
        });

        socket.on('connect_error', (err) => {
            console.error('❌ WebSocket Connection Error:', err.message);
            resolve();
        });

        setTimeout(() => {
            if (!socket.connected) {
                console.error('❌ WebSocket Timeout');
                socket.disconnect();
                resolve();
            }
        }, 3000);
    });
}

async function run() {
    await testSearch();
    await testSocket();
}

run();
