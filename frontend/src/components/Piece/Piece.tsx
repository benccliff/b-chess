import type { PieceData } from "../../types/chess";

interface PieceProps {
  piece: PieceData;
}

export default function Piece({ piece }: PieceProps) {
  const src = `/${piece.color}-${piece.piece_type}.png`;
  return <img src={src} alt="" draggable={false} style={styles.img} />;
}

const styles: Record<string, React.CSSProperties> = {
  img: {
    width: "70px",
    height: "70px",
    userSelect: "none",
    display: "block",
  },
};
