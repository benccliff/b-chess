import type { GameState } from "../../types/chess";
import Square from "../Square/Square";

interface BoardProps {
  gameState: GameState;
  selectedSquare: string | null;
  legalTargets: string[];
  onSquareClick: (sq: string) => void;
}

function rowColToSq(row: number, col: number): string {
  return `${String.fromCharCode("a".charCodeAt(0) + col)}${8 - row}`;
}

export default function Board({ gameState, selectedSquare, legalTargets, onSquareClick }: BoardProps) {
  return (
    <div style={styles.board}>
      {gameState.board.map((row, rowIdx) =>
        row.map((piece, colIdx) => {
          const sq = rowColToSq(rowIdx, colIdx);
          const isLight = (rowIdx + colIdx) % 2 === 0;
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
        }),
      )}
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
