import type { GameState } from "../../types/chess";
import Square from "../Square/Square";

interface BoardProps {
  gameState: GameState;
  selectedSquare: string | null;
  legalTargets: string[];
  onSquareClick: (sq: string) => void;
  flipped?: boolean;
}

function rowColToSq(row: number, col: number): string {
  return `${String.fromCharCode("a".charCodeAt(0) + col)}${8 - row}`;
}

export default function Board({ gameState, selectedSquare, legalTargets, onSquareClick, flipped = false }: BoardProps) {
  const rows = flipped ? [...gameState.board].reverse() : gameState.board;

  return (
    <div style={styles.board}>
      {rows.map((row, displayRow) => {
        const semanticRow = flipped ? 7 - displayRow : displayRow;
        const cols = flipped ? [...row].reverse() : row;
        return cols.map((piece, displayCol) => {
          const semanticCol = flipped ? 7 - displayCol : displayCol;
          const sq = rowColToSq(semanticRow, semanticCol);
          const isLight = (semanticRow + semanticCol) % 2 === 0;
          return (
            <Square
              key={sq}
              sq={sq}
              piece={piece}
              isLight={isLight}
              isSelected={selectedSquare === sq}
              isLegalTarget={legalTargets.includes(sq)}
              onClick={onSquareClick}
            />
          );
        });
      })}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  board: {
    display: "grid",
    gridTemplateColumns: "repeat(8, 80px)",
    gridTemplateRows: "repeat(8, 80px)",
    border: "2px solid #333",
    boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
  },
};
