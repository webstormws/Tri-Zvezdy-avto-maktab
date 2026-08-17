"""API views for Tri Zvezdy Avto Maktab."""

from django.contrib.auth import authenticate, login as django_login
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404, redirect
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

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
from .serializers import (
    ApplicationSerializer,
    BranchSerializer,
    ContactMessageSerializer,
    CourseSerializer,
    LessonSerializer,
    NewsSerializer,
    ResultSerializer,
    SiteSettingsSerializer,
)


class CourseListView(generics.ListAPIView):
    queryset = Course.objects.filter(is_active=True)
    serializer_class = CourseSerializer


class CourseDetailView(generics.RetrieveAPIView):
    queryset = Course.objects.filter(is_active=True)
    serializer_class = CourseSerializer
    lookup_field = "slug"


class BranchListView(generics.ListAPIView):
    queryset = Branch.objects.filter(is_active=True)
    serializer_class = BranchSerializer


class NewsListView(generics.ListAPIView):
    queryset = News.objects.filter(is_active=True)
    serializer_class = NewsSerializer


class NewsDetailView(generics.RetrieveAPIView):
    queryset = News.objects.filter(is_active=True)
    serializer_class = NewsSerializer
    lookup_field = "slug"

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        other_news = (
            News.objects.filter(is_active=True)
            .exclude(pk=instance.pk)
            .order_by("-published_at", "-id")[:3]
        )
        data = NewsSerializer(instance, context=self.get_serializer_context()).data
        data["related_news"] = NewsSerializer(
            other_news, many=True, context=self.get_serializer_context()
        ).data
        return Response(data)


class ResultListView(generics.ListAPIView):
    queryset = Result.objects.filter(is_active=True)
    serializer_class = ResultSerializer


class LessonListView(generics.ListAPIView):
    queryset = Lesson.objects.filter(is_active=True)
    serializer_class = LessonSerializer


class ApplicationCreateView(generics.CreateAPIView):
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer
    permission_classes = []


class ContactMessageCreateView(generics.CreateAPIView):
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    permission_classes = []


class SiteSettingsView(APIView):
    permission_classes = []

    def get(self, request):
        settings = SiteSettings.get_solo()
        serializer = SiteSettingsSerializer(settings, context={"request": request})
        return Response(serializer.data)


class HealthCheckView(APIView):
    permission_classes = []

    def get(self, request):
        return Response({"status": "ok"})


# ---------------------------------------------------------------------------
# Authentication
# ---------------------------------------------------------------------------

def serialize_user(user):
    return {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "is_staff": user.is_staff,
        "is_superuser": user.is_superuser,
    }


class AuthRegisterView(APIView):
    permission_classes = []
    authentication_classes = []

    def post(self, request):
        username = (request.data.get("username") or "").strip()
        email = (request.data.get("email") or "").strip()
        password = request.data.get("password") or ""
        if not username or not password:
            return Response({"detail": "Username va parol talab qilinadi."}, status=status.HTTP_400_BAD_REQUEST)
        if len(password) < 6:
            return Response({"detail": "Parol kamida 6 ta belgidan iborat bo'lishi kerak."}, status=status.HTTP_400_BAD_REQUEST)
        User = get_user_model()
        if User.objects.filter(username=username).exists():
            return Response({"detail": "Bunday username allaqachon ro'yxatdan o'tgan."}, status=status.HTTP_400_BAD_REQUEST)
        user = User.objects.create_user(username=username, email=email, password=password)
        refresh = RefreshToken.for_user(user)
        return Response(
            {
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user": serialize_user(user),
            },
            status=status.HTTP_201_CREATED,
        )


class AuthLoginView(APIView):
    permission_classes = []
    authentication_classes = []

    def post(self, request):
        is_form = (request.content_type or "").startswith("application/x-www-form-urlencoded")
        username = (
            request.POST.get("username") if is_form else (request.data.get("username") or "")
        ).strip()
        password = request.POST.get("password") if is_form else (request.data.get("password") or "")
        if is_form:
            next_url = self._safe_redirect_target(request.POST.get("next"), "/")
            user = authenticate(username=username, password=password)
            if user is None:
                return redirect(self._with_error(next_url))
            django_login(request, user)
            if user.is_staff or user.is_superuser:
                return redirect("/admin/")
            return redirect(next_url)
        user = authenticate(username=username, password=password)
        if not user:
            return Response({"detail": "Login yoki parol noto'g'ri."}, status=status.HTTP_400_BAD_REQUEST)
        refresh = RefreshToken.for_user(user)
        data = {
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": serialize_user(user),
        }
        if user.is_staff or user.is_superuser:
            django_login(request, user)
        return Response(data)

    @staticmethod
    def _safe_redirect_target(value, default="/"):
        from urllib.parse import urlparse

        target = (value or "").strip()
        if not target:
            return default
        if target.startswith("/") and not target.startswith("//"):
            return target
        parts = urlparse(target)
        if parts.scheme in ("http", "https") and parts.netloc.replace(":80", "").replace(
            ":443", ""
        ) in ("localhost", "127.0.0.1"):
            return target
        return default

    @staticmethod
    def _with_error(url):
        from urllib.parse import urlencode, urlparse, urlunparse

        parts = urlparse(url)
        qs = urlencode({**{k: v for k, v in (p.split("=", 1) for p in parts.query.split("&") if p)}, "error": "1"})
        return urlunparse((parts.scheme, parts.netloc, parts.path, parts.params, qs, parts.fragment))


class AuthMeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(serialize_user(request.user))
