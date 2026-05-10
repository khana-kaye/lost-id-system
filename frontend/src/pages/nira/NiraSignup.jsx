// import { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";

// import PageLayout from "../../components/PageLayout";
// import { theme } from "../../theme";

// function NiraSignup() {
//   const navigate = useNavigate();

//   const [username, setUsername] = useState("");
//   const [staffId, setStaffId] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");

//   const handleSignup = () => {
//     if (!username || !staffId || !password || !confirmPassword) {
//       alert("All fields are required");
//       return;
//     }

//     if (password !== confirmPassword) {
//       alert("Passwords do not match");
//       return;
//     }

//     // backend will come later
//     alert("NIRA account created (backend not connected yet)");
//     navigate("/nira/login");
//   };

//   return (
//     <PageLayout>
//       <div style={cardStyle}>
//         <h2 style={titleStyle}>NIRA Staff Signup</h2>
//         <p style={subtitleStyle}>Create an account to access the dashboard.</p>

        
    

//         <input placeholder="Username" value={username}
//             onChange={(e) => setUsername(e.target.value)} style={inputStyle} />

//         <input placeholder="Staff ID" value={staffId}
//             onChange={(e) => setStaffId(e.target.value)} style={inputStyle} />

//         <input placeholder="Password" type="password" value={password}
//             onChange={(e) => setPassword(e.target.value)} style={inputStyle} />

//         <input placeholder="Confirm Password" type="password" value={confirmPassword}
//             onChange={(e) => setConfirmPassword(e.target.value)} style={inputStyle} />

//         <button onClick={handleSignup} style={btnStyle}>
//             Create Account
//         </button>

//         <p style={footerTextStyle}>
//             Already have an account? <Link to="/nira/login" style={linkStyle} >Login</Link>
//         </p>
//         </div>
//       </PageLayout>  
//   );
// }

// const cardStyle = {
//   background: theme.card,
//   padding: "45px",
//   borderRadius: "30px", // Match Screenshot 2026-05-06 024657.png
//   width: "100%",
//   maxWidth: "420px",
//   boxSizing: "border-box",
//   boxShadow: "0 15px 35px rgba(0,0,0,0.2)",
//   textAlign: "left",
// };

// const titleStyle = {
//   margin: "0 0 10px 0",
//   fontSize: "28px",
//   fontWeight: "800",
//   color: theme.dark,
// };

// const subtitleStyle = {
//   margin: "0 0 30px 0",
//   color: theme.muted,
//   fontSize: "14px",
// };

// const inputStyle = {
//   display: "block",
//   width: "100%",
//   boxSizing: "border-box",
//   marginBottom: "15px",
//   padding: "16px 20px",
//   background: theme.inputBg,
//   border: `1px solid ${theme.inputBorder}`,
//   borderRadius: "15px",
//   fontSize: "15px",
//   outline: "none",
// };

// const btnStyle = {
//   marginTop: "10px",
//   padding: "16px",
//   width: "100%",
//   background: theme.primary,
//   color: "white",
//   border: "none",
//   borderRadius: "15px",
//   fontSize: "16px",
//   fontWeight: "bold",
//   cursor: "pointer",
//   boxShadow: `0 8px 20px rgba(255, 140, 66, 0.35)`,
// };

// const footerTextStyle = {
//   marginTop: "25px",
//   fontSize: "14px",
//   color: theme.muted,
// };

// const linkStyle = {
//   color: theme.primary,
//   textDecoration: "none",
//   fontWeight: "bold",
// };


// export default NiraSignup;




import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import BASE_URL from "../../api";
import { useAuth } from "../../context/AuthContext";
import PageLayout from "../../components/PageLayout";
import { theme } from "../../theme";






function NiraSignup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [staffId, setStaffId] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const handleSignup = async () => {
    if (!username || !password || !confirmPassword || !staffId || !email) {
      setErrorMessage("Username, password, and staff ID are required.");
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
          staff_id: staffId,
          email,
        }),
      });

      const data = await res.json().catch(() => null);
      if (res.ok) {
        setSuccessMessage(data?.message || "NIRA staff account created successfully.");

        const loginResult = await login(username, password);
        if (!loginResult.success) {
          register(username, "nira staff");
        }

        setUsername("");
        setPassword("");
        setConfirmPassword("");
        setStaffId("");
        setEmail("");
        navigate("/admin/forward");
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
          <h2 style={title}>NIRA Staff Signup</h2>
          <p style={subtitle}>Create a NIRA staff account with a staff ID and email.</p>

          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={input}
          />
          <input
            placeholder="Staff ID"
            value={staffId}
            onChange={(e) => setStaffId(e.target.value)}
            style={input}
          />
          <input
            placeholder="NIRA Staff Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={input}
          />
          
          
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

export default NiraSignup;
