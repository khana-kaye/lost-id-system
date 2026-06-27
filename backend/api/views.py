# views handles the API logic using django restframework
# It’s what actually handles requests like GET, POST, PUT, DELETE.
# An API (Application Programming Interface) is a way for different software systems to communicate with each other.

from django.http import JsonResponse
from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import viewsets
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter

from .serializers import IDRecordSerializer
from .models import ATMReport
from .serializers import ATMReportSerializer

from django.db.models import Q


from .models import BankStaff, NiraStaff, IDRecord, Officer, FlaggedID, AuditLog, DriverPermit, UDLSStaff
from django.contrib.auth.hashers import make_password, check_password

from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from django.db import IntegrityError
from django.db.models import Count
from .models import FlaggedID

from .models import DriverPermit
from .serializers import DriverPermitSerializer
from django.db import models as django_models

import re
import traceback

from django.contrib.auth.models import User
from .models import Officer, IDRecord
from .models import NiraStaff
from .models import BankStaff

from .models import CriminalRecord


#User = get_user_model()

def log_action(user="System", role=None, action="", target=None):

    AuditLog.objects.create(user=user, role=role, action=action, target=target)
 
# ID RECORDS
class IDRecordViewSet(viewsets.ModelViewSet):
    queryset = IDRecord.objects.all()
    serializer_class = IDRecordSerializer

    filter_backends = [SearchFilter]
    search_fields = ['name', 'id_number', 'status']


    def create(self, request, *args, **kwargs):
        data = request.data
        id_number = data.get("id_number")

        existing = IDRecord.objects.filter(id_number=id_number).first()

        if existing:
            existing.report_count += 1

            if existing.report_count == 2:
                existing.is_flagged = True
                existing.flag_reason = "Reported 2 or more times"

                FlaggedID.objects.get_or_create(
                    report=existing,
                    defaults={
                        "reason": "Repeated reports",
                        "severity": "low",
                        "status": "Under Review",
                        "report_count": existing.report_count
                    }
                    )

            existing.save()

             # ── audit ──
            log_action(
                action="ID report count updated"
                    + (" — flagged" if existing.is_flagged else ""),
                target=f"ID {id_number}"
            )
 
            return Response({
                "message": "ID updated",
                "flagged": existing.is_flagged
            })
 
        record = IDRecord.objects.create(**data, report_count=1)
 
        # ── audit ──
        log_action(action="New ID record created (ViewSet)", target=f"ID {id_number}")

        #     return Response({
        #         "message": "ID updated",
        #         "flagged": existing.is_flagged
        #     })

        # record = IDRecord.objects.create(**data, officer=data.get("officer"), report_count=1)

        return Response({
            "message": "Created",
            "flagged": False
        })


@api_view(["GET"])
def permit_search(request):
    search = request.GET.get("search", "").strip()
    queryset = DriverPermit.objects.all()

    if search:
        queryset = queryset.filter(
            Q(holder_name__icontains=search) |
            Q(license_number__icontains=search) |  
            Q(location_reported__icontains=search) |
            Q(status__icontains=search)
        )

    serializer = DriverPermitSerializer(queryset.order_by("-created_at"), many=True)
    return Response(serializer.data)


@api_view(["POST"])
def create_driver_permit(request):
    license_number = request.data.get("license_number", "").strip().upper()
    holder_name = request.data.get("holder_name", "").strip()
    location = request.data.get("location_reported", "").strip()
    reported_by = request.data.get("reported_by", "UDLS Staff").strip()

    if not license_number or not location:
        return Response({"message": "License number and location are required"}, status=400)

    permit, created = DriverPermit.objects.get_or_create(
        license_number=license_number,
        defaults={
            "holder_name": holder_name or "UNKNOWN",
            "location_reported": location,
            "reported_by": reported_by,
            "status": "Lost",
            "report_count": 1,
        }
    )

    if not created:
        permit.report_count += 1
        if permit.report_count >= 2:
            permit.is_flagged = True
        permit.save()

        # create or update FlaggedPermit record
        if permit.is_flagged:
            from .models import FlaggedPermit
            FlaggedPermit.objects.update_or_create(
                permit=permit,
                defaults={
                    "reason": "Reported multiple times",
                    "severity": "high" if permit.report_count >= 5 else "low",
                    "status": "Under Review",
                    "report_count": permit.report_count,
                }
            )

    log_action(
        user=reported_by,
        role="UDLS",
        action="Driver permit reported" + (" — flagged" if permit.is_flagged else ""),
        target=license_number
    )

    return Response({
        "message": "Driver permit saved" if created else "Permit report count updated",
        "flagged": permit.is_flagged,
        "report_count": permit.report_count,
        "created": created,
    }, status=201 if created else 200)

#officer signup
@api_view(["POST"])
def create_user(request):
    username = request.data.get("username")
    password = request.data.get("password")
    email = request.data.get("email")
    badge_id = request.data.get("badge_id")
    rank = request.data.get("rank")
    station = request.data.get("station")

    if not username or not password or not badge_id or not email:
        return Response({"message": "missing fields"}, status=400)

    if User.objects.filter(username=username).exists():
        return Response({"message": "User already exists"}, status=400)

    if Officer.objects.filter(badge_id=badge_id).exists():
        return Response({"message": "Badge ID already in use"}, status=400)

    user = User.objects.create_user(username=username, email=email, password=password)
    Officer.objects.create(
        user=username,
        #password=password,
        role="officer",
        badge_id=badge_id,
        rank=rank or "Officer",
        station=station or "Unknown",
    )

    # ── audit ──
    log_action(
        user=username,
        role="Officer",
        action="Officer account created",
        target=f"Badge {badge_id}"
    )
 
    return Response({"message": "Officer account created successfully"})

    

