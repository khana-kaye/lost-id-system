import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../../components/PageLayout";
import { theme } from "../../theme";

// ── hardcoded results DB (same as public search) ───────────────────────────
const RESULTS_DB = {
  ple: [
    {
      indexNo: "P0012/2015",
      name: "NAKATO SARAH",
      school: "Nakasero Primary School",
      year: 2015,
      district: "Kampala",
      subjects: [
        { name: "English Language", grade: 2 },
        { name: "Mathematics",      grade: 1 },
        { name: "Science",          grade: 2 },
        { name: "Social Studies",   grade: 1 },
      ],
      aggregate: 6,
      division: "1",
    },
    {
      indexNo: "P0034/2016",
      name: "MUKASA PETER",
      school: "St. Joseph's Primary School",
      year: 2016,
      district: "Wakiso",
      subjects: [
        { name: "English Language", grade: 3 },
        { name: "Mathematics",      grade: 2 },
        { name: "Science",          grade: 3 },
        { name: "Social Studies",   grade: 2 },
      ],
      aggregate: 10,
      division: "2",
    },
    {
      indexNo: "P0078/2018",
      name: "AUMA BRENDA",
      school: "Kibuli Primary School",
      year: 2018,
      district: "Kampala",
      subjects: [
        { name: "English Language", grade: 1 },
        { name: "Mathematics",      grade: 1 },
        { name: "Science",          grade: 1 },
        { name: "Social Studies",   grade: 2 },
      ],
      aggregate: 5,
      division: "1",
    },
  ],
  uce: [
    {
      indexNo: "U0234/2019",
      name: "SSEMWOGERERE JAMES",
      school: "Makerere College School",
      year: 2019,
      district: "Kampala",
      subjects: [
        { name: "English Language", grade: "D1" },
        { name: "Mathematics",      grade: "D2" },
        { name: "Physics",          grade: "C3" },
        { name: "Chemistry",        grade: "D2" },
        { name: "Biology",          grade: "C4" },
        { name: "History",          grade: "C5" },
        { name: "Geography",        grade: "C4" },
        { name: "Christian R.E.",   grade: "D2" },
      ],
      aggregate: 8,
      division: "1",
    },
    {
      indexNo: "U0567/2020",
      name: "NAMUTEBI CLAIRE",
      school: "St. Mary's College Kisubi",
      year: 2020,
      district: "Wakiso",
      subjects: [
        { name: "English Language", grade: "C4" },
        { name: "Mathematics",      grade: "C5" },
        { name: "Physics",          grade: "C6" },
        { name: "Chemistry",        grade: "C4" },
        { name: "Biology",          grade: "D2" },
        { name: "History",          grade: "C5" },
        { name: "Geography",        grade: "C6" },
        { name: "Christian R.E.",   grade: "C4" },
      ],
      aggregate: 16,
      division: "2",
    },
    {
      indexNo: "U0901/2021",
      name: "KIGGUNDU ALLAN",
      school: "King's College Budo",
      year: 2021,
      district: "Wakiso",
      subjects: [
        { name: "English Language", grade: "D1" },
        { name: "Mathematics",      grade: "D1" },
        { name: "Physics",          grade: "D1" },
        { name: "Chemistry",        grade: "D2" },
        { name: "Biology",          grade: "D2" },
        { name: "History",          grade: "C3" },
        { name: "Geography",        grade: "D2" },
        { name: "Christian R.E.",   grade: "D1" },
      ],
      aggregate: 5,
      division: "1",
    },
  ],
  uace: [
    {
      indexNo: "A0112/2022",
      name: "SSEMWOGERERE JAMES",
      school: "Makerere College School",
      year: 2022,
      district: "Kampala",
      subjects: [
        { name: "Mathematics",     grade: "A", points: 6 },
        { name: "Physics",         grade: "A", points: 6 },
        { name: "Chemistry",       grade: "B", points: 5 },
        { name: "General Paper",   grade: "B", points: 5 },
        { name: "Subsidiary Math", grade: "a", points: 2 },
      ],
      totalPoints: 22,
      division: "1",
    },
    {
      indexNo: "A0445/2022",
      name: "NAMUTEBI CLAIRE",
      school: "St. Mary's College Kisubi",
      year: 2022,
      district: "Wakiso",
      subjects: [
        { name: "Economics",       grade: "B", points: 5 },
        { name: "History",         grade: "C", points: 4 },
        { name: "Geography",       grade: "C", points: 4 },
        { name: "General Paper",   grade: "C", points: 4 },
        { name: "Subsidiary Math", grade: "b", points: 1 },
      ],
      totalPoints: 14,
      division: "2",
    },
    {
      indexNo: "A0788/2023",
      name: "KATO RONALD",
      school: "Uganda Martyrs' High School",
      year: 2023,
      district: "Masaka",
      subjects: [
        { name: "Biology",         grade: "A", points: 6 },
        { name: "Chemistry",       grade: "A", points: 6 },
        { name: "Physics",         grade: "B", points: 5 },
        { name: "General Paper",   grade: "B", points: 5 },
        { name: "Subsidiary Math", grade: "a", points: 2 },
      ],
      totalPoints: 20,
      division: "1",
    },
  ],
};

// ── helpers ────────────────────────────────────────────────────────────────
function searchDB(level, query) {
  const q = query.trim().toUpperCase();
  if (!q) return [];
  return RESULTS_DB[level].filter(
    (r) => r.name.includes(q) || r.indexNo.toUpperCase().includes(q)
  );
}

const DIVISION_META = {
  "1": { label: "Division 1", bg: "#eaf3de", color: "#3b6d11" },
  "2": { label: "Division 2", bg: "#e6f1fb", color: "#185fa5" },
  "3": { label: "Division 3", bg: "#faeeda", color: "#854f0b" },
  "4": { label: "Division 4", bg: "#fcebeb", color: "#a32d2d" },
};

function DivBadge({ div }) {
  const d = DIVISION_META[div] || { label: "Ungraded", bg: "#f1efe8", color: "#5f5e5a" };
  return (
    <span style={{
      fontSize: "11px", fontWeight: "700",
      padding: "3px 10px", borderRadius: "999px",
      background: d.bg, color: d.color,
    }}>
      {d.label}
    </span>
  );
}

// ── ResultCard with verify / flag actions ──────────────────────────────────
function ResultCard({ result, level, onAction }) {
  const isUACE = level === "uace";
  const [status, setStatus] = useState(result._status || null);

  const handleAction = (action) => {
    setStatus(action);
    onAction({ ...result, _status: action, level });
  };

  const actionBar = {
    verified: { label: "✓ Verified",      bg: "#eaf3de", color: "#3b6d11" },
    flagged:  { label: "⚑ Flagged",       bg: "#faeeda", color: "#854f0b" },
  };

  return (
    <div style={{
      background: "#fff",
      border: "1px solid rgba(0,0,0,0.08)",
      borderRadius: "16px",
      overflow: "hidden",
      marginBottom: "16px",
    }}>
      {/* header */}
      <div style={{
        background: theme.primary,
        padding: "16px 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        flexWrap: "wrap",
        gap: "8px",
      }}>
        <div>
          <div style={{ fontSize: "16px", fontWeight: "700", color: "#fff" }}>
            {result.name}
          </div>
          <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)", marginTop: "3px" }}>
            {result.indexNo} &nbsp;·&nbsp; {result.school}
          </div>
          <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.55)", marginTop: "2px" }}>
            {result.district} District &nbsp;·&nbsp; {result.year}
          </div>
        </div>
        <DivBadge div={result.division} />
      </div>

      {/* subjects */}
      <div style={{ padding: "16px 20px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
          <thead>
            <tr>
              <th style={thStyle}>Subject</th>
              <th style={{ ...thStyle, textAlign: "right" }}>
                {isUACE ? "Grade / Points" : "Grade"}
              </th>
            </tr>
          </thead>
          <tbody>
            {result.subjects.map((s, i) => (
              <tr key={i}>
                <td style={tdStyle}>{s.name}</td>
                <td style={{ ...tdStyle, textAlign: "right", fontWeight: "700", color: theme.primary }}>
                  {isUACE ? `${s.grade}  (${s.points})` : s.grade}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* aggregate row */}
        <div style={{
          marginTop: "12px", paddingTop: "12px",
          borderTop: "1px solid rgba(0,0,0,0.07)",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          flexWrap: "wrap", gap: "8px",
        }}>
          <span style={{ fontSize: "13px", color: "#6b7280" }}>
            {isUACE ? `Total points: ${result.totalPoints}` : `Aggregate: ${result.aggregate}`}
          </span>
          <DivBadge div={result.division} />
        </div>

        {/* action buttons or status stamp */}
        <div style={{ marginTop: "16px" }}>
          {status ? (
            <div style={{
              display: "flex", alignItems: "center", gap: "10px",
              padding: "10px 14px", borderRadius: "10px",
              background: actionBar[status].bg,
              color: actionBar[status].color,
              fontSize: "13px", fontWeight: "700",
            }}>
              <span>{actionBar[status].label}</span>
              <span style={{ fontWeight: "400", fontSize: "12px", marginLeft: "auto" }}>
                Action recorded
              </span>
              <button
                onClick={() => setStatus(null)}
                style={{
                  background: "transparent", border: "none",
                  cursor: "pointer", fontSize: "12px",
                  color: "inherit", opacity: 0.6,
                }}
              >
                Undo
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() => handleAction("verified")}
                style={{
                  flex: 1, padding: "10px",
                  borderRadius: "10px", border: "none",
                  background: "#eaf3de", color: "#3b6d11",
                  fontWeight: "700", fontSize: "13px", cursor: "pointer",
                }}
              >
                ✓ &nbsp; Verify
              </button>
              <button
                onClick={() => handleAction("flagged")}
                style={{
                  flex: 1, padding: "10px",
                  borderRadius: "10px", border: "none",
                  background: "#faeeda", color: "#854f0b",
                  fontWeight: "700", fontSize: "13px", cursor: "pointer",
                }}
              >
                ⚑ &nbsp; Flag
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── main page ──────────────────────────────────────────────────────────────
function UnebVerifyPage() {
  const navigate  = useNavigate();
  const [level,   setLevel]   = useState("ple");
  const [query,   setQuery]   = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [log,     setLog]     = useState([]);   // actions taken this session

  const levelLabels = { ple: "PLE", uce: "UCE", uace: "UACE" };

  const handleSearch = () => {
    if (!query.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setResults(searchDB(level, query));
      setLoading(false);
    }, 500);
  };

  const handleKeyDown = (e) => { if (e.key === "Enter") handleSearch(); };

  const handleAction = (record) => {
    setLog((prev) => {
      const exists = prev.findIndex((l) => l.indexNo === record.indexNo && l.level === record.level);
      if (exists !== -1) {
        const updated = [...prev];
        updated[exists] = record;
        return updated;
      }
      return [record, ...prev];
    });
  };

  return (
    <PageLayout>
      <div style={wrapper}>

        {/* ── sidebar (same pattern) ── */}
        <aside style={sidebar}>
          <div style={sidebarTop}>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <div style={orgIcon}>🎓</div>
              <div>
                <div style={{ fontSize: "13px", fontWeight: "700", color: theme.dark }}>UNEB Portal</div>
                <div style={{ fontSize: "11px", color: "#6b7280" }}>Examination Verification</div>
              </div>
            </div>
          </div>

          <nav style={navArea}>
            {[
              { label: "Dashboard",      emoji: "⊞", route: "/uneb/dashboard" },
              { label: "Verify Results", emoji: "📄", route: "/uneb/verify",   active: true },
              { label: "Audit Log",      emoji: "◷", route: "/uneb/audit"     },
              { label: "Settings",       emoji: "⚙", route: "/uneb/settings"  },
            ].map((item) => (
              <button
                key={item.route}
                onClick={() => navigate(item.route)}
                style={{
                  display: "flex", alignItems: "center", gap: "10px",
                  padding: "9px 10px", borderRadius: "10px",
                  border: "none", width: "100%", textAlign: "left",
                  cursor: "pointer", fontSize: "13px",
                  fontWeight: item.active ? "600" : "400",
                  background: item.active ? theme.primary : "transparent",
                  color: item.active ? "#fff" : "#6b7280",
                  marginBottom: "2px",
                }}
              >
                <span style={{ fontSize: "15px", width: "18px", textAlign: "center" }}>{item.emoji}</span>
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
              <div style={pageTitle}>Verify Results</div>
              <div style={pageSub}>Search a student record and mark it as verified or flagged.</div>
            </div>
          </div>

          <div style={contentBody}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "20px", alignItems: "start" }}>

              {/* ── left: search + results ── */}
              <div>
                {/* search card */}
                <div style={searchCard}>

                  {/* level tabs */}
                  <div style={{ display: "flex", gap: "8px", marginBottom: "14px" }}>
                    {["ple", "uce", "uace"].map((l) => (
                      <button
                        key={l}
                        onClick={() => { setLevel(l); setResults(null); setQuery(""); }}
                        style={{
                          padding: "7px 18px", borderRadius: "10px",
                          border: "1px solid",
                          cursor: "pointer", fontSize: "13px", fontWeight: "700",
                          background: level === l ? theme.primary : "transparent",
                          color:      level === l ? "#fff"         : "#6b7280",
                          borderColor: level === l ? theme.primary : "rgba(0,0,0,0.1)",
                          transition: "all 0.15s",
                        }}
                      >
                        {levelLabels[l]}
                      </button>
                    ))}
                  </div>

                  {/* input row */}
                  <div style={{ display: "flex", gap: "10px" }}>
                    <input
                      type="text"
                      placeholder={
                        level === "ple"  ? "e.g. NAKATO SARAH or P0012/2015" :
                        level === "uce"  ? "e.g. SSEMWOGERERE JAMES or U0234/2019" :
                                          "e.g. KATO RONALD or A0788/2023"
                      }
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyDown={handleKeyDown}
                      style={inputStyle}
                    />
                    <button
                      onClick={handleSearch}
                      disabled={!query.trim() || loading}
                      style={{
                        ...searchBtn,
                        opacity: (!query.trim() || loading) ? 0.5 : 1,
                        cursor:  (!query.trim() || loading) ? "not-allowed" : "pointer",
                      }}
                    >
                      {loading ? "…" : "Search"}
                    </button>
                  </div>
                  <p style={{ fontSize: "11px", color: "#9ca3af", margin: "8px 0 0" }}>
                    Search by full name (capitals) or index number.
                  </p>
                </div>

                {/* results */}
                <div style={{ marginTop: "20px" }}>
                  {loading && (
                    <div style={centeredMsg}>
                      <div style={spinner} />
                      <span style={{ color: "#6b7280", fontSize: "13px", marginTop: "10px" }}>
                        Fetching records…
                      </span>
                    </div>
                  )}

                  {!loading && results !== null && results.length === 0 && (
                    <div style={centeredMsg}>
                      <div style={{ fontSize: "36px", marginBottom: "8px" }}>🔍</div>
                      <div style={{ fontWeight: "700", color: theme.dark }}>No record found</div>
                      <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "4px" }}>
                        Check the spelling or try the index number.
                      </div>
                    </div>
                  )}

                  {!loading && results && results.length > 0 && (
                    <>
                      <p style={{ fontSize: "12px", color: "#6b7280", marginBottom: "12px" }}>
                        {results.length} record{results.length > 1 ? "s" : ""} found
                      </p>
                      {results.map((r) => (
                        <ResultCard
                          key={r.indexNo}
                          result={r}
                          level={level}
                          onAction={handleAction}
                        />
                      ))}
                    </>
                  )}

                  {results === null && !loading && (
                    <div style={{
                      background: "#fff", border: "1px solid rgba(0,0,0,0.07)",
                      borderRadius: "14px", padding: "32px",
                      textAlign: "center", color: "#9ca3af", fontSize: "13px",
                    }}>
                      <div style={{ fontSize: "32px", marginBottom: "10px" }}>📄</div>
                      Search for a student above to load their result for verification.
                    </div>
                  )}
                </div>
              </div>

              {/* ── right: session action log ── */}
              <div style={{
                background: "#fff", border: "1px solid rgba(0,0,0,0.07)",
                borderRadius: "14px", overflow: "hidden",
                position: "sticky", top: "20px",
              }}>
                <div style={{
                  padding: "12px 16px",
                  borderBottom: "1px solid rgba(0,0,0,0.06)",
                }}>
                  <div style={{ fontSize: "13px", fontWeight: "700", color: theme.dark }}>
                    Session Log
                  </div>
                  <div style={{ fontSize: "11px", color: "#6b7280", marginTop: "2px" }}>
                    Actions taken this session
                  </div>
                </div>

                {log.length === 0 ? (
                  <div style={{
                    padding: "24px 16px", textAlign: "center",
                    fontSize: "12px", color: "#9ca3af",
                  }}>
                    No actions yet. Verify or flag a record to begin.
                  </div>
                ) : (
                  <div>
                    {log.map((entry, i) => {
                      const isLast = i === log.length - 1;
                      const isVerified = entry._status === "verified";
                      return (
                        <div key={i} style={{
                          padding: "10px 16px",
                          borderBottom: isLast ? "none" : "1px solid rgba(0,0,0,0.05)",
                          display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px",
                        }}>
                          <div style={{ minWidth: 0 }}>
                            <div style={{
                              fontSize: "12px", fontWeight: "600",
                              color: theme.dark,
                              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                            }}>
                              {entry.name}
                            </div>
                            <div style={{ fontSize: "11px", color: "#6b7280" }}>
                              {entry.indexNo} &nbsp;·&nbsp; {levelLabels[entry.level]}
                            </div>
                          </div>
                          <span style={{
                            fontSize: "10px", fontWeight: "700", flexShrink: 0,
                            padding: "2px 8px", borderRadius: "999px",
                            background: isVerified ? "#eaf3de" : "#faeeda",
                            color:      isVerified ? "#3b6d11"  : "#854f0b",
                          }}>
                            {isVerified ? "Verified" : "Flagged"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>
          </div>
        </main>
      </div>
    </PageLayout>
  );
}

// ── shared styles ──────────────────────────────────────────────────────────
const wrapper = {
  display: "flex", height: "calc(100vh - 80px)",
  overflow: "hidden", background: "#f4f6fa",
};

const sidebar = {
  width: "220px", minWidth: "220px",
  background: theme.card,
  borderRight: "1px solid rgba(0,0,0,0.07)",
  display: "flex", flexDirection: "column", overflow: "hidden",
};

const sidebarTop = {
  padding: "18px", borderBottom: "1px solid rgba(0,0,0,0.07)",
};

const orgIcon = {
  width: "36px", height: "36px",
  background: theme.primary, borderRadius: "10px",
  display: "flex", alignItems: "center", justifyContent: "center",
  fontSize: "18px", flexShrink: 0,
};

const navArea = {
  flex: 1, padding: "12px 10px", overflowY: "auto",
};

const sidebarFooter = {
  padding: "14px", borderTop: "1px solid rgba(0,0,0,0.07)",
};

const logoutBtn = {
  width: "100%", padding: "10px",
  background: "#fcebeb", color: "#a32d2d",
  border: "1px solid rgba(163,45,45,0.2)",
  borderRadius: "10px", cursor: "pointer",
  fontWeight: "700", fontSize: "13px",
};

const mainArea = {
  flex: 1, display: "flex", flexDirection: "column", overflow: "hidden",
};

const topbar = {
  display: "flex", alignItems: "center", justifyContent: "space-between",
  padding: "14px 24px",
  borderBottom: "1px solid rgba(0,0,0,0.07)",
  background: theme.card,
};

const pageTitle = {
  fontSize: "16px", fontWeight: "700", color: theme.dark,
};

const pageSub = {
  fontSize: "12px", color: "#6b7280", marginTop: "2px",
};

const contentBody = {
  flex: 1, overflowY: "auto", padding: "20px 24px",
};

const searchCard = {
  background: "#fff",
  border: "1px solid rgba(0,0,0,0.07)",
  borderRadius: "14px",
  padding: "20px",
};

const inputStyle = {
  flex: 1, padding: "11px 14px",
  borderRadius: "10px",
  border: "1px solid rgba(0,0,0,0.12)",
  fontSize: "13px", outline: "none",
  background: "#f9fafb",
};

const searchBtn = {
  padding: "11px 22px", borderRadius: "10px",
  border: "none", background: theme.primary,
  color: "#fff", fontSize: "13px",
  fontWeight: "700", flexShrink: 0,
};

const centeredMsg = {
  display: "flex", flexDirection: "column",
  alignItems: "center", justifyContent: "center",
  padding: "40px 24px", textAlign: "center",
};

const spinner = {
  width: "26px", height: "26px",
  border: "3px solid rgba(0,0,0,0.08)",
  borderTop: `3px solid ${theme.primary}`,
  borderRadius: "50%",
  animation: "spin 0.8s linear infinite",
};

const thStyle = {
  textAlign: "left", padding: "7px 0",
  color: "#6b7280", fontWeight: "600",
  fontSize: "11px", textTransform: "uppercase",
  letterSpacing: "0.05em",
  borderBottom: "1px solid rgba(0,0,0,0.07)",
};

const tdStyle = {
  padding: "8px 0", color: theme.dark,
  borderBottom: "1px solid rgba(0,0,0,0.05)",
};

// inject spinner keyframe once
if (!document.getElementById("uneb-spin-style")) {
  const s = document.createElement("style");
  s.id = "uneb-spin-style";
  s.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`;
  document.head.appendChild(s);
}

export default UnebVerifyPage;