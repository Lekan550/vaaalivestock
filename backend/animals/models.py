from django.db import models

class Animal(models.Model):
    name = models.CharField(max_length=100)
    breed = models.CharField(max_length=100)
    age = models.IntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
