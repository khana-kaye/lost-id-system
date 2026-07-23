import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../../components/PageLayout";
import { theme } from "../../theme";
import BASE_URL from "../../api";

function CriminalRecordsPage() {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchCriminalRecords = async () => {
      try {
        const res = await fetch(`${BASE_URL}/criminal-search/`);
        const data = await res.json();
        setRecords(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Criminal records fetch error:", err);
        setRecords([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCriminalRecords();
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return records.filter(
      (r) =>
        r.name?.toLowerCase().includes(q) ||
        r.id_number?.toLowerCase().includes(q) ||
        r.crime?.toLowerCase().includes(q)
    );
  }, [search, records]);

  const STATUS_COLOR = {
    Wanted: { background: "#fee2e2", color: "#dc2626" },
    Arrested: { background: "#fef9c3", color: "#ca8a04" },
    Released: { background: "#dcfce7", color: "#16a34a" },
  };

  return (
    <PageLayout>
      <div style={pageWrapper}>
        {/* Header */}
        <div style={header}>
          <div>
            <h1 style={titleStyle}>🔍 Criminal ID Records</h1>
            <p style={subtitle}>
              Documents in the system linked to known criminals.
            </p>
          </div>
          
        </div>

        {/* Search */}
        <div style={{ marginBottom: "22px" }}>
          <input
            type="text"
            placeholder="Search by name, ID number, or crime..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={searchInput}
          />
        </div>

        {/* Stats */}
        <div style={statsRow}>
          <StatCard label="Total Matches" value={records.length} />
          <StatCard
            label="Wanted"
            value={records.filter((r) => r.criminal_status === "Wanted").length}
            color="#dc2626"
          />
          <StatCard
            label="Arrested"
            value={records.filter((r) => r.criminal_status === "Arrested").length}
            color="#ca8a04"
          />
        </div>

        {/* Table */}
        <div style={tableWrapper}>
          <div style={tableHeader}>
            <span style={tableTitle}>Matched Documents</span>
            <span style={{ fontSize: "13px", color: "#6b7280" }}>
              {filtered.length} record{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>

          {loading ? (
            <div style={emptyState}>Loading...</div>
          ) : filtered.length === 0 ? (
            <div style={emptyState}>No criminal records found in the system</div>
          ) : (
            <table style={table}>
              <thead>
                <tr>
                  {["Name", "ID Number", "Type", "Crime", "Criminal Status", "Doc Status", "Location"].map(
                    (h) => <th key={h} style={th}>{h}</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => {
                  const badge =
                    STATUS_COLOR[item.criminal_status] ||
                    { background: "#f3f4f6", color: "#374151" };
                  return (
                    <tr key={item.id}>
                      <td style={td}>{item.name}</td>
                      <td style={tdMuted}>{item.id_number}</td>
                      <td style={td}>{item.id_type}</td>
                      <td style={td}>{item.crime}</td>
                      <td style={td}>
                        <span style={{
                          background: badge.background,
                          color: badge.color,
                          padding: "4px 10px",
                          borderRadius: "999px",
                          fontSize: "11px",
                          fontWeight: "700",
                        }}>
                          {item.criminal_status}
                        </span>
                      </td>
                      <td style={td}>{item.status}</td>
                      <td style={tdMuted}>{item.location_found || "-"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </PageLayout>
  );
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
const header = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "12px" };
const titleStyle = { margin: 0, fontSize: "32px", color: theme.dark };
const subtitle = { marginTop: "8px", color: "#6b7280" };
const backBtn = { padding: "12px 18px", borderRadius: "12px", border: "none", background: theme.primary, color: "#fff", cursor: "pointer", fontWeight: "700" };
const searchInput = { width: "100%", padding: "14px", borderRadius: "12px", border: "1px solid #d1d5db", fontSize: "14px", boxSizing: "border-box" };
const statsRow = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "14px", marginBottom: "24px" };
const statCard = { background: theme.card, borderRadius: "18px", padding: "20px", boxShadow: "0 4px 18px rgba(0,0,0,0.05)" };
const statLabel = { fontSize: "13px", color: "#6b7280" };
const statValue = { fontSize: "28px", fontWeight: "700", marginTop: "8px" };
const tableWrapper = { background: theme.card, borderRadius: "20px", overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" };
const tableHeader = { padding: "18px 20px", borderBottom: "1px solid rgba(0,0,0,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" };
const tableTitle = { fontSize: "15px", fontWeight: "700", color: theme.dark };
const table = { width: "100%", borderCollapse: "collapse" };
const th = { textAlign: "left", padding: "14px 18px", fontSize: "12px", color: "#6b7280", borderBottom: "1px solid rgba(0,0,0,0.06)" };
const td = { padding: "16px 18px", borderBottom: "1px solid rgba(0,0,0,0.05)", color: theme.dark, fontSize: "13px" };
const tdMuted = { padding: "16px 18px", borderBottom: "1px solid rgba(0,0,0,0.05)", color: "#6b7280", fontSize: "13px" };
const emptyState = { padding: "50px", textAlign: "center", color: "#6b7280", fontSize: "15px" };

export default CriminalRecordsPage;