@api_view(["PATCH"])
def update_record_status(request, pk):
    try:
        record = IDRecord.objects.get(pk=pk)
    except IDRecord.DoesNotExist:
        return Response({"error": "Record not found"}, status=404)

    new_status = request.data.get("status")

    if new_status != "Resolved":
        return Response({"error": "Status can only be changed to Resolved"}, status=400)

    record.status = new_status
    record.save()

    log_action(
        user="Officer",
        role="officer",
        action="Record marked as Resolved",
        target=f"ID {record.id_number}"
    )

    return Response({"message": "Record resolved successfully", "status": record.status})

    
@api_view(["PATCH"])
def update_nira_record_status(request, pk):
    try:
        record = IDRecord.objects.get(pk=pk, id_type="National ID")
    except IDRecord.DoesNotExist:
        return Response({"error": "Record not found"}, status=404)

    new_status = request.data.get("status")

    if new_status != "Resolved":
        return Response({"error": "Status can only be changed to Resolved"}, status=400)

    record.status = new_status
    record.save()

    log_action(
        user="NIRA Staff",
        role="NIRA",
        action="Record marked as Resolved",
        target=f"ID {record.id_number}"
    )

    return Response({"message": "Record resolved successfully", "status": record.status})
    







@api_view(["GET"])
def nira_profile(request, username):
    try:
        staff = NiraStaff.objects.filter(username__iexact=username).first()

        if not staff:
            return Response({"message": "NIRA staff not found"}, status=404)

        return Response({
            "username": staff.username,
            "staff_id": staff.staff_id,
            "email": staff.email,
            "joined": staff.created_at.isoformat(),
            "role": "NIRA Staff",
        })

    except Exception as e:
        return Response({
            "message": "Server error",
            "error": str(e)
        }, status=500)


    #login police
@api_view(["POST"])
def login(request):
    username = request.data.get("username")
    password = request.data.get("password")

    user = authenticate(username=username, password=password)

    if user:
        try:

            officer = Officer.objects.get(
                user=username
            )

             # audit log
            log_action(
                user=username,
                role=officer.role,
                action="Officer logged in",
                target=f"Station: {officer.station}"
            )

        

            # return Response({
            #     "message": "Login successful",
            #     "username": user.username
            # })

            auth_user = User.objects.filter(username=username).first()
            return Response({
                    "message": "Login successful",
                    "username": user.username,
                    "role": officer.role, 
                    "staff_id": officer.badge_id,
                    "rank": officer.rank,
                    "station": officer.station,
                    "email": auth_user.email if auth_user else "",
                })
        except Officer.DoesNotExist:

            return Response({
                    "message": "Officer profile missing"
                }, status=404)
    return Response(
        {"message": "Invalid credentials"},
        status=400
    )
        


@api_view(["GET"])
def officer_profile(request, username):
    try:
        officer = Officer.objects.filter(user__iexact=username).first()

        if not officer:
            return Response({"message": "Officer not found"}, status=404)

        auth_user = User.objects.filter(username__iexact=username).first()

        reports_handled = IDRecord.objects.filter(officer=username).count()

        ids_recovered = IDRecord.objects.filter(
            officer=username,
            status="Found"
        ).count()

        flagged_cases = IDRecord.objects.filter(
            officer=username,
            is_flagged=True
        ).count()

        return Response({
            "name": officer.user,
            "service_number": officer.badge_id,
            "rank": officer.rank,
            "station": officer.station,
            "role": officer.role,
            "email": auth_user.email if auth_user else None,
            "phone": None,
            "joined": auth_user.date_joined.isoformat() if auth_user else None,
            "last_login": auth_user.last_login.isoformat() if auth_user and auth_user.last_login else None,
            "stats": {
                "reportsHandled": reports_handled,
                "idsRecovered": ids_recovered,
                "flaggedCases": flagged_cases,
                "forwardedCases": 0,
            },
        })

    except Exception as e:
        return Response({
            "message": "Server error",
            "error": str(e)
        }, status=500)
        

#nira signup
@api_view(["POST"])
def nira_signup(request):
    try:
        username = request.data.get("username")
        staff_id = request.data.get("staff_id")
        password = request.data.get("password")
        email = request.data.get("email") 


        if not username or not staff_id or not password or not email:
            return Response({"message": "Missing fields"}, status=400)

        # if NiraStaff.objects.filter(username=username).exists():
        #     return Response({"message": "User exists"}, status=400)

        NiraStaff.objects.create(
            username=username,
            staff_id=staff_id,
            email=email,
            password=make_password(password)
            
            )

    


        return Response({"message": "NIRA account created"})
    
    except IntegrityError as e:
        return Response({
            "message": "User already exists or duplicate field",
            "error": str(e)
        }, status=400)

    except Exception as e:
        print("NIRA ERROR:", e)
        return Response({"message": "Server error"}, status=500)


#nira login
@api_view(["POST"])
def nira_login(request):
    username = request.data.get("username")
    password = request.data.get("password")


    try:
        user = NiraStaff.objects.get(username=username)
        if check_password(password, user.password):
            return Response({"message": "Login success", "username": user.username})
        return Response({"message": "Invalid credentials"}, status=400)
    except NiraStaff.DoesNotExist:
        return Response({"message": "Invalid credentials"}, status=400)
       
    
   #bank signup
