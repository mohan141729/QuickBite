// src/api/api.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5001",  // ✅ common base for all routes
  withCredentials: true,                 // enables cookie-based auth if used
});


export default api;
