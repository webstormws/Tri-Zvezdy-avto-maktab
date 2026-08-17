"""Seed initial data for Tri Zvezdy Avto Maktab."""

import os
from io import BytesIO

from django.core.files.base import ContentFile
from django.core.management.base import BaseCommand
from django.db import transaction

from apps.core.models import (
    Application,
    Branch,
    ContactMessage,
    Course,
    Lesson,
    News,
    Result,
    SiteSettings,
)

SVG_TEMPLATE = """<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#005B3A"/>
      <stop offset="1" stop-color="#087A4B"/>
    </linearGradient>
  </defs>
  <rect width="800" height="500" rx="24" fill="url(#g)"/>
  <circle cx="680" cy="80" r="120" fill="#ffffff" opacity="0.08"/>
  <circle cx="90" cy="430" r="150" fill="#ffffff" opacity="0.06"/>
  <g transform="translate(400,260)">
    {content}
  </g>
  <text x="400" y="452" font-family="Arial" font-size="26" font-weight="bold" fill="#ffffff" opacity="0.92" text-anchor="middle">{label}</text>
</svg>"""

CAR = """
  <g fill="none" stroke="#ffffff" stroke-width="10" stroke-linecap="round" stroke-linejoin="round">
    <path d="M-40,-75 C-70,-72 -95,-45 -95,-15 L-95,-5 C-105,-2 -112,6 -112,16 L-112,28 L-60,28 L-48,28 L48,28 L60,28 L112,28 L112,16 C112,6 105,-2 95,-5 L95,-15 C95,-45 70,-72 40,-75 Z" fill="#ffffff" stroke="none" opacity="0.95"/>
  </g>
  <rect x="-95" y="-22" width="190" height="26" rx="12" fill="#005B3A"/>
  <rect x="-70" y="-62" width="60" height="32" rx="8" fill="#005B3A"/>
  <rect x="10" y="-62" width="60" height="32" rx="8" fill="#005B3A"/>
  <circle cx="-55" cy="34" r="20" fill="#ffffff" stroke="#005B3A" stroke-width="8"/>
  <circle cx="55" cy="34" r="20" fill="#ffffff" stroke="#005B3A" stroke-width="8"/>
"""

TRUCK = """
  <rect x="-110" y="-52" width="140" height="80" rx="8" fill="#ffffff" opacity="0.95"/>
  <rect x="30" y="-52" width="80" height="80" rx="8" fill="#ffffff" opacity="0.75"/>
  <rect x="40" y="-40" width="60" height="40" rx="6" fill="#005B3A"/>
  <circle cx="-70" cy="34" r="20" fill="#ffffff" stroke="#005B3A" stroke-width="8"/>
  <circle cx="80" cy="34" r="20" fill="#ffffff" stroke="#005B3A" stroke-width="8"/>
"""

BUS = """
  <rect x="-130" y="-70" width="260" height="96" rx="18" fill="#ffffff" opacity="0.95"/>
  <rect x="-110" y="-58" width="70" height="40" rx="8" fill="#005B3A"/>
  <rect x="-30" y="-58" width="70" height="40" rx="8" fill="#005B3A"/>
  <rect x="50" y="-58" width="70" height="40" rx="8" fill="#005B3A"/>
  <circle cx="-80" cy="34" r="20" fill="#ffffff" stroke="#005B3A" stroke-width="8"/>
  <circle cx="80" cy="34" r="20" fill="#ffffff" stroke="#005B3A" stroke-width="8"/>
"""

TRAILER = """
  <rect x="-60" y="-48" width="90" height="76" rx="8" fill="#ffffff" opacity="0.9"/>
  <rect x="30" y="-52" width="90" height="80" rx="10" fill="#ffffff" opacity="0.75"/>
  <circle cx="-20" cy="36" r="18" fill="#ffffff" stroke="#005B3A" stroke-width="7"/>
  <circle cx="80" cy="36" r="18" fill="#ffffff" stroke="#005B3A" stroke-width="7"/>
"""