@api_view(["POST"])
def bank_signup(request):
    username = request.data.get("username", "").strip()
    staff_id = request.data.get("staff_id", "").strip()
    bank_name = request.data.get("bank_name", "").strip()
    branch = request.data.get("branch", "").strip()
    password = request.data.get("password", "")

    if not username or not staff_id or not password:
        return Response({"message": "Missing fields"}, status=400)

    if BankStaff.objects.filter(staff_id=staff_id).exists():
        return Response({"message": "Staff ID already exists"}, status=400)
    try:
        BankStaff.objects.create(
            username=username,
            staff_id=staff_id,
            bank_name=bank_name,
            branch=branch,
            password=make_password(password)
        )

        log_action(
            user=username,
            role="Bank Staff",
            action="Bank account created",
            target=f"{bank_name} — Staff ID {staff_id}"
        )

        return Response({
            "message": "Bank account created successfully"
        })

    except Exception as e:
        print("BANK SIGNUP ERROR:", e)
        return Response({"message": "Server error", "error": str(e)}, status=500)


    #bank login
@api_view(["POST"])
def bank_login(request):
    staff_id = request.data.get("staff_id", "").strip()
    password = request.data.get("password", "")

    
    if not staff_id or not password:
        return Response(
            {"message": "Staff ID and password required"},
            status=400
        )

    try:
        user = BankStaff.objects.get(staff_id=staff_id)

        if check_password(password, user.password):

            log_action(
                user=user.username,
                role="Bank Staff",
                action="Bank staff logged in",
                target=f"{user.bank_name} - {user.branch}"
            )
            return Response({
                "message": "Login successful",
                "staff_id": user.staff_id,
                "username": user.username,
                "bank_name": user.bank_name
            })
        return Response({"message": "Invalid password"}, status=400)

    except BankStaff.DoesNotExist:
        return Response({"message": "User not found"}, status=404)

    except Exception as e:
        print("BANK LOGIN ERROR:", e)
        return Response({
            "message": "Server error",
            "error": str(e)
        }, status=500)


   #uneb signup
@api_view(["POST"])
def uneb_signup(request):
    staff_id = request.data.get("staff_id")
    username = request.data.get("username")
    password = request.data.get("password")

    if not staff_id or not username or not password:
        return Response({"message": "Missing fields"}, status=400)

    if UnebStaff.objects.filter(staff_id=staff_id).exists():
        return Response({"message": "Staff already exists"}, status=400)

    UnebStaff.objects.create(
        staff_id=staff_id,
        username=username,
        password=make_password(password)
    )

    return Response({"message": "UNEB account created"})


    #uneb login
@api_view(["POST"])
def uneb_login(request):
    staff_id = request.data.get("staff_id")
    password = request.data.get("password")

    if not staff_id or not password:
        return Response({"message": "Missing fields"}, status=400)

    try:
        user = UnebStaff.objects.get(staff_id=staff_id)

        if check_password(password, user.password):
            return Response({
                "message": "Login successful",
                "staff_id": user.staff_id,
                "username": user.username
            })

        return Response({"message": "Invalid credentials"}, status=400)

    except UnebStaff.DoesNotExist:
        return Response({"message": "User not found"}, status=404)





#GET
@api_view(["GET"])
def admin_dashboard(request):

    total_reports = IDRecord.objects.count()

    total_ids = IDRecord.objects.filter(id_type__iexact="National ID").count()#

    # total_atms = ATMReport.objects.count()
    total_atms = IDRecord.objects.filter(id_type__icontains="atm").count()

    pending_atms = ATMReport.objects.filter(status__iexact="Pending").count()
    frozen_atms = ATMReport.objects.filter(card_status__iexact="Frozen").count()
    #total_atms = IDRecord.objects.filter(id_type__iexact="ATM Card").count()
    total_driver_permits = IDRecord.objects.filter(id_type__iexact="Driver Permit").count()

    ids_found = IDRecord.objects.filter(status__iexact="Found").count()
    open_cases = IDRecord.objects.filter(status__iexact="Lost").count()

    recent_reports_qs = IDRecord.objects.order_by("-created_at")[:5]

    recent_data = [
        {
            "name": r.name,
            "type": r.id_type,
            "status": r.status.strip().lower() if r.status else "unknown"
        }
        for r in recent_reports_qs
    ]

    return Response({
        "stats": {
            "total_reports": total_reports,
            "total_ids": total_ids,
            "total_atms": total_atms,
            "total_driver_permits": total_driver_permits,
            "ids_found": ids_found,
            "open_cases": open_cases,

            "pending_atms": pending_atms,
        "frozen_atms": frozen_atms,


        },
        "recent_reports": recent_data
    })

    

# def create_report(request):
#     if request.method == "POST":
#         data = request.POST

#         nin = data.get("nin")
#         owner = data.get("owner")

#         # 1. Save report first
#         report = IDRecord.objects.create(
#             id_number=nin,
#             name=owner,
#             )

#         # 2. AUTO-FLAG LOGIC (START SIMPLE)
#         duplicate_count = IDRecord.objects.filter(id_number=nin).count()

#         if duplicate_count > 1:
#             FlaggedID.objects.create(
#                 report=report,
#                 reason="Duplicate submissions detected",
#                 severity="high",
#                 status="Under Review"
#             )

#         return JsonResponse({"message": "Report created"})


