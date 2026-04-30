import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";


function AdminPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  

  //not logged in view
  if (!user) {
    return (
      <div style={container}>
        <h2>🔐 Access Denied</h2>
        <p>You are not authorized to access the police portal.</p>

        <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
          <button onClick={() => navigate("/")} >
            Go to Home
          </button>

          <button
              style={{ ...button, background: "green" }}
              onClick={() => navigate("/login")}
            >
              Officer Login
            </button>
        </div>
      </div>
    );
  }
  //logged in view(full dashboard)
  return (

    <div
      style={{
        minHeight: "100vh",
        background: "#f4f6f8",
        padding: "40px",
        fontFamily: "Arial",
      }}
    >
      {/* HEADER */}
      <h1 style={{ color: "#0d2b4c", marginBottom: "10px" }}>
        Officer / Admin Portal
      </h1>

      <p style={{ color: "#555", marginBottom: "30px" }}>
        Manage lost and found ID records securely.
      </p>

      {/* DASHBOARD CARDS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
        }}
      >
        {/* Add Found ID */}
        <div style={cardStyle}>
          <h3>➕ Add Found ID</h3>
          <p>Register a newly found National ID or Driver's Permit.</p>
          <button style={buttonStyle}
          onClick={() => navigate("/admin/add")}>
            Open
          </button>
        </div>

        {/* Search Database */}
        <div style={cardStyle}>
          <h3>🔍 Search Database</h3>
          <p>Search lost or found IDs using name or ID number.</p>
          <button style={buttonStyle}
          onClick={() => navigate("/admin/search")}>
            Open
          </button>
        </div>

        {/* View Reports */}
        <div style={cardStyle}>
          <h3>📄 View Reports</h3>
          <p>See all submitted lost and found reports.</p>
          <button style={buttonStyle}
          onClick={() => navigate("/admin/reports")}>
            Open
          </button>
        </div>

        {/* Manage Records */}
        <div style={cardStyle}>
          <h3>🛠 Manage Records</h3>
          <p>Edit or delete incorrect or outdated entries.</p>
          <button style={buttonStyle}
          onClick={() => navigate("/admin/manage")}>
            Open
          </button>
        </div>
      </div>
    </div>
  );
}

//not logged in styles
const container = {
  height: "100vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
};

const button = {
  marginTop: "10px",
  padding: "10px 20px",
  background: "blue",
  color: "white",
  border: "none",
  cursor: "pointer",
};

/* dashboard*/
const cardStyle = {
  background: "white",
  padding: "20px",
  borderRadius: "10px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
};

const buttonStyle = {
  marginTop: "10px",
  padding: "10px 15px",
  border: "none",
  background: "#0d6efd",
  color: "white",
  borderRadius: "6px",
  cursor: "pointer",
};



export default AdminPage;