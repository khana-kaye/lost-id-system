

// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import homeImage from "../assets/home.jpeg";

// function Landingpage() {
//   const [showPortalDropdown, setShowPortalDropdown] = useState(false);
//   const [showReportDropdown, setShowReportDropdown] = useState(false);
//   const navigate = useNavigate();

//   const handlePortalSelect = (portal) => {
//     setShowPortalDropdown(false);
//     if (portal === "police") {
//       navigate("/login");
//     } else if (portal === "nira") {
//       navigate("/nira");
//      } else if (portal === "udls") {
//     navigate("/udls");
//   } else if (portal === "banks") {
//     navigate("/bank-login");
//     } else {
//       alert(`${portal.toUpperCase()} portal coming soon!`);
//     }
//   };

//   const handleReportSelect = (type) => {
//     setShowReportDropdown(false);
//     if (type === "id") {
//       navigate("/report");
//     } else if (type === "atm") {
//       navigate("/report-atm");
//     } else if (type === "permit") {
//       navigate("/report-permit");  // create this route when ready
//     }
//   };

//   return (
//     <div
//       style={{
//         background: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${homeImage})`,
//         minHeight: "100vh",
//         display: "flex",
//         flexDirection: "row",
//         alignItems: "center",
//         justifyContent: "center",
//         padding: "60px",
//         backgroundSize: "cover",
//         backgroundPosition: "center",
//         position: "relative",
//       }}
//     >
//       {/* LEFT SIDE */}
//       <div style={{ maxWidth: "520px", color: "white", position: "relative", zIndex: 1 }}>
//         <h1 style={{ fontSize: 50, fontWeight: 700, marginBottom: 20 }}>
//           LOST YOUR ID, ATM CARD OR DRIVER'S PERMIT?
//         </h1>
//         <p style={{ fontSize: 18, lineHeight: 1.6, marginBottom: 25, color: "#eee" }}>
//           Securely search our verified database to locate your lost documents.
//           Report found documents and help reconnect people with their identity.
//         </p>

//         <div style={{ display: "flex", gap: 15, flexWrap: "wrap", alignItems: "flex-start" }}>
//           {/* SEARCH BUTTON */}
//           <button style={primaryBtn} onClick={() => navigate("/search")}>
//             Search Database
//           </button>

//           {/* REPORT FOUND DOCUMENTS DROPDOWN */}
//           <div style={{ position: "relative" }}>
//             <button
//               style={secondaryBtn}
//               onClick={() => {
//                 setShowReportDropdown((prev) => !prev);
//                 setShowPortalDropdown(false); // close other dropdown
//               }}
//             >
//               Report Found Documents ▼
//             </button>

//             {showReportDropdown && (
//               <div style={dropdownMenu}>
//                 <div
//                   style={dropdownItem}
//                   onMouseEnter={(e) => (e.currentTarget.style.background = "#f5f5f5")}
//                   onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
//                   onClick={() => handleReportSelect("id")}
//                 >
//                   🪪 National ID
//                 </div>
//                 <div
//                   style={dropdownItem}
//                   onMouseEnter={(e) => (e.currentTarget.style.background = "#f5f5f5")}
//                   onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
//                   onClick={() => handleReportSelect("atm")}
//                 >
//                   💳 ATM Card
//                 </div>
//                 <div
//                   style={{ ...dropdownItem, borderBottom: "none" }}
//                   onMouseEnter={(e) => (e.currentTarget.style.background = "#f5f5f5")}
//                   onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
//                   onClick={() => handleReportSelect("permit")}
//                 >
//                   🚗 Driver's Permit
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* ADMIN DROPDOWN */}
//           <div style={{ position: "relative" }}>
//             <button
//               style={outlineBtn}
//               onClick={() => {
//                 setShowPortalDropdown((prev) => !prev);
//                 setShowReportDropdown(false); // close other dropdown
//               }}
//             >
//               Admin ▼
//             </button>

