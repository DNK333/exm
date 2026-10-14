from rest_framework import serializers

from game.models import GameResult


class GameResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = GameResult
        fields = ["id", "player_name", "attempts", "result", "created_at"]
        read_only_fields = ["id", "created_at"]

    def validate_player_name(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError("Укажите имя игрока.")
        return value

    def validate_attempts(self, value):
        if value < 1 or value > 7:
            raise serializers.ValidationError(
                "Количество попыток должно быть от 1 до 7."
            )
        return value
