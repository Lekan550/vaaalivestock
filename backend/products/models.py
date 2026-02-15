from django.db import models

class Product(models.Model):
    CATEGORY_CHOICES = [
        ('poultry', 'Poultry'),
        ('goats', 'Goats'),
        ('sheep', 'Sheep'),
        ('cattle', 'Cattle'),
        ('products', 'By-Products'),
    ]

    name = models.CharField(max_length=200)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    price = models.DecimalField(max_digits=12, decimal_places=2)
    unit = models.CharField(max_length=50)  # e.g., "per bird", "per crate"
    image = models.ImageField(upload_to='products/', blank=True, null=True)  # save images in media/products

    def __str__(self):
        return self.name
