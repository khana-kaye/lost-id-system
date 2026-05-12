import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../../components/PageLayout";
import { theme } from "../../theme";

// ── nav groups ─────────────────────────────────────────────────────────────
const NAV_GROUPS = [
  {
    section: "Main",
    items: [
      { label: "Dashboard",      emoji: "⊞", route: "/uneb/dashboard", badge: null },
      { label: "Verify Results", emoji: "📄", route: "/uneb/verify",    badge: null },
      { label: "Flag Records",   emoji: "🚨", route: "/uneb/flag",      badge: 27   },
      { label: "Reports",        emoji: "📊", route: "/uneb/reports",   badge: null },
    ],
  },
  {
    section: "Records",
    items: [
      { label: "Sync Records",   emoji: "🔄", route: "/uneb/sync",      badge: null },
      { label: "Audit Log",      emoji: "◷", route: "/uneb/audit",     badge: null },
    ],
  },
  {
    section: "System",
    items: [
      { label: "Settings",       emoji: "⚙", route: "/uneb/settings",  badge: null },
    ],
  },
];

// ── stats ──────────────────────────────────────────────────────────────────
const UNEB_STATS = [
  { label: "Student Verifications", value: "2,341", delta: "+32 today",    positive: true  },
  { label: "Certificate Requests",  value: "412",   delta: "+11 today",    positive: true  },
  { label: "Flagged Records",       value: "27",    delta: "needs review", positive: false },
  { label: "Approved Results",      value: "1,876", delta: "+21 today",    positive: true  },
];

// ── recent activity ────────────────────────────────────────────────────────
const RECENT_ACTIVITY = [
  { name: "Aisha N.",  exam: "UACE", status: "verified"  },
  { name: "Brian K.",  exam: "UCE",  status: "flagged"   },
  { name: "Sarah T.",  exam: "PLE",  status: "approved"  },
  { name: "John M.",   exam: "UACE", status: "rejected"  },
];

const STATUS_STYLE = {
  verified: { label: "Verified", bg: "#eaf3de", color: "#3b6d11" },
  approved: { label: "Approved", bg: "#eaf3de", color: "#3b6d11" },
  flagged:  { label: "Flagged",  bg: "#faeeda", color: "#854f0b" },
  rejected: { label: "Rejected", bg: "#fcebeb", color: "#a32d2d" },
};

// ── quick actions ──────────────────────────────────────────────────────────
const QUICK_ACTIONS = [
  { label: "Verify Results",   desc: "Check student examination records", emoji: "📄", route: "/uneb/verify"  },
  { label: "Flag Record",      desc: "Report suspicious results",          emoji: "🚨", route: "/uneb/flag"    },
  { label: "Generate Reports", desc: "View verification history",          emoji: "📊", route: "/uneb/reports" },
  { label: "Sync Records",     desc: "Update UNEB records database",       emoji: "🔄", route: "/uneb/sync"    },
];

// ── NavItem ────────────────────────────────────────────────────────────────
function NavItem({ item, active, onClick }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-current={active ? "page" : undefined}
      style={{
        display:     "flex",
        alignItems:  "center",
        gap:         "10px",
        padding:     "9px 10px",
        borderRadius: "10px",
        border:      "none",
        width:       "100%",
        textAlign:   "left",
        cursor:      "pointer",
        fontSize:    "13px",
        fontWeight:  active ? "600" : "400",
        background:  active ? theme.primary : hovered ? "rgba(0,0,0,0.04)" : "transparent",
        color:       active ? "#fff" : hovered ? theme.dark : "#6b7280",
        transition:  "background 0.15s, color 0.15s",
      }}
    >
      <span style={{ fontSize: "15px", width: "18px", textAlign: "center", flexShrink: 0 }}>
        {item.emoji}
      </span>
      <span style={{ flex: 1 }}>{item.label}</span>
      {item.badge && (
        <span style={{
          fontSize:     "10px",
          background:   "#e24b4a",
          color:        "#fff",
          borderRadius: "999px",
          padding:      "1px 7px",
          fontWeight:   "700",
        }}>
          {item.badge}
        </span>
      )}
    </button>
  );
}

// ── StatCard ───────────────────────────────────────────────────────────────
function StatCard({ stat }) {
  return (
    <div style={{
      background:   "rgba(255,255,255,0.55)",
      border:       "1px solid rgba(255,255,255,0.16)",
      borderRadius: "16px",
      padding:      "16px 18px",
    }}>
      <div style={{ fontSize: "11px", color: "#6b7280", marginBottom: "6px" }}>
        {stat.label}
      </div>
      <div style={{ fontSize: "24px", fontWeight: "700", color: theme.dark }}>
        {stat.value}
      </div>
      <div style={{ fontSize: "11px", marginTop: "4px", color: stat.positive ? "#3b6d11" : "#a32d2d" }}>
        {stat.delta}
      </div>
    </div>
  );
}

