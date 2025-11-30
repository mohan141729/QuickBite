import React, { createContext, useContext } from "react"
import { useUser, useAuth as useClerkAuth } from "@clerk/clerk-react"

const AuthContext = createContext()

/**
 * AuthProvider using Clerk authentication
 * Wraps Clerk's useUser and useAuth hooks to provide a consistent interface
 */
export const AuthProvider = ({ children }) => {
  const { user: clerkUser, isLoaded } = useUser()
  const { signOut, getToken } = useClerkAuth()

  // Sync user with backend on login
  React.useEffect(() => {
    const syncUser = async () => {
      if (isLoaded && clerkUser) {
        // Sync with Backend
        try {
          const token = await getToken();
          if (token) {
            // 1. Check if role exists, if not set it via backend
            if (!clerkUser.publicMetadata?.role) {
              console.log("🔧 Role missing, setting 'restaurant_owner' role via backend...");
              await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5001"}/api/auth/set-role`, {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ role: 'restaurant_owner' })
              });
            }

            // 2. Sync user
            const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5001"}/api/auth/sync`, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });

            if (response.ok) {
              const dbUser = await response.json();
              console.log("✅ Restaurant Owner synced with MongoDB:", dbUser);

              // If user doesn't have a role in Clerk but has one in DB, log it
              if (!clerkUser.publicMetadata?.role && dbUser.role) {
                console.log(`ℹ️ User role in DB: ${dbUser.role}`);
              }
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

  // Transform Clerk user to match existing app structure
  const user = clerkUser ? {
    _id: clerkUser.id,
    clerkId: clerkUser.id,
    email: clerkUser.primaryEmailAddress?.emailAddress,
    name: clerkUser.fullName || `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim(),
    role: clerkUser.publicMetadata?.role || 'customer',
    ...clerkUser.publicMetadata
  } : null

  const contextValue = {
    user,
    loading: !isLoaded,
    logout: signOut,
    // Legacy methods - no longer used with Clerk
    register: () => { throw new Error('Use Clerk SignUp component instead') },
    login: () => { throw new Error('Use Clerk SignIn component instead') },
    updateProfile: async (data) => {
      // Profile updates should be done through Clerk's user profile component
      console.warn('Profile updates should be done through Clerk UserProfile component')
      throw new Error('Use Clerk UserProfile component for profile updates')
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
