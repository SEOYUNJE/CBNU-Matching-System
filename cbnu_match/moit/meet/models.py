from django.db import models

# Create your models here.
class Meet(models.Model):
    
    CATEGORY_CHOICES = [
        ('STUDY', 'STUDY'),
        ('GAME', 'GAME'),
        ('EXERCISE', 'EXERCISE'),
        ('MEALS', 'MEALS'),
    ]
    MEMBER_CHOICES = [
        ('1명', '1명'),
        ('2명', '2명'),
        ('3명', '3명'),
        ('4명', '4명'),
        ('5명', '5명'),
        ('6명', '6명'),
        ('7명', '7명'),
        ('8명', '8명'),
    ]
    
    username = models.CharField(max_length=50, blank=True, null=True)
    title = models.CharField(max_length=100)
    category = models.CharField(max_length=10, choices = CATEGORY_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    deadline = models.DateTimeField()
    max_member = models.CharField(max_length=5, choices=MEMBER_CHOICES)
    meet_introduce = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return self.title
    
    class Meta:
        ordering = ['-created_at']