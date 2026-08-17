"""DRF serializers for Tri Zvezdy Avto Maktab."""

from rest_framework import serializers

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


def _abs_url(obj, field, request):
    file_field = getattr(obj, field, None)
    if not file_field or not file_field.name:
        return None
    url = file_field.url
    if request is not None:
        return request.build_absolute_uri(url)
    return url


class CourseSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    price = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = [
            "id",
            "title",
            "category",
            "slug",
            "short_description",
            "description",
            "duration",
            "price",
            "image",
            "order",
        ]

    def get_image(self, obj):
        return _abs_url(obj, "image", self.context.get("request"))

    def get_price(self, obj):
        if obj.price is None:
            return None
        return int(obj.price)


class BranchSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = Branch
        fields = ["id", "title", "slug", "address", "phone", "image", "map_link", "latitude", "longitude", "order"]

    def get_image(self, obj):
        return _abs_url(obj, "image", self.context.get("request"))


class NewsSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    short_content = serializers.SerializerMethodField()

    class Meta:
        model = News
        fields = [
            "id",
            "title",
            "slug",
            "content",
            "short_content",
            "image",
            "published_at",
        ]

    def get_image(self, obj):
        return _abs_url(obj, "image", self.context.get("request"))

    def get_short_content(self, obj):
        return obj.content[:180] if obj.content else ""


class ResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = Result
        fields = ["id", "title", "number", "description", "icon", "order"]


class LessonSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = Lesson
        fields = [
            "id",
            "title",
            "slug",
            "subtitle",
            "description",
            "icon",
            "image",
            "order",
        ]

    def get_image(self, obj):
        return _abs_url(obj, "image", self.context.get("request"))


class ApplicationSerializer(serializers.ModelSerializer):
    course_title = serializers.CharField(source="course.title", read_only=True, default="")
    branch_title = serializers.CharField(source="branch.title", read_only=True, default="")

    class Meta:
        model = Application
        fields = [
            "id",
            "first_name",
            "last_name",
            "phone",
            "course",
            "course_title",
            "branch",
            "branch_title",
            "comment",
            "status",
            "created_at",
        ]
        read_only_fields = ["status", "created_at"]


class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ["id", "name", "phone", "course", "message", "is_read", "created_at"]
        read_only_fields = ["is_read", "created_at"]


class SiteSettingsSerializer(serializers.ModelSerializer):
    logo = serializers.SerializerMethodField()
    webstorm_logo = serializers.SerializerMethodField()

    class Meta:
        model = SiteSettings
        fields = [
            "site_name",
            "logo",
            "hero_subtitle",
            "hero_title",
            "hero_description",
            "phones",
            "work_hours",
            "instagram",
            "telegram",
            "facebook",
            "webstorm_name",
            "webstorm_tagline",
            "webstorm_link",
            "webstorm_logo",
            "footer_description",
            "about_title",
            "about_content",
        ]

    def get_logo(self, obj):
        return _abs_url(obj, "logo", self.context.get("request"))

    def get_webstorm_logo(self, obj):
        return _abs_url(obj, "webstorm_logo", self.context.get("request"))
