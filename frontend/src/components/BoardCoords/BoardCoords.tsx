import type { GameState } from "../../types/chess";
import Board from "../Board/Board";

interface BoardCoordsProps {
  gameState: GameState;
  selectedSquare: string | null;
  legalTargets: string[];
  onSquareClick: (sq: string) => void;
  flipped: boolean;
}

const RANKS = ["8", "7", "6", "5", "4", "3", "2", "1"];
const FILES = ["a", "b", "c", "d", "e", "f", "g", "h"];

export default function BoardCoords({
  gameState,
  selectedSquare,
  legalTargets,
  onSquareClick,
  flipped,
}: BoardCoordsProps) {
  const ranks = flipped ? [...RANKS].reverse() : RANKS;
  const files = flipped ? [...FILES].reverse() : FILES;

  return (
    <div style={styles.wrapper}>
      <div style={styles.boardRow}>
        <div style={styles.rankCol}>
          {ranks.map((r) => (
            <div key={r} data-rank={r} style={styles.rankLabel}>
              {r}
            </div>
          ))}
        </div>
        <div style={styles.boardCol}>
          <Board
            gameState={gameState}
            selectedSquare={selectedSquare}
            legalTargets={legalTargets}
            onSquareClick={onSquareClick}
            flipped={flipped}
          />
          <div style={styles.fileRow}>
            {files.map((f) => (
              <div key={f} data-file={f} style={styles.fileLabel}>
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const COORD_STYLE: React.CSSProperties = {
  color: "rgba(255,255,255,0.3)",
  fontSize: "11px",
  fontFamily: "monospace",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
  },
  boardRow: {
    display: "flex",
    flexDirection: "row",
  },
  rankCol: {
    display: "flex",
    flexDirection: "column",
    width: "20px",
  },
  boardCol: {
    display: "flex",
    flexDirection: "column",
  },
  rankLabel: {
    ...COORD_STYLE,
    height: "80px",
    width: "20px",
  },
  fileRow: {
    display: "flex",
    flexDirection: "row",
    marginLeft: "2px",
  },
  fileLabel: {
    ...COORD_STYLE,
    width: "80px",
    height: "20px",
  },
};
