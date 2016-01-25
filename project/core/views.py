import math
import json
import os
import PubMedQuerier
import PubMedParser
import TermExtractor
import TopicModeler
import XploreParser
from itertools import chain
from nltk.metrics import edit_distance

from core.models import Association, Concept, Evidence, Text, EvidenceBookmark, EvidenceTopic, Topic

from django.conf import settings
from django.core import serializers
from django.db.models import Q
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render

from rest_framework import status
from rest_framework.views import View
from django.views.decorators.csrf import ensure_csrf_cookie

from django.core.exceptions import ObjectDoesNotExist
import GoogleScholarQuerier

names = {}
names[10] = 'visualization'
names[11] = 'pfc and executive functions'
names[12] = 'virtual reality'
names[13] = 'TVCG'

@ensure_csrf_cookie
def index(request):
    template = 'core/index.html'
    context = {'DEBUG': settings.DEBUG}
    return render(request, template, context)

def flattenSerializedJson(input):
    print '>> flatten serialized json...'
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
        print 'post request!'
        data = json.loads(request.body)
        if data['is_new']: 
            text = Text.objects.create_text(data['title'], data['content'], data['created_by'])
        else:
            text = Text.objects.get(id=data['text_id'])
            text.title = data['title']
            text.content = data['content']
            text.save()
            print text.content
            print data['content']
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
        print data
#        data = {
#            'abstract': '',
#            'title': 'Generalized theory of relaxation',
#            'metadata': '',
#            'created_by': 1001
#        }
        # 01/20/2016 new feature: initiate a google scholar api call to get abstract if not provided
        findRelatedEvidence = True;
        title = data['title']
        abstract = data['abstract']
        if abstract == '':
            temp_title, temp_abstract = PubMedQuerier.get_abstract_by_title(data['title'])
            if temp_title is not None:
                title = temp_title
                abstract = temp_abstract
                print abstract
        evidence = Evidence.objects.create_evidence(title, abstract, data['metadata'], data['created_by'])
        print evidence
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
    # The old "post" function - just for backup
    def get(self, request, format=None):
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

    def post(self, request, format=None):
        params = json.loads(request.body)
        terms = params['terms']
        user_id = params['user_id']

        print terms
        print user_id

        texts = Text.objects.filter(created_by=user_id)
        serialized_json = serializers.serialize('json', texts)
        texts_json = flattenSerializedJson(serialized_json)

        evidenceCreated = Evidence.objects.filter(created_by=user_id)
        evidenceBookmarks = EvidenceBookmark.objects.filter(user_id=user_id)
        evidenceBookmarkedIds = [eb.evidence.pk for eb in evidenceBookmarks]
        evidenceBookmarked = Evidence.objects.filter(pk__in=evidenceBookmarkedIds)
        evidenceRetrieved = PubMedQuerier.find_evidence_for_terms(terms, skip_no_abstract=True)

        evidence = chain(evidenceCreated, evidenceBookmarked, evidenceRetrieved)

        print '>> serializing evidence...'
        serialized_json = serializers.serialize('json', evidence)
        print '>> flatten serialized evidence...'
        evidence_json = flattenSerializedJson(serialized_json)

        # let's provide topic modeling results in addition to the raw evidence
        output = {}
        print '>> loading evidence into json...'
        output['evidence'] = json.loads(evidence_json)

        contents = [t.content for t in texts]
        textPks = ['t-'+str(t.pk) for t in texts]
        abstracts = [e['abstract'] for e in output['evidence']]
        evidencePks = ['e-'+str(e['id']) for e in output['evidence']]

        if len(evidencePks + textPks) <= 1:
            output['topics'] = []
            output['evidenceTextTopicMap'] = []
        else:
            output['topics'], output['evidenceTextTopicMap'] = getTopicsForDocuments(evidencePks + textPks, abstracts + contents) 
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
        association = Association.objects.create_association(data['sourceType'], data['targetType'], str(data['sourceId']), str(data['targetId']), data['created_by'])
        print association
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


def addBookmark(request):
    if request.method == 'POST':
        print 'adding bookmark'
        data = json.loads(request.body)
        EvidenceBookmark.objects.create_entry(evidence_id=data['evidence_id'], user_id=data['user_id'])
        return HttpResponse(json.dumps({}), status=status.HTTP_200_OK)


