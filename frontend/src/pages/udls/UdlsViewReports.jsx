import { useEffect, useState } from "react";
import BASE_URL from "../../api";
import PageLayout from "../../components/PageLayout";
import { theme } from "../../theme";

const maskNIN = (nin) => {
  if (!nin) return "";

  // ensure it's a string
  const value = String(nin);

  // if too short, just return as is (no masking)
  if (value.length <= 7) {
    return value;
  }

  const prefix = value.slice(0, 2);      // CM or CF
  const last5 = value.slice(-5);         // last 5 digits
  const middleLength = value.length - 7; // remaining hidden part

  const hidden = "*".repeat(middleLength);

  return `${prefix}${hidden}${last5}`;

//   const visible = value.slice(-5);
//   const hidden = "*".repeat(value.length - 5);

//   return hidden + visible;
};

function UdlsViewReports({ embedded }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      const res = await fetch(`${BASE_URL}/udls/records/`);
      const data = await res.json();

      setRecords(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching reports:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const content = (
    <div style={container}>
      <div style={card}>
        <h1 style={title}>📄 View Reports</h1>
          <p style={subtitle}>Browse all submitted lost and found Drivers Permits reports.</p>

          {loading ? (
            <p style={loadingText}>Loading reports...</p>
          ) : (
            <div style={tableWrapper}>
              <table style={table}>
                <thead>
  <tr>
    <th style={th}>Holder Name</th>
    <th style={th}>License Number</th>
    <th style={th}>Status</th>
    <th style={th}>Flagged</th>
    <th style={th}>Location Reported</th>
    <th style={th}>Reported By</th>
    <th style={th}>Date</th>
  </tr>
            </thead>
            <tbody>
            {records.length === 0 ? (
                <tr><td colSpan="7" style={td}>No permits found</td></tr>
            ) : (
                records.map((item) => (
                <tr key={item.id}>
                    <td style={td}>{item.holder_name}</td>
                    <td style={td}>{item.license_number}</td>
                    <td style={td}>
                    <span style={{
                        color: item.status === "Found" ? "#16a34a" : "#dc2626",
                        fontWeight: "600",
                    }}>
                        {item.status}
                    </span>
                    </td>
                    <td style={td}>
                    {item.is_flagged
                        ? <span style={{ color: "#e24b4a", fontWeight: 600 }}>⚑ Flagged</span>
                        : <span style={{ color: "#6b7280" }}>—</span>}
                    </td>
                    <td style={td}>{item.location_reported}</td>
                    <td style={td}>{item.reported_by}</td>
                    <td style={td}>
                    {item.created_at
                        ? new Date(item.created_at).toLocaleDateString()
                        : "N/A"}
                    </td>
                </tr>
                ))
            )}
            </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
  );

  return embedded ? content : <PageLayout>{content}</PageLayout>;
}

/* STYLES */
const container = {
  width: "100%",
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "24px",
};

const card = {
  background: theme.card,
  padding: "32px",
  borderRadius: "24px",
  boxShadow: "0 20px 50px rgba(0,0,0,0.1)",
  border: "1px solid rgba(255,255,255,0.15)",
};

const title = {
  margin: 0,
  marginBottom: "8px",
  fontSize: "28px",
  color: theme.dark,
};

const subtitle = {
  margin: 0,
  marginBottom: "24px",
  color: "#6b7280",
};

const loadingText = {
  color: "#6b7280",
  textAlign: "center",
  padding: "40px",
};

const tableWrapper = {
  overflowX: "auto",
  borderRadius: "12px",
  border: "1px solid #e5e7eb",
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
  background: "white",
};

const th = {
  padding: "16px 20px",
  textAlign: "left",
  background: "#f9fafb",
  borderBottom: "1px solid #e5e7eb",
  fontWeight: "600",
  color: theme.dark,
  fontSize: "14px",
};

const td = {
  padding: "16px 20px",
  borderBottom: "1px solid #f3f4f6",
  color: "#374151",
  fontSize: "14px",
};

export default UdlsViewReports;