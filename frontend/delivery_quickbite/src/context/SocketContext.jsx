import React, { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext();

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            // Connect to backend
            // Strip '/api' from the base URL if present
            const baseUrl = (import.meta.env.VITE_API_URL || "http://localhost:5001").replace(/\/api\/?$/, '');
            const newSocket = io(baseUrl, {
                withCredentials: true,
            });

            setSocket(newSocket);

            newSocket.on("connect", () => {
                console.log("✅ Connected to socket server:", newSocket.id);
                // Join user room (for notifications)
                newSocket.emit("join-user-room", user._id); // Assuming delivery partner is also a user

                // ✅ Join delivery partners room for new order notifications
                newSocket.emit("join-delivery-room");
                console.log("🚚 Joined delivery-partners room");
            });

            return () => {
                newSocket.disconnect();
            };
        } else {
            if (socket) {
                socket.disconnect();
                setSocket(null);
            }
        }
    }, [user]);

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
};
