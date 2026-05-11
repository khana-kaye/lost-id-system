import { useNavigate } from "react-router-dom";
import PageLayout from "../../components/PageLayout";
import { theme } from "../../theme";
import { useEffect, useState } from "react";
import BASE_URL from "../../api";

function BankDashboard() {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  //const [loading, setLoading] = useState(true);


  const fetchReports = async () => {
  try {

    const res = await fetch(
      `${BASE_URL}/atm-reports/`
    );

    if (!res.ok) {
      throw new Error("Failed to fetch reports");
    }

    const data = await res.json();

    setReports(data);

  } catch (err) {

    console.error(err);

  } finally {

    //setLoading(false);

  }
};


useEffect(() => {
  fetchReports();
}, []);



const BANK_STATS = [
  {
    label: "Lost ATM Reports",
    value: reports.length,
    delta: "all reports",
    positive: true,
  },

  {
    label: "Resolved Cases",
    value: reports.filter(
      (r) => r.status === "Resolved"
    ).length,

    delta: "completed",
    positive: true,
  },

  {
    label: "Pending Cases",
    value: reports.filter(
      (r) => r.status === "Pending"
    ).length,

    delta: "awaiting action",
    positive: false,
  },
];

const STATUS_STYLE = {
  Pending: {
    label: "Pending",
    bg: "#fff3cd",
    color: "#8a6d1d",
  },

  Resolved: {
    label: "Resolved",
    bg: "#e7f7ea",
    color: "#1f7a35",
  },
};


  

    
     

  

  // ── quick actions ────────────────────────────────────
  const QUICK_ACTIONS = [
  {
    label: "Report Lost ATM",
    desc: "Create ATM loss report",
    emoji: "💳",
    route: "/bank/report",
  },

  {
    label: "View Reports",
    desc: "See all ATM reports",
    emoji: "📄",
    route: "/bank/reports",
  },
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
                <div style={orgTitle}>
                  Bank ATM Portal
                </div>

                <div style={orgSub}>
                  Lost ATM Management System
                </div>
              </div>

            </div>
          </div>

          <div style={navArea}>

            <button
              style={navItem}
              onClick={() => navigate("/bank/dashboard")}
            >
              Dashboard
            </button>

            <button
              style={navItem}
              onClick={() => navigate("/bank/report")}
            >
              Report Lost ATM
            </button>

            <button
              style={navItem}
              onClick={() => navigate("/bank/freeze")}
            >
              Freeze Card
            </button>

            <button
              style={navItem}
              onClick={() => navigate("/bank/reports")}
            >
              Reports
            </button>

          </div>

          <div style={footer}>
            <button
              style={logoutBtn}
              onClick={() => navigate("/logout")}
            >
              Logout
            </button>
          </div>

        </aside>

        {/* MAIN */}
        <main style={main}>

          <div style={topbar}>
            <h2 style={title}>
              ATM Management Dashboard
            </h2>

            <p style={sub}>
              Monitor lost ATM reports and customer card security.
            </p>
          </div>

          {/* STATS */}
          <div style={statsGrid}>

            {BANK_STATS.map((s) => (
              <div key={s.label} style={statCard}>

                <div style={statLabel}>
                  {s.label}
                </div>

                <div style={statValue}>
                  {s.value}
                </div>

                <div
                  style={{
                    color: s.positive
                      ? "#1f7a35"
                      : "#a12d2d",

                    fontSize: "12px",
                  }}
                >
                  {s.delta}
                </div>

              </div>
            ))}

          </div>

          {/* CONTENT */}
          <div style={grid}>

            {/* RECENT */}
            <div style={panel}>

              <h3 style={panelTitle}>
                Recent ATM Reports
              </h3>

              {reports.map((r, i) => {
                const s = STATUS_STYLE[r.status] || STATUS_STYLE["Pending"];

                return (
                  <div key={i} style={row}>

                    <div>
                      <div style={{ fontWeight: "600" }}>
                        {r.card_holder}
                      </div>

                      <div
                        style={{
                          fontSize: "12px",
                          color: "#6b7280",
                        }}
                      >
                        {r.account_number}
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

              <h3 style={panelTitle}>
                Quick Actions
              </h3>

              {QUICK_ACTIONS.map((q, i) => (
                <button
                  key={i}
                  style={actionBtn}
                  onClick={() => navigate(q.route)}
                >

                  <span style={{ fontSize: "18px" }}>
                    {q.emoji}
                  </span>

                  <div>

                    <div style={{ fontWeight: "600" }}>
                      {q.label}
                    </div>

                    <div
                      style={{
                        fontSize: "12px",
                        color: "#6b7280",
                      }}
                    >
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

export default BankDashboard;