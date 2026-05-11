import { useState } from "react";
import axios from "axios";

const initial = { student: "", subject: "", hours: "", difficulty: "Easy", priority: "Low", days: "", time: "Morning" };

export default function Analyzer() {
  const [form, setForm] = useState(initial);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    if (!form.student || !form.subject || !form.hours || !form.days) { alert("Please fill all fields"); return; }
    setLoading(true);
    try {
      const res = await axios.post("http://127.0.0.1:5000/api/analyze", form);
      setResult(res.data);
    } catch { alert("Backend not connected. Start python app.py"); }
    setLoading(false);
  };

  return (
    <div style={s.page}>
      <div style={s.header}>
        <h1 style={s.title}>Schedule Analyzer</h1>
        <p style={s.subtitle}>Enter your study details to get smart suggestions</p>
      </div>
      <div style={s.layout}>
        <div style={s.formCard}>
          <div style={s.grid2}>
            <div style={s.field}><label style={s.label}>Student Name</label><input name="student" placeholder="Your name" value={form.student} onChange={handle} /></div>
            <div style={s.field}><label style={s.label}>Subject</label><input name="subject" placeholder="e.g. Mathematics" value={form.subject} onChange={handle} /></div>
            <div style={s.field}><label style={s.label}>Study Hours / Day</label><input name="hours" type="number" placeholder="e.g. 4" value={form.hours} onChange={handle} /></div>
            <div style={s.field}><label style={s.label}>Days Per Week</label><input name="days" type="number" placeholder="e.g. 5" value={form.days} onChange={handle} /></div>
            <div style={s.field}><label style={s.label}>Difficulty</label><select name="difficulty" value={form.difficulty} onChange={handle}><option>Easy</option><option>Medium</option><option>Hard</option></select></div>
            <div style={s.field}><label style={s.label}>Priority</label><select name="priority" value={form.priority} onChange={handle}><option>Low</option><option>Medium</option><option>High</option></select></div>
            <div style={{ ...s.field, gridColumn: "1/-1" }}><label style={s.label}>Preferred Time</label><select name="time" value={form.time} onChange={handle}><option>Morning</option><option>Afternoon</option><option>Evening</option><option>Night</option></select></div>
          </div>
          <button style={s.btn} onClick={submit} disabled={loading}>{loading ? "Analyzing..." : "✦ Analyze Schedule"}</button>
        </div>
        {result && (
          <div style={s.resultCard}>
            <h2 style={s.resultTitle}>Analysis Result</h2>
            <div style={s.resultGrid}>
              <div style={s.chip}><span style={s.chipLabel}>Student</span><span>{result.student}</span></div>
              <div style={s.chip}><span style={s.chipLabel}>Subject</span><span style={{ color: "var(--accent)" }}>{result.subject}</span></div>
              <div style={s.chip}><span style={s.chipLabel}>Hours/Day</span><span style={{ color: "var(--accent3)" }}>{result.hours}h</span></div>
              <div style={s.chip}><span style={s.chipLabel}>Days/Week</span><span>{result.days}</span></div>
              <div style={s.chip}><span style={s.chipLabel}>Difficulty</span><span style={{ color: result.difficulty === "Hard" ? "var(--accent2)" : result.difficulty === "Medium" ? "var(--warning)" : "var(--success)" }}>{result.difficulty}</span></div>
              <div style={s.chip}><span style={s.chipLabel}>Priority</span><span>{result.priority}</span></div>
            </div>
            <div style={s.suggestionBox}><div style={s.suggestionLabel}>💡 Suggestion</div><p style={s.suggestionText}>{result.suggestion}</p></div>
            <div style={s.performanceBox}><div style={s.suggestionLabel}>📈 Performance</div><p style={s.suggestionText}>{result.performance}</p></div>
          </div>
        )}
      </div>
    </div>
  );
}

const s = {
  page: { padding: "40px 36px", marginLeft: "220px", minHeight: "100vh" },
  header: { marginBottom: "32px" },
  title: { fontSize: "2rem", fontWeight: 800 },
  subtitle: { color: "var(--muted)", marginTop: "4px" },
  layout: { display: "flex", flexDirection: "column", gap: "24px" },
  formCard: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "28px" },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" },
  field: { display: "flex", flexDirection: "column", gap: "8px" },
  label: { fontSize: "0.8rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em" },
  btn: { width: "100%", padding: "14px", borderRadius: "12px", background: "var(--accent)", color: "white", fontSize: "1rem", fontWeight: 700 },
  resultCard: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "28px" },
  resultTitle: { fontSize: "1.2rem", fontWeight: 700, marginBottom: "20px" },
  resultGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "20px" },
  chip: { background: "var(--surface2)", borderRadius: "10px", padding: "12px 16px", display: "flex", flexDirection: "column", gap: "4px" },
  chipLabel: { fontSize: "0.75rem", color: "var(--muted)", textTransform: "uppercase" },
  suggestionBox: { background: "rgba(124,106,247,0.1)", border: "1px solid rgba(124,106,247,0.3)", borderRadius: "12px", padding: "16px", marginBottom: "12px" },
  performanceBox: { background: "rgba(79,209,197,0.1)", border: "1px solid rgba(79,209,197,0.3)", borderRadius: "12px", padding: "16px" },
  suggestionLabel: { fontSize: "0.85rem", fontWeight: 600, marginBottom: "8px" },
  suggestionText: { color: "var(--muted)", fontSize: "0.95rem", lineHeight: 1.6 },
};