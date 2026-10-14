import { useEffect, useState } from "react";
import axios from "axios";

const MAX_ATTEMPTS = 7;

function App() {
  const [playerName, setPlayerName] = useState("");
  const [guess, setGuess] = useState("");
  const [game, setGame] = useState(null);
  const [results, setResults] = useState([]);
  const [resultsLoading, setResultsLoading] = useState(true);
  const [resultsError, setResultsError] = useState("");
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    let cancelled = false;

    axios
      .get("/game-results/")
      .then(({ data }) => {
        if (!cancelled) {
          setResults(data);
          setResultsError("");
        }
      })
      .catch(() => {
        if (!cancelled) {
          setResultsError("Не удалось загрузить результаты. Обновите страницу.");
        }
      })
      .finally(() => {
        if (!cancelled) {
          setResultsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const startGame = (event) => {
    event.preventDefault();
    if (!playerName.trim()) return;

    setGame({
      secret: Math.floor(Math.random() * 100) + 1,
      attempts: 0,
      status: "playing",
      hint: "Число загадано. Введите число от 1 до 100.",
    });
    setGuess("");
    setSaveError("");
  };

  const finishGame = async (status, attempts) => {
    setGame((current) => ({ ...current, status }));
    try {
      const { data } = await axios.post("/game-results/", {
        player_name: playerName.trim(),
        attempts,
        result: status,
      });
      setResults((current) => [data, ...current]);
      setSaveError("");
    } catch {
      setSaveError("Не удалось сохранить результат. Проверьте соединение и попробуйте обновить страницу.");
    }
  };

  const submitGuess = async (event) => {
    event.preventDefault();
    if (!game || game.status !== "playing") return;

    const number = Number(guess);
    if (!Number.isInteger(number) || number < 1 || number > 100) {
      setGame((current) => ({
        ...current,
        hint: "Введите целое число от 1 до 100.",
      }));
      return;
    }

    const attempts = game.attempts + 1;
    if (number === game.secret) {
      setGame((current) => ({
        ...current,
        attempts,
        hint: "Угадано 🎉",
      }));
      await finishGame("win", attempts);
    } else if (attempts === MAX_ATTEMPTS) {
      setGame((current) => ({
        ...current,
        attempts,
        hint: `Попытки закончились. Было загадано число ${game.secret}.`,
      }));
      await finishGame("lose", attempts);
    } else {
      setGame((current) => ({
        ...current,
        attempts,
        hint: number < game.secret ? "Загаданное число больше ↑" : "Загаданное число меньше ↓",
      }));
    }
    setGuess("");
  };

  const resetGame = () => {
    setGame(null);
    setGuess("");
    setSaveError("");
  };

  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Угадай число — на главную">
          <span className="brand-mark">?</span>
          <span>Игра на внимательность</span>
        </a>
        <span className="topbar-note">Раунд от 1 до 100</span>
      </header>

      <section className="hero" aria-labelledby="page-title">
        <div className="hero-copy">
          <span className="eyebrow"><span className="live-dot" /> ГОТОВЫ ИСПЫТАТЬ УДАЧУ?</span>
          <h1 id="page-title">Угадай<br />загаданное <span>число.</span></h1>
          <p>Компьютер загадал число от 1 до 100. У тебя есть семь попыток, чтобы его найти.</p>
          <div className="rules">
            <div><span className="rule-icon">01</span><span>Введи число<br /><strong>от 1 до 100</strong></span></div>
            <div><span className="rule-icon">02</span><span>Следуй подсказкам<br /><strong>больше или меньше</strong></span></div>
            <div><span className="rule-icon">03</span><span>Успей за<br /><strong>7 попыток</strong></span></div>
          </div>
        </div>

        <section className="game-card" aria-label="Игровая панель">
          <div className="card-topline">
            <span className="card-label">ТВОЯ ИГРА</span>
            <span className={`status-pill ${game?.status === "playing" ? "status-active" : ""}`}>
              <span />{game?.status === "playing" ? "ИДЁТ ИГРА" : "НОВЫЙ РАУНД"}
            </span>
          </div>

          {!game ? (
            <form className="start-form" onSubmit={startGame}>
              <div className="number-orb" aria-hidden="true">?</div>
              <h2>Сначала познакомимся</h2>
              <p>Введи имя, чтобы начать игру и попасть в таблицу результатов.</p>
              <label htmlFor="player-name">ТВОЁ ИМЯ</label>
              <input
                id="player-name"
                type="text"
                maxLength={100}
                placeholder="Например, Магомед"
                value={playerName}
                onChange={(event) => setPlayerName(event.target.value)}
                required
              />
              <button className="primary-button" type="submit">
                Начать игру <span aria-hidden="true">→</span>
              </button>
            </form>
          ) : (
            <div className="playing-panel">
              <div className="round-caption">ИГРОК <strong>{playerName.trim()}</strong></div>
              <div className="number-orb playing-orb" aria-hidden="true">
                {game.status === "playing" ? "?" : game.status === "win" ? "✓" : "×"}
              </div>
              <p className={`hint ${game.status === "win" ? "hint-win" : ""}`} aria-live="polite">
                {game.hint}
              </p>
              <div className="attempt-counter">
                <span>ПОПЫТКИ</span>
                <strong>{game.attempts}<small> / {MAX_ATTEMPTS}</small></strong>
              </div>
              {game.status === "playing" ? (
                <form className="guess-form" onSubmit={submitGuess}>
                  <label htmlFor="guess">ТВОЁ ПРЕДПОЛОЖЕНИЕ</label>
                  <div className="guess-controls">
                    <input
                      id="guess"
                      type="number"
                      min="1"
                      max="100"
                      step="1"
                      inputMode="numeric"
                      placeholder="?"
                      value={guess}
                      onChange={(event) => setGuess(event.target.value)}
                      autoFocus
                      required
                    />
                    <button className="primary-button" type="submit">Проверить <span>→</span></button>
                  </div>
                </form>
              ) : (
                <button className="primary-button restart-button" type="button" onClick={resetGame}>
                  Начать заново <span>↻</span>
                </button>
              )}
              {saveError && <p className="error-message" role="alert">{saveError}</p>}
            </div>
          )}
        </section>
      </section>

      <section className="results-section" aria-labelledby="results-title">
        <div className="section-heading">
          <div>
            <span className="eyebrow">ИСТОРИЯ ИГР</span>
            <h2 id="results-title">Последние результаты</h2>
          </div>
          <span className="results-count">{results.length} {results.length === 1 ? "ИГРА" : "ИГР"}</span>
        </div>
        {resultsError && <p className="error-message results-error" role="alert">{resultsError}</p>}
        <div className="results-table-wrap">
          <table className="results-table">
            <thead>
              <tr><th>ИГРОК</th><th>ПОПЫТКИ</th><th>РЕЗУЛЬТАТ</th><th>ДАТА</th></tr>
            </thead>
            <tbody>
              {resultsLoading ? (
                <tr><td className="empty-state" colSpan="4">Загружаем результаты…</td></tr>
              ) : results.length === 0 ? (
                <tr><td className="empty-state" colSpan="4">Пока нет игр — сыграй первым!</td></tr>
              ) : (
                results.map((result) => (
                  <tr key={result.id}>
                    <td className="player-cell"><span className="avatar">{result.player_name.charAt(0).toUpperCase()}</span>{result.player_name}</td>
                    <td>{result.attempts} <span className="muted-cell">из {MAX_ATTEMPTS}</span></td>
                    <td><span className={`result-badge ${result.result === "win" ? "badge-win" : "badge-lose"}`}>
                      {result.result === "win" ? "ПОБЕДА" : "ПОРАЖЕНИЕ"}
                    </span></td>
                    <td className="muted-cell">{new Date(result.created_at).toLocaleDateString("ru-RU")}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <footer className="footer">
        <span>Угадай число <span className="footer-dot">•</span> Тренируй интуицию</span>
        <span>Сделано для хорошего настроения <span aria-label="улыбка">☺</span></span>
      </footer>
    </main>
  );
}

export default App;
