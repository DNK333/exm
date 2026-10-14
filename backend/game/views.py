from rest_framework.viewsets import ModelViewSet

from game.models import GameResult
from game.serializers import GameResultSerializer


class GameResultViewSet(ModelViewSet):
    queryset = GameResult.objects.all()
    serializer_class = GameResultSerializer
    http_method_names = ["get", "post", "head", "options"]
