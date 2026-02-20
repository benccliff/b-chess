import { useEffect, useRef } from "react";
import type { HistoryEntry } from "../../types/chess";

interface MoveTrackerProps {
  moveHistory: HistoryEntry[];
}

export default function MoveTracker({ moveHistory }: MoveTrackerProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [moveHistory.length]);

  const pairs: [string, string | null][] = [];
  for (let i = 0; i < moveHistory.length; i += 2) {
    pairs.push([moveHistory[i].san, moveHistory[i + 1]?.san ?? null]);
  }

  return (
    <div style={styles.panel}>
      <div style={styles.header}>Moves</div>
      <div style={styles.list}>
        {pairs.map(([white, black], idx) => (
          <div key={idx} style={styles.row}>
            <span style={styles.moveNum}>{idx + 1}.</span>
            <span style={styles.move}>{white}</span>
            <span style={styles.move}>{black ?? ""}</span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  panel: {
    width: "160px",
    height: "660px",
    backgroundColor: "#16213e",
    borderRadius: "8px",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
  },
  header: {
    padding: "10px 12px",
    fontSize: "12px",
    fontWeight: 600,
    color: "rgba(255,255,255,0.5)",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
  },
  list: {
    flex: 1,
    overflowY: "auto",
    padding: "4px 0",
  },
  row: {
    display: "flex",
    alignItems: "center",
    padding: "3px 8px",
    gap: "4px",
  },
  moveNum: {
    color: "rgba(255,255,255,0.4)",
    fontSize: "12px",
    minWidth: "24px",
    fontFamily: "monospace",
  },
  move: {
    color: "#e8e8e8",
    fontSize: "13px",
    fontFamily: "monospace",
    minWidth: "52px",
  },
};
