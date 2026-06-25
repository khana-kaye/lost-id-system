
import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
import BASE_URL from "../../api";
import PageLayout from "../../components/PageLayout";
import { theme } from "../../theme";

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

function UdlsManageRecords({ embedded }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  // const [editingId, setEditingId] = useState(null);
  // const [editData, setEditData] = useState({});
  // const [editStatus, setEditStatus] = useState("");
  // const navigate = useNavigate();



  const fetchRecords = async () => {
    try {
      const res = await fetch(`${BASE_URL}/udls/records/`);
      const data = await res.json();
      setRecords(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  // filter
  // const filtered = records.filter((item) =>
  //   item.name?.toLowerCase().includes(query.toLowerCase()) ||
  //   item.id_number?.toLowerCase().includes(query.toLowerCase())
  // );

  // DELETE
  // const handleDelete = async (id) => {
  //   const confirmDelete = window.confirm("Delete this record?");
  //   if (!confirmDelete) return;

  //   await fetch(`${BASE_URL}/udls/records${id}/`, {
  //     method: "DELETE",
  //   });

  //   fetchRecords(); 
  // };


  // const handleUpdate = async (id) => {
  //   try {
  //     const res = await fetch(`${BASE_URL}/udls/records/${id}/`, {
  //       method: "PUT",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({status: editData.status,}),
  //     });

  //     if (res.ok) {
  //       alert("Updated successfully");
  //       setEditingId(null);
  //       fetchRecords();
  //     } else {
  //       const err = await res.json();
  //       alert("Update failed: " + JSON.stringify(err));
  //     }
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  const content = (
    <div style={container}>
      <div style={card}>
        <h1 style={title}>🛠 Manage Records</h1>
          <p style={subtitle}>Search, edit, and manage lost and found Drivers Permits .</p>

          {/* SEARCH */}
          <input
            placeholder="Search by name or License Number"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={searchInput}
          />

          {loading ? (
            <p style={loadingText}>Loading records...</p>
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
            <td style={td}>{maskNIN(item.license_number)}</td>
            {/* <td style={td}>{item.license_number}</td> */}
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

const searchInput = {
  width: "100%",
  maxWidth: "400px",
  padding: "12px 16px",
  border: "1px solid #d1d5db",
  borderRadius: "8px",
  fontSize: "14px",
  marginBottom: "24px",
  outline: "none",
  transition: "border-color 0.2s",
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

// const editInput = {
//   width: "100%",
//   padding: "8px 12px",
//   border: "1px solid #d1d5db",
//   borderRadius: "4px",
//   fontSize: "14px",
//   outline: "none",
// };

// const editSelect = {
//   width: "100%",
//   padding: "8px 12px",
//   border: "1px solid #d1d5db",
//   borderRadius: "4px",
//   fontSize: "14px",
//   outline: "none",
//   background: "white",
// };

// const editBtn = {
//   background: theme.primary,
//   color: "white",
//   border: "none",
//   padding: "8px 16px",
//   borderRadius: "6px",
//   cursor: "pointer",
//   fontSize: "14px",
//   marginRight: "8px",
//   transition: "background-color 0.2s",
// };

// const deleteBtn = {
//   background: "#dc2626",
//   color: "white",
//   border: "none",
//   padding: "8px 16px",
//   borderRadius: "6px",
//   cursor: "pointer",
//   fontSize: "14px",
//   transition: "background-color 0.2s",
// };

// const saveBtn = {
//   background: theme.secondary,
//   color: "white",
//   border: "none",
//   padding: "8px 16px",
//   borderRadius: "6px",
//   cursor: "pointer",
//   fontSize: "14px",
//   marginRight: "8px",
//   transition: "background-color 0.2s",
// };

// const cancelBtn = {
//   background: "#6b7280",
//   color: "white",
//   border: "none",
//   padding: "8px 16px",
//   borderRadius: "6px",
//   cursor: "pointer",
//   fontSize: "14px",
//   transition: "background-color 0.2s",
// };

export default UdlsManageRecords;