interface ErrorToastProps {
  message: string | null;
  onDismiss: () => void;
}

export default function ErrorToast({ message, onDismiss }: ErrorToastProps) {
  if (!message) return null;
  return (
    <div style={styles.toast}>
      <span>{message}</span>
      <button onClick={onDismiss} style={styles.close} aria-label="Dismiss error">✕</button>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  toast: {
    position: "fixed",
    bottom: "24px",
    right: "24px",
    backgroundColor: "#dc2626",
    color: "#fff",
    padding: "12px 16px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    fontSize: "0.95rem",
    zIndex: 1000,
    boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
  },
  close: {
    background: "none",
    border: "none",
    color: "#fff",
    cursor: "pointer",
    fontSize: "1rem",
    padding: 0,
    lineHeight: 1,
  },
};