//             {showPortalDropdown && (
//               <div style={dropdownMenu}>
//                 {[
//                   { label: "Police Portal", key: "police" },
//                   { label: "NIRA",          key: "nira"   },
//                   { label: "Banks",         key: "banks"  },
//                   { label: "UDLS",          key: "udls"   },
//                 ].map(({ label, key }, i, arr) => (
//                   <div
//                     key={key}
//                     style={{ ...dropdownItem, borderBottom: i === arr.length - 1 ? "none" : "1px solid #eee" }}
//                     onMouseEnter={(e) => (e.currentTarget.style.background = "#f5f5f5")}
//                     onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
//                     onClick={() => handlePortalSelect(key)}
//                   >
//                     {label}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* BUTTON STYLES */
// const primaryBtn = {
//   background: "#ff8c42",
//   color: "#fff",
//   border: "none",
//   padding: "12px 22px",
//   borderRadius: 6,
//   cursor: "pointer",
//   fontWeight: 600,
// };
// const secondaryBtn = {
//   background: "#1f2d3d",
//   color: "#fff",
//   border: "none",
//   padding: "12px 22px",
//   borderRadius: 6,
//   cursor: "pointer",
//   fontWeight: 600,
// };
// const outlineBtn = {
//   border: "2px solid orange",
//   background: "transparent",
//   padding: "12px 22px",
//   borderRadius: 6,
//   cursor: "pointer",
//   fontWeight: 600,
//   color: "white",
// };
// const dropdownMenu = {
//   position: "absolute",
//   top: "100%",
//   left: 0,
//   marginTop: "8px",
//   background: "white",
//   border: "1px solid #ddd",
//   borderRadius: 6,
//   boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
//   minWidth: "180px",
//   zIndex: 9999,
// };
// const dropdownItem = {
//   padding: "12px 16px",
//   cursor: "pointer",
//   color: "#333",
//   fontSize: "14px",
//   transition: "background-color 0.2s",
//   borderBottom: "1px solid #eee",
// };

// export default Landingpage;



import { useState } from "react";
import { useNavigate } from "react-router-dom";
import homeImage from "../assets/home.jpeg";

