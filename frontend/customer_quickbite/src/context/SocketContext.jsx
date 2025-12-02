/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
};

export const SocketProvider = ({ children, user }) => {
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        // Only connect if user is logged in
        if (!user) {
            setSocket(null);
            setIsConnected(false);
            return;
        }

        // ✅ Initialize Socket.IO connection
        // Strip '/api' from the base URL if present, as Socket.IO usually mounts at root
        const baseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001').replace(/\/api\/?$/, '');
        const newSocket = io(baseUrl, {
            withCredentials: true,
        });

        // Connection events
        newSocket.on('connect', () => {
            setIsConnected(true);

            // Join user-specific room
            if (user && user._id) {
                newSocket.emit('join-user-room', user._id);
            }
        });

        newSocket.on('disconnect', () => {
            setIsConnected(false);
        });

        newSocket.on('connect_error', (error) => {
            console.error('🔴 WebSocket connection error:', error);
            setIsConnected(false);
        });

        setSocket(newSocket);

        // Cleanup on unmount or user change
        return () => {
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
