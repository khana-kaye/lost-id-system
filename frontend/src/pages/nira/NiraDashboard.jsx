import { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import PageLayout from "../../components/PageLayout";
import { theme } from "../../theme";
import BASE_URL from "../../api";

// ── nav groups ─────────────────────────────────────────────────────────────
const NAV_GROUPS = [
  {
    section: "Main",
    items: [
      { label: "Dashboard",      emoji: "⊞", route: "/nira",             badge: null },
      { label: "Add ID",      emoji: "🔎", route: "/nira/add-id",      badge: null },
      { label: "Search Database", emoji: "⌕", route: "/nira/search",   badge: null },
      
      { label: "View Reports",    emoji: "☰",  route: "/nira/records",     badge: null },
    ],
  },
  {
    section: "Records",
    items: [
      { label: "Manage Records",  emoji: "🚨",  route: "/nira/manage",       badge: null },
      { label: "Flagged IDs",    emoji: "⚑",  route: "/nira/flagged",     badge: 0    },
    ],
  },
  {
    section: "System",
    items: [
      { label: "Audit Log",      emoji: "◷",  route: "/nira/audit",       badge: null },
      { label: "Settings",       emoji: "⚙",  route: "/nira/settings",    badge: null },
      { label: "Profile",        emoji: "👤",  route: "/nira/profile",     badge: null },
    ],
  },
];

const STATUS_STYLE = {
  "under review":      { label: "Under Review",      background: "#faeeda", color: "#854f0b" },
  "cleared":           { label: "Cleared",            background: "#eaf3de", color: "#3b6d11" },
  "confirmed fraud":   { label: "Confirmed Fraud",    background: "#fcebeb", color: "#a32d2d" },
  "under investigation":{ label: "Under Investigation",background: "#e8eaf6", color: "#3949ab" },
};

const QUICK_ACTIONS = [
  { label: "Add a Found ID",       desc: "Look up a NIN in the ID records database",   emoji: "🔎", route: "/nira/add-id  "  },
  //{ label: "Review Flagged IDs", desc: "Check IDs reported more than once",           emoji: "⚑",  route: "/nira/flagged" },
  { label: "Fraud Reports",      desc: "View IDs confirmed as fraudulent",            emoji: "🚨",  route: "/nira/fraud"   },
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
        display: "flex", alignItems: "center", gap: "10px",
        padding: "9px 10px", borderRadius: "10px", border: "none",
        width: "100%", textAlign: "left", cursor: "pointer",
        fontSize: "13px", fontWeight: active ? "600" : "400",
        background: active ? theme.primary : hovered ? "rgba(0,0,0,0.04)" : "transparent",
        color: active ? "#fff" : hovered ? theme.dark : "#6b7280",
        transition: "background 0.15s, color 0.15s",
      }}
    >
      <span style={{ fontSize: "15px", width: "18px", textAlign: "center", flexShrink: 0 }}>
        {item.emoji}
      </span>
      <span style={{ flex: 1 }}>{item.label}</span>
      {item.badge ? (
        <span style={{
          fontSize: "10px", background: "#e24b4a", color: "#fff",
          borderRadius: "999px", padding: "1px 7px", fontWeight: "700",
        }}>
          {item.badge}
        </span>
      ) : null}
    </button>
  );
}

// ── StatCard ───────────────────────────────────────────────────────────────
function StatCard({ stat }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.55)",
      border: "1px solid rgba(255,255,255,0.16)",
      borderRadius: "16px", padding: "16px 18px",
    }}>
      <div style={{ fontSize: "11px", color: "#6b7280", marginBottom: "6px" }}>{stat.label}</div>
      <div style={{ fontSize: "24px", fontWeight: "700", color: theme.dark }}>{stat.value}</div>
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
        display: "flex", alignItems: "center", gap: "12px",
        padding: "11px 14px", borderRadius: "12px",
        border: "1px solid rgba(0,0,0,0.07)",
        background: hovered ? "rgba(0,0,0,0.03)" : "transparent",
        cursor: "pointer", textAlign: "left",
        transition: "background 0.15s", width: "100%",
      }}
    >
      <span style={{ fontSize: "20px", flexShrink: 0 }}>{item.emoji}</span>
      <div>
        <div style={{ fontSize: "13px", fontWeight: "600", color: theme.dark }}>{item.label}</div>
        <div style={{ fontSize: "11px", color: "#6b7280", marginTop: "2px" }}>{item.desc}</div>
      </div>
    </button>
  );
}

// ── Access Denied ──────────────────────────────────────────────────────────
function AccessDenied({ navigate }) {
  return (
    <div style={guestContainer}>
      <div style={guestCard}>
        <h2 style={guestTitle}>🔐 Access Denied</h2>
        <p style={guestSubtitle}>You are not authorized to access the NIRA portal.</p>
        <div style={guestActions}>
          <button style={guestButton} onClick={() => navigate("/")}>Go to Home</button>
          <button style={{ ...guestButton, background: theme.secondary }} onClick={() => navigate("/nira/login")}>
            NIRA Staff Login
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main NiraDashboard ─────────────────────────────────────────────────────
function NiraDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    total_ids:         0,
    flagged_count:     0,
    pending_review:    0,
  });
  const [recentFlagged, setRecentFlagged] = useState([]);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      if (!user) { if (isMounted) setLoading(false); return; }
      await fetchDashboard();
      if (isMounted) setLoading(false);
    };
    load();
    const interval = setInterval(fetchDashboard, 15000);
    return () => { isMounted = false; clearInterval(interval); };
  }, [user]);

  const fetchDashboard = async () => {
    try {
      const res = await fetch(`${BASE_URL}/nira/dashboard/`);
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats || {
          total_ids: 0, flagged_count: 0, pending_review: 0,
        });
        setRecentFlagged(Array.isArray(data.recent_flagged) ? data.recent_flagged : []);
      }
    } catch (err) {
      console.error("NIRA dashboard fetch error:", err);
    }
  };

  if (!user) return <PageLayout><AccessDenied navigate={navigate} /></PageLayout>;

  const displayName = user?.name || user?.username || "NIRA Staff";
  const initials = displayName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  const today = new Date().toLocaleDateString("en-UG", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  const activeItem = NAV_GROUPS.flatMap((g) => g.items).find(
    (item) => location.pathname === item.route ||
      (item.route !== "/nira" && location.pathname.startsWith(item.route))
  );
  const pageTitleText = activeItem?.label || "Dashboard";
  const isNiraRoot = location.pathname === "/nira";

  const handleNav = (route) => navigate(route);

  // inject live badge count into Flagged IDs nav item
  const navGroups = NAV_GROUPS.map((group) => ({
    ...group,
    items: group.items.map((item) =>
      item.route === "/nira/flagged"
        ? { ...item, badge: stats.pending_review || 0 }
        : item
    ),
  }));

  if (loading) return <PageLayout><div style={{ padding: 20 }}>Loading NIRA dashboard...</div></PageLayout>;

  return (
    <PageLayout>
      <div style={portalWrapper}>

        {/* ── Sidebar ── */}
        <aside style={sidebar}>
          <div style={sidebarTop}>
            <div style={orgBadge}>
              <div style={orgIcon}>🪪</div>
              <div>
                <div style={orgName}>NIRA Portal</div>
                <div style={orgSub}>ID Verification System</div>
              </div>
            </div>
          </div>

          <nav style={navArea}>
            {navGroups.map((group) => (
              <div key={group.section} style={{ marginBottom: "6px" }}>
                <div style={navSection}>{group.section}</div>
                {group.items.map((item) => (
                  <NavItem
                    key={item.route}
                    item={item}
                    active={
                      location.pathname === item.route ||
                      (item.route !== "/nira" && location.pathname.startsWith(item.route))
                    }
                    onClick={() => handleNav(item.route)}
                  />
                ))}
              </div>
            ))}
          </nav>

          <div style={sidebarFooter}>
            <div style={officerRow}>
              <div style={officerAvatar}>{initials}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={officerName}>{displayName}</div>
                <div style={officerRole}>{user?.role || "NIRA Staff"}</div>
              </div>
              <button title="Log out" onClick={() => navigate("/logout")} style={logoutBtn}>⎋</button>
            </div>
          </div>
        </aside>

        {/* ── Main ── */}
        <main style={mainArea}>
          <div style={topbar}>
            <div>
              <div style={pageTitle}>{pageTitleText}</div>
              <div style={pageSub}>{today}</div>
            </div>
          </div>

          <div style={contentBody}>
            {isNiraRoot ? (
              <>
                {/* stat cards */}
                <div style={statsGrid}>
                  <StatCard stat={{ label: "Total ID Records",   value: stats.total_ids,       delta: "In system",          positive: true  }} />
                  <StatCard stat={{ label: "Flagged IDs",        value: stats.flagged_count,   delta: "Need attention",      positive: false }} />
                  <StatCard stat={{ label: "Resolved",     value: stats.pending_review,  delta: "Cases Resolved",positive: true }} />
                  
                </div>

                <div style={panelsGrid}>
                  {/* recent flagged table */}
                  <div style={panel}>
                    <div style={panelHead}>
                      <span style={panelTitle}>Recently Flagged IDs</span>
                      <button style={viewAllBtn} onClick={() => handleNav("/nira/flagged")}>
                        View all →
                      </button>
                    </div>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
                      <thead>
                        <tr>
                          {["Name", "NIN", "Status"].map((h) => (
                            <th key={h} style={tableHead}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {recentFlagged.length === 0 ? (
                          <tr>
                            <td colSpan={3} style={{ padding: "16px", textAlign: "center", color: "#6b7280", fontSize: "12px" }}>
                              No flagged IDs yet
                            </td>
                          </tr>
                        ) : (
                          recentFlagged.map((row, i) => {
                            const isLast = i === recentFlagged.length - 1;
                            const cellStyle = {
                              padding: "9px 16px",
                              borderBottom: isLast ? "none" : "1px solid rgba(0,0,0,0.06)",
                              color: theme.dark,
                            };
                            const rawStatus = (row.status || "").toLowerCase();
                            const s = STATUS_STYLE[rawStatus] ?? { label: row.status, background: "#e5e7eb", color: "#374151" };
                            return (
                              <tr key={i}>
                                <td style={cellStyle}>{row.name}</td>
                                <td style={{ ...cellStyle, color: "#6b7280", fontFamily: "monospace" }}>{row.nin}</td>
                                <td style={cellStyle}>
                                  <span style={{
                                    fontSize: "10px", padding: "2px 8px",
                                    borderRadius: "999px", fontWeight: "600",
                                    background: s.background, color: s.color,
                                  }}>
                                    {s.label}
                                  </span>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* quick actions */}
                  <div style={panel}>
                    <div style={panelHead}><span style={panelTitle}>Quick Actions</span></div>
                    <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: "8px" }}>
                      {QUICK_ACTIONS.map((q) => (
                        <QuickActionBtn key={q.route} item={q} onClick={() => handleNav(q.route)} />
                      ))}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <Outlet />
            )}
          </div>
        </main>
      </div>
    </PageLayout>
  );
}

// ── styles ─────────────────────────────────────────────────────────────────
const portalWrapper  = { display: "flex", height: "calc(100vh - 80px)", overflow: "hidden", background: "#f4f6fa", minHeight: "calc(100vh - 80px)" };
const sidebar        = { width: "230px", minWidth: "230px", background: theme.card, borderRight: "1px solid rgba(0,0,0,0.07)", display: "flex", flexDirection: "column", overflow: "hidden" };
const sidebarTop     = { padding: "18px", borderBottom: "1px solid rgba(0,0,0,0.07)" };
const orgBadge       = { display: "flex", alignItems: "center", gap: "10px" };
const orgIcon        = { width: "36px", height: "36px", borderRadius: "50%", background: theme.primary, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "17px", flexShrink: 0 };
const orgName        = { fontSize: "13px", fontWeight: "700", color: theme.dark };
const orgSub         = { fontSize: "11px", color: "#6b7280", marginTop: "1px" };
const navArea        = { flex: 1, padding: "12px 10px", overflowY: "auto" };
const navSection     = { fontSize: "10px", fontWeight: "700", color: "#9ca3af", letterSpacing: "0.08em", textTransform: "uppercase", padding: "8px 10px 4px" };
const sidebarFooter  = { padding: "14px 18px", borderTop: "1px solid rgba(0,0,0,0.07)" };
const officerRow     = { display: "flex", alignItems: "center", gap: "10px" };
const officerAvatar  = { width: "30px", height: "30px", borderRadius: "50%", background: theme.primary + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "700", color: theme.primary, flexShrink: 0 };
const officerName    = { fontSize: "12px", fontWeight: "600", color: theme.dark, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" };
const officerRole    = { fontSize: "11px", color: "#6b7280" };
const logoutBtn      = { width: "28px", height: "28px", borderRadius: "8px", border: "1px solid rgba(0,0,0,0.08)", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", color: "#6b7280", flexShrink: 0 };
const mainArea       = { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" };
const topbar         = { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 24px", borderBottom: "1px solid rgba(0,0,0,0.07)", background: theme.card };
const pageTitle      = { fontSize: "16px", fontWeight: "700", color: theme.dark };
const pageSub        = { fontSize: "12px", color: "#6b7280", marginTop: "2px" };
const contentBody    = { flex: 1, overflowY: "auto", padding: "20px 24px" };
const statsGrid      = { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "18px" };
const panelsGrid     = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" };
const panel          = { background: theme.card, border: "1px solid rgba(0,0,0,0.07)", borderRadius: "16px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)", overflow: "hidden" };
const panelHead      = { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: "1px solid rgba(0,0,0,0.06)" };
const panelTitle     = { fontSize: "13px", fontWeight: "700", color: theme.dark };
const viewAllBtn     = { fontSize: "11px", color: theme.primary, border: "none", background: "transparent", cursor: "pointer" };
const tableHead      = { textAlign: "left", padding: "8px 16px", color: "#6b7280", fontWeight: "600", borderBottom: "1px solid rgba(0,0,0,0.06)", fontSize: "11px" };
const guestContainer = { width: "100%", maxWidth: "520px", margin: "0 auto", padding: "24px", minHeight: "calc(100vh - 80px)", display: "flex", alignItems: "center", justifyContent: "center" };
const guestCard      = { width: "100%", background: theme.card, padding: "32px", borderRadius: "24px", boxShadow: "0 20px 50px rgba(0,0,0,0.1)", border: "1px solid rgba(255,255,255,0.16)", textAlign: "center" };
const guestTitle     = { margin: 0, fontSize: "28px", color: theme.dark };
const guestSubtitle  = { color: "#6b7280", margin: "12px 0 24px" };
const guestActions   = { display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" };
const guestButton    = { minWidth: "160px", padding: "12px 18px", borderRadius: "16px", border: "none", background: theme.primary, color: "white", cursor: "pointer", fontWeight: "700" };

export default NiraDashboard;