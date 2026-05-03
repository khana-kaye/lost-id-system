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


  return (
  <div style={container}>
    
    {/* HEADER */}
    <h1 style={title}>🔍 Search ID Database</h1>
    <p style={subtitle}>Find lost IDs quickly and securely</p>

    {/* SEARCH BOX */}
    <div style={searchWrapper}>
      <input
        type="text"
        placeholder="Search by name or ID number..."
        value={query}
        onChange={(e) => {
          const value = e.target.value;
          setQuery(value);
          fetchData(value);
        }}
        style={searchInput}
      />
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
          <div key={item.id} style={card}>
            <h3 style={{ marginBottom: "5px" }}>{item.name}</h3>

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
const container = {
  padding: "40px",
  minHeight: "100vh",
  background: "#f4f6f8",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const title = {
  color: "#0d2b4c",
  fontSize: "36px",
  marginBottom: "5px",
};

const subtitle = {
  color: "#666",
  marginBottom: "30px",
};


const searchWrapper = {
  width: "100%",
  maxWidth: "600px",
  marginBottom: "30px",
};

const searchInput = {
  width: "100%",
  padding: "16px 20px",
  borderRadius: "30px",
  border: "1px solid #ddd",
  fontSize: "16px",
  outline: "none",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
};

const resultsContainer = {
  width: "100%",
  maxWidth: "600px",
};

const infoText = {
  color: "#888",
  textAlign: "center",
};

const card = {
  background: "white",
  padding: "15px 20px",
  marginBottom: "15px",
  borderRadius: "10px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  transition: "transform 0.2s ease",
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

export default SearchPage;