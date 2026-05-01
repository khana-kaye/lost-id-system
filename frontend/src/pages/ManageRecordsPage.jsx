import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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

function ManageRecordsPage() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const navigate = useNavigate();



  const fetchRecords = async () => {
    try {
      const res = await fetch(`${BASE_URL}/ids/`);
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

    await fetch(`http://127.0.0.1:8000/api/ids/${id}/`, {
      method: "DELETE",
    });

    fetchRecords(); // refresh
  };


  const handleUpdate = async (id) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/ids/${id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editData),
      });

      if (res.ok) {
        alert("Updated successfully");
        setEditingId(null);
        fetchRecords();
      } else {
        const err = await res.json();
        alert("Update failed: " + JSON.stringify(err));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={container}>
      <h1>🛠 Manage Records</h1>

      {/* SEARCH */}
      <input
        placeholder="Search by name or ID"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={input}
      />

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table style={table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>ID</th>
              <th>Type</th>
              <th>Status</th>
              <th>Location</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((item) => (
              <tr
                key={item.id}
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/admin/records/${item.id}`)}
                //style={{ cursor: "pointer" }}
                >

                {/*name*/}
                <td>
                  {editingId === item.id ? (
                    <input
                      value={editData.name}
                      onChange={(e) =>
                        setEditData({ ...editData, name: e.target.value })
                      }
                    />
                  ) : (
                    item.name
                  )}
                </td>

                {/* ID NUMBER */}
                <td>
                  {editingId === item.id ? (
                    <input
                      value={editData.id_number}
                      onChange={(e) =>
                        setEditData({ ...editData, id_number: e.target.value })
                      }
                    />
                  ) : (
                    maskNIN(item.id_number)
                  )}
                </td>

                {/* TYPE */}
                <td>
                  {editingId === item.id ? (
                    <select
                      value={editData.id_type}
                      onChange={(e) =>
                        setEditData({ ...editData, id_type: e.target.value })
                      }
                    >
                      <option value="National ID">National ID</option>
                      <option value="Driver Permit">Driver Permit</option>
                    </select>
                  ) : (
                    item.id_type
                  )}
                </td>

                {/* STATUS */}
                <td>
                  {editingId === item.id ? (
                    <select
                      value={editData.status}
                      onChange={(e) =>
                        setEditData({ ...editData, status: e.target.value })
                      }
                    >
                      <option value="Lost">Lost</option>
                      <option value="Found">Found</option>
                    </select>
                  ) : (
                    <span style={{ color: item.status === "Found" ? "green" : "red" }}>
                      {item.status}
                    </span>
                  )}
                </td>

                {/* LOCATION */}
                <td>
                  {editingId === item.id ? (
                    <input
                      value={editData.location_found}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          location_found: e.target.value,
                        })
                      }
                    />
                  ) : (
                    item.location_found
                  )}
                </td>

                {/* ACTIONS */}
                <td>
                  {editingId === item.id ? (
                    <>
                      <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUpdate(item.id);
                      }}>
                        Save
                      </button>
                      <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingId(null);
                      }}>
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={(e) => {
                            e.stopPropagation();
                          setEditingId(item.id);
                          setEditData(item);
                        }}
                        style={editBtn}
                      >
                        Edit
                      </button>

                      {/* <button
                        onClick={() => handleDelete(item.id)}
                        style={deleteBtn}
                      >
                        Delete
                      </button> */}

                      <button
                        onClick={(e) => {
                            e.stopPropagation(); //  stop row click
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
      )}
    </div>
  );
}




/* styles */
const container = { padding: "40px", background: "#f4f6f8", minHeight: "100vh" };
const input = { padding: "10px", marginBottom: "20px", width: "300px" };

const table = {
  width: "100%",
  background: "white",
  borderCollapse: "collapse",
};

const editBtn = { marginRight: "10px", background: "blue", color: "white" };
const deleteBtn = { background: "red", color: "white" };

export default ManageRecordsPage;