def create_report(request):
    if request.method == "POST":
        data = request.POST

        nin = data.get("nin")
        owner = data.get("owner")

        # 1. Save report
        report = IDRecord.objects.create(
            id_number=nin,
            name=owner,
        )

        # 2. RULE 1: Duplicate detection
        duplicate_count = IDRecord.objects.filter(id_number=nin).count()

        if duplicate_count > 1:
            FlaggedDocument.objects.create(
                document_type="National ID",
                document_number=nin,
                related_report=report,
                reason="Duplicate submissions detected",
                severity="high",
                status="Under Review"
            )

        # 3. RULE 2: CHECK WATCHLIST (NEW IMPORTANT PART)
        flagged_match = FlaggedDocument.objects.filter(
            document_number=nin,
            status="Active"
        ).first()

        if flagged_match:
            return JsonResponse({
                "message": "Report created",
                "alert": "This document is under investigation",
                "reason": flagged_match.reason
            })

        return JsonResponse({"message": "Report created successfully"})


def get_flagged_ids(request):
    flagged = FlaggedID.objects.select_related("report").all()

    data = []

    for f in flagged:
        data.append({
            "id": f.id,
            "owner": f.report.name,
            "id_number": f.report.id_number,
            "reason": f.reason,
            "severity": f.severity,
            "status": f.status,
            "report_count": f.report.report_count,
        })

    return JsonResponse(data, safe=False)

# @api_view(['POST'])
# def create_id(request):
#     data = request.data
#     nin = data.get("id_number")

#     existing = IDRecord.objects.filter(nin=nin).first()

#     if existing:
#         # AUTO FLAG RULE
#         existing.is_flagged = True
#         existing.flag_reason = "Duplicate NIN submission"
#         existing.save()

#         return Response({
#             "message": "ID already exists and has been flagged",
#             "flagged": True
#         }, status=200)

#     record = IDRecord.objects.create(
#         name=data.get("name"),
#         nin=nin,
#         id_type=data.get("id_type"),
#         status=data.get("status", "Lost"),
#         location_found=data.get("location_found"),
#     )

#     return Response({
#         "message": "New ID recorded successfully",
#         "flagged": False
#     }, status=201)  


@api_view(["GET"])
def flagged_ids_list(request):
    """Returns all IDs reported 2+ times (for police flagged page)"""
    flagged = FlaggedID.objects.select_related("report").order_by("-id")
    data = [
        {
            "id": f.id,
            "owner": f.report.name,
            "id_number": f.report.id_number,
            "reason": f.reason,
            "severity": f.severity,
            "status": f.status,
            "report_count": f.report.report_count,
            "station": f.report.location_found,
        }
        for f in flagged
    ]
    return Response(data)


@api_view(["GET"])
def criminal_id_search(request):
    """Search IDRecords that belong to known criminals"""
    search = request.GET.get("search", "").strip()

    # Get all criminal NINs/IDs
    criminal_ids = CriminalRecord.objects.values_list("id_number", flat=True)

    # Match against IDRecord
    queryset = IDRecord.objects.filter(id_number__in=criminal_ids)

    if search:
        queryset = queryset.filter(
            Q(name__icontains=search) |
            Q(id_number__icontains=search)
        )

    results = []
    for record in queryset.order_by("-created_at"):
        # Pull the criminal details too
        criminal = CriminalRecord.objects.filter(
            id_number=record.id_number
        ).first()
        results.append({
            "id": record.id,
            "name": record.name,
            "id_number": record.id_number,
            "id_type": record.id_type,
            "status": record.status,
            "location_found": record.location_found,
            "is_flagged": record.is_flagged,
            "report_count": record.report_count,
            "criminal_status": criminal.status if criminal else "Unknown",
            "crime": criminal.crime if criminal else "N/A",
        })

    return Response(results)


@api_view(['POST'])
def create_id(request):
    data = request.data
    id_number = data.get("id_number", "").upper().strip()

    if not re.match(r'^(CM|CF)[A-Za-z0-9]{12}$', id_number):
        return Response(
            {
                "message": "Invalid ID number. Must start with CM or CF followed by 12 letters or numbers."
            },
            status=400
        )

    existing = IDRecord.objects.filter(id_number=id_number).first()

    # CASE 1: ID already exists → increase report count
    if existing:
        existing.report_count += 1

        

        # flag only when threshold reached
        if existing.report_count >= 2 and not existing.is_flagged:
            existing.is_flagged = True
            existing.flag_reason = "Reported multiple times"
        existing.save()

            # CREATE OR UPDATE flagged record
        if existing.is_flagged:
            FlaggedID.objects.update_or_create(
                report=existing,
                defaults={
                    "reason": existing.flag_reason,
                    "severity": "critical" if existing.report_count >= 5 else "low",
                    "status": "Under Review",
                    "report_count": existing.report_count
            }
        )

        log_action(
            action="ID report count updated" + (" — flagged" if existing.is_flagged else ""),
            target=f"ID {id_number}"
        )

        return Response({
            "message": "ID report updated",
            "report_count": existing.report_count,
            "flagged": existing.is_flagged
        })

    # CASE 2: First time report
    record = IDRecord.objects.create(
        name=data.get("name"),
        officer=data.get("officer"),
        id_number=id_number,
        id_type=data.get("id_type"),
        status=data.get("status", "Lost"),
        location_found=data.get("location_found"),
        report_count=1,
        is_flagged=False
    )

    log_action(action="New ID record created", target=f"ID {id_number}")

    return Response({
        "message": "New ID recorded successfully",
        "report_count": 1,
        "flagged": False
    }, status=201)
            # flagged, created =FlaggedID.objects.update_or_create(
            #     report=existing,
            #     defaults={
            #         "reason": existing.flag_reason,
            #         "severity": "critical" if existing.report_count >= 5 else "low",
            #         "status": "Under Review",
            #         "report_count": existing.report_count
            #     }
            # )
    #     else:
    #         # if already flagged, just sync count
    #         FlaggedID.objects.filter(report=existing).update(
    #             report_count=existing.report_count
    #         )

    #         return Response({
    #         "message": "ID report updated",
    #         "report_count": existing.report_count,
    #         "flagged": existing.is_flagged
    #     })

    # # CASE 2: first time report
    # record = IDRecord.objects.create(
    #     name=data.get("name"),
    #     officer=data.get("officer"),
    #     id_number=id_number,
    #     id_type=data.get("id_type"),
    #     status=data.get("status", "Lost"),
    #     location_found=data.get("location_found"),
    #     report_count=1,
    #     is_flagged=False
    # )

    # return Response({
    #     "message": "New ID recorded successfully",
    #     "report_count": 1,
    #     "flagged": False
    # }, status=201)

