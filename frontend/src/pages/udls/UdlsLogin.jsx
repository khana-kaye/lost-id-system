import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import PageLayout from "../../components/PageLayout";
import { theme } from "../../theme";
import BASE_URL from "../../api";
import { useAuth } from "../../context/AuthContext";

function UdlsLogin() {
  const navigate = useNavigate();

  const { setUser } = useAuth();


  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const handleLogin = async () => {
    if (!username || !password) {
      alert("Fill all fields");
      return;
    }


    try {
    const res = await fetch(`${BASE_URL}/udls/login/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });


    const data = await res.json();

    if (res.ok) {
      


      setUser({
        username: data.username,
        staff_id: data.staff_id,
        role: data.role || "officer",
      });

      localStorage.setItem("staff_id", data.staff_id);

      alert("Login successful");
      navigate("/udls/dashboard");
    } else {
      alert(data.message || "Login failed");
    }
  } catch (error) {
    console.error(error);
    alert("Server error");
  }
};

    
  return (
    <PageLayout>
      <div style={cardStyle}>
        <h2 style={titleStyle}>UDLS Login</h2>
        <p style={subtitleStyle}>Sign in to access UDLS portal</p>

        <input placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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
          <Link to="/udls/signup" style={linkStyle}>Signup</Link>
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

export default UdlsLogin;