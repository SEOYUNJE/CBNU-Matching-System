from django.db import models
from django.contrib.auth.models import User
from django.conf import settings
from django.utils import timezone
from meet.models import Meet



# 1. 카테고리
class Category(models.Model):
    name = models.CharField(max_length=30, unique=True)

    def __str__(self):
        return self.name
