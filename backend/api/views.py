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
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter
from .models import Officer


class IDRecordViewSet(viewsets.ModelViewSet):
    queryset = IDRecord.objects.all()
    serializer_class = IDRecordSerializer

    filter_backends = [SearchFilter]
    search_fields = ['name', 'id_number', 'status']


@api_view(["POST"])
def create_user(request):
    username = request.data.get("username")
    password = request.data.get("password")

    if User.objects.filter(username=username).exists():
        return Response({"message": "User already exists"}, status=400)

    user = User.objects.create_user(username=username, password=password)

    return Response({
        "message": "User created successfully",
        "username": user.username
    })



# @api_view(["POST"])
# def login(request):
#     username = request.data.get("username")
#     password = request.data.get("password")

#     try:
#         officer = Officer.objects.get(username=username)

#         if officer.password == password:  # (ONLY if you stored plain text - not recommended)
#             return Response({
#                 "message": "Login successful",
#                 "username": officer.username
#             })

#     except Officer.DoesNotExist:
#         pass

    #return Response({"message": "Invalid credentials"}, status=400)

     

    # user = authenticate(username=username, password=password)

    

    # if user:
    #     return Response({
    #         "message": "Login successful",
    #         "username": user.username
    #     })

    # return Response({
    #     "message": "Invalid credentials"
    # }, status=400)

    