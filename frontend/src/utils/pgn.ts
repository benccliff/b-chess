import type { GameStatus, HistoryEntry } from "../types/chess";

function pgnResult(status: GameStatus, totalMoves: number): string {
  if (status === "checkmate") {
    // The side that just moved (delivered checkmate) wins.
    // If total moves is odd, white made the last move → white wins.
    return totalMoves % 2 === 1 ? "1-0" : "0-1";
  }
  if (status === "stalemate" || status === "draw") return "1/2-1/2";
  return "*";
}

export function buildPGN(moveHistory: HistoryEntry[], status: GameStatus): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, ".");
  const result = pgnResult(status, moveHistory.length);

  const headers = [
    `[Event "b-chess"]`,
    `[Site "localhost"]`,
    `[Date "${date}"]`,
    `[Round "?"]`,
    `[White "?"]`,
    `[Black "?"]`,
    `[Result "${result}"]`,
  ].join("\n");

  const movePairs: string[] = [];
  for (let i = 0; i < moveHistory.length; i += 2) {
    const n = i / 2 + 1;
    const white = moveHistory[i].san;
    const black = moveHistory[i + 1]?.san ?? "";
    movePairs.push(black ? `${n}. ${white} ${black}` : `${n}. ${white}`);
  }

  const moveText = movePairs.join(" ");
  const tail = moveText ? `${moveText} ${result}` : result;
  return `${headers}\n\n${tail}`;
}
