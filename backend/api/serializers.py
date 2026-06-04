from rest_framework import serializers
from .models import IDRecord
from .models import ATMReport
from .models import DriverPermit
import re

class IDRecordSerializer(serializers.ModelSerializer):

    def validate_id_number(self, value):
        value = value.upper().strip()

        if not re.match(r'^(CM|CF)[A-Za-z0-9]{12}$', value):
            raise serializers.ValidationError(
                "ID number must start with CM or CF followed by 12 letters or numbers."
            )

        return value

    class Meta:
        model = IDRecord
        fields = '__all__'


    class Meta:
        model = IDRecord
        fields = '__all__'


class ATMReportSerializer(serializers.ModelSerializer):

    class Meta:
        model = ATMReport
        fields = "__all__"




class DriverPermitSerializer(serializers.ModelSerializer):
    class Meta:
        model = DriverPermit
        fields = [
            "id", "license_number", "holder_name",
            "location_reported", "reported_by",
            "status", "is_flagged", "report_count", "created_at"
        ]
        fields = '__all__'