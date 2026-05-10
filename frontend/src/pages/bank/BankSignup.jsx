import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import PageLayout from "../../components/PageLayout";
import { theme } from "../../theme";
import BASE_URL from "../../api";

function BankSignup() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [staffId, setStaffId] = useState("");
  const [bankName, setBankName] = useState("");
  const [branch, setBranch] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = async () => {
    if (!username || !staffId || !bankName || !branch || !password || !confirmPassword) {
      alert("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }


    try {
    const res = await fetch(`${BASE_URL}/bank/signup/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        staff_id: staffId,
        bank_name: bankName,
        branch: branch,
        password: password,
      }),
    });

    const data = await res.json(); // ✅ safe DRF way

    console.log("Signup response:", data);

    if (res.ok) {
      alert(data.message || "Bank account created successfully");
      navigate("/bank/dashboard");
    } else {
      alert(data.message || "Signup failed");
    };

     } catch (error) {
    console.error("Signup error:", error);
    alert("Server error. Try again later.");
  }
};


    

  

//     if (res.ok) {
//       alert("Bank account created successfully");
//       navigate("/bank/dashboard");
//     } else {
//       alert(data.message || "Signup failed");
//     }
//   } catch (error) {
//     console.error(error);
//     alert("Server error. Try again later.");
//   }
// };


  

  return (
    <PageLayout>
      <div style={cardStyle}>
        <h2 style={titleStyle}>Bank Staff Signup</h2>
        <p style={subtitleStyle}>Create your bank staff account</p>

        <input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} style={inputStyle} />
        <input placeholder="Staff ID" value={staffId} onChange={(e) => setStaffId(e.target.value)} style={inputStyle} />
        <input placeholder="Bank Name" value={bankName} onChange={(e) => setBankName(e.target.value)} style={inputStyle} />
        <input placeholder="Branch" value={branch} onChange={(e) => setBranch(e.target.value)} style={inputStyle} />

        <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} />
        <input placeholder="Confirm Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} style={inputStyle} />

        <button onClick={handleSignup} style={btnStyle}>
          Create Account
        </button>

        <p style={footerText}>
          Already have an account? <Link to="/bank/login" style={linkStyle}>Login</Link>
        </p>
      </div>
    </PageLayout>
  );
}

/* SAME UI STYLE SYSTEM (like NIRA) */
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
  outline: "none",
};

const btnStyle = {
  width: "100%",
  padding: "14px",
  background: theme.primary,
  color: "white",
  border: "none",
  borderRadius: "12px",
  fontWeight: "bold",
  cursor: "pointer",
};

const footerText = {
  marginTop: "15px",
  color: theme.muted,
  fontSize: "14px",
};

const linkStyle = {
  color: theme.primary,
  fontWeight: "bold",
  textDecoration: "none",
};

export default BankSignup;