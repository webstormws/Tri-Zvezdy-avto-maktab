import axios from "axios";
import http, { API_URL } from "./http";

export { API_URL };
export const ADMIN_URL = `${API_URL}/admin/`;

export const authHttp = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const unwrap = (res) => res.data;

export const api = {
  settings: () => http.get("/settings/").then(unwrap),
  courses: (page) => http.get("/courses/", { params: page ? { page } : {} }).then(unwrap),
  courseBySlug: (slug) => http.get(`/courses/${slug}/`).then(unwrap),
  branches: (page) => http.get("/branches/", { params: page ? { page } : {} }).then(unwrap),
  news: (page) => http.get("/news/", { params: page ? { page } : {} }).then(unwrap),
  newsBySlug: (slug) => http.get(`/news/${slug}/`).then(unwrap),
  results: () => http.get("/results/").then(unwrap),
  lessons: (page) => http.get("/lessons/", { params: page ? { page } : {} }).then(unwrap),
  createApplication: (data) => http.post("/applications/", data).then(unwrap),
  createContact: (data) => http.post("/contact/", data).then(unwrap),
};

export const auth = {
  login: (data) => authHttp.post("/api/auth/login/", data).then(unwrap),
  register: (data) => http.post("/auth/register/", data).then(unwrap),
  me: () => http.get("/auth/me/").then(unwrap),
};

export function formatPhoneTel(phone) {
  const digits = (phone || "").replace(/\D/g, "");
  if (digits.length === 9) return `tel:+998${digits}`;
  if (digits.length === 12) return `tel:+${digits}`;
  return `tel:+998${digits}`;
}

export function formatPrice(price) {
  if (price === null || price === undefined) return "Kelishilgan narx";
  return new Intl.NumberFormat("uz-UZ", {
    maximumFractionDigits: 0,
  })
    .format(price)
    .replace(/\u00A0/g, " ") + " so'm";
}

export function formatDate(dateString) {
  if (!dateString) return "";
  try {
    return new Intl.DateTimeFormat("uz-UZ", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(dateString));
  } catch {
    return dateString;
  }
}
