from django.contrib import admin

from game.models import GameResult


@admin.register(GameResult)
class GameResultAdmin(admin.ModelAdmin):
    list_display = ["player_name", "attempts", "result", "created_at"]
    list_filter = ["result", "created_at"]
    search_fields = ["player_name"]
