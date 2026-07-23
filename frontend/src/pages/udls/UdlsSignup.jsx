import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import PageLayout from "../../components/PageLayout";
import { theme } from "../../theme";
import BASE_URL from "../../api";

function UdlsSignup() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [staffId, setStaffId] = useState("");
  const [email, setEmail] = useState("");
  const [staffRole, setStaffRole] = useState(""); // UNIQUE UDLS     FIELD
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = async () => {
    if (!username || !staffId || !staffRole || !password || !confirmPassword) {
      alert("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
    const res = await fetch(`${BASE_URL}/udls/signup/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        staff_id: staffId,
        email,
        staff_role: staffRole,
        password,
      }),
    });


     const data = await res.json();

    if (res.ok) {
      // alert(data.message || "UDLS account created");
      navigate("/udls/dashboard");
    } else {
      console.log(data.message || "Signup failed");
    }

  } catch (error) {
    console.error("UDLS  SIGNUP ERROR:", error);
    // alert("Server error");
  }
};

  return (
    <PageLayout>
      <div style={cardStyle}>
        <h2 style={titleStyle}>UDLS Staff Signup</h2>
        <p style={subtitleStyle}>Create a UDLS staff account</p>

        <input placeholder="Username" value={username}
          onChange={(e) => setUsername(e.target.value)} style={inputStyle} />

        <input placeholder="Staff ID" value={staffId}
          onChange={(e) => setStaffId(e.target.value)} style={inputStyle} />

        <input placeholder="Staff Role (e.g staff, Supervisor)"
          value={staffRole}
          onChange={(e) => setStaffRole(e.target.value)}
          style={inputStyle} />

        <input placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle} />
        

        <input placeholder="Password" type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)} style={inputStyle} />

        <input placeholder="Confirm Password" type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)} style={inputStyle} />

        <button onClick={handleSignup} style={btnStyle}>
          Create Account
        </button>

        <p style={footerTextStyle}>
          Already have an account?{" "}
          <Link to="/udls/login" style={linkStyle}>Login</Link>
        </p>
      </div>
    </PageLayout>
  );
}

/* styles (same design system) */
const cardStyle = {
  background: theme.card,
  padding: "45px",
  borderRadius: "30px",
  width: "100%",
  maxWidth: "420px",
  textAlign: "left",
};

const titleStyle = { fontSize: "28px", fontWeight: "800", marginBottom: "10px" };
const subtitleStyle = { color: theme.muted, marginBottom: "25px" };

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
const linkStyle = { color: theme.primary, textDecoration: "none" };

export default UdlsSignup;