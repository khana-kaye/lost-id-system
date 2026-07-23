
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../../components/PageLayout";
import { theme } from "../../theme";
import { useAuth } from "../../context/AuthContext";
import BASE_URL from "../../api";

function UdlsProfilePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [staff, setStaff]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.username) {
        setError("No staff member is currently logged in.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `${BASE_URL}/udls/${encodeURIComponent(user.username)}/`
        );

        if (!res.ok) {
          const data = await res.json().catch(() => null);
          const msg  = data?.message || data?.detail || `${res.status} ${res.statusText}`;
          throw new Error(msg || "Failed to load UDLS staff profile.");
        }

        const data = await res.json();

        setStaff({
          username:  data.username  || user.username,
          staffId:   data.staff_id  || "—",
          email:     data.email     || "Not provided",
          staffRole: data.staff_role || "Staff",
          status:    data.status    || "Active",
          lastLogin: data.last_login
            ? new Date(data.last_login).toLocaleString("en-GB", {
                year:   "numeric",
                month:  "long",
                day:    "numeric",
                hour:   "2-digit",
                minute: "2-digit",
              })
            : "Not available",
          dateJoined: data.joined
            ? new Date(data.joined).toLocaleDateString("en-GB", {
                year:  "numeric",
                month: "long",
                day:   "numeric",
              })
            : "Unknown",
        });
      } catch (err) {
        console.error("UDLS profile fetch error:", err);
        setError(
          err.message ||
            "Unable to load profile. Check that the backend is running."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  /* ── loading ─────────────────────────────────── */
  if (loading) {
    return (
      <PageLayout>
        <div style={pageWrapper}>
          <div style={loadingBox}>
            <div style={spinner} />
            <p style={{ color: "#6b7280", marginTop: "14px" }}>
              Loading profile…
            </p>
          </div>
        </div>
      </PageLayout>
    );
  }

  /* ── error ───────────────────────────────────── */
  if (error || !staff) {
    return (
      <PageLayout>
        <div style={pageWrapper}>
          <div style={header}>
            <div>
              <h1 style={title}>🪪 Staff Profile</h1>
              <p style={subtitle}>{error || "No staff information available."}</p>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  /* ── initials avatar ─────────────────────────── */
  const initials = staff.username
    .split(/[\s_]+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <PageLayout>
      <div style={pageWrapper}>

        {/* ── header ──────────────────────────────── */}
        <div style={header}>
          <div>
            <h1 style={title}>🪪 Staff Profile</h1>
            <p style={subtitle}>
              Your UDLS account information and identity details.
            </p>
          </div>
        </div>

        {/* ── identity card ───────────────────────── */}
        <div style={profileCard}>
          <div style={avatar}>{initials}</div>
          <div style={{ flex: 1 }}>
            <div style={staffName}>{staff.username}</div>
            <div style={staffMeta}>Staff ID: {staff.staffId}</div>
            <div style={badgeRow}>
              <span style={statusBadge}>{staff.status}</span>
              <span style={roleBadge}>{staff.staffRole}</span>
            </div>
          </div>
        </div>

        {/* ── detail grid ─────────────────────────── */}
        <div style={grid}>

          {/* Account Details */}
          <div style={card}>
            <div style={cardHeader}>Account Details</div>
            <div style={cardBody}>
              <InfoRow label="Username"   value={staff.username}  />
              <InfoRow label="Staff ID"   value={staff.staffId}   />
              <InfoRow label="Staff Role" value={staff.staffRole} />
              <InfoRow label="Status"     value={staff.status}    />
            </div>
          </div>

          {/* Contact & Access */}
          <div style={card}>
            <div style={cardHeader}>Contact & Access</div>
            <div style={cardBody}>
              <InfoRow label="Email"       value={staff.email}      />
              <InfoRow label="Last Login"  value={staff.lastLogin}  />
              <InfoRow label="Date Joined" value={staff.dateJoined} />
            </div>
          </div>

        </div>
      </div>
    </PageLayout>
  );
}

/* ── InfoRow ─────────────────────────────────────── */
function InfoRow({ label, value }) {
  return (
    <div style={infoRow}>
      <div style={infoLabel}>{label}</div>
      <div style={infoValue}>{value}</div>
    </div>
  );
}

/* ── styles ──────────────────────────────────────── */
const pageWrapper = {
  maxWidth: "1100px",
  margin: "0 auto",
  padding: "24px",
};

const loadingBox = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  paddingTop: "80px",
};

const spinner = {
  width: "40px",
  height: "40px",
  border: `4px solid ${theme.primary}33`,
  borderTop: `4px solid ${theme.primary}`,
  borderRadius: "50%",
  animation: "spin 0.8s linear infinite",
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "24px",
  gap: "12px",
  flexWrap: "wrap",
};

const title = {
  margin: 0,
  fontSize: "30px",
  color: theme.dark,
};

const subtitle = {
  marginTop: "6px",
  color: "#6b7280",
  fontSize: "14px",
};

const backBtn = {
  padding: "12px 20px",
  borderRadius: "12px",
  border: "none",
  background: theme.primary,
  color: "#fff",
  cursor: "pointer",
  fontWeight: "700",
  fontSize: "14px",
};

const profileCard = {
  background: theme.card,
  borderRadius: "22px",
  padding: "28px",
  display: "flex",
  gap: "20px",
  alignItems: "center",
  boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
  marginBottom: "24px",
  flexWrap: "wrap",
};

const avatar = {
  width: "88px",
  height: "88px",
  borderRadius: "50%",
  background: theme.primary + "22",
  color: theme.primary,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "26px",
  fontWeight: "800",
  flexShrink: 0,
};

const staffName = {
  fontSize: "26px",
  fontWeight: "700",
  color: theme.dark,
};

const staffMeta = {
  marginTop: "5px",
  color: "#6b7280",
  fontSize: "14px",
};

const badgeRow = {
  display: "flex",
  gap: "10px",
  marginTop: "12px",
  flexWrap: "wrap",
};

const statusBadge = {
  background: "#e8f5e9",
  color: "#2e7d32",
  padding: "5px 12px",
  borderRadius: "999px",
  fontSize: "12px",
  fontWeight: "700",
};

const roleBadge = {
  background: "#e3f2fd",
  color: "#1565c0",
  padding: "5px 12px",
  borderRadius: "999px",
  fontSize: "12px",
  fontWeight: "700",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: "18px",
};

const card = {
  background: theme.card,
  borderRadius: "20px",
  overflow: "hidden",
  boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
};

const cardHeader = {
  padding: "16px 20px",
  borderBottom: "1px solid rgba(0,0,0,0.06)",
  fontSize: "15px",
  fontWeight: "700",
  color: theme.dark,
};

const cardBody = {
  padding: "20px",
};

const infoRow = {
  marginBottom: "18px",
};

const infoLabel = {
  fontSize: "12px",
  color: "#6b7280",
  marginBottom: "3px",
};

const infoValue = {
  fontSize: "14px",
  fontWeight: "600",
  color: theme.dark,
};

/* inject spinner keyframes once */
if (typeof document !== "undefined") {
  const styleId = "udls-spinner-style";
  if (!document.getElementById(styleId)) {
    const s = document.createElement("style");
    s.id = styleId;
    s.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`;
    document.head.appendChild(s);
  }
}

export default UdlsProfilePage;



