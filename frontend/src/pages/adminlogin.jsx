import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
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
        navigate("/admin");
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
    <div style={container}>
      <h2>Officer Login</h2>

      <input
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
        style={input}
      />

      <div style={passwordWrapper}>
        <input
          placeholder="Password"
          type={showPassword ? "text" : "password"}
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
        No account? <Link to="/admin/signup" style={signupLink}>Create one here.</Link>
      </p>
    </div>
  );
}

const container = {
  height: "100vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
};

const input = {
  padding: "10px",
  margin: "8px",
  width: "200px",
};

const button = {
  padding: "10px 20px",
  background: "blue",
  color: "white",
  border: "none",
  cursor: "pointer",
};

const passwordWrapper = {
  display: "flex",
  alignItems: "center",
  width: "200px",
};

const eyeButton = {
  marginLeft: "8px",
  padding: "8px 10px",
  border: "1px solid #ccc",
  background: "transparent",
  cursor: "pointer",
  fontSize: "12px",
};

const errorText = {
  color: "red",
  margin: "8px 0",
  fontSize: "14px",
};

const signupText = {
  marginTop: "12px",
  fontSize: "14px",
  color: "#333",
};

const signupLink = {
  color: "blue",
  textDecoration: "underline",
  cursor: "pointer",
};

export default LoginPage;