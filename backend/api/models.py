from django.db import models
from django.core.validators import RegexValidator


nin_validator = RegexValidator(
    regex=r'^C[FM][A-Za-z0-9]{12}$',
    message="Invalid NIN format. Example: CM12345678ABC"
)


# create a database table called IDRecord with fields name, id_number, type, status, location and date

class IDRecord(models.Model):
    # limits values to only lost or found.
    STATUS_CHOICES = [
        ("Lost", "Lost"),
        ("Found", "Found"),
    ]

    #only allows nationalID and drivers permit
    TYPE_CHOICES = [
        ("National ID", "National ID"),
        ("Driver Permit", "Driver Permit"),
    ]

    #fields in the table
    name = models.CharField(max_length=100)
    id_number = models.CharField(max_length=100, unique=True)
    id_type = models.CharField(max_length=50, choices=TYPE_CHOICES)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)
    location_found = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)


class Officer(models.Model):
    user= models.CharField(max_length=100, unique=True)
    role = models.CharField(max_length=20, default="officer")
    badge_id = models.CharField(max_length=50, unique=True, blank=True, null=True)
    rank = models.CharField(max_length=50, default="Officer", blank=True)
    station = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return f"{self.username} ({self.badge_id or 'No Badge'})" 

class NiraStaff(models.Model):
    username = models.CharField(max_length=100, unique=True)
    staff_id = models.CharField(max_length=50, unique=True)
    password = models.CharField(max_length=255)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.username