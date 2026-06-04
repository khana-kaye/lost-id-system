import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import BASE_URL from "../api";
import { useAuth } from "../context/AuthContext";
import PageLayout from "../components/PageLayout";
import { theme } from "../theme";

function AdminSignupPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [badgeId, setBadgeId] = useState("");
  const [rank, setRank] = useState("Officer");
  const [station, setStation] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const handleSignup = async () => {
    if (!username || !password || !confirmPassword || !badgeId || !email) {
      setErrorMessage("Username, password, and badge ID are required.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setErrorMessage("");
    setSuccessMessage("");
    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/create-user/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password,
          badge_id: badgeId,
          email,
          rank,
          station,
        }),
      });

      const data = await res.json().catch(() => null);
      if (res.ok) {
        setSuccessMessage(data?.message || "Officer account created successfully.");

        const loginResult = await login(username, password);
        if (!loginResult.success) {
          register(username, "officer");
        }

        setUsername("");
        setPassword("");
        setConfirmPassword("");
        setBadgeId("");
        setStation("");
        navigate("/admin");
        return;
      } else {
        setErrorMessage(
          data?.message || `Signup failed. Server returned ${res.status}`
        );
      }
    } catch (error) {
      console.error("Signup error:", error);
      setErrorMessage("Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      <div style={container}>
        <div style={card}>
          <h2 style={title}>Officer Signup</h2>
          <p style={subtitle}>Create an officer account with a badge ID and rank.</p>

          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={input}
          />
          <input
            placeholder="Badge ID"
            value={badgeId}
            onChange={(e) => setBadgeId(e.target.value)}
            style={input}
          />
          <input
            placeholder="Official Police Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={input}
          />
          <input
            placeholder="Station"
            value={station}
            onChange={(e) => setStation(e.target.value)}
            style={input}
          />
          <select value={rank} onChange={(e) => setRank(e.target.value)} style={input}>
            <option value="Officer">Officer</option>
            <option value="Sergeant">Sergeant</option>
            <option value="Lieutenant">Lieutenant</option>
            <option value="Captain">Captain</option>
          </select>
          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={input}
          />
          <input
            placeholder="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={input}
          />

          {successMessage && <p style={successText}>{successMessage}</p>}
          {errorMessage && <p style={errorText}>{errorMessage}</p>}

          <button onClick={handleSignup} style={button} disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
          </button>

          <p style={bottomText}>
            Already have an account? <Link to="/login" style={linkStyle}>Login here.</Link>
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
  marginTop: "8px",
  background: theme.primary,
  color: "white",
  border: "none",
  borderRadius: "16px",
  cursor: "pointer",
  fontWeight: "700",
  fontSize: "16px",
  boxShadow: "0 12px 30px rgba(255, 140, 66, 0.25)",
};

const errorText = {
  color: "#dc2626",
  marginBottom: "18px",
  fontSize: "14px",
};

const successText = {
  color: "#16a34a",
  marginBottom: "18px",
  fontSize: "14px",
};

const bottomText = {
  marginTop: "18px",
  fontSize: "14px",
  color: "#6b7280",
};

const linkStyle = {
  color: theme.primary,
  textDecoration: "none",
  fontWeight: "600",
};

export default AdminSignupPage;