BUILDING = """
  <rect x="-90" y="-78" width="180" height="140" rx="10" fill="#ffffff" opacity="0.95"/>
  <rect x="-64" y="-54" width="34" height="30" rx="4" fill="#005B3A"/>
  <rect x="-16" y="-54" width="34" height="30" rx="4" fill="#005B3A"/>
  <rect x="32" y="-54" width="34" height="30" rx="4" fill="#005B3A"/>
  <rect x="-64" y="-10" width="34" height="30" rx="4" fill="#005B3A"/>
  <rect x="-16" y="-10" width="34" height="30" rx="4" fill="#005B3A"/>
  <rect x="32" y="-10" width="34" height="30" rx="4" fill="#005B3A"/>
  <rect x="-28" y="78" width="56" height="10" rx="4" fill="#005B3A"/>
  <path d="M-14,-78 L14,-92 L42,-78" fill="none" stroke="#ffffff" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
"""

BOOK = """
  <rect x="-70" y="-52" width="90" height="104" rx="10" fill="#ffffff" opacity="0.95"/>
  <rect x="20" y="-52" width="60" height="104" rx="10" fill="#ffffff" opacity="0.8"/>
  <line x1="-60" y1="-30" x2="20" y2="-30" stroke="#005B3A" stroke-width="8" stroke-linecap="round"/>
  <line x1="-60" y1="0" x2="20" y2="0" stroke="#005B3A" stroke-width="8" stroke-linecap="round"/>
  <line x1="-60" y1="30" x2="20" y2="30" stroke="#005B3A" stroke-width="8" stroke-linecap="round"/>
"""

ROAD = """
  <path d="M-120,0 L-30,-30 L30,30 L120,0" fill="none" stroke="#ffffff" stroke-width="14" stroke-linecap="round"/>
  <circle cx="0" cy="-16" r="16" fill="#ffffff"/>
  <rect x="-120" y="-8" width="240" height="16" rx="8" fill="#ffffff" opacity="0.35"/>
"""

HAND = """
  <path d="M-20,-80 C-30,-70 -30,-40 -20,-20 L-20,10 L-60,-10 C-70,-15 -80,-8 -78,2 C-76,12 -66,16 -56,12 L-8,-4 C-2,18 4,40 10,56 C16,72 30,80 44,76 L70,66 C80,62 84,50 78,40 L38,-38 C34,-48 24,-52 14,-48 L-20,-80 Z" fill="#ffffff" opacity="0.95"/>
"""

STEERING = """
  <circle cx="0" cy="0" r="58" fill="none" stroke="#ffffff" stroke-width="14"/>
  <circle cx="0" cy="-58" r="10" fill="#ffffff"/>
  <line x1="0" y1="-16" x2="0" y2="-30" stroke="#ffffff" stroke-width="14" stroke-linecap="round"/>
  <circle cx="0" cy="0" r="12" fill="#005B3A" stroke="#ffffff" stroke-width="6"/>
"""

TROPHY = """
  <path d="M-50,-70 L-20,-70 L-20,-40 C-20,-12 20,-12 20,-40 L20,-70 L50,-70 L50,-50 C50,-20 20,8 20,18 L20,40 L-20,40 L-20,18 C-20,8 -50,-20 -50,-50 Z" fill="#ffffff" opacity="0.95"/>
  <rect x="-60" y="40" width="120" height="12" rx="6" fill="#ffffff"/>
  <rect x="-20" y="52" width="40" height="26" rx="6" fill="#ffffff"/>
  <rect x="-8" y="78" width="16" height="24" rx="4" fill="#005B3A"/>
"""

# Map: (model, name, svg_content, label)
IMAGE_SETS = {
    "course": {
        "B": CAR,
        "C": TRUCK,
        "D": BUS,
        "E": TRAILER,
    },
    "branch": BUILDING,
    "news": None,
}

PHONES = ["990 077 170", "911 675 560", "944 888 879", "991 729 090"]


def make_svg(label, content):
    return SVG_TEMPLATE.format(content=content, label=label).encode("utf-8")


