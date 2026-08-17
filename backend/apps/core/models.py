"""Models for Tri Zvezdy Avto Maktab."""

from django.core.exceptions import ObjectDoesNotExist
from django.db import models


def course_image_path(instance, filename):
    return f"courses/{instance.slug if getattr(instance, 'slug', None) else 'course'}/{filename}"


def branch_image_path(instance, filename):
    return f"branches/{instance.slug}/{filename}"


def news_image_path(instance, filename):
    return f"news/{instance.slug}/{filename}"


def lesson_image_path(instance, filename):
    return f"lessons/{instance.slug}/{filename}"


def site_image_path(instance, filename):
    return f"site/{filename}"


class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Course(TimeStampedModel):
    """Haydovchilik kursi."""

    title = models.CharField("Kurs nomi", max_length=120)
    category = models.CharField("Toifa", max_length=5)
    short_description = models.CharField("Qisqa tavsif", max_length=255, blank=True)
    description = models.TextField("To'liq tavsif", blank=True)
    duration = models.CharField("Davomiylik", max_length=50, blank=True)
    price = models.DecimalField("Narx", max_digits=12, decimal_places=0, blank=True, null=True)
    image = models.ImageField("Rasm", upload_to=course_image_path, blank=True, null=True)
    order = models.PositiveIntegerField("Tartib", default=0)
    is_active = models.BooleanField("Faol", default=True)
    slug = models.SlugField(unique=True, max_length=150, blank=True)

    class Meta:
        verbose_name = "Kurs"
        verbose_name_plural = "Kurslar"
        ordering = ["order", "id"]

    def __str__(self):
        return f"{self.title} ({self.category})"


class Branch(TimeStampedModel):
    """Filial."""

    title = models.CharField("Filial nomi", max_length=120)
    address = models.CharField("Manzil", max_length=255)
    phone = models.CharField("Telefon", max_length=30)
    image = models.ImageField("Rasm", upload_to=branch_image_path, blank=True, null=True)
    map_link = models.URLField("Google Maps havola", blank=True)
    latitude = models.DecimalField("Kenglik", max_digits=10, decimal_places=7, null=True, blank=True)
    longitude = models.DecimalField("Uzunlik", max_digits=10, decimal_places=7, null=True, blank=True)
    order = models.PositiveIntegerField("Tartib", default=0)
    is_active = models.BooleanField("Faol", default=True)
    slug = models.SlugField(unique=True, max_length=150, blank=True)

    class Meta:
        verbose_name = "Filial"
        verbose_name_plural = "Filiallar"
        ordering = ["order", "id"]

    def __str__(self):
        return self.title


class News(TimeStampedModel):
    """Yangilik."""

    title = models.CharField("Sarlavha", max_length=200)
    content = models.TextField("To'liq matn")
    image = models.ImageField("Rasm", upload_to=news_image_path, blank=True, null=True)
    published_at = models.DateField("Chop etilgan sana", auto_now_add=False, null=True, blank=True)
    is_active = models.BooleanField("Faol", default=True)
    slug = models.SlugField(unique=True, max_length=200, blank=True)

    class Meta:
        verbose_name = "Yangilik"
        verbose_name_plural = "Yangiliklar"
        ordering = ["-published_at", "-id"]

    def __str__(self):
        return self.title


class Result(TimeStampedModel):
    """Natija / statistika."""

    title = models.CharField("Sarlavha", max_length=120)
    number = models.CharField("Raqam / ko'rsatkich", max_length=30)
    description = models.CharField("Tavsif", max_length=255)
    icon = models.CharField("Icon", max_length=50, blank=True, help_text="Bootstrap/lucide icon nomi")
    order = models.PositiveIntegerField("Tartib", default=0)
    is_active = models.BooleanField("Faol", default=True)

    class Meta:
        verbose_name = "Natija"
        verbose_name_plural = "Natijalar"
        ordering = ["order", "id"]

    def __str__(self):
        return f"{self.title} — {self.number}"


class Lesson(TimeStampedModel):
    """Mashg'ulot."""

    title = models.CharField("Mashg'ulot nomi", max_length=150)
    subtitle = models.CharField("Qisqa izoh", max_length=255, blank=True)
    description = models.TextField("To'liq ma'lumot", blank=True)
    icon = models.CharField("Icon", max_length=50, blank=True)
    image = models.ImageField("Rasm", upload_to=lesson_image_path, blank=True, null=True)
    order = models.PositiveIntegerField("Tartib", default=0)
    is_active = models.BooleanField("Faol", default=True)
    slug = models.SlugField(unique=True, max_length=150, blank=True)

    class Meta:
        verbose_name = "Mashg'ulot"
        verbose_name_plural = "Mashg'ulotlar"
        ordering = ["order", "id"]

    def __str__(self):
        return self.title


