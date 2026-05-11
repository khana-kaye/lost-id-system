from django.db import models
from django.core.validators import RegexValidator
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin


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
    id_number = models.CharField(max_length=100)
    id_type = models.CharField(max_length=50, choices=TYPE_CHOICES)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)
    location_found = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)
    flag_reason = models.CharField(max_length=255, null=True, blank=True)
    is_flagged = models.BooleanField(default=False)


class Officer(models.Model):
    user= models.CharField(max_length=100, unique=True)
    role = models.CharField(max_length=20, default="officer")
    badge_id = models.CharField(max_length=50, unique=True, blank=True, null=True)
    rank = models.CharField(max_length=50, default="Officer", blank=True)
    station = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return f"{self.user} ({self.badge_id or 'No Badge'})" 




class BankStaff(models.Model):
    username = models.CharField(max_length=100)
    staff_id = models.CharField(max_length=50, unique=True)
    bank_name = models.CharField(max_length=100)
    branch = models.CharField(max_length=100)
    password = models.CharField(max_length=255)

    def __str__(self):
        return self.username

        
class NiraStaffManager(BaseUserManager):
    def create_user(self, username, staff_id, email, password=None):
        if not email:
            raise ValueError("Email is required")

        user = self.model(
            username=username,
            staff_id=staff_id,
            email=self.normalize_email(email),
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, staff_id, email, password):
        user = self.create_user(username, staff_id, email, password)
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user


class NiraStaff(models.Model):
    username = models.CharField(max_length=100, unique=True)
    staff_id = models.CharField(max_length=50, unique=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    # is_active = models.BooleanField(default=True)
    # is_staff = models.BooleanField(default=False)

    # created_at = models.DateTimeField(auto_now_add=True)

    # objects = NiraStaffManager()

    # USERNAME_FIELD = "username"
    # REQUIRED_FIELDS = ["staff_id", "email"]

    def __str__(self):
        return self.username


class UnebStaff(models.Model):
    staff_id = models.CharField(max_length=50, unique=True)
    username = models.CharField(max_length=100)
    password = models.CharField(max_length=255)
    exam_role = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.staff_id


class FlaggedID(models.Model):
    report = models.ForeignKey(IDRecord, on_delete=models.CASCADE)
    reason = models.CharField(max_length=255)
    severity = models.CharField(max_length=50)
    status = models.CharField(max_length=50, default="Under Review")
    created_at = models.DateTimeField(auto_now_add=True)




class AuditLog(models.Model):
    user = models.CharField(max_length=100, default="System")
    role = models.CharField(max_length=100, blank=True, null=True)

    action = models.CharField(max_length=255)

    target = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )

    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user} - {self.action}"