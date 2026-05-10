import { useNavigate } from "react-router-dom";
import PageLayout from "../../components/PageLayout";
import { theme } from "../../theme";

function UnebDashboard() {
  const navigate = useNavigate();

  const UNEB_STATS = [
    { label: "Student Verifications", value: "2,341", delta: "+32 today", positive: true },
    { label: "Certificate Requests", value: "412", delta: "+11 today", positive: true },
    { label: "Flagged Records", value: "27", delta: "needs review", positive: false },
    { label: "Approved Results", value: "1,876", delta: "+21 today", positive: true },
  ];

  const RECENT_ACTIVITY = [
    { name: "Aisha N.", exam: "UACE", status: "verified" },
    { name: "Brian K.", exam: "UCE", status: "flagged" },
    { name: "Sarah T.", exam: "PLE", status: "approved" },
    { name: "John M.", exam: "UACE", status: "rejected" },
  ];

  const STATUS_STYLE = {
    verified: { label: "Verified", bg: "#e7f7ea", color: "#1f7a35" },
    approved: { label: "Approved", bg: "#e7f7ea", color: "#1f7a35" },
    flagged: { label: "Flagged", bg: "#fff3cd", color: "#8a6d1d" },
    rejected: { label: "Rejected", bg: "#fde2e2", color: "#a12d2d" },
  };

  const QUICK_ACTIONS = [
    {
      label: "Verify Results",
      desc: "Check student examination records",
      emoji: "📄",
      route: "/uneb/verify",
    },
    {
      label: "Flag Record",
      desc: "Report suspicious results",
      emoji: "🚨",
      route: "/uneb/flag",
    },
    {
      label: "Generate Reports",
      desc: "View verification history",
      emoji: "📊",
      route: "/uneb/reports",
    },
    {
      label: "Sync Records",
      desc: "Update UNEB records database",
      emoji: "🔄",
      route: "/uneb/sync",
    },
  ];

  return (
    <PageLayout>
      <div style={wrapper}>

        {/* SIDEBAR */}
        <aside style={sidebar}>
          <div style={sidebarTop}>
            <div style={orgBox}>
              <div style={orgIcon}>🎓</div>

              <div>
                <div style={orgTitle}>UNEB Portal</div>
                <div style={orgSub}>Examination Verification System</div>
              </div>
            </div>
          </div>

          <div style={navArea}>
            <button style={navItem} onClick={() => navigate("/uneb/dashboard")}>
              Dashboard
            </button>

            <button style={navItem} onClick={() => navigate("/uneb/verify")}>
              Verify Results
            </button>

            <button style={navItem} onClick={() => navigate("/uneb/flag")}>
              Flag Records
            </button>

            <button style={navItem} onClick={() => navigate("/uneb/reports")}>
              Reports
            </button>
          </div>

          <div style={footer}>
            <button style={logoutBtn} onClick={() => navigate("/logout")}>
              Logout
            </button>
          </div>
        </aside>

        {/* MAIN */}
        <main style={main}>
          <div style={topbar}>
            <h2 style={title}>UNEB Dashboard</h2>
            <p style={sub}>
              Student result verification & academic records monitoring
            </p>
          </div>

          {/* STATS */}
          <div style={statsGrid}>
            {UNEB_STATS.map((s) => (
              <div key={s.label} style={statCard}>
                <div style={statLabel}>{s.label}</div>

                <div style={statValue}>{s.value}</div>

                <div
                  style={{
                    color: s.positive ? "#1f7a35" : "#a12d2d",
                    fontSize: "12px",
                  }}
                >
                  {s.delta}
                </div>
              </div>
            ))}
          </div>

          {/* GRID */}
          <div style={grid}>

            {/* RECENT ACTIVITY */}
            <div style={panel}>
              <h3 style={panelTitle}>Recent Verifications</h3>

              {RECENT_ACTIVITY.map((r, i) => {
                const s = STATUS_STYLE[r.status];

                return (
                  <div key={i} style={row}>
                    <div>
                      <div style={{ fontWeight: "600" }}>{r.name}</div>

                      <div style={{ fontSize: "12px", color: "#6b7280" }}>
                        {r.exam}
                      </div>
                    </div>

                    <span
                      style={{
                        background: s.bg,
                        color: s.color,
                        padding: "4px 10px",
                        borderRadius: "999px",
                        fontSize: "11px",
                        fontWeight: "600",
                      }}
                    >
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* QUICK ACTIONS */}
            <div style={panel}>
              <h3 style={panelTitle}>Quick Actions</h3>

              {QUICK_ACTIONS.map((q, i) => (
                <button
                  key={i}
                  style={actionBtn}
                  onClick={() => navigate(q.route)}
                >
                  <span style={{ fontSize: "18px" }}>{q.emoji}</span>

                  <div>
                    <div style={{ fontWeight: "600" }}>{q.label}</div>

                    <div style={{ fontSize: "12px", color: "#6b7280" }}>
                      {q.desc}
                    </div>
                  </div>
                </button>
              ))}
            </div>

          </div>
        </main>
      </div>
    </PageLayout>
  );
}

/* STYLES */

const wrapper = {
  display: "flex",
  height: "100vh",
  background: "#f4f6fa",
};

const sidebar = {
  width: "220px",
  background: theme.card,
  display: "flex",
  flexDirection: "column",
  borderRight: "1px solid #eee",
};

const sidebarTop = {
  padding: "18px",
  borderBottom: "1px solid #eee",
};

const orgBox = {
  display: "flex",
  gap: "10px",
  alignItems: "center",
};

const orgIcon = {
  width: "36px",
  height: "36px",
  background: theme.primary,
  borderRadius: "10px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const orgTitle = {
  fontWeight: "700",
};

const orgSub = {
  fontSize: "12px",
  color: "#6b7280",
};

const navArea = {
  padding: "10px",
  display: "flex",
  flexDirection: "column",
  gap: "8px",
};

const navItem = {
  padding: "10px",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  textAlign: "left",
  background: "transparent",
};

const footer = {
  marginTop: "auto",
  padding: "12px",
};

const logoutBtn = {
  width: "100%",
  padding: "10px",
  background: "#ef4444",
  color: "white",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
};

const main = {
  flex: 1,
  padding: "20px",
};

const topbar = {
  marginBottom: "20px",
};

const title = {
  margin: 0,
};

const sub = {
  color: "#6b7280",
  fontSize: "13px",
};

const statsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: "12px",
  marginBottom: "20px",
};

const statCard = {
  background: "white",
  padding: "14px",
  borderRadius: "14px",
  boxShadow: "0 5px 20px rgba(0,0,0,0.05)",
};

const statLabel = {
  fontSize: "12px",
  color: "#6b7280",
};

const statValue = {
  fontSize: "22px",
  fontWeight: "700",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "16px",
};

const panel = {
  background: "white",
  padding: "16px",
  borderRadius: "14px",
  boxShadow: "0 5px 20px rgba(0,0,0,0.05)",
};

const panelTitle = {
  marginBottom: "12px",
};

const row = {
  display: "flex",
  justifyContent: "space-between",
  padding: "10px 0",
  borderBottom: "1px solid #eee",
};

const actionBtn = {
  width: "100%",
  display: "flex",
  gap: "10px",
  padding: "10px",
  border: "none",
  background: "transparent",
  cursor: "pointer",
  textAlign: "left",
};

export default UnebDashboard;