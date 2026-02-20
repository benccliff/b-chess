import { useState, useCallback } from "react";
import type { GameState, PieceType } from "../types/chess";

export interface UseSelectedSquareResult {
  selectedSquare: string | null;
  legalTargets: string[];
  pendingPromotion: { fromSq: string; toSq: string } | null;
  handleSquareClick: (sq: string) => void;
  handlePromotionChoice: (piece: PieceType) => void;
  clearSelection: () => void;
}

export function useSelectedSquare(
  gameState: GameState | null,
  onMove: (fromSq: string, toSq: string, promotion?: PieceType) => void,
): UseSelectedSquareResult {
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [pendingPromotion, setPendingPromotion] = useState<{ fromSq: string; toSq: string } | null>(null);

  const clearSelection = useCallback(() => {
    setSelectedSquare(null);
  }, []);

  const legalTargets: string[] =
    selectedSquare && gameState
      ? gameState.legal_moves
          .filter((m) => m.from_sq === selectedSquare)
          .map((m) => m.to_sq)
          .filter((sq, i, arr) => arr.indexOf(sq) === i) // deduplicate (promotion squares appear 4x)
      : [];

  const handleSquareClick = useCallback(
    (sq: string) => {
      if (!gameState) return;

      if (selectedSquare && legalTargets.includes(sq)) {
        // Check if this move requires promotion
        const promotionMoves = gameState.legal_moves.filter(
          (m) => m.from_sq === selectedSquare && m.to_sq === sq && m.promotion !== null,
        );
        if (promotionMoves.length > 0) {
          setPendingPromotion({ fromSq: selectedSquare, toSq: sq });
          setSelectedSquare(null);
          return;
        }
        onMove(selectedSquare, sq);
        setSelectedSquare(null);
        return;
      }

      // Select or re-select a piece of the current player's color
      const piece = getPieceAt(gameState, sq);
      if (piece && piece.color === gameState.turn) {
        setSelectedSquare(sq);
      } else {
        setSelectedSquare(null);
      }
    },
    [gameState, selectedSquare, legalTargets, onMove],
  );

  const handlePromotionChoice = useCallback(
    (piece: PieceType) => {
      if (!pendingPromotion) return;
      onMove(pendingPromotion.fromSq, pendingPromotion.toSq, piece);
      setPendingPromotion(null);
    },
    [pendingPromotion, onMove],
  );

  return {
    selectedSquare,
    legalTargets,
    pendingPromotion,
    handleSquareClick,
    handlePromotionChoice,
    clearSelection,
  };
}

function getPieceAt(gameState: GameState, sq: string) {
  const col = sq.charCodeAt(0) - "a".charCodeAt(0);
  const rank = parseInt(sq[1]);
  const row = 8 - rank;
  return gameState.board[row]?.[col] ?? null;
}