@api_view(["PATCH"])
def update_udls_record_status(request, pk):
    try:
        record = IDRecord.objects.get(pk=pk, id_type="Driver Permit")
    except IDRecord.DoesNotExist:
        return Response({"error": "Record not found"}, status=404)

    new_status = request.data.get("status")

    if new_status != "Resolved":
        return Response(
            {"error": "Status can only be changed to Resolved"},
            status=400
        )

    record.status = new_status
    record.save()

    return Response({
        "message": "Record resolved successfully",
        "status": record.status
    })



@api_view(["GET", "POST"])
def atm_reports(request):

    if request.method == "GET":

        reports = ATMReport.objects.all().order_by(
            "-reported_at"
        )

        serializer = ATMReportSerializer(
            reports,
            many=True
        )

        return Response(serializer.data)

    elif request.method == "POST":

        serializer = ATMReportSerializer(
            data=request.data
        )

        if serializer.is_valid():

            #serializer.save()
            report = serializer.save()

            IDRecord.objects.create(
                name=report.card_holder,
                #name=report.account_name if hasattr(report, "account_name") else "ATM User",
                id_number=report.account_number,
                id_type="ATM Card",
                status="Lost",
                location_found="Bank Report",
                report_count=1
            )

            # AUTO-FREEZE WHEN CREATED
            report.card_status = "Frozen"
            report.status = "Pending"
            report.save()

            return Response(
                serializer.data,
                status=201
            )

        return Response(
            serializer.errors,
            status=400
        )


@api_view(["PATCH"])
def toggle_atm_report(request, id):

    try:
        report = ATMReport.objects.get(id=id)

        action = request.data.get("action")

        if action == "freeze":
            report.status = "Pending"
            report.card_status = "Frozen"

            log_action(
                user="Bank Staff",
                role="Bank",
                action="ATM card frozen",
                target=report.account_number
            )

        elif action == "resolve":
            report.status = "Resolved"
            report.card_status = "Active"

            log_action(
                user="Bank Staff",
                role="Bank",
                action="ATM case resolved",
                target=report.account_number
            )

        report.save()

        # resolve case
        #report.status = "Resolved"

        # automatically unfreeze ATM
        #report.card_status = "Active"

        #report.save()

        return Response({
            "message": "Report status updated",
            "status": report.status,
            "card_status": report.card_status,
    
        })

    except ATMReport.DoesNotExist:

        return Response(
            {"error": "Report not found"},
            status=404
        )


@api_view(["PATCH"])
def toggle_card_status(request, id):

    try:

        report = ATMReport.objects.get(id=id)

        if report.card_status == "Frozen":
            report.card_status = "Active"

        else:
            report.card_status = "Frozen"

        report.save()

        return Response({
            "message": "Card status updated",
            "card_status": report.card_status
        })

    except ATMReport.DoesNotExist:

        return Response(
            {"error": "Report not found"},
            status=404
        )



@api_view(["GET", "PUT"])
def officer_settings(request):

    # ── GET CURRENT USER SETTINGS ─────────────────────
    if request.method == "GET":

        badge_id = request.GET.get("staff_id")

        if not badge_id:
            return Response(
                {"error": "Staff ID is required"},
                status=400
            )

        # try:
        #     officer = Officer.objects.get(
        #         badge_id=badge_id
        #     )

        #     return Response({
        #         "username": officer.user,
        #         "email": "",
        #         "staff_id": officer.badge_id,
        #         "rank": officer.rank,
        #         "station": officer.station,
        #     })
        try:
            officer = Officer.objects.get(
                badge_id=badge_id
            )

            # fetch django auth user
            auth_user = User.objects.filter(
                username=officer.user
            ).first()

            return Response({
                "username": officer.user,
                "email": auth_user.email if auth_user else "",
                "staff_id": officer.badge_id,
                "rank": officer.rank,
                "station": officer.station,
            })

        except Officer.DoesNotExist:

            return Response(
                {"error": "Officer not found"},
                status=404
            )

    # ── UPDATE SETTINGS ───────────────────────────────
    elif request.method == "PUT":

        data = request.data

        badge_id = data.get("staff_id")

        if not badge_id:
            return Response(
                {"error": "Staff ID required"},
                status=400
            )

        try:

            officer = Officer.objects.get(
                badge_id=badge_id
            )

            # update officer table
            # store old username BEFORE changing anything
            old_username = officer.user

            new_username = data.get("username", officer.user)
            new_email = data.get("email", "")
            new_password = data.get("password")

            # update django auth user FIRST
            try:
                auth_user = User.objects.get(username=old_username)

                auth_user.username = new_username
                auth_user.email = new_email

                if new_password:
                    auth_user.set_password(new_password)

                auth_user.save()

            except User.DoesNotExist:
                return Response(
                    {"error": "Auth user not found"},
                    status=404
                )

            # NOW update officer table
            officer.user = new_username
            officer.save()

            return Response({
                "message": "Settings updated successfully"
            })
           

                
                # auth_user.username = data.get(
                #     "username",
                #     auth_user.username
                # )

                # password = data.get("password")

                # if password:
                #     auth_user.set_password(password)

                # auth_user.save()

                
        except Officer.DoesNotExist:

            return Response(
                {"error": "Officer not found"},
                status=404
            )

        except Exception as e:

            print("SETTINGS ERROR:", e)

            return Response(
                {
                    "error": "Server error",
                    "details": str(e)
                },
                status=500
            )

