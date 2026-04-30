import { useEffect, useState } from "react";
import BASE_URL from "../api";

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
    <div style={container}>
      <h1 style={{ color: "#0d2b4c" }}>📄 View Reports</h1>

      {loading ? (
        <p>Loading reports...</p>
      ) : (
        <div style={{ overflowX: "auto", marginTop: "20px" }}>
          <table style={table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>ID Number</th>
                <th>Type</th>
                <th>Status</th>
                <th>Location Found</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {records.length === 0 ? (
                <tr>
                  <td colSpan="6">No reports found</td>
                </tr>
              ) : (
                records.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{maskNIN(item.id_number)}</td>
                    <td>{item.id_type}</td>

                    <td>
                      <span
                        style={{
                          color: item.status === "Found" ? "green" : "red",
                          fontWeight: "bold",
                        }}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td>{item.location_found}</td>

                    <td>
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
  );
}

/* STYLES */
const container = {
  padding: "40px",
  minHeight: "100vh",
  background: "#f4f6f8",
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
  background: "white",
};

export default ViewReportsPage;