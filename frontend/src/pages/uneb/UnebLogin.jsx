import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import PageLayout from "../../components/PageLayout";
import { theme } from "../../theme";

function UnebLogin() {
  const navigate = useNavigate();

  const [staffId, setStaffId] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (!staffId || !password) {
      alert("Fill all fields");
      return;
    }

    alert("UNEB login successful (mock)");
    navigate("/uneb/dashboard");
  };

  return (
    <PageLayout>
      <div style={cardStyle}>
        <h2 style={titleStyle}>UNEB Login</h2>
        <p style={subtitleStyle}>Sign in to access UNEB portal</p>

        <input placeholder="Staff ID"
          value={staffId}
          onChange={(e) => setStaffId(e.target.value)}
          style={inputStyle} />

        <input placeholder="Password" type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle} />

        <button onClick={handleLogin} style={btnStyle}>
          Login
        </button>

        <p style={footerTextStyle}>
          Don’t have an account?{" "}
          <Link to="/uneb/signup" style={linkStyle}>Signup</Link>
        </p>
      </div>
    </PageLayout>
  );
}

/* same styling system */
const cardStyle = {
  background: theme.card,
  padding: "45px",
  borderRadius: "30px",
  width: "100%",
  maxWidth: "420px",
};

const titleStyle = { fontSize: "28px", fontWeight: "800" };
const subtitleStyle = { color: theme.muted, marginBottom: "20px" };

const inputStyle = {
  width: "100%",
  padding: "16px",
  marginBottom: "15px",
  borderRadius: "15px",
  border: "1px solid #ddd",
};

const btnStyle = {
  width: "100%",
  padding: "16px",
  background: theme.primary,
  color: "white",
  border: "none",
  borderRadius: "15px",
  fontWeight: "bold",
};

const footerTextStyle = { marginTop: "20px", color: theme.muted };
const linkStyle = { color: theme.primary };

export default UnebLogin;