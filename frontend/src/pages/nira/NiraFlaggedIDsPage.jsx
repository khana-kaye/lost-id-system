import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../../components/PageLayout";
import { theme } from "../../theme";
import BASE_URL from "../../api";

function NiraFlaggedIDsPage({ embedded }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [flaggedData, setFlaggedData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFlagged = async () => {
    try {
      const res = await fetch(`${BASE_URL}/nira/flagged/`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setFlaggedData(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("NIRA flagged fetch error:", err);
      setFlaggedData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlagged();
    const interval = setInterval(fetchFlagged, 15000);
    return () => clearInterval(interval);
  }, []);

  const filteredData = useMemo(() => {
    const q = search.toLowerCase();
    return flaggedData.filter(
      (item) =>
        item.name?.toLowerCase().includes(q) ||
        item.nin?.toLowerCase().includes(q)
    );
  }, [search, flaggedData]);

  const stats = useMemo(() => ({
    total: flaggedData.length,
    underReview: flaggedData.filter((i) => i.status === "Under Review").length,
    confirmedFraud: flaggedData.filter((i) => i.status === "Confirmed Fraud").length,
  }), [flaggedData]);

  const SEVERITY_STYLE = {
    critical: { background: "#fee2e2", color: "#dc2626" },
    low:      { background: "#fef9c3", color: "#ca8a04" },
  };

  const content = (
    <div style={pageWrapper}>
      {/* Header */}
      <div style={header}>
        <div>
          <h1 style={title}>⚑ NIRA Flagged IDs</h1>
          <p style={subtitle}>
            National IDs reported more than once in the system.
          </p>
        </div>
        
      </div>

      {/* Search */}
      <div style={filterBar}>
        <input
          type="text"
          placeholder="Search by owner name or NIN..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={searchInput}
        />
      </div>

      {/* Stats */}
      <div style={statsGrid}>
        <StatCard label="Total Flagged" value={stats.total} />
        <StatCard label="Under Review" value={stats.underReview} />
        <StatCard label="Confirmed Fraud" value={stats.confirmedFraud} color="#dc2626" />
      </div>

      {/* Table */}
      <div style={tableWrapper}>
        <div style={tableHeader}>
          <span style={tableTitle}>Flagged National ID Records</span>
        </div>

        {loading ? (
          <div style={emptyState}>Loading flagged records...</div>
        ) : filteredData.length === 0 ? (
          <div style={emptyState}>✅ No flagged National IDs found.</div>
        ) : (
          <table style={table}>
            <thead>
              <tr>
                <th style={th}>Owner</th>
                <th style={th}>NIN</th>
                <th style={th}>Reason</th>
                <th style={th}>Severity</th>
                <th style={th}>Times Reported</th>
                <th style={th}>Status</th>
                {/* <th style={th}>Action</th> */}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => {
                const badge = SEVERITY_STYLE[item.severity] || SEVERITY_STYLE.low;
                return (
                  <tr key={item.id}>
                    <td style={td}>{item.name || "Unknown"}</td>
                    <td style={tdMuted}>{item.nin || "N/A"}</td>
                    <td style={td}>{item.reason || "Reported multiple times"}</td>
                    <td style={td}>
                      <span style={{
                        ...badge,
                        padding: "4px 10px",
                        borderRadius: "999px",
                        fontSize: "11px",
                        fontWeight: "700",
                      }}>
                        {item.severity || "low"}
                      </span>
                    </td>
                    <td style={td}>{item.report_count}</td>
                    <td style={td}>{item.status}</td>
                    {/* <td style={td}>
                      <button
                        style={actionBtn}
                        onClick={() => navigate(`/nira/flagged/${item.id}`)}
                      >
                        Review
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

function StatCard({ label, value, color }) {
  return (
    <div style={statCard}>
      <div style={statLabel}>{label}</div>
      <div style={{ ...statValue, color: color || theme.dark }}>{value}</div>
    </div>
  );
}

// ── styles ──────────────────────────────────────────────────────
const pageWrapper = { maxWidth: "1300px", margin: "0 auto", padding: "24px" };
const header = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", gap: "12px", flexWrap: "wrap" };
const title = { margin: 0, fontSize: "24px", fontWeight: "700", color: theme.dark };
const subtitle = { marginTop: "6px", color: "#6b7280", fontSize: "13px" };
const backBtn = { padding: "10px 16px", borderRadius: "10px", border: "none", background: theme.primary, color: "#fff", cursor: "pointer", fontWeight: "700", fontSize: "13px" };
const filterBar = { display: "flex", gap: "12px", marginBottom: "22px" };
const searchInput = { flex: 1, minWidth: "240px", padding: "12px 14px", borderRadius: "10px", border: "1px solid #d1d5db", fontSize: "13px" };
const statsGrid = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "14px", marginBottom: "24px" };
const statCard = { background: theme.card, borderRadius: "14px", padding: "18px", boxShadow: "0 4px 18px rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.04)" };
const statLabel = { fontSize: "12px", color: "#6b7280", fontWeight: "600" };
const statValue = { fontSize: "24px", fontWeight: "700", marginTop: "6px" };
const tableWrapper = { background: theme.card, borderRadius: "14px", overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.04)" };
const tableHeader = { padding: "16px 20px", borderBottom: "1px solid rgba(0,0,0,0.06)" };
const tableTitle = { fontSize: "14px", fontWeight: "700", color: theme.dark };
const table = { width: "100%", borderCollapse: "collapse" };
const th = { textAlign: "left", padding: "14px 18px", fontSize: "12px", color: "#6b7280", borderBottom: "1px solid rgba(0,0,0,0.06)", background: "#f9fafb" };
const td = { padding: "14px 18px", borderBottom: "1px solid rgba(0,0,0,0.05)", color: theme.dark, fontSize: "13px" };
const tdMuted = { ...td, color: "#6b7280" };
// const actionBtn = { padding: "6px 12px", borderRadius: "8px", border: "none", background: theme.primary, color: "#fff", cursor: "pointer", fontWeight: "600", fontSize: "12px" };
const emptyState = { padding: "40px", textAlign: "center", color: "#6b7280", fontSize: "13px" };

export default NiraFlaggedIDsPage;