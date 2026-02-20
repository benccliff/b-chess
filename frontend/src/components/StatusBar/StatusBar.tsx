import type { GameState } from "../../types/chess";

interface StatusBarProps {
  gameState: GameState;
  onNewGame: () => void;
}

const STATUS_MESSAGES: Record<string, string> = {
  active: "",
  check: "Check!",
  checkmate: "Checkmate!",
  stalemate: "Stalemate!",
  draw: "Draw (50-move rule).",
};

export default function StatusBar({ gameState, onNewGame }: StatusBarProps) {
  const isOver = gameState.status === "checkmate" || gameState.status === "stalemate" || gameState.status === "draw";
  const turnLabel = isOver
    ? gameState.status === "checkmate"
      ? `${gameState.turn === "white" ? "Black" : "White"} wins!`
      : STATUS_MESSAGES[gameState.status]
    : `${gameState.turn === "white" ? "White" : "Black"} to move${gameState.status === "check" ? " — Check!" : ""}`;

  return (
    <div style={styles.bar}>
      <span style={styles.label}>{turnLabel}</span>
      <button style={styles.button} onClick={onNewGame}>
        New Game
      </button>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  bar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 16px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    minWidth: "640px",
    marginTop: "16px",
  },
  label: {
    fontSize: "1.1rem",
    fontWeight: 600,
  },
  button: {
    padding: "8px 16px",
    fontSize: "1rem",
    cursor: "pointer",
    backgroundColor: "#4f46e5",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
  },
};
