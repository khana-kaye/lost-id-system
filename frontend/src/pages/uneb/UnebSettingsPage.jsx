import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../../components/PageLayout";
import { theme } from "../../theme";

// ── mock officer profile ───────────────────────────────────────────────────
const INITIAL_PROFILE = {
  fullName:    "Namukasa Grace",
  email:       "g.namukasa@uneb.ac.ug",
  phone:       "+256 772 123 456",
  role:        "Senior Verification Officer",
  department:  "Results & Certification",
  district:    "Kampala",
  staffId:     "UNEB/OFF/2021/047",
};

const NOTIFICATIONS = [
  { id: "new_request",  label: "New verification request",      desc: "Notify me when a new student record is submitted for verification." },
  { id: "flagged",      label: "Flagged record alert",           desc: "Notify me when a record is flagged by another officer."            },
  { id: "daily_digest", label: "Daily summary digest",           desc: "Receive a daily email summary of all verification activity."       },
  { id: "system",       label: "System announcements",           desc: "Updates about UNEB portal maintenance or new features."           },
];

const SECTIONS = ["Profile", "Security", "Notifications", "About"];

// ── reusable field row ─────────────────────────────────────────────────────
function Field({ label, value, editable, onChange, type = "text" }) {
  return (
    <div style={{ marginBottom: "18px" }}>
      <label style={fieldLabel}>{label}</label>
      {editable ? (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={fieldInput}
        />
      ) : (
        <div style={fieldStatic}>{value}</div>
      )}
    </div>
  );
}

// ── toggle switch ──────────────────────────────────────────────────────────
function Toggle({ on, onToggle }) {
  return (
    <button
      onClick={onToggle}
      style={{
        width:        "40px",
        height:       "22px",
        borderRadius: "999px",
        border:       "none",
        cursor:       "pointer",
        position:     "relative",
        background:   on ? theme.primary : "#d1d5db",
        transition:   "background 0.2s",
        flexShrink:   0,
      }}
    >
      <span style={{
        position:    "absolute",
        top:         "3px",
        left:        on ? "20px" : "3px",
        width:       "16px",
        height:      "16px",
        borderRadius: "50%",
        background:  "#fff",
        transition:  "left 0.2s",
      }} />
    </button>
  );
}

