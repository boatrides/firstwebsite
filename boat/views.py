from django.shortcuts import render

# Create your views here.
def boat(request):
    return render(request, 'boating/index.html')
def contact(request):
    return render(request, 'boating/contact-us.html')
