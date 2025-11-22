import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5001",
  withCredentials: true,   // 🔥 THIS FIXES 404 (protect middleware)
});

export default api;
