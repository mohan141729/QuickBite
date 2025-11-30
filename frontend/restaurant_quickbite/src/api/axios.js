import axios from "axios";

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5001",
  withCredentials: true,
});

// Request interceptor to add Clerk auth token
api.interceptors.request.use(
  async (config) => {
    // Get Clerk session token
    const getToken = window.Clerk?.session?.getToken;

    if (getToken) {
      try {
        // Force token refresh to ensure we have the latest claims (roles)
        // This is critical after role updates
        const token = await getToken({ skipCache: true });
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error('Failed to get Clerk token:', error);
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
