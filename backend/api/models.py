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


class NiraStaffManager(BaseUserManager):
    def create_user(self, username, staff_id, email, password=None):
        if not email:
            raise ValueError("Email is required")

        user = self.model(
            username=username,
            staff_id=staff_id,
            email=self.normalize_email(email),
        )

        user.set_password(password)  # 🔐 hashes password
        user.save(using=self._db)
        return user

    def create_superuser(self, username, staff_id, email, password):
        user = self.create_user(username, staff_id, email, password)
        user.is_admin = True
        user.is_staff = True
        user.is_superuser = True
        user.save()
        return user

class NiraStaff(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(max_length=100, unique=True)
    staff_id = models.CharField(max_length=50, unique=True)
    email = models.EmailField(unique=True)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    objects = NiraStaffManager()

    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = ["staff_id", "email"]

    def __str__(self):
        return self.username


# class NiraStaff(models.Model):
#     username = models.CharField(max_length=100, unique=True)
#     staff_id = models.CharField(max_length=50, unique=True)
#     password = models.CharField(max_length=255)

#     created_at = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return self.username



@api_view(["POST"])
def bank_login(request):
    staff_id = request.data.get("staff_id")
    password = request.data.get("password")

    try:
        user = BankStaff.objects.get(staff_id=staff_id)

        if user.password == password:  # later use hashing
            return Response({
                "message": "Login successful",
                "staff_id": user.staff_id,
                "username": user.username
            })

        return Response({"message": "Invalid password"}, status=400)

    except BankStaff.DoesNotExist:
        return Response({"message": "User not found"}, status=404)

@api_view(["POST"])
def bank_signup(request):
    username = request.data.get("username")
    staff_id = request.data.get("staff_id")
    bank_name = request.data.get("bank_name")
    branch = request.data.get("branch")
    password = request.data.get("password")

    if BankStaff.objects.filter(staff_id=staff_id).exists():
        return Response({"message": "Staff already exists"}, status=400)

    BankStaff.objects.create(
        username=username,
        staff_id=staff_id,
        bank_name=bank_name,
        branch=branch,
        password=make_password(password),
    )

    return Response({"message": "Bank account created successfully"})