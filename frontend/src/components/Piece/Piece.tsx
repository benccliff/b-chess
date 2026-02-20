import type { PieceData } from "../../types/chess";

const GLYPHS: Record<string, Record<string, string>> = {
  white: {
    king: "♔",
    queen: "♕",
    rook: "♖",
    bishop: "♗",
    knight: "♘",
    pawn: "♙",
  },
  black: {
    king: "♚",
    queen: "♛",
    rook: "♜",
    bishop: "♝",
    knight: "♞",
    pawn: "♟",
  },
};

interface PieceProps {
  piece: PieceData;
}

export default function Piece({ piece }: PieceProps) {
  const glyph = GLYPHS[piece.color][piece.piece_type];
  return <span style={styles.glyph}>{glyph}</span>;
}

const styles: Record<string, React.CSSProperties> = {
  glyph: {
    fontSize: "2.4rem",
    lineHeight: 1,
    userSelect: "none",
    display: "block",
    textAlign: "center",
  },
};
