// function Landingpage() {
//   return (
//     <div style={{
//         background: 'white',
//       minHeight: '100vh',
//       display: 'flex', flexDirection: 'column',
//       alignItems: 'center', justifyContent: 'center',
//       padding: '60px 24px 80px'
//     }}>
//       {/* Title */}
//       <h1 style={{ color: '#000', fontSize: 48, fontWeight: 700, textAlign: 'center', marginBottom: 20 }}>
//         Track Your Lost ID
//       </h1>

//       {/* Subtitle */}
//       <h2 style={{ color: '#666', fontSize: 24, fontWeight: 400, textAlign: 'center', marginBottom: 30 }}>
//         Lost ID and Driver's Permit Tracking System
//       </h2>

//       {/* Description */}
//       <p style={{
//         color: '#333', fontSize: 18,
//         textAlign: 'center', maxWidth: 600, lineHeight: 1.6, marginBottom: 40
//       }}>
//         Our comprehensive system helps you locate lost National IDs and Driver's Permits.
//         Whether you've misplaced your identification or found someone else's documents,
//         our database allows you to search, report, and recover important identification documents
//         quickly and securely. Officers can also manage entries and updates through our secure portal.
//       </p>

//       {/* Buttons */}
//       <div style={{ display: 'flex', gap: 20 }}>
//         <button
//           style={{
//             background: '#3a5fd9', color: '#fff', border: 'none',
//             padding: '15px 30px', borderRadius: 8,
//             fontSize: 18, fontWeight: 600, cursor: 'pointer',
//             transition: 'background-color 0.3s'
//           }}
//           onMouseOver={(e) => e.target.style.backgroundColor = '#2c4aa0'}
//           onMouseOut={(e) => e.target.style.backgroundColor = '#3a5fd9'}
//         >
//           Search Database
//         </button>
//         <button
//           style={{
//             background: '#28a745', color: '#fff', border: 'none',
//             padding: '15px 30px', borderRadius: 8,
//             fontSize: 18, fontWeight: 600, cursor: 'pointer',
//             transition: 'background-color 0.3s'
//           }}
//           onMouseOver={(e) => e.target.style.backgroundColor = '#1e7e34'}
//           onMouseOut={(e) => e.target.style.backgroundColor = '#28a745'}
//         >
//           Officer Entry
//         </button>
//       </div>
//     </div>
//   );
// }

// export default Landingpage;

//import { useState } from "react";
import { useState, useEffect, useRef  } from "react";
import { useNavigate } from "react-router-dom";
import homeImage from "../assets/home.jpeg";

function Landingpage() {
  const [showPortalDropdown, setShowPortalDropdown] = useState(false);
  const dropdownRef = useRef(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowPortalDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handlePortalSelect = (portal) => {
    setShowPortalDropdown(false);
    if (portal === "police") {
      navigate("/admin");
    } else {
      alert(`${portal.toUpperCase()} portal coming soon!`);
    }
  };


  return (





    <div style={{
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

      

      {/* LEFT SIDE */}
      <div style={{ maxWidth: '520px' , color: "white", position: 'relative', zIndex: 1 }}>
        {/* BIG TITLE */}
        <h1 style={{
          fontSize: 50,
          fontWeight: 700,
          marginBottom: 20
        }}>
          TRACK YOUR LOST ID
        </h1>

        {/* DESCRIPTION */}
        <p style={{
          fontSize: 18,
          lineHeight: 1.6,
          marginBottom: 25,
          color: "#eee"
        }}>
          Securely search our verified database to locate your lost driver's permit
          or National ID. Report found documents and help reconnect people with their identity.
        </p>

        {/* ACTION BOX */}
        {/* <div style={{
          marginTop: 20,
          padding: 20,
          background: "rgba(255,255,255,0.1)",
          borderRadius: 10,
          backdropFilter: "blur(6px)"
        }}></div> */}

        {/* 🔍 SEARCH INPUT */}
        {/* <input
            type="text"
            placeholder="Enter ID Number or Name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "14px",
              marginBottom: 20,
              borderRadius: 6,
              border: "none",
              fontSize: 16,
              outline: "none"
            }}
          /> */}
        

        {/* BUTTONS */}
        <div style={{ display: 'flex', gap: 15, flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <button style={primaryBtn} onClick={() => navigate("/search")}>
            Search Database
          </button>

          <button style={secondaryBtn} onClick={() => navigate("/report")}>
            Report Found ID
          </button>

          {/* ADMIN DROPDOWN */}
          <div style={{ position: 'relative' }} ref={dropdownRef}>
            <button 
              style={outlineBtn}
              onClick={() => setShowPortalDropdown(prev => !prev)}
            >
              Admin ▼
            </button>

            {showPortalDropdown && (
              <div style={dropdownMenu}>
                <div 
                  style={dropdownItem}
                  onMouseEnter={e => e.currentTarget.style.background = '#f5f5f5'}
                  onMouseLeave={e => e.currentTarget.style.background = 'white'}
                  onClick={() => handlePortalSelect("police")}
                >
                  Police Portal
                </div>
                <div 
                  style={dropdownItem}
                  onMouseEnter={e => e.currentTarget.style.background = '#f5f5f5'}
                  onMouseLeave={e => e.currentTarget.style.background = 'white'}
                  onClick={() => handlePortalSelect("nira")}
                >
                  NIRA
                </div>
                <div 
                  style={dropdownItem}
                  onMouseEnter={e => e.currentTarget.style.background = '#f5f5f5'}
                  onMouseLeave={e => e.currentTarget.style.background = 'white'}
                  onClick={() => handlePortalSelect("banks")}
                >
                  Banks
                </div>
                <div 
                  style={dropdownItem}
                  onMouseEnter={e => e.currentTarget.style.background = '#f5f5f5'}
                  onMouseLeave={e => e.currentTarget.style.background = 'white'}
                  onClick={() => handlePortalSelect("uneb")}
                >
                  UNEB
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      
    

    </div>
  );
}


/* BUTTON STYLES */
const primaryBtn = {
  background: '#ff8c42',
  color: '#fff',
  border: 'none',
  padding: '12px 22px',
  borderRadius: 6,
  cursor: 'pointer',
  fontWeight: 600
};

const secondaryBtn = {
  background: '#1f2d3d',
  color: '#fff',
  border: 'none',
  padding: '12px 22px',
  borderRadius: 6,
  cursor: 'pointer',
  fontWeight: 600
};

const outlineBtn = {
  border: '2px solid orange',
  background: 'transparent',
  padding: '12px 22px',
  borderRadius: 6,
  cursor: 'pointer',
  fontWeight: 600,
  color: 'white'
};

const dropdownMenu = {
  position: 'absolute',
  top: '100%',
  left: 0,
  marginTop: '8px',
  background: 'white',
  border: '1px solid #ddd',
  borderRadius: 6,
  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  minWidth: '180px',
  //zIndex: 1000
  zIndex: 9999,
};

const dropdownItem = {
  padding: '12px 16px',
  cursor: 'pointer',
  color: '#333',
  fontSize: '14px',
  transition: 'background-color 0.2s',
  borderBottom: '1px solid #eee'
};

export default Landingpage;