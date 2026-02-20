import type { GameState, GameStatus, PieceType } from "../types/chess";

const PIECE_CHAR: Record<PieceType, string> = {
  pawn: "",
  knight: "N",
  bishop: "B",
  rook: "R",
  queen: "Q",
  king: "K",
};

const PROMO_CHAR: Record<PieceType, string> = {
  pawn: "P",
  knight: "N",
  bishop: "B",
  rook: "R",
  queen: "Q",
  king: "K",
};

function sqToRowCol(sq: string): [number, number] {
  return [8 - parseInt(sq[1]), sq.charCodeAt(0) - 97];
}

function checkSuffix(status: GameStatus): string {
  if (status === "check") return "+";
  if (status === "checkmate") return "#";
  return "";
}

export function computeSAN(
  stateBefore: GameState,
  fromSq: string,
  toSq: string,
  promotion: PieceType | null,
  statusAfter: GameStatus,
): string {
  const [fromRow, fromCol] = sqToRowCol(fromSq);
  const [toRow, toCol] = sqToRowCol(toSq);

  const piece = stateBefore.board[fromRow][fromCol];
  if (!piece) return "";

  const suffix = checkSuffix(statusAfter);

  if (piece.piece_type === "king" && Math.abs(fromCol - toCol) === 2) {
    return (toCol > fromCol ? "O-O" : "O-O-O") + suffix;
  }

  const targetPiece = stateBefore.board[toRow][toCol];
  const isCapture =
    targetPiece !== null ||
    (piece.piece_type === "pawn" && fromCol !== toCol && targetPiece === null);

  if (piece.piece_type === "pawn") {
    const fromFile = fromSq[0];
    let notation = isCapture ? `${fromFile}x${toSq}` : toSq;
    if (promotion) notation += `=${PROMO_CHAR[promotion]}`;
    return notation + suffix;
  }

  const ambiguous = stateBefore.legal_moves.filter((m) => {
    if (m.to_sq !== toSq || m.from_sq === fromSq) return false;
    const [r, c] = sqToRowCol(m.from_sq);
    return stateBefore.board[r]?.[c]?.piece_type === piece.piece_type;
  });

  let disambig = "";
  if (ambiguous.length > 0) {
    const fromFile = fromSq[0];
    const fromRank = fromSq[1];
    const allDiffFile = ambiguous.every((m) => m.from_sq[0] !== fromFile);
    const allDiffRank = ambiguous.every((m) => m.from_sq[1] !== fromRank);
    if (allDiffFile) disambig = fromFile;
    else if (allDiffRank) disambig = fromRank;
    else disambig = fromSq;
  }

  const capture = isCapture ? "x" : "";
  return `${PIECE_CHAR[piece.piece_type]}${disambig}${capture}${toSq}${suffix}`;
}
