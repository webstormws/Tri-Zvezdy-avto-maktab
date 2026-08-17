# Tri Zvezdy Avto Maktab — Full-Stack Website

Professional, responsive va to'liq ishlaydigan avtomaktab veb-sayti.

**Stack:** Django + Django REST Framework + PostgreSQL (production) / SQLite (local) • React (Vite) + Tailwind CSS + React Router + Axios + JWT

```
trizvezda/
├── backend/    # Django REST API + Admin panel
└── frontend/   # React (Vite) frontend
```

---

## Ishga tushirish (Local)

### 1. Backend

```bash
cd backend

# Virtual environment
python -m venv .venv
.venv\Scripts\activate        # Windows
# source .venv/bin/activate   # Linux/macOS

# Paketlar
pip install -r requirements.txt

# Migratsiya va boshlang'ich ma'lumotlar
python manage.py migrate
python manage.py seed_data

# Serverni ishga tushirish (8000-band boshqa loyiha ishlatsa 8001-ni tanlang)
python manage.py runserver 8001
```

> **Eslatma:** Frontend Vite proxy'si `8001`-portga sozlangan. Agar backendni boshqa portda ishga tushirsangiz, `frontend/vite.config.js` dagi `target` manzilni o'zgartiring.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Brauzerda oching: **http://localhost:5175**

### Admin panel

**http://localhost:8001/admin/**

```
Login: admin
Parol: admin12345
```

> Parolni `backend/.env` faylidagi `DJANGO_SUPERUSER_*` orqali o'zgartirish mumkin.

---

## Production: PostgreSQL ga o'tish

Localda SQLite ishlatiladi. Production uchun `.env` faylida `DATABASE_URL` ni o'rnating:

```bash
# backend/.env
DATABASE_URL=postgres://trizvezdy_user:trizvezdy_pass@127.0.0.1:5432/trizvezdy_db
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=your-domain.com
CORS_ALLOWED_ORIGINS=https://your-domain.com
```

Sozlamalar (`config/settings.py`) `DATABASE_URL` mavjud bo'lganda avtomatik PostgreSQL ni tanlaydi, aks holda SQLite.

Keyin:

```bash
python manage.py migrate
python manage.py seed_data
python manage.py collectstatic
```

---

## REST API

| Endpoint                | Tavsif                          |
|-------------------------|---------------------------------|
| `GET /api/settings/`    | Sayt sozlamalari (logo, telefonlar, social, WebStorm) |
| `GET /api/courses/`     | Barcha kurslar                  |
| `GET /api/courses/:slug/` | Bitta kurs                    |
| `GET /api/branches/`    | Barcha filiallar                |
| `GET /api/news/`        | Yangiliklar                     |
| `GET /api/news/:slug/`  | Yangilik + bog'liq yangiliklar  |
| `GET /api/results/`     | Natijalar (statistika)          |
| `GET /api/lessons/`     | Mashg'ulotlar                   |
| `POST /api/applications/` | Kursga yozilish arizasi       |
| `POST /api/contact/`    | Aloqa xabari                    |
| `POST /api/token/`      | JWT token                       |

---

## Admin orqali boshqarish

Django Admin (`/admin/`) orqali quyidagilar boshqariladi:

- **Courses** — kurs CRUD, narx, davomiylik, rasm yuklash
- **Branches** — filial CRUD, manzil, telefon, Google Maps havolasi, rasm
- **News** — yangilik CRUD + rasm yuklash
- **Results** — natijalar (title, number, description, icon)
- **Lessons** — mashg'ulotlar
- **Applications** — arizalar statusi: `Yangi → Ko'rib chiqilmoqda → Bog'lanildi → Qabul qilindi / Rad etildi`
- **Contact Messages** — aloqa murojaatlari
- **Site Settings** — logo, telefonlar, social tarmoqlar, hero matnlari, WebStorm reklamasi

Barcha o'zgarishlar React saytida avtomatik ko'rinadi.

---

## Texnologiyalar

**Backend:** Python, Django, Django REST Framework, JWT (SimpleJWT), PostgreSQL/SQLite, Pillow (media), CORS

**Frontend:** React 18, Vite, React Router, Axios, Tailwind CSS, lucide-react

**Xususiyatlar:** Responsive (320–1440px), sticky navbar, mobile menu, lazy loading, code splitting, loading skeleton, empty/error states, toast notifications, form validation, SEO meta, clickable `tel:` raqamlar.
