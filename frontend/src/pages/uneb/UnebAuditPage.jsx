import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../../components/PageLayout";
import { theme } from "../../theme";

// ── hardcoded audit log data ───────────────────────────────────────────────
const AUDIT_DATA = [
  {
    id: "AL001",
    officer: "Namukasa Grace",
    action: "verified",
    studentName: "NAKATO SARAH",
    indexNo: "P0012/2015",
    level: "PLE",
    timestamp: "2026-05-12 08:14:22",
    district: "Kampala",
  },
  {
    id: "AL002",
    officer: "Opolot Dennis",
    action: "flagged",
    studentName: "MUKASA PETER",
    indexNo: "P0034/2016",
    level: "PLE",
    timestamp: "2026-05-12 08:42:05",
    district: "Wakiso",
  },
  {
    id: "AL003",
    officer: "Namukasa Grace",
    action: "verified",
    studentName: "SSEMWOGERERE JAMES",
    indexNo: "U0234/2019",
    level: "UCE",
    timestamp: "2026-05-12 09:03:17",
    district: "Kampala",
  },
  {
    id: "AL004",
    officer: "Atim Harriet",
    action: "verified",
    studentName: "NAMUTEBI CLAIRE",
    indexNo: "U0567/2020",
    level: "UCE",
    timestamp: "2026-05-12 09:28:44",
    district: "Wakiso",
  },
  {
    id: "AL005",
    officer: "Opolot Dennis",
    action: "flagged",
    studentName: "KIGGUNDU ALLAN",
    indexNo: "U0901/2021",
    level: "UCE",
    timestamp: "2026-05-12 09:55:30",
    district: "Wakiso",
  },
  {
    id: "AL006",
    officer: "Atim Harriet",
    action: "verified",
    studentName: "SSEMWOGERERE JAMES",
    indexNo: "A0112/2022",
    level: "UACE",
    timestamp: "2026-05-12 10:11:08",
    district: "Kampala",
  },
  {
    id: "AL007",
    officer: "Namukasa Grace",
    action: "verified",
    studentName: "KATO RONALD",
    indexNo: "A0788/2023",
    level: "UACE",
    timestamp: "2026-05-12 10:34:59",
    district: "Masaka",
  },
  {
    id: "AL008",
    officer: "Opolot Dennis",
    action: "flagged",
    studentName: "NAMUTEBI CLAIRE",
    indexNo: "A0445/2022",
    level: "UACE",
    timestamp: "2026-05-12 11:02:14",
    district: "Wakiso",
  },
  {
    id: "AL009",
    officer: "Atim Harriet",
    action: "verified",
    studentName: "AUMA BRENDA",
    indexNo: "P0078/2018",
    level: "PLE",
    timestamp: "2026-05-12 11:29:37",
    district: "Kampala",
  },
  {
    id: "AL010",
    officer: "Namukasa Grace",
    action: "flagged",
    studentName: "MUKASA PETER",
    indexNo: "P0034/2016",
    level: "PLE",
    timestamp: "2026-05-12 11:48:02",
    district: "Wakiso",
  },
];

const ACTION_STYLE = {
  verified: { label: "Verified", bg: "#eaf3de", color: "#3b6d11" },
  flagged:  { label: "Flagged",  bg: "#faeeda", color: "#854f0b" },
};

const LEVEL_STYLE = {
  PLE:  { bg: "#e6f1fb", color: "#185fa5" },
  UCE:  { bg: "#f1efe8", color: "#5f5e5a" },
  UACE: { bg: "#eeedfe", color: "#534ab7" },
};

const ALL_OFFICERS = ["All Officers", ...new Set(AUDIT_DATA.map((a) => a.officer))];
const ALL_LEVELS   = ["All Levels", "PLE", "UCE", "UACE"];
const ALL_ACTIONS  = ["All Actions", "verified", "flagged"];

