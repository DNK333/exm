from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="GameResult",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("player_name", models.CharField(max_length=100, verbose_name="имя игрока")),
                ("attempts", models.PositiveSmallIntegerField(verbose_name="попытки")),
                (
                    "result",
                    models.CharField(
                        choices=[("win", "Победа"), ("lose", "Поражение")],
                        max_length=4,
                        verbose_name="результат",
                    ),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True, verbose_name="дата игры")),
            ],
            options={
                "verbose_name": "результат игры",
                "verbose_name_plural": "результаты игр",
                "ordering": ["-created_at"],
            },
        ),
    ]
