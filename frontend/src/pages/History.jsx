import { useEffect, useState } from "react";
import axios from "axios";

export default function History() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = () => {
    axios.get("http://127.0.0.1:5000/api/history")
      .then(res => { setData(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchHistory(); }, []);

  const deleteRecord = async (id) => {
    await axios.delete(`http://127.0.0.1:5000/api/history/${id}`);
    fetchHistory();
  };

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div>
          <h1 style={s.title}>History</h1>
          <p style={s.subtitle}>{data.length} total sessions recorded</p>
        </div>
      </div>
      {loading ? <p style={{ color: "var(--muted)" }}>Loading...</p>
      : data.length === 0 ? (
        <div style={s.empty}>
          <div style={s.emptyIcon}>◷</div>
          <p>No history yet. Analyze a schedule first!</p>
        </div>
      ) : (
        <div style={s.list}>
          {data.map((row) => (
            <div key={row.id} style={s.card}>
              <div style={s.cardTop}>
                <div><span style={s.name}>{row.student}</span><span style={s.subject}>{row.subject}</span></div>
                <button style={s.deleteBtn} onClick={() => deleteRecord(row.id)}>✕</button>
              </div>
              <div style={s.tags}>
                <span style={{ ...s.tag, background: "rgba(124,106,247,0.15)", color: "var(--accent)" }}>{row.hours}h/day</span>
                <span style={{ ...s.tag, background: "rgba(79,209,197,0.15)", color: "var(--accent3)" }}>{row.days} days/week</span>
                <span style={{ ...s.tag, background: row.difficulty === "Hard" ? "rgba(247,117,108,0.15)" : row.difficulty === "Medium" ? "rgba(251,191,36,0.15)" : "rgba(74,222,128,0.15)", color: row.difficulty === "Hard" ? "var(--accent2)" : row.difficulty === "Medium" ? "var(--warning)" : "var(--success)" }}>{row.difficulty}</span>
                <span style={{ ...s.tag, background: "rgba(255,255,255,0.05)", color: "var(--muted)" }}>{row.time}</span>
                <span style={{ ...s.tag, background: "rgba(255,255,255,0.05)", color: "var(--muted)" }}>Priority: {row.priority}</span>
              </div>
              <div style={s.suggestion}>💡 {row.suggestion}</div>
              <div style={s.performance}>📈 {row.performance}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const s = {
  page: { padding: "40px 36px", marginLeft: "220px", minHeight: "100vh" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px" },
  title: { fontSize: "2rem", fontWeight: 800 },
  subtitle: { color: "var(--muted)", marginTop: "4px" },
  empty: { textAlign: "center", padding: "80px 0", color: "var(--muted)" },
  emptyIcon: { fontSize: "3rem", marginBottom: "16px", color: "var(--accent)" },
  list: { display: "flex", flexDirection: "column", gap: "12px" },
  card: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "20px 24px" },
  cardTop: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" },
  name: { fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "1rem", marginRight: "12px" },
  subject: { color: "var(--accent)", fontSize: "0.9rem" },
  deleteBtn: { background: "rgba(247,117,108,0.1)", color: "var(--accent2)", border: "1px solid rgba(247,117,108,0.2)", borderRadius: "8px", padding: "6px 10px", fontSize: "0.8rem", cursor: "pointer" },
  tags: { display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "12px" },
  tag: { padding: "4px 12px", borderRadius: "20px", fontSize: "0.8rem", fontWeight: 500 },
  suggestion: { color: "var(--muted)", fontSize: "0.88rem", marginBottom: "6px", lineHeight: 1.5 },
  performance: { color: "var(--muted)", fontSize: "0.88rem", lineHeight: 1.5 },
};