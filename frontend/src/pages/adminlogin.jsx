import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    const success = await login(username, password);

    if (success) {
      navigate("/admin");
    } else {
      alert("Invalid credentials");
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

      <button onClick={handleLogin} style={button}>
        Login
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
};

export default LoginPage;