from django.conf import settings
from django.conf.urls import patterns, include, url
from django.contrib import admin
from rest_framework_nested import routers

from authentication.views import AccountViewSet, LoginView, LogoutView

router = routers.SimpleRouter()
router.register(r'accounts', AccountViewSet)

admin.autodiscover()

urlpatterns = patterns('',

    url(r'^api/v1/', include(router.urls)),
    url(r'^api/v1/auth/login/$', LoginView.as_view(), name='login'),
    url(r'^api/v1/auth/logout/$', LogoutView.as_view(), name='logout'),

    # API ESSENTIALS
    url(r'^api/token-auth/', 'rest_framework_jwt.views.obtain_jwt_token'),
    url(r'^api/docs/', include('rest_framework_swagger.urls')),

    # MEDIA PATH
    url(r'^media/(?P<path>.*)$', 'django.views.static.serve', {'document_root': settings.MEDIA_ROOT}),

    # ADMIN PATH
    url(r'^admin/', include(admin.site.urls)),

    url(r'^', include('logger.urls')),
    # CORE URLS
    url(r'^', include('core.urls')),
    # Don't add anything after the above line - core.urls contains a "catch all"
    # url at the end
)
