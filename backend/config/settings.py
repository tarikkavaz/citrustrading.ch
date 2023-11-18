import os
from pathlib import Path
from django.utils.translation import gettext_lazy as _

# Environment variables
ENVIRONMENT = os.getenv('ENVIRONMENT', default='local')

# Common settings
BASE_DIR = Path(__file__).resolve().parent.parent
SECRET_KEY = 'django-insecure-et^72^ib$yz@ggxs#e!enovydb$(^xw(%&@a^8#l--_=l5lfat'
DEBUG = True if ENVIRONMENT == 'local' else False

# Dynamic ALLOWED_HOSTS
if DEBUG:
    ALLOWED_HOSTS = ['0.0.0.0', 'localhost', '127.0.0.1', 'backend', 'frontend']
else:
    ALLOWED_HOSTS = ['orangekaos.com', 'www.orangekaos.com', '167.71.70.128']

# Dynamic CORS_ALLOWED_ORIGINS
CORS_ALLOWED_ORIGINS = [
    f"http://{host}:{port}" for host in ALLOWED_HOSTS for port in ['8000', '3000']
] + [
    f"https://{host}" for host in ALLOWED_HOSTS
]

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    'content',
    'ckeditor',
    'ckeditor_uploader',
    'adminsortable2',
    'django_select2',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'django.middleware.common.CommonMiddleware',
]

ROOT_URLCONF = 'config.urls'
WSGI_APPLICATION = 'config.wsgi.application'

# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# Internationalization
LANGUAGE_CODE = 'en-us'
LANGUAGES = [('en', _('English')), ('tr', _('Turkish'))]
TIME_ZONE = 'UTC'
USE_I18N = True
USE_L10N = True
USE_TZ = True

# Templates
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# Static and media files
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'static_root')
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# REST FRAMEWORK and CORS
CORS_ALLOW_ALL_ORIGINS = False
CORS_ALLOWED_ORIGINS = CORS_ALLOWED_ORIGINS
CSRF_TRUSTED_ORIGINS = CORS_ALLOWED_ORIGINS

# CKEDITOR
CKEDITOR_UPLOAD_PATH = 'uploads/ckeditor/'
CKEDITOR_CONFIGS = {
    'default': {
        'toolbar': 'Full',
        'toolbar_Full': [
            ['Styles', 'Format', 'Bold', 'Italic', 'Underline', 'Undo', 'Redo'],
            ['BulletedList', 'NumberedList'],
            ['Link', 'Unlink', 'Anchor'],
            ['Image', 'Table', 'HorizontalRule'],
            ['Smiley', 'SpecialChar'], 
            ['Source'],
        ]
    },
}

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