// ── QuickActionBtn ─────────────────────────────────────────────────────────
function QuickActionBtn({ item, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display:      "flex",
        alignItems:   "center",
        gap:          "12px",
        padding:      "11px 14px",
        borderRadius: "12px",
        border:       "1px solid rgba(0,0,0,0.07)",
        background:   hovered ? "rgba(0,0,0,0.03)" : "transparent",
        cursor:       "pointer",
        textAlign:    "left",
        transition:   "background 0.15s",
        width:        "100%",
      }}
    >
      <span style={{ fontSize: "20px", flexShrink: 0 }}>{item.emoji}</span>
      <div>
        <div style={{ fontSize: "13px", fontWeight: "600", color: theme.dark }}>
          {item.label}
        </div>
        <div style={{ fontSize: "11px", color: "#6b7280", marginTop: "2px" }}>
          {item.desc}
        </div>
      </div>
    </button>
  );
}

// ── main component ─────────────────────────────────────────────────────────
function UnebDashboard() {
  const navigate = useNavigate();
  const [active, setActive] = useState("/uneb/dashboard");

  const today = new Date().toLocaleDateString("en-UG", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  const handleNav = (route) => {
    setActive(route);
    navigate(route);
  };

  return (
    <PageLayout>
      <div style={wrapper}>

        {/* ── Sidebar ── */}
        <aside style={sidebar}>

          {/* org badge */}
          <div style={sidebarTop}>
            <div style={orgBox}>
              <div style={orgIcon}>🎓</div>
              <div>
                <div style={orgTitle}>UNEB Portal</div>
                <div style={orgSub}>Examination Verification System</div>
              </div>
            </div>
          </div>

          {/* nav groups */}
          <nav style={navArea}>
            {NAV_GROUPS.map((group) => (
              <div key={group.section} style={{ marginBottom: "6px" }}>
                <div style={navSection}>{group.section}</div>
                {group.items.map((item) => (
                  <NavItem
                    key={item.route}
                    item={item}
                    active={active === item.route}
                    onClick={() => handleNav(item.route)}
                  />
                ))}
              </div>
            ))}
          </nav>

          {/* footer / logout */}
          <div style={sidebarFooter}>
            <button
              style={logoutBtn}
              onClick={() => navigate("/logout")}
            >
              ⎋ &nbsp; Logout
            </button>
          </div>
        </aside>

        {/* ── Main ── */}
        <main style={mainArea}>

          {/* topbar */}
          <div style={topbar}>
            <div>
              <div style={pageTitle}>Dashboard</div>
              <div style={pageSub}>{today}</div>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button style={iconBtn} title="Notifications">🔔</button>
              <button style={iconBtn} title="Download report">⬇</button>
            </div>
          </div>

          {/* scrollable body */}
          <div style={contentBody}>

            {/* stat cards */}
            <div style={statsGrid}>
              {UNEB_STATS.map((s) => <StatCard key={s.label} stat={s} />)}
            </div>

            {/* panels */}
            <div style={panelsGrid}>

              {/* recent verifications */}
              <div style={panel}>
                <div style={panelHead}>
                  <span style={panelTitle}>Recent Verifications</span>
                  <button
                    style={viewAllBtn}
                    onClick={() => handleNav("/uneb/reports")}
                  >
                    View all →
                  </button>
                </div>
                <div style={{ padding: "4px 0" }}>
                  {RECENT_ACTIVITY.map((r, i) => {
                    const s = STATUS_STYLE[r.status];
                    const isLast = i === RECENT_ACTIVITY.length - 1;
                    return (
                      <div
                        key={i}
                        style={{
                          display:        "flex",
                          justifyContent: "space-between",
                          alignItems:     "center",
                          padding:        "10px 16px",
                          borderBottom:   isLast ? "none" : "1px solid rgba(0,0,0,0.06)",
                        }}
                      >
                        <div>
                          <div style={{ fontSize: "13px", fontWeight: "600", color: theme.dark }}>
                            {r.name}
                          </div>
                          <div style={{ fontSize: "11px", color: "#6b7280", marginTop: "2px" }}>
                            {r.exam}
                          </div>
                        </div>
                        <span style={{
                          fontSize:     "10px",
                          padding:      "3px 10px",
                          borderRadius: "999px",
                          fontWeight:   "600",
                          background:   s.bg,
                          color:        s.color,
                        }}>
                          {s.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* quick actions */}
              <div style={panel}>
                <div style={panelHead}>
                  <span style={panelTitle}>Quick Actions</span>
                </div>
                <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: "8px" }}>
                  {QUICK_ACTIONS.map((q) => (
                    <QuickActionBtn
                      key={q.route}
                      item={q}
                      onClick={() => handleNav(q.route)}
                    />
                  ))}
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>
    </PageLayout>
  );
}

// ── styles ─────────────────────────────────────────────────────────────────

const wrapper = {
  display:   "flex",
  height:    "calc(100vh - 80px)", // adjust to your PageLayout header height
  overflow:  "hidden",
  background: "#f4f6fa",
};

const sidebar = {
  width:         "230px",
  minWidth:      "230px",
  background:    theme.card,
  borderRight:   "1px solid rgba(0,0,0,0.07)",
  display:       "flex",
  flexDirection: "column",
  overflow:      "hidden",
};

const sidebarTop = {
  padding:      "18px",
  borderBottom: "1px solid rgba(0,0,0,0.07)",
};

const orgBox = {
  display:    "flex",
  gap:        "10px",
  alignItems: "center",
};

const orgIcon = {
  width:          "36px",
  height:         "36px",
  background:     theme.primary,
  borderRadius:   "10px",
  display:        "flex",
  alignItems:     "center",
  justifyContent: "center",
  fontSize:       "18px",
  flexShrink:     0,
};

const orgTitle = {
  fontSize:   "13px",
  fontWeight: "700",
  color:      theme.dark,
};

const orgSub = {
  fontSize:  "11px",
  color:     "#6b7280",
  marginTop: "1px",
};

const navArea = {
  flex:      1,
  padding:   "12px 10px",
  overflowY: "auto",
};

const navSection = {
  fontSize:      "10px",
  fontWeight:    "700",
  color:         "#9ca3af",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  padding:       "8px 10px 4px",
};

const sidebarFooter = {
  padding:   "14px",
  borderTop: "1px solid rgba(0,0,0,0.07)",
};

const logoutBtn = {
  width:        "100%",
  padding:      "10px",
  background:   "#fcebeb",
  color:        "#a32d2d",
  border:       "1px solid rgba(163,45,45,0.2)",
  borderRadius: "10px",
  cursor:       "pointer",
  fontWeight:   "700",
  fontSize:     "13px",
  textAlign:    "center",
};

const mainArea = {
  flex:          1,
  display:       "flex",
  flexDirection: "column",
  overflow:      "hidden",
};

const topbar = {
  display:        "flex",
  alignItems:     "center",
  justifyContent: "space-between",
  padding:        "14px 24px",
  borderBottom:   "1px solid rgba(0,0,0,0.07)",
  background:     theme.card,
};

const pageTitle = {
  fontSize:   "16px",
  fontWeight: "700",
  color:      theme.dark,
};

const pageSub = {
  fontSize:  "12px",
  color:     "#6b7280",
  marginTop: "2px",
};

const iconBtn = {
  width:        "32px",
  height:       "32px",
  borderRadius: "8px",
  border:       "1px solid rgba(0,0,0,0.08)",
  background:   "transparent",
  cursor:       "pointer",
  fontSize:     "15px",
};

const contentBody = {
  flex:      1,
  overflowY: "auto",
  padding:   "20px 24px",
};

const statsGrid = {
  display:             "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap:                 "12px",
  marginBottom:        "18px",
};

const panelsGrid = {
  display:             "grid",
  gridTemplateColumns: "1fr 1fr",
  gap:                 "14px",
};

const panel = {
  background:   theme.card,
  border:       "1px solid rgba(0,0,0,0.07)",
  borderRadius: "16px",
  boxShadow:    "0 4px 20px rgba(0,0,0,0.05)",
  overflow:     "hidden",
};

const panelHead = {
  display:        "flex",
  alignItems:     "center",
  justifyContent: "space-between",
  padding:        "12px 16px",
  borderBottom:   "1px solid rgba(0,0,0,0.06)",
};

const panelTitle = {
  fontSize:   "13px",
  fontWeight: "700",
  color:      theme.dark,
};

const viewAllBtn = {
  fontSize:   "11px",
  color:      theme.primary,
  border:     "none",
  background: "transparent",
  cursor:     "pointer",
};

export default UnebDashboard;