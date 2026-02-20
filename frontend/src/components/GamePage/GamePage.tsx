import { useState, useCallback } from "react";
import type { GameState, HistoryEntry, PieceType } from "../../types/chess";
import BoardCoords from "../BoardCoords/BoardCoords";
import StatusBar from "../StatusBar/StatusBar";
import PromotionModal from "../PromotionModal/PromotionModal";
import MoveTracker from "../MoveTracker/MoveTracker";
import { useSelectedSquare } from "../../hooks/useSelectedSquare";
import { buildPGN } from "../../utils/pgn";

interface GamePageProps {
  gameState: GameState;
  moveHistory: HistoryEntry[];
  onMove: (fromSq: string, toSq: string, promotion?: PieceType) => void;
  onNewGame: () => void;
}

export default function GamePage({ gameState, moveHistory, onMove, onNewGame }: GamePageProps) {
  const [flipped, setFlipped] = useState(false);
  const [copied, setCopied] = useState(false);

  const { selectedSquare, legalTargets, pendingPromotion, handleSquareClick, handlePromotionChoice } =
    useSelectedSquare(gameState, onMove);

  const isOver =
    gameState.status === "checkmate" || gameState.status === "stalemate" || gameState.status === "draw";

  const handleFlip = useCallback(() => setFlipped((f) => !f), []);

  const handleSharePgn = useCallback(() => {
    const pgn = buildPGN(moveHistory, gameState.status);
    navigator.clipboard.writeText(pgn).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [moveHistory, gameState.status]);

  return (
    <div style={styles.page}>
      <div style={styles.boardRow}>
        <BoardCoords
          gameState={gameState}
          selectedSquare={isOver ? null : selectedSquare}
          legalTargets={isOver ? [] : legalTargets}
          onSquareClick={isOver ? () => {} : handleSquareClick}
          flipped={flipped}
        />
        <MoveTracker moveHistory={moveHistory} />
      </div>
      <div style={styles.controls}>
        <StatusBar gameState={gameState} onNewGame={onNewGame} />
        <button style={styles.controlBtn} onClick={handleFlip}>
          ↺ Flip
        </button>
        <button style={styles.controlBtn} onClick={handleSharePgn}>
          {copied ? "Copied!" : "⧉ PGN"}
        </button>
      </div>
      {pendingPromotion && <PromotionModal color={gameState.turn} onChoice={handlePromotionChoice} />}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  boardRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    gap: "16px",
  },
  controls: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: "8px",
    marginTop: "8px",
  },
  controlBtn: {
    padding: "8px 14px",
    fontSize: "0.95rem",
    cursor: "pointer",
    backgroundColor: "#4f46e5",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    whiteSpace: "nowrap",
  },
};
