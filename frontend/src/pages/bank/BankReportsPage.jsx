import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../../components/PageLayout";
import { theme } from "../../theme";
import BASE_URL from "../../api";

function BankReportsPage() {

  const navigate = useNavigate();

  const [reports, setReports] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // fetch reports
  const fetchReports = async () => {

    try {

      const res = await fetch(
        `${BASE_URL}/atm/reports/`
      );

      if (!res.ok) {
        throw new Error("Failed to fetch reports");
      }

      const data = await res.json();

      setReports(data);

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);
    }
  };

  // load reports
  useEffect(() => {

    fetchReports();

    const interval = setInterval(() => {
      fetchReports();
    }, 10000);

    return () => clearInterval(interval);

  }, []);

  // resolve report
  const toggleReportStatus = async (id) => {

    try {

      const res = await fetch(
        `${BASE_URL}/atm/reports/${id}/toggle/`,
        {
          method: "PATCH",
        }
      );

      if (!res.ok) {
        throw new Error("Failed to resolve");
      }

      fetchReports();

    } catch (err) {

      console.error(err);
      alert("Failed to resolve report");
    }
  };

  // search filter
  const filteredReports = useMemo(() => {

    return reports.filter((report) => {

      const holder =
        report.card_holder?.toLowerCase() || "";

      const account =
        report.account_number?.toLowerCase() || "";

      const bank =
        report.bank_name?.toLowerCase() || "";

      const query = search.toLowerCase();

      return (
        holder.includes(query) ||
        account.includes(query) ||
        bank.includes(query)
      );
    });

  }, [reports, search]);

  return (
    <PageLayout>

      <div style={wrapper}>

        {/* HEADER */}
        <div style={header}>

          <div>
            <h1 style={title}>
              ATM Reports
            </h1>

            <p style={subtitle}>
              Manage lost ATM cases and frozen cards.
            </p>
          </div>

          <button
            style={backBtn}
            onClick={() => navigate("/bank/reports")}
          >
            ← Back
          </button>

        </div>

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search reports..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          style={searchInput}
        />

        {/* TABLE */}
        <div style={tableWrapper}>

          {loading ? (

            <div style={empty}>
              Loading reports...
            </div>

          ) : filteredReports.length === 0 ? (

            <div style={empty}>
              No reports found.
            </div>

          ) : (

            <table style={table}>

              <thead>

                <tr>
                  <th style={th}>Card Holder</th>
                  <th style={th}>Account</th>
                  <th style={th}>Bank</th>
                  <th style={th}>Case</th>
                  <th style={th}>Card</th>
                  <th style={th}>Action</th>
                </tr>

              </thead>

              <tbody>

                {filteredReports.map((report) => (

                  <tr key={report.id}>

                    <td style={td}>
                      {report.card_holder}
                    </td>

                    <td style={td}>
                      {report.account_number}
                    </td>

                    <td style={td}>
                      {report.bank_name}
                    </td>

                    <td style={td}>

                      <span style={{
                        ...badge,
                        background:
                          report.status === "Resolved"
                            ? "#dcfce7"
                            : "#fef3c7",
                        color:
                          report.status === "Resolved"
                            ? "#166534"
                            : "#92400e",
                      }}>
                        {report.status}
                      </span>

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

                      {report.status === "Pending" ? (


                            <button
                            style={{
                                ...resolveBtn,
                                background:
                                report.status === "Pending"
                                    ? "#2563eb"
                                    : "#dc2626",
                            }}
                            onClick={() =>
                                toggleReportStatus(report.id)
                            }
                            >

                            {report.status === "Pending"
                                ? "Resolve"
                                : "Reopen"}

                            </button>

                        // <button
                        //   style={resolveBtn}
                        //   onClick={() =>
                        //     resolveReport(report.id)
                        //   }
                        // >
                        //   Resolve
                        // </button>

                      ) : (

                        <span style={{
                          color: "#16a34a",
                          fontWeight: "600",
                        }}>
                          Resolved ✓
                        </span>

                      )}

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
  marginBottom: "24px",
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

const searchInput = {
  width: "100%",
  padding: "14px",
  borderRadius: "12px",
  border: "1px solid #ddd",
  marginBottom: "20px",
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

const resolveBtn = {
  padding: "8px 14px",
  border: "none",
  borderRadius: "10px",
  background: "#2563eb",
  color: "#fff",
  cursor: "pointer",
};

const empty = {
  padding: "40px",
  textAlign: "center",
  color: "#6b7280",
};

export default BankReportsPage;