@api_view(["GET"])
def audit_logs(request):

    logs = AuditLog.objects.filter(role__iexact="Officer"  ).order_by("-timestamp")

    data = []

    for log in logs:
        data.append({
            "id": log.id,
            "user": log.user,
            "role": log.role,
            "action": log.action,
            "target": log.target,
            "timestamp": log.timestamp,
        })

    return Response(data)


@api_view(["GET"])
def bank_audit_logs(request):

    logs = AuditLog.objects.filter(
        role__icontains="Bank"
    ).order_by("-timestamp")

    data = []

    for log in logs:
        data.append({
            "id": log.id,
            "user": log.user,
            "action": log.action,
            "target": log.target,
            "timestamp": log.timestamp,
        })

    return Response(data)



@api_view(["GET", "PUT"])
def bank_settings(request):

    # ── GET SETTINGS ─────────────────────────────
    if request.method == "GET":

        staff_id = request.GET.get("staff_id")

        if not staff_id:
            return Response(
                {"error": "Staff ID required"},
                status=400
            )

        try:
            user = BankStaff.objects.get(staff_id=staff_id)

            return Response({
                "username": user.username,
                "staff_id": user.staff_id,
                "bank_name": user.bank_name,
                "branch": user.branch,
            })

        except BankStaff.DoesNotExist:
            return Response(
                {"error": "User not found"},
                status=404
            )

    # ── UPDATE SETTINGS ─────────────────────────────
    elif request.method == "PUT":

        data = request.data

        staff_id = data.get("staff_id")

        if not staff_id:
            return Response(
                {"error": "Staff ID required"},
                status=400
            )

        try:
            user = BankStaff.objects.get(staff_id=staff_id)

            user.username = data.get("username", user.username)
            user.bank_name = data.get("bank_name", user.bank_name)
            user.branch = data.get("branch", user.branch)

            if data.get("password"):
                user.password = data.get("password")

            user.save()

            return Response({
                "message": "Settings updated successfully"
            })

        except BankStaff.DoesNotExist:
            return Response(
                {"error": "User not found"},
                status=404
            )

        except Exception as e:
            print("BANK SETTINGS ERROR:", e)

            return Response(
                {
                    "error": "Server error",
                    "details": str(e)
                },
                status=500
            )




@api_view(["GET"])
def bank_profile(request, username):
    try:
        staff = BankStaff.objects.filter(username__iexact=username.strip()).first()

        if not staff:
            return Response({"message": "Bank staff not found"}, status=404)

        return Response({
            "username": staff.username,
            "staff_id": staff.staff_id,
            "bank_name": staff.bank_name,
            "branch": staff.branch,
            "role": "Bank Staff",
        })

    except Exception as e:
        return Response({
            "message": "Server error",
            "error": str(e)
        }, status=500)



@api_view(["GET"])
def udls_profile(request, username):
    try:
        staff = UDLSStaff.objects.filter(username__iexact=username).first()
        if not staff:
            return Response({"message": "UDLS staff not found"}, status=404)
        return Response({
            "username":   staff.username,
            "staff_id":   staff.staff_id,
            "email":      staff.email,
            "staff_role": staff.role,
            "joined":     staff.created_at.isoformat(),
        })
    except Exception as e:
        return Response({"message": "Server error", "error": str(e)}, status=500)



# ── UDLS DASHBOARD ────────────────────────────────────────────────────────
# @api_view(["GET"])
# def udls_dashboard(request):

#     total_permits = DriverPermit.objects.count()

#     flagged_count = DriverPermit.objects.filter(
#         status="lost"
#     ).count()

#     pending_review = DriverPermit.objects.filter(
#         status="found"
#     ).count()

#     recent = DriverPermit.objects.order_by("-created_at")[:5]

#     recent_reports = []

#     for permit in recent:


        

#         recent_reports.append({
#             "name": permit.name,
#             "type": "Driver Permit",
#             "permit_number": permit.permit_number,
#             "status": status,
#         })

#     return Response({
#         "stats": {
#             "total_permits": total_permits,
#             "flagged_count": flagged_count,
#             "pending_review": pending_review,
#         },
#         "recent_reports": recent_reports,
#     })





@api_view(["GET"])
def udls_dashboard(request):
    permits_qs = DriverPermit.objects.all()  
    
    total_permits = permits_qs.count()
    flagged_count = permits_qs.filter(is_flagged=True).count()
    pending_review = permits_qs.filter(status="Pending").count()  
    
    recent = permits_qs.order_by("-created_at")[:5]
    recent_reports = []
    for permit in recent:
        recent_reports.append({
            "name": permit.holder_name,        
            "plate": permit.license_number,    
            "status": permit.status.lower(),
        })
    
    return Response({
        "stats": {
            "total_permits": total_permits,
            "flagged_count": flagged_count,
            "pending_review": pending_review,
        },
        "recent_reports": recent_reports,
    })


