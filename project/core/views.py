import json

from django.core import serializers
from django.shortcuts import render
from django.conf import settings
from django.db.models import Q

from django.http import HttpResponse, JsonResponse
from rest_framework import status

from rest_framework.views import View

from core.models import Text, Concept, Evidence, Association

def index(request):
    template = 'core/index.html'
    context = {'DEBUG': settings.DEBUG}
    return render(request, template, context)

def flattenSerializedJson(input):
    output = []
    json_array = json.loads(input)
    for d in json_array:
        newData = d['fields']
        newData['id'] = d['pk']
        output.append(newData)
    return json.dumps(output)


class TextView(View):
    def post(self, request, format=None):
        data = json.loads(request.body)
        text = Text.objects.create_text(data['title'], data['content'], data['created_by'])
        serialized_json = serializers.serialize('json', [text])
        text_json = flattenSerializedJson(serialized_json)

        return HttpResponse(text_json, status=status.HTTP_201_CREATED)

class ConceptView(View):
    def post(self, request, format=None):
        data = json.loads(request.body)
        concept = Concept.objects.create_concept(data['term'], data['created_by'])
        serialized_json = serializers.serialize('json', [concept])
        concept_json = flattenSerializedJson(serialized_json)

        return HttpResponse(concept_json, status=status.HTTP_201_CREATED) 

class EvidenceView(View):
    def post(self, request, format=None):
        data = json.loads(request.body)
        evidence = Text.objects.create_text(data['title'], data['abstract'], data['metadata'], data['created_by'])
        print evidence
        serialized_json = serializers.serialize('json', [evidence])
        evidence_json = flattenSerializedJson(serialized_json)

        return HttpResponse(evidence_json, status=status.HTTP_201_CREATED)

class DeleteEntryView(View):
    def post(self, request, type, format=None):
        print '?'
        data = json.loads(request.body)
        user_id = data['user_id']
        id = data['id']
        print type
        if type == 'text':
            Text.objects.filter(Q(created_by=user_id)&Q(pk=id)).delete()
        elif type == 'concept':
            Concept.objects.filter(Q(created_by=user_id)&Q(pk=id)).delete()
        elif type == 'evidence':
            Evidence.objects.filter(Q(created_by=user_id)&Q(pk=id)).delete()
        else:
            return HttpResponse(status=status.HTTP_400_BAD_REQUEST) 

        return HttpResponse(status=status.HTTP_202_ACCEPTED)         


class UserDataView(View):
    def get(self, request, user_id, format=None): 
        texts = Text.objects.filter(created_by=user_id)
        serialized_json = serializers.serialize('json', texts)
        texts_json = flattenSerializedJson(serialized_json)

        concepts = Concept.objects.filter(created_by=user_id)
        serialized_json = serializers.serialize('json', concepts)
        concepts_json = flattenSerializedJson(serialized_json)

        evidence = Evidence.objects.filter(created_by=user_id)
        serialized_json = serializers.serialize('json', evidence)
        evidence_json = flattenSerializedJson(serialized_json)

        output = {
          'texts': json.loads(texts_json),
          'concepts': json.loads(concepts_json),
          'evidence': json.loads(evidence_json)
        }
        
        return HttpResponse(json.dumps(output), status=status.HTTP_201_CREATED)