class Command(BaseCommand):
    help = "Boshlang'ich ma'lumotlarni yaratadi (kurslar, filiallar, yangiliklar va h.k.)"

    @transaction.atomic
    def handle(self, *args, **options):
        self._site_settings()
        self._courses()
        self._branches()
        self._results()
        self._lessons()
        self._news()
        self._superuser()
        self.stdout.write(self.style.SUCCESS("Seed tugallandi [OK]"))

    def _site_settings(self):
        SiteSettings.objects.all().delete()
        SiteSettings.get_solo()
        settings = SiteSettings.get_solo()
        settings.phones = PHONES
        settings.instagram = "https://instagram.com"
        settings.telegram = "https://t.me/trizvezdy"
        settings.facebook = "https://facebook.com"
        settings.save()
        self.stdout.write("  • Sayt sozlamalari")

    def _courses(self):
        Course.objects.all().delete()
        data = [
            {
                "title": "B Toifa",
                "category": "B",
                "short_description": "Yengil avtomobil",
                "duration": "3 oy",
                "price": 1500000,
                "slug": "b-toifa",
                "description": "B toifasi — yengil avtomobillarni boshqarish uchun eng ommabop kurs. "
                "Nazariy va amaliy darslar tajribali ustozlar tomonidan olib boriladi.",
            },
            {
                "title": "C Toifa",
                "category": "C",
                "short_description": "Yuk avtomobili",
                "duration": "3.5 oy",
                "price": 1800000,
                "slug": "c-toifa",
                "description": "C toifasi — yuk avtomobillarini boshqarish. Professional yo'l-transport harakati "
                "asoslaridan to amaliy mahoratgacha.",
            },
            {
                "title": "D Toifa",
                "category": "D",
                "short_description": "Avtobus",
                "duration": "4 oy",
                "price": 2000000,
                "slug": "d-toifa",
                "description": "D toifasi — avtobus boshqarish. Yo'lovchi tashish uchun to'liq tayyorgarlik.",
            },
            {
                "title": "E Toifa",
                "category": "E",
                "short_description": "Tirkama",
                "duration": "3 oy",
                "price": 1600000,
                "slug": "e-toifa",
                "description": "E toifasi — tirkama bilan haydash. Maxsus amaliy mashg'ulotlar.",
            },
        ]
        for item in data:
            course = Course.objects.create(**item)
            svg = IMAGE_SETS["course"][item["category"]]
            course.image.save(f"{course.slug}.svg", ContentFile(make_svg(item["title"], svg)), save=True)
        self.stdout.write("  • 4 ta kurs")

    def _branches(self):
        Branch.objects.all().delete()
        data = [
            {
                "title": "Izboskan Filiali",
                "address": "Izboskan tumani, Markaziy ko'cha",
                "phone": "990 077 170",
                "slug": "izboskan-filiali",
                "map_link": "https://maps.google.com/?q=Izboskan",
                "latitude": 40.6314,
                "longitude": 71.2726,
            },
            {
                "title": "Haqqulobod Filiali",
                "address": "Haqqulobod tumani",
                "phone": "911 675 560",
                "slug": "haqqulobod-filiali",
                "map_link": "https://maps.google.com/?q=Haqqulobod",
                "latitude": 40.7446,
                "longitude": 71.4130,
            },
            {
                "title": "To'rtko'l Filiali",
                "address": "To'rtko'l tumani",
                "phone": "944 888 879",
                "slug": "tortkol-filiali",
                "map_link": "https://maps.google.com/?q=To%27rtk%C7%ABl",
                "latitude": 40.8766,
                "longitude": 71.1049,
            },
        ]
        for item in data:
            branch = Branch.objects.create(**item)
            branch.image.save(f"{branch.slug}.svg", ContentFile(make_svg(item["title"], BUILDING)), save=True)
        self.stdout.write("  • 3 ta filial")

    def _results(self):
        Result.objects.all().delete()
        data = [
            {"title": "Muvaffaqiyatli bitiruvchilar", "number": "1000+", "description": "O'quvchilarimiz o'z haydovchilik guvohnomasini oldi", "icon": "GraduationCap", "order": 1},
            {"title": "Imtihondan o'tish", "number": "95%", "description": "Bir martada muvaffaqiyatli o'tish ko'rsatkichi", "icon": "Award", "order": 2},
            {"title": "Tajribali ustozlar", "number": "10+", "description": "Katta tajribaga ega o'qituvchilar", "icon": "Users", "order": 3},
            {"title": "Filiallar", "number": "3", "description": "Viloyat bo'ylab filiallarimiz", "icon": "MapPin", "order": 4},
        ]
        for item in data:
            Result.objects.create(**item)
        self.stdout.write("  • 4 ta natija")

    def _lessons(self):
        Lesson.objects.all().delete()
        data = [
            {"title": "Nazariy darslar", "subtitle": "Yo'l harakati qoidalari va bilimlar", "slug": "nazariy-darslar", "icon": "BookOpen", "description": "Yo'l harakati qoidalari, belgilar va haydovchi etikasi bo'yicha to'liq nazariy darslar.", "svg": BOOK, "order": 1},
            {"title": "Amaliy mashg'ulotlar", "subtitle": "Haqiqiy haydash amaliyoti", "slug": "amaliy-mashgulotlar", "icon": "Car", "description": "Zamonaviy avtomobillarda amaliy haydash ko'nikmalari.", "svg": ROAD, "order": 2},
            {"title": "Imtihon tayyorgarligi", "subtitle": "Muvaffaqiyatli imtihon uchun", "slug": "imtihon-tayyorgarligi", "icon": "ClipboardCheck", "description": "Yakuniy imtihonga maxsus tayyorgarlik dasturi.", "svg": TROPHY, "order": 3},
            {"title": "Yo'l harakati qoidalari", "subtitle": "Qoidalarni mukammal o'rganing", "slug": "yol-harakati-qoidalari", "icon": "Shield", "description": "Barcha yo'l harakati qoidalarini chuqur tahlil.", "svg": HAND, "order": 4},
            {"title": "Avtomobil boshqarish", "subtitle": "Boshqaruv sirlari", "slug": "avtomobil-boshqarish", "icon": "Settings2", "description": "Avtomobilni ishonchli va xavfsiz boshqarish.", "svg": STEERING, "order": 5},
        ]
        for item in data:
            svg = item.pop("svg")
            lesson = Lesson.objects.create(**item)
            lesson.image.save(f"{lesson.slug}.svg", ContentFile(make_svg(item["title"], svg)), save=True)
        self.stdout.write("  • 5 ta mashg'ulot")

    def _news(self):
        News.objects.all().delete()
        import datetime

        data = [
            {
                "title": "Yangi C toifa guruhi ochildi",
                "slug": "yangi-c-toifa-guruhi-ochildi",
                "content": "C toifasi bo'yicha yangi guruh ish boshladi. Xohlovchilar hoziroq yozilishlari mumkin. "
                "Guruhlar soni cheklangan, shoshiling! Yuk avtomobillarini boshqarish bo'yicha professional "
                "kursimizga barchani taklif qilamiz.",
                "published_at": datetime.date.today() - datetime.timedelta(days=2),
            },
            {
                "title": "Yo'l harakati xavfsizligi bo'yicha seminar",
                "slug": "yol-harakati-xavfsizligi-seminar",
                "content": "Avtomaktabimizda yo'l harakati xavfsizligi bo'yicha bepul seminar o'tkaziladi. "
                "Tajribali mutaxassislar yo'l xavfsizligi qoidalari haqida batafsil ma'lumot beradi. "
                "Barcha o'quvchilarimiz va tashrif buyuruvchilar taklif etiladi.",
                "published_at": datetime.date.today() - datetime.timedelta(days=7),
            },
            {
                "title": "B toifa kursiga qabul boshlandi",
                "slug": "b-toifa-kursiga-qabul-boshlandi",
                "content": "B toifasi bo'yicha yangi qabul boshlandi! Yengil avtomobil boshqarishni o'rganishni "
                "istagan barcha uchun qulay sharoitlar va moslashuvchan jadval. O'rinlar cheklangan, "
                "yozilishga shoshiling.",
                "published_at": datetime.date.today() - datetime.timedelta(days=14),
            },
        ]
        for item in data:
            news = News.objects.create(**item)
            news.image.save(f"{news.slug}.svg", ContentFile(make_svg(item["title"], HAND)), save=True)
        self.stdout.write("  • 3 ta yangilik")

    def _superuser(self):
        username = os.getenv("DJANGO_SUPERUSER_USERNAME", "admin")
        password = os.getenv("DJANGO_SUPERUSER_PASSWORD", "admin12345")
        email = os.getenv("DJANGO_SUPERUSER_EMAIL", "admin@trizvezdy.uz")
        from django.contrib.auth import get_user_model

        User = get_user_model()
        if not User.objects.filter(username=username).exists():
            User.objects.create_superuser(username=username, email=email, password=password)
            self.stdout.write(f"  • Superuser yaratildi: {username} / {password}")
