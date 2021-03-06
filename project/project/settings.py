# !/usr/bin/python

import os

# CUSTOM PATH SETTINGS
PROJECT_DIR = os.path.dirname(os.path.dirname(__file__))
REPO_DIR = os.path.realpath(os.path.join(PROJECT_DIR, '..'))
HOME_DIR = os.path.realpath(os.path.join(REPO_DIR, '..'))
STATIC_DIR = os.path.realpath(os.path.join(HOME_DIR, 'staticfiles'))
MEDIA_DIR = os.path.realpath(os.path.join(HOME_DIR, 'media'))

# Generate a secret_key at: http://www.miniwebtool.com/django-secret-key-generator/
SECRET_KEY = '4pj+-=v^pwzo$dy=gde=6^xkvy*(f5azz*fn^^&dzt8f6f9d%9'

DEBUG = True

ADMINS = [('Hua', 'lillian.g621@gmail.com')]
ALLOWED_HOSTS = ['*']

INSTALLED_APPS = (
    # Django
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Third part
    'rest_framework',
    'rest_framework_swagger',
    'autoslug',
    'django_seo_js',

    # Apps
    'core',
    'authentication',
    'logger',
)

REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.DjangoModelPermissionsOrAnonReadOnly',
    ),
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework.authentication.BasicAuthentication',
        'rest_framework_jwt.authentication.JSONWebTokenAuthentication',
    ),
}

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.locale.LocaleMiddleware',
    'django.contrib.admindocs.middleware.XViewMiddleware',
    'django.middleware.common.CommonMiddleware',
)

# Django SEO JS settings
MIDDLEWARE_CLASSES = (
    'django_seo_js.middleware.HashBangMiddleware',  # If you're using #!
    'django_seo_js.middleware.UserAgentMiddleware',  # If you want to detect by user agent
) + MIDDLEWARE_CLASSES

SEO_JS_ENABLED = True
SEO_JS_BACKEND = 'django_seo_js.backends.PrerenderHosted'
SEO_JS_PRERENDER_URL = 'http://localhost:8555/'  # Note trailing slash.
SEO_JS_PRERENDER_RECACHE_URL = 'http://localhost:8555/recache'

SEO_JS_USER_AGENTS = [
    'Googlebot',
    'Yahoo',
    'bingbot',
    'Badiu',
    'Ask Jeeves',
    'baiduspider',
    'twitterbot',
    'facebookexternalhit',
    'rogerbot',
    'linkedinbot',
    'embedly',
    'quora link preview',
    'showyoubot',
    'outbrain',
    'pinterest',
    'slackbot'
]

TEMPLATES = [
{
    'BACKEND': 'django.template.backends.django.DjangoTemplates',
    'DIRS': [
        os.path.join(PROJECT_DIR, 'templates'),
    ],
    'APP_DIRS': True,
    'OPTIONS': {
        'context_processors':
            (
            'django.contrib.auth.context_processors.auth',
            'django.template.context_processors.debug',
            'django.template.context_processors.i18n',
            'django.template.context_processors.media',
            'django.template.context_processors.static',
            'django.template.context_processors.tz',
            'django.template.context_processors.csrf',
            'django.template.context_processors.request',
            'django.contrib.messages.context_processors.messages',
            )
    }
},
]

SWAGGER_SETTINGS = {
    "exclude_namespaces": [],  # List URL namespaces to ignore
    "api_version": '1.0',  # Specify your API's version
    "api_path": "",  # Specify the path to your API not a root level
    "enabled_methods": [  # Specify which methods to enable in Swagger UI
      'get',
      'post',
      'put',
      'patch',
      'delete'
    ],
    "api_key": '',  # An API key
    "is_authenticated": True,  # Set to True to enforce user authentication,
    "is_superuser": True,  # Set to True to enforce admin only access
}

ROOT_URLCONF = 'project.urls'
WSGI_APPLICATION = 'project.wsgi.application'


# Database
# https://docs.djangoproject.com/en/1.7/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'ng_thoughtnet',
        'USER': 'root',
        'PASSWORD': 'root',
        'HOST': '/Applications/MAMP/tmp/mysql/mysql.sock',
        'PORT': '5432',
    },
    'sqlite3': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(PROJECT_DIR, 'db.sqlite3'),
    }
}

# Internationalization
# https://docs.djangoproject.com/en/1.7/topics/i18n/

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_L10N = True
USE_TZ = True


# Staticfiles settings
STATIC_ROOT = STATIC_DIR
STATIC_URL = "/static/"

STATICFILES_DIRS = (
    os.path.join(REPO_DIR, "staticfiles"),
    os.path.join(REPO_DIR, "bower_components"),
)

# Media settings
MEDIA_ROOT = MEDIA_DIR
MEDIA_URL = "/media/"


AUTH_USER_MODEL = 'authentication.Account'
