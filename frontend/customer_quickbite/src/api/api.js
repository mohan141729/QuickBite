import axios from "axios"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5001",
  withCredentials: true,
})

let getTokenFn = null;

export const setGetToken = (fn) => {
  getTokenFn = fn;
};

// Request interceptor to add Clerk auth token
api.interceptors.request.use(
  async (config) => {
    if (getTokenFn) {
      try {
        const token = await getTokenFn();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error('Failed to get Clerk token:', error);
      }
    } else {
      // Fallback to window.Clerk if setGetToken hasn't been called yet (legacy/backup)
      const globalGetToken = window.Clerk?.session?.getToken;
      if (globalGetToken) {
        try {
          const token = await globalGetToken();
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (error) {
          console.error('Failed to get Clerk token from window:', error);
        }
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getRecommendedRestaurants = async () => {
  const response = await api.get("/api/recommendations/restaurants");
  return response.data;
};

export const getPopularItems = async () => {
  const response = await api.get("/api/recommendations/items");
  return response.data;
};

export default api;
