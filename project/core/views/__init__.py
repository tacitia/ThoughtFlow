from views_service import *
from views_adhoc import *
from views_data import *
from django.views.decorators.csrf import ensure_csrf_cookie

@ensure_csrf_cookie
def index(request):
    template = 'core/index.html'
    context = {'DEBUG': settings.DEBUG}
    return render(request, template, context)