import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import BASE_URL from "../api";

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
  const navigate = useNavigate();

  const handleSignup = async () => {
    if (!username || !password || !confirmPassword || !badgeId) {
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
          rank,
          station,
        }),
      });

      const data = await res.json().catch(() => null);
      if (res.ok) {
        setSuccessMessage(data?.message || "Officer account created successfully.");
        setUsername("");
        setPassword("");
        setConfirmPassword("");
        setBadgeId("");
        setStation("");
        setTimeout(() => navigate("/login"), 1500);
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
    <div style={container}>
      <h2>Police Officer Signup</h2>
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
  );
}

const container = {
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  padding: "24px",
};

const subtitle = {
  marginBottom: "18px",
  color: "#555",
  maxWidth: "320px",
  textAlign: "center",
};

const input = {
  padding: "10px",
  margin: "6px 0",
  width: "260px",
  fontSize: "14px",
};

const button = {
  padding: "10px 20px",
  marginTop: "12px",
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

const successText = {
  color: "green",
  margin: "8px 0",
  fontSize: "14px",
};

const bottomText = {
  marginTop: "14px",
  fontSize: "14px",
  color: "#333",
};

const linkStyle = {
  color: "blue",
  textDecoration: "underline",
  cursor: "pointer",
};

export default AdminSignupPage;
