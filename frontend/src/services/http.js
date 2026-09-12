import axios from "axios";

export const API_URL = (import.meta.env.VITE_API_URL || "https://tri-zvezdy-avto-maktab-production.up.railway.app").replace(/\/$/, "");
export const ADMIN_URL = `${API_URL}/admin/`;

const http = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

http.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      (Array.isArray(error.response?.data) ? "Xatolik yuz berdi" : null);
    error.friendlyMessage = message || "Server bilan bog'lanishda xatolik. Qayta urinib ko'ring.";
    return Promise.reject(error);
  }
);

export default http;
