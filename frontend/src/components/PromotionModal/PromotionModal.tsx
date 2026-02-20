import type { Color, PieceType } from "../../types/chess";
import Piece from "../Piece/Piece";

interface PromotionModalProps {
  color: Color;
  onChoice: (piece: PieceType) => void;
}

const PROMOTION_PIECES: PieceType[] = ["queen", "rook", "bishop", "knight"];

export default function PromotionModal({ color, onChoice }: PromotionModalProps) {
  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <p style={styles.title}>Promote pawn to:</p>
        <div style={styles.choices}>
          {PROMOTION_PIECES.map((pt) => (
            <button key={pt} style={styles.choice} onClick={() => onChoice(pt)}>
              <Piece piece={{ color, piece_type: pt }} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
  },
  modal: {
    backgroundColor: "#fff",
    borderRadius: "8px",
    padding: "24px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
  },
  title: {
    margin: "0 0 16px",
    fontSize: "1.1rem",
    fontWeight: 600,
    textAlign: "center",
  },
  choices: {
    display: "flex",
    gap: "12px",
  },
  choice: {
    width: "64px",
    height: "64px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "2px solid #ccc",
    borderRadius: "4px",
    cursor: "pointer",
    backgroundColor: "#f9f9f9",
    fontSize: "2rem",
  },
};
