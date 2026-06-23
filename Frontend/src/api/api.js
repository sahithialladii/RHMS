import axios from "axios";

// const API_BASE = "http://127.0.0.1:8000"; // Flask backend
const API_BASE = "https://rhms-b9d9.onrender.com"; // Flask backend

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Auth APIs
export const registerUser = (userData) => api.post("/register", userData);
export const loginUser = (loginData) => api.post("/login", loginData);

// ✅ Patient APIs
export const uploadAudio = (formData, token) =>
  api.post("/upload_audio", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });

// ✅ Doctor APIs
export const getPatients = (token) =>
  api.get("/patients", {
    headers: { Authorization: `Bearer ${token}` },
  });

// ✅ Profile APIs
export const updateProfile = (role, data, token) =>
  api.post(`/update_${role}_profile`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export default api;
