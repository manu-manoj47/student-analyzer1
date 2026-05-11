import { useEffect, useState } from "react";
import axios from "axios";

const stats = [
  { label: "Total Sessions", icon: "◈", key: "total", color: "var(--accent)" },
  { label: "Avg Study Hours", icon: "◷", key: "avgHours", color: "var(--accent3)" },
  { label: "Hard Subjects", icon: "⬡", key: "hard", color: "var(--accent2)" },
  { label: "Top Performance", icon: "✦", key: "top", color: "var(--warning)" },
];

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://127.0.0.1:5000/api/history")
      .then(res => { setData(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const total = data.length;
  const avgHours = total ? (data.reduce((s, r) => s + r.hours, 0) / total).toFixed(1) : 0;
  const hard = data.filter(r => r.difficulty === "Hard").length;
  const top = data.filter(r => r.performance?.includes("Excellent")).length;
  const computed = { total, avgHours, hard, top };
  const recent = data.slice(0, 5);

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div>
          <h1 style={s.title}>Dashboard</h1>
          <p style={s.subtitle}>Your study overview at a glance</p>
        </div>
        <div style={s.dateBadge}>{new Date().toDateString()}</div>
      </div>
      <div style={s.grid}>
        {stats.map((stat) => (
          <div key={stat.key} style={s.card}>
            <div style={{ ...s.cardIcon, color: stat.color }}>{stat.icon}</div>
            <div style={{ ...s.cardValue, color: stat.color }}>{loading ? "—" : computed[stat.key]}</div>
            <div style={s.cardLabel}>{stat.label}</div>
          </div>
        ))}
      </div>
      <div style={s.section}>
        <h2 style={s.sectionTitle}>Recent Activity</h2>
        {loading ? <p style={{ color: "var(--muted)" }}>Loading...</p>
        : recent.length === 0 ? <div style={s.empty}><p>No sessions yet. Go to Analyzer to start!</p></div>
        : (
          <div style={s.table}>
            <div style={s.tableHead}>
              <span>Student</span><span>Subject</span><span>Hours</span><span>Difficulty</span><span>Performance</span>
            </div>
            {recent.map((row) => (
              <div key={row.id} style={s.tableRow}>
                <span style={{ color: "var(--text)" }}>{row.student}</span>
                <span style={{ color: "var(--accent)" }}>{row.subject}</span>
                <span style={{ color: "var(--accent3)" }}>{row.hours}h</span>
                <span style={{ color: row.difficulty === "Hard" ? "var(--accent2)" : row.difficulty === "Medium" ? "var(--warning)" : "var(--success)" }}>{row.difficulty}</span>
                <span style={{ color: "var(--muted)", fontSize: "0.85rem" }}>{row.performance}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const s = {
  page: { padding: "40px 36px", marginLeft: "220px", minHeight: "100vh" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "36px" },
  title: { fontSize: "2rem", fontWeight: 800, color: "var(--text)" },
  subtitle: { color: "var(--muted)", marginTop: "4px" },
  dateBadge: { background: "var(--surface2)", padding: "8px 16px", borderRadius: "20px", fontSize: "0.85rem", color: "var(--muted)" },
  grid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "36px" },
  card: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "24px", display: "flex", flexDirection: "column", gap: "8px" },
  cardIcon: { fontSize: "1.4rem" },
  cardValue: { fontSize: "2.2rem", fontFamily: "Syne, sans-serif", fontWeight: 800 },
  cardLabel: { color: "var(--muted)", fontSize: "0.85rem" },
  section: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "24px" },
  sectionTitle: { fontSize: "1.1rem", fontWeight: 700, marginBottom: "20px", color: "var(--text)" },
  empty: { color: "var(--muted)", padding: "20px 0", textAlign: "center" },
  table: { display: "flex", flexDirection: "column", gap: "2px" },
  tableHead: { display: "grid", gridTemplateColumns: "1fr 1fr 80px 100px 1fr", padding: "10px 16px", color: "var(--muted)", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.08em" },
  tableRow: { display: "grid", gridTemplateColumns: "1fr 1fr 80px 100px 1fr", padding: "14px 16px", borderRadius: "10px", background: "var(--surface2)", marginBottom: "4px", fontSize: "0.9rem", alignItems: "center" },
};