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

## Production: PostgreSQL ga o'tish (Railway)

Localda SQLite ishlatiladi. Railway'da **PostgreSQL** ishlatish uchun:

### 1. Railway'ga backend deploy

1. **Railway** → **New Project** → **Deploy from GitHub** → shu reponi tanlang.
2. **Settings** → **Root Directory** ga `backend` yozing.
3. **Variables** da quyidagilarni o'rnating:

   ```bash
   DJANGO_SECRET_KEY=<tasodifiy uzun matn>
   DJANGO_DEBUG=False
   DJANGO_ALLOWED_HOSTS=tri-zvezdy-avto-maktab-production.up.railway.app,trizvezdi.webstorm.uz
   ```

4. **PostgreSQL** plugin qo'shing — Railway uni avtomatik `DATABASE_URL` o'zgaruvchisiga yozadi (settings.py avtomatik PostgreSQL'ni tanlaydi).
5. `backend/Procfile` mavjud — deploy paytida **migrate + collectstatic + gunicorn** avtomatik ishlaydi.

> **Muhim:** 502/bo'sh sahifa kelsa — mijozlar soni va media fayllarni tekshiring. `seed_data` **faqat bir marta**, qo'lda ishga tushiring:
>
> ```bash
> railway run
> python manage.py seed_data
> ```

### 2. Frontend deploy (trizvezdi.webstorm.uz)

`frontend/.env` faylida:

```bash
VITE_API_URL=https://tri-zvezdy-avto-maktab-production.up.railway.app
```

So'ng qayta build qiling va `frontend/dist/` papkasini yuklang:

```bash
cd frontend
npm install
npm run build
```

- Frontend API so'rovlari va rasmlar to'g'ridan-to'g'ri Railway backend'ga yuradi (absolute URL).
- Admin panel: `VITE_API_URL/admin/` — ya'ni `https://tri-zvezdy-avto-maktab-production.up.railway.app/admin/`

### 3. Restart / qayta deploy

Railway'da dastlabki deploy'da o'rnatiladi, keyin har push'da avtomatik yangilanadi.

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
