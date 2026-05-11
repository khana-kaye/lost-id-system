from django.contrib import admin
from .models import ATMReport, AuditLog, FlaggedID

admin.site.register(ATMReport)
admin.site.register(AuditLog)
admin.site.register(FlaggedID)
