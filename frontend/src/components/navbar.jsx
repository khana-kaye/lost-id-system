import { Link, useNavigate} from "react-router-dom";
import { useState, useEffect, useRef } from "react";


function Navbar() {
  const navigate = useNavigate()
  const [showAdminDropdown, setShowAdminDropdown] = useState(false);
  const dropdownRef = useRef(null);

   const handleSelect = (pathOrAction) => {
    setShowAdminDropdown(false);

    if (pathOrAction === "police") {
      navigate("/admin");
    } else if (pathOrAction === "report") {
      navigate("/report");
    } else if (pathOrAction === "nira") {
    navigate("/nira/login");
    } else if (pathOrAction === "banks") {
      navigate("/banks/login");
    } else {
      navigate("/uneb/login");
    }
  };

  // close dropdown when clicking outside (safe UX, no functionality change)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowAdminDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  return (
    <nav style={navStyle}>

      {/* LEFT: Navigation Arrows + Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        {/* Back Arrow */}
        <button 
          style={arrowStyle}
          onClick={() => navigate(-1)}
          title="Go back"
        >
          ←
        </button>

        {/* Forward Arrow */}
        <button 
          style={arrowStyle}
          onClick={() => navigate(1)}
          title="Go forward"
        >
          →
        </button>

        <div style={logoBox}>🔍</div>

        <span style={titleStyle}>
          Lost ID Tracker
        </span>
      </div>

      {/* CENTER: Links */}
      <div style={{ display: "flex", gap: "30px", color: "orange" }}>
        <Link to="/" style={linkStyle}>Home</Link>
        <Link to="/search" style={linkStyle}>Search IDs</Link>
        <Link to="/report" style={linkStyle}>Report</Link>
      </div>


      {/* RIGHT SIDE */}
      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>

        {/* ADMIN DROPDOWN */}
        <div style={{ position: "relative" }} >
          <button
            style={buttonStyle}
            onClick={() => setShowAdminDropdown(prev => !prev)}
          >
            Admin ▼
          </button>


          {showAdminDropdown && (
            <div style={dropdownMenu}>
              <div style={dropdownItem} onClick={() => handleSelect("police")}>
                Police Portal
              </div>
              <div style={dropdownItem} onClick={() => handleSelect("nira")}>
                NIRA
              </div>
              <div style={dropdownItem} onClick={() => handleSelect("banks")}>
                Banks
              </div>
              <div style={dropdownItem} onClick={() => handleSelect("uneb")}>
                UNEB
                </div>
            </div>
          )}
        </div>





      {/* Emergency Button */}
      <button style={buttonStyle}
      onClick={() => navigate("/report")}>
        Emergency Report
      </button>
      </div>
    </nav>
  );
}

/* STYLES */
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



const navStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "15px 40px",
  background: "#fff",
  borderBottom: "1px solid #eee",
  position: "sticky",   
  top: 0,               
  zIndex: 100, 
};

const logoBox = {
  width: 35,
  height: 35,
  borderRadius: 6,
  background: "#0d2b4c",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#fff",
};

const titleStyle = {
  color: "#0d2b4c",
  fontSize: 18,
  fontWeight: 600,
};

const linkStyle = {
  textDecoration: "none",
  color: "#333",
  fontSize: 15,
  fontWeight: 500,
};

const arrowStyle = {
  background: "transparent",
  border: "none",
  color: "#0d2b4c",
  fontSize: 20,
  cursor: "pointer",
  padding: "0",
  transition: "opacity 0.2s",
};

const buttonStyle = {
  border: "2px solid orange",
  background: "transparent",
  color: "orange",
  padding: "10px 18px",
  borderRadius: 6,
  cursor: "pointer",
  fontWeight: 500,
};

export default Navbar;