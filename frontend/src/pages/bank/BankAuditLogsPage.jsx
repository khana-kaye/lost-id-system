// import { useEffect, useState, useMemo, useCallback } from "react";
// import PageLayout from "../../components/PageLayout";
// import { theme } from "../../theme";
// import BASE_URL from "../../api";

// function BankAuditLogsPage() {

//   const [logs, setLogs] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchLogs();
//   }, []);

//   const fetchLogs = async () => {
//     try {

//       const res = await fetch(
//         `${BASE_URL}/bank/audit-logs/`
//       );

//       const data = await res.json();

//       setLogs(Array.isArray(data) ? data : []);

//     } catch (err) {

//       console.error("Audit fetch error:", err);

//     } finally {

//       setLoading(false);
//     }
//   };

//   return (
//     <PageLayout>
//       <div style={pageWrapper}>

//         <div style={header}>
//           <div>
//             <h1 style={title}>🏦 Bank Audit Logs</h1>

//             <p style={subtitle}>
//               Activity history for bank staff actions.
//             </p>
//           </div>
//         </div>

//         <div style={tableWrapper}>

//           {loading ? (
//             <div style={emptyState}>
//               Loading logs...
//             </div>
//           ) : logs.length === 0 ? (
//             <div style={emptyState}>
//               No audit logs found
//             </div>
//           ) : (
//             <table style={table}>

//               <thead>
//                 <tr>
//                   <th style={th}>User</th>
//                   <th style={th}>Action</th>
//                   <th style={th}>Target</th>
//                   <th style={th}>Timestamp</th>
//                 </tr>
//               </thead>

//               <tbody>

//                 {logs.map((log) => (

//                   <tr key={log.id}>

//                     <td style={td}>
//                       {log.user}
//                     </td>

//                     <td style={td}>
//                       {log.action}
//                     </td>

//                     <td style={tdMuted}>
//                       {log.target || "-"}
//                     </td>

//                     <td style={tdMuted}>
//                       {new Date(log.timestamp)
//                         .toLocaleString()}
//                     </td>

//                   </tr>
//                 ))}

//               </tbody>

//             </table>
//           )}

//         </div>
//       </div>
//     </PageLayout>
//   );
// }

// const pageWrapper = {
//   maxWidth: "1200px",
//   margin: "0 auto",
//   padding: "24px",
// };

// const header = {
//   marginBottom: "24px",
// };

// const title = {
//   margin: 0,
//   fontSize: "32px",
//   color: theme.dark,
// };

// const subtitle = {
//   marginTop: "8px",
//   color: "#6b7280",
// };

// const tableWrapper = {
//   background: theme.card,
//   borderRadius: "20px",
//   overflow: "hidden",
//   boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
// };

// const table = {
//   width: "100%",
//   borderCollapse: "collapse",
// };

// const th = {
//   textAlign: "left",
//   padding: "14px 18px",
//   fontSize: "12px",
//   color: "#6b7280",
//   borderBottom: "1px solid rgba(0,0,0,0.06)",
// };

// const td = {
//   padding: "16px 18px",
//   borderBottom: "1px solid rgba(0,0,0,0.05)",
//   color: theme.dark,
// };

// const tdMuted = {
//   padding: "16px 18px",
//   borderBottom: "1px solid rgba(0,0,0,0.05)",
//   color: "#6b7280",
// };

// const emptyState = {
//   padding: "50px",
//   textAlign: "center",
//   color: "#6b7280",
// };

// export default BankAuditLogsPage;


