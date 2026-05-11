from rest_framework import serializers
from .models import IDRecord
from .models import ATMReport

class IDRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = IDRecord
        fields = '__all__'


class ATMReportSerializer(serializers.ModelSerializer):

    class Meta:
        model = ATMReport
        fields = "__all__"