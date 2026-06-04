import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../../components/PageLayout";
import { theme } from "../../theme";
import BASE_URL from "../../api";

import { useCallback } from "react";



function UdlsAuditPage({ embedded }) {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [logs, setLogs] = useState([]);
  //const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //fetch audit from backend
  

const fetchLogs = useCallback(async () => {
  try {
    const res = await fetch(`${BASE_URL}/udls/audit-logs/`);

    if (!res.ok) {
      throw new Error(`Error ${res.status}`);
    }

    const data = await res.json();

    // ensure array + sort newest first
    const safeData = Array.isArray(data) ? data : [];

    safeData.sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );

    setLogs(safeData);

  } catch (err) {
    console.error("Audit log fetch error:", err);
    setError("Failed to load audit logs");
    setLogs([]);
  } finally {
    setLoading(false);
  }
}, []);

  // ── LOAD + AUTO REFRESH ──────────────────────────────────────
  useEffect(() => {
    fetchLogs();


    const interval = setInterval(fetchLogs, 15000);


    

    // const interval = setInterval(() => {
    //   fetchLogs();
    // }, 15000);

    return () => clearInterval(interval);
  }, [fetchLogs]);

  // ── filtering ────────────────────────────────────────────────
  const filteredLogs = useMemo(() => {
    const searchTerm = search.toLowerCase();
    return logs.filter((log) => {
      return(
         log.user?.toLowerCase().includes(searchTerm) ||
      log.role?.toLowerCase().includes(searchTerm) ||
      log.action?.toLowerCase().includes(searchTerm) ||
      log.target?.toLowerCase().includes(searchTerm) ||
      log.timestamp?.toLowerCase().includes(searchTerm)
    );
  });
}, [logs, search]);
      
      

      

  // ── stats ────────────────────────────────────────────────────
  const stats = {
    total: logs.length,
  };

  const content = (
    <div style={pageWrapper}>

        {/* ── header ───────────────────────────────── */}
        <div style={header}>
          <div>
            <h1 style={title}>◷ Audit Log</h1>

            <p style={subtitle}>
              Track officer and system activity across the platform.
            </p>
          </div>

          <button
            style={backBtn}
            onClick={() => navigate("/admin")}
          >
            ← Back
          </button>
        </div>

        {/* ── search + filters ─────────────────────── */}
        <div style={filterBar}>

          <input
            type="text"
            placeholder="Search officer, action or target..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={searchInput}
          />

        </div>

        {/* ── stats ────────────────────────────────── */}
        <div style={statsGrid}>

          <StatCard
            label="Total Activities"
            value={stats.total}
          />

        </div>

        {/* ── audit table ──────────────────────────── */}
        <div style={tableWrapper}>

          <div style={tableHeader}>
            <span style={tableTitle}>
              Activity History
            </span>
          </div>

          {loading ? (
            <div style={emptyState}>
              Loading audit logs...
            </div>
          ) : filteredLogs.length === 0 ? (
            <div style={emptyState}>
              No audit records found.
            </div>
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

                    <td style={td}>
                      {log.user || "System"}
                    </td>

                    <td style={td}>
                      {log.role || "-"}
                    </td>


                    <td style={td}>
                      {log.action || "-"}
                    </td>

                    <td style={tdMuted}>
                      {log.target || "-"}
                    </td>

                    <td style={tdMuted}>
                      {formatTime(log.timestamp)}
                    </td>

                    {/* <td style={tdMuted}>
                      {formatTime(log.timestamp)}
                    </td>

                    <td style={td}>
                      {log.action || "-"}
                    </td>
                    <td style={tdMuted}>
                      {log.target || "-"}
                    </td>

                    <td style={tdMuted}>
                      {log.timestamp || "-"}
                    </td> */}

                  </tr>
                ))}

              </tbody>

            </table>
          )}


          </div>
      </div>
  );

  return embedded ? content : <PageLayout>{content}</PageLayout>;
}

 // ── FORMAT TIME ──────────────────────────────────────────────
// function formatTime(timestamp) {
//   if (!timestamp) return "-";

//   try {
//     return new Date(timestamp).toLocaleString();
//   } catch {
//     return timestamp;
//   }
// }  

function formatTime(timestamp) {
  if (!timestamp) return "-";

  try {
    return new Date(timestamp).toLocaleString([], {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return timestamp;
  }
}

// ── stat card ──────────────────────────────────────────────────
function StatCard({ label, value }) {
  return (
    <div style={statCard}>
      <div style={statLabel}>
        {label}
      </div>

      <div style={statValue}>
        {value}
      </div>
    </div>
  );
}

// ── styles ─────────────────────────────────────────────────────

const pageWrapper = {
  maxWidth: "1350px",
  margin: "0 auto",
  padding: "24px",
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "24px",
  gap: "12px",
  flexWrap: "wrap",
};

const title = {
  margin: 0,
  fontSize: "32px",
  color: theme.dark,
};

const subtitle = {
  marginTop: "8px",
  color: "#6b7280",
};

const backBtn = {
  padding: "12px 18px",
  borderRadius: "12px",
  border: "none",
  background: theme.primary,
  color: "#fff",
  cursor: "pointer",
  fontWeight: "700",
};

const filterBar = {
  display: "flex",
  gap: "12px",
  marginBottom: "22px",
  flexWrap: "wrap",
};

const searchInput = {
  flex: 1,
  minWidth: "240px",
  padding: "14px",
  borderRadius: "12px",
  border: "1px solid #d1d5db",
  fontSize: "14px",
};

// const filterSelect = {
//   padding: "14px",
//   borderRadius: "12px",
//   border: "1px solid #d1d5db",
//   fontSize: "14px",
//   background: "#fff",
// };

const statsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "14px",
  marginBottom: "24px",
};

const statCard = {
  background: theme.card,
  borderRadius: "18px",
  padding: "20px",
  boxShadow: "0 4px 18px rgba(0,0,0,0.05)",
};

const statLabel = {
  fontSize: "13px",
  color: "#6b7280",
};

const statValue = {
  fontSize: "28px",
  fontWeight: "700",
  marginTop: "8px",
  color: theme.dark,
};

const tableWrapper = {
  background: theme.card,
  borderRadius: "20px",
  overflow: "hidden",
  boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
};

const tableHeader = {
  padding: "18px 20px",
  borderBottom: "1px solid rgba(0,0,0,0.06)",
};

const tableTitle = {
  fontSize: "15px",
  fontWeight: "700",
  color: theme.dark,
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
  fontSize: "13px",
};

const tdMuted = {
  padding: "16px 18px",
  borderBottom: "1px solid rgba(0,0,0,0.05)",
  color: "#6b7280",
  fontSize: "13px",
};

const emptyState = {
  padding: "60px",
  textAlign: "center",
  color: "#6b7280",
};

export default UdlsAuditPage;