from django.shortcuts import render
from logger.models import Action
import json
from django.http import HttpResponse, JsonResponse
from rest_framework import status
from django.views.decorators.csrf import csrf_protect

# Create your views here.
@csrf_protect
def addAction(request):
  if request.method =='POST':
    data = json.loads(request.body)
    
    action = Action(
      user=data['userId'],
      name=data['name'],
      version_major=data['majorVersion'],
      version_minor=data['minorVersion'],
      view=data['view'],
      parameters=json.dumps(data['parameters'])
    )
    
    action.save()
    
    return HttpResponse(json.dumps({}), status=status.HTTP_201_CREATED)

