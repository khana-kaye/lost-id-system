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

function SearchPage({ mode }) {

  const [query, setQuery] = useState("");
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);


  // fetch from backend
  const fetchData = async () => {
    try {
      const response = await fetch(`${BASE_URL}/ids/`);
      const data = await response.json();

      setRecords(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // FILTER RESULTS
  const filteredResults = records.filter((item) => {
    return (
      item.name?.toLowerCase().includes(query.toLowerCase()) ||
      item.id_number?.toLowerCase().includes(query.toLowerCase())
    );
  });

  
  return (
    <div style={container}>
      <h1 style={{ color: "#0d2b4c" }}>🔍 Search ID Database</h1>

      {/* SEARCH BOX */}
        <input
          type="text"
          placeholder="Enter Name or ID number..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={input}
        />

      {/* LOADING */}
      {loading && <p>Loading records...</p>}

      {/* RESULTS */}
      <div style={{ marginTop: "30px", width: "100%" }}>
        {!loading && filteredResults.length === 0 ? (
          <p>No results found</p>
        ) : (
          filteredResults.map((item) => (
            <div key={item.id} style={card}>
              <h3>{item.name}</h3>

              <p><b>ID:</b> {maskNIN(item.id_number)}</p>
              <p><b>Type:</b> {item.id_type}</p>
              <p><b>Status:</b> {item.status}</p>
              <p><b>Location:</b> {item.location_found}</p>

            </div>
          ))
        )}
      </div>
    </div>
  );

}

/* STYLES */
const container = {
  padding: "40px",
  minHeight: "100vh",
  background: "#f4f6f8",
};

const searchBox = {
  display: "flex",
  gap: "10px",
  marginTop: "20px",
};

const input = {
  padding: "12px",
  width: "300px",
  border: "1px solid #ccc",
  borderRadius: "6px",
};

const button = {
  padding: "12px 20px",
  background: "#0d6efd",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};

const card = {
  background: "white",
  padding: "15px",
  marginBottom: "10px",
  borderRadius: "8px",
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
};

export default SearchPage;