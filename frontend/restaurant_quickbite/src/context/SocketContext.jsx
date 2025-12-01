import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
};

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        // Only connect if user is logged in
        if (!user) {
            if (socket) {
                socket.disconnect();
                setSocket(null);
                setIsConnected(false);
            }
            return;
        }

        // ✅ Initialize Socket.IO connection
        const newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:5001', {
            withCredentials: true,
            transports: ['websocket', 'polling'],
        });

        // Connection events
        newSocket.on('connect', () => {
            console.log('✅ Connected to WebSocket server:', newSocket.id);
            setIsConnected(true);

            // Join restaurant-specific room - user.restaurant should be the restaurant ID
            if (user && user.restaurant) {
                newSocket.emit('join-restaurant-room', user.restaurant);
                console.log('🍽️ Joined restaurant room:', user.restaurant);
            }
        });

        newSocket.on('disconnect', () => {
            console.log('❌ Disconnected from WebSocket server');
            setIsConnected(false);
        });

        newSocket.on('connect_error', (error) => {
            console.error('🔴 WebSocket connection error:', error);
            setIsConnected(false);
        });

        setSocket(newSocket);

        // Cleanup on unmount or user change
        return () => {
            console.log('🧹 Cleaning up socket connection');
            newSocket.disconnect();
        };
    }, [user]);

    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketContext;
