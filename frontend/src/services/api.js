import axios from "axios";
import { clearAuthState, getAuthToken } from "./authStorage";

// ✅ Correct env variable (Vercel uses this)
const BASE_URL = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");

if (!BASE_URL) {
  throw new Error("VITE_API_URL is required for API configuration");
}

// Create axios instance
const API = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // useful if cookies used later
});

// 🔐 Attach JWT token automatically
API.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ⚠️ Handle auth errors globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      clearAuthState();

      // Redirect only if protected route
      if (window.location.pathname.startsWith("/dashboard")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

// ================= AUTH =================
export const signup = (data) => API.post("/api/auth/signup", data);
export const signin = (data) => API.post("/api/auth/signin", data);
export const verifyToken = () => API.get("/api/auth/verify");
export const logout = () => API.post("/api/auth/logout");

// ================= SHIPMENTS =================
export const createShipment = (data) => API.post("/api/shipments", data);
export const getShipment = (id) => API.get(`/api/shipments/${id}`);
export const getAllShipments = () => API.get("/api/shipments");

export const updateShipmentStatus = (shipmentId, data) =>
  API.patch(`/api/shipments/${shipmentId}/status`, data);

export const markShipmentDelivered = (shipmentId, data = {}) =>
  API.patch(`/api/shipments/${shipmentId}/delivered`, data);

export const verifyShipmentSafe = (shipmentId) =>
  API.patch(`/api/shipments/${shipmentId}/verify-safe`);

export const verifyShipmentDamaged = (shipmentId) =>
  API.patch(`/api/shipments/${shipmentId}/verify-damaged`);

export const startMonitoring = (shipmentId) =>
  API.post(`/api/shipments/${shipmentId}/start-monitoring`);

export const trackShipmentSecure = (data) =>
  API.post("/api/shipments/track", data);

// ================= EVENTS =================
export const getEvents = (shipmentId) => API.get(`/api/events/${shipmentId}`);

export const createEvent = (data) => API.post("/api/events", data);

// ================= ANALYTICS =================
export const getAnalytics = () => API.get("/api/analytics");

// ================= LOGS =================
export const addManualLog = (data) => API.post("/api/logs/manual", data);

// ================= COMPLAINTS =================
export const createComplaint = (data) => API.post("/api/complaints", data);

export default API;
