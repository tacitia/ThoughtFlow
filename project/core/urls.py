from django.conf.urls import patterns, include, url
from core.views import TextView, ConceptView, EvidenceView, DeleteEntryView, UserDataView, UserAssociationView
from core.views import ConceptGrowthView, EvidenceSearchView, TermExtractionView
from core.views import association, deleteAssociation, retrieveEvidenceTextTopics, deleteBookmark

import views

urlpatterns = patterns('',    

    # For user created data
    url(r'^api/v1/data/texts/$', TextView.as_view(), name='text'),
    url(r'^api/v1/data/concepts/$', ConceptView.as_view(), name='concept'),
    url(r'^api/v1/data/evidence/$', EvidenceView.as_view(), name='evidence'),
    url(r'^api/v1/data/association/$', association, name='association'),

    # For data deletion
    url(r'^api/v1/data/association/delete/$', deleteAssociation, name='deleteAssociation'),
    url(r'^api/v1/data/bookmark/delete/$', deleteBookmark, name='deleteBookmark'),
    url(r'^api/v1/data/(?P<type>[a-zA-Z]+)/delete/$', DeleteEntryView.as_view(), name='delete_entry'), 


    # For service request (server may need to compute information / query PubMed)
    url(r'^api/v1/service/growConcept/$', ConceptGrowthView.as_view(), name='conceptGrowth'),
    url(r'^api/v1/service/searchEvidenceForTerms/$', EvidenceSearchView.as_view(), name='evidenceSearch'),
    url(r'^api/v1/service/extractTerms/$', TermExtractionView.as_view(), name='termExtraction'),
    url(r'^api/v1/service/retrieveEvidenceTextTopics/$', retrieveEvidenceTextTopics, name='retrieveEvidenceTextTopics'),

    # For data retrieval
    url(r'^api/v1/data/user-data/(?P<user_id>\d+)/$', UserDataView.as_view(), name='get_data_for_user'),
    url(r'^api/v1/data/user-associations/(?P<user_id>\d+)/$', UserAssociationView.as_view(), name='get_association_for_user'),

    url(r'^.*$', views.index, name='index'),
)
