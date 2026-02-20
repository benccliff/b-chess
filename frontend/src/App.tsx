import { useGame } from "./hooks/useGame";
import GamePage from "./components/GamePage/GamePage";

export default function App() {
  const { gameState, isLoading, error, startNewGame, submitMove } = useGame();

  return (
    <div style={styles.root}>
      {isLoading && !gameState && <p style={styles.loading}>Loading...</p>}
      {error && <p style={styles.error}>{error}</p>}
      {gameState && <GamePage gameState={gameState} onMove={submitMove} onNewGame={startNewGame} />}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  root: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1a1a2e",
    fontFamily: "sans-serif",
  },
  loading: {
    color: "#fff",
    fontSize: "1.2rem",
  },
  error: {
    color: "#f87171",
    fontSize: "1rem",
  },
};
