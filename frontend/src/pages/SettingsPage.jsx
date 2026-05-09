import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../components/PageLayout";
import { theme } from "../theme";

function SettingsPage() {
  const navigate = useNavigate();

  // ── profile settings ─────────────────────────────────────
  const [fullName, setFullName] = useState("Officer Sarah");
  const [email, setEmail] = useState("sarah@upf.go.ug");

  // ── security settings ───────────────────────────────────
  const [twoFactor, setTwoFactor] = useState(true);

  // ── system settings ─────────────────────────────────────
  const [notifications, setNotifications] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState("30");

  // ── appearance ──────────────────────────────────────────
  const [themeMode, setThemeMode] = useState("light");

  const handleSave = () => {
    alert("Settings saved successfully.");
  };

  return (
    <PageLayout>
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

        {/* ── settings grid ────────────────────────── */}
        <div style={settingsGrid}>

          {/* ── profile section ───────────────────── */}
          <div style={card}>

            <div style={cardHeader}>
              <span style={cardTitle}>
                Officer Profile
              </span>
            </div>

            <div style={cardBody}>

              <div style={field}>
                <label style={label}>
                  Full Name
                </label>

                <input
                  type="text"
                  value={fullName}
                  onChange={(e) =>
                    setFullName(e.target.value)
                  }
                  style={input}
                />
              </div>

              <div style={field}>
                <label style={label}>
                  Official Email
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  style={input}
                />
              </div>

            </div>
          </div>

          {/* ── security section ───────────────────── */}
          <div style={card}>

            <div style={cardHeader}>
              <span style={cardTitle}>
                Security
              </span>
            </div>

            <div style={cardBody}>

              <div style={toggleRow}>
                <div>
                  <div style={toggleTitle}>
                    Two-Factor Authentication
                  </div>

                  <div style={toggleDesc}>
                    Add extra login security for officers.
                  </div>
                </div>

                <input
                  type="checkbox"
                  checked={twoFactor}
                  onChange={() =>
                    setTwoFactor(!twoFactor)
                  }
                />
              </div>

              <button style={secondaryBtn}>
                Change Password
              </button>

            </div>
          </div>

          {/* ── notifications ─────────────────────── */}
          <div style={card}>

            <div style={cardHeader}>
              <span style={cardTitle}>
                Notifications
              </span>
            </div>

            <div style={cardBody}>

              <div style={toggleRow}>
                <div>
                  <div style={toggleTitle}>
                    Email Notifications
                  </div>

                  <div style={toggleDesc}>
                    Receive alerts for flagged IDs and reports.
                  </div>
                </div>

                <input
                  type="checkbox"
                  checked={notifications}
                  onChange={() =>
                    setNotifications(!notifications)
                  }
                />
              </div>

            </div>
          </div>

          {/* ── session settings ──────────────────── */}
          <div style={card}>

            <div style={cardHeader}>
              <span style={cardTitle}>
                Session Settings
              </span>
            </div>

            <div style={cardBody}>

              <div style={field}>
                <label style={label}>
                  Auto Logout Timeout
                </label>

                <select
                  value={sessionTimeout}
                  onChange={(e) =>
                    setSessionTimeout(e.target.value)
                  }
                  style={input}
                >
                  <option value="15">
                    15 Minutes
                  </option>

                  <option value="30">
                    30 Minutes
                  </option>

                  <option value="60">
                    1 Hour
                  </option>
                </select>
              </div>

            </div>
          </div>

          {/* ── appearance ────────────────────────── */}
          <div style={card}>

            <div style={cardHeader}>
              <span style={cardTitle}>
                Appearance
              </span>
            </div>

            <div style={cardBody}>

              <div style={field}>
                <label style={label}>
                  Theme Mode
                </label>

                <select
                  value={themeMode}
                  onChange={(e) =>
                    setThemeMode(e.target.value)
                  }
                  style={input}
                >
                  <option value="light">
                    Light
                  </option>

                  <option value="dark">
                    Dark
                  </option>
                </select>
              </div>

            </div>
          </div>

        </div>

        {/* ── save button ─────────────────────────── */}
        <div style={saveArea}>
          <button
            style={saveBtn}
            onClick={handleSave}
          >
            Save Settings
          </button>
        </div>

      </div>
    </PageLayout>
  );
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

const settingsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
  gap: "18px",
};

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

const toggleRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "16px",
  marginBottom: "18px",
};

const toggleTitle = {
  fontSize: "14px",
  fontWeight: "600",
  color: theme.dark,
};

const toggleDesc = {
  marginTop: "4px",
  fontSize: "12px",
  color: "#6b7280",
  maxWidth: "260px",
};

const secondaryBtn = {
  padding: "12px 16px",
  borderRadius: "12px",
  border: "1px solid rgba(0,0,0,0.1)",
  background: "#fff",
  cursor: "pointer",
  fontWeight: "600",
};

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

export default SettingsPage;