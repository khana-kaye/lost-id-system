import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../components/PageLayout";
import { theme } from "../theme";

// ── mock audit logs ─────────────────────────────────────────────
const AUDIT_LOGS = [
  {
    id: 1,
    user: "Officer Sarah",
    role: "Police Officer",
    action: "Added Found ID",
    target: "Report #220",
    timestamp: "10 May 2026 • 10:42 AM",
    status: "success",
  },

  {
    id: 2,
    user: "Officer Joel",
    role: "Supervisor",
    action: "Deleted Report",
    target: "Report #118",
    timestamp: "10 May 2026 • 09:18 AM",
    status: "warning",
  },

  {
    id: 3,
    user: "System",
    role: "Automation",
    action: "Auto Flagged Duplicate NIN",
    target: "CM1234567890AB",
    timestamp: "9 May 2026 • 08:55 PM",
    status: "critical",
  },

  {
    id: 4,
    user: "Officer Brian",
    role: "Police Officer",
    action: "Forwarded Record to NIRA",
    target: "Report #332",
    timestamp: "9 May 2026 • 04:13 PM",
    status: "success",
  },

  {
    id: 5,
    user: "Officer Diana",
    role: "Admin",
    action: "Failed Login Attempt",
    target: "Admin Portal",
    timestamp: "9 May 2026 • 11:05 AM",
    status: "warning",
  },
];

// ── status styles ───────────────────────────────────────────────
const STATUS_STYLES = {
  success: {
    background: "#e8f5e9",
    color: "#2e7d32",
    label: "Success",
  },

  warning: {
    background: "#fff8e1",
    color: "#f57f17",
    label: "Warning",
  },

  critical: {
    background: "#ffebee",
    color: "#c62828",
    label: "Critical",
  },
};

function AuditLogPage() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  // ── filtering ────────────────────────────────────────────────
  const filteredLogs = useMemo(() => {
    return AUDIT_LOGS.filter((log) => {

      const matchesSearch =
        log.user.toLowerCase().includes(search.toLowerCase()) ||
        log.action.toLowerCase().includes(search.toLowerCase()) ||
        log.target.toLowerCase().includes(search.toLowerCase());

      const matchesFilter =
        filter === "all"
          ? true
          : log.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [search, filter]);

  // ── stats ────────────────────────────────────────────────────
  const stats = {
    total: AUDIT_LOGS.length,

    success: AUDIT_LOGS.filter(
      (l) => l.status === "success"
    ).length,

    warning: AUDIT_LOGS.filter(
      (l) => l.status === "warning"
    ).length,

    critical: AUDIT_LOGS.filter(
      (l) => l.status === "critical"
    ).length,
  };

  return (
    <PageLayout>
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

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={filterSelect}
          >
            <option value="all">All Activity</option>
            <option value="success">Success</option>
            <option value="warning">Warning</option>
            <option value="critical">Critical</option>
          </select>

        </div>

        {/* ── stats ────────────────────────────────── */}
        <div style={statsGrid}>

          <StatCard
            label="Total Activities"
            value={stats.total}
          />

          <StatCard
            label="Successful"
            value={stats.success}
          />

          <StatCard
            label="Warnings"
            value={stats.warning}
          />

          <StatCard
            label="Critical"
            value={stats.critical}
          />

        </div>

        {/* ── audit table ──────────────────────────── */}
        <div style={tableWrapper}>

          <div style={tableHeader}>
            <span style={tableTitle}>
              Activity History
            </span>
          </div>

          {filteredLogs.length === 0 ? (
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
                  <th style={th}>Status</th>
                </tr>
              </thead>

              <tbody>

                {filteredLogs.map((log) => {
                  const status =
                    STATUS_STYLES[log.status];

                  return (
                    <tr key={log.id}>

                      <td style={td}>
                        {log.user}
                      </td>

                      <td style={tdMuted}>
                        {log.role}
                      </td>

                      <td style={td}>
                        {log.action}
                      </td>

                      <td style={tdMuted}>
                        {log.target}
                      </td>

                      <td style={tdMuted}>
                        {log.timestamp}
                      </td>

                      <td style={td}>
                        <span
                          style={{
                            background: status.background,
                            color: status.color,
                            padding: "4px 10px",
                            borderRadius: "999px",
                            fontSize: "11px",
                            fontWeight: "700",
                          }}
                        >
                          {status.label}
                        </span>
                      </td>

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

const filterSelect = {
  padding: "14px",
  borderRadius: "12px",
  border: "1px solid #d1d5db",
  fontSize: "14px",
  background: "#fff",
};

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

export default AuditLogPage;