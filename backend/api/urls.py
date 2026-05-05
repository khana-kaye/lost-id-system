from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import IDRecordViewSet
from . import views
from .views import create_user

router = DefaultRouter()
router.register(r'ids', IDRecordViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path("login/", views.login),
    path("api/create-user/", views.create_user),
]