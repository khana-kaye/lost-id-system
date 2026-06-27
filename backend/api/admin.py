from django.contrib import admin
from .models import ATMReport, AuditLog, FlaggedID
from .models import CriminalRecord

admin.site.register(CriminalRecord)

admin.site.register(ATMReport)
admin.site.register(AuditLog)
admin.site.register(FlaggedID)
