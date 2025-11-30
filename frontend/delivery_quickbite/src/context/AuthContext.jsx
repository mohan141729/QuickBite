import React, { createContext, useContext, useEffect } from "react"
import { useUser, useAuth as useClerkAuth } from "@clerk/clerk-react"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const { user: clerkUser, isLoaded } = useUser()
  const { signOut, getToken } = useClerkAuth()
  const [dbUser, setDbUser] = React.useState(null);

  // Sync user with backend on login
  useEffect(() => {
    const syncUser = async () => {
      if (isLoaded && clerkUser) {
        try {
          const token = await getToken();
          if (token) {
            // 1. Check if role exists, if not set it via backend
            if (!clerkUser.publicMetadata?.role) {
              console.log("🔧 Role missing, setting 'delivery_partner' role via backend...");
              const setRoleResponse = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5001"}/api/auth/set-role`, {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ role: 'delivery_partner' })
              });

              if (setRoleResponse.ok) {
                console.log("✅ Role set successfully");
                // We might need to reload or re-fetch user to get updated metadata, 
                // but for now let's proceed to sync
              } else {
                console.error("❌ Failed to set role:", await setRoleResponse.text());
              }
            }

            // 2. Sync with Backend
            const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5001"}/api/auth/sync`, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });

            if (response.ok) {
              const data = await response.json();
              console.log("✅ Delivery Partner synced with MongoDB:", data);
              setDbUser(data);
            } else {
              console.error("❌ Failed to sync user:", await response.text());
            }
          }
        } catch (err) {
          console.error("❌ Error syncing user:", err);
        }
      }
    };

    syncUser();
  }, [isLoaded, clerkUser, getToken]);

  const user = clerkUser ? {
    _id: dbUser?._id || clerkUser.id,
    clerkId: clerkUser.id,
    email: clerkUser.primaryEmailAddress?.emailAddress,
    name: clerkUser.fullName,
    role: clerkUser.publicMetadata?.role || 'delivery_partner',
    ...clerkUser.publicMetadata,
    ...dbUser // Merge DB user data (address, phone, etc.)
  } : null

  const contextValue = {
    user,
    loading: !isLoaded,
    logout: signOut,
    register: () => { throw new Error('Use Clerk SignUp component') },
    login: () => { throw new Error('Use Clerk SignIn component') },
    updateProfile: async (data) => {
      try {
        const token = await getToken();
        const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5001"}/api/delivery/profile`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });

        if (!res.ok) {
          throw new Error(await res.text());
        }

        return await res.json();
      } catch (error) {
        console.error("Update profile error:", error);
        throw error;
      }
    }
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext)
