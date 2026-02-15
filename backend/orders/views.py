from rest_framework import generics, status
from rest_framework.response import Response
from django.db import transaction
from products.models import Product
from .models import Order, OrderItem
from .serializers import OrderSerializer, OrderItemSerializer


class OrderCreateAPIView(generics.CreateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        items_data = request.data.get('items', [])
        if not items_data:
            return Response({"error": "No items in order"}, status=status.HTTP_400_BAD_REQUEST)

        # Save order
        order = serializer.save()

        # Prepare order items
        order_items = []
        for item in items_data:
            try:
                product = Product.objects.get(id=item['id'])
                order_items.append(OrderItem(
                    order=order,
                    product=product,
                    quantity=item['quantity'],
                    price=product.price
                ))
            except Product.DoesNotExist:
                return Response(
                    {"error": f"Product with id {item['id']} does not exist."},
                    status=status.HTTP_400_BAD_REQUEST
                )

        # Bulk create
        OrderItem.objects.bulk_create(order_items)

        # Return order + items
        order_data = OrderSerializer(order).data
        order_data['items'] = OrderItemSerializer(order.items.all(), many=True).data

        return Response(order_data, status=status.HTTP_201_CREATED)
