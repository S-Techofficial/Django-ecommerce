from django.http import JsonResponse

# Create your views here.

def home(requst):
    return JsonResponse({'info':'Django React Course','name':'Sumit'})