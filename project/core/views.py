import json
import PubMedQuerier
import TermExtractor
import TopicModeler
from itertools import chain

from core.models import Association, Concept, Evidence, Text, EvidenceBookmark

from django.conf import settings
from django.core import serializers
from django.db.models import Q
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render

from rest_framework import status
from rest_framework.views import View


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
        evidence = Evidence.objects.create_evidence(data['title'], data['abstract'], data['metadata'], data['created_by'])
        print evidence
        serialized_json = serializers.serialize('json', [evidence])
        evidence_json = flattenSerializedJson(serialized_json)

        return HttpResponse(evidence_json, status=status.HTTP_201_CREATED)


# TODO: delete attached associations as well
class DeleteEntryView(View):
    def post(self, request, type, format=None):
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


class UserAssociationView(View):
    def get(self, request, user_id, format=None): 
        associations = Association.objects.filter(created_by=user_id)
        serialized_json = serializers.serialize('json', associations)
        associations_json = flattenSerializedJson(serialized_json)

        return HttpResponse(associations_json, status=status.HTTP_201_CREATED)


class ConceptGrowthView(View):
    def post(self, request, format=None):
        data = json.loads(request.body)
        print data['concepts']
        neighbors = PubMedQuerier.find_neighbors_for_terms(data['concepts'], num_neighbors=10, user_id=data['requested_by'])
        output = {}
        output['counts'] = {}
        concepts = []
        for pairs in neighbors['keywords']:
            output['counts'][pairs[0]] = pairs[1]
            concepts.append(Concept.objects.create_concept(pairs[0], data['requested_by']))
        serialized_json = serializers.serialize('json', concepts)
        concepts_json = flattenSerializedJson(serialized_json)
        output['concepts'] = json.loads(concepts_json)
        return HttpResponse(json.dumps(output), status=status.HTTP_201_CREATED)

class EvidenceSearchView(View):
    def post(self, request, format=None):
        terms = json.loads(request.body)['terms']
        evidence = PubMedQuerier.find_evidence_for_terms(terms, skip_no_abstract=True)
        serialized_json = serializers.serialize('json', evidence)
        evidence_json = flattenSerializedJson(serialized_json)
        # let's provide topic modeling results in addition to the raw evidence
        output = {}
        output['evidence'] = json.loads(evidence_json)
        evidencePks = [e.pk for e in evidence]
        abstracts = [e.abstract for e in evidence]
        output['topics'], output['evidenceTopicMap'] = getTopicsForDocuments(evidencePks, abstracts) 
        return HttpResponse(json.dumps(output), status=status.HTTP_201_CREATED)

class TermExtractionView(View):
    def post(self, request, format=None):
        text = json.loads(request.body)['text']
        terms = TermExtractor.run(text)
        output = []
        for entry in terms:
            output.append({
                'term': entry[0],
                'frequency': entry[1],
                'length': entry[2]
            })
        return HttpResponse(json.dumps(output), status=status.HTTP_201_CREATED)


def association(request):
    if request.method == 'GET':
        return HttpResponse(json.dumps({}), status=status.HTTP_200_OK)
    elif request.method == 'POST':
        data = json.loads(request.body)
        association = Association.objects.create_association(data['sourceType'], data['targetType'], data['sourceId'], data['targetId'], data['created_by'])
        print association
        if (data['sourceType'] == 'evidence' and data['targetType'] == 'text'):
            EvidenceBookmark.objects.create_entry(data['sourceId'], data['created_by'])
        serialized_json = serializers.serialize('json', [association])
        association_json = flattenSerializedJson(serialized_json)
        return HttpResponse(association_json, status=status.HTTP_201_CREATED)


def deleteAssociation(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        Association.objects.delete_association(data['sourceType'], data['targetType'], data['sourceId'], data['targetId'], data['created_by'])
        return HttpResponse(json.dumps({}), status=status.HTTP_200_OK)

def deleteBookmark(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        print data
        EvidenceBookmark.objects.filter(evidence_id=data['evidence_id'], user_id=data['user_id']).delete()
        Association.objects.filter(created_by=data['user_id'], sourceId=data['evidence_id']).delete()
        return HttpResponse(json.dumps({}), status=status.HTTP_200_OK)


def retrieveEvidenceTextTopics(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        user_id = data['user_id']

#        user_id = 101

        texts = Text.objects.filter(created_by=user_id)
        serialized_json = serializers.serialize('json', texts)
        texts_json = flattenSerializedJson(serialized_json)

        evidenceCreated = Evidence.objects.filter(created_by=user_id)
        evidenceBookmarks = EvidenceBookmark.objects.filter(user_id=user_id)
        evidenceBookmarkedIds = [eb.evidence.pk for eb in evidenceBookmarks]
        evidenceBookmarked = Evidence.objects.filter(pk__in=evidenceBookmarkedIds)

        evidence = chain(evidenceCreated, evidenceBookmarked)

        serialized_json = serializers.serialize('json', evidence)
        evidence_json = flattenSerializedJson(serialized_json)

        # let's provide topic modeling results in addition to the raw evidence
        output = {}
        output['evidence'] = json.loads(evidence_json)

        contents = [t.content for t in texts]
        textPks = ['t-'+str(t.pk) for t in texts]
        abstracts = [e['abstract'] for e in output['evidence']]
        evidencePks = ['e-'+str(e['id']) for e in output['evidence']]

        output['topics'], output['evidenceTextTopicMap'] = getTopicsForDocuments(evidencePks + textPks, abstracts + contents) 
        return HttpResponse(json.dumps(output), status=status.HTTP_201_CREATED)

def getTopicsForDocuments(documentIds, documents):
    topics = []
    evidenceTopicMap = {}
    topics, index_topic_map = TopicModeler.run(documents)
    print index_topic_map
    id_topic_map = {}
    for i in range(len(documentIds)):
        id_topic_map[documentIds[i]] = index_topic_map[i]

    return topics, id_topic_map    