def deleteBookmark(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        print data
        EvidenceBookmark.objects.filter(evidence_id=data['evidence_id'], user_id=data['user_id']).delete()
        Association.objects.filter(created_by=data['user_id'], sourceId=str(data['evidence_id'])).delete()
        return HttpResponse(json.dumps({}), status=status.HTTP_200_OK)


def retrieveEvidenceTextTopics(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        user_id = data['user_id']

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

        if len(evidencePks + textPks) <= 1:
            output['topics'] = []
            output['evidenceTextTopicMap'] = []
        else:
            output['topics'], output['evidenceTextTopicMap'] = getTopicsForDocuments(evidencePks + textPks, abstracts + contents) 
        return HttpResponse(json.dumps(output), status=status.HTTP_201_CREATED)

def getTopicsForDocuments(documentIds, documents):
    topics = []
    evidenceTopicMap = {}
    topics, index_topic_map = TopicModeler.run(documents)
    id_topic_map = {}
    for i in range(len(documentIds)):
        id_topic_map[documentIds[i]] = index_topic_map[i]

    return topics, id_topic_map

def getEvidenceCollection(request, collection_id):
    if request.method == 'GET':
        evidence_count = Evidence.objects.filter(created_by=collection_id).count()

        topics = Topic.objects.filter(collection_id=int(collection_id))
        serialized_json = serializers.serialize('json', topics)
        topics_json = flattenSerializedJson(serialized_json)

        return HttpResponse(topics_json, status=status.HTTP_200_OK)


# This function gets recommended evidence for a piece of user-generated argument based on 
# 1) topic modeling result (only recommends documents from the same topic cluster)
def getEvidenceRecommendation(request):
    if request.method == 'POST':
        data = json.loads(request.body)

#        data = {}
#        data['text'] = 'Using brain imaging in humans, we showed that the lateral PFC is organized as a cascade of executive processes from premotor to anterior PFC regions that control behavior according to stimuli, the present perceptual context, and the temporal episode in which stimuli occur, respectively.'
        print data
        collection_id = int(data['collectionId'])
        name = names[collection_id]

        topic_dist, primary_topic_terms = TopicModeler.get_document_topics(data['text'], name)
        primary_topic_tuple = max(topic_dist, key=lambda x:x[1])
        output = {}
        output['topics'] = [{}]
        output['topics'][0]['terms'] = primary_topic_terms
        output['topics'][0]['prob'] = primary_topic_tuple[1]

#        evidence = getEvidenceRecommendationAcrossTopics(topic_dist, name)
        output['evidence'] = getEvidenceRecommendationWithinTopics(topic_dist, name, collection_id)[:100]

        return HttpResponse(json.dumps(output), status=status.HTTP_200_OK)

def getEvidenceRecommendationAcrossTopics(topic_dist, name):
    top_documents = TopicModeler.compute_documents_similarity(topic_dist, name)
    start_id = 62164 # TODO: change this based on corpus name
    evidence_ids = map(lambda id: id+start_id, top_documents)
    evidence = Evidence.objects.filter(id__in=evidence_ids)
    evidence = dict([(obj.id, obj) for obj in evidence])
    sorted_evidence = [evidence[id] for id in evidence_ids]
    serialized_json = serializers.serialize('json', sorted_evidence)
    evidence_json = flattenSerializedJson(serialized_json)
    return json.loads(evidence_json)

def getEvidenceRecommendationWithinTopics(topic_dist, name, collection_id):
    primary_topic_tuple = max(topic_dist, key=lambda x:x[1])
    evidence = Evidence.objects.filter(Q(evidencetopic__primary_topic=primary_topic_tuple[0])&Q(created_by=collection_id)).distinct() # use this if later needs to get evidence by topic
    serialized_json = serializers.serialize('json', evidence)
    evidence_json = flattenSerializedJson(serialized_json)
    evidence = json.loads(evidence_json)
    abstracts = [e['abstract'] for e in evidence]    
    evidence_ids = TopicModeler.compute_documents_similarity_sub(topic_dist, abstracts, name)
    sorted_evidence = map(lambda index:evidence[index], evidence_ids)
    print sorted_evidence
    return sorted_evidence

def getEvidenceByTopic(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        collection_id = data['collection_id']
        topic_id = data['topic_id']
        user_id = data['user_id']
        evidence = Evidence.objects.filter(Q(evidencetopic__created_by=collection_id)&Q(evidencetopic__primary_topic=topic_id)).order_by('-evidencetopic__primary_topic_prob').distinct()[:500]
        evidenceBookmarks = EvidenceBookmark.objects.filter(user_id=user_id)
        serialized_json = serializers.serialize('json', evidence)
        evidence_json = flattenSerializedJson(serialized_json)
        serialized_json = serializers.serialize('json', evidenceBookmarks)
        evidenceBookmark_json = flattenSerializedJson(serialized_json)
        output = {}
        output['evidence'] = json.loads(evidence_json)
        output['evidenceBookmarks'] = json.loads(evidenceBookmark_json)

        return HttpResponse(json.dumps(output), status=status.HTTP_200_OK)

def searchEvidenceByTitle(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        collection_id = data['collection_id']
        title = data['title']
        # DONE: we can alternatively change this to treat given title as a series of separated terms
        title_terms = title.split(' ')
        print title_terms
        evidence = Evidence.objects.filter(Q(created_by=collection_id)&reduce(lambda x, y: x & y, [Q(title__icontains=word) for word in title_terms]))
        serialized_json = serializers.serialize('json', evidence)
        evidence_json = flattenSerializedJson(serialized_json)
        evidence = json.loads(evidence_json)
        for e in evidence:
            e['dist'] = edit_distance(title, e['title'])
        evidence = sorted(evidence, key=lambda e:e['dist'])[:20]
        for e in evidence:
            e['topic'] = -1
            try:
                e['topic'] = EvidenceTopic.objects.get(evidence=e['id']).primary_topic
            except ObjectDoesNotExist:
                print 'warning: evidence with no topic'
        return HttpResponse(json.dumps(evidence), status=status.HTTP_200_OK)

    elif request.method == 'GET':
        collection_id = 13
        title = 'UpSet: Visualization of Intersecting Sets'
        evidence = Evidence.objects.filter(created_by=collection_id)
        serialized_json = serializers.serialize('json', evidence)
        evidence_json = flattenSerializedJson(serialized_json)
        evidence = json.loads(evidence_json)
        for e in evidence:
            e['dist'] = edit_distance(title, e['title'])
        evidence = sorted(evidence, key=lambda e:e['dist'])
        return HttpResponse(json.dumps(evidence[:20]), status=status.HTTP_200_OK)


def cacheTopics(request, collection_id):
    if request.method == 'GET':
        evidence_count = Evidence.objects.filter(created_by=collection_id).count()

        Topic.objects.filter(collection_id=collection_id).delete()

        topicList = TopicModeler.get_online_lda_topics(names[int(collection_id)], evidence_count / 10)

        for i in range(len(topicList)):
            topic_id = topicList[i][0]
            evidence_count = Evidence.objects.filter(Q(evidencetopic__primary_topic=topic_id)&Q(created_by=collection_id)).count()
            t = Topic(
                collection_id=collection_id,
                index=topic_id,
                terms=json.dumps(topicList[i][1]),
                document_count=evidence_count
            )
            t.save()

        return HttpResponse(json.dumps({}), status=status.HTTP_200_OK)    

def loadXploreData(request):
    user_id = 13
    Evidence.objects.filter(created_by=user_id).delete()
    if request.method == 'GET':
        entries = XploreParser.getEntries()
        for e in entries:
            meta_words = ['front cover', 'back cover', 'reviewer', 'editor', 'special section', 'advertisement', 'table of contents', 'visweek', 'keynote', 'capstone', 'tvcg', 'annual index', 'conference', 'committee', 'author index', 'cover2', 'cover3', 'ieee', 'vgtc', 'technical achievement', 'career award', 'corrections to', 'cover 4', 'cover4', 'prepages', 'call for participation', 'subject index', 'back matter', 'proposed']
            title = e['title'].lower()
            has_meta_word = False
            for w in meta_words:
                if w in title:
                    has_meta_word = True
            if has_meta_word:
                continue
            evidence = Evidence.objects.create_evidence(e['title'], e['abstract'], json.dumps({
                    'PUBID': e['publicationId'],                            
                    'AUTHOR': e['authors'],
                    'JOURNAL': 'IEEE Transactions on Visualization and Computer Graphics',
                    'DATE': e['date'],
                    'AFFILIATION': e['affiliations']
                }), user_id)
            print evidence
            #for t in e['terms']:
                #concept = Concept.objects.create_concept(t, user_id)
                # print concept
                #Association.objects.create_association('concept', 'evidence', concept.id, evidence.id, 0)

        return HttpResponse(json.dumps({}), status=status.HTTP_200_OK)

def augmentCollection(request, collection_id):
    if request.method == 'GET':
        if collection_id in names:
            return HttpResponse(json.dumps({warning: 'Collection already exists! Try with another collection id.'}), status=status.HTTP_304_NOT_MODIFIED)
        seeds = Evidence.objects.filter(Q(created_by=collection_id)&~Q(abstract=''))
        counter = 0
        for e in seeds:
#            print e.title
#            counter += 1
#            if counter < 183:
#                continue
#            if counter > 
            related_evidence = PubMedQuerier.get_related_evidence(e.title)
            print 'found ' + str(len(related_evidence)) + ' related evidence for ' + e.title
            for re in related_evidence:
                print 'adding related evidence: ' + re.title
                Evidence.objects.create_evidence(re.title, re.abstract, json.dumps({
                    'PMID': re.pmid,
                    'AUTHOR': re.authors_str,
                    'JOURNAL': re.journal,
                    'DATE': re.year,
                    'AFFILIATION': ''
                }), collection_id, 1)
        return HttpResponse(json.dumps({}), status=status.HTTP_200_OK)

# This is a special function that loads a large document collection, performs topic modeling over them,
# then caches the topic modeling results
# How do we cache the results in a way so that we can quickly estimate topic for a new piece of writing?
def loadBatchResults(request):
    if request.method == 'GET':
        print '>> loading batch result request...'
        current_dir = os.path.dirname(os.path.realpath(__file__))
        query = 'virtual reality'
        f = os.path.join(current_dir, 'batchresults', query + '.txt')
        PubMedParser.load_evidence(f, True, 12)
        
        return HttpResponse(json.dumps({}), status=status.HTTP_200_OK)

def loadOnlineLDA(request, collection_id):
    if request.method == 'GET':
        print '>> preparing stored evidence...'
        collection_id = int(collection_id)
        evidence = Evidence.objects.filter(created_by=collection_id)
        serialized_json = serializers.serialize('json', evidence)
        evidence_json = flattenSerializedJson(serialized_json)
        loaded_evidence = json.loads(evidence_json)
        abstracts = [e['abstract'] for e in loaded_evidence]
        evidencePks = [e['id'] for e in loaded_evidence]
        name = names[collection_id]
        print '>> loading lda model...'
        evidenceTopicMap, topicList = TopicModeler.load_online_lda(abstracts, evidencePks, name)
        print '>> saving topics for evidence...'
        saveTopicsForEvidence(evidenceTopicMap, collection_id)
        return HttpResponse(json.dumps({}), status=status.HTTP_200_OK)

def createOnlineLDA(request, collection_id):
    if request.method == 'GET':
        print '>> preparing data for online lda...'
        collection_id = int(collection_id)
        evidence = Evidence.objects.filter(created_by=collection_id)
        serialized_json = serializers.serialize('json', evidence)
        evidence_json = flattenSerializedJson(serialized_json)
        loaded_evidence = json.loads(evidence_json)
        abstracts = [e['abstract'] for e in loaded_evidence]
        evidencePks = [e['id'] for e in loaded_evidence]
        name = names[collection_id]
        numDocs = len(loaded_evidence)
        evidenceTopicMap, topics = TopicModeler.create_online_lda(abstracts, evidencePks, name, math.ceil(numDocs / 10))
#        saveTopicsForEvidence(evidenceTopicMap, collection_id)

        return HttpResponse(json.dumps({}), status=status.HTTP_200_OK)

def createSimilarityMatrix(request):
    if request.method == 'GET':
        # name = 'pfc and executive functions'
        name = 'visualization'
        TopicModeler.create_similarity_matrix(name)
        return HttpResponse(json.dumps({}), status=status.HTTP_200_OK)        

def saveTopicsForEvidence(evidenceTopicMap, user_id):
    print '>> saving evidence topic map...'
    EvidenceTopic.objects.filter(created_by=user_id).delete()    
    counter = 0
    for e in evidenceTopicMap:
        topic_dist = evidenceTopicMap[e]
        if len(topic_dist) == 0:
            counter += 1
            continue
        primary_topic_tuple = max(topic_dist, key=lambda x:x[1])
        EvidenceTopic.objects.create_entry(e, primary_topic_tuple[0], primary_topic_tuple[1], json.dumps(topic_dist), user_id)
        continue
    print '>> skipped ' + str(counter) + ' evidence with no topic distribution'
    return

