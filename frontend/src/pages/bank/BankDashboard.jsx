import { useNavigate } from "react-router-dom";
import PageLayout from "../../components/PageLayout";
import { theme } from "../../theme";
import { useEffect, useState } from "react";
import BASE_URL from "../../api";
import BankSettings from "../bank/BankSettings";
import BankProfilePage from "../bank/BankProfilePage";

function BankDashboard() {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  //const [loading, setLoading] = useState(true);

  const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  sessionStorage.clear();

  navigate("/login");
};




  const fetchReports = async () => {
  try {

    const res = await fetch(
      `${BASE_URL}/atm/reports/`
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


  

    
     

  

const [activeView, setActiveView] = useState("recent");
const [selectedReport, setSelectedReport] = useState(null);
const [formData, setFormData] = useState({
  card_holder: "",
  account_number: "",
  bank_name: "",
  card_type: "",
  reason: "",
});
const [loading, setLoading] = useState(false);
const [logs, setLogs] = useState([]);
const [auditLoading, setAuditLoading] = useState(false);

const navButtonStyle = (view) =>
  activeView === view || (view === "reports" && activeView === "details")
    ? { ...navItem, background: "#ffedd5", color: "#92400e" }
    : navItem;

  //  quick actions 
  const QUICK_ACTIONS = [
    {
      label: "Report Lost ATM",
      desc: "Create ATM loss report",
      emoji: "💳",
      action: () => {
        setSelectedReport(null);
        setActiveView("report");
      },
    },

    {
      label: "View Reports",
      desc: "See all ATM reports",
      emoji: "📄",
      action: () => {
        setSelectedReport(null);
        setActiveView("reports");
      },
    },
  ];

  const handleReportChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/atm/reports/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Failed to submit report");
      }

      alert("ATM report submitted");
      setFormData({
        card_holder: "",
        account_number: "",
        bank_name: "",
        card_type: "",
        reason: "",
      });
      fetchReports();
      setActiveView("recent");
    } catch (err) {
      console.error(err);
      alert("Submission failed");
    } finally {
      setLoading(false);
    }
  };

  const toggleCardStatus = async (report) => {
    try {
      const action = report.card_status === "Frozen" ? "resolve" : "freeze";
      const res = await fetch(`${BASE_URL}/atm/reports/${report.id}/toggle/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action }),
      });

      if (!res.ok) {
        throw new Error("Failed to update card");
      }

      fetchReports();
    } catch (err) {
      console.error(err);
      alert("Failed to update card");
    }
  };

  const fetchAuditLogs = async () => {
    setAuditLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/bank/audit-logs/`);
      const data = await res.json();
      setLogs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Audit fetch error:", err);
      setLogs([]);
    } finally {
      setAuditLoading(false);
    }
  };

  useEffect(() => {
    if (activeView === "audit") {
      fetchAuditLogs();
    }
  }, [activeView]);

  const handleReportSelect = (report) => {
    setSelectedReport(report);
    setActiveView("details");
  };

  const renderPanelContent = () => {
    if (activeView === "report") {
      return (
        <>
          <h3 style={panelTitle}>Report Lost ATM</h3>
          <form onSubmit={handleReportSubmit} style={formPanel}>
            <input
              type="text"
              name="card_holder"
              placeholder="Card Holder Name"
              value={formData.card_holder}
              onChange={handleReportChange}
              style={input}
              required
            />
            <input
              type="text"
              name="account_number"
              placeholder="Account Number"
              value={formData.account_number}
              onChange={handleReportChange}
              style={input}
              required
            />
            <input
              type="text"
              name="bank_name"
              placeholder="Bank Name"
              value={formData.bank_name}
              onChange={handleReportChange}
              style={input}
              required
            />
            <input
              type="text"
              name="card_type"
              placeholder="Card Type"
              value={formData.card_type}
              onChange={handleReportChange}
              style={input}
              required
            />
            <input
              type="text"
              name="reason"
              placeholder="Reason for reporting lost ATM"
              value={formData.reason}
              onChange={handleReportChange}
              style={input}
              required
            />
            <button type="submit" style={button}>
              {loading ? "Submitting..." : "Submit Report"}
            </button>
          </form>
        </>
      );
    }

    if (activeView === "reports") {
      return (
        <>
          <div style={detailsHeader}>
            <h3 style={panelTitle}>All ATM Reports</h3>
            <button style={secondaryBtn} onClick={() => setActiveView("recent")}>Back to Dashboard</button>
          </div>
          {reports.length === 0 ? (
            <p style={emptyState}>No ATM reports available.</p>
          ) : (
            reports.map((r, i) => {
              const s = STATUS_STYLE[r.status] || STATUS_STYLE["Pending"];
              return (
                <button
                  key={i}
                  type="button"
                  style={{ ...row, ...clickableRow }}
                  onClick={() => handleReportSelect(r)}
                >
                  <div>
                    <div style={{ fontWeight: 600 }}>{r.card_holder}</div>
                    <div style={{ fontSize: "12px", color: "#6b7280" }}>
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
                </button>
              );
            })
          )}
        </>
      );
    }

    if (activeView === "freeze") {
      return (
        <>
          <div style={detailsHeader}>
            <h3 style={panelTitle}>Freeze Card Management</h3>
            <button style={secondaryBtn} onClick={() => setActiveView("recent")}>Back to Dashboard</button>
          </div>
          <div style={infoBox}>
            <div style={infoTitle}>Automatic Protection</div>
            <div style={infoText}>
              ATM cards reported missing are automatically frozen for customer safety.
              Use the controls below to freeze or unfreeze cards directly.
            </div>
          </div>
          {reports.length === 0 ? (
            <p style={emptyState}>No ATM reports available.</p>
          ) : (
            <div style={tableWrapper}>
              <table style={table}>
                <thead>
                  <tr>
                    <th style={th}>Card Holder</th>
                    <th style={th}>Account</th>
                    <th style={th}>Case</th>
                    <th style={th}>Card</th>
                    <th style={th}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report) => (
                    <tr key={report.id}>
                      <td style={td}>{report.card_holder}</td>
                      <td style={td}>{report.account_number}</td>
                      <td style={td}>{report.status}</td>
                      <td style={td}>
                        <span
                          style={{
                            ...badge,
                            background:
                              report.card_status === "Frozen"
                                ? "#fee2e2"
                                : "#dcfce7",
                            color:
                              report.card_status === "Frozen"
                                ? "#991b1b"
                                : "#166534",
                          }}
                        >
                          {report.card_status}
                        </span>
                      </td>
                      <td style={td}>
                        <button
                          style={{
                            ...actionBtn,
                            background:
                              report.card_status === "Frozen"
                                ? "#16a34a"
                                : "#dc2626",
                            color: "white",
                          }}
                          onClick={() => toggleCardStatus(report)}
                        >
                          {report.card_status === "Frozen"
                            ? "Unfreeze Card"
                            : "Freeze Card"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      );
    }

    if (activeView === "audit") {
      return (
        <>
          <div style={detailsHeader}>
            <h3 style={panelTitle}>Bank Audit Logs</h3>
            <button style={secondaryBtn} onClick={() => setActiveView("recent")}>Back to Dashboard</button>
          </div>
          {auditLoading ? (
            <p style={emptyState}>Loading logs...</p>
          ) : logs.length === 0 ? (
            <p style={emptyState}>No audit logs found.</p>
          ) : (
            <div style={tableWrapper}>
              <table style={table}>
                <thead>
                  <tr>
                    <th style={th}>User</th>
                    <th style={th}>Action</th>
                    <th style={th}>Target</th>
                    <th style={th}>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log.id}>
                      <td style={td}>{log.user}</td>
                      <td style={td}>{log.action}</td>
                      <td style={tdMuted}>{log.target || "-"}</td>
                      <td style={tdMuted}>{new Date(log.timestamp).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      );
    }

    if (activeView === "details" && selectedReport) {
      const s = STATUS_STYLE[selectedReport.status] || STATUS_STYLE["Pending"];
      return (
        <>
          <div style={detailsHeader}>
            <h3 style={panelTitle}>Report Details</h3>
            <button style={secondaryBtn} onClick={() => setActiveView("reports")}>Back</button>
          </div>
          <div style={detailCard}>
            <div style={detailRow}>
              <div style={detailLabel}>Card Holder</div>
              <div>{selectedReport.card_holder}</div>
            </div>
            <div style={detailRow}>
              <div style={detailLabel}>Account Number</div>
              <div>{selectedReport.account_number}</div>
            </div>
            <div style={detailRow}>
              <div style={detailLabel}>Bank Name</div>
              <div>{selectedReport.bank_name}</div>
            </div>
            <div style={detailRow}>
              <div style={detailLabel}>Card Type</div>
              <div>{selectedReport.card_type}</div>
            </div>
            <div style={detailRow}>
              <div style={detailLabel}>Reason</div>
              <div>{selectedReport.reason}</div>
            </div>
            <div style={detailRow}>
              <div style={detailLabel}>Status</div>
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
          </div>
        </>
      );
    }

    if (activeView === "settings") {
      return <BankSettings embedded />;
    }

    if (activeView === "profile") {
      return (
        <>
          <h3 style={panelTitle}>Bank Profile</h3>
          return <BankProfilePage embedded />;
        </>
      );
    }

    return (

      
      <>
        <h3 style={panelTitle}>Quick Actions</h3>
        {QUICK_ACTIONS.map((q, i) => (
          <button key={i} style={actionBtn} onClick={q.action}>
            <span style={{ fontSize: "18px" }}>{q.emoji}</span>
            <div>
              <div style={{ fontWeight: 600 }}>{q.label}</div>
              <div style={{ fontSize: "12px", color: "#6b7280" }}>{q.desc}</div>
            </div>
          </button>
        ))}
      </>
    );
  };

  const contentGrid = activeView === "recent" ? grid : { ...grid, gridTemplateColumns: "1fr" };

  const headerCopy = {
    recent: {
      title: "ATM Management Dashboard",
      subtitle: "Monitor lost ATM reports and customer card security.",
    },
    report: {
      title: "Report Lost ATM",
      subtitle: "Create a new lost ATM report without leaving the dashboard.",
    },
    reports: {
      title: "ATM Reports",
      subtitle: "See all lost ATM cases in one place.",
    },
    freeze: {
      title: "Freeze Card Management",
      subtitle: "Freeze or unfreeze cards directly from the dashboard.",
    },
    audit: {
      title: "Bank Audit Logs",
      subtitle: "Review recent bank audit activity.",
    },
    

    settings: {
      title: "Bank Settings",
      subtitle: "Manage your bank account settings.",
    },

    profile: {
      title: "Bank Profile",
      subtitle: "View your bank profile information.",
    },

    details: {
      title: "Report Details",
      subtitle: "Review the selected ATM report.",
    },
  };

  const pageHeader = headerCopy[activeView] || headerCopy.recent;

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
              style={navButtonStyle("recent")}
              onClick={() => {
                setSelectedReport(null);
                setActiveView("recent");
              }}
            >
              Dashboard
            </button>

            <button
              style={navButtonStyle("report")}
              onClick={() => {
                setSelectedReport(null);
                setActiveView("report");
              }}
            >
              Report Lost ATM
            </button>

            <button
              style={navButtonStyle("freeze")}
              onClick={() => {
                setSelectedReport(null);
                setActiveView("freeze");
              }}
            >
              Freeze Card
            </button>

            <button
              style={navButtonStyle("reports")}
              onClick={() => {
                setSelectedReport(null);
                setActiveView("reports");
              }}
            >
              Reports
            </button>

            <button
              style={navButtonStyle("audit")}
              onClick={() => {
                setSelectedReport(null);
                setActiveView("audit");
              }}
            >
              Audit Logs
            </button>

            <button
              style={navButtonStyle("settings")}
              onClick={() => {
                setSelectedReport(null);
                setActiveView("settings");
              }}
            >
              Settings
            </button>

           

            <button
              style={navButtonStyle("profile")}
              onClick={() => {
                setSelectedReport(null);
                setActiveView("profile");
              }}
            >
              Profile
            </button>
          </div>

          <div style={footer}>
            <button
              style={logoutBtn}
              onClick={handleLogout}>
            
              Logout
            </button>
          </div>

        </aside>

        {/* MAIN */}
        <main style={main}>

          <div style={topbar}>
            <h2 style={title}>
              {pageHeader.title}
            </h2>

            <p style={sub}>
              {pageHeader.subtitle}
            </p>
          </div>

          {/* STATS */}
          {activeView === "recent" && (

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

          )}
          

          {/* CONTENT */}
          <div style={contentGrid}>

            {activeView === "recent" && (
              <div style={panel}>
                <h3 style={panelTitle}>Recent ATM Reports</h3>
                {reports.map((r, i) => {
                  const s = STATUS_STYLE[r.status] || STATUS_STYLE["Pending"];

                  return (
                    <button
                      key={i}
                      type="button"
                      style={{ ...row, ...clickableRow }}
                      onClick={() => handleReportSelect(r)}
                    >
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
                    </button>
                  );
                })}
              </div>
            )}

            <div style={panel}>
              {renderPanelContent()}
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

const formPanel = {
  display: "flex",
  flexDirection: "column",
  gap: "14px",
};

const input = {
  padding: "14px",
  borderRadius: "12px",
  border: "1px solid #d1d5db",
};

const button = {
  padding: "14px",
  border: "none",
  borderRadius: "12px",
  background: theme.primary,
  color: "#fff",
  fontWeight: "700",
  cursor: "pointer",
};

const emptyState = {
  color: "#6b7280",
  fontSize: "14px",
};

const clickableRow = {
  cursor: "pointer",
  width: "100%",
  background: "transparent",
  border: "none",
  textAlign: "left",
};

const detailsHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "16px",
};

const secondaryBtn = {
  padding: "10px 14px",
  border: "1px solid #d1d5db",
  borderRadius: "12px",
  background: "white",
  cursor: "pointer",
};

const detailCard = {
  background: "#f8fafc",
  borderRadius: "14px",
  padding: "16px",
};

const detailRow = {
  display: "grid",
  gridTemplateColumns: "120px 1fr",
  gap: "10px",
  padding: "10px 0",
  borderBottom: "1px solid #e5e7eb",
};

const detailLabel = {
  color: "#6b7280",
  fontWeight: "600",
};

const infoBox = {
  background: "#eff6ff",
  padding: "18px",
  borderRadius: "14px",
  marginBottom: "20px",
};

const infoTitle = {
  fontWeight: "700",
  marginBottom: "8px",
};

const infoText = {
  color: "#475569",
  lineHeight: "1.75",
};

const tableWrapper = {
  background: "white",
  borderRadius: "20px",
  overflow: "hidden",
  boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
};

const th = {
  textAlign: "left",
  padding: "14px 18px",
  fontSize: "12px",
  color: "#6b7280",
  borderBottom: "1px solid rgba(0,0,0,0.06)",
};

const td = {
  padding: "16px 18px",
  borderBottom: "1px solid rgba(0,0,0,0.05)",
  color: theme.dark,
};

const tdMuted = {
  padding: "16px 18px",
  borderBottom: "1px solid rgba(0,0,0,0.05)",
  color: "#6b7280",
};

const badge = {
  borderRadius: "999px",
  padding: "4px 10px",
  fontSize: "11px",
  fontWeight: "600",
};

export default BankDashboard;