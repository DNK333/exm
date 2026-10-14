from rest_framework.test import APITestCase

from game.models import GameResult


class GameResultApiTests(APITestCase):
    def test_get_returns_saved_results(self):
        result = GameResult.objects.create(
            player_name="Магомед",
            attempts=3,
            result=GameResult.Result.WIN,
        )

        response = self.client.get("/game-results/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data[0]["id"], result.id)
        self.assertEqual(response.data[0]["player_name"], "Магомед")

    def test_post_creates_a_result(self):
        response = self.client.post(
            "/game-results/",
            {
                "player_name": "Магомед",
                "attempts": 7,
                "result": "lose",
            },
            format="json",
        )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(GameResult.objects.count(), 1)
        self.assertEqual(GameResult.objects.get().result, "lose")

    def test_post_rejects_invalid_attempt_count(self):
        response = self.client.post(
            "/game-results/",
            {
                "player_name": "Игрок",
                "attempts": 8,
                "result": "lose",
            },
            format="json",
        )

        self.assertEqual(response.status_code, 400)
