import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../../components/PageLayout";
import { theme } from "../../theme";

function BankDashboard() {
  const navigate = useNavigate();
  const [active, setActive] = useState("/bank");

  const BANK_STATS = [
    { label: "Verification Requests", value: "1,204", delta: "+18 today", positive: true },
    { label: "Flagged IDs", value: "76", delta: "requires review", positive: false },
    { label: "Approved Accounts", value: "892", delta: "+9 today", positive: true },
    { label: "Rejected Applications", value: "134", delta: "+2 today", positive: false },
  ];

  const RECENT_CHECKS = [
    { name: "Nakato R.", id: "CM123456", status: "approved" },
    { name: "Ssemwogerere J.", id: "CM998877", status: "flagged" },
    { name: "Auma B.", id: "CM112233", status: "approved" },
    { name: "Mukasa P.", id: "CM445566", status: "rejected" },
  ];

  const STATUS_STYLE = {
    approved: { label: "Approved", bg: "#e7f7ea", color: "#1f7a35" },
    flagged: { label: "Flagged", bg: "#fff3cd", color: "#8a6d1d" },
    rejected: { label: "Rejected", bg: "#fde2e2", color: "#a12d2d" },
  };

  const QUICK_ACTIONS = [
    { label: "Verify ID", desc: "Check ID validity with NIRA", emoji: "🔍", route: "/bank/verify" },
    { label: "Flag Suspicious", desc: "Report suspicious identity", emoji: "🚨", route: "/bank/flag" },
    { label: "NIRA Sync", desc: "Fetch latest ID updates", emoji: "🔄", route: "/bank/sync" },
    { label: "Reports", desc: "View verification history", emoji: "📊", route: "/bank/reports" },
  ];

  return (
    <PageLayout>
      <div style={wrapper}>

        {/* SIDEBAR */}
        <aside style={sidebar}>
          <div style={sidebarTop}>
            <div style={orgBox}>
              <div style={orgIcon}>🏦</div>
              <div>
                <div style={orgTitle}>Bank Portal</div>
                <div style={orgSub}>Identity Verification System</div>
              </div>
            </div>
          </div>

          <div style={navArea}>
            <button style={navItem} onClick={() => navigate("/bank")}>Dashboard</button>
            <button style={navItem} onClick={() => navigate("/bank/verify")}>Verify ID</button>
            <button style={navItem} onClick={() => navigate("/bank/flag")}>Flag ID</button>
            <button style={navItem} onClick={() => navigate("/bank/reports")}>Reports</button>
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
            <h2 style={title}>Bank Dashboard</h2>
            <p style={sub}>Identity verification & fraud monitoring</p>
          </div>

          {/* STATS */}
          <div style={statsGrid}>
            {BANK_STATS.map((s) => (
              <div key={s.label} style={statCard}>
                <div style={statLabel}>{s.label}</div>
                <div style={statValue}>{s.value}</div>
                <div style={{ color: s.positive ? "#1f7a35" : "#a12d2d", fontSize: "12px" }}>
                  {s.delta}
                </div>
              </div>
            ))}
          </div>

          {/* CONTENT GRID */}
          <div style={grid}>

            {/* RECENT */}
            <div style={panel}>
              <h3 style={panelTitle}>Recent Checks</h3>

              {RECENT_CHECKS.map((r, i) => {
                const s = STATUS_STYLE[r.status];
                return (
                  <div key={i} style={row}>
                    <div>
                      <div style={{ fontWeight: "600" }}>{r.name}</div>
                      <div style={{ fontSize: "12px", color: "#6b7280" }}>{r.id}</div>
                    </div>

                    <span style={{
                      background: s.bg,
                      color: s.color,
                      padding: "4px 10px",
                      borderRadius: "999px",
                      fontSize: "11px",
                      fontWeight: "600",
                    }}>
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
                    <div style={{ fontSize: "12px", color: "#6b7280" }}>{q.desc}</div>
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




const wrapper = { display: "flex", height: "100vh", background: "#f4f6fa" };

const sidebar = {
  width: "220px",
  background: theme.card,
  display: "flex",
  flexDirection: "column",
  borderRight: "1px solid #eee",
};

const sidebarTop = { padding: "18px", borderBottom: "1px solid #eee" };

const orgBox = { display: "flex", gap: "10px", alignItems: "center" };

const orgIcon = {
  width: "36px",
  height: "36px",
  background: theme.primary,
  borderRadius: "10px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const orgTitle = { fontWeight: "700" };
const orgSub = { fontSize: "12px", color: "#6b7280" };

const navArea = { padding: "10px", display: "flex", flexDirection: "column", gap: "8px" };

const navItem = {
  padding: "10px",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  textAlign: "left",
  background: "transparent",
};

const footer = { marginTop: "auto", padding: "12px" };

const logoutBtn = {
  width: "100%",
  padding: "10px",
  background: "#ef4444",
  color: "white",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
};

const main = { flex: 1, padding: "20px" };

const topbar = { marginBottom: "20px" };

const title = { margin: 0 };
const sub = { color: "#6b7280", fontSize: "13px" };

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

const statLabel = { fontSize: "12px", color: "#6b7280" };
const statValue = { fontSize: "22px", fontWeight: "700" };

const grid = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" };

const panel = {
  background: "white",
  padding: "16px",
  borderRadius: "14px",
  boxShadow: "0 5px 20px rgba(0,0,0,0.05)",
};

const panelTitle = { marginBottom: "12px" };

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

export default BankDashboard;