// import { useEffect, useState } from "react";
// import BASE_URL from "../../api";
// import PageLayout from "../../components/PageLayout";
// import { theme } from "../../theme";
// import { useNavigate } from "react-router-dom";

// const maskNIN = (nin) => {
//   if (!nin) return "";
//   const value = String(nin);
//   if (value.length <= 5) return value;
//   const visible = value.slice(-5);
//   const hidden = "*".repeat(value.length - 5);
//   return hidden + visible;
// };

// function BankSearchPage({ embedded }) {
//   const [query, setQuery] = useState("");
//   const [records, setRecords] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const navigate = useNavigate();

//   const fetchData = async (searchTerm = "") => {
//     setLoading(true);
//     try {
//       const response = await fetch(`${BASE_URL}/bank/atm-search/?search=${searchTerm}`);
//       const data = await response.json();
//       setRecords(data);
//       setLoading(false);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData("");
//   }, []);

//   const content = (
//     <div style={container}>
//       <h1 style={{ ...title, color: embedded ? theme.dark : title.color }}>
//         🏦 Search Lost ID Database
//       </h1>
//       <p style={subtitle}>Verify a customer's ID before processing</p>

//       <div style={searchWrapper}>
//         <div style={searchBox}>
//           <span style={searchIcon}>🔍</span>
//           <input
//             type="text"
//             placeholder="Search by name or card number..."
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             style={searchInput}
//           />
//           <button style={searchBtn} onClick={() => fetchData(query)}>
//             Search
//           </button>
//         </div>
//       </div>

//       <div style={resultsContainer}>
//         {loading ? (
//           <p style={infoText}>Loading records...</p>
//         ) : !query ? (
//           <p style={infoText}>Start typing to search...</p>
//         ) : records.length === 0 ? (
//           <p style={infoText}>No results found for "{query}"</p>
//         ) : (
//           records.map((item) => (
//             <div
//               key={item.id}
//               style={{ ...card, cursor: "pointer" }}
//               onClick={() => navigate(`/bank/records/${item.id}`)}
//             >
//               <div style={cardHeader}>
//                 <h3>{item.name}</h3>
//                 <span
//                   style={{
//                     ...statusBadge,
//                     background:
//                       item.status === "Lost" ? theme.primary : theme.secondary,
//                   }}
//                 >
//                   {item.status}
//                 </span>
//               </div>

//               <p><b>ID:</b> {maskNIN(item.id_number)}</p>
//               <p><b>Type:</b> {item.id_type}</p>

//               <p style={{ color: theme.primary, fontWeight: "600", marginTop: "10px" }}>
//                 Click to view full details →
//               </p>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );

//   return embedded ? content : <PageLayout>{content}</PageLayout>;
// }

// /* STYLES — identical to admin SearchPage */
// const searchBox = { display: "flex", alignItems: "center", background: "white", borderRadius: "30px", padding: "8px 12px", boxShadow: "0 6px 20px rgba(0,0,0,0.15)" };
// const searchIcon = { marginRight: "10px", fontSize: "18px", color: "#888" };
// const searchBtn = { background: theme.primary, color: "white", border: "none", padding: "10px 18px", borderRadius: "20px", cursor: "pointer", fontWeight: "600" };
// const container = { width: "100%", maxWidth: "650px", textAlign: "center" };
// const title = { color: "#fff", fontSize: "34px", marginBottom: "5px" };
// const subtitle = { color: "#ccc", marginBottom: "30px" };
// const searchWrapper = { width: "100%", marginBottom: "30px" };
// const searchInput = { width: "100%", padding: "16px 20px", borderRadius: "30px", border: "none", fontSize: "16px", outline: "none", boxShadow: "0 6px 20px rgba(0,0,0,0.15)" };
// const resultsContainer = { width: "100%" };
// const infoText = { color: "#bbb" };
// const card = { background: theme.card, padding: "20px", marginBottom: "15px", borderRadius: "16px", boxShadow: "0 6px 20px rgba(0,0,0,0.1)", textAlign: "left" };
// const cardHeader = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" };
// const statusBadge = { color: "#fff", padding: "5px 12px", borderRadius: "20px", fontSize: "12px" };

// export default BankSearchPage;