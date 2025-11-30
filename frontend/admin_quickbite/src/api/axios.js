import axios from 'axios';

const api = axios.create({
    baseURL: (import.meta.env.VITE_API_URL || 'http://localhost:5001') + '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add Clerk auth token
api.interceptors.request.use(
    async (config) => {
        const getToken = window.Clerk?.session?.getToken;

        if (getToken) {
            try {
                const token = await getToken();
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
