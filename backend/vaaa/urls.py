from django.contrib import admin
from django.urls import path
from products.views import ProductListAPIView
from animals.views import AnimalListAPIView
from orders.views import OrderCreateAPIView

urlpatterns = [
    path('admin/', admin.site.urls),

    # Products
    path('api/products/', ProductListAPIView.as_view(), name='product-list'),

    # Animals
    path('api/animals/', AnimalListAPIView.as_view(), name='animal-list'),

    # Orders
    path('api/orders/', OrderCreateAPIView.as_view(), name='order-create'),


]
