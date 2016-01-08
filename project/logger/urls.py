from django.conf.urls import url
from logger.views import addAction

import views

urlpatterns = [   

    # For user created data
    url(r'^api/v1/action/add/$', addAction, name='addAction'),
]