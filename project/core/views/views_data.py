import math
import json
import os
import pprint
import PubMedQuerier
import random
import TermExtractor
import TopicModeler
from itertools import chain
from nltk.metrics import edit_distance

from core.models import Association, Concept, Evidence, Text, EvidenceBookmark, EvidenceTopic, Topic, Collection, Citation
from logger.models import Action

from django.conf import settings
from django.core import serializers
from django.db.models import Q, Max
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render

from rest_framework import status
from rest_framework.views import View

from django.core.exceptions import ObjectDoesNotExist
import GoogleScholarQuerier

names = {}
names[10] = 'visualization'
names[11] = 'pfc and executive functions'
names[12] = 'virtual reality'
names[13] = 'TVCG'
names[15] = 'diffusion tenser imaging'

def flattenSerializedJson(input):
    output = []
    json_array = json.loads(input)
    for d in json_array:
        newData = d['fields']
        newData['id'] = d['pk']
        output.append(newData)
    return json.dumps(output)


class TextView(View):
    def get(self, request, user_id, format=None):
        texts = Text.objects.filter(created_by=user_id)
        serialized_json = serializers.serialize('json', texts)
        text_json = flattenSerializedJson(serialized_json)
        return HttpResponse(text_json, status=status.HTTP_200_OK)   

    def post(self, request, user_id, format=None):
        data = json.loads(request.body)
        if data['is_new']: 
            text = Text.objects.create_text(data['title'], data['content'], data['created_by'])
        else:
            text = Text.objects.get(id=data['text_id'])
            text.title = data['title']
            text.content = data['content']
            text.save()
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
    def get(self, request, user_id, format=None):
        # get both user created and bookmarked evidence (cited / associated evidence are automatically bookmarked)
        evidenceCreated = Evidence.objects.filter(created_by=user_id)
        evidenceBookmarks = EvidenceBookmark.objects.filter(user_id=user_id)
        evidenceBookmarkedIds = [eb.evidence.pk for eb in evidenceBookmarks]
        evidenceBookmarked = Evidence.objects.filter(pk__in=evidenceBookmarkedIds)
        evidence = chain(evidenceCreated, evidenceBookmarked)
        serialized_json = serializers.serialize('json', evidence)
        evidence_json = flattenSerializedJson(serialized_json)

        return HttpResponse(evidence_json, status=status.HTTP_200_OK) 


    def post(self, request, user_id, format=None):
        data = json.loads(request.body)
#        data = {
#            'abstract': '',
#            'title': 'Generalized theory of relaxation',
#            'metadata': '',
#            'created_by': 1001
#        }
        # 01/20/2016 new feature: initiate a google scholar api call to get abstract if not provided
        findRelatedEvidence = True;
        title = data['title'].replace('{', '').replace('}', '')
        abstract = data['abstract']
        if abstract == '':
            temp_title, temp_abstract = PubMedQuerier.get_abstract_by_title(data['title'])
            if temp_title is not None:
                title = temp_title
                abstract = temp_abstract
        evidence = Evidence.objects.create_evidence(title, abstract, data['metadata'], data['created_by'], 0)
        serialized_json = serializers.serialize('json', [evidence])
        evidence_json = flattenSerializedJson(serialized_json)
        return HttpResponse(evidence_json, status=status.HTTP_201_CREATED)


# TODO: delete attached associations as well
class DeleteEntryView(View):
    def post(self, request, type, format=None):
        data = json.loads(request.body)
        user_id = data['user_id']
        id = str(data['id'])
        if type == 'text':
            Text.objects.filter(Q(created_by=user_id)&Q(pk=id)).delete()
        elif type == 'concept':
            Concept.objects.filter(Q(created_by=user_id)&Q(pk=id)).delete()
        elif type == 'evidence':
            Evidence.objects.filter(Q(created_by=user_id)&Q(pk=id)).delete()
        else:
            return HttpResponse(status=status.HTTP_400_BAD_REQUEST) 
        Association.objects.filter(created_by=user_id, sourceId=id).delete()
        Association.objects.filter(created_by=user_id, targetId=id).delete()

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


class UserAssociationView(View):
    def get(self, request, user_id, format=None): 
        associations = Association.objects.filter(created_by=user_id)
        serialized_json = serializers.serialize('json', associations)
        associations_json = flattenSerializedJson(serialized_json)

        return HttpResponse(associations_json, status=status.HTTP_201_CREATED)

def association(request):
    if request.method == 'GET':
        return HttpResponse(json.dumps({}), status=status.HTTP_200_OK)
    elif request.method == 'POST':
        data = json.loads(request.body)
        association, created = Association.objects.create_association(data['sourceType'], data['targetType'], str(data['sourceId']), str(data['targetId']), data['created_by'])
        if (data['sourceType'] == 'evidence' and data['targetType'] == 'text'):
            EvidenceBookmark.objects.create_entry(data['sourceId'], data['created_by'])
        serialized_json = serializers.serialize('json', [association])
        association_json = flattenSerializedJson(serialized_json)
        return HttpResponse(association_json, status=status.HTTP_201_CREATED)

def deleteAssociation(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        Association.objects.delete_association(data['sourceType'], data['targetType'], str(data['sourceId']), str(data['targetId']), data['created_by'])
        return HttpResponse(json.dumps({}), status=status.HTTP_200_OK)

def deleteAssociationById(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        Association.objects.get(id=data['id']).delete()
        return HttpResponse(json.dumps({}), status=status.HTTP_200_OK)            

def updateAssociation(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        Association.objects.update_association(data['id'], str(data['sourceId']), str(data['targetId']))
        return HttpResponse(json.dumps({}), status=status.HTTP_200_OK)

def addBookmark(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        EvidenceBookmark.objects.create_entry(evidence_id=data['evidence_id'], user_id=data['user_id'])
        return HttpResponse(json.dumps({}), status=status.HTTP_200_OK)

def deleteBookmark(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        EvidenceBookmark.objects.filter(evidence_id=data['evidence_id'], user_id=data['user_id']).delete()
        Association.objects.filter(created_by=data['user_id'], sourceId=str(data['evidence_id'])).delete()
        return HttpResponse(json.dumps({}), status=status.HTTP_200_OK)

