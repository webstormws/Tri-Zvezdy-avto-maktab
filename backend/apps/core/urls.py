from django.urls import include, path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .admin_api import (
    AdminApplicationViewSet,
    AdminBranchViewSet,
    AdminContactMessageViewSet,
    AdminCourseViewSet,
    AdminLessonViewSet,
    AdminNewsViewSet,
    AdminResultViewSet,
    AdminSettingsView,
    AdminStatsView,
)
from .views import (
    ApplicationCreateView,
    AuthLoginView,
    AuthMeView,
    AuthRegisterView,
    BranchListView,
    ContactMessageCreateView,
    CourseDetailView,
    CourseListView,
    HealthCheckView,
    LessonListView,
    NewsDetailView,
    NewsListView,
    ResultListView,
    SiteSettingsView,
)

admin_router = DefaultRouter()
admin_router.register("courses", AdminCourseViewSet, basename="admin-course")
admin_router.register("branches", AdminBranchViewSet, basename="admin-branch")
admin_router.register("news", AdminNewsViewSet, basename="admin-news")
admin_router.register("lessons", AdminLessonViewSet, basename="admin-lesson")
admin_router.register("results", AdminResultViewSet, basename="admin-result")
admin_router.register("applications", AdminApplicationViewSet, basename="admin-application")
admin_router.register("contact", AdminContactMessageViewSet, basename="admin-contact")

urlpatterns = [
    path("health/", HealthCheckView.as_view(), name="health"),
    path("settings/", SiteSettingsView.as_view(), name="settings"),
    path("courses/", CourseListView.as_view(), name="courses"),
    path("courses/<slug:slug>/", CourseDetailView.as_view(), name="course-detail"),
    path("branches/", BranchListView.as_view(), name="branches"),
    path("news/", NewsListView.as_view(), name="news"),
    path("news/<slug:slug>/", NewsDetailView.as_view(), name="news-detail"),
    path("results/", ResultListView.as_view(), name="results"),
    path("lessons/", LessonListView.as_view(), name="lessons"),
    path("applications/", ApplicationCreateView.as_view(), name="applications"),
    path("contact/", ContactMessageCreateView.as_view(), name="contact"),
    # Authentication
    path("auth/register/", AuthRegisterView.as_view(), name="auth-register"),
    path("auth/login/", AuthLoginView.as_view(), name="auth-login"),
    path("auth/me/", AuthMeView.as_view(), name="auth-me"),
    # JWT
    path("token/", TokenObtainPairView.as_view(), name="token-obtain"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token-refresh"),
    # Admin panel API
    path("admin/", include(admin_router.urls)),
    path("admin/settings/", AdminSettingsView.as_view(), name="admin-settings"),
    path("admin/stats/", AdminStatsView.as_view(), name="admin-stats"),
]
