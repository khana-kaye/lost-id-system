import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../../components/PageLayout";
import { theme } from "../../theme";
import BASE_URL from "../../api";

function UdlsFlaggedPermitsPage({ embedded }) {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [allRecords, setAllRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  // ── FETCH ALL IDS FOR NIRA DUPLICATE AUDITING ───────────────────
  const fetchRecords = async () => {
    try {
      const res = await fetch(`${BASE_URL}/ids/`);
      if (!res.ok) throw new Error("Failed to fetch ID system records");

      const data = await res.json();
      setAllRecords(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("UDLS background compilation error:", err);
      setAllRecords([]);
    } finally {
      setLoading(false);
    }
  };

  // ── LOAD + LIVE UPDATE ────────────────────────────────────────
  useEffect(() => {
    fetchRecords();

    const interval = setInterval(() => {
      fetchRecords();
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  // ── CLIENT-SIDE DUPLICATE PIPELINE DETECTION ───────────────────
  const flaggedData = useMemo(() => {
    // Count occurrences of each unique ID Number
    const countMap = {};
    allRecords.forEach((item) => {
      if (item.id_number) {
        const num = item.id_number.trim().toUpperCase();
        countMap[num] = (countMap[num] || 0) + 1;
      }
    });

    // Filter down to records that exist more than once
    return allRecords.filter((item) => {
      if (!item.id_number) return false;
      const num = item.id_number.trim().toUpperCase();
      return countMap[num] > 1;
    });
  }, [allRecords]);

  // ── SEARCH FILTERING ───────────────────────────────────────────
  const filteredData = useMemo(() => {
    return flaggedData.filter((item) => {
      const ownerName = item.name?.toLowerCase() || "";
      const idNumber = item.id_number?.toLowerCase() || "";
      const searchTerms = search.toLowerCase();

      return ownerName.includes(searchTerms) || idNumber.includes(searchTerms);
    });
  }, [search, flaggedData]);

  // ── SYSTEM METRICS ─────────────────────────────────────────────
  const stats = useMemo(() => {
    // Count how many unique ID numbers are compromised
    const uniqueNins = new Set(flaggedData.map((i) => i.id_number?.toUpperCase()));
    return {
      totalInstances: flaggedData.length,
      uniqueConflicts: uniqueNins.size,
    };
  }, [flaggedData]);

  const content = (
    <div style={pageWrapper}>
      {/* ── Header ── */}
      <div style={header}>
        <div>
          <h1 style={title}>⚑ UDLS Conflict Flagged Permits</h1>
          <p style={subtitle}>
            System detected duplicates. Drivers Permits listed below have been registered more than once in the database.
          </p>
        </div>

      </div>

      {/* ── Search Bar ── */}
      <div style={filterBar}>
        <input
          type="text"
          placeholder="Search duplicates by owner name or NIN..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={searchInput}
        />
      </div>

      {/* ── Analytical Metrics ── */}
      <div style={statsGrid}>
        <StatCard label="Total Duplicate Entries" value={stats.totalInstances} />
        <StatCard label="Unique Conflicting IDs" value={stats.uniqueConflicts} />
      </div>

      {/* ── Data Grid Table ── */}
      <div style={tableWrapper}>
        <div style={tableHeader}>
          <span style={tableTitle}>Conflict Registry Log</span>
        </div>

        {loading ? (
          <div style={emptyState}>Auditing database records...</div>
        ) : filteredData.length === 0 ? (
          <div style={emptyState}>✅ Clean registry database. No duplicate entry conflicts detected.</div>
        ) : (
          <table style={table}>
            <thead>
              <tr>
                <th style={th}>Registered Owner</th>
                <th style={th}>NIN / ID Number</th>
                <th style={th}>Flag Conflict Reason</th>
                <th style={th}>Document Type</th>
                <th style={th}>Current Status</th>
                <th style={th}>Record Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id}>
                  <td style={td}>{item.name || "Unknown"}</td>
                  <td style={tdMuted}>{item.id_number || "N/A"}</td>
                  <td style={tdContainer}>
                    <span style={conflictBadge}>🚨 Multiple Entries Detected</span>
                  </td>
                  <td style={tdMuted}>{item.id_type || "National ID"}</td>
                  <td style={td}>
                    <span
                      style={{
                        padding: "4px 8px",
                        background: item.status === "Found" ? "#eaf3de" : "#fff3cd",
                        color: item.status === "Found" ? "#3b6d11" : "#854d0e",
                        borderRadius: "6px",
                        fontWeight: "600",
                        fontSize: "11px",
                      }}
                    >
                      {item.status || "Review Required"}
                    </span>
                  </td>
                  <td style={td}>
                    <button
                      style={actionBtn}
                      onClick={() => navigate(`/nira/records`)}
                    >
                      Manage
                    </button>
                  </td>
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

// ── Secondary Stat Card Component ──
function StatCard({ label, value }) {
  return (
    <div style={statCard}>
      <div style={statLabel}>{label}</div>
      <div style={statValue}>{value}</div>
    </div>
  );
}

// ── Styles ──
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
  fontSize: "24px",
  fontWeight: "700",
  color: theme.dark,
};

const subtitle = {
  marginTop: "6px",
  color: "#6b7280",
  fontSize: "13px",
};

const backBtn = {
  padding: "10px 16px",
  borderRadius: "10px",
  border: "none",
  background: theme.primary,
  color: "#fff",
  cursor: "pointer",
  fontWeight: "700",
  fontSize: "13px",
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
  padding: "12px 14px",
  borderRadius: "10px",
  border: "1px solid #d1d5db",
  fontSize: "13px",
  outline: "none",
};

const statsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "14px",
  marginBottom: "24px",
};

const statCard = {
  background: theme.card,
  borderRadius: "14px",
  padding: "18px",
  boxShadow: "0 4px 18px rgba(0,0,0,0.03)",
  border: "1px solid rgba(0,0,0,0.04)",
};

const statLabel = {
  fontSize: "12px",
  color: "#6b7280",
  fontWeight: "600",
};

const statValue = {
  fontSize: "24px",
  fontWeight: "700",
  marginTop: "6px",
  color: theme.dark,
};

const tableWrapper = {
  background: theme.card,
  borderRadius: "14px",
  overflow: "hidden",
  boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
  border: "1px solid rgba(0,0,0,0.04)",
};

const tableHeader = {
  padding: "16px 20px",
  borderBottom: "1px solid rgba(0,0,0,0.06)",
};

const tableTitle = {
  fontSize: "14px",
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
  background: "#f9fafb",
};

const td = {
  padding: "14px 18px",
  borderBottom: "1px solid rgba(0,0,0,0.05)",
  color: theme.dark,
  fontSize: "13px",
};

const tdMuted = {
  ...td,
  color: "#6b7280",
};

const tdContainer = {
  ...td,
};

const conflictBadge = {
  background: "#fff5f5",
  color: "#c53030",
  padding: "4px 10px",
  borderRadius: "999px",
  fontSize: "11px",
  fontWeight: "700",
};

const actionBtn = {
  padding: "6px 12px",
  borderRadius: "8px",
  border: "none",
  background: "#f3f4f6",
  color: "#374151",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "12px",
  transition: "all 0.2s",
};

const emptyState = {
  padding: "40px",
  textAlign: "center",
  color: "#6b7280",
  fontSize: "13px",
};

export default UdlsFlaggedPermitsPage;