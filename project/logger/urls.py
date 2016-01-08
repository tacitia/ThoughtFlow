from django.conf.urls import patterns, include, url
from logger.views import addAction

import views

urlpatterns = patterns('',    

    # For user created data
    url(r'^api/v1/action/add/$', addAction, name='addAction'),
)