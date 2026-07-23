import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../../components/PageLayout";
import { theme } from "../../theme";
import BASE_URL from "../../api";
import { useAuth } from "../../context/AuthContext";

function SettingsPage({ embedded }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // ── profile settings ─────────────────────────────────────
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [staffId, setStaffId] = useState("");
  const [password, setPassword] = useState("");

  //const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  // const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


   // ── LOAD USER SETTINGS ─────────────────────────────


   useEffect(() => {
  const fetchSettings = async () => {
    try {
      // setLoading(true);
      setError("");

      const storedStaffId = localStorage.getItem("staff_id");

      if (!storedStaffId) {
        throw new Error("No staff ID found. Please login again.");
      }

      const res = await fetch(`${BASE_URL}/settings/?staff_id=${storedStaffId}`);

      if (!res.ok) throw new Error("Failed to load settings");

      const data = await res.json();

      setFullName(data.username ?? user?.username ?? "");
      setEmail(data.email ?? user?.email ?? "");
      setStaffId(data.staff_id ?? storedStaffId);

    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      // setLoading(false);
    }
  };

  fetchSettings();
}, [user]);



//   useEffect(() => {
//     fetchSettings();
//   }, []);

//   const fetchSettings = async () => {
//   try {
//     setLoading(true);
//     setError("");

//     //  STEP 1: get stored staffId
//     const storedStaffId = localStorage.getItem("staff_id");

//     if (!storedStaffId) {
//       throw new Error("No staff ID found. Please login again.");
//     }

//     //  STEP 2: send it to backend
//     const res = await fetch(`${BASE_URL}/settings/?staff_id=${storedStaffId}`);

//     if (!res.ok) throw new Error("Failed to load settings");

//     const data = await res.json();

//     setFullName(data.username ?? user?.username ?? "");
//     setEmail(data.email ?? user?.email ?? "");
//     setStaffId(data.staff_id ?? storedStaffId);

//   } catch (err) {
//     console.error(err);
//     setError(err.message);
//   } finally {
//     setLoading(false);
//   }
// };




  


  // ── SAVE SETTINGS ─────────────────────────────────
  const handleSave = async () => {
    try {
      setMessage("");
      const res = await fetch(`${BASE_URL}/settings/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          username: fullName,
          email,
          staff_id: localStorage.getItem("staff_id"),
          ...(password ? { password } : {}),
      }),
    });

      const data = await res.json();

      if (!res.ok) {
      throw new Error(data.error || "Update failed");
    }

    setMessage("Settings updated successfully.");
    setPassword("");

  } catch (err) {
    console.error(err);
    setMessage(err.message || "Server error.");
  }
};



const handleLogout = () => {
  const confirmLogout = window.confirm("Are you sure you want to log out?");

  if (!confirmLogout) return;

  logout(); // clears user + localStorage (from AuthContext)

  navigate("/admin/login");
};

  const content = (
    <div style={pageWrapper}>

        {/* ── header ───────────────────────────────── */}
        <div style={header}>
          <div>
            <h1 style={title}>⚙ Settings</h1>

            <p style={subtitle}>
              Manage officer account, security, and system preferences.
            </p>
          </div>

          <button
            style={backBtn}
            onClick={() => navigate("/admin")}
          >
            ← Back
          </button>
        </div>


        {/* CARD */}
        <div style={card}>

          <div style={cardHeader}>
            <span style={cardTitle}>
              Account Information
            </span>
          </div>

          {/* <div style={cardBody}></div> */}

        

       <div style={cardBody}>

  <div style={field}>
    <label style={label}>Full Name</label>
    <input
      type="text"
      value={fullName}
      onChange={(e) => setFullName(e.target.value)}
      style={input}
    />
  </div>

  <div style={field}>
    <label style={label}>Official Email</label>
    <input
      type="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      style={input}
    />
  </div>

  <div style={field}>
    <label style={label}>Staff ID</label>
    <input
      type="text"
      value={staffId}
      onChange={(e) => setStaffId(e.target.value)}
      style={input}
    />
  </div>

  <div style={field}>
    <label style={label}>New Password</label>
    <input
      type="password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      placeholder="Leave blank to keep current password"
      style={input}
    />
  </div>

  {error && (
    <div style={{ ...messageBox, background: "#ffebee", color: "#c62828" }}>
      {error}
    </div>
  )}

  {message && (
    <div style={messageBox}>
      {message}
    </div>
  )}

  <div style={saveArea}>
    <button style={saveBtn} onClick={handleSave}>
      Save Changes
    </button>
  </div>

  <hr style={{ margin: "30px 0" }} />

<div style={dangerZone}>
  <h3 style={dangerTitle}>Security</h3>

  <p style={dangerText}>
    You can securely log out of the Police Portal at any time.
  </p>

  <button style={logoutBtn} onClick={handleLogout}>
    🚪 Log Out
  </button>
</div>

</div>
        </div>

      </div>
  );

  return embedded ? content : <PageLayout>{content}</PageLayout>;
}

// ── styles ─────────────────────────────────────────────────────

const pageWrapper = {
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "24px",
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "28px",
  gap: "12px",
  flexWrap: "wrap",
};

const title = {
  margin: 0,
  fontSize: "32px",
  color: theme.dark,
};

const subtitle = {
  marginTop: "8px",
  color: "#6b7280",
};

const backBtn = {
  padding: "12px 18px",
  borderRadius: "12px",
  border: "none",
  background: theme.primary,
  color: "#fff",
  cursor: "pointer",
  fontWeight: "700",
};

// const settingsGrid = {
//   display: "grid",
//   gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
//   gap: "18px",
// };

const card = {
  background: theme.card,
  borderRadius: "20px",
  overflow: "hidden",
  boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
};

const cardHeader = {
  padding: "18px 20px",
  borderBottom: "1px solid rgba(0,0,0,0.06)",
};

const cardTitle = {
  fontSize: "15px",
  fontWeight: "700",
  color: theme.dark,
};

const cardBody = {
  padding: "20px",
};

const field = {
  display: "flex",
  flexDirection: "column",
  marginBottom: "18px",
};

const label = {
  marginBottom: "8px",
  fontSize: "13px",
  fontWeight: "600",
  color: theme.dark,
};

const input = {
  padding: "14px",
  borderRadius: "12px",
  border: "1px solid #d1d5db",
  fontSize: "14px",
};

// const toggleRow = {
//   display: "flex",
//   justifyContent: "space-between",
//   alignItems: "center",
//   gap: "16px",
//   marginBottom: "18px",
// };

// const toggleTitle = {
//   fontSize: "14px",
//   fontWeight: "600",
//   color: theme.dark,
// };

// const toggleDesc = {
//   marginTop: "4px",
//   fontSize: "12px",
//   color: "#6b7280",
//   maxWidth: "260px",
// };

// const secondaryBtn = {
//   padding: "12px 16px",
//   borderRadius: "12px",
//   border: "1px solid rgba(0,0,0,0.1)",
//   background: "#fff",
//   cursor: "pointer",
//   fontWeight: "600",
// };

const saveArea = {
  marginTop: "30px",
  display: "flex",
  justifyContent: "flex-end",
};

const saveBtn = {
  padding: "14px 22px",
  borderRadius: "14px",
  border: "none",
  background: theme.primary,
  color: "#fff",
  cursor: "pointer",
  fontWeight: "700",
  fontSize: "14px",
};

const messageBox = {
  marginTop: "10px",
  padding: "12px",
  borderRadius: "12px",
  background: "#e8f5e9",
  color: "#2e7d32",
  fontSize: "14px",
  fontWeight: "600",
};


const dangerZone = {
  marginTop: "10px",
  paddingTop: "10px",
};

const dangerTitle = {
  color: "#dc2626",
  marginBottom: "6px",
  fontSize: "16px",
  fontWeight: "700",
};

const dangerText = {
  color: "#6b7280",
  marginBottom: "14px",
  fontSize: "13px",
};

const logoutBtn = {
  padding: "12px 18px",
  borderRadius: "10px",
  border: "none",
  background: "#dc2626",
  color: "#fff",
  cursor: "pointer",
  fontWeight: "700",
};

export default SettingsPage;