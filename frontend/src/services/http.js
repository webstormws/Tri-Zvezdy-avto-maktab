import axios from "axios";

const http = axios.create({
  baseURL: "/api",
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
