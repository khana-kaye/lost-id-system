import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import PageLayout from "../../components/PageLayout";
import { theme } from "../../theme";

function NiraLogin() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (!username || !password) {
      alert("Fill all fields");
      return;
    }

    // backend later
    alert("Login successful (mock)");
    navigate("/nira/dashboard");
  };

  return (
     <PageLayout>
    
   
      <div style={cardStyle}>
        <h2 style={titleStyle}>NIRA Staff Login</h2>
        <p style={subtitleStyle}>Sign in to access your NIRA account.</p>

        <input 
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={inputStyle}
        />

        
          <input 
            placeholder="Password" 
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
          />
        
        

        <button onClick={handleLogin} style={btnStyle}>
          Login
        </button>

        <p style={footerTextStyle}>
          Don’t have an account?{""} <Link to="/nira/signup" style={linkStyle}>Signup</Link>
        </p>
      </div>
    </PageLayout>

  );
}


const cardStyle = {
  background: theme.card,
  padding: "45px",
  borderRadius: "30px",
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
export default NiraLogin;


