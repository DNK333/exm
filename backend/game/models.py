from django.db import models


class GameResult(models.Model):
    class Result(models.TextChoices):
        WIN = "win", "Победа"
        LOSE = "lose", "Поражение"

    player_name = models.CharField("имя игрока", max_length=100)
    attempts = models.PositiveSmallIntegerField("попытки")
    result = models.CharField("результат", max_length=4, choices=Result.choices)
    created_at = models.DateTimeField("дата игры", auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "результат игры"
        verbose_name_plural = "результаты игр"

    def __str__(self):
        return f"{self.player_name}: {self.get_result_display()}"
