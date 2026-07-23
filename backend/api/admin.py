from django.contrib import admin
from .models import ATMReport, AuditLog, FlaggedID, IDRecord, Officer, BankStaff,NiraStaff, NiraStaffManager, FlaggedDocument, FlaggedPermit,DriverPermit,UDLSActivity, UDLSStaff, CriminalRecord


admin.site.register(ATMReport)
admin.site.register(AuditLog)
admin.site.register(FlaggedID)
admin.site.register(IDRecord)
admin.site.register(Officer )
admin.site.register(BankStaff)
admin.site.register(NiraStaff)
admin.site.register(FlaggedDocument)
admin.site.register(FlaggedPermit)
admin.site.register(DriverPermit)
admin.site.register(UDLSActivity)
admin.site.register(UDLSStaff)
admin.site.register(CriminalRecord)