class Application(TimeStampedModel):
    """Kursga yozilish arizasi."""

    class Status(models.TextChoices):
        NEW = "new", "Yangi ariza"
        REVIEW = "review", "Ko'rib chiqilmoqda"
        CONTACTED = "contacted", "Bog'lanildi"
        ACCEPTED = "accepted", "Qabul qilindi"
        REJECTED = "rejected", "Rad etildi"

    first_name = models.CharField("Ism", max_length=100)
    last_name = models.CharField("Familiya", max_length=100, blank=True)
    phone = models.CharField("Telefon", max_length=30)
    course = models.ForeignKey(
        Course, on_delete=models.SET_NULL, verbose_name="Kurs", null=True, blank=True
    )
    branch = models.ForeignKey(
        Branch, on_delete=models.SET_NULL, verbose_name="Filial", null=True, blank=True
    )
    comment = models.TextField("Izoh", blank=True)
    status = models.CharField(
        "Holat", max_length=20, choices=Status.choices, default=Status.NEW
    )

    class Meta:
        verbose_name = "Ariza"
        verbose_name_plural = "Arizalar"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.first_name} {self.last_name} — {self.phone}"


class ContactMessage(TimeStampedModel):
    """Aloqa sahifasidagi xabar."""

    name = models.CharField("Ism", max_length=100)
    phone = models.CharField("Telefon", max_length=30)
    course = models.CharField("Qaysi kurs?", max_length=120, blank=True)
    message = models.TextField("Xabar")
    is_read = models.BooleanField("O'qilgan", default=False)

    class Meta:
        verbose_name = "Murojaat"
        verbose_name_plural = "Murojaatlar"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.name} — {self.phone}"


class SiteSettings(models.Model):
    """Sayt sozlamalari (singleton)."""

    site_name = models.CharField(max_length=120, default="Tri Zvezdy Avto Maktab")
    logo = models.ImageField("Logo", upload_to=site_image_path, blank=True, null=True)
    hero_subtitle = models.CharField("Hero subtitle", max_length=255, default="SIFATLI TA'LIM — XAVFSIZ HAYOT")
    hero_title = models.CharField("Hero title", max_length=255, default="TRI ZVEZDY AVTO MAKTAB")
    hero_description = models.TextField(
        "Hero matn",
        default="Eng sifatli darslar, tajribali o'qituvchilar va zamonaviy yondashuv bilan "
        "haydovchilikni oson va ishonchli o'rganing.",
    )
    phones = models.JSONField(
        "Telefonlar", default=list, blank=True, help_text='["990 077 170", "911 675 560"]'
    )
    work_hours = models.CharField(
        "Ish vaqti", max_length=120, default="Har kuni 09:00 — 18:00"
    )
    instagram = models.URLField("Instagram", blank=True)
    telegram = models.URLField("Telegram", blank=True)
    facebook = models.URLField("Facebook", blank=True)
    webstorm_name = models.CharField(max_length=60, default="WebStorm")
    webstorm_tagline = models.CharField(max_length=120, default="Zamonaviy web yechimlar va sifatli dasturlash xizmatlari")
    webstorm_link = models.URLField("WebStorm havola", default="https://webstorm.uz")
    webstorm_logo = models.ImageField("WebStorm logo", upload_to=site_image_path, blank=True, null=True)
    footer_description = models.TextField(
        "Footer tavsifi", default="Professional haydovchilik maktabi — sifatli ta'lim, tajribali ustozlar va zamonaviy yondashuv."
    )
    about_title = models.CharField("Biz haqimizda sarlavha", max_length=200, default="BIZ HAQIMIZDA")
    about_content = models.TextField(
        "Biz haqimizda matn",
        default="Tri Zvezdy Avto Maktab — zamonaviy, sifatli va ishonchli haydovchilik ta'limini taqdim etuvchi avtomaktab.",
    )

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def get_solo(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj

    def delete(self, *args, **kwargs):
        pass

    class Meta:
        verbose_name = "Sayt sozlamasi"
        verbose_name_plural = "Sayt sozlamalari"

    def __str__(self):
        return "Sayt sozlamalari"