function Landingpage() {
  const [showPortalDropdown, setShowPortalDropdown] = useState(false);
  const [showReportDropdown, setShowReportDropdown] = useState(false);
  const navigate = useNavigate();

  const handlePortalSelect = (portal) => {
    setShowPortalDropdown(false);
    if (portal === "police") {
      navigate("/login");
    } else if (portal === "nira") {
      navigate("/nira");
    } else if (portal === "udls") {
      navigate("/udls");
    } else if (portal === "banks") {
      navigate("/bank-login");
    } else {
      alert(`${portal.toUpperCase()} portal coming soon!`);
    }
  };

  const handleReportSelect = (type) => {
    setShowReportDropdown(false);
    if (type === "id") {
      navigate("/report");
    } else if (type === "atm") {
      navigate("/report-atm");
    } else if (type === "permit") {
      navigate("/report-permit");
    }
  };

  return (
    <div>
      {/* HERO SECTION */}
      <div
        style={{
          background: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${homeImage})`,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px",
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
        }}
      >
        <div style={{ maxWidth: "520px", color: "white", zIndex: 1 }}>
          <h1 style={{ fontSize: 50, fontWeight: 700, marginBottom: 20 }}>
            LOST YOUR ID, ATM CARD OR DRIVER'S PERMIT?
          </h1>

          <p style={{ fontSize: 18, lineHeight: 1.6, marginBottom: 25, color: "#eee" }}>
            Securely search our verified database to locate your lost documents.
            Report found documents and help reconnect people with their identity.
          </p>

          <div style={{ display: "flex", gap: 15, flexWrap: "wrap" }}>
            {/* SEARCH */}
            <button style={primaryBtn} onClick={() => navigate("/search")}>
              Search Database
            </button>

            {/* REPORT DROPDOWN */}
            <div style={{ position: "relative" }}>
              <button
                style={secondaryBtn}
                onClick={() => {
                  setShowReportDropdown((prev) => !prev);
                  setShowPortalDropdown(false);
                }}
              >
                Report Found Documents ▼
              </button>

              {showReportDropdown && (
                <div style={dropdownMenu}>
                  <div style={dropdownItem} onClick={() => handleReportSelect("id")}>
                    🪪 National ID
                  </div>
                  <div style={dropdownItem} onClick={() => handleReportSelect("atm")}>
                    💳 ATM Card
                  </div>
                  <div
                    style={{ ...dropdownItem, borderBottom: "none" }}
                    onClick={() => handleReportSelect("permit")}
                  >
                    🚗 Driver's Permit
                  </div>
                </div>
              )}
            </div>

            {/* ADMIN DROPDOWN */}
            <div style={{ position: "relative" }}>
              <button
                style={outlineBtn}
                onClick={() => {
                  setShowPortalDropdown((prev) => !prev);
                  setShowReportDropdown(false);
                }}
              >
                Admin ▼
              </button>

              {showPortalDropdown && (
                <div style={dropdownMenu}>
                  {[
                    { label: "Police Portal", key: "police" },
                    { label: "NIRA", key: "nira" },
                    { label: "Banks", key: "banks" },
                    { label: "UDLS", key: "udls" },
                  ].map(({ label, key }, i, arr) => (
                    <div
                      key={key}
                      style={{
                        ...dropdownItem,
                        borderBottom:
                          i === arr.length - 1 ? "none" : "1px solid #eee",
                      }}
                      onClick={() => handlePortalSelect(key)}
                    >
                      {label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div
        style={{
          padding: "80px 40px",
          background: "#d3c898",
          textAlign: "center",
        }}
      >
        <h2 style={{ fontSize: 32, marginBottom: 40 }}>How It Works</h2>
        <p style={{fontsize: 10,}}>Back2Owner elps reunite lost documents with their rightful owners through a secure four-step verification process </p>
        
        

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "30px",
            flexWrap: "wrap",
          }}
        >
          <div style={stepCard}>
            <h3>Step 1: 🔍 Search</h3>
            <p>Check if your lost document has already been found.</p>
            
          </div>

          <div style={stepCard}>
            <h3>Step 2: 📢 Report</h3>
            <p>Upload any document you find to help the rightful owner.</p>
          </div>

          <div style={stepCard}>
            <h3>Step 3: 🔐 Verify</h3>
            <p>Authorities review submissions to ensure authenticity.</p>
          </div>

          <div style={stepCard}>
            <h3>Step 4: 🤝 Reconnect</h3>
            <p>Documents are returned Safely</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* BUTTONS */
const primaryBtn = {
  background: "#ff8c42",
  color: "#fff",
  border: "none",
  padding: "12px 22px",
  borderRadius: 6,
  cursor: "pointer",
  fontWeight: 600,
};

const secondaryBtn = {
  background: "#1f2d3d",
  color: "#fff",
  border: "none",
  padding: "12px 22px",
  borderRadius: 6,
  cursor: "pointer",
  fontWeight: 600,
};

const outlineBtn = {
  border: "2px solid orange",
  background: "transparent",
  padding: "12px 22px",
  borderRadius: 6,
  cursor: "pointer",
  fontWeight: 600,
  color: "white",
};

const dropdownMenu = {
  position: "absolute",
  top: "100%",
  left: 0,
  marginTop: "8px",
  background: "white",
  border: "1px solid #ddd",
  borderRadius: 6,
  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  minWidth: "180px",
  zIndex: 9999,
};

const dropdownItem = {
  padding: "12px 16px",
  cursor: "pointer",
  color: "#333",
  fontSize: "14px",
  borderBottom: "1px solid #eee",
};

/* STEP CARDS */
const stepCard = {
  background: "#fff",
  padding: "25px",
  borderRadius: "10px",
  width: "250px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
};

export default Landingpage;