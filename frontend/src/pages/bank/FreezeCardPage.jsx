import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../../components/PageLayout";
import { theme } from "../../theme";
import BASE_URL from "../../api";

function FreezeCardPage() {

  const navigate = useNavigate();

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // fetch reports
  const fetchReports = async () => {

    try {

      const res = await fetch(
        `${BASE_URL}/atm/reports/`
      );

      if (!res.ok) {
        throw new Error("Failed to fetch");
      }

      const data = await res.json();

      setReports(data);

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {

    fetchReports();

  }, []);

  // toggle card
  const toggleCard = async (report) => {

    try {

         const action =
            report.card_status === "Frozen"
                ? "resolve"
                : "freeze";

      const res = await fetch(
        `${BASE_URL}/atm/reports/${report.id}/toggle/`,
        {
          method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ action }),
        }
      );

      if (!res.ok) {
        throw new Error("Failed");
      }

      fetchReports();

    } catch (err) {

      console.error(err);
      alert("Failed to update card");
    }
  };

  return (
    <PageLayout>

      <div style={wrapper}>

        {/* HEADER */}
        <div style={header}>

          <div>
            <h1 style={title}>
              Freeze Card Management
            </h1>

            <p style={subtitle}>
              Manage ATM card freeze status.
            </p>
          </div>

          <button
            style={backBtn}
            onClick={() => navigate("/bank/dashboard")}
          >
            ← Back
          </button>

        </div>

        {/* INFO BOX */}
        <div style={infoBox}>

          <div style={infoTitle}>
            Automatic Protection
          </div>

          <div style={infoText}>
            ATM cards reported missing are
            automatically frozen for customer
            safety. Staff may manually freeze
            or unfreeze cards below.
          </div>

        </div>

        {/* TABLE */}
        <div style={tableWrapper}>

          {loading ? (

            <div style={empty}>
              Loading...
            </div>

          ) : (

            <table style={table}>

              <thead>

                <tr>
                  <th style={th}>Card Holder</th>
                  <th style={th}>Account</th>
                  <th style={th}>Case</th>
                  <th style={th}>Card</th>
                  <th style={th}>Action</th>
                </tr>

              </thead>

              <tbody>

                {reports.map((report) => (

                  <tr key={report.id}>

                    <td style={td}>
                      {report.card_holder}
                    </td>

                    <td style={td}>
                      {report.account_number}
                    </td>

                    <td style={td}>
                      {report.status}
                    </td>

                    <td style={td}>

                      <span style={{
                        ...badge,
                        background:
                          report.card_status === "Frozen"
                            ? "#fee2e2"
                            : "#dcfce7",
                        color:
                          report.card_status === "Frozen"
                            ? "#991b1b"
                            : "#166534",
                      }}>
                        {report.card_status}
                      </span>

                    </td>

                    <td style={td}>

                      <button
                        style={{
                          ...actionBtn,
                          background:
                            report.card_status === "Frozen"
                              ? "#16a34a"
                              : "#dc2626",
                        }}
                        onClick={() =>
                          toggleCard(report)
                        }
                      >

                        {report.card_status === "Frozen"
                          ? "Unfreeze Card"
                          : "Freeze Card"}

                      </button>

                    </td>

                  </tr>
                ))}

              </tbody>

            </table>
          )}

        </div>

      </div>

    </PageLayout>
  );
}

const wrapper = {
  padding: "24px",
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "20px",
};

const title = {
  margin: 0,
  color: theme.dark,
};

const subtitle = {
  color: "#6b7280",
};

const backBtn = {
  padding: "12px 18px",
  border: "none",
  borderRadius: "12px",
  background: theme.primary,
  color: "#fff",
  cursor: "pointer",
};

const infoBox = {
  background: "#eff6ff",
  padding: "18px",
  borderRadius: "14px",
  marginBottom: "20px",
};

const infoTitle = {
  fontWeight: "700",
  marginBottom: "6px",
};

const infoText = {
  color: "#374151",
  fontSize: "14px",
};

const tableWrapper = {
  background: "#fff",
  borderRadius: "16px",
  overflow: "hidden",
  boxShadow: "0 4px 18px rgba(0,0,0,0.05)",
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
};

const th = {
  textAlign: "left",
  padding: "16px",
  background: "#f9fafb",
};

const td = {
  padding: "16px",
  borderTop: "1px solid #eee",
};

const badge = {
  padding: "5px 10px",
  borderRadius: "999px",
  fontSize: "12px",
  fontWeight: "600",
};

const actionBtn = {
  border: "none",
  padding: "8px 14px",
  borderRadius: "10px",
  color: "#fff",
  cursor: "pointer",
};

const empty = {
  padding: "40px",
  textAlign: "center",
};

export default FreezeCardPage;