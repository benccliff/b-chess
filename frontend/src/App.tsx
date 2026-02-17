import { useState } from "react";

const API_URL = "http://localhost:8000/greetings";

export default function App() {
  const [name, setName] = useState("");
  const [greeting, setGreeting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setGreeting(null);
    setError(null);
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });
      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      const data: { greeting: string } = await response.json();
      setGreeting(data.greeting);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <p style={styles.label}>What is your name?</p>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          style={styles.input}
          disabled={loading}
        />
        <button type="submit" style={styles.button} disabled={loading || !name.trim()}>
          {loading ? "Loading..." : "Submit"}
        </button>
        {greeting && <p style={styles.greeting}>{greeting}</p>}
        {error && <p style={styles.error}>{error}</p>}
      </form>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif", backgroundColor: "#f5f5f5" },
  card: { display: "flex", flexDirection: "column", gap: "12px", padding: "32px", backgroundColor: "#fff", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", minWidth: "300px" },
  label: { margin: 0, fontSize: "1.1rem", fontWeight: 600 },
  input: { padding: "8px 12px", fontSize: "1rem", border: "1px solid #ccc", borderRadius: "4px" },
  button: { padding: "8px 16px", fontSize: "1rem", cursor: "pointer", backgroundColor: "#4f46e5", color: "#fff", border: "none", borderRadius: "4px" },
  greeting: { margin: 0, fontSize: "1.1rem", color: "#166534", fontWeight: 500 },
  error: { margin: 0, fontSize: "0.9rem", color: "#991b1b" },
};
