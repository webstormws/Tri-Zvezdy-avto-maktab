"""Django Admin for Tri Zvezdy Avto Maktab."""

from django.contrib import admin
from django.contrib.auth.models import Group, User
from django.utils.html import format_html

from .models import (
    Application,
    Branch,
    ContactMessage,
    Course,
    Lesson,
    News,
    Result,
    SiteSettings,
)

admin.site.unregister(User)
admin.site.unregister(Group)


class ThumbnailMixin:
    thumbnail_field = "image"

    def image_preview(self, obj):
        img = getattr(obj, self.thumbnail_field, None)
        if img and img.name:
            return format_html(
                '<img src="{}" style="max-height:48px;border-radius:8px;"/>', img.url
            )
        return "—"

    image_preview.short_description = "Rasm"


@admin.register(Course)
class CourseAdmin(ThumbnailMixin, admin.ModelAdmin):
    list_display = ("image_preview", "title", "category", "duration", "price", "order", "is_active")
    list_editable = ("order", "is_active")
    list_filter = ("category", "is_active")
    search_fields = ("title", "category", "short_description")
    prepopulated_fields = {"slug": ("title",)}
    fieldsets = (
        (None, {"fields": ("title", "category", "slug", "short_description", "description")}),
        ("Narx va davomiylik", {"fields": ("duration", "price")}),
        ("Rasm va holat", {"fields": ("image", "order", "is_active")}),
    )


@admin.register(Branch)
class BranchAdmin(ThumbnailMixin, admin.ModelAdmin):
    list_display = ("image_preview", "title", "address", "phone", "order", "is_active")
    list_editable = ("order", "is_active")
    search_fields = ("title", "address", "phone")
    prepopulated_fields = {"slug": ("title",)}


@admin.register(News)
class NewsAdmin(ThumbnailMixin, admin.ModelAdmin):
    list_display = ("image_preview", "title", "published_at", "is_active")
    list_editable = ("is_active",)
    list_filter = ("is_active", "published_at")
    search_fields = ("title", "content")
    prepopulated_fields = {"slug": ("title",)}
    date_hierarchy = "published_at"


@admin.register(Result)
class ResultAdmin(admin.ModelAdmin):
    list_display = ("title", "number", "description", "icon", "order", "is_active")
    list_editable = ("order", "is_active")
    search_fields = ("title", "description", "number")


@admin.register(Lesson)
class LessonAdmin(ThumbnailMixin, admin.ModelAdmin):
    list_display = ("image_preview", "title", "subtitle", "order", "is_active")
    list_editable = ("order", "is_active")
    search_fields = ("title", "subtitle", "description")
    prepopulated_fields = {"slug": ("title",)}


@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = ("id", "first_name", "last_name", "phone", "course", "branch", "status", "created_at")
    list_filter = ("status", "created_at")
    search_fields = ("first_name", "last_name", "phone", "comment")
    list_editable = ("status",)
    readonly_fields = ("created_at",)
    date_hierarchy = "created_at"
    list_per_page = 30


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "phone", "course", "is_read", "created_at")
    list_filter = ("is_read", "created_at")
    search_fields = ("name", "phone", "message")
    list_editable = ("is_read",)
    readonly_fields = ("created_at",)
    date_hierarchy = "created_at"
    list_per_page = 30


@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    fieldsets = (
        ("Asosiy", {"fields": ("site_name", "logo")}),
        ("Hero", {"fields": ("hero_subtitle", "hero_title", "hero_description")}),
        ("Aloqa va ijtimoiy tarmoqlar", {"fields": ("phones", "work_hours", "instagram", "telegram", "facebook")}),
        ("Biz haqimizda", {"fields": ("about_title", "about_content")}),
        ("Footer", {"fields": ("footer_description",)}),
        ("WebStorm reklamasi", {"fields": ("webstorm_name", "webstorm_tagline", "webstorm_link", "webstorm_logo")}),
    )

    def has_add_permission(self, request):
        return not SiteSettings.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False
