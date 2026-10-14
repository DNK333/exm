from django.contrib import admin
from django.urls import include, path
from rest_framework.routers import DefaultRouter

from game.views import GameResultViewSet


router = DefaultRouter()
router.register("game-results", GameResultViewSet, basename="game-result")

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", include(router.urls)),
]
