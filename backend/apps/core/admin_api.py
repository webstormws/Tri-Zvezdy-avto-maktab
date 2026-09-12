"""Admin-only CRUD API for the React admin panel."""

from django.utils.text import slugify
from rest_framework import permissions, serializers, status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView

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


class IsStaffUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_staff)


class ImageUrlField(serializers.ImageField):
    def to_representation(self, value):
        if not value:
            return None
        url = value.url
        request = self.context.get("request")
        return request.build_absolute_uri(url) if request else url

    def to_internal_value(self, data):
        # Pillow cannot validate SVG files; allow them so admin SVG uploads work.
        name = (getattr(data, "name", "") or "").lower()
        if name.endswith(".svg"):
            return data
        return super().to_internal_value(data)


def _unique_slug(model, base, exclude_pk=None):
    slug = slugify(base) or "item"
    candidate = slug
    i = 1
    while True:
        qs = model.objects.filter(slug=candidate)
        if exclude_pk:
            qs = qs.exclude(pk=exclude_pk)
        if not qs.exists():
            return candidate
        candidate = f"{slug}-{i}"
        i += 1


class AdminCourseSerializer(serializers.ModelSerializer):
    image = ImageUrlField(required=False, allow_null=True)

    class Meta:
        model = Course
        fields = [
            "id",
            "title",
            "category",
            "short_description",
            "description",
            "duration",
            "price",
            "image",
            "order",
            "is_active",
            "slug",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["slug", "created_at", "updated_at"]

    def create(self, validated_data):
        if not validated_data.get("slug"):
            validated_data["slug"] = _unique_slug(Course, validated_data["title"])
        return super().create(validated_data)

    def update(self, instance, validated_data):
        if not validated_data.get("slug"):
            validated_data["slug"] = _unique_slug(Course, instance.title, instance.pk)
        return super().update(instance, validated_data)


class AdminBranchSerializer(serializers.ModelSerializer):
    image = ImageUrlField(required=False, allow_null=True)

    class Meta:
        model = Branch
        fields = [
            "id",
            "title",
            "address",
            "phone",
            "image",
            "map_link",
            "latitude",
            "longitude",
            "order",
            "is_active",
            "slug",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["slug", "created_at", "updated_at"]

    def create(self, validated_data):
        if not validated_data.get("slug"):
            validated_data["slug"] = _unique_slug(Branch, validated_data["title"])
        return super().create(validated_data)

    def update(self, instance, validated_data):
        if not validated_data.get("slug"):
            validated_data["slug"] = _unique_slug(Branch, instance.title, instance.pk)
        return super().update(instance, validated_data)


class AdminNewsSerializer(serializers.ModelSerializer):
    image = ImageUrlField(required=False, allow_null=True)

    class Meta:
        model = News
        fields = [
            "id",
            "title",
            "content",
            "image",
            "published_at",
            "is_active",
            "slug",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["slug", "created_at", "updated_at"]

    def create(self, validated_data):
        if not validated_data.get("slug"):
            validated_data["slug"] = _unique_slug(News, validated_data["title"])
        return super().create(validated_data)

    def update(self, instance, validated_data):
        if not validated_data.get("slug"):
            validated_data["slug"] = _unique_slug(News, instance.title, instance.pk)
        return super().update(instance, validated_data)


class AdminLessonSerializer(serializers.ModelSerializer):
    image = ImageUrlField(required=False, allow_null=True)

    class Meta:
        model = Lesson
        fields = [
            "id",
            "title",
            "subtitle",
            "description",
            "icon",
            "image",
            "order",
            "is_active",
            "slug",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["slug", "created_at", "updated_at"]

    def create(self, validated_data):
        if not validated_data.get("slug"):
            validated_data["slug"] = _unique_slug(Lesson, validated_data["title"])
        return super().create(validated_data)

    def update(self, instance, validated_data):
        if not validated_data.get("slug"):
            validated_data["slug"] = _unique_slug(Lesson, instance.title, instance.pk)
        return super().update(instance, validated_data)


class AdminResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = Result
        fields = ["id", "title", "number", "description", "icon", "order", "is_active", "created_at", "updated_at"]
        read_only_fields = ["created_at", "updated_at"]


class AdminApplicationSerializer(serializers.ModelSerializer):
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
            "updated_at",
        ]
        read_only_fields = ["created_at", "updated_at"]


class AdminContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ["id", "name", "phone", "course", "message", "is_read", "created_at"]
        read_only_fields = ["created_at"]


class AdminSiteSettingsSerializer(serializers.ModelSerializer):
    logo = ImageUrlField(required=False, allow_null=True)
    webstorm_logo = ImageUrlField(required=False, allow_null=True)

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


class AdminCourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = AdminCourseSerializer
    permission_classes = [IsStaffUser]
    pagination_class = None
    http_method_names = ["get", "post", "patch", "delete"]


class AdminBranchViewSet(viewsets.ModelViewSet):
    queryset = Branch.objects.all()
    serializer_class = AdminBranchSerializer
    permission_classes = [IsStaffUser]
    pagination_class = None
    http_method_names = ["get", "post", "patch", "delete"]


class AdminNewsViewSet(viewsets.ModelViewSet):
    queryset = News.objects.all()
    serializer_class = AdminNewsSerializer
    permission_classes = [IsStaffUser]
    pagination_class = None
    http_method_names = ["get", "post", "patch", "delete"]


class AdminLessonViewSet(viewsets.ModelViewSet):
    queryset = Lesson.objects.all()
    serializer_class = AdminLessonSerializer
    permission_classes = [IsStaffUser]
    pagination_class = None
    http_method_names = ["get", "post", "patch", "delete"]


class AdminResultViewSet(viewsets.ModelViewSet):
    queryset = Result.objects.all()
    serializer_class = AdminResultSerializer
    permission_classes = [IsStaffUser]
    pagination_class = None
    http_method_names = ["get", "post", "patch", "delete"]


class AdminApplicationViewSet(viewsets.ModelViewSet):
    queryset = Application.objects.all()
    serializer_class = AdminApplicationSerializer
    permission_classes = [IsStaffUser]
    pagination_class = None
    http_method_names = ["get", "patch", "delete"]


class AdminContactMessageViewSet(viewsets.ModelViewSet):
    queryset = ContactMessage.objects.all()
    serializer_class = AdminContactMessageSerializer
    permission_classes = [IsStaffUser]
    pagination_class = None
    http_method_names = ["get", "patch", "delete"]


class AdminSettingsView(APIView):
    permission_classes = [IsStaffUser]

    def get(self, request):
        settings = SiteSettings.get_solo()
        data = AdminSiteSettingsSerializer(settings, context={"request": request}).data
        return Response(data)

    def put(self, request):
        settings = SiteSettings.get_solo()
        serializer = AdminSiteSettingsSerializer(settings, data=request.data, context={"request": request})
        if serializer.is_valid():
            serializer.save()
            return Response(AdminSiteSettingsSerializer(settings, context={"request": request}).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request):
        return self.put(request)


class AdminStatsView(APIView):
    permission_classes = [IsStaffUser]

    def get(self, request):
        return Response(
            {
                "courses": Course.objects.count(),
                "branches": Branch.objects.count(),
                "news": News.objects.count(),
                "lessons": Lesson.objects.count(),
                "results": Result.objects.count(),
                "applications_total": Application.objects.count(),
                "applications_new": Application.objects.filter(status=Application.Status.NEW).count(),
                "contact_total": ContactMessage.objects.count(),
                "contact_unread": ContactMessage.objects.filter(is_read=False).count(),
                "recent_applications": AdminApplicationSerializer(
                    Application.objects.order_by("-created_at")[:5], many=True
                ).data,
                "recent_contact": AdminContactMessageSerializer(
                    ContactMessage.objects.order_by("-created_at")[:5], many=True
                ).data,
            }
        )
