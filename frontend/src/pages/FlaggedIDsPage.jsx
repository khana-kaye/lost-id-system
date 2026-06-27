import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../components/PageLayout";
import { theme } from "../theme";
import BASE_URL from "../api";







// ── severity styles ──────────────────────────────────────────────


function FlaggedIDsPage({ embedded }) {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  

  const [flaggedData, setFlaggedData] = useState([]);
  const [loading, setLoading] = useState(true);

  // ── FETCH FLAGGED IDS ─────────────────────────────────────────
  const fetchFlagged = async () => {
    try {
      const res = await fetch(`${BASE_URL}/flagged-ids/`);

      if (!res.ok) throw new Error("Failed to fetch flagged IDs");

      const data = await res.json();

      console.log("FLAGGED API RESPONSE:", data);

      setFlaggedData(Array.isArray(data) ? data : []);
      setLoading(false);

    } catch (err) {
      console.error("Flagged fetch error:", err);
      setFlaggedData([]);
      setLoading(false);
    }
  };


  // ── LOAD + LIVE UPDATE ────────────────────────────────────────
  useEffect(() => {
    fetchFlagged();

    const interval = setInterval(() => {
      fetchFlagged();
    }, 15000);

    return () => clearInterval(interval);
  }, []);


  // ── filtered data ──────────────────────────────────────────────
  const filteredData = useMemo(() => {
    return flaggedData.filter((item) => {
      const owner = item.owner?.toLowerCase() || "";
      const idNumber = item.id_number?.toLowerCase() || "";

       return (
        owner.includes(search.toLowerCase()) ||
        idNumber.includes(search.toLowerCase())
      );
    });
  }, [search, flaggedData]);

  //      const matchesSearch =
  //       owner.includes(search.toLowerCase()) ||
  //       nin.includes(search.toLowerCase());

  //     const matchesFilter =
  //       filter === "all" ? true : item.severity === filter;

  //     return matchesSearch && matchesFilter;
  //   });
  // }, [search, filter, flaggedData]);

  // ── stats ──────────────────────────────────────────────────────
  const stats = {
  total: flaggedData.length,

  resolved: flaggedData.filter(
    (i) => i.status === "Resolved"
  ).length,
};

  const content = (
    <div style={pageWrapper}>

        {/* ── header ───────────────────────────────────── */}
        <div style={header}>
          <div>
            <h1 style={title}>⚑ Flagged IDs</h1>
            <p style={subtitle}>
              Automatically detected suspicious records from the system.
            </p>
          </div>

          <button
            style={backBtn}
            onClick={() => navigate("/admin")}
          >
            ← Back
          </button>
        </div>

        {/* ── filters ──────────────────────────────────── */}
        <div style={filterBar}>

          <input
            type="text"
            placeholder="Search by owner or NIN..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={searchInput}
          />

          {/* <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={filterSelect}
          >
            <option value="all">All Severity</option>
            <option value="low">Low</option>
            <option value="critical">Critical</option>
          </select> */}

        </div>

        {/* ── stats ───────────────────────────────────── */}
        <div style={statsGrid}>

          <StatCard
            label="Total Flagged"
            value={stats.total}
          />


          <StatCard
            label="Resolved"
            value={stats.resolved}
          />

        </div>

        {/* ── table ───────────────────────────────────── */}
        <div style={tableWrapper}>

          <div style={tableHeader}>
            <span style={tableTitle}>Flagged Records</span>
          </div>

          {loading ? (
            <div style={emptyState}>Loading flagged IDs...</div>
          ) : filteredData.length === 0 ? (
            <div style={emptyState}> No flagged records found</div>
          ) : (
            <table style={table}>
              <thead>
                <tr>
                  <th style={th}>Owner</th>
                  <th style={th}>NIN</th>
                  <th style={th}>Reason</th>
                  
                  <th style={th}>Station</th>
                  <th style={th}>Status</th>
                  <th style={th}>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredData.map((item) => {
                  // const severity =
                  //   SEVERITY_STYLES[item.severity] || SEVERITY_STYLES.low;

                  return (
                    <tr key={item.id}>
                      <td style={td}>{item.owner || "Unknown"}</td>

                      <td style={tdMuted}>{item.nin || "N/A"}</td>

                      <td style={td}>{item.reason || "Auto flagged" }</td>

                      {/* <td style={td}>
                        <span
                          style={{
                            background: severity.background,
                            color: severity.color,
                            padding: "4px 10px",
                            borderRadius: "999px",
                            fontSize: "11px",
                            fontWeight: "700",
                          }}
                        >
                          {severity.label}
                        </span>
                      </td> */}

                      <td style={tdMuted}>
                        {item.station || item.location_found || "-"}
                      </td>

                      <td style={td}>
                        {item.status || "Flagged"}
                      </td>

                      {/* <td style={td}>
                        <button
                          style={actionBtn}
                          onClick={() =>
                            navigate(`/admin/flagged/${item.id}`)
                          }
                        >
                          View
                        </button>
                      </td> */}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

        </div>
      </div>
  );

  return embedded ? content : <PageLayout>{content}</PageLayout>;
}

// ── stat card ────────────────────────────────────────────────────
function StatCard({ label, value }) {
  return (
    <div style={statCard}>
      <div style={statLabel}>{label}</div>
      <div style={statValue}>{value}</div>
    </div>
  );
}

// ── styles ───────────────────────────────────────────────────────

const pageWrapper = {
  maxWidth: "1300px",
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

const actionBtn = {
  padding: "8px 14px",
  borderRadius: "10px",
  border: "none",
  background: theme.primary,
  color: "#fff",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "12px",
};

const emptyState = {
  padding: "50px",
  textAlign: "center",
  color: "#6b7280",
  fontSize: "15px",
};

export default FlaggedIDsPage;