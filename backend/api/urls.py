from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import IDRecordViewSet, update_udls_record_status
from . import views
from .views import bank_profile
# from .views import login, create_user
# from .views import bank_signup, bank_login
# from .views import admin_dashboard
# from .views import atm_reports
from .views import permit_search



router = DefaultRouter()
router.register(r'ids', IDRecordViewSet)

urlpatterns = [
    path('', include(router.urls)),
    
    path("login/", views.login),
    path("officer/<str:username>/", views.officer_profile),
    path("create-user/", views.create_user),
    path("nira/signup/", views.nira_signup),
    path("nira/login/", views.nira_login),
    path("bank/login/", views.bank_login),
    path("bank/signup/", views.bank_signup),
    path("admin/dashboard/", views.admin_dashboard),
    path("atm/reports/", views.atm_reports),
    path("atm/reports/<int:id>/toggle/", views.toggle_atm_report),
    path("atm/reports/<int:id>/rcard-toggle/", views.toggle_card_status),
    path("ids/flagged/", views.get_flagged_ids),
    path("settings/", views.officer_settings),
    path("audit-logs/", views.audit_logs),
    path("bank/audit-logs/", views.bank_audit_logs),
    path("bank/settings/", views.bank_settings),
    path("bank/profile/<str:staff_id>/",views.bank_profile),
    path("udls/dashboard/", views.udls_dashboard),
    path("udls/signup/", views.udls_signup),
    path("udls/login/", views.udls_login),
    path("nira/dashboard/", views.nira_dashboard),
    path("nira/records/", views.nira_all_records),
    path("nira/records/<int:pk>/", views.nira_record_detail),
    path("nira/flagged/", views.nira_flagged),
    path("nira/flagged/<int:pk>/", views.nira_review_flagged),
    path("nira/verify-id/", views.nira_verify_id), 
    path("nira/audit-logs/", views.nira_audit_logs), 

    path("permits/search/", views.permit_search),
    path("udls/driver-permit/", views.create_driver_permit),
    path("udls/records/", views.udls_records),
    path("udls/records/", views.udls_records),
    path("udls/audit-logs/", views.udls_audit_logs),
    path("udls/settings/", views.udls_settings),
    path("ids/<int:pk>/update-status/", views.update_record_status),
    path("nira/records/<int:pk>/update-status/", views.update_nira_record_status),
    path("udls/records/<int:pk>/update-status/",views.update_udls_record_status,name="update_udls_record_status") ,
    path("nira/<str:username>/", views.nira_profile),
    path("bank/<str:staff_id>/", views.bank_profile),
    path("udls/<str:username>/", views.udls_profile),
    

]


#pip install -r requirements.txt && python manage.py migrate