// ── main page ──────────────────────────────────────────────────────────────
function UnebSettingsPage() {
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState("Profile");
  const [profile,       setProfile]       = useState(INITIAL_PROFILE);
  const [editMode,      setEditMode]       = useState(false);
  const [savedProfile,  setSavedProfile]  = useState(INITIAL_PROFILE);
  const [profileMsg,    setProfileMsg]    = useState(null);

  const [currentPw,  setCurrentPw]  = useState("");
  const [newPw,      setNewPw]      = useState("");
  const [confirmPw,  setConfirmPw]  = useState("");
  const [pwMsg,      setPwMsg]      = useState(null);
  const [showPw,     setShowPw]     = useState(false);

  const [notifs, setNotifs] = useState(
    Object.fromEntries(NOTIFICATIONS.map((n) => [n.id, true]))
  );
  const [notifMsg, setNotifMsg] = useState(null);

  // ── profile handlers ────────────────────────────────────────────────────
  const handleProfileSave = () => {
    setSavedProfile(profile);
    setEditMode(false);
    setProfileMsg({ type: "success", text: "Profile updated successfully." });
    setTimeout(() => setProfileMsg(null), 3000);
  };

  const handleProfileCancel = () => {
    setProfile(savedProfile);
    setEditMode(false);
    setProfileMsg(null);
  };

  // ── password handler ────────────────────────────────────────────────────
  const handlePasswordSave = () => {
    if (!currentPw) {
      setPwMsg({ type: "error", text: "Please enter your current password." });
      return;
    }
    if (newPw.length < 8) {
      setPwMsg({ type: "error", text: "New password must be at least 8 characters." });
      return;
    }
    if (newPw !== confirmPw) {
      setPwMsg({ type: "error", text: "New passwords do not match." });
      return;
    }
    setCurrentPw(""); setNewPw(""); setConfirmPw("");
    setPwMsg({ type: "success", text: "Password changed successfully." });
    setTimeout(() => setPwMsg(null), 3000);
  };

  // ── notif handler ───────────────────────────────────────────────────────
  const handleNotifSave = () => {
    setNotifMsg({ type: "success", text: "Notification preferences saved." });
    setTimeout(() => setNotifMsg(null), 3000);
  };

  // ── shared alert banner ─────────────────────────────────────────────────
  const Alert = ({ msg }) =>
    msg ? (
      <div style={{
        padding:      "10px 14px",
        borderRadius: "10px",
        fontSize:     "13px",
        fontWeight:   "600",
        marginBottom: "16px",
        background:   msg.type === "success" ? "#eaf3de" : "#fcebeb",
        color:        msg.type === "success" ? "#3b6d11"  : "#a32d2d",
      }}>
        {msg.type === "success" ? "✓" : "✕"} &nbsp; {msg.text}
      </div>
    ) : null;

  return (
    <PageLayout>
      <div style={wrapper}>

        {/* ── sidebar ── */}
        <aside style={sidebar}>
          <div style={sidebarTop}>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <div style={orgIcon}>🎓</div>
              <div>
                <div style={{ fontSize: "13px", fontWeight: "700", color: theme.dark }}>
                  UNEB Portal
                </div>
                <div style={{ fontSize: "11px", color: "#6b7280" }}>
                  Examination Verification
                </div>
              </div>
            </div>
          </div>

          <nav style={navArea}>
            {[
              { label: "Dashboard",      emoji: "⊞", route: "/uneb/dashboard" },
              { label: "Verify Results", emoji: "📄", route: "/uneb/verify"   },
              { label: "Audit Log",      emoji: "◷", route: "/uneb/audit"    },
              { label: "Settings",       emoji: "⚙", route: "/uneb/settings", active: true },
            ].map((item) => (
              <button
                key={item.route}
                onClick={() => navigate(item.route)}
                style={{
                  display:    "flex",
                  alignItems: "center",
                  gap:        "10px",
                  padding:    "9px 10px",
                  borderRadius: "10px",
                  border:     "none",
                  width:      "100%",
                  textAlign:  "left",
                  cursor:     "pointer",
                  fontSize:   "13px",
                  marginBottom: "2px",
                  fontWeight: item.active ? "600" : "400",
                  background: item.active ? theme.primary : "transparent",
                  color:      item.active ? "#fff"         : "#6b7280",
                }}
              >
                <span style={{ fontSize: "15px", width: "18px", textAlign: "center" }}>
                  {item.emoji}
                </span>
                {item.label}
              </button>
            ))}
          </nav>

          <div style={sidebarFooter}>
            <button style={logoutBtn} onClick={() => navigate("/logout")}>
              ⎋ &nbsp; Logout
            </button>
          </div>
        </aside>

        {/* ── main ── */}
        <main style={mainArea}>

          {/* topbar */}
          <div style={topbar}>
            <div>
              <div style={pageTitle}>Settings</div>
              <div style={pageSub}>Manage your account, security, and preferences.</div>
            </div>
          </div>

          <div style={contentBody}>
            <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: "20px", alignItems: "start" }}>

              {/* ── settings nav ── */}
              <div style={settingsNav}>
                {SECTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => setActiveSection(s)}
                    style={{
                      display:      "flex",
                      alignItems:   "center",
                      gap:          "10px",
                      width:        "100%",
                      padding:      "10px 12px",
                      borderRadius: "10px",
                      border:       "none",
                      background:   activeSection === s ? theme.primary + "15" : "transparent",
                      color:        activeSection === s ? theme.primary          : "#6b7280",
                      fontWeight:   activeSection === s ? "700"                  : "400",
                      fontSize:     "13px",
                      cursor:       "pointer",
                      textAlign:    "left",
                      marginBottom: "2px",
                      borderLeft:   activeSection === s ? `3px solid ${theme.primary}` : "3px solid transparent",
                    }}
                  >
                    <span>
                      {s === "Profile"       && "👤"}
                      {s === "Security"      && "🔒"}
                      {s === "Notifications" && "🔔"}
                      {s === "About"         && "ℹ️"}
                    </span>
                    {s}
                  </button>
                ))}
              </div>

              {/* ── settings content ── */}
              <div style={settingsContent}>

                {/* ── PROFILE ── */}
                {activeSection === "Profile" && (
                  <div>
                    <div style={sectionHead}>
                      <div>
                        <div style={sectionTitle}>Profile Information</div>
                        <div style={sectionSub}>Update your personal details and contact information.</div>
                      </div>
                      {!editMode && (
                        <button style={editBtn} onClick={() => setEditMode(true)}>
                          ✎ &nbsp; Edit
                        </button>
                      )}
                    </div>

                    <Alert msg={profileMsg} />

                    {/* avatar row */}
                    <div style={avatarRow}>
                      <div style={avatar}>
                        {profile.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </div>
                      <div>
                        <div style={{ fontWeight: "700", fontSize: "15px", color: theme.dark }}>
                          {profile.fullName}
                        </div>
                        <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "3px" }}>
                          {profile.role}
                        </div>
                        <div style={{
                          display: "inline-block", marginTop: "6px",
                          fontSize: "10px", fontWeight: "700",
                          padding: "2px 8px", borderRadius: "999px",
                          background: "#eaf3de", color: "#3b6d11",
                        }}>
                          Active
                        </div>
                      </div>
                    </div>

                    <div style={divider} />

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 24px" }}>
                      <Field label="Full Name"   value={profile.fullName}   editable={editMode} onChange={(v) => setProfile({ ...profile, fullName: v })} />
                      <Field label="Staff ID"    value={profile.staffId}    editable={false} />
                      <Field label="Email"       value={profile.email}      editable={editMode} type="email" onChange={(v) => setProfile({ ...profile, email: v })} />
                      <Field label="Phone"       value={profile.phone}      editable={editMode} onChange={(v) => setProfile({ ...profile, phone: v })} />
                      <Field label="Role"        value={profile.role}       editable={false} />
                      <Field label="Department"  value={profile.department}  editable={false} />
                      <Field label="District"    value={profile.district}   editable={false} />
                    </div>

                    {editMode && (
                      <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
                        <button style={saveBtn} onClick={handleProfileSave}>
                          Save Changes
                        </button>
                        <button style={cancelBtn} onClick={handleProfileCancel}>
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* ── SECURITY ── */}
                {activeSection === "Security" && (
                  <div>
                    <div style={sectionHead}>
                      <div>
                        <div style={sectionTitle}>Security</div>
                        <div style={sectionSub}>Change your password to keep your account safe.</div>
                      </div>
                    </div>

                    <Alert msg={pwMsg} />

                    <div style={{ maxWidth: "420px" }}>

                      {/* current password */}
                      <div style={{ marginBottom: "16px" }}>
                        <label style={fieldLabel}>Current Password</label>
                        <div style={{ position: "relative" }}>
                          <input
                            type={showPw ? "text" : "password"}
                            value={currentPw}
                            onChange={(e) => setCurrentPw(e.target.value)}
                            placeholder="Enter current password"
                            style={{ ...fieldInput, paddingRight: "44px" }}
                          />
                          <button
                            onClick={() => setShowPw(!showPw)}
                            style={eyeBtn}
                          >
                            {showPw ? "🙈" : "👁"}
                          </button>
                        </div>
                      </div>

                      {/* new password */}
                      <div style={{ marginBottom: "16px" }}>
                        <label style={fieldLabel}>New Password</label>
                        <input
                          type={showPw ? "text" : "password"}
                          value={newPw}
                          onChange={(e) => setNewPw(e.target.value)}
                          placeholder="At least 8 characters"
                          style={fieldInput}
                        />
                        {/* strength bar */}
                        {newPw && (
                          <div style={{ marginTop: "6px" }}>
                            <div style={{ height: "4px", borderRadius: "999px", background: "#f1f1f1", overflow: "hidden" }}>
                              <div style={{
                                height: "100%",
                                borderRadius: "999px",
                                width:
                                  newPw.length < 6  ? "25%"  :
                                  newPw.length < 8  ? "50%"  :
                                  newPw.length < 12 ? "75%"  : "100%",
                                background:
                                  newPw.length < 6  ? "#e24b4a" :
                                  newPw.length < 8  ? "#ef9f27" :
                                  newPw.length < 12 ? "#639922" : "#3b6d11",
                                transition: "width 0.3s, background 0.3s",
                              }} />
                            </div>
                            <div style={{ fontSize: "11px", color: "#6b7280", marginTop: "4px" }}>
                              Strength:{" "}
                              <span style={{ fontWeight: "600" }}>
                                {newPw.length < 6 ? "Weak" : newPw.length < 8 ? "Fair" : newPw.length < 12 ? "Good" : "Strong"}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* confirm password */}
                      <div style={{ marginBottom: "24px" }}>
                        <label style={fieldLabel}>Confirm New Password</label>
                        <input
                          type={showPw ? "text" : "password"}
                          value={confirmPw}
                          onChange={(e) => setConfirmPw(e.target.value)}
                          placeholder="Re-enter new password"
                          style={{
                            ...fieldInput,
                            borderColor:
                              confirmPw && confirmPw !== newPw
                                ? "#e24b4a"
                                : confirmPw && confirmPw === newPw
                                ? "#639922"
                                : "rgba(0,0,0,0.12)",
                          }}
                        />
                        {confirmPw && confirmPw !== newPw && (
                          <div style={{ fontSize: "11px", color: "#a32d2d", marginTop: "4px" }}>
                            Passwords do not match.
                          </div>
                        )}
                        {confirmPw && confirmPw === newPw && (
                          <div style={{ fontSize: "11px", color: "#3b6d11", marginTop: "4px" }}>
                            ✓ Passwords match.
                          </div>
                        )}
                      </div>

                      <button style={saveBtn} onClick={handlePasswordSave}>
                        Update Password
                      </button>
                    </div>

                    {/* session info */}
                    <div style={{ ...divider, marginTop: "28px" }} />
                    <div style={sectionTitle}>Active Session</div>
                    <div style={{ marginTop: "12px" }}>
                      {[
                        { label: "Logged in as",  value: "Namukasa Grace"         },
                        { label: "Last login",     value: "12 May 2026, 08:02 AM"  },
                        { label: "IP address",     value: "41.210.xxx.xxx"         },
                        { label: "Device",         value: "Chrome on Windows"      },
                      ].map((row) => (
                        <div key={row.label} style={{
                          display:       "flex",
                          justifyContent: "space-between",
                          padding:       "9px 0",
                          borderBottom:  "1px solid rgba(0,0,0,0.06)",
                          fontSize:      "13px",
                        }}>
                          <span style={{ color: "#6b7280" }}>{row.label}</span>
                          <span style={{ color: theme.dark, fontWeight: "600" }}>{row.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── NOTIFICATIONS ── */}
                {activeSection === "Notifications" && (
                  <div>
                    <div style={sectionHead}>
                      <div>
                        <div style={sectionTitle}>Notification Preferences</div>
                        <div style={sectionSub}>Choose what you want to be notified about.</div>
                      </div>
                    </div>

                    <Alert msg={notifMsg} />

                    <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginBottom: "24px" }}>
                      {NOTIFICATIONS.map((n) => (
                        <div key={n.id} style={{
                          display:        "flex",
                          justifyContent: "space-between",
                          alignItems:     "center",
                          gap:            "16px",
                          padding:        "14px 16px",
                          borderRadius:   "12px",
                          border:         "1px solid rgba(0,0,0,0.07)",
                          background:     notifs[n.id] ? theme.primary + "08" : "#fff",
                          transition:     "background 0.15s",
                        }}>
                          <div>
                            <div style={{ fontSize: "13px", fontWeight: "600", color: theme.dark }}>
                              {n.label}
                            </div>
                            <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "3px" }}>
                              {n.desc}
                            </div>
                          </div>
                          <Toggle
                            on={notifs[n.id]}
                            onToggle={() =>
                              setNotifs((prev) => ({ ...prev, [n.id]: !prev[n.id] }))
                            }
                          />
                        </div>
                      ))}
                    </div>

                    <button style={saveBtn} onClick={handleNotifSave}>
                      Save Preferences
                    </button>
                  </div>
                )}

                {/* ── ABOUT ── */}
                {activeSection === "About" && (
                  <div>
                    <div style={sectionHead}>
                      <div>
                        <div style={sectionTitle}>About This Portal</div>
                        <div style={sectionSub}>System information and version details.</div>
                      </div>
                    </div>

                    <div style={aboutCard}>
                      <div style={{ fontSize: "36px", marginBottom: "12px" }}>🎓</div>
                      <div style={{ fontSize: "18px", fontWeight: "700", color: theme.dark }}>
                        UNEB Verification Portal
                      </div>
                      <div style={{ fontSize: "13px", color: "#6b7280", marginTop: "4px" }}>
                        Uganda National Examinations Board
                      </div>
                    </div>

                    <div style={{ marginTop: "20px" }}>
                      {[
                        { label: "Version",       value: "v1.0.0"                     },
                        { label: "Environment",   value: "Production"                  },
                        { label: "Portal type",   value: "Staff Internal Portal"       },
                        { label: "Managed by",    value: "UNEB IT Department"          },
                        { label: "Contact",       value: "itsupport@uneb.ac.ug"        },
                        { label: "Office",        value: "Plot 35, Martyrs Way, Ntinda, Kampala" },
                        { label: "Hotline",       value: "+256 414 286 822"            },
                      ].map((row) => (
                        <div key={row.label} style={{
                          display:        "flex",
                          justifyContent: "space-between",
                          padding:        "10px 0",
                          borderBottom:   "1px solid rgba(0,0,0,0.06)",
                          fontSize:       "13px",
                        }}>
                          <span style={{ color: "#6b7280" }}>{row.label}</span>
                          <span style={{ color: theme.dark, fontWeight: "600", textAlign: "right" }}>
                            {row.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        </main>
      </div>
    </PageLayout>
  );
}

// ── styles ─────────────────────────────────────────────────────────────────
const wrapper       = { display: "flex", height: "calc(100vh - 80px)", overflow: "hidden", background: "#f4f6fa" };
const sidebar       = { width: "220px", minWidth: "220px", background: theme.card, borderRight: "1px solid rgba(0,0,0,0.07)", display: "flex", flexDirection: "column", overflow: "hidden" };
const sidebarTop    = { padding: "18px", borderBottom: "1px solid rgba(0,0,0,0.07)" };
const orgIcon       = { width: "36px", height: "36px", background: theme.primary, borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", flexShrink: 0 };
const navArea       = { flex: 1, padding: "12px 10px", overflowY: "auto" };
const sidebarFooter = { padding: "14px", borderTop: "1px solid rgba(0,0,0,0.07)" };
const logoutBtn     = { width: "100%", padding: "10px", background: "#fcebeb", color: "#a32d2d", border: "1px solid rgba(163,45,45,0.2)", borderRadius: "10px", cursor: "pointer", fontWeight: "700", fontSize: "13px" };
const mainArea      = { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" };
const topbar        = { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 24px", borderBottom: "1px solid rgba(0,0,0,0.07)", background: theme.card };
const pageTitle     = { fontSize: "16px", fontWeight: "700", color: theme.dark };
const pageSub       = { fontSize: "12px", color: "#6b7280", marginTop: "2px" };
const contentBody   = { flex: 1, overflowY: "auto", padding: "20px 24px" };

const settingsNav = {
  background:   theme.card,
  border:       "1px solid rgba(0,0,0,0.07)",
  borderRadius: "14px",
  padding:      "10px",
  position:     "sticky",
  top:          "0",
};

const settingsContent = {
  background:   theme.card,
  border:       "1px solid rgba(0,0,0,0.07)",
  borderRadius: "14px",
  padding:      "24px",
};

const sectionHead = {
  display:        "flex",
  justifyContent: "space-between",
  alignItems:     "flex-start",
  marginBottom:   "20px",
};

const sectionTitle = { fontSize: "15px", fontWeight: "700", color: theme.dark };
const sectionSub   = { fontSize: "12px", color: "#6b7280", marginTop: "3px" };

const avatarRow = {
  display:     "flex",
  alignItems:  "center",
  gap:         "16px",
  marginBottom: "20px",
};

const avatar = {
  width:          "56px",
  height:         "56px",
  borderRadius:   "50%",
  background:     theme.primary + "22",
  color:          theme.primary,
  display:        "flex",
  alignItems:     "center",
  justifyContent: "center",
  fontSize:       "18px",
  fontWeight:     "700",
  flexShrink:     0,
};

const divider = { borderTop: "1px solid rgba(0,0,0,0.07)", margin: "20px 0" };

const fieldLabel  = { display: "block", fontSize: "11px", fontWeight: "700", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" };
const fieldInput  = { width: "100%", padding: "10px 12px", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.12)", fontSize: "13px", outline: "none", background: "#f9fafb", boxSizing: "border-box" };
const fieldStatic = { padding: "10px 12px", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.06)", fontSize: "13px", background: "#f4f6fa", color: theme.dark };

const editBtn   = { padding: "8px 16px", borderRadius: "10px", border: `1px solid ${theme.primary}`, background: "transparent", color: theme.primary, fontSize: "13px", fontWeight: "700", cursor: "pointer" };
const saveBtn   = { padding: "10px 24px", borderRadius: "10px", border: "none", background: theme.primary, color: "#fff", fontSize: "13px", fontWeight: "700", cursor: "pointer" };
const cancelBtn = { padding: "10px 20px", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.1)", background: "transparent", color: "#6b7280", fontSize: "13px", fontWeight: "600", cursor: "pointer" };

const eyeBtn = {
  position:   "absolute",
  right:      "12px",
  top:        "50%",
  transform:  "translateY(-50%)",
  background: "transparent",
  border:     "none",
  cursor:     "pointer",
  fontSize:   "14px",
};

const aboutCard = {
  background:   "#f9fafb",
  border:       "1px solid rgba(0,0,0,0.07)",
  borderRadius: "14px",
  padding:      "28px",
  textAlign:    "center",
};

export default UnebSettingsPage;