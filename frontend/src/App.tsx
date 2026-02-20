import { useCallback } from "react";
import { useGame } from "./hooks/useGame";
import { useSound } from "./hooks/useSound";
import GamePage from "./components/GamePage/GamePage";
import ErrorToast from "./components/ErrorToast/ErrorToast";
import type { GameStatus } from "./types/chess";

export default function App() {
  const { playNewGame, playMove, playCapture, playCheck, playGameEnd } = useSound();

  const handleGameEvent = useCallback(
    (status: GameStatus, isCapture: boolean) => {
      if (status === "check") playCheck();
      else if (status === "checkmate" || status === "stalemate" || status === "draw") playGameEnd();
      else if (isCapture) playCapture();
      else playMove();
    },
    [playCheck, playGameEnd, playCapture, playMove],
  );

  const { gameState, isLoading, error, clearError, startNewGame, submitMove } = useGame(playNewGame, handleGameEvent);

  return (
    <div style={styles.root}>
      {isLoading && !gameState && <p style={styles.loading}>Loading...</p>}
      {gameState && <GamePage gameState={gameState} onMove={submitMove} onNewGame={startNewGame} />}
      <ErrorToast message={error} onDismiss={clearError} />
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
};