@api_view(["GET"])
def udls_audit_logs(request):
    logs = AuditLog.objects.filter(role__iexact="UDLS").order_by("-timestamp")
    data = [
        {
            "id": log.id,
            "user": log.user,
            "role": log.role,
            "action": log.action,
            "target": log.target,
            "timestamp": log.timestamp,
        }
        for log in logs
    ]
    return Response(data)
# @api_view(["POST"])
# def udls_signup(request):
#     username = request.data.get("username")
#     staff_id = request.data.get("staff_id")
#     password = request.data.get("password")
#     role = request.data.get("staff_role")

#     if not username or not staff_id or not password:
#         return Response({"message": "Missing fields"}, status=400)

#     try:
#         UDLSStaff.objects.create(
#             username=username,
#             staff_id=staff_id,
#             role=role,
#             password=make_password(password)
#         )

#         return Response({"message": "UDLS account created"})

#     except IntegrityError:
#         return Response({"message": "User already exists"}, status=400)

#     except Exception as e:
#         print("UDLS SIGNUP ERROR:", e)
#         return Response({"message": "Server error", "error": str(e)}, status=500)

@api_view(["GET", "PUT"])
def udls_settings(request):

    if request.method == "GET":
        staff_id = request.GET.get("staff_id")
        if not staff_id:
            return Response({"error": "Staff ID required"}, status=400)

        try:
            user = UDLSStaff.objects.filter(
              Q(staff_id=staff_id) | Q(username=staff_id)).first()
            return Response({
                "username": user.username,
                "email": user.email,
                "staff_id": user.staff_id,
                "role": user.role,
            })
        except UDLSStaff.DoesNotExist:
            return Response({"error": "User not found",  "debug_staff_id": staff_id}, status=404)

    elif request.method == "PUT":
        staff_id = request.data.get("staff_id")

        if not staff_id:
            return Response({"error": "Staff ID required"}, status=400)

        try:
            user = UDLSStaff.objects.get(staff_id=staff_id)

            user.username = request.data.get("username", user.username)
            user.email = request.data.get("email", user.email)

            password = request.data.get("password")
            if password:
                user.password = make_password(password)

            user.save()

            log_action(
                user=user.username,
                role="UDLS",
                action="Settings updated",
                target=f"Staff ID: {staff_id}"
            )

            return Response({
                "message": "Settings updated successfully",
                "username": user.username,
                "email": user.email,
                "staff_id": user.staff_id,
            })

        except UDLSStaff.DoesNotExist:
            return Response({"error": "User not found"}, status=404)

@api_view(["POST"])
def udls_signup(request):
    try:
        username = request.data.get("username")
        staff_id = request.data.get("staff_id")
        email = request.data.get("email")
        password = request.data.get("password")
        role = request.data.get("staff_role", "staff")

        if not username or not staff_id or not password or not email:
            return Response({"message": "Missing fields"}, status=400)

        if UDLSStaff.objects.filter(username=username).exists():
            return Response({"message": "Username already exists"}, status=400)

        if UDLSStaff.objects.filter(staff_id=staff_id).exists():
            return Response({"message": "Staff ID already exists"}, status=400)

        if UDLSStaff.objects.filter(email=email).exists():
            return Response({"message": "Email already exists"}, status=400)

        user = UDLSStaff.objects.create(
            username=username,
            staff_id=staff_id,
            email=email,
            role=role,
            password=make_password(password)
        )

        return Response({"message": "UDLS account created"})
    
    except IntegrityError as e:
        return Response({
            "message": "Duplicate field (username, staff_id, or email already exists)",
            "error": str(e)
        }, status=400)

    # except Exception as e:
    #     print(" UDLS SIGNUP ERROR TRACEBACK:")
    #     traceback.print_exc()

    #     return Response({
    #         "message": "Server error",
    #         "error": str(e)
    #     }, status=500)



from django.contrib.auth.hashers import check_password

@api_view(["POST"])
def udls_login(request):
    print("UDLS LOGIN HIT")
    staff_id = request.data.get("staff_id")
    password = request.data.get("password")

    print("STAFF ID:", staff_id)

    try:
        user = UDLSStaff.objects.get(staff_id=staff_id)

        if check_password(password, user.password):
            return Response({
                "message": "Login successful",
                "username": user.username,
                "staff_id": user.staff_id,
                "role": user.role,
            })

        return Response({"message": "Invalid credentials"}, status=400)

    except UDLSStaff.DoesNotExist:
        return Response({"message": "User not found"}, status=404)

@api_view(["GET"])
def udls_records(request):
    permits = DriverPermit.objects.all().order_by("-created_at")
    serializer = DriverPermitSerializer(permits, many=True)
    return Response(serializer.data)


@api_view(["GET"])
def udls_records(request):
    permits = DriverPermit.objects.all().order_by("-created_at")
    serializer = DriverPermitSerializer(permits, many=True)
    return Response(serializer.data)



@api_view(["GET"])
def nira_dashboard(request):
    total_ids = IDRecord.objects.filter(
        id_type="National ID"
    ).count()
    # total_ids       = IDRecord.objects.count()
    #unt   = FlaggedID.objects.count()
    flagged_count = FlaggedID.objects.filter(
        report__id_type="National ID"
    ).count()
    #pending_review  = FlaggedID.objects.filter(status="Under Review").count()
    pending_review = FlaggedID.objects.filter(
        status="Under Review",
        report__id_type="National ID"
    ).count()
    #confirmed_fraud = FlaggedID.objects.filter(status="Confirmed Fraud").count()
    confirmed_fraud = FlaggedID.objects.filter(
        status="Confirmed Fraud",
        report__id_type="National ID"
    ).count()

    # recent = FlaggedID.objects.select_related("report").order_by("-id")[:5]
    recent = (
        FlaggedID.objects
        .select_related("report")
        .filter(report__id_type="National ID")
        .order_by("-id")[:5]
    )
    recent_flagged = [
        {
            "name":   f.report.name,
            "nin":    f.report.id_number,
            "status": f.status,
        }
        for f in recent
    ]

    return Response({
        "stats": {
            "total_ids":       total_ids,
            "flagged_count":   flagged_count,
            "pending_review":  pending_review,
            "confirmed_fraud": confirmed_fraud,
        },
        "recent_flagged": recent_flagged,
    })


