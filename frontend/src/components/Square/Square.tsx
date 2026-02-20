import type { PieceData } from "../../types/chess";
import Piece from "../Piece/Piece";

interface SquareProps {
  sq: string;
  piece: PieceData | null;
  isLight: boolean;
  isSelected: boolean;
  isLegalTarget: boolean;
  onClick: (sq: string) => void;
}

export default function Square({ sq, piece, isLight, isSelected, isLegalTarget, onClick }: SquareProps) {
  const bg = isSelected
    ? "#f6f669"
    : isLegalTarget
      ? isLight ? "#cdd16b" : "#aaa23a"
      : isLight ? "#f0d9b5" : "#b58863";

  return (
    <div data-sq={sq} style={{ ...styles.square, backgroundColor: bg }} onClick={() => onClick(sq)}>
      {piece && <Piece piece={piece} />}
      {isLegalTarget && !piece && <div style={styles.dot} />}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  square: {
    width: "80px",
    height: "80px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    position: "relative",
  },
  dot: {
    width: "24px",
    height: "24px",
    borderRadius: "50%",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    position: "absolute",
  },
};
