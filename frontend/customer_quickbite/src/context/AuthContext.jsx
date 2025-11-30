import React, { createContext, useContext, useEffect, useState } from "react"
import { useUser, useAuth as useClerkAuth } from "@clerk/clerk-react"
import { setGetToken } from "../api/api"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const { user: clerkUser, isLoaded } = useUser()
    const { signOut, getToken } = useClerkAuth()
    const [dbUser, setDbUser] = useState(null)
    const [loading, setLoading] = useState(true)

    // Initialize API token getter
    useEffect(() => {
        setGetToken(getToken);
    }, [getToken]);

    // Fetch user profile from backend
    const fetchUserProfile = async (token) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:5001"}/api/users/profile`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const userData = await response.json();
                setDbUser(userData);
                return userData;
            }
        } catch (err) {
            console.error("❌ Error fetching user profile:", err);
        }
        return null;
    };

    // Sync user with backend on login
    useEffect(() => {
        const syncUser = async () => {
            if (isLoaded && clerkUser) {
                try {
                    const token = await getToken();
                    if (token) {
                        // 1. Check if role exists, if not set it via backend
                        if (!clerkUser.publicMetadata?.role) {
                            console.log("🔧 Role missing, setting 'customer' role via backend...");
                            await fetch(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:5001"}/api/auth/set-role`, {
                                method: 'POST',
                                headers: {
                                    'Authorization': `Bearer ${token}`,
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({ role: 'customer' })
                            });
                        }

                        // 2. Sync user
                        const syncResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:5001"}/api/auth/sync`, {
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        });

                        if (syncResponse.ok) {
                            console.log("✅ User synced with MongoDB");
                            // Fetch user profile with addresses
                            await fetchUserProfile(token);
                        } else {
                            console.error("❌ Failed to sync user");
                        }
                    }
                } catch (err) {
                    console.error("❌ Error syncing user:", err);
                } finally {
                    setLoading(false);
                }
            } else if (isLoaded && !clerkUser) {
                setDbUser(null);
                setLoading(false);
            }
        };

        syncUser();
    }, [isLoaded, clerkUser, getToken]);

    // Update profile function for addresses
    const updateProfile = async (updates) => {
        try {
            const token = await getToken();
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:5001"}/api/profile`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updates)
            });

            if (response.ok) {
                const updatedUser = await response.json();
                setDbUser(updatedUser);
                return updatedUser;
            } else {
                throw new Error('Failed to update profile');
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            throw error;
        }
    };

    const contextValue = {
        user: clerkUser ? {
            _id: dbUser?._id,
            clerkId: clerkUser.id,
            email: clerkUser.primaryEmailAddress?.emailAddress,
            name: clerkUser.fullName,
            role: clerkUser.publicMetadata?.role,
            image: clerkUser.imageUrl,
            address: dbUser?.address || [],
            ...clerkUser.publicMetadata
        } : null,
        isSignedIn: !!clerkUser,
        loading: loading || !isLoaded,
        logout: signOut,
        updateProfile
    }

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext)
