import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const prefix = value.slice(0, 2);      // CF / CM / etc

  const last5 = value.slice(-5);



  const middleLength = value.length - 7;

  const hidden = "*".repeat(middleLength);



  return `${prefix}${hidden}${last5}`;

  // const visible = value.slice(-5);
  // const hidden = "*".repeat(value.length - 5);

  // return hidden + visible;
};

function NiraManageRecordsPage({ embedded }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [editStatus, setEditStatus] = useState("");
  const navigate = useNavigate();



  const fetchRecords = async () => {
    try {
      const res = await fetch(`${BASE_URL}/nira/records/`);
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
  const filtered = records.filter((item) =>
    item.name?.toLowerCase().includes(query.toLowerCase()) ||
    item.id_number?.toLowerCase().includes(query.toLowerCase())
  );

  // DELETE
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this record?");
    if (!confirmDelete) return;

    await fetch(`${BASE_URL}/nira/records/${id}/`, {
      method: "DELETE",
    });

    fetchRecords(); 
  };


  const handleUpdate = async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/nira/records/${id}/update-status/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({status: "Resolved",}),
      });

      if (res.ok) {
      fetchRecords();
    } else {
      const err = await res.json();
      alert("Failed: " + JSON.stringify(err));
    }
  } catch (err) {
    console.error(err);
  }
};

  const content = (
    <div style={container}>
      <div style={card}>
        <h1 style={title}>🛠 Manage Records</h1>
          <p style={subtitle}>Search, edit, and manage lost and found ID records.</p>

          {/* SEARCH */}
          <input
            placeholder="Search by name or ID"
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
                    <th style={th}>Name</th>
                    <th style={th}>ID Number</th>
                    <th style={th}>Type</th>
                    <th style={th}>Status</th>
                    <th style={th}>Location</th>
                    <th style={th}>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filtered.map((item) => (
                    <tr
                      key={item.id}
                      style={{ cursor: "pointer" }}
                      onClick={() => navigate(`/admin/records/${item.id}`)}
                    >
                      {/*name*/}
                      <td style={td}>
                        {editingId === item.id ? (
                          <input
                            value={editData.name}
                            onChange={(e) =>
                              setEditData({ ...editData, name: e.target.value })
                            }
                            style={editInput}
                          />
                        ) : (
                          item.name
                        )}
                      </td>

                      {/* ID NUMBER */}
                      <td style={td}>
                        {editingId === item.id ? (
                          <input
                            value={editData.id_number}
                            onChange={(e) =>
                              setEditData({ ...editData, id_number: e.target.value })
                            }
                            style={editInput}
                          />
                        ) : (
                          maskNIN(item.id_number)
                        )}
                      </td>

                      {/* TYPE */}
                      <td style={td}>
                        {editingId === item.id ? (
                          <select
                            value={editData.id_type}
                            onChange={(e) =>
                              setEditData({ ...editData, id_type: e.target.value })
                            }
                            style={editSelect}
                          >
                            <option value="National ID">National ID</option>
                            <option value="Driver Permit">Driver Permit</option>
                          </select>
                        ) : (
                          item.id_type
                        )}
                      </td>

                      
                      {/* STATUS */}
                      <td style={td}>
                        {item.status !== "Resolved" ? (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUpdate(item.id);
                              }}
                              style={saveBtn}
                            >
                              Mark Resolved
                            </button>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(item.id);
                              }}
                              style={deleteBtn}
                            >
                              Delete
                            </button>
                          </>
                        ) : (
                          <>
                            <span style={{ color: "#16a34a", fontWeight: 600, marginRight: 8 }}>
                              ✓ Resolved
                            </span>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(item.id);
                              }}
                              style={deleteBtn}
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
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

const editInput = {
  width: "100%",
  padding: "8px 12px",
  border: "1px solid #d1d5db",
  borderRadius: "4px",
  fontSize: "14px",
  outline: "none",
};

const editSelect = {
  width: "100%",
  padding: "8px 12px",
  border: "1px solid #d1d5db",
  borderRadius: "4px",
  fontSize: "14px",
  outline: "none",
  background: "white",
};

const editBtn = {
  background: theme.primary,
  color: "white",
  border: "none",
  padding: "8px 16px",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "14px",
  marginRight: "8px",
  transition: "background-color 0.2s",
};

const deleteBtn = {
  background: "#dc2626",
  color: "white",
  border: "none",
  padding: "8px 16px",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "14px",
  transition: "background-color 0.2s",
};

const saveBtn = {
  background: theme.secondary,
  color: "white",
  border: "none",
  padding: "8px 16px",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "14px",
  marginRight: "8px",
  transition: "background-color 0.2s",
};

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

export default NiraManageRecordsPage;