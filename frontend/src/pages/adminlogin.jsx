import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
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
      const success = await login(username, password);

      if (success) {
        navigate("/admin");
      } else {
        setErrorMessage("Invalid credentials. Please try again.");
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

      <input
        placeholder="Password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        style={input}
      />

      {errorMessage && <p style={errorText}>{errorMessage}</p>}

      <button onClick={handleLogin} style={button} disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>
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

const errorText = {
  color: "red",
  margin: "8px 0",
  fontSize: "14px",
};

export default LoginPage;