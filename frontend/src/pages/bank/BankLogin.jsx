import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import PageLayout from "../../components/PageLayout";
import { theme } from "../../theme";
import BASE_URL from "../../api";

function BankLogin() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [staffId, setStaffId] = useState("");
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!username || !password) {
      alert("All fields required");
      return;
    }

    // setLoading(true);
    // setError("");


     try {
      const res = await fetch(`${BASE_URL}/bank/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password: password,
        }),
      });

      const text = await res.text();

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        console.log("Not JSON response:", text);
        throw new Error("Backend returned HTML instead of JSON (check URL)");
      }

      console.log(data);

      if (res.ok) {
        localStorage.setItem("staff_id", data.staff_id);
        localStorage.setItem("username", data.username);
        localStorage.setItem("bank_name", data.bank_name);
        alert("Bank login successful");
        navigate("/bank/dashboard");
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
        <h2 style={titleStyle}>Bank Staff Login</h2>
        <p style={subtitleStyle}>Access your bank portal</p>

        <input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} style={inputStyle} />
        <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} />

        <button onClick={handleLogin} style={btnStyle}>
          Login
        </button>

        <p style={footerText}>
          No account? <Link to="/bank/signup" style={linkStyle}>Sign up</Link>
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
  boxShadow: "0 15px 35px rgba(0,0,0,0.2)",
};

const titleStyle = {
  fontSize: "28px",
  fontWeight: "800",
  color: theme.dark,
};

const subtitleStyle = {
  marginBottom: "20px",
  color: theme.muted,
};

const inputStyle = {
  width: "100%",
  padding: "14px",
  marginBottom: "12px",
  borderRadius: "12px",
  border: `1px solid ${theme.inputBorder}`,
};

const btnStyle = {
  width: "100%",
  padding: "14px",
  background: theme.primary,
  color: "white",
  border: "none",
  borderRadius: "12px",
  fontWeight: "bold",
};

const footerText = {
  marginTop: "15px",
  color: theme.muted,
  fontSize: "14px",
};

const linkStyle = {
  color: theme.primary,
  textDecoration: "none",
  fontWeight: "bold",
};

export default BankLogin;