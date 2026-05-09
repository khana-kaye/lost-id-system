import { useState } from "react";
import { useNavigate } from "react-router-dom";
import homeImage from "../assets/home.jpeg";

function Landingpage() {
  const [showPortalDropdown, setShowPortalDropdown] = useState(false);
  const navigate = useNavigate();

  const handlePortalSelect = (portal) => {
    setShowPortalDropdown(false);
    if (portal === "police") {
      navigate("/admin");
    } else if (portal === "nira") {
    navigate("/nira");
    } else {
    alert(`${portal.toUpperCase()} portal coming soon!`);
  }
};
      
  return (
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
      {/* LEFT SIDE */}
      <div style={{ maxWidth: "520px", color: "white", position: "relative", zIndex: 1 }}>
        {/* BIG TITLE */}
        <h1
          style={{
            fontSize: 50,
            fontWeight: 700,
            marginBottom: 20,
          }}
        >
          TRACK YOUR LOST ID
        </h1>

        {/* DESCRIPTION */}
        <p
          style={{
            fontSize: 18,
            lineHeight: 1.6,
            marginBottom: 25,
            color: "#eee",
          }}
        >
          Securely search our verified database to locate your lost driver's permit or National ID.
          Report found documents and help reconnect people with their identity.
        </p>

        {/* BUTTONS */}
        <div style={{ display: "flex", gap: 15, flexWrap: "wrap", alignItems: "flex-start" }}>
          <button style={primaryBtn} onClick={() => navigate("/search")}>
            Search Database
          </button>

          <button style={secondaryBtn} onClick={() => navigate("/report")}>
            Report Found ID
          </button>

          {/* ADMIN DROPDOWN */}
          <div style={{ position: "relative" }}>
            <button
              style={outlineBtn}
              onClick={() => setShowPortalDropdown((prev) => !prev)}
            >
              Admin ▼
            </button>

            {showPortalDropdown && (
              <div style={dropdownMenu}>
                <div
                  style={dropdownItem}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#f5f5f5")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
                  onClick={() => handlePortalSelect("police")}
                >
                  Police Portal
                </div>
                <div
                  style={dropdownItem}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#f5f5f5")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
                  onClick={() => handlePortalSelect("nira")}
                >
                  NIRA
                </div>
                <div
                  style={dropdownItem}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#f5f5f5")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
                  onClick={() => handlePortalSelect("banks")}
                >
                  Banks
                </div>
                <div
                  style={dropdownItem}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#f5f5f5")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
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
  transition: "background-color 0.2s",
  borderBottom: "1px solid #eee",
};

export default Landingpage;
