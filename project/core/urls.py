from django.conf.urls import patterns, include, url
from core.views import TextView, ConceptView, EvidenceView, DeleteEntryView, UserDataView

import views

urlpatterns = patterns('',    
    url(r'^api/v1/data/(?P<type>[a-zA-Z]+)/delete/$', DeleteEntryView.as_view(), name='delete_entry'), 

    url(r'^api/v1/data/texts/$', TextView.as_view(), name='text'),
    url(r'^api/v1/data/concepts/$', ConceptView.as_view(), name='concept'),
    url(r'^api/v1/data/evidence/$', EvidenceView.as_view(), name='evidence'),

    url(r'^api/v1/data/user-data/(?P<user_id>\d+)/$', UserDataView.as_view(), name='get_data_for_user'),

    url(r'^.*$', views.index, name='index'),
)
