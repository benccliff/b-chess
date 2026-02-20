export type Color = "white" | "black";

export type PieceType = "pawn" | "knight" | "bishop" | "rook" | "queen" | "king";

export type GameStatus = "active" | "check" | "checkmate" | "stalemate" | "draw";

export interface PieceData {
  piece_type: PieceType;
  color: Color;
}

export interface MoveData {
  from_sq: string;
  to_sq: string;
  promotion: PieceType | null;
}

export interface GameState {
  game_id: string;
  fen: string;
  board: (PieceData | null)[][];
  turn: Color;
  status: GameStatus;
  legal_moves: MoveData[];
}

export interface HistoryEntry {
  san: string;
  fenAfter: string;
}
