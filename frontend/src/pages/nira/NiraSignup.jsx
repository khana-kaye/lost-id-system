import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import PageLayout from "../../components/PageLayout";
import { theme } from "../../theme";


function NiraSignup() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [staffId, setStaffId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = () => {
    if (!username || !staffId || !password || !confirmPassword) {
      alert("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    // backend will come later
    alert("NIRA account created (backend not connected yet)");
    navigate("/nira/login");
  };

  return (
    <PageLayout>
      <div style={cardStyle}>
        <h2 style={titleStyle}>NIRA Staff Signup</h2>
        <p style={subtitleStyle}>Create an account to access the dashboard.</p>

        
    

        <input placeholder="Username" value={username}
            onChange={(e) => setUsername(e.target.value)} style={inputStyle} />

        <input placeholder="Staff ID" value={staffId}
            onChange={(e) => setStaffId(e.target.value)} style={inputStyle} />

        <input placeholder="Password" type="password" value={password}
            onChange={(e) => setPassword(e.target.value)} style={inputStyle} />

        <input placeholder="Confirm Password" type="password" value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)} style={inputStyle} />

        <button onClick={handleSignup} style={btnStyle}>
            Create Account
        </button>

        <p style={footerTextStyle}>
            Already have an account? <Link to="/nira/login" style={linkStyle} >Login</Link>
        </p>
        </div>
      </PageLayout>  
  );
}

const cardStyle = {
  background: theme.card,
  padding: "45px",
  borderRadius: "30px", // Match Screenshot 2026-05-06 024657.png
  width: "100%",
  maxWidth: "420px",
  boxSizing: "border-box",
  boxShadow: "0 15px 35px rgba(0,0,0,0.2)",
  textAlign: "left",
};

const titleStyle = {
  margin: "0 0 10px 0",
  fontSize: "28px",
  fontWeight: "800",
  color: theme.dark,
};

const subtitleStyle = {
  margin: "0 0 30px 0",
  color: theme.muted,
  fontSize: "14px",
};

const inputStyle = {
  display: "block",
  width: "100%",
  boxSizing: "border-box",
  marginBottom: "15px",
  padding: "16px 20px",
  background: theme.inputBg,
  border: `1px solid ${theme.inputBorder}`,
  borderRadius: "15px",
  fontSize: "15px",
  outline: "none",
};

const btnStyle = {
  marginTop: "10px",
  padding: "16px",
  width: "100%",
  background: theme.primary,
  color: "white",
  border: "none",
  borderRadius: "15px",
  fontSize: "16px",
  fontWeight: "bold",
  cursor: "pointer",
  boxShadow: `0 8px 20px rgba(255, 140, 66, 0.35)`,
};

const footerTextStyle = {
  marginTop: "25px",
  fontSize: "14px",
  color: theme.muted,
};

const linkStyle = {
  color: theme.primary,
  textDecoration: "none",
  fontWeight: "bold",
};


export default NiraSignup;