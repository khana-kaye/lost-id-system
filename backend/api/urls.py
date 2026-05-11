from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import IDRecordViewSet
from . import views
from .views import login, create_user
from .views import bank_signup, bank_login
from .views import admin_dashboard
from .views import atm_reports


router = DefaultRouter()
router.register(r'ids', IDRecordViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path("login/", views.login),
    path("create-user/", create_user),
    path("nira/signup/", views.nira_signup),
    path("nira/login/", views.nira_login),
    path("bank/login/", views.bank_login),
    path("bank/signup/", views.bank_signup),
    path("uneb/login/", views.uneb_login),
    path("uneb/signup/", views.uneb_signup),
    path("admin/dashboard/", views.admin_dashboard),
    path("atm/reports/", views.atm_reports),
]


#pip install -r requirements.txt && python manage.py migrate