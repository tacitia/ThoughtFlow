from django.conf.urls import include, url
from core.views import TextView, ConceptView, EvidenceView, DeleteEntryView, UserDataView, UserAssociationView
from core.views import ConceptGrowthView, EvidenceSearchView, TermExtractionView
from core.views import association, deleteAssociation, retrieveEvidenceTextTopics, addBookmark, deleteBookmark
from core.views import loadBatchResults, createOnlineLDA, loadOnlineLDA, createSimilarityMatrix, cacheTopics
from core.views import getEvidenceRecommendation, getEvidenceByTopic, searchEvidenceByTitle
from core.views import getEvidenceCollection
from core.views import loadXploreData

import views

urlpatterns = [

    # For user created data
    url(r'^api/v1/data/texts/(?P<user_id>\d+)/$', TextView.as_view(), name='text'),
    url(r'^api/v1/data/concepts/$', ConceptView.as_view(), name='concept'),
    url(r'^api/v1/data/evidence/(?P<user_id>\d+)/$', EvidenceView.as_view(), name='evidence'),
    url(r'^api/v1/data/association/$', association, name='association'),
    url(r'^api/v1/data/bookmark/$', addBookmark, name='addBookmark'), 

    # For data deletion
    url(r'^api/v1/data/association/delete/$', deleteAssociation, name='deleteAssociation'),
    url(r'^api/v1/data/bookmark/delete/$', deleteBookmark, name='deleteBookmark'),    
    url(r'^api/v1/data/(?P<type>[a-zA-Z]+)/delete/$', DeleteEntryView.as_view(), name='delete_entry'), 

    # For service request (server may need to compute information / query PubMed)
    url(r'^api/v1/service/growConcept/$', ConceptGrowthView.as_view(), name='conceptGrowth'),
    url(r'^api/v1/service/searchEvidenceForTerms/$', EvidenceSearchView.as_view(), name='evidenceSearch'),
    url(r'^api/v1/service/extractTerms/$', TermExtractionView.as_view(), name='termExtraction'),
    url(r'^api/v1/service/retrieveEvidenceTextTopics/$', retrieveEvidenceTextTopics, name='retrieveEvidenceTextTopics'),
    url(r'^api/v1/service/getEvidenceRecommendation/$', getEvidenceRecommendation, name='getEvidenceRecommendation'),
    url(r'^api/v1/service/getEvidenceByTopic/$', getEvidenceByTopic, name='getEvidenceByTopic'),
    url(r'^api/v1/service/searchEvidenceByTitle/$', searchEvidenceByTitle, name='searchEvidenceByTitle'),

    # For batch data retrieval
    url(r'^api/v1/data/user-data/(?P<user_id>\d+)/$', UserDataView.as_view(), name='get_data_for_user'),
    url(r'^api/v1/data/user-associations/(?P<user_id>\d+)/$', UserAssociationView.as_view(), name='get_association_for_user'),
    url(r'^api/v1/data/collection/(?P<collection_id>\d+)/$', getEvidenceCollection, name='getEvidenceCollection'), 

    url(r'^api/v1/ad-hoc/loadBatchResults/$', loadBatchResults, name='loadBatchResults'),
    url(r'^api/v1/ad-hoc/createOnlineLDA/$', createOnlineLDA, name='createOnlineLDA'),
    url(r'^api/v1/ad-hoc/loadOnlineLDA/$', loadOnlineLDA, name='loadOnlineLDA'),
    url(r'^api/v1/ad-hoc/createSimilarityMatrix/$', createSimilarityMatrix, name='createSimilarityMatrix'),
    url(r'^api/v1/ad-hoc/cacheTopics/(?P<collection_id>\d+)/$', cacheTopics, name='cacheTopics'),
    url(r'^api/v1/ad-hoc/loadXploreData/$', loadXploreData, name='loadXploreData'),

    url(r'^.*$', views.index, name='index')
]
