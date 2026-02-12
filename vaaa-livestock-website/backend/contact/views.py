from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json
from .models import ContactMessage


@csrf_exempt
@require_http_methods(["POST"])
def submit_contact(request):
    try:
        data = json.loads(request.body)

        contact = ContactMessage.objects.create(
            name=data.get('name'),
            email=data.get('email'),
            phone=data.get('phone', ''),
            subject=data.get('subject'),
            message=data.get('message')
        )

        return JsonResponse({
            'success': True,
            'message': 'Thank you! We will get back to you soon.'
        })

    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': 'An error occurred. Please try again.'
        }, status=400)
