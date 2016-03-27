import math
import json
import os
import pprint
import PubMedQuerier
import PubMedParser
import random
import TermExtractor
import TopicModeler
import XploreParser
import AMinerParser
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

from django.core.exceptions import ObjectDoesNotExist, MultipleObjectsReturned
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

def serializePaperMetadata(pubid, author, journal, date, affiliation):
    return json.dumps({
        'PUBID': pubid,                            
        'AUTHOR': author,
        'JOURNAL': journal,
        'DATE': date,
        'AFFILIATION': affiliation
    })    

def cacheTopics(request, collection_id):
    if request.method == 'GET':
        evidence_count = Evidence.objects.filter(created_by=collection_id).count()

        Topic.objects.filter(collection_id=collection_id).delete()
        collection_name = Collection.objects.get(collection_id=int(collection_id)).collection_name
        topicList = TopicModeler.get_online_lda_topics(collection_name, evidence_count / 10)

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

def loadCHIData(request):
    user_id = 18
    Evidence.objects.filter(created_by=user_id).delete()
    if request.method == 'GET':
        entries = AMinerParser.getEntries()
#        counter = 0
        for e in entries:
#            counter += 1
#            if counter <= 9907:
#                continue
            evidence = Evidence.objects.create_evidence(e['title'], e['abstract'], serializePaperMetadata(e['index'], e['authors'], e['venue'], e['date'], e['affiliations']), user_id, 0)
        
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
            evidence = Evidence.objects.create_evidence(e['title'], e['abstract'], serializePaperMetadata(e['publicationId'], e['authors'], 'IEEE Transactions on Visualization and Computer Graphics', e['date'], e['affiliations']), user_id, 0)
            #for t in e['terms']:
                #concept = Concept.objects.create_concept(t, user_id)
                # print concept
                #Association.objects.create_association('concept', 'evidence', concept.id, evidence.id, 0)

        return HttpResponse(json.dumps({}), status=status.HTTP_200_OK)

def getRefsAndCitedin(pmid, citation_map):
    refs_key = str(pmid) + '-refs'
    citedin_key = str(pmid) + '-citedin'
    refs = []
    citedin = []
    if refs_key in citation_map:
        refs = citation_map[refs_key]
    if citedin_key in citation_map:
        citedin = citation_map[citedin_key]
    return refs, citedin

def completeCitationInfoAMiner(collection_id):
    rawCitations = AMinerParser.getCitations()
    counter = 0
    duplicates = 0
    for c in rawCitations:
        counter += 1
        print counter
        if counter < 135:
            continue
        try:
            paper = Evidence.objects.get(title=c['paper'],created_by=collection_id)
        except MultipleObjectsReturned:
            duplicates += 1
            print 'duplicate title'
            print c['paper']
            print duplicates
            continue
        try:
            citation = Evidence.objects.get(title=c['citation'],created_by=collection_id)
        except MultipleObjectsReturned:
            duplicates += 1
            print 'duplicate title'
            print c['citation']
            print duplicates
            continue        
        Citation.objects.get_or_create(paper_id=paper.id, citation_id=citation.id, collection_id=collection_id)
    return

def completeCitationInfo(request, collection_id):
    if request.method == 'GET':
        if collection_id == '18':
            completeCitationInfoAMiner(collection_id)
        else:
            evidence = Evidence.objects.filter(created_by=collection_id)
            start = 243
            counter = 1
            for e in evidence:
                if counter < start:
                    counter += 1
                    continue
                print '>> Processing entry ' + str(counter) + ' out of ' + str(evidence.count())
                unicodeTitle = e.title.encode('utf-8')    
                related_evidence, citation_map, pmid = PubMedQuerier.get_related_evidence(unicodeTitle)
                refs, citedin = getRefsAndCitedin(pmid, citation_map)
                print 'found ' + str(len(refs)) + ' ref, ' + str(len(citedin)) + ' citedin'
                for re in related_evidence:
                    re_objects = Evidence.objects.filter(title=re.title,created_by=collection_id)
                    # here paper_id cites citation_id
                    for re_object in re_objects:
                        if re.pmid in refs:
                            Citation.objects.get_or_create(paper_id=e.id, citation_id=re_object.id, collection_id=collection_id)
                        if re.pmid in citedin:
                            Citation.objects.get_or_create(paper_id=re_object.id, citation_id=e.id, collection_id=collection_id) 
                counter += 1      
        return HttpResponse(json.dumps({}), status=status.HTTP_200_OK)

def augmentCollection(request, collection_id, seed_level):
    if request.method == 'GET':
        if collection_id in names:
            return HttpResponse(json.dumps({warning: 'Collection already exists! Try with another collection id.'}), status=status.HTTP_304_NOT_MODIFIED)
        seeds = Evidence.objects.filter(Q(created_by=collection_id)&~Q(abstract='')&Q(augmentation=seed_level))
        counter = 0
        for e in seeds:
            counter += 1
            print 'processing entry #' + str(counter) + ' out of ' + str(seeds.count())
            unicodeTitle = e.title.encode('utf-8')
            related_evidence, citation_map, pmid = PubMedQuerier.get_related_evidence(unicodeTitle)
            print 'found ' + str(len(related_evidence)) + ' related evidence for ' + unicodeTitle
            refs, citedin = getRefsAndCitedin(pmid, citation_map)    
            for re in related_evidence:
                re_object = Evidence.objects.create_evidence(re.title, re.abstract, serializePaperMetadata(re.pmid,re.authors_str,re.journal,re.year,''), collection_id, int(seed_level)+1)          
                if re.pmid in refs:
                    Citation.objects.get_or_create(paper_id=e.id, citation_id=re_object.id, collection_id=collection_id)
                if re.pmid in citedin:
                    Citation.objects.get_or_create(paper_id=re_object.id, citation_id=e.id, collection_id=collection_id)

        return HttpResponse(json.dumps({}), status=status.HTTP_200_OK)

# This is a special function that loads a large document collection, performs topic modeling over them,
# then caches the topic modeling results
# How do we cache the results in a way so that we can quickly estimate topic for a new piece of writing?
def loadBatchResults(request):
    if request.method == 'GET':
        print '>> loading batch result request...'
        current_dir = os.path.dirname(os.path.realpath(__file__))
        query = '"cognitive effort"'
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
        name = Collection.objects.get(collection_id=collection_id).collection_name
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
        name = Collection.objects.get(collection_id=collection_id).collection_name
        numDocs = len(loaded_evidence)
        evidenceTopicMap, topics = TopicModeler.create_online_lda(abstracts, evidencePks, name, math.ceil(numDocs / 50))
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

def insertDefaultCollections(request):
    if request.method == 'GET':
        descriptions = {}
        descriptions[11] = 'PubMed search queries "cognitive control", "executive functions", and "prefrontal cortex"';
        descriptions[12] = 'PubMed search query "virtual reality"';
        descriptions[13] = 'PubMed entries related to entries from a bibtex file compiled by a diffusion tensor imaging researcher';
        for id in names:
            description = ''
            if id in descriptions:
                description = descriptions[id]
            Collection.objects.get_or_create(collection_id=id, collection_name=names[id], description=description)
        return HttpResponse({}, status=status.HTTP_200_OK)
