from rest_framework import serializers
from .models import IDRecord

class IDRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = IDRecord
        fields = '__all__'