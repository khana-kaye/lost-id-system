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

from .models import IDRecord, Officer
from .serializers import IDRecordSerializer


class IDRecordViewSet(viewsets.ModelViewSet):
    queryset = IDRecord.objects.all()
    serializer_class = IDRecordSerializer

    filter_backends = [SearchFilter]
    search_fields = ['name', 'id_number', 'status']


@api_view(["POST"])
def create_user(request):
    username = request.data.get("username")
    password = request.data.get("password")
    badge_id = request.data.get("badge_id")
    rank = request.data.get("rank")
    station = request.data.get("station")

    if not username or not password or not badge_id:
        return Response({"message": "Username, password, and badge ID are required."}, status=400)

    if User.objects.filter(username=username).exists():
        return Response({"message": "User already exists"}, status=400)

    if Officer.objects.filter(badge_id=badge_id).exists():
        return Response({"message": "Badge ID already in use"}, status=400)

    user = User.objects.create_user(username=username, password=password)
    Officer.objects.create(
        username=username,
        password=password,
        role="officer",
        badge_id=badge_id,
        rank=rank or "Officer",
        station=station or "Unknown"
    )

    return Response({
        "message": "Officer account created successfully",
        "username": user.username,
        "badge_id": badge_id,
        "rank": rank or "Officer"
    })


@api_view(["POST"])
def login(request):
    username = request.data.get("username")
    password = request.data.get("password")

    if not username or not password:
        return Response({"message": "Username and password are required."}, status=400)

    user = authenticate(username=username, password=password)
    if user:
        return Response({
            "message": "Login successful",
            "username": user.username
        })

    return Response({"message": "Invalid credentials"}, status=400)

    