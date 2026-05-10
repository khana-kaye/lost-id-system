# views handles the API logic using django restframework
# It’s what actually handles requests like GET, POST, PUT, DELETE.
# An API (Application Programming Interface) is a way for different software systems to communicate with each other.

from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import viewsets
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter

from .serializers import IDRecordSerializer


from .models import BankStaff, NiraStaff, IDRecord, Officer
from django.contrib.auth.hashers import make_password, check_password

from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from django.db import IntegrityError

User = get_user_model()
# ID RECORDS
class IDRecordViewSet(viewsets.ModelViewSet):
    queryset = IDRecord.objects.all()
    serializer_class = IDRecordSerializer

    filter_backends = [SearchFilter]
    search_fields = ['name', 'id_number', 'status']

#officer signup
@api_view(["POST"])
def create_user(request):
    username = request.data.get("username")
    password = request.data.get("password")
    badge_id = request.data.get("badge_id")
    rank = request.data.get("rank")
    station = request.data.get("station")

    if not username or not password or not badge_id:
        return Response({"message": "missing fields"}, status=400)

    if User.objects.filter(username=username).exists():
        return Response({"message": "User already exists"}, status=400)

    if Officer.objects.filter(badge_id=badge_id).exists():
        return Response({"message": "Badge ID already in use"}, status=400)

    user = User.objects.create_user(username=username, password=password)
    Officer.objects.create(
        user=username,
        #password=password,
        role="officer",
        badge_id=badge_id,
        rank=rank or "Officer",
        station=station or "Unknown"
    )

    return Response({
        "message": "Officer account created successfully",
        #"username": user.username,
        # "badge_id": badge_id,
        # "rank": rank or "Officer"
    })

    #login police
@api_view(["POST"])
def login(request):
    username = request.data.get("username")
    password = request.data.get("password")

    user = authenticate(username=username, password=password)

    if user:
        return Response({
            "message": "Login successful",
            "username": user.username
        })

    return Response({"message": "Invalid credentials"}, status=400)


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
    username = request.data.get("username")
    staff_id = request.data.get("staff_id")
    bank_name = request.data.get("bank_name")
    branch = request.data.get("branch")
    password = request.data.get("password")

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
            password=password
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
    staff_id = request.data.get("staff_id")
    password = request.data.get("password")

    
    if not staff_id or not password:
        return Response(
            {"message": "Staff ID and password required"},
            status=400
        )

    try:
        user = BankStaff.objects.get(staff_id=staff_id)

        if user.password == password:
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