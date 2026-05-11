import { NavLink } from "react-router-dom";

const navItems = [
  { path: "/", icon: "⬡", label: "Dashboard" },
  { path: "/analyzer", icon: "◈", label: "Analyzer" },
  { path: "/history", icon: "◷", label: "History" },
  { path: "/ai-suggestions", icon: "✦", label: "AI Suggestions" },
];

export default function Layout({ children }) {
  return (
    <div style={s.root}>
      <aside style={s.sidebar}>
        <div style={s.logo}>
          <span style={s.logoIcon}>✦</span>
          <span style={s.logoText}>StudyOS</span>
        </div>
        <nav style={s.nav}>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              style={({ isActive }) => ({
                ...s.navItem,
                ...(isActive ? s.navActive : {}),
              })}
            >
              <span style={s.navIcon}>{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div style={s.sidebarFooter}>
          <div style={s.badge}>v2.0 Stable</div>
        </div>
      </aside>
      <main style={s.main}>{children}</main>
    </div>
  );
}

const s = {
  root: { display: "flex", minHeight: "100vh", background: "var(--bg)" },
  sidebar: { width: "220px", minHeight: "100vh", background: "var(--surface)", borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column", padding: "28px 16px", position: "fixed", top: 0, left: 0, bottom: 0 },
  logo: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "40px", paddingLeft: "8px" },
  logoIcon: { fontSize: "1.5rem", color: "var(--accent)" },
  logoText: { fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: "1.2rem", color: "var(--text)", letterSpacing: "0.05em" },
  nav: { display: "flex", flexDirection: "column", gap: "4px", flex: 1 },
  navItem: { display: "flex", alignItems: "center", gap: "12px", padding: "11px 14px", borderRadius: "10px", color: "var(--muted)", textDecoration: "none", fontSize: "0.9rem", fontWeight: 500, transition: "all 0.2s" },
  navActive: { background: "rgba(124,106,247,0.15)", color: "var(--accent)", fontWeight: 600 },
  navIcon: { fontSize: "1.1rem" },
  sidebarFooter: { marginTop: "auto", paddingTop: "20px" },
  badge: { fontSize: "0.75rem", color: "var(--muted)", background: "var(--surface2)", padding: "6px 12px", borderRadius: "20px", textAlign: "center" },
  main: { flex: 1 },
};