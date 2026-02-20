import { useState, useEffect, useCallback } from "react";
import type { GameState, GameStatus, PieceType } from "../types/chess";
import { createGame, makeMove } from "../services/chessApi";

export interface UseGameResult {
  gameState: GameState | null;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
  startNewGame: () => void;
  submitMove: (fromSq: string, toSq: string, promotion?: PieceType) => Promise<void>;
}

export function useGame(
  onNewGame?: () => void,
  onGameEvent?: (status: GameStatus, isCapture: boolean) => void,
): UseGameResult {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startNewGame = useCallback(() => {
    setIsLoading(true);
    setError(null);
    createGame()
      .then((state) => {
        setGameState(state);
        onNewGame?.();
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Failed to create game"))
      .finally(() => setIsLoading(false));
  }, [onNewGame]);

  const submitMove = useCallback(
    async (fromSq: string, toSq: string, promotion?: PieceType) => {
      if (!gameState) return;
      setIsLoading(true);
      setError(null);
      try {
        const col = toSq.charCodeAt(0) - "a".charCodeAt(0);
        const row = 8 - parseInt(toSq[1]);
        const isCapture = gameState.board[row]?.[col] != null;
        const newState = await makeMove(gameState.game_id, fromSq, toSq, promotion);
        setGameState(newState);
        onGameEvent?.(newState.status, isCapture);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Move failed");
      } finally {
        setIsLoading(false);
      }
    },
    [gameState, onGameEvent],
  );

  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  const clearError = useCallback(() => setError(null), []);

  return { gameState, isLoading, error, clearError, startNewGame, submitMove };
}
