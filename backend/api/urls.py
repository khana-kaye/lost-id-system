from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import IDRecordViewSet
from . import views

router = DefaultRouter()
router.register(r'ids', IDRecordViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path("login/", views.login)
]