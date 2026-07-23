
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../../components/PageLayout";
import { theme } from "../../theme";
import { useAuth } from "../../context/AuthContext";
import BASE_URL from "../../api";

function NiraProfilePage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("USER FROM AUTH:", user)
    console.log("USERNAME BEING USED:", user?.username)
    const fetchProfile = async () => {
      if (!user?.username) {
        setError("No NIRA staff logged in.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${BASE_URL}/nira/${encodeURIComponent(user.username)}/`
        );

        if (!response.ok) {
          const data = await response.json().catch(() => null);
          throw new Error(data?.message || "Failed to load profile");
        }

        const data = await response.json();

        setStaff({
          name: data.username,
          staffId: data.staff_id,
          email: data.email,
          role: data.role || "NIRA Staff",
          joined: data.joined
            ? new Date(data.joined).toLocaleDateString("en-GB", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : "Unknown",
          status: "Active",
        });
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  if (loading) {
    return (
      <PageLayout>
        <div style={pageWrapper}>
          <p>Loading NIRA profile...</p>
        </div>
      </PageLayout>
    );
  }

  if (error || !staff) {
    return (
      <PageLayout>
        <div style={pageWrapper}>
          <h1 style={title}>👤 NIRA Profile</h1>
          <p style={subtitle}>{error || "Profile not found."}</p>
        </div>
      </PageLayout>
    );
  }

  const initials = staff.name
    ? staff.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "";

  return (
    <PageLayout>
      <div style={pageWrapper}>

        {/* HEADER */}
        <div style={header}>
          <div>
            <h1 style={title}>👤 NIRA Profile</h1>
            <p style={subtitle}>
              View NIRA staff identity and account information.
            </p>
          </div>

          
        </div>

        {/* TOP CARD */}
        <div style={profileCard}>
          <div style={avatar}>{initials}</div>

          <div style={{ flex: 1 }}>
            <div style={staffName}>{staff.name}</div>

            <div style={staffMeta}>
              {staff.staffId}
            </div>

            <div style={badgeRow}>
              <span style={statusBadge}>{staff.status}</span>
              <span style={roleBadge}>{staff.role}</span>
            </div>
          </div>
        </div>

        {/* GRID */}
        <div style={grid}>

          {/* PERSONAL INFO */}
          <div style={card}>
            <div style={cardHeader}>Personal Information</div>

            <div style={cardBody}>
              <InfoRow label="Username" value={staff.name} />
              <InfoRow label="Staff ID" value={staff.staffId} />
              <InfoRow label="Official Email" value={staff.email} />
              <InfoRow label="Role" value={staff.role} />
              <InfoRow label="Joined" value={staff.joined} />
            </div>
          </div>

        </div>
      </div>
    </PageLayout>
  );
}

// reusable row
function InfoRow({ label, value }) {
  return (
    <div style={infoRow}>
      <div style={infoLabel}>{label}</div>
      <div style={infoValue}>{value}</div>
    </div>
  );
}

//////////////////// STYLES ////////////////////

const pageWrapper = {
  maxWidth: "1250px",
  margin: "0 auto",
  padding: "24px",
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "24px",
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

const profileCard = {
  background: theme.card,
  borderRadius: "22px",
  padding: "28px",
  display: "flex",
  gap: "20px",
  alignItems: "center",
  boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
  marginBottom: "24px",
};

const avatar = {
  width: "90px",
  height: "90px",
  borderRadius: "50%",
  background: theme.primary + "22",
  color: theme.primary,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "28px",
  fontWeight: "700",
};

const staffName = {
  fontSize: "28px",
  fontWeight: "700",
  color: theme.dark,
};

const staffMeta = {
  marginTop: "6px",
  color: "#6b7280",
};

const badgeRow = {
  display: "flex",
  gap: "10px",
  marginTop: "14px",
};

const statusBadge = {
  background: "#e8f5e9",
  color: "#2e7d32",
  padding: "6px 12px",
  borderRadius: "999px",
  fontSize: "12px",
  fontWeight: "700",
};

const roleBadge = {
  background: "#e3f2fd",
  color: "#1565c0",
  padding: "6px 12px",
  borderRadius: "999px",
  fontSize: "12px",
  fontWeight: "700",
};

const grid = {
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
  fontWeight: "700",
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
};

const infoValue = {
  fontSize: "14px",
  fontWeight: "600",
  color: theme.dark,
};

export default NiraProfilePage;