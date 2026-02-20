import type { GameState, PieceType } from "../../types/chess";
import Board from "../Board/Board";
import StatusBar from "../StatusBar/StatusBar";
import PromotionModal from "../PromotionModal/PromotionModal";
import { useSelectedSquare } from "../../hooks/useSelectedSquare";

interface GamePageProps {
  gameState: GameState;
  onMove: (fromSq: string, toSq: string, promotion?: PieceType) => void;
  onNewGame: () => void;
}

export default function GamePage({ gameState, onMove, onNewGame }: GamePageProps) {
  const { selectedSquare, legalTargets, pendingPromotion, handleSquareClick, handlePromotionChoice } =
    useSelectedSquare(gameState, onMove);

  const isOver =
    gameState.status === "checkmate" || gameState.status === "stalemate" || gameState.status === "draw";

  return (
    <div style={styles.page}>
      <Board
        gameState={gameState}
        selectedSquare={isOver ? null : selectedSquare}
        legalTargets={isOver ? [] : legalTargets}
        onSquareClick={isOver ? () => {} : handleSquareClick}
      />
      <StatusBar gameState={gameState} onNewGame={onNewGame} />
      {pendingPromotion && <PromotionModal color={gameState.turn} onChoice={handlePromotionChoice} />}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
};
