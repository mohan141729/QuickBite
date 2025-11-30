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
            const newSocket = io(import.meta.env.VITE_API_URL || "http://localhost:5001", {
                withCredentials: true,
            });

            setSocket(newSocket);

            newSocket.on("connect", () => {
                console.log("✅ Connected to socket server:", newSocket.id);
                // Join user room (for notifications)
                newSocket.emit("join-user-room", user._id); // Assuming delivery partner is also a user
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
