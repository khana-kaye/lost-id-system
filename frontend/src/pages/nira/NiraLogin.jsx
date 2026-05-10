import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import PageLayout from "../../components/PageLayout";
import { theme } from "../../theme";
import { useAuth } from "../../context/AuthContext";

function NiraLogin() {



  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username || !password) {
      setErrorMessage("Please enter both username and password.");
      return;
    }

    setErrorMessage("");
    setLoading(true);
    
    try {
      const result = await login(username, password);

      if (result.success) {
        navigate("/admin/forward");
      } else {
        setErrorMessage(result.message || "Invalid credentials. Please try again.");
      }
    } catch (error) {
      console.error("Login failed:", error);
      setErrorMessage("Login failed. Please make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
     <PageLayout>
      <div style={container}>
        <div style={card}>
          <h2 style={title}>NIRA Staff Login</h2>
          <p style={subtitle}>Sign in to access your NIRA account.</p>

          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={input}
          />

          <div style={passwordWrapper}>
            <input
              placeholder="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={input}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              style={eyeButton}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {errorMessage && <p style={errorText}>{errorMessage}</p>}

          <button onClick={handleLogin} style={button} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          <p style={signupText}>
            Don't have an account? <Link to="/admin/signup" style={signupLink}>Sign up</Link>
          </p>
        </div>
      </div>
    </PageLayout>
  );
}

const container = {
  width: "100%",
  maxWidth: "420px",
  margin: "0 auto",
  padding: "24px",
};

const card = {
  background: theme.card,
  padding: "32px",
  borderRadius: "24px",
  boxShadow: "0 20px 50px rgba(0, 0, 0, 0.1)",
  border: `1px solid rgba(255, 255, 255, 0.15)`,
  width: "100%",
};

const title = {
  margin: 0,
  marginBottom: "8px",
  fontSize: "28px",
  color: theme.dark,
};

const subtitle = {
  margin: 0,
  marginBottom: "24px",
  color: "#6b7280",
};

const input = {
  width: "100%",
  padding: "14px 16px",
  marginBottom: "16px",
  borderRadius: "16px",
  border: "1px solid #e5e7eb",
  outline: "none",
  fontSize: "15px",
  boxShadow: "0 10px 20px rgba(0,0,0,0.05)",
};

const button = {
  width: "100%",
  padding: "14px 16px",
  background: theme.primary,
  color: "white",
  border: "none",
  borderRadius: "16px",
  cursor: "pointer",
  fontWeight: "700",
  fontSize: "16px",
  boxShadow: "0 12px 30px rgba(255, 140, 66, 0.25)",
};

const passwordWrapper = {
  position: "relative",
  width: "100%",
};

const eyeButton = {
  position: "absolute",
  right: "16px",
  top: "50%",
  transform: "translateY(-50%)",
  background: "transparent",
  border: "none",
  color: "#6b7280",
  cursor: "pointer",
  fontSize: "14px",
};

const errorText = {
  color: "#dc2626",
  marginBottom: "18px",
  fontSize: "14px",
};

const signupText = {
  marginTop: "18px",
  fontSize: "14px",
  color: "#6b7280",
};

const signupLink = {
  color: theme.primary,
  textDecoration: "none",
  fontWeight: "600",
};

export default NiraLogin;