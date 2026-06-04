import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../../components/PageLayout";
import { theme } from "../../theme";
import BASE_URL from "../../api";
import { useEffect } from "react";

  


const STATUS_STYLE = {
  pending: { label: "Pending", color: "#8a5a00", bg: "#fff3cd" },
  sent: { label: "Sent", color: "#0c5460", bg: "#d1ecf1" },
  accepted: { label: "Accepted", color: "#155724", bg: "#d4edda" },
  rejected: { label: "Rejected", color: "#721c24", bg: "#f8d7da" },
};

function NiraPortalPage() {
  const navigate = useNavigate();
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCases = async () => {
  try {
    const res = await fetch(`${BASE_URL}/nira/ids/`);

    if (!res.ok) throw new Error("Failed to fetch");

    const data = await res.json();
    setCases(data);

  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};


useEffect(() => {
  fetchCases();
}, []);



const sendToNira = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}/nira/ids/${id}/send/`, {
      method: "PATCH",
    });

    if (!res.ok) throw new Error("Failed");

    fetchCases(); // refresh list
  } catch (err) {
    console.error(err);
    alert("Failed to send");
  }
};

  return (
    <PageLayout>
      <div style={wrapper}>

        {/* HEADER */}
        <div style={header}>
          <div>
            <h1 style={title}>NIRA Forwarding Portal</h1>
            <p style={subtitle}>
              Send verified ID cases to NIRA for validation and processing.
            </p>
          </div>

          <button style={backBtn} onClick={() => navigate("/admin")}>
            ← Back
          </button>
        </div>

        {/* STATS */}
        <div style={statsRow}>
          <Stat label="Pending" value="2" />
          <Stat label="Sent" value="1" />
          <Stat label="Accepted" value="0" />
          <Stat label="Rejected" value="0" />
        </div>

        {/* TABLE */}
        <div style={card}>
          <div style={cardHeader}>Submission Queue</div>

          {loading ? (
            <div style={loadingBox}>Loading cases...</div>
          ) : (


          <table style={table}>
            <thead>
              <tr>
                <th style={th}>Name</th>
                <th style={th}>ID Number</th>
                <th style={th}>Status</th>
                <th style={th}>Date</th>
                <th style={th}>Action</th>
              </tr>
            </thead>

            <tbody>
              {cases.map((c) => {
                const s = STATUS_STYLE[c.status] || STATUS_STYLE.pending;

                return (
                  <tr key={c.id}>
                    <td style={td}>{c.name}</td>
                    <td style={td}>{c.idNumber}</td>
                    <td style={td}>
                      <span style={{
                        background: s.bg,
                        color: s.color,
                        padding: "4px 10px",
                        borderRadius: "999px",
                        fontSize: "12px",
                        fontWeight: "600",
                      }}>
                        {s.label}
                      </span>
                    </td>
                    <td style={td}>{c.date}</td>
                    <td style={td}>
                      <button style={sendBtn} onClick={() => sendToNira(c.id)}>
                        Send
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          )}
        </div>

        {/* INFO PANEL */}
        <div style={infoCard}>
          <h3>How this works</h3>
          <p>
            Verified ID cases are forwarded to <b>NIRA</b> for validation.
            Each submission is logged and tracked for accountability.
          </p>
        </div>

      </div>
    </PageLayout>
  );
}

// ── COMPONENT ─────────────────────────────
function Stat({ label, value }) {
  return (
    <div style={statBox}>
      <div style={statValue}>{value}</div>
      <div style={statLabel}>{label}</div>
    </div>
  );
}

// ── STYLES ────────────────────────────────

const wrapper = {
  maxWidth: "1100px",
  margin: "0 auto",
  padding: "24px",
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "20px",
};

const title = {
  fontSize: "28px",
  margin: 0,
  color: theme.dark,
};

const subtitle = {
  color: "#6b7280",
  marginTop: "6px",
};

const backBtn = {
  padding: "10px 14px",
  borderRadius: "10px",
  border: "none",
  background: theme.primary,
  color: "#fff",
  cursor: "pointer",
};

const statsRow = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: "12px",
  marginBottom: "18px",
};

const statBox = {
  background: theme.card,
  padding: "14px",
  borderRadius: "14px",
};

const statValue = {
  fontSize: "20px",
  fontWeight: "700",
  color: theme.dark,
};

const statLabel = {
  fontSize: "12px",
  color: "#6b7280",
};

const card = {
  background: theme.card,
  borderRadius: "16px",
  overflow: "hidden",
};

const cardHeader = {
  padding: "14px 16px",
  borderBottom: "1px solid rgba(0,0,0,0.08)",
  fontWeight: "700",
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
};

const th = {
  textAlign: "left",
  padding: "12px",
  fontSize: "12px",
  color: "#6b7280",
};

const td = {
  padding: "12px",
  fontSize: "13px",
};

const sendBtn = {
  padding: "6px 10px",
  borderRadius: "8px",
  border: "none",
  background: theme.primary,
  color: "#fff",
  cursor: "pointer",
};

const infoCard = {
  marginTop: "18px",
  background: theme.card,
  padding: "16px",
  borderRadius: "14px",
  color: "#6b7280",
};

const loadingBox = {
  padding: "20px",
  textAlign: "center",
  color: "#6b7280",
};

export default NiraPortalPage;