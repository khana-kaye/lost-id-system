import { useEffect, useState } from "react";
import BASE_URL from "../../api";
import PageLayout from "../../components/PageLayout";
import { theme } from "../../theme";

const maskNIN = (nin) => {
  if (!nin) return "";
  const value = String(nin);

  if (value.length <= 5) return value;

  return "*".repeat(value.length - 5) + value.slice(-5);
};

function NiraSearchPage({ embedded }) {
  const [query, setQuery] = useState("");
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async (searchTerm = "") => {
    try {
      const response = await fetch(
        `${BASE_URL}/ids/?search=${searchTerm}`
      );
      const data = await response.json();

      setRecords(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching NIRA records:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData("");
  }, []);

  const content = (
    <div style={container}>
      {/* HEADER */}
      <h1 style={{ ...title, color: embedded ? theme.dark : title.color }}>
        🔍 NIRA ID Search
      </h1>
      <p style={subtitle}>Search national identity records in the NIRA database</p>

      {/* SEARCH */}
      <div style={searchWrapper}>
        <div style={searchBox}>
          <span style={searchIcon}>🔎</span>

          <input
            type="text"
            placeholder="Search by name or NIN..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={searchInput}
          />

          <button
            style={searchBtn}
            onClick={() => fetchData(query)}
          >
            Search
          </button>
        </div>
      </div>

      {/* RESULTS */}
      <div style={resultsContainer}>
        {loading ? (
          <p style={infoText}>Loading NIRA records...</p>
        ) : !query ? (
          <p style={infoText}>Enter a name or NIN to search</p>
        ) : records.length === 0 ? (
          <p style={infoText}>No records found for "{query}"</p>
        ) : (
          records.map((item) => (
            <div key={item.id} style={card}>
              <div style={cardHeader}>
                <h3>{item.name}</h3>
                <span style={statusBadge}>{item.status}</span>
              </div>

              <p><b>NIN:</b> {maskNIN(item.id_number)}</p>
              <p><b>Type:</b> {item.id_type}</p>
              <p><b>Status:</b> {item.status}</p>
              <p><b>Location:</b> {item.location_found}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );

  return embedded ? content : <PageLayout>{content}</PageLayout>;
}

/* styles */
const container = { width: "100%", maxWidth: "650px", textAlign: "center" };

const title = { fontSize: "34px", marginBottom: "5px" };

const subtitle = { color: "#666", marginBottom: "30px" };

const searchWrapper = { width: "100%", marginBottom: "30px" };

const searchBox = {
  display: "flex",
  alignItems: "center",
  background: "white",
  borderRadius: "30px",
  padding: "8px 12px",
  boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
};

const searchIcon = { marginRight: "10px", fontSize: "18px" };

const searchInput = {
  flex: 1,
  padding: "12px",
  border: "none",
  outline: "none",
  fontSize: "16px",
};

const searchBtn = {
  background: theme.primary,
  color: "white",
  border: "none",
  padding: "10px 18px",
  borderRadius: "20px",
  cursor: "pointer",
};

const resultsContainer = { width: "100%" };

const infoText = { color: "#888" };

const card = {
  background: theme.card,
  padding: "20px",
  marginBottom: "15px",
  borderRadius: "16px",
  textAlign: "left",
};

const cardHeader = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "10px",
};

const statusBadge = {
  background: theme.primary,
  color: "#fff",
  padding: "5px 10px",
  borderRadius: "20px",
  fontSize: "12px",
};

export default NiraSearchPage;