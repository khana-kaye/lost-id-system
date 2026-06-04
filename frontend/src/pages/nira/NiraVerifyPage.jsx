import { useState } from "react";
import BASE_URL from "../../api";
import { theme } from "../../theme";

function NiraVerifyPage() {
  const [nin, setNin] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleVerify = async () => {
    if (!nin.trim()) {
      setError("Please enter a NIN.");
      return;
    }
    setError("");
    setResult(null);
    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/nira/verify/?nin=${encodeURIComponent(nin.trim())}`);
      const data = await res.json();

      if (res.ok) {
        setResult(data);
      } else {
        setError(data.message || "NIN not found in system.");
      }
    } catch (err) {
      setError("Request failed. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={wrapper}>
      {/* Search bar */}
      <div style={searchCard}>
        <h2 style={heading}>Verify National ID</h2>
        <p style={sub}>Enter a National Identification Number (NIN) to look it up in the system.</p>

        <div style={searchRow}>
          <input
            placeholder="e.g. CM90012345ABCD"
            value={nin}
            onChange={(e) => setNin(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleVerify()}
            style={input}
          />
          <button onClick={handleVerify} style={btn} disabled={loading}>
            {loading ? "Searching..." : "Verify"}
          </button>
        </div>

        {error && <p style={errorText}>{error}</p>}
      </div>

      {/* Result card */}
      {result && (
        <div style={resultCard}>
          {/* Header row */}
          <div style={resultHeader}>
            <div style={avatar}>
              {result.name?.charAt(0).toUpperCase() || "?"}
            </div>
            <div>
              <div style={resultName}>{result.name}</div>
              <div style={resultNin}>{result.nin}</div>
            </div>
            <span style={{
              ...statusBadge,
              background: result.is_flagged ? "#fcebeb" : "#eaf3de",
              color:      result.is_flagged ? "#a32d2d" : "#3b6d11",
            }}>
              {result.is_flagged ? "🚨 Flagged" : "✅ Clear"}
            </span>
          </div>

          <div style={divider} />

          {/* Details grid */}
          <div style={detailsGrid}>
            <DetailRow label="ID Type"      value={result.id_type} />
            <DetailRow label="Status"       value={result.status} />
            <DetailRow label="Report Count" value={result.report_count} />
            <DetailRow label="Flag Reason"  value={result.flag_reason || "None"} />
          </div>

          {result.is_flagged && (
            <div style={flagWarning}>
              ⚠️ This ID has been flagged. It has been reported {result.report_count} time(s).
              Review this case under <strong>Flagged IDs</strong>.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div style={detailRow}>
      <span style={detailLabel}>{label}</span>
      <span style={detailValue}>{value ?? "—"}</span>
    </div>
  );
}

// ── styles ──────────────────────────────────────────────────────────────────
const wrapper = {
  maxWidth:  "680px",
  margin:    "0 auto",
  padding:   "8px 0",
};

const searchCard = {
  background:   "white",
  border:       "1px solid rgba(0,0,0,0.07)",
  borderRadius: "16px",
  padding:      "24px",
  marginBottom: "18px",
  boxShadow:    "0 4px 20px rgba(0,0,0,0.05)",
};

const heading = {
  margin:     0,
  fontSize:   "16px",
  fontWeight: "700",
  color:      theme.dark,
};

const sub = {
  fontSize:     "12px",
  color:        "#6b7280",
  margin:       "6px 0 18px",
};

const searchRow = {
  display: "flex",
  gap:     "10px",
};

const input = {
  flex:         1,
  padding:      "11px 14px",
  borderRadius: "10px",
  border:       "1px solid #e5e7eb",
  fontSize:     "14px",
  outline:      "none",
};

const btn = {
  padding:      "11px 22px",
  background:   theme.primary,
  color:        "white",
  border:       "none",
  borderRadius: "10px",
  cursor:       "pointer",
  fontWeight:   "700",
  fontSize:     "14px",
  whiteSpace:   "nowrap",
};

const errorText = {
  color:     "#dc2626",
  fontSize:  "13px",
  marginTop: "10px",
};

const resultCard = {
  background:   "white",
  border:       "1px solid rgba(0,0,0,0.07)",
  borderRadius: "16px",
  padding:      "24px",
  boxShadow:    "0 4px 20px rgba(0,0,0,0.05)",
};

const resultHeader = {
  display:    "flex",
  alignItems: "center",
  gap:        "14px",
};

const avatar = {
  width:          "46px",
  height:         "46px",
  borderRadius:   "50%",
  background:     theme.primary + "22",
  color:          theme.primary,
  display:        "flex",
  alignItems:     "center",
  justifyContent: "center",
  fontSize:       "20px",
  fontWeight:     "700",
  flexShrink:     0,
};

const resultName = {
  fontSize:   "15px",
  fontWeight: "700",
  color:      theme.dark,
};

const resultNin = {
  fontSize:    "12px",
  color:       "#6b7280",
  fontFamily:  "monospace",
  marginTop:   "2px",
};

const statusBadge = {
  marginLeft:   "auto",
  fontSize:     "11px",
  padding:      "4px 12px",
  borderRadius: "999px",
  fontWeight:   "700",
};

const divider = {
  borderTop: "1px solid rgba(0,0,0,0.06)",
  margin:    "16px 0",
};

const detailsGrid = {
  display:       "flex",
  flexDirection: "column",
  gap:           "10px",
};

const detailRow = {
  display:        "flex",
  justifyContent: "space-between",
  alignItems:     "center",
};

const detailLabel = {
  fontSize:   "12px",
  color:      "#6b7280",
  fontWeight: "600",
};

const detailValue = {
  fontSize:   "13px",
  color:      theme.dark,
  fontWeight: "500",
};

const flagWarning = {
  marginTop:    "16px",
  padding:      "12px 14px",
  background:   "#fef3cd",
  border:       "1px solid #f59e0b",
  borderRadius: "10px",
  fontSize:     "12px",
  color:        "#92400e",
  lineHeight:   1.5,
};

export default NiraVerifyPage;