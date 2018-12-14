


from django.contrib import admin
from django.urls import path
from . import views
from .views import NewsAPIView, SentimentAPIView


urlpatterns = [
    path('', views.index, name='index'), #main page (main graph) 
    path('news-endpoint', NewsAPIView.as_view()),
    #path('sentiment-endpoint', SentimentAPIView.as_view()),
    path('sentiment-endpoint',views.sentiment_list)
    

]

