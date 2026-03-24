import axios from "axios";
import { clearAuthState, getAuthToken } from "./authStorage";

const API = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL || "https://intelliship.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if available
API.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      clearAuthState();
      if (window.location.pathname.startsWith("/dashboard")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

// Authentication APIs
export const signup = (data) => API.post("/api/auth/signup", data);
export const signin = (data) => API.post("/api/auth/signin", data);
export const verifyToken = () => API.get("/api/auth/verify");
export const logout = () => API.post("/api/auth/logout");

// Shipment APIs
export const createShipment = (data) => API.post("/api/shipments", data);
export const getShipment = (id) => API.get(`/api/shipments/${id}`);
export const getAllShipments = () => API.get("/api/shipments");
export const updateShipmentStatus = (shipmentId, data) =>
  API.patch(`/api/shipments/${shipmentId}/status`, data);
export const startMonitoring = (shipmentId) =>
  API.post(`/api/shipments/${shipmentId}/start-monitoring`);
export const trackShipmentSecure = (data) =>
  API.post("/api/shipments/track", data);

// Event APIs
export const getEvents = (shipmentId) => API.get(`/api/events/${shipmentId}`);
export const createEvent = (data) => API.post("/api/events", data);

// Analytics API
export const getAnalytics = () => API.get("/api/analytics");

// Logs API
export const addManualLog = (data) => API.post("/api/logs/manual", data);

// Complaints API
export const createComplaint = (data) => API.post("/api/complaints", data);

export default API;
