import { useState, useEffect, useCallback } from "react";
import type { GameState, PieceType } from "../types/chess";
import { createGame, makeMove } from "../services/chessApi";

export interface UseGameResult {
  gameState: GameState | null;
  isLoading: boolean;
  error: string | null;
  startNewGame: () => void;
  submitMove: (fromSq: string, toSq: string, promotion?: PieceType) => Promise<void>;
}

export function useGame(): UseGameResult {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startNewGame = useCallback(() => {
    setIsLoading(true);
    setError(null);
    createGame()
      .then(setGameState)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Failed to create game"))
      .finally(() => setIsLoading(false));
  }, []);

  const submitMove = useCallback(
    async (fromSq: string, toSq: string, promotion?: PieceType) => {
      if (!gameState) return;
      setIsLoading(true);
      setError(null);
      try {
        const newState = await makeMove(gameState.game_id, fromSq, toSq, promotion);
        setGameState(newState);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Move failed");
      } finally {
        setIsLoading(false);
      }
    },
    [gameState],
  );

  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  return { gameState, isLoading, error, startNewGame, submitMove };
}