// ── summary stats from data ────────────────────────────────────────────────
const STATS = [
  {
    label: "Total Actions",
    value: AUDIT_DATA.length,
    delta: "this period",
    positive: true,
  },
  {
    label: "Verified",
    value: AUDIT_DATA.filter((a) => a.action === "verified").length,
    delta: "records confirmed",
    positive: true,
  },
  {
    label: "Flagged",
    value: AUDIT_DATA.filter((a) => a.action === "flagged").length,
    delta: "needs review",
    positive: false,
  },
  {
    label: "Officers Active",
    value: new Set(AUDIT_DATA.map((a) => a.officer)).size,
    delta: "this session",
    positive: true,
  },
];

// ── main page ──────────────────────────────────────────────────────────────
function UnebAuditPage() {
  const navigate = useNavigate();
  const [search,   setSearch]   = useState("");
  const [officer,  setOfficer]  = useState("All Officers");
  const [level,    setLevel]    = useState("All Levels");
  const [action,   setAction]   = useState("All Actions");
  const [page,     setPage]     = useState(1);

  const PER_PAGE = 6;

  // filter
  const filtered = AUDIT_DATA.filter((row) => {
    const q = search.trim().toUpperCase();
    const matchSearch =
      !q ||
      row.studentName.includes(q) ||
      row.indexNo.toUpperCase().includes(q) ||
      row.officer.toUpperCase().includes(q);
    const matchOfficer = officer === "All Officers" || row.officer === officer;
    const matchLevel   = level   === "All Levels"   || row.level   === level;
    const matchAction  = action  === "All Actions"  || row.action  === action;
    return matchSearch && matchOfficer && matchLevel && matchAction;
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const resetPage = () => setPage(1);

  return (
    <PageLayout>
      <div style={wrapper}>

        {/* ── sidebar ── */}
        <aside style={sidebar}>
          <div style={sidebarTop}>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <div style={orgIcon}>🎓</div>
              <div>
                <div style={{ fontSize: "13px", fontWeight: "700", color: theme.dark }}>
                  UNEB Portal
                </div>
                <div style={{ fontSize: "11px", color: "#6b7280" }}>
                  Examination Verification
                </div>
              </div>
            </div>
          </div>

          <nav style={navArea}>
            {[
              { label: "Dashboard",      emoji: "⊞", route: "/uneb/dashboard" },
              { label: "Verify Results", emoji: "📄", route: "/uneb/verify"   },
              { label: "Audit Log",      emoji: "◷", route: "/uneb/audit",  active: true },
              { label: "Settings",       emoji: "⚙", route: "/uneb/settings" },
            ].map((item) => (
              <button
                key={item.route}
                onClick={() => navigate(item.route)}
                style={{
                  display: "flex", alignItems: "center", gap: "10px",
                  padding: "9px 10px", borderRadius: "10px",
                  border: "none", width: "100%", textAlign: "left",
                  cursor: "pointer", fontSize: "13px", marginBottom: "2px",
                  fontWeight: item.active ? "600" : "400",
                  background: item.active ? theme.primary : "transparent",
                  color:      item.active ? "#fff"         : "#6b7280",
                }}
              >
                <span style={{ fontSize: "15px", width: "18px", textAlign: "center" }}>
                  {item.emoji}
                </span>
                {item.label}
              </button>
            ))}
          </nav>

          <div style={sidebarFooter}>
            <button style={logoutBtn} onClick={() => navigate("/logout")}>
              ⎋ &nbsp; Logout
            </button>
          </div>
        </aside>

        {/* ── main ── */}
        <main style={mainArea}>

          {/* topbar */}
          <div style={topbar}>
            <div>
              <div style={pageTitle}>Audit Log</div>
              <div style={pageSub}>
                Full history of all verification actions taken by UNEB staff.
              </div>
            </div>
            <button
              style={exportBtn}
              onClick={() => alert("Export coming soon.")}
            >
              ⬇ &nbsp; Export CSV
            </button>
          </div>

          <div style={contentBody}>

            {/* stat cards */}
            <div style={statsGrid}>
              {STATS.map((s) => (
                <div key={s.label} style={statCard}>
                  <div style={statLabel}>{s.label}</div>
                  <div style={statValue}>{s.value}</div>
                  <div style={{
                    fontSize: "11px", marginTop: "4px",
                    color: s.positive ? "#3b6d11" : "#a32d2d",
                  }}>
                    {s.delta}
                  </div>
                </div>
              ))}
            </div>

            {/* filters row */}
            <div style={filtersRow}>
              <input
                type="text"
                placeholder="Search name, index no. or officer…"
                value={search}
                onChange={(e) => { setSearch(e.target.value); resetPage(); }}
                style={filterInput}
              />
              {[
                { value: officer,  setValue: setOfficer, options: ALL_OFFICERS },
                { value: level,    setValue: setLevel,   options: ALL_LEVELS   },
                { value: action,   setValue: setAction,  options: ALL_ACTIONS  },
              ].map((f, i) => (
                <select
                  key={i}
                  value={f.value}
                  onChange={(e) => { f.setValue(e.target.value); resetPage(); }}
                  style={filterSelect}
                >
                  {f.options.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              ))}
            </div>

            {/* table */}
            <div style={tableCard}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                <thead>
                  <tr style={{ background: "#f9fafb" }}>
                    {["ID", "Timestamp", "Officer", "Student", "Index No.", "Level", "Action"].map((h) => (
                      <th key={h} style={th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginated.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{
                        textAlign: "center", padding: "40px",
                        color: "#9ca3af", fontSize: "13px",
                      }}>
                        No records match your filters.
                      </td>
                    </tr>
                  ) : (
                    paginated.map((row, i) => {
                      const a  = ACTION_STYLE[row.action];
                      const lv = LEVEL_STYLE[row.level];
                      const isLast = i === paginated.length - 1;
                      return (
                        <tr
                          key={row.id}
                          style={{
                            borderBottom: isLast ? "none" : "1px solid rgba(0,0,0,0.06)",
                          }}
                        >
                          <td style={td}>
                            <span style={{ fontSize: "11px", color: "#9ca3af" }}>{row.id}</span>
                          </td>
                          <td style={td}>
                            <div style={{ fontSize: "12px", color: theme.dark }}>
                              {row.timestamp.split(" ")[0]}
                            </div>
                            <div style={{ fontSize: "11px", color: "#9ca3af" }}>
                              {row.timestamp.split(" ")[1]}
                            </div>
                          </td>
                          <td style={td}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              <div style={{
                                width: "26px", height: "26px",
                                borderRadius: "50%",
                                background: theme.primary + "22",
                                color: theme.primary,
                                display: "flex", alignItems: "center",
                                justifyContent: "center",
                                fontSize: "10px", fontWeight: "700", flexShrink: 0,
                              }}>
                                {row.officer.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                              </div>
                              <span style={{ fontSize: "12px", color: theme.dark }}>
                                {row.officer}
                              </span>
                            </div>
                          </td>
                          <td style={td}>
                            <span style={{ fontWeight: "600", color: theme.dark }}>
                              {row.studentName}
                            </span>
                          </td>
                          <td style={td}>
                            <span style={{ fontSize: "12px", color: "#6b7280", fontFamily: "monospace" }}>
                              {row.indexNo}
                            </span>
                          </td>
                          <td style={td}>
                            <span style={{
                              fontSize: "10px", fontWeight: "700",
                              padding: "2px 8px", borderRadius: "999px",
                              background: lv.bg, color: lv.color,
                            }}>
                              {row.level}
                            </span>
                          </td>
                          <td style={td}>
                            <span style={{
                              fontSize: "10px", fontWeight: "700",
                              padding: "2px 8px", borderRadius: "999px",
                              background: a.bg, color: a.color,
                            }}>
                              {a.label}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* pagination */}
            {totalPages > 1 && (
              <div style={pagination}>
                <span style={{ fontSize: "12px", color: "#6b7280" }}>
                  Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}
                </span>
                <div style={{ display: "flex", gap: "6px" }}>
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    style={{ ...pageBtn, opacity: page === 1 ? 0.4 : 1 }}
                  >
                    ← Prev
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                    <button
                      key={n}
                      onClick={() => setPage(n)}
                      style={{
                        ...pageBtn,
                        background: n === page ? theme.primary : "transparent",
                        color:      n === page ? "#fff"         : theme.dark,
                        border:     n === page ? "none"         : "1px solid rgba(0,0,0,0.1)",
                      }}
                    >
                      {n}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    style={{ ...pageBtn, opacity: page === totalPages ? 0.4 : 1 }}
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}

          </div>
        </main>
      </div>
    </PageLayout>
  );
}

// ── styles ─────────────────────────────────────────────────────────────────
const wrapper     = { display: "flex", height: "calc(100vh - 80px)", overflow: "hidden", background: "#f4f6fa" };
const sidebar     = { width: "220px", minWidth: "220px", background: theme.card, borderRight: "1px solid rgba(0,0,0,0.07)", display: "flex", flexDirection: "column", overflow: "hidden" };
const sidebarTop  = { padding: "18px", borderBottom: "1px solid rgba(0,0,0,0.07)" };
const orgIcon     = { width: "36px", height: "36px", background: theme.primary, borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", flexShrink: 0 };
const navArea     = { flex: 1, padding: "12px 10px", overflowY: "auto" };
const sidebarFooter = { padding: "14px", borderTop: "1px solid rgba(0,0,0,0.07)" };
const logoutBtn   = { width: "100%", padding: "10px", background: "#fcebeb", color: "#a32d2d", border: "1px solid rgba(163,45,45,0.2)", borderRadius: "10px", cursor: "pointer", fontWeight: "700", fontSize: "13px" };
const mainArea    = { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" };
const topbar      = { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 24px", borderBottom: "1px solid rgba(0,0,0,0.07)", background: theme.card };
const pageTitle   = { fontSize: "16px", fontWeight: "700", color: theme.dark };
const pageSub     = { fontSize: "12px", color: "#6b7280", marginTop: "2px" };
const contentBody = { flex: 1, overflowY: "auto", padding: "20px 24px" };

const exportBtn = {
  padding: "9px 18px", borderRadius: "10px",
  border: "1px solid rgba(0,0,0,0.1)",
  background: "#fff", color: theme.dark,
  fontSize: "13px", fontWeight: "600",
  cursor: "pointer",
};

const statsGrid = {
  display: "grid", gridTemplateColumns: "repeat(4,1fr)",
  gap: "12px", marginBottom: "18px",
};

const statCard  = { background: "#fff", border: "1px solid rgba(0,0,0,0.07)", borderRadius: "14px", padding: "14px 16px" };
const statLabel = { fontSize: "11px", color: "#6b7280", marginBottom: "6px" };
const statValue = { fontSize: "22px", fontWeight: "700", color: theme.dark };

const filtersRow = {
  display: "flex", gap: "10px", marginBottom: "14px", flexWrap: "wrap",
};

const filterInput = {
  flex: 1, minWidth: "200px", padding: "9px 14px",
  borderRadius: "10px", border: "1px solid rgba(0,0,0,0.1)",
  fontSize: "13px", outline: "none", background: "#fff",
};

const filterSelect = {
  padding: "9px 12px", borderRadius: "10px",
  border: "1px solid rgba(0,0,0,0.1)",
  fontSize: "13px", background: "#fff",
  cursor: "pointer", outline: "none",
};

const tableCard = {
  background: "#fff", border: "1px solid rgba(0,0,0,0.07)",
  borderRadius: "14px", overflow: "hidden",
};

const th = {
  textAlign: "left", padding: "10px 16px",
  fontSize: "11px", fontWeight: "700",
  color: "#6b7280", textTransform: "uppercase",
  letterSpacing: "0.05em",
  borderBottom: "1px solid rgba(0,0,0,0.07)",
};

const td = { padding: "11px 16px", verticalAlign: "middle" };

const pagination = {
  display: "flex", alignItems: "center",
  justifyContent: "space-between",
  marginTop: "14px",
};

const pageBtn = {
  padding: "6px 12px", borderRadius: "8px",
  border: "1px solid rgba(0,0,0,0.1)",
  background: "transparent", color: theme.dark,
  fontSize: "12px", cursor: "pointer",
};

export default UnebAuditPage;