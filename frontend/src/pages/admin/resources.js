import {
  BookOpen,
  GraduationCap,
  MapPin,
  Newspaper,
  Trophy,
} from "lucide-react";

export const RESOURCES = {
  courses: {
    title: "Kurslar",
    icon: GraduationCap,
    endpoint: "/admin/courses/",
    search: "title",
    columns: [
      { key: "title", label: "Kurs nomi" },
      { key: "category", label: "Toifa" },
      { key: "duration", label: "Davomiylik" },
      { key: "price", label: "Narx", render: (v) => (v ? formatNum(v) : "—") },
      { key: "order", label: "Tartib" },
      { key: "is_active", label: "Faol", type: "badge" },
    ],
    fields: [
      { key: "title", label: "Kurs nomi", required: true },
      { key: "category", label: "Toifa", placeholder: "Masalan: B" },
      { key: "short_description", label: "Qisqa tavsif" },
      { key: "description", label: "To'liq tavsif", type: "textarea" },
      { key: "duration", label: "Davomiylik", placeholder: "Masalan: 2 oy" },
      { key: "price", label: "Narx (so'm)", type: "number" },
      { key: "image", label: "Rasm", type: "image" },
      { key: "order", label: "Tartib", type: "number", default: 0 },
      { key: "is_active", label: "Faol", type: "checkbox", default: true },
    ],
  },
  branches: {
    title: "Filiallar",
    icon: MapPin,
    endpoint: "/admin/branches/",
    search: "title",
    columns: [
      { key: "title", label: "Filial nomi" },
      { key: "address", label: "Manzil" },
      { key: "phone", label: "Telefon" },
      { key: "order", label: "Tartib" },
      { key: "is_active", label: "Faol", type: "badge" },
    ],
    fields: [
      { key: "title", label: "Filial nomi", required: true },
      { key: "address", label: "Manzil", required: true },
      { key: "phone", label: "Telefon", required: true },
      { key: "map_link", label: "Google Maps havola" },
      { key: "image", label: "Rasm", type: "image" },
      { key: "order", label: "Tartib", type: "number", default: 0 },
      { key: "is_active", label: "Faol", type: "checkbox", default: true },
    ],
  },
  news: {
    title: "Yangiliklar",
    icon: Newspaper,
    endpoint: "/admin/news/",
    search: "title",
    columns: [
      { key: "title", label: "Sarlavha" },
      { key: "published_at", label: "Sana", render: (v) => (v ? String(v).slice(0, 10) : "—") },
      { key: "is_active", label: "Faol", type: "badge" },
    ],
    fields: [
      { key: "title", label: "Sarlavha", required: true },
      { key: "content", label: "To'liq matn", type: "textarea", required: true },
      { key: "published_at", label: "Chop etilgan sana", type: "date" },
      { key: "image", label: "Rasm", type: "image" },
      { key: "is_active", label: "Faol", type: "checkbox", default: true },
    ],
  },
  lessons: {
    title: "Mashg'ulotlar",
    icon: BookOpen,
    endpoint: "/admin/lessons/",
    search: "title",
    columns: [
      { key: "title", label: "Mashg'ulot" },
      { key: "subtitle", label: "Izoh" },
      { key: "order", label: "Tartib" },
      { key: "is_active", label: "Faol", type: "badge" },
    ],
    fields: [
      { key: "title", label: "Mashg'ulot nomi", required: true },
      { key: "subtitle", label: "Qisqa izoh" },
      { key: "description", label: "To'liq ma'lumot", type: "textarea" },
      { key: "icon", label: "Icon", placeholder: "BookOpen" },
      { key: "image", label: "Rasm", type: "image" },
      { key: "order", label: "Tartib", type: "number", default: 0 },
      { key: "is_active", label: "Faol", type: "checkbox", default: true },
    ],
  },
  results: {
    title: "Natijalar",
    icon: Trophy,
    endpoint: "/admin/results/",
    search: "title",
    columns: [
      { key: "title", label: "Sarlavha" },
      { key: "number", label: "Ko'rsatkich" },
      { key: "order", label: "Tartib" },
      { key: "is_active", label: "Faol", type: "badge" },
    ],
    fields: [
      { key: "title", label: "Sarlavha", required: true },
      { key: "number", label: "Raqam / ko'rsatkich", required: true },
      { key: "description", label: "Tavsif" },
      { key: "icon", label: "Icon", placeholder: "GraduationCap" },
      { key: "order", label: "Tartib", type: "number", default: 0 },
      { key: "is_active", label: "Faol", type: "checkbox", default: true },
    ],
  },
};

function formatNum(v) {
  return new Intl.NumberFormat("uz-UZ").format(Number(v));
}
