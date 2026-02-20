import type { GameState, PieceType } from "../types/chess";

const BASE_URL = "http://localhost:8000";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const resp = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!resp.ok) {
    const body = await resp.text().catch(() => "");
    throw new ApiError(resp.status, body || `HTTP ${resp.status}`);
  }
  return resp.json() as Promise<T>;
}

export function createGame(): Promise<GameState> {
  return request<GameState>("/games", { method: "POST" });
}

export function getGame(gameId: string): Promise<GameState> {
  return request<GameState>(`/games/${gameId}`);
}

export function makeMove(
  gameId: string,
  fromSq: string,
  toSq: string,
  promotion?: PieceType,
): Promise<GameState> {
  return request<GameState>(`/games/${gameId}/moves`, {
    method: "POST",
    body: JSON.stringify({ from_sq: fromSq, to_sq: toSq, promotion: promotion ?? null }),
  });
}

export function deleteGame(gameId: string): Promise<void> {
  return request<void>(`/games/${gameId}`, { method: "DELETE" });
}