# @api_view(["GET"])
# def nira_all_records(request):
#     records = (
#         IDRecord.objects
#         .filter(id_type="National ID")
#         .order_by("-created_at")
#     )
#     # records = IDRecord.objects.all().order_by("-created_at")
#     serializer = IDRecordSerializer(records, many=True)
#     return Response(serializer.data)

@api_view(["GET", "PUT", "DELETE"])
def nira_record_detail(request, pk):
    try:
        record = IDRecord.objects.get(pk=pk)
    except IDRecord.DoesNotExist:
        return Response({"error": "Not found"}, status=404)

    if request.method == "GET":
        return Response(IDRecordSerializer(record).data)

    if request.method == "PUT":
        new_status = request.data.get("status")

        allowed_status = ["Lost", "Found", "Resolved"]

        if new_status not in allowed_status:
            return Response(
                {"error": f"Status must be one of {allowed_status}"},
                status=400
            )

        record.status = new_status
        record.save()

        

    if request.method == "DELETE":
        record.delete()
        return Response({"message": "Deleted"})

@api_view(["GET"])
def nira_all_records(request):
    records = (
        IDRecord.objects
        .filter(id_type="National ID")
        .order_by("-created_at")
    )
    serializer = IDRecordSerializer(records, many=True)
    return Response(serializer.data)



@api_view(["GET"])
def nira_audit_logs(request):
    logs = AuditLog.objects.filter(role__iexact="NIRA").order_by("-timestamp")

    data = [
        {
            "id": log.id,
            "user": log.user,
            "role": log.role,
            "action": log.action,
            "target": log.target,
            "timestamp": log.timestamp,
        }
        for log in logs
    ]

    return Response(data)

# @api_view(["GET"])
# def nira_flagged(request):
#     flagged = FlaggedID.objects.select_related("report").order_by("-id")
#     data = [
#         {
#             "id":           f.id,
#             "name":         f.report.name,
#             "nin":          f.report.id_number,
#             "reason":       f.reason,
#             "severity":     f.severity,
#             "status":       f.status,
#             "report_count": f.report.report_count,
#         }
#         for f in flagged
#     ]
#     return Response(data)

@api_view(["GET"])
def nira_flagged(request):
    flagged = (
        FlaggedID.objects
        .select_related("report")
        .filter(report__id_type="National ID")  # ✅ only National IDs
        .order_by("-id")
    )
    data = [
        {
            "id":           f.id,
            "name":         f.report.name,
            "nin":          f.report.id_number,
            "reason":       f.reason,
            "severity":     f.severity,
            "status":       f.status,
            "report_count": f.report.report_count,
            "location":     f.report.location_found,
            "created_at":   f.created_at.isoformat(),
        }
        for f in flagged
    ]
    return Response(data)


@api_view(["PATCH"])
def nira_review_flagged(request, pk):
    try:
        flagged = FlaggedID.objects.get(pk=pk)
    except FlaggedID.DoesNotExist:
        return Response({"error": "Not found"}, status=404)

    new_status = request.data.get("status")
    allowed = ["Under Review", "Cleared", "Confirmed Fraud", "Under Investigation"]

    if new_status not in allowed:
        return Response({"error": f"Status must be one of {allowed}"}, status=400)

    flagged.status = new_status
    flagged.save()

    log_action(
        user=request.data.get("reviewed_by", "NIRA Staff"),
        role="NIRA",
        action=f"Flagged ID reviewed — marked as {new_status}",
        target=flagged.report.id_number,
    )

    return Response({"message": "Status updated", "status": new_status})


@api_view(["GET"])
def nira_verify_id(request):
    nin = request.GET.get("nin", "").strip()
    if not nin:
        return Response({"error": "NIN is required"}, status=400)

    try:
        record = IDRecord.objects.get(
            id_number=nin,
            id_type="National ID"
        )
        # record = IDRecord.objects.get(id_number=nin)
        return Response({
            "found":        True,
            "name":         record.name,
            "nin":          record.id_number,
            "id_type":      record.id_type,
            "status":       record.status,
            "is_flagged":   record.is_flagged,
            "flag_reason":  record.flag_reason,
            "report_count": record.report_count,
        })
    except IDRecord.DoesNotExist:
        return Response({"found": False, "message": "NIN not found in system"}, status=404)


# @api_view(["GET"])
# def nira_verify_id(request):
#     nin = request.GET.get("nin", "").strip()
#     if not nin:
#         return Response({"error": "NIN is required"}, status=400)

#     try:
#         record = IDRecord.objects.get(id_number=nin)
#         return Response({
#             "found":        True,
#             "name":         record.name,
#             "nin":          record.id_number,
#             "id_type":      record.id_type,
#             "status":       record.status,
#             "is_flagged":   record.is_flagged,
#             "flag_reason":  record.flag_reason,
#             "report_count": record.report_count,
#         })
#     except IDRecord.DoesNotExist:
#         return Response({"found": False, "message": "NIN not found in system"}, status=404)