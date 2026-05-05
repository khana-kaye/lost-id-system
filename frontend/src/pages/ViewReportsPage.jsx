import { useEffect, useState } from "react";
import BASE_URL from "../api";
import PageLayout from "../components/PageLayout";
import { theme } from "../theme";

const maskNIN = (nin) => {
  if (!nin) return "";

  // ensure it's a string
  const value = String(nin);

  // if too short, just return as is (no masking)
  if (value.length <= 5) {
    return value;
  }

  const visible = value.slice(-5);
  const hidden = "*".repeat(value.length - 5);

  return hidden + visible;
};

function ViewReportsPage() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      const res = await fetch(`${BASE_URL}/ids/`);
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

  return (
    <PageLayout>
      <div style={container}>
        <div style={card}>
          <h1 style={title}>📄 View Reports</h1>
          <p style={subtitle}>Browse all submitted lost and found ID reports.</p>

          {loading ? (
            <p style={loadingText}>Loading reports...</p>
          ) : (
            <div style={tableWrapper}>
              <table style={table}>
                <thead>
                  <tr>
                    <th style={th}>Name</th>
                    <th style={th}>ID Number</th>
                    <th style={th}>Type</th>
                    <th style={th}>Status</th>
                    <th style={th}>Location Found</th>
                    <th style={th}>Date</th>
                  </tr>
                </thead>

                <tbody>
                  {records.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={td}>No reports found</td>
                    </tr>
                  ) : (
                    records.map((item) => (
                      <tr key={item.id}>
                        <td style={td}>{item.name}</td>
                        <td style={td}>{maskNIN(item.id_number)}</td>
                        <td style={td}>{item.id_type}</td>

                        <td style={td}>
                          <span
                            style={{
                              color: item.status === "Found" ? "#16a34a" : "#dc2626",
                              fontWeight: "600",
                            }}
                          >
                            {item.status}
                          </span>
                        </td>

                        <td style={td}>{item.location_found}</td>

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
    </PageLayout>
  );
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

export default ViewReportsPage;