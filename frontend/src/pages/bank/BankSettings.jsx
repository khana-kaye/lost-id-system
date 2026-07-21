import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../../components/PageLayout";
import { theme } from "../../theme";
import BASE_URL from "../../api";
// import { useAuth } from "../../context/AuthContext";

function BankSettings({ embedded }) {
  const navigate = useNavigate();
  // const { } = useAuth();

  //  profile settings 
  const [username, setUsername] = useState("");
  const [staffId, setStaffId] = useState("");
  const [bankName, setBankName] = useState("");
  const [branch, setBranch] = useState("");
  const [password, setPassword] = useState("");





  //const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  // const [setLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


   //  LOAD USER SETTINGS 
  useEffect(() => {
    fetchSettings();
  }, []);



  const fetchSettings = async () => {
  try {
    setLoading(true);
    setError("");

    const storedStaffId = localStorage.getItem("staff_id");

    if (!storedStaffId) {
      throw new Error("No staff ID found.");
    }

    const res = await fetch(
      `${BASE_URL}/bank/settings/?staff_id=${storedStaffId}`
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Failed to load settings");
    }

    setUsername(data.username || "");
    setStaffId(data.staff_id || "");
    setBankName(data.bank_name || "");
    setBranch(data.branch || "");

  } catch (err) {
    console.error(err);
    setError(err.message);
  } finally {
    setLoading(false);
  }
};


  
  
//   const fetchSettings = async () => {
//   try {
//     setLoading(true);
//     setError("");

    

//     const res = await fetch(`${BASE_URL}/bank/settings/`);

//     if (!res.ok) throw new Error("Failed to load settings");

//     const data = await res.json();

//     // safer mapping (handles different backend formats)
//     setFullName(data.username ?? data.fullName ?? "");
//     setEmail(data.email ?? "");
//     setStaffId(data.staff_id ?? data.staffId ?? "");

//   } catch (err) {
//     console.error(err);
//     setError("Failed to load settings data.");
//   } finally {
//     setLoading(false);
//   }
// };



  //  SAVE SETTINGS 
  const handleSave = async () => {
  try {
    setMessage("");

    const res = await fetch(`${BASE_URL}/bank/settings/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        username,
        staff_id: staffId,
        bank_name: bankName,
        branch,
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

  const content = (
    <div style={pageWrapper}>

        {/*  header  */}
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
           {loading && (
            <p style={{ margin: "10px 20px", color: "#6b7280" }}>
              Loading...
            </p>
          )}

        

       <div style={cardBody}>

  <div style={field}>
    <label style={label}>Full Name</label>
    <input
      type="text"
      value={username}
      onChange={(e) => setUsername(e.target.value)}
      style={input}
    />
  </div>

  <div style={field}>
    <label style={label}>Bank Name</label>
    <input
      type="email"
      value={bankName}
      onChange={(e) => setBankName(e.target.value)}
      style={input}
    />
  </div>

  <div style={field}>
    <label style={label}>Branch</label>

    <input
        type="text"
        value={branch}
        onChange={(e) => setBranch(e.target.value)}
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

</div>
        </div>

      </div>
  );

  return embedded ? content : <PageLayout>{content}</PageLayout>;
}

//  styles 

const pageWrapper = {
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "24px",
};

const wrapper = {
  display: "flex",
  height: "100vh",
  background: "#f4f6fa",
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

const panel = {
  background: "white",
  padding: "16px",
  borderRadius: "14px",
  boxShadow: "0 5px 20px rgba(0,0,0,0.05)",
  minWidth: 0,
  overflow: "hidden",
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

// const input = {
//   padding: "14px",
//   borderRadius: "12px",
//   border: "1px solid #d1d5db",
//   fontSize: "14px",
// };


const input = {
  width: "100%",
  boxSizing: "border-box",
  padding: "14px",
  borderRadius: "12px",
  border: "1px solid #d1d5db",
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

const main = {
  flex: 1,
  minWidth: 0, // <-- stops it from overflowing past the sidebar
  padding: "20px",
  overflowX: "hidden",
};

export default BankSettings;