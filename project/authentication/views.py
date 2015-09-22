import json

from django.contrib.auth import authenticate, login
from django.http import HttpResponse, JsonResponse

from rest_framework import status, permissions, viewsets
from rest_framework.views import View

from authentication.models import Account
from authentication.permissions import IsAccountOwner
from authentication.serializers import AccountSerializer

from django.contrib.auth import logout

class AccountViewSet(viewsets.ModelViewSet):
    lookup_field = 'username'
    queryset = Account.objects.all()
    serializer_class = AccountSerializer

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return (permissions.AllowAny(),)

        if self.request.method == 'POST':
            return (permissions.AllowAny(),)

        return (permissions.IsAuthenticated(), IsAccountOwner(),)

    def create(self, request):
        serializer = self.serializer_class(data=request.data)

        print serializer.is_valid()

        if serializer.is_valid():
            Account.objects.create_user(**serializer.validated_data)

            return HttpResponse(status=status.HTTP_201_CREATED)

        return HttpResponse(status=status.HTTP_400_BAD_REQUEST)


class LoginView(View):
    def post(self, request, format=None):

        data = json.loads(request.body)

        email = data.get('email', None)
        password = data.get('password', None)

        account = authenticate(email=email, password=password)

        if account is not None:
            if account.is_active:
                login(request, account)

                serialized = AccountSerializer(account)

                return JsonResponse(serialized.data)
            else:
                return JsonResponse({
                    'status': 'Unauthorized',
                    'message': 'This account has been disabled.'
                }, status=status.HTTP_401_UNAUTHORIZED)
        else:
            return JsonResponse({
                'status': 'Unauthorized',
                'message': 'Username/password combination invalid.'
            }, status=status.HTTP_401_UNAUTHORIZED)


class LogoutView(View):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, format=None):
        logout(request)

        return Response({}, status=status.HTTP_204_NO_CONTENT)
