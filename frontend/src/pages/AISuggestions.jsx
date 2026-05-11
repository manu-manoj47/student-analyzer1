import { useEffect, useState } from "react";
import axios from "axios";

const tips = [
  { icon: "◈", title: "Spaced Repetition", desc: "Review material at increasing intervals — after 1 day, 3 days, 1 week, 2 weeks. This dramatically improves long-term retention.", color: "var(--accent)" },
  { icon: "◷", title: "Pomodoro Technique", desc: "Study for 25 minutes, then take a 5-minute break. After 4 cycles, take a longer 15-30 minute break to stay focused.", color: "var(--accent3)" },
  { icon: "⬡", title: "Active Recall", desc: "Instead of re-reading notes, close them and try to recall key concepts. Testing yourself strengthens memory far better than passive review.", color: "var(--accent2)" },
  { icon: "✦", title: "Interleaving", desc: "Mix different subjects or problem types in one session instead of blocking one topic. It feels harder but leads to deeper learning.", color: "var(--warning)" },
  { icon: "◈", title: "Teach to Learn", desc: "Explain a concept out loud as if teaching someone else. The Feynman Technique reveals gaps in your understanding immediately.", color: "var(--success)" },
  { icon: "◷", title: "Sleep & Memory", desc: "Sleep consolidates memories. Study difficult material before bed to maximize retention. Aim for 7-9 hours during exam preparation.", color: "var(--accent)" },
];

export default function AISuggestions() {
  const [insight, setInsight] = useState(null);

  useEffect(() => {
    axios.get("http://127.0.0.1:5000/api/history")
      .then(res => generateInsight(res.data))
      .catch(() => {});
  }, []);

  const generateInsight = (records) => {
    if (!records.length) return;
    const avgHours = records.reduce((s, r) => s + r.hours, 0) / records.length;
    const hardCount = records.filter(r => r.difficulty === "Hard").length;
    const excellentCount = records.filter(r => r.performance?.includes("Excellent")).length;
    let msg = "";
    if (avgHours < 3) msg = "Your average study hours are low. Try to increase to at least 3-4 hours daily for better results.";
    else if (hardCount > records.length / 2) msg = "You're tackling many hard subjects. Focus on breaking them into smaller chunks and using active recall.";
    else if (excellentCount === records.length) msg = "Outstanding! You're performing excellently across all sessions. Keep the momentum going!";
    else msg = "You're on a solid path. Consistency is your biggest strength — keep showing up every day.";
    setInsight({ msg, avgHours: avgHours.toFixed(1), hardCount, excellentCount, total: records.length });
  };

  return (
    <div style={s.page}>
      <div style={s.header}>
        <h1 style={s.title}>AI Suggestions</h1>
        <p style={s.subtitle}>Personalized tips based on your study data</p>
      </div>
      {insight && (
        <div style={s.insightCard}>
          <div style={s.insightHeader}><span style={s.insightIcon}>✦</span><span style={s.insightTitle}>Your Personal Insight</span></div>
          <p style={s.insightText}>{insight.msg}</p>
          <div style={s.insightStats}>
            <div style={s.iStat}><span style={s.iVal}>{insight.total}</span><span style={s.iLabel}>Sessions</span></div>
            <div style={s.iStat}><span style={s.iVal}>{insight.avgHours}h</span><span style={s.iLabel}>Avg Hours</span></div>
            <div style={s.iStat}><span style={s.iVal}>{insight.hardCount}</span><span style={s.iLabel}>Hard Subjects</span></div>
            <div style={s.iStat}><span style={s.iVal}>{insight.excellentCount}</span><span style={s.iLabel}>Excellent</span></div>
          </div>
        </div>
      )}
      <h2 style={s.sectionTitle}>Study Strategies</h2>
      <div style={s.grid}>
        {tips.map((tip, i) => (
          <div key={i} style={s.card}>
            <div style={{ ...s.cardIcon, color: tip.color }}>{tip.icon}</div>
            <h3 style={{ ...s.cardTitle, color: tip.color }}>{tip.title}</h3>
            <p style={s.cardDesc}>{tip.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const s = {
  page: { padding: "40px 36px", marginLeft: "220px", minHeight: "100vh" },
  header: { marginBottom: "32px" },
  title: { fontSize: "2rem", fontWeight: 800 },
  subtitle: { color: "var(--muted)", marginTop: "4px" },
  insightCard: { background: "linear-gradient(135deg, rgba(124,106,247,0.15), rgba(79,209,197,0.1))", border: "1px solid rgba(124,106,247,0.3)", borderRadius: "16px", padding: "28px", marginBottom: "36px" },
  insightHeader: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" },
  insightIcon: { color: "var(--accent)", fontSize: "1.2rem" },
  insightTitle: { fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "1.1rem" },
  insightText: { color: "var(--text)", fontSize: "0.98rem", lineHeight: 1.7, marginBottom: "20px" },
  insightStats: { display: "flex", gap: "28px" },
  iStat: { display: "flex", flexDirection: "column", gap: "2px" },
  iVal: { fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: "1.4rem", color: "var(--accent)" },
  iLabel: { fontSize: "0.75rem", color: "var(--muted)", textTransform: "uppercase" },
  sectionTitle: { fontSize: "1.1rem", fontWeight: 700, marginBottom: "20px", color: "var(--text)" },
  grid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" },
  card: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "24px" },
  cardIcon: { fontSize: "1.5rem", marginBottom: "12px" },
  cardTitle: { fontFamily: "Syne, sans-serif", fontSize: "1rem", fontWeight: 700, marginBottom: "10px" },
  cardDesc: { color: "var(--muted)", fontSize: "0.88rem", lineHeight: 1.7 },
};