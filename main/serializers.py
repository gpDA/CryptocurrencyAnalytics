from rest_framework import serializers
from main.models import News, Sentiment
from rest_framework import status


class NewsSerializer(serializers.ModelSerializer):

    class Meta:
        model = News
        fields = '__all__'

class SentimentSerializer(serializers.ModelSerializer):

    # list      = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = Sentiment
        fields = '__all__'