import { useMemo, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../../components/PageLayout";
import { theme } from "../../theme";
import BASE_URL from "../../api";

function BankAuditLogsPage() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── FETCH AUDIT LOGS ─────────────────────────────
  const fetchLogs = useCallback(async () => {
    try {
      const res = await fetch(`${BASE_URL}/bank/audit-logs/`);

      if (!res.ok) {
        throw new Error(`Error ${res.status}`);
      }

      const data = await res.json();

      const safeData = Array.isArray(data) ? data : [];

      // sort newest first
      safeData.sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      );

      setLogs(safeData);
      setError(null);

    } catch (err) {
      console.error("Audit log fetch error:", err);
      setError("Failed to load audit logs");
      setLogs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // ── AUTO REFRESH ────────────────────────────────
  useEffect(() => {
    fetchLogs();

    const interval = setInterval(fetchLogs, 15000);

    return () => clearInterval(interval);
  }, [fetchLogs]);

  // ── FILTER LOGS ────────────────────────────────
  const filteredLogs = useMemo(() => {
    const term = search.toLowerCase();

    return logs.filter((log) =>
      log.user?.toLowerCase().includes(term) ||
      log.role?.toLowerCase().includes(term) ||
      log.action?.toLowerCase().includes(term) ||
      log.target?.toLowerCase().includes(term) ||
      log.timestamp?.toLowerCase().includes(term)
    );
  }, [logs, search]);

  // ── FORMAT TIME ────────────────────────────────
  const formatTime = (timestamp) => {
    if (!timestamp) return "-";

    try {
      return new Date(timestamp).toLocaleString([], {
        dateStyle: "medium",
        timeStyle: "short",
      });
    } catch {
      return timestamp;
    }
  };

  return (
    <PageLayout>
      <div style={pageWrapper}>

        {/* HEADER */}
        <div style={header}>
          <div>
            <h1 style={title}>🏦 Bank Audit Log</h1>
            <p style={subtitle}>
              Track bank staff and system activity.
            </p>
          </div>

          <button
            style={backBtn}
            onClick={() => navigate("/bank/dashboard")}
          >
            ← Back
          </button>
        </div>

        {/* SEARCH */}
        <div style={filterBar}>
          <input
            type="text"
            placeholder="Search user, action or target..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={searchInput}
          />
        </div>

        {/* STATS */}
        <div style={statsGrid}>
          <StatCard label="Total Activities" value={logs.length} />
        </div>

        {/* TABLE */}
        <div style={tableWrapper}>
          <div style={tableHeader}>
            <span style={tableTitle}>
              Activity History
            </span>
          </div>

          {loading ? (
            <div style={emptyState}>Loading audit logs...</div>
          ) : error ? (
            <div style={emptyState}>{error}</div>
          ) : filteredLogs.length === 0 ? (
            <div style={emptyState}>No audit records found.</div>
          ) : (
            <table style={table}>
              <thead>
                <tr>
                  <th style={th}>User</th>
                  <th style={th}>Role</th>
                  <th style={th}>Action</th>
                  <th style={th}>Target</th>
                  <th style={th}>Time</th>
                </tr>
              </thead>

              <tbody>
                {filteredLogs.map((log) => (
                  <tr key={log.id || Math.random()}>
                    <td style={td}>{log.user || "System"}</td>
                    <td style={td}>{log.role || "-"}</td>
                    <td style={td}>{log.action || "-"}</td>
                    <td style={tdMuted}>{log.target || "-"}</td>
                    <td style={tdMuted}>{formatTime(log.timestamp)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </PageLayout>
  );
}

// ── STAT CARD ───────────────────────────────
function StatCard({ label, value }) {
  return (
    <div style={statCard}>
      <div style={statLabel}>{label}</div>
      <div style={statValue}>{value}</div>
    </div>
  );
}

// ── STYLES ─────────────────────────────────
const pageWrapper = {
  maxWidth: "1350px",
  margin: "0 auto",
  padding: "24px",
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "24px",
};

const title = {
  margin: 0,
  fontSize: "30px",
  color: theme.dark,
};

const subtitle = {
  marginTop: "6px",
  color: "#6b7280",
};

const backBtn = {
  padding: "12px 18px",
  borderRadius: "12px",
  background: theme.primary,
  color: "#fff",
  border: "none",
  cursor: "pointer",
};

const filterBar = {
  marginBottom: "20px",
};

const searchInput = {
  width: "100%",
  padding: "14px",
  borderRadius: "12px",
  border: "1px solid #d1d5db",
};

const statsGrid = {
  marginBottom: "20px",
};

const statCard = {
  background: theme.card,
  padding: "18px",
  borderRadius: "14px",
};

const statLabel = {
  fontSize: "13px",
  color: "#6b7280",
};

const statValue = {
  fontSize: "26px",
  fontWeight: "700",
};

const tableWrapper = {
  background: theme.card,
  borderRadius: "20px",
  overflow: "hidden",
};

const tableHeader = {
  padding: "16px",
  borderBottom: "1px solid #eee",
};

const tableTitle = {
  fontWeight: "700",
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
};

const th = {
  textAlign: "left",
  padding: "14px",
  fontSize: "12px",
  color: "#6b7280",
};

const td = {
  padding: "14px",
};

const tdMuted = {
  padding: "14px",
  color: "#6b7280",
};

const emptyState = {
  padding: "40px",
  textAlign: "center",
  color: "#6b7280",
};

export default BankAuditLogsPage;