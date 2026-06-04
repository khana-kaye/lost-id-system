import { useEffect, useState } from "react";
import BASE_URL from "../api";
import PageLayout from "../components/PageLayout";
import { theme } from "../theme";
import { useNavigate } from "react-router-dom";


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

function SearchPage({ mode, embedded }) {

  const [query, setQuery] = useState("");
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();


  // fetch from backend
  const fetchData = async (searchTerm = "") => {
    try {
      const response = await fetch(`${BASE_URL}/ids/?search=${searchTerm}`);
      const data = await response.json();

      setRecords(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData("");
  }, []);

  // FILTER RESULTS
  // const filteredResults = records.filter((item) => {
  //   const q = query.toLowerCase();

  //   return (
  //     item.name?.toLowerCase().includes(q) ||
  //     item.id_number?.toLowerCase().includes(q) ||
  //     item.status?.toLowerCase().includes(q)
  //   );
  // });


  const content = (
    <div style={container}>
      {/* HEADER */}
      <h1 style={{ ...title, color: embedded ? theme.dark : title.color }}>🔍 Search ID Database</h1>
    <p style={subtitle}>Find lost IDs quickly and securely</p>

    {/* SEARCH BOX */}
    <div style={searchWrapper}>
       <div style={searchBox}>

        {/* ICON */}
          <span style={searchIcon}>🔍</span>


      <input
        type="text"
        placeholder="Search by name or ID number..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={searchInput}
        />

        {/* BUTTON */}
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
        <p style={infoText}>Loading records...</p>
      ) : !query ? (
        <p style={infoText}>Start typing to search...</p>
      ) : records.length === 0 ? (
        <p style={infoText}>No results found for "{query}"</p>
      ) : (
        records.map((item) => (
          <div
            key={item.id}
            style={{
              ...card,
              cursor: "pointer",
            }}
            onClick={() => navigate(`/admin/records/${item.id}`)}
          >
                {/*<h3 style={{ marginBottom: "5px" }}>{item.name}</h3> */}

            <div style={cardHeader}>
                  <h3>{item.name}</h3>
                  <span style={{
                    ...statusBadge,
                    background:
                      item.status === "Lost"
                        ? theme.primary
                        : theme.secondary
                  }}>
                    {item.status}
                  </span>
                </div>

            <p><b>ID:</b> {maskNIN(item.id_number)}</p>
            <p><b>Type:</b> {item.id_type}</p>

            <p
              style={{
                color: theme.primary,
                fontWeight: "600",
                marginTop: "10px",
              }}
            >
              Click to view full details →
            </p>
          </div>
        ))
      )}
    </div>
  </div>
  );

  return embedded ? content : <PageLayout>{content}</PageLayout>;

  
//   return (
//     <div style={container}>

//       <h1 style={{ color: "#0d2b4c" }}>🔍 Search ID Database</h1>

//       {/* SEARCH BOX */}
//         <input
//           type="text"
//           placeholder="Enter Name or ID number..."
//           value={query}
//           onChange={(e) =>{
//             const value = e.target.value;
//             setQuery(value);
//             fetchData(value);
//           }}
//           style={input}
//           />

//       {/* //LOADING
//       // {loading && <p>Loading records...</p>} */}

//       {/* RESULTS */}
//       <div style={{ marginTop: "30px", width: "100%" }}>
//         {loading ? (
//           <p>Loading records...</p>
//         ) : !query ? (
//           <p>Start typing to search records...</p>
//         ) : records.length === 0 ? (
//           <p>No results found for "{query}"</p>
//         ) : (
//           records.map((item) => (
//             <div key={item.id} style={card}>
//               <h3>{item.name}</h3>

//               <p><b>ID:</b> {maskNIN(item.id_number)}</p>
//               <p><b>Type:</b> {item.id_type}</p>
//               <p><b>Status:</b> {item.status}</p>
//               <p><b>Location:</b> {item.location_found}</p>

//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );

}

/* STYLES */

const searchBox = {
  display: "flex",
  alignItems: "center",
  background: "white",
  borderRadius: "30px",
  padding: "8px 12px",
  boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
};

const searchIcon = {
  marginRight: "10px",
  fontSize: "18px",
  color: "#888",
};

const searchBtn = {
  background: theme.primary,
  color: "white",
  border: "none",
  padding: "10px 18px",
  borderRadius: "20px",
  cursor: "pointer",
  fontWeight: "600"
};

const container = {
   width: "100%",
  maxWidth: "650px",
  textAlign: "center",
};

const title = {
  color: "#fff",
  fontSize: "34px",
  marginBottom: "5px",
};

const subtitle = {
  color: "#ccc",
  marginBottom: "30px",
};


const searchWrapper = {
  width: "100%",
  marginBottom: "30px",
};

const searchInput = {
  width: "100%",
  padding: "16px 20px",
  borderRadius: "30px",
  border: "none",
  fontSize: "16px",
  outline: "none",
  boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
};

const resultsContainer = {
  width: "100%",
  
};

const infoText = {
  color: "#bbb",
  
};

const card = {
  background: theme.card,
  padding: "20px",
  marginBottom: "15px",
  borderRadius: "16px",
  boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
  textAlign: "left",
};
// const input = {
//   padding: "12px",
//   width: "300px",
//   border: "1px solid #ccc",
//   borderRadius: "6px",
// };


// const card = {
//   background: "white",
//   padding: "15px",
//   marginBottom: "10px",
//   borderRadius: "8px",
//   boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
// };

const cardHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "10px",
};

const statusBadge = {
  color: "#fff",
  padding: "5px 12px",
  borderRadius: "20px",
  fontSize: "12px",
};

export default SearchPage;