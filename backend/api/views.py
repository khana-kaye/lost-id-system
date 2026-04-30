# views handles the API logic using django restframework
# It’s what actually handles requests like GET, POST, PUT, DELETE.
# An API (Application Programming Interface) is a way for different software systems to communicate with each other.

from django.shortcuts import render
from rest_framework.decorators import api_view

from rest_framework import viewsets
from .models import IDRecord
from .serializers import IDRecordSerializer
from rest_framework.response import Response
from .models import Officer
from rest_framework.decorators import api_view
from .models import IDRecord
from django.contrib.auth import authenticate
from rest_framework import viewsets


class IDRecordViewSet(viewsets.ModelViewSet):
    queryset = IDRecord.objects.all()
    serializer_class = IDRecordSerializer



@api_view(["POST"])
def login(request):
    username = request.data.get("username")
    password = request.data.get("password")

    user = authenticate(username=username, password=password)

    # if user is not None:
    #     return Response({
    #         "message": "Login successful",
    #         "username": user.username
    #     })
    # else:
    #     return Response({
    #         "message": "Invalid credentials"
    #     }, status=400)

    if user:
        return Response({
            "message": "Login successful",
            "username": user.username
        })

    return Response({
        "message": "Invalid credentials"
    }, status=400)

    