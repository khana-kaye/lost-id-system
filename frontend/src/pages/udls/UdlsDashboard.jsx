import { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import PageLayout from "../../components/PageLayout";
import PortalLayout from "../../components/PortalLayout";
import { theme } from "../../theme";
import BASE_URL from "../../api";

// ── nav groups ─────────────────────────────────────────────────────────────
const NAV_GROUPS = [
  {
    section: "Main",
    items: [
      { label: "Dashboard", emoji: "⊞", route: "/udls/dashboard", badge: null },
      { label: "Add Permit", emoji: "➕", route: "/udls/add", badge: null },
      { label: "Search Database", emoji: "⌕", route: "/udls/search", badge: null },
      { label: "View Reports", emoji: "☰", route: "/udls/records", badge: null },
    ],
  },
  {
    section: "Records",
    items: [
      { label: "Manage Permits", emoji: "✎", route: "/udls/manage", badge: null },
      { label: "Flagged Permits", emoji: "⚑", route: "/udls/flagged", badge: 0 },
    ],
  },
  {
    section: "System",
    items: [
      { label: "Audit Log", emoji: "◷", route: "/udls/audit", badge: null },
      { label: "Settings", emoji: "⚙", route: "/udls/settings", badge: null },
      { label: "Profile", emoji: "👤", route: "/udls/profile", badge: null },
    ],
  },
];

// ── status styles ──────────────────────────────────────────────────────────
const STATUS_STYLE = {
  "under review": {
    label: "Under Review",
    background: "#faeeda",
    color: "#854f0b",
  },
  cleared: {
    label: "Cleared",
    background: "#eaf3de",
    color: "#3b6d11",
  },
  "confirmed fraud": {
    label: "Confirmed Fraud",
    background: "#fcebeb",
    color: "#a32d2d",
  },
  "under investigation": {
    label: "Under Investigation",
    background: "#e8eaf6",
    color: "#3949ab",
  },
};

// ── quick actions ──────────────────────────────────────────────────────────
const QUICK_ACTIONS = [
  {
    label: "Add Permit",
    desc: "Register a new driver permit into the system",
    emoji: "➕",
    route: "/udls/add",
  },
  {
    label: "Fraud Permits",
    desc: "View permits flagged for fraud review",
    emoji: "🚨",
    route: "/udls/flagged",
  },
];

// ── NavItem ────────────────────────────────────────────────────────────────
function NavItem({ item, active, onClick }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "9px 10px",
        borderRadius: "10px",
        border: "none",
        width: "100%",
        textAlign: "left",
        cursor: "pointer",
        fontSize: "13px",
        fontWeight: active ? "600" : "400",
        background: active ? theme.primary : hovered ? "rgba(0,0,0,0.04)" : "transparent",
        color: active ? "#fff" : hovered ? theme.dark : "#6b7280",
        transition: "background 0.15s, color 0.15s",
      }}
    >
      <span style={{ fontSize: "15px", width: "18px", textAlign: "center" }}>
        {item.emoji}
      </span>
      <span style={{ flex: 1 }}>{item.label}</span>

      {item.badge ? (
        <span
          style={{
            fontSize: "10px",
            background: "#e24b4a",
            color: "#fff",
            borderRadius: "999px",
            padding: "1px 7px",
            fontWeight: "700",
          }}
        >
          {item.badge}
        </span>
      ) : null}
    </button>
  );
}

// ── StatCard ───────────────────────────────────────────────────────────────
function StatCard({ stat }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.55)",
        border: "1px solid rgba(255,255,255,0.16)",
        borderRadius: "16px",
        padding: "16px 18px",
      }}
    >
      <div style={{ fontSize: "11px", color: "#6b7280" }}>{stat.label}</div>
      <div style={{ fontSize: "24px", fontWeight: "700", color: theme.dark }}>
        {stat.value}
      </div>
      <div
        style={{
          fontSize: "11px",
          marginTop: "4px",
          color: stat.positive ? "#3b6d11" : "#a32d2d",
        }}
      >
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
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "11px 14px",
        borderRadius: "12px",
        border: "1px solid rgba(0,0,0,0.07)",
        background: hovered ? "rgba(0,0,0,0.03)" : "transparent",
        cursor: "pointer",
        textAlign: "left",
        width: "100%",
      }}
    >
      <span style={{ fontSize: "20px" }}>{item.emoji}</span>
      <div>
        <div style={{ fontSize: "13px", fontWeight: "600", color: theme.dark }}>
          {item.label}
        </div>
        <div style={{ fontSize: "11px", color: "#6b7280" }}>{item.desc}</div>
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
        <p style={guestSubtitle}>
          You are not authorized to access the UDLS portal.
        </p>
        <div style={guestActions}>
          <button style={guestButton} onClick={() => navigate("/")}>
            Go to Home
          </button>
          {/* <button
            style={{ ...guestButton, background: theme.secondary }}
            onClick={() => navigate("/udls/login")}
          >
            UDLS Login
          </button> */}
        </div>
      </div>
    </div>
  );
}

// ── MAIN DASHBOARD ─────────────────────────────────────────────────────────
function UdlsDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    total_permits: 0,
    flagged_count: 0,
    pending_review: 0,
  });

  const [recentReports, setRecentReports] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      if (!user) {
        if (isMounted) setLoading(false);
        return;
      }
      await fetchDashboard();
      if (isMounted) setLoading(false);
    };

    load();
    const interval = setInterval(fetchDashboard, 15000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [user]);

  const fetchDashboard = async () => {
    try {
      const res = await fetch(`${BASE_URL}/udls/dashboard/`);
      

      if (res.ok) {
        const data = await res.json();

        setStats({
          total_permits: data.stats?.total_permits ?? 0,
          flagged_count: data.stats?.flagged_count ?? 0,
          pending_review: data.stats?.pending_review ?? 0,
        });

        setRecentReports(data.recent_reports || []);
      }
    } catch (err) {
      console.error("UDLS dashboard error:", err);
    }
  };

  if (!user  ) {
    return (
      <PageLayout>
        <AccessDenied navigate={navigate} />
      </PageLayout>
    );
  }

  const displayName = user?.name || user?.username || "UDLS Officer";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const today = new Date().toLocaleDateString("en-UG", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const activeItem = NAV_GROUPS.flatMap((g) => g.items).find(
    (item) =>
      location.pathname === item.route ||
      (item.route !== "/udls" && location.pathname.startsWith(item.route))
  );

  const pageTitleText = activeItem?.label || "Dashboard";
  const isRoot = location.pathname === "/udls/dashboard";

  const handleNav = (route) => navigate(route);

  const navGroups = NAV_GROUPS.map((group) => ({
    ...group,
    items: group.items.map((item) =>
      item.route === "/udls/flagged"
        ? { ...item, badge: stats.flagged_count || 0 }
        : item
    ),
  }));

  if (loading) {
    return (
      <PortalLayout pageTitle={pageTitleText} orgName="UDLS Portal" orgIcon="🪪" user={user}>
        <div style={{ padding: 20 }}>Loading UDLS dashboard...</div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout navGroups={navGroups} pageTitle={pageTitleText} orgName="UDLS Portal" orgIcon="🪪" user={user} onLogout={() => navigate('/logout')}>
      <div style={contentBody}>
        {isRoot ? (
          <>
            <div style={statsGrid}>
              <StatCard stat={{ label: "Total Permits", value: stats.total_permits, delta: "Driver permits registered", positive: true }} />
              <StatCard stat={{ label: "Flagged Permits", value: stats.flagged_count, delta: "Under review", positive: false }} />
              <StatCard stat={{ label: "Resolved Cases", value: stats.pending_review, delta: "Completed reviews", positive: true }} />
            </div>

            <div style={panelsGrid}>
              <div style={panel}>
                <div style={panelHead}>
                  <span style={panelTitle}>Recent Reports</span>
                  <button onClick={() => handleNav("/udls/flagged")}>View all →</button>
                </div>

                <table style={{ width: "100%", fontSize: "12px" }}>
                  <tbody>
                    {recentReports.map((r, i) => {
                      const s = STATUS_STYLE[r.status] || { label: r.status, background: "#eee", color: "#333" };
                      return (
                        <tr key={i}>
                          <td>{r.name}</td>
                          <td>{r.plate || r.license}</td>
                          <td>
                            <span style={{ background: s.background, color: s.color, padding: "2px 8px", borderRadius: "10px", fontSize: "10px" }}>{s.label}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div style={panel}>
                <div style={panelHead}><span style={panelTitle}>Quick Actions</span></div>
                <div style={{ padding: 12 }}>
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
    </PortalLayout>
  );
}

// ── styles ─────────────────────────────────────────────────────────────────
const portalWrapper = {
  display: "flex",
  height: "calc(100vh - 80px)",
  background: "#f4f6fa",
  overflow: "hidden",
};

const sidebar = {
  width: "230px",
  background: theme.card,
  borderRight: "1px solid rgba(0,0,0,0.07)",
  display: "flex",
  flexDirection: "column",
};

const sidebarTop = { padding: 18 };
const orgBadge = { display: "flex", gap: 10 };
const orgIcon = { width: 36, height: 36, borderRadius: "50%", background: theme.primary };
const orgName = { fontSize: 13, fontWeight: 700 };
const orgSub = { fontSize: 11, color: "#666" };

const navArea = { flex: 1, padding: 10 };
const navSection = { fontSize: 10, fontWeight: 700, color: "#999", padding: 6 };

const sidebarFooter = { padding: 14, borderTop: "1px solid #eee" };
const officerRow = { display: "flex", gap: 10 };
const officerAvatar = {
  width: 30,
  height: 30,
  borderRadius: "50%",
  background: theme.primary,
  color: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const officerName = { fontSize: 12, fontWeight: 600 };
const officerRole = { fontSize: 11, color: "#777" };

const logoutBtn = { border: "none", background: "transparent" };

const mainArea = { flex: 1, display: "flex", flexDirection: "column" };
const topbar = { padding: 14, borderBottom: "1px solid #ddd", display: "flex", justifyContent: "space-between" };
const pageTitle = { fontSize: 16, fontWeight: 700 };
const pageSub = { fontSize: 12, color: "#777" };

const contentBody = { padding: 20, overflowY: "auto", flex: 1 };

const statsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: 12,
  marginBottom: 18,
};

const panelsGrid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 14,
};

const panel = {
  background: theme.card,
  border: "1px solid #eee",
  borderRadius: 16,
  overflow: "hidden",
};

const panelHead = {
  padding: 12,
  borderBottom: "1px solid #eee",
  display: "flex",
  justifyContent: "space-between",
};

const panelTitle = { fontSize: 13, fontWeight: 700 };

const guestContainer = { padding: 40, textAlign: "center" };
const guestCard = { padding: 30, borderRadius: 20, background: "#fff" };
const guestTitle = { fontSize: 24 };
const guestSubtitle = { marginTop: 10, color: "#666" };
const guestActions = { marginTop: 20, display: "flex", gap: 10, justifyContent: "center" };
const guestButton = { padding: 10, borderRadius: 10, border: "none", background: theme.primary, color: "#fff" };

export default UdlsDashboard;