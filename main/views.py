from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework import generics, status
from main.models import News, Sentiment
from main.serializers import NewsSerializer, SentimentSerializer
from django.http import HttpResponse
from django.http.response import JsonResponse

# Create your views here.
def index(request):
    return render(request, 'index.html')

def error(request):
    return render(request, 'error.html')

class NewsAPIView(generics.ListCreateAPIView):
    permission_classes              = [] 
    authentication_classes          = [] 
    queryset                        = News.objects.all()
    serializer_class                = NewsSerializer

class SentimentAPIView(generics.ListCreateAPIView):
    permission_classes              = [] 
    authentication_classes          = [] 
    queryset                        = Sentiment.objects.all()
    serializer_class                = SentimentSerializer    


def sentiment_list(request):
    if request.method == 'GET':
        categories = Sentiment.objects.all()
        serializer = SentimentSerializer(categories, many=True)
        response = {
            
            'list' : serializer.data
        }
        return JsonResponse(